import { ParkingSlot } from "../../../parkingSlot";
import {
  validateDuplicateSlotPosition,
  validateLotIdExists,
  validatePosition,
} from "./validators";

export class ParkingSlotClientModel extends ParkingSlot {
  static kSlotId = "slotId";
  static kLotId = "lotId";
  static kType = "type";
  static kStatus = "status";
  static kPosition = "position";
  static kCreatedAt = "createdAt"; // Key for createdAt field

  static fromEntity(parkingSlot: ParkingSlot): ParkingSlotClientModel {
    return Object.assign(ParkingSlotClientModel.empty(), parkingSlot);
  }

  static empty(): ParkingSlotClientModel {
    return new ParkingSlotClientModel(
      "", // SlotId
      "", // LotId
      "", // Type
      "", // Status
      { row: "", column: 0 }, // Position
      new Date() // createdAt
    );
  }

  //TODO: Implement validation logic here
  private static _validate(body: any) {
    validateLotIdExists(body);
    validatePosition(body);
    validateDuplicateSlotPosition(body);
  }

  static validate(body: any): ParkingSlotClientModel {
    this._validate(body);
    return new ParkingSlotClientModel(
      null, // SlotId is null as it will be generated by Firestore
      body[this.kLotId],
      body[this.kType],
      body[this.kStatus],
      body[this.kPosition],
      null // createdAt is null as it will be generated by Firestore
    );
  }

  toBodyPublicParkingSlot(): any {
    return {
      [ParkingSlotClientModel.kSlotId]: this.slotId,
      [ParkingSlotClientModel.kLotId]: this.lotId,
      [ParkingSlotClientModel.kType]: this.type,
      [ParkingSlotClientModel.kStatus]: this.status,
      [ParkingSlotClientModel.kPosition]: this.position,
    };
  }

  toBodyFullParkingSlot(): any {
    // Extend public representation with additional details suitable for public viewing
    return {
      ...this.toBodyPublicParkingSlot(),
      [ParkingSlotClientModel.kCreatedAt]: this.createdAt,
    };
  }
}