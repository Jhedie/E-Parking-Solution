export type Position = {
  row: string;
  column: number;
};

export type status = "Occupied" | "Available" | "Reserved";

export type type = "regular" | "handicapped" | "electric" | string;

class ParkingSlot {
  public readonly slotId: string;
  public readonly type: type;
  public readonly status: status;
  public readonly position: Position;
  public readonly createdAt: Date;

  constructor(
    slotId: string | undefined,
    type: type,
    status: status,
    position: Position,
    createdAt: Date
  ) {
    this.slotId = slotId;
    this.type = type;
    this.status = status;
    this.position = position;
    this.createdAt = createdAt;
  }

  static empty() {
    return new ParkingSlot(
      undefined, // slotId
      "regular", // Type
      "Available", // Status
      { row: "", column: 0 }, // Position
      new Date() // createdAt
    );
  }
}

export { ParkingSlot };
