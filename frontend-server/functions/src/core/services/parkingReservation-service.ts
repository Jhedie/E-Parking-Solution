// import * as admin from "firebase-admin";
// import { firestore } from "firebase-admin";
// import { ParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/parkingReservation-firestore-model";
// import { PartialParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/partial-parkingReservation-firestore-model";
// import { ParkingReservation } from "../data/parkingReservation";
// import FieldValue = firestore.FieldValue;

// class ParkingReservationService {
//   private collection() {
//     return admin.firestore().collection("parkingReservations");
//   }

//   private doc(reservationId?: string) {
//     if (!reservationId) return this.collection().doc();
//     return this.collection().doc(reservationId);
//   }

//   async createParkingReservation(
//     reservation: ParkingReservation
//   ): Promise<ParkingReservation> {
//     const reservationRef = this.doc();
//     const documentData = ParkingReservationFirestoreModel.fromEntity(
//       reservation
//     ).toDocumentData(reservationRef.id, FieldValue.serverTimestamp());

//     await reservationRef.set(documentData);

//     // Return the new reservation with its Firestore-generated ID
//     return ParkingReservationFirestoreModel.fromDocumentData(
//       (await reservationRef.get()).data()
//     );
//   }

//   async getParkingReservationById(
//     reservationId: string
//   ): Promise<ParkingReservation | null> {
//     const reservationRes = await this.doc(reservationId).get();
//     if (!reservationRes.exists) {
//       return null;
//     }
//     return ParkingReservationFirestoreModel.fromDocumentData(
//       reservationRes.data()
//     );
//   }

//   async getAllParkingReservations(): Promise<ParkingReservation[]> {
//     const snapshot = await this.collection().get();
//     return snapshot.docs.map((doc) =>
//       ParkingReservationFirestoreModel.fromDocumentData(doc.data())
//     );
//   }

//   async updateParkingReservationById(
//     reservationId: string,
//     partialReservation: Partial<Record<keyof ParkingReservation, any>>
//   ): Promise<void> {
//     const reservationRef = this.doc(reservationId);
//     const documentData =
//       PartialParkingReservationFirestoreModel.fromPartialEntity(
//         partialReservation
//       ).toDocumentData();

//     await reservationRef.update(documentData);
//   }

//   async deleteParkingReservationById(reservationId: string): Promise<void> {
//     await this.doc(reservationId).delete();
//   }

//   async getParkingReservationsByUserId(
//     userId: string
//   ): Promise<ParkingReservation[]> {
//     const snapshot = await this.collection()
//       .where("userId", "==", userId)
//       .get();
//     return snapshot.docs.map((doc) =>
//       ParkingReservationFirestoreModel.fromDocumentData(doc.data())
//     );
//   }
// }

// export const parkingReservationService = new ParkingReservationService();
