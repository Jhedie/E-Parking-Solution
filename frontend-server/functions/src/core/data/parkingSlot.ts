export type Position = {
  row: string;
  column: number;
};

export type status = "Occupied" | "Available" | "Reserved";

export type type = "regular" | "handicapped" | "electric";

class ParkingSlot {
  public readonly slotId: string;
  public readonly type: string;
  public readonly status: string;
  public readonly position: Position;
  public readonly createdAt: Date;

  constructor(
    slotId: string | undefined,
    type: string,
    status: string,
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
      "", // Type
      "", // Status
      { row: "", column: 0 }, // Position
      new Date() // createdAt
    );
  }
}

export { ParkingSlot };
