import logging
import asyncio
import json
import random
from typing import Dict, Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/ws",
    tags=["WebSockets Telemetry"]
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, Set[WebSocket]] = {}

    async def connect(self, transaction_id: int, websocket: WebSocket):
        await websocket.accept()
        if transaction_id not in self.active_connections:
            self.active_connections[transaction_id] = set()
        self.active_connections[transaction_id].add(websocket)
        logger.info(f"WebSocket client connected for transaction {transaction_id}")

    def disconnect(self, transaction_id: int, websocket: WebSocket):
        if transaction_id in self.active_connections:
            if websocket in self.active_connections[transaction_id]:
                self.active_connections[transaction_id].remove(websocket)
            if not self.active_connections[transaction_id]:
                del self.active_connections[transaction_id]
        logger.info(f"WebSocket client disconnected for transaction {transaction_id}")

manager = ConnectionManager()

@router.websocket("/charging/{transaction_id}")
async def charging_telemetry(websocket: WebSocket, transaction_id: int):
    await manager.connect(transaction_id, websocket)
    
    # Telemetry simulation initial stats
    soc = 42
    power = 115.4
    energy_delivered = 12.45
    seconds = 380
    
    try:
        while True:
            # Increment and randomize telemetry values to look active and alive
            if soc < 100:
                soc += 1
                energy_delivered = round(energy_delivered + 0.12, 2)
                power = round(power + (random.random() - 0.5) * 2, 1)
            else:
                soc = 100
                power = 0.0
                
            seconds += 1
            
            payload = {
                "transaction_id": transaction_id,
                "soc": soc,
                "power": power,
                "energy_delivered": energy_delivered,
                "seconds": seconds,
                "status": "charging" if soc < 100 else "completed"
            }
            
            await websocket.send_text(json.dumps(payload))
            
            # Wait for 1 second, or listen for any incoming client message frame
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
                msg = json.loads(data)
                if msg.get("command") == "stop":
                    logger.info(f"WebSocket command 'stop' received for transaction {transaction_id}")
                    payload["status"] = "completed"
                    await websocket.send_text(json.dumps(payload))
                    break
            except asyncio.TimeoutError:
                # Normal path - no input received, continue streaming telemetry
                pass
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON message received on WS transaction {transaction_id}")
                
    except WebSocketDisconnect:
        manager.disconnect(transaction_id, websocket)
    except Exception as e:
        logger.error(f"Error on WebSocket transaction {transaction_id}: {e}")
        manager.disconnect(transaction_id, websocket)
