import { ParkingLotRate } from "../../../parkingLotRates";
import { ParkingLotRateFirestoreModel } from "./parkingLotRate-firebase-model";

export class PartialParkingLotRateFirestoreModel {
  /**
   * Converts partial rate data to a Firestore document format.
   * @param partialRate - A partial representation of a ParkingLotRate entity containing only the fields that should be updated.
   * @returns A Firestore document data object with fields mapped to Firestore field names.
   */
  static fromPartialEntity(
    partialParkingLotRate: Partial<Record<keyof ParkingLotRate, any>>
  ) {
    return {
      ...partialParkingLotRate,
      toDocumentData(): Partial<Record<string, any>> {
        const res: Partial<Record<string, any>> = {};
        if (partialParkingLotRate.rate !== undefined)
          res[ParkingLotRateFirestoreModel.kRate] = partialParkingLotRate.rate;
        if (partialParkingLotRate.duration !== undefined)
          res[ParkingLotRateFirestoreModel.kDuration] =
            partialParkingLotRate.duration;
        return res;
      },
    };
  }
}
