import { firestore } from "firebase-admin";
import { ParkingSlot } from "../../../parkingSlot";
import DocumentData = firestore.DocumentData;
import FieldValue = firestore.FieldValue;
import Timestamp = firestore.Timestamp;

export class ParkingSlotFirestoreModel extends ParkingSlot {
  static kSlotId = "slotId";
  static klotId = "lotId";
  static kType = "type";
  static kStatus = "status";
  static kPosition = "position";
  static kCreatedAt = "createdAt";

  /**
   * Creates an empty ParkingSlotFirestoreModel instance.
   * @returns {ParkingSlotFirestoreModel} - The created empty ParkingSlotFirestoreModel instance.
   */
  static empty(): ParkingSlotFirestoreModel {
    return new ParkingSlotFirestoreModel(
      "", // slotId
      "", // lotId
      "", // Type
      "", // Status
      { row: "", column: 0 }, // Position
      new Date() // createdAt
    );
  }

  /**
   * Creates a ParkingSlotFirestoreModel instance from a ParkingSlot entity.
   * @param {ParkingSlot} parkingSlot - The ParkingSlot entity from which to create the ParkingSlotFirestoreModel instance.
   * @returns {ParkingSlotFirestoreModel} - The created ParkingSlotFirestoreModel instance.
   */
  static fromEntity(
    parkingSlot?: ParkingSlot
  ): ParkingSlotFirestoreModel | null {
    if (parkingSlot == null) return null;
    return Object.assign(ParkingSlotFirestoreModel.empty(), parkingSlot);
  }

  /**
   * Converts the instance of ParkingSlotFirestoreModel to Firestore document data format.
   * @param {number} slotId - Optional parameter for slotId, use if different from the instance's slotId.
   * @param {Timestamp | FieldValue} createdAt - Optional parameter for createdAt, use Firestore server timestamp or specific Timestamp.
   * @returns {DocumentData} Firestore document data format of the ParkingSlot.
   */
  toDocumentData(
    slotId?: string,
    createdAt?: Timestamp | FieldValue
  ): DocumentData {
    return {
      [ParkingSlotFirestoreModel.kSlotId]: slotId ?? this.slotId,
      [ParkingSlotFirestoreModel.klotId]: this.lotId,
      [ParkingSlotFirestoreModel.kType]: this.type,
      [ParkingSlotFirestoreModel.kStatus]: this.status,
      [ParkingSlotFirestoreModel.kPosition]: this.position,
      [ParkingSlotFirestoreModel.kCreatedAt]: createdAt ?? this.createdAt,
    };
  }

  /**
   * Creates a ParkingSlotFirestoreModel instance from Firestore document data.
   * @param {DocumentData} data - The Firestore document data to convert to a ParkingSlotFirestoreModel instance.
   * @returns {ParkingSlotFirestoreModel} - The created ParkingSlotFirestoreModel instance.
   */
  static fromDocumentData(data: DocumentData): ParkingSlotFirestoreModel {
    return new ParkingSlotFirestoreModel(
      data[ParkingSlotFirestoreModel.kSlotId],
      data[ParkingSlotFirestoreModel.klotId],
      data[ParkingSlotFirestoreModel.kType],
      data[ParkingSlotFirestoreModel.kStatus],
      data[ParkingSlotFirestoreModel.kPosition],
      (data[ParkingSlotFirestoreModel.kCreatedAt] as Timestamp).toDate()
    );
  }
}
