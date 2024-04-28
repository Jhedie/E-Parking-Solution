import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { ParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/parkingReservation-firestore-model";
import { PartialParkingReservationFirestoreModel } from "../data/models/parkingReservation/firestore/partial-parkingReservation-firestore-model";
import { Rate } from "../data/parkingLotFromForm";
import { ParkingReservation } from "../data/parkingReservation";
import FieldValue = firestore.FieldValue;

class ParkingReservationService {
  private adminEmail: string = process.env.ADMIN_EMAIL;
  private firecmsURL: string = process.env.FIRECMS_URL;

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
          new Date(reservation.startTime).toUTCString()
        );
        console.log(
          "Reservation End Time:",
          new Date(reservation.endTime).toUTCString()
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
        admin
          .firestore()
          .collection("mail")
          .add({
            to: reservation.userEmail,
            message: {
              subject: "Your Parking Reservation Details",
              html: `Hello,<br>Your parking reservation at <strong>${
                parkingLotRef.data().LotName
              }</strong> is confirmed. Here are the details:<br>
              <ul>
                <li><strong>Start Time:</strong> ${new Date(
                  reservation.startTime
                ).toTimeString()}</li>
                <li><strong>End Time:</strong> ${new Date(
                  reservation.endTime
                ).toTimeString()}</li>
                <li><strong>Duration:</strong> ${formattedDuration}</li>
                <li><strong>Total Amount:</strong> ${reservation.totalAmount.toFixed(
                  2
                )}</li>
                <li><strong>Parking Lot Address:</strong> ${
                  parkingLotRef.data().Address.formattedAddress
                }</li>
                <li><strong>Slot Position:</strong> Column ${
                  slotRef.data().position.column
                }, Row ${slotRef.data().position.row}</li>
              </ul>
              Thank you for choosing our service.`,
            },
          })
          .then(() => {
            console.log("Email queued for sending.");
          })
          .catch((error) => {
            console.error("Failed to queue email: ", error);
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

      admin
        .firestore()
        .collection("mail")
        .doc()
        .set({
          to: userRef.data().email,
          message: {
            subject: "Your Extended Reservation Details",
            html: `Your parking reservation at ${
              parkingLotRef.data().LotName
            } has been extended. Here are the updated details:<br>
            <strong>Start Time:</strong> ${new Date(
              extensionStartTime
            ).toLocaleString()}<br>
            <strong>End Time:</strong> ${new Date(
              extensionEndTime
            ).toLocaleString()}<br>
            <strong>Duration:</strong> ${formattedDuration}<br>
            <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}<br>
            <strong>Slot ID:</strong> ${slotId}<br>
            <strong>Slot Position:</strong> ${slotRef.data().position.row}${
              slotRef.data().position.column
            }<br>
            <strong>Lot ID:</strong> ${lotId}<br>
            <strong>Owner ID:</strong> ${ownerId}<br>
            <strong>Reservation ID:</strong> ${reservationId}<br>
            Please contact us if you have any questions regarding your reservation.`,
          },
        })
        .then(() => {
          console.log("Email queued for sending.");
        })
        .catch((error) => {
          console.error("Failed to queue email: ", error);
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

    // Check if cancellation is within 15 minutes of booking
    const bookingTime = new Date(reservation.createdAt);
    const cancellationTime = new Date();
    const timeDiff =
      (cancellationTime.getTime() - bookingTime.getTime()) / 60000; // difference in minutes

    if (timeDiff <= 15) {
      // Flag this reservation for a refund
      await admin.firestore().collection("refunds").add({
        reservationId: reservationId,
        parkingLotId: lotId,
        parkingSlotId: slotId,
        ownerId: ownerId,
        userId: reservation.userId,
        amount: reservation.totalAmount,
        status: "pending",
        requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      //send email to the admin or owner
      admin
        .firestore()
        .collection("mail")
        .doc()
        .set({
          to: this.adminEmail,
          message: {
            subject: "Refund Request",
            html: `A reservation has been cancelled and a refund has been requested. Please <a href="${this.firecmsURL}">review the details</a> and process the refund accordingly.`,
          },
        })
        .then(() => {
          console.log("Refund request email queued for sending.");
        })
        .catch((error) => {
          console.error("Failed to queue refund request email: ", error);
        });
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
        // const slotRef = await this.parkingSlotsCollection(ownerId, lotId)
        //   .doc(slotId)
        //   .get();

        // //getting the last rate used
        // const { duration, rateType } =
        //   reservation.usedRates[reservation.usedRates.length - 1];
        // const formattedDuration = `${duration} ${rateType}${
        //   duration > 1 ? "s" : ""
        // }`;
        admin
          .firestore()
          .collection("mail")
          .add({
            to: userRef.data().email,
            message: {
              subject: "Your Reservation Cancellation",
              html: `Your reservation at ${
                parkingLotRef.data().LotName
              } has been cancelled. It was scheduled from ${new Date(
                reservation.startTime
              ).toTimeString()} to ${new Date(
                reservation.endTime
              ).toTimeString()}.`,
            },
          })
          .then(() => {
            console.log("Cancellation email queued for sending.");
          })
          .catch((error) => {
            console.error("Failed to queue cancellation email: ", error);
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

  async reportWrongOccupant(
    lotId: string,
    slotId: string,
    reservation: ParkingReservation,
    registrationNumber: string
  ): Promise<string> {
    console.log(
      "In the service",
      lotId,
      slotId,
      reservation,
      registrationNumber
    );

    // Search the driver collection for driver with registration Number
    // const driverRef = admin
    //   .firestore()
    //   .collectionGroup("vehicles")
    //   .where("registrationNumber", "==", registrationNumber)
    //   .get();
    //if driver is found inform the parking owner or admin
    admin
      .firestore()
      .collection("mail")
      .add({
        to: this.adminEmail,
        message: {
          subject: "Hello from Firebase!",
          text: "A driver has reported wrong occupant",
          html: "A driver has reported wrong occupant name ",
        },
      })
      .then(() => console.log("Queued email for delivery!"));

    return "Report sent successfully";
  }
}

export const parkingReservationService = new ParkingReservationService();
