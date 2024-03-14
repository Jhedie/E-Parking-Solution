import * as admin from "firebase-admin";

// Checks if a parking slot with the same position already exists in the database
// based on the provided body object, and throws an error if a duplicate is found
export function validateDuplicateSlotPosition(body: any) {
  const lotId = body["lotId"];
  const row = body["position"] ? body["position"]["row"] : undefined;
  const column = body["position"] ? body["position"]["column"] : undefined;

  if (lotId !== undefined && row !== undefined && column !== undefined) {
    admin
      .firestore()
      .collection("parkingSlots")
      .where("lotId", "==", lotId)
      .where("position.row", "==", row)
      .where("position.column", "==", column)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
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
