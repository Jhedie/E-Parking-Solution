from datetime import datetime
import json

# Define the parameters for generating parking slots
rows = ["A", "B", "C", "D", "E", "F"]
columns = range(1, 7)
types = ["regular", "disabled", "electric"]
statuses = ["Occupied", "Available", "Reserved"]

# Generate parking slots
parking_slots = []
for row in rows:
    for column in columns:
        slot = {
            "type": types[column % len(types) - 1],  # Cycle through the types list
            "lotId": "JaXo7s6NbnAKSO0MsJO0",
            "status": statuses[column % len(statuses) - 1],  # Cycle through the statuses list
            "position": {"row": row, "column": column}
        }
        parking_slots.append(slot)

# Limit to 20 slots if more are generated
parking_slots = parking_slots[:36]

json_data = json.dumps(parking_slots, indent=2)
#store in json file
with open('parkingSlots.json', 'w') as f:
    f.write(json_data)
print(json_data)
