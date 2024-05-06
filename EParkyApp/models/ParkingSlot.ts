type Position = {
  row: string;
  column: number;
};

type status = "Occupied" | "Available" | "Reserved";

type type = "regular" | "disabled" | "electric";

export interface ParkingSlot {
  slotId: string;
  type: type;
  status: status;
  position: Position;
}
