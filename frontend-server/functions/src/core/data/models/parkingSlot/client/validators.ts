import * as admin from "firebase-admin";

// Checks if a parking slot with the same position already exists in the database
// based on the provided body object, and throws an error if a duplicate is found
export function validateDuplicateSlotPosition(body: any) {
  let lotId = body["lotId"];
  let row = body["position"] ? body["position"]["row"] : undefined;
  let column = body["position"] ? body["position"]["column"] : undefined;

  if (lotId !== undefined && row !== undefined && column !== undefined) {
    admin
      .firestore()
      .collection("parkingSlots")
      .where("lotId", "==", lotId)
      .where("position.row", "==", row)
      .where("position.column", "==", column)
      .select()
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          console.log(
            "Duplicate slot position found",
            querySnapshot.docs[0].data()
          );
          throw new Error("Slot position already exists");
        }
      });
  } else {
    throw new Error("Invalid values for lotId, row, or column");
  }
}

export function validateLotIdExists(body: any) {
  if (!body["lotId"]) {
    throw new Error("lotId is required");
  }
}

export function validatePosition(body: any) {
  if (!body["position"]) {
    throw new Error("position row and column is required");
  }
}

export function validateNoDuplicatePositionsInList(parkingSlots: any[]) {
  const positionMap = new Map();

  for (const slot of parkingSlots) {
    const lotId = slot["lotId"];
    const position = slot["position"];
    if (position && lotId) {
      const row = position["row"];
      const column = position["column"];
      const key = `${lotId}-${row}-${column}`;

      if (positionMap.has(key)) {
        throw new Error(
          `Duplicate slot position found for lotId: ${lotId}, row: ${row}, column: ${column}`
        );
      }

      positionMap.set(key, true);
    } else {
      throw new Error(
        "Invalid values for lotId, row, or column in one of the parking slots"
      );
    }
  }
}
