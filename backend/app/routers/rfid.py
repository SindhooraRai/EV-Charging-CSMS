import logging
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.database import get_db
from app.services.auth_service import AuthService
from app.middleware.auth import get_current_active_user

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/rfid",
    tags=["RFID Hardware & Linking"]
)

# Global memory state representing the ESP32 connection + scan pairing state
# This allows simulation even if no hardware is connected
pairing_state: Dict[str, Any] = {
    "pairing_mode": False,
    "scanned_uid": None,
    "status": "waiting",  # waiting, detected, offline, timeout
    "last_scan_time": None,
    "device_status": "Connected"  # Connected or Offline
}

class StartLinkResponse(BaseModel):
    status: str
    message: str

class SimulateScanRequest(BaseModel):
    uid: Optional[str] = None
    status: str  # detected, offline, timeout
    device_status: Optional[str] = None

class LinkRequest(BaseModel):
    uid: str

class StatusResponse(BaseModel):
    pairing_mode: bool
    uid: Optional[str]
    status: str
    device_status: str
    last_scan_time: Optional[str]

@router.get("/card")
async def get_card_details(
    current_user: Dict[str, Any] = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns user rfid information if registered.
    """
    query = text("SELECT rfid_uid, rfid_linked_since, rfid_status FROM users WHERE id = :id")
    res = await db.execute(query, {"id": current_user["id"]})
    row = res.mappings().first()
    if not row or not row.get("rfid_uid"):
        return {"linked": False}
    
    return {
        "linked": True,
        "uid": row["rfid_uid"],
        "linked_since": row["rfid_linked_since"].strftime("%b %d, %Y") if row["rfid_linked_since"] else None,
        "status": row["rfid_status"] or "Active",
        "holder": current_user["name"]
    }

@router.post("/start-link", response_model=StartLinkResponse)
async def start_link(
    current_user: Dict[str, Any] = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Triggers ESP32 hardware to enter pairing mode.
    """
    logger.info(f"User {current_user['id']} started RFID pairing mode")
    pairing_state["pairing_mode"] = True
    pairing_state["scanned_uid"] = None
    pairing_state["status"] = "waiting"
    pairing_state["last_scan_time"] = None
    
    # Simulate hardware status if it matches the current global mock
    if pairing_state["device_status"] == "Offline":
        pairing_state["status"] = "offline"
        pairing_state["pairing_mode"] = False
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="RFID Reader Offline"
        )
        
    return {
        "status": "success",
        "message": "ESP32 Pairing Mode Active. Waiting for RFID swipe..."
    }

@router.get("/status", response_model=StatusResponse)
async def get_status():
    """
    Poll reader status or get current pairing details.
    """
    return {
        "pairing_mode": pairing_state["pairing_mode"],
        "uid": pairing_state["scanned_uid"],
        "status": pairing_state["status"],
        "device_status": pairing_state["device_status"],
        "last_scan_time": pairing_state["last_scan_time"].strftime("%Y-%m-%d %H:%M:%S") if pairing_state["last_scan_time"] else None
    }

@router.post("/simulate-scan")
async def simulate_scan(data: SimulateScanRequest):
    """
    Testing utility. Simulates hardware swiping, connection loss, or timeouts.
    """
    if data.device_status is not None:
        pairing_state["device_status"] = data.device_status
        if data.device_status == "Offline":
            pairing_state["status"] = "offline"
            pairing_state["pairing_mode"] = False
            return {"message": "Hardware state set to offline"}
            
    if data.status == "offline":
        pairing_state["device_status"] = "Offline"
        pairing_state["status"] = "offline"
        pairing_state["pairing_mode"] = False
    elif data.status == "timeout":
        pairing_state["status"] = "timeout"
        pairing_state["pairing_mode"] = False
    elif data.status == "detected":
        pairing_state["scanned_uid"] = data.uid or "04A2568B"
        pairing_state["status"] = "detected"
        pairing_state["last_scan_time"] = datetime.now()
        pairing_state["pairing_mode"] = False
        pairing_state["device_status"] = "Connected"
    else:
        pairing_state["status"] = data.status
        pairing_state["scanned_uid"] = None
        
    return {"message": f"Simulation set status to {data.status} for UID: {pairing_state['scanned_uid']}"}

@router.post("/link")
async def link_card(
    data: LinkRequest,
    current_user: Dict[str, Any] = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Binds the detected UID coordinate onto the user's account dashboard.
    """
    # 1. Check if card is already linked to ANOTHER user.
    check_query = text("SELECT id, name FROM users WHERE rfid_uid = :uid")
    res = await db.execute(check_query, {"uid": data.uid})
    existing_owner = res.mappings().first()
    
    if existing_owner:
        if existing_owner["id"] == current_user["id"]:
            return {"status": "success", "message": "Card already linked to your account"}
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This RFID card is already linked to another account."
            )
            
    # 2. Update user's profile with the new token
    update_query = text(
        "UPDATE users SET rfid_uid = :uid, rfid_linked_since = :linked_since, rfid_status = 'Active' WHERE id = :id"
    )
    await db.execute(update_query, {
        "uid": data.uid,
        "linked_since": datetime.now(),
        "id": current_user["id"]
    })
    await db.commit()
    
    # Reset pairing state scanner UID
    if pairing_state["scanned_uid"] == data.uid:
        pairing_state["scanned_uid"] = None
        pairing_state["status"] = "waiting"
        
    return {
        "status": "success",
        "message": "RFID Card Linked Successfully"
    }

@router.post("/unlock-lock")
async def lock_unlock_card(
    current_user: Dict[str, Any] = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Toggle lock state of RFID card.
    """
    query = text("SELECT rfid_uid, rfid_status FROM users WHERE id = :id")
    res = await db.execute(query, {"id": current_user["id"]})
    user_card = res.mappings().first()
    if not user_card or not user_card.get("rfid_uid"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No RFID Card linked to this profile"
        )
    
    new_status = "Locked" if user_card["rfid_status"] == "Active" else "Active"
    update_query = text("UPDATE users SET rfid_status = :status WHERE id = :id")
    await db.execute(update_query, {"status": new_status, "id": current_user["id"]})
    await db.commit()
    
    return {
        "status": "success",
        "new_status": new_status
    }
