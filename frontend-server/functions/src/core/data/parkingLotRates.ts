export type DynamicPricing = {
  baseRate: number;
  peakRate: number;
  offPeakRate: number;
  peakTimes: string[];
};

export type ParkingLotRateType =
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | null;

export class ParkingLotRate {
  public readonly rateId: string;
  public readonly lotId: string;
  public readonly rateType: ParkingLotRateType;
  public readonly rate: number;
  public readonly nightRate?: number;
  public readonly minimum: number;
  public readonly maximum: number;
  public readonly discount?: number;
  public readonly dynamicPricing?: DynamicPricing;
  public readonly createdAt: Date;

  constructor(
    rateId: string,
    lotId: string,
    rateType: ParkingLotRateType,
    rate: number,
    nightRate: number | undefined,
    minimum: number,
    maximum: number,
    discount: number | undefined,
    dynamicPricing: DynamicPricing | undefined,
    createdAt: Date
  ) {
    this.rateId = rateId;
    this.lotId = lotId;
    this.rateType = rateType;
    this.rate = rate;
    this.nightRate = nightRate;
    this.minimum = minimum;
    this.maximum = maximum;
    this.discount = discount;
    this.dynamicPricing = dynamicPricing;
    this.createdAt = createdAt;
  }

  static empty(): ParkingLotRate {
    return new ParkingLotRate(
      "", // rateId
      "", // lotId
      null, // rateType
      0, // rate
      undefined, // nightRate
      0, // minimum
      0, // maximum
      undefined, // discount
      undefined, // dynamicPricing
      new Date() // createdAt
    );
  }
}
