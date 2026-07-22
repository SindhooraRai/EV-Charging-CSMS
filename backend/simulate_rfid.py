import time
import json
import urllib.request
import urllib.error

API_URL = "http://127.0.0.1:8000/api/v1"

def send_scan(uid, status="detected", device_status="Connected"):
    url = f"{API_URL}/rfid/simulate-scan"
    payload = {
        "uid": uid,
        "status": status,
        "device_status": device_status
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode())
            print(f"\n[SUCCESS] Response from server: {res_data.get('message')}")
    except urllib.error.URLError as e:
        print(f"\n[ERROR] Failed to reach backend: {e.reason}")
        print("Make sure your FastAPI server is running at http://127.0.0.1:8000")

def main():
    print("=" * 60)
    print("           VoltGrid RFID Hardware Terminal Simulator")
    print("=" * 60)
    print(" This script mimics the behavior of a physical ESP32 reader node.")
    print(" You can use it to transmit card swipes to your local CSMS backend.")
    print("=" * 60)
    
    while True:
        print("\nAvailable Options:")
        print("  1. Simulate Valid Tag Swipe (e.g. Card detection)")
        print("  2. Simulate Card Already Linked (Conflict check)")
        print("  3. Simulate Hardware Go Offline")
        print("  4. Simulate Hardware Go Online / Clear State")
        print("  5. Exit")
        
        choice = input("\nSelect choice (1-5): ").strip()
        
        if choice == "1":
            uid = input("Enter custom RFID Card UID (default: 04A2568B): ").strip()
            if not uid:
                uid = "04A2568B"
            print(f"Transmitting Swipe Event: UID={uid}...")
            send_scan(uid, status="detected", device_status="Connected")
            
        elif choice == "2":
            uid = input("Enter card UID (default: 99B877CC): ").strip()
            if not uid:
                uid = "99B877CC"
            print(f"Transmitting Conflict Event: UID={uid}...")
            send_scan(uid, status="already_linked", device_status="Connected")
            
        elif choice == "3":
            print("Transmitting Hardware status -> Offline...")
            send_scan(uid=None, status="offline", device_status="Offline")
            
        elif choice == "4":
            print("Transmitting Hardware status -> Connected (Online)...")
            send_scan(uid=None, status="waiting", device_status="Connected")
            
        elif choice == "5":
            print("Exiting simulator. Safe charging!")
            break
        else:
            print("Invalid selection. Please try again.")

if __name__ == "__main__":
    main()
