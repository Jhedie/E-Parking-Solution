export type ParkingLotRateType =
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year"
  | null;

export class ParkingLotRate {
  public readonly rateId: string;
  public readonly lotId: string;
  public readonly rateType: ParkingLotRateType;
  public readonly rate: number;
  public readonly duration: number;
  public readonly createdAt: Date;

  constructor(
    rateId: string,
    rateType: ParkingLotRateType,
    rate: number,
    duration: number,
    createdAt: Date
  ) {
    this.rateId = rateId;
    this.rateType = rateType;
    this.rate = rate;
    this.duration = duration;
    this.createdAt = createdAt;
  }

  static empty(): ParkingLotRate {
    return new ParkingLotRate(
      "", // rateId
      null, // rateType
      0, // rate
      0, // duration
      new Date() // createdAt
    );
  }
}
