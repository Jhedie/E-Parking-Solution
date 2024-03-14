import { ParkingSlot } from "../../../parkingSlot";
import { ParkingSlotFirestoreModel } from "./parkingSlot-firestore-model";

export class PartialParkingSlotFirestoreModel {
  /**
   * Takes a partial entity of ParkingSlot and returns an object that can generate Firestore document data.
   * This method assumes that the partial entity might not have all properties of a ParkingSlot.
   * @param {Partial<Record<keyof ParkingSlot, any>>} partialParkingSlot - Partial parking slot data.
   * @returns An object with a toDocumentData method that when called, returns a partial Firestore document data object.
   */
  static fromPartialEntity(
    partialParkingSlot: Partial<Record<keyof ParkingSlot, any>>
  ) {
    return {
      ...partialParkingSlot,
      toDocumentData(): Partial<Record<string, any>> {
        const res: Partial<Record<string, any>> = {};
        if (partialParkingSlot.slotId !== undefined)
          res[ParkingSlotFirestoreModel.kSlotId] = partialParkingSlot.slotId;
        if (partialParkingSlot.lotId !== undefined)
          res[ParkingSlotFirestoreModel.klotId] = partialParkingSlot.lotId;
        if (partialParkingSlot.type !== undefined)
          res[ParkingSlotFirestoreModel.kType] = partialParkingSlot.type;
        if (partialParkingSlot.status !== undefined)
          res[ParkingSlotFirestoreModel.kStatus] = partialParkingSlot.status;
        if (partialParkingSlot.position !== undefined) {
          const position = partialParkingSlot.position;
          res[ParkingSlotFirestoreModel.kPosition] = position;
        }
        if (partialParkingSlot.createdAt !== undefined)
          res[ParkingSlotFirestoreModel.kCreatedAt] =
            partialParkingSlot.createdAt;

        return res;
      },
    };
  }
}
