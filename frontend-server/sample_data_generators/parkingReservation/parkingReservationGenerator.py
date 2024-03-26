from datetime import datetime, timedelta
import json
import os

reservations = []
current_time = datetime.now()
statuses = ["active", "completed", "cancelled", "expired", "pending"]

for i in range(10):
    reservation = {
        "SlotID": "1USBYqgeAHZwGVGXX5Gm", # Slot ID from the firebase
        "lotId":"JaXo7s6NbnAKSO0MsJO0",
        "StartTime": (current_time + timedelta(days=i)).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "EndTime": (current_time + timedelta(days=i, hours=3)).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "RateNumber": i + 1,
        "RateType": "hour" if i % 2 == 0 else "day",
        "Price": 10.0 * (i + 1),
        "TotalAmount": 10.0 * (i + 1) * 3,  # Assuming 3 hours for simplicity
        "Status": "pending",
    }
    reservations.append(reservation)



file_path = os.path.join(os.path.dirname(__file__), "parkingReservations.json")

with open(file_path, "w") as file:
    json.dump(reservations, file, indent=2)

