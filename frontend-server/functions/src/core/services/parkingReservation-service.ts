import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { ParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/parkingReservation-firestore-model";
import { PartialParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/partial-parkingReservation-firestore-model";
import { Rate } from "../data/parkingLotFromForm";
import { ParkingReservation } from "../data/parkingReservation";
import FieldValue = firestore.FieldValue;
const sgMail = require("@sendgrid/mail");

class ParkingReservationService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
  private adminEmail: string = process.env.ADMIN_EMAIL;

  //Top level collection
  private parkingReservationsTopLevelCollection() {
    return admin.firestore().collection("parkingReservations");
  }

  private usersCollection() {
    return admin.firestore().collection("parkingOwner");
  }

  private parkingLotsCollection(userId: string) {
    return this.usersCollection().doc(userId).collection("parkingLots");
  }

  private parkingSlotsCollection(userId: string, lotId: string) {
    return this.parkingLotsCollection(userId)
      .doc(lotId)
      .collection("parkingSlots");
  }

  private parkingReservationsCollection(
    userId: string,
    lotId: string,
    slotId: string
  ) {
    return this.parkingSlotsCollection(userId, lotId)
      .doc(slotId)
      .collection("parkingReservations");
  }

  private parkingReservationDoc(
    userId: string,
    lotId: string,
    slotId: string,
    reservationId?: string
  ) {
    return reservationId
      ? this.parkingReservationsCollection(userId, lotId, slotId).doc(
          reservationId
        )
      : this.parkingReservationsCollection(userId, lotId, slotId).doc();
  }

  async createParkingReservation(
    lotId: string,
    slotId: string,
    reservation: ParkingReservation
  ): Promise<ParkingReservation> {
    let ownerId: string = await this.getParkingOwner(lotId);

    const db = admin.firestore();
    return db
      .runTransaction(async (transaction) => {
        const reservationRef = this.parkingReservationDoc(
          ownerId,
          lotId,
          slotId
        );

        const documentData = ParkingReservationFirestoreModel.fromEntity(
          reservation
        ).toDocumentData(FieldValue.serverTimestamp(), reservationRef.id);

        // Use the transaction to set the new reservation
        transaction.set(reservationRef, documentData);

        // Add reservation to top level collection
        const topLevelRef = this.parkingReservationsTopLevelCollection().doc(
          reservationRef.id
        );

        transaction.set(topLevelRef, documentData);

        // Increment parking lot occupancy
        const lotRef = this.parkingLotsCollection(ownerId).doc(lotId);
        transaction.update(lotRef, { Occupancy: FieldValue.increment(1) });

        return documentData;
      })
      .then(async (documentData) => {
        // Return the new reservation with its Firestore-generated ID
        const reservation =
          ParkingReservationFirestoreModel.fromDocumentData(documentData);
        //get the userEmail from id
        const userRef = await admin
          .firestore()
          .collection("users")
          .doc(reservation.userId)
          .get();
        console.log("userRef", userRef);
        const userEmail = userRef.data().email;
        //get parking Lot details
        const parkingLotRef = await this.parkingLotsCollection(ownerId)
          .doc(lotId)
          .get();
        //get the slot details
        const slotRef = await this.parkingSlotsCollection(ownerId, lotId)
          .doc(slotId)
          .get();

        console.log("email details");
        console.log("User Email:", userEmail);
        console.log("Parking Lot Name:", parkingLotRef.data().LotName);
        console.log(
          "Parking Lot Address:",
          parkingLotRef.data().Address.formattedAddress
        );
        console.log(
          "Slot Position:",
          (
            slotRef.data().position.column + slotRef.data().position.row
          ).toString()
        );
        console.log(
          "Reservation Start Time:",
          reservation.startTime.toDateString()
        );
        console.log(
          "Reservation End Time:",
          reservation.endTime.toDateString()
        );
        console.log("Total Amount:", reservation.totalAmount.toString());
        console.log("Reservation ID:", reservation.reservationId);
        console.log("User Display Name:", userRef.data().name);
        console.log("duration:", reservation.usedRates[0].duration.toString());
        //format the duration to be displayed in the email
        const { duration, rateType } = reservation.usedRates[0];
        const formattedDuration = `${duration} ${rateType}${
          duration > 1 ? "s" : ""
        }`;
        await this.sendNewReservationCreatedEmail(
          userEmail,
          parkingLotRef.data().LotName,
          parkingLotRef.data().Address.formattedAddress,
          (
            slotRef.data().position.row + slotRef.data().position.column
          ).toString(),
          reservation.startTime.toDateString(),
          reservation.endTime.toDateString(),
          formattedDuration,
          reservation.totalAmount.toString(),
          reservation.reservationId,
          userRef.data().name
        )
          .then(() => {
            console.log("Email sent successfully");
          })
          .catch((error) => {
            console.error("Error sending email: ", error);
            throw new Error("Failed to send email.");
          });

        return reservation;
      })
      .catch((error) => {
        console.error("Error creating reservation: ", error);
        throw new Error("Failed to create reservation.");
      });
  }

  async extendParkingReservation(
    lotId: string,
    slotId: string,
    reservationId: string,
    extensionStartTime: Date,
    extensionEndTime: Date,
    rate: Rate,
    totalAmount: number
  ): Promise<void> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const db = admin.firestore();

    await db.runTransaction(async (transaction) => {
      const reservationRef = this.parkingReservationDoc(
        ownerId,
        lotId,
        slotId,
        reservationId
      );

      const reservationSnapshot = await transaction.get(reservationRef);

      if (!reservationSnapshot.exists) {
        throw new Error("Reservation does not exist.");
      }

      const reservation = reservationSnapshot.data() as ParkingReservation;
      // Check if the new end time is later than the current end time
      if (extensionEndTime <= reservation.endTime) {
        throw new Error(
          "New end time must be later than the current end time."
        );
      }

      // Optional: Check for conflicting reservations
      const conflictingReservationsQuery = this.parkingReservationsCollection(
        ownerId,
        lotId,
        slotId
      )
        .where("startTime", "<", extensionEndTime)
        .where("endTime", ">", extensionStartTime); // Only check reservations that start after the current end time and before the new end time

      const conflictingReservationsSnapshot = await transaction.get(
        conflictingReservationsQuery
      );
      if (!conflictingReservationsSnapshot.empty) {
        throw new Error(
          "The slot is already booked for part of the requested extension period."
        );
      }

      // Update the reservation with the new end time
      transaction.update(reservationRef, {
        endTime: firestore.Timestamp.fromDate(new Date(extensionEndTime)),
        usedRates: [...reservation.usedRates, rate],
        totalAmount: FieldValue.increment(totalAmount),
        modifiedAt: FieldValue.serverTimestamp(),
        duration: FieldValue.increment(rate.duration),
      });

      //update reservation top level collection
      const topLevelRef =
        this.parkingReservationsTopLevelCollection().doc(reservationId);
      transaction.update(topLevelRef, {
        endTime: firestore.Timestamp.fromDate(new Date(extensionEndTime)),
        usedRates: [...reservation.usedRates, rate],
        totalAmount: FieldValue.increment(totalAmount),
        modifiedAt: FieldValue.serverTimestamp(),
      });
      const userRef = await admin
        .firestore()
        .collection("users")
        .doc(reservation.userId)
        .get();
      //get parking Lot details
      const parkingLotRef = await this.parkingLotsCollection(ownerId)
        .doc(lotId)
        .get();
      //get the slot details
      const slotRef = await this.parkingSlotsCollection(ownerId, lotId)
        .doc(slotId)
        .get();

      //format the duration to be displayed in the email
      const { duration, rateType } = rate;
      const formattedDuration = `${duration} ${rateType}${
        duration > 1 ? "s" : ""
      }`;

      await this.sendReservationUpdatedEmail(
        userRef.data().email,
        parkingLotRef.data().LotName,
        parkingLotRef.data().Address.formattedAddress,
        (
          slotRef.data().position.row + slotRef.data().position.column
        ).toString(),
        extensionStartTime.toDateString(),
        extensionEndTime.toDateString(),
        formattedDuration,
        totalAmount.toString(),
        reservation.reservationId,
        userRef.data().name
      )
        .then(() => {
          console.log("Email sent successfully");
        })
        .catch((error) => {
          console.error("Error sending email: ", error);
          throw new Error("Failed to send email.");
        });
    });
  }

  async getParkingReservationById(
    lotId: string,
    slotId: string,
    reservationId: string
  ): Promise<ParkingReservation | null> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const reservationRes = await this.parkingReservationDoc(
      ownerId,
      lotId,
      slotId,
      reservationId
    ).get();
    if (!reservationRes.exists) {
      return null;
    }
    return ParkingReservationFirestoreModel.fromDocumentData(
      reservationRes.data()
    );
  }

  async getAllParkingReservations(
    lotId: string,
    slotId: string
  ): Promise<ParkingReservation[]> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const snapshot = await this.parkingReservationsCollection(
      ownerId,
      lotId,
      slotId
    ).get();
    return snapshot.docs.map((doc) =>
      ParkingReservationFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async updateParkingReservationById(
    lotId: string,
    slotId: string,
    reservationId: string,
    partialReservation: Partial<Record<keyof ParkingReservation, any>>
  ): Promise<void> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const reservationRef = this.parkingReservationDoc(
      ownerId,
      lotId,
      slotId,
      reservationId
    );
    const documentData =
      PartialParkingReservationFirestoreModel.fromPartialEntity(
        partialReservation
      ).toDocumentData();

    await reservationRef.update(documentData);

    // Update reservation in top level collection
    this.parkingReservationsTopLevelCollection()
      .doc(reservationId)
      .update(documentData);
  }

  async deleteParkingReservationById(
    lotId: string,
    slotId: string,
    reservationId: string
  ): Promise<void> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const reservationRef = this.parkingReservationDoc(
      ownerId,
      lotId,
      slotId,
      reservationId
    );
    await reservationRef.delete();

    // Delete reservation from top level collection
    this.parkingReservationsTopLevelCollection().doc(reservationId).delete();

    // Decrement parking lot occupancy
    await this.decrementParkingLotOccupancy(ownerId, lotId);
  }

  async getParkingReservationsByUserId(
    userId: string
  ): Promise<ParkingReservation[]> {
    const reservations: ParkingReservation[] = [];
    const groupSnapshot = await admin
      .firestore()
      .collectionGroup("parkingReservations")
      .where("userId", "==", userId)
      .orderBy("createdAt", "asc")
      .get();

    groupSnapshot.forEach((doc) => {
      console.log("doc", doc.data());
      reservations.push(
        ParkingReservationFirestoreModel.fromDocumentData(doc.data())
      );
    });
    console.log("reservations", reservations);
    return reservations;
  }

  async cancelParkingReservation(
    lotId: string,
    slotId: string,
    reservationId: string
  ): Promise<void> {
    const ownerId: string = await this.getParkingOwner(lotId);
    const reservationRef = this.parkingReservationDoc(
      ownerId,
      lotId,
      slotId,
      reservationId
    );
    const reservationSnapshot = await reservationRef.get();

    if (!reservationSnapshot.exists) {
      throw new Error("Reservation does not exist.");
    }

    const reservation = reservationSnapshot.data() as ParkingReservation;

    if (reservation.parkingStatus !== "active") {
      throw new Error("Reservation is already cancelled or completed.");
    }

    // Decrement parking lot occupancy
    await this.decrementParkingLotOccupancy(ownerId, lotId);

    //delete from parkingReservationsTopLevelCollection and ParkingSlotsCollection
    await admin
      .firestore()
      .runTransaction(async (transaction) => {
        //delete reservation from  parkingSlotsCollection
        transaction.delete(reservationRef);
        //delete reservation from parkingReservationsTopLevelCollection
        transaction.delete(
          this.parkingReservationsTopLevelCollection().doc(reservationId)
        );
      })
      .then(async () => {
        const userRef = await admin
          .firestore()
          .collection("users")
          .doc(reservation.userId)
          .get();
        const parkingLotRef = await this.parkingLotsCollection(ownerId)
          .doc(lotId)
          .get();
        const slotRef = await this.parkingSlotsCollection(ownerId, lotId)
          .doc(slotId)
          .get();

        //getting the last rate used
        const { duration, rateType } =
          reservation.usedRates[reservation.usedRates.length - 1];
        const formattedDuration = `${duration} ${rateType}${
          duration > 1 ? "s" : ""
        }`;
        await this.sendBookingCancelledEmail(
          userRef.data().email,
          parkingLotRef.data().LotName,
          parkingLotRef.data().Address.formattedAddress,
          (
            slotRef.data().position.row + slotRef.data().position.column
          ).toString(),
          reservation.startTime.toDateString(),
          reservation.endTime.toDateString(),
          formattedDuration,
          reservation.totalAmount.toString(),
          reservation.reservationId,
          userRef.data().name
        )
          .then(() => {
            console.log("Email sent successfully");
          })
          .catch((error) => {
            console.error("Error sending email: ", error);
            throw new Error("Failed to send email.");
          });
      });
  }

  private async getParkingOwner(lotId: string): Promise<string> {
    // Get all users with the role 'parkingOwner'
    const parkingOwnerSnapshot = await admin
      .firestore()
      .collection("parkingOwner")
      .get();

    // Find the user who owns the parking lot
    for (const parkingOwnerDoc of parkingOwnerSnapshot.docs) {
      const parkingLotsSnapshot = await parkingOwnerDoc.ref
        .collection("parkingLots")
        .get();
      for (const parkingLotDoc of parkingLotsSnapshot.docs) {
        if (parkingLotDoc.id === lotId) {
          return parkingOwnerDoc.id;
        }
      }
    }

    throw new Error(
      `Parking lot with ID ${lotId} does not have an identifiable owner.`
    );
  }

  private async decrementParkingLotOccupancy(
    ownerId: string,
    lotId: string
  ): Promise<void> {
    const lotRef = this.parkingLotsCollection(ownerId).doc(lotId);
    await lotRef.update({
      Occupancy: admin.firestore.FieldValue.increment(-1),
    });
  }

  sendNewReservationCreatedEmail = async (
    email: string,
    parkingLotName: string,
    parkingLotAddress: string,
    slot: string,
    startTime: string,
    endTime: string,
    duration: string,
    totalAmount: string,
    reservationId: string,
    first_name: string
  ): Promise<any> => {
    const to: string = email;
    const from: string = this.adminEmail;

    const msg = {
      to,
      from,
      template_id: "d-bc3362cc6b6740188596e0f13b314ab6",
      dynamic_template_data: {
        reservationId: reservationId,
        first_name: first_name,
        parkingLotName: parkingLotName,
        Address: parkingLotAddress,
        parkingSlot: slot,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        totalAmount: totalAmount,
        contactUsLink: `mailto:${this.adminEmail}`,
      },
    };

    return await sgMail.send(msg);
  };

  sendReservationUpdatedEmail = async (
    email: string,
    parkingLotName: string,
    parkingLotAddress: string,
    slot: string,
    startTime: string,
    endTime: string,
    duration: string,
    totalAmount: string,
    reservationId: string,
    first_name: string
  ): Promise<any> => {
    const to: string = email;
    const from: string = this.adminEmail;

    const msg = {
      to,
      from,
      template_id: "d-230d2aac52664dc99c86222f424ca5a7",
      dynamic_template_data: {
        reservationId: reservationId,
        first_name: first_name,
        parkingLotName: parkingLotName,
        Address: parkingLotAddress,
        parkingSlot: slot,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        totalAmount: totalAmount,
        contactUsLink: `mailto:${this.adminEmail}`,
      },
    };

    return await sgMail.send(msg);
  };

  sendBookingCancelledEmail = async (
    email: string,
    parkingLotName: string,
    parkingLotAddress: string,
    slot: string,
    startTime: string,
    endTime: string,
    duration: string,
    totalAmount: string,
    reservationId: string,
    first_name: string
  ) => {};
}

export const parkingReservationService = new ParkingReservationService();
