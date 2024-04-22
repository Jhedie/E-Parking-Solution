import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import * as geofirestore from "geofirestore";
import { ParkingLotFirestoreModel } from "../data/models/parkingLot/firestore/parkingLot-firestore-model";
import { PartialParkingLotFirestoreModel } from "../data/models/parkingLot/firestore/partial-parkingLot-firestore-model";
import { ParkingLot } from "../data/parkingLot";
import {
  ParkingLotFromDashboard,
  SlotConfig,
} from "../data/parkingLotFromForm";
import { ParkingLotRate, ParkingLotRateType } from "../data/parkingLotRates";
import { ParkingSlot } from "../data/parkingSlot";
import { parkingLotRatesService } from "./parkingLotRates-service";
import { parkingSlotService } from "./parkingSlot-service";
const sgMail = require("@sendgrid/mail");

import FieldValue = firestore.FieldValue;

class ParkingLotService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
  private adminEmail: string = process.env.ADMIN_EMAIL;
  private geoFirestore: geofirestore.GeoFirestore;

  private geocollection: geofirestore.GeoCollectionReference;
  /**
   * Explicitly initializes GeoFirestore and related resources.
   * This method should be called after Firebase Admin SDK has been initialized.
   */
  initializeGeoFirestore() {
    const firestoreInstance = admin.firestore();
    this.geoFirestore = geofirestore.initializeApp(firestoreInstance);
    this.geocollection = this.geoFirestore.collection("parkingLotsGeohash");
  }

  private parkingLotsCollection(ownerId: string) {
    return admin
      .firestore()
      .collection("parkingOwner")
      .doc(ownerId)
      .collection("parkingLots");
  }

  private parkingLotTopLevelCollection() {
    return admin.firestore().collection("parkingLots");
  }

  private parkingLotDoc(ownerId: string, lotId?: string) {
    return lotId
      ? this.parkingLotsCollection(ownerId).doc(lotId)
      : this.parkingLotsCollection(ownerId).doc();
  }

  /**
   * Creates a new parking lot in the firestore database.
   *
   * @param parkingLot
   * @returns A promise that resolves to the created parkingLot entity.
   */
  async createParkingLot(
    parkingLot: ParkingLot,
    ownerId: string
  ): Promise<ParkingLot> {
    console.log("parkingLot in the service", parkingLot);
    // Get a refernce to a new document with an auto-generated ID in the firebase collection
    const parkingLotRef = this.parkingLotDoc(ownerId);
    console.log("type of lat", typeof parkingLot.Coordinates.Latitude);
    console.log("type of lon", typeof parkingLot.Coordinates.Latitude);

    this.geocollection.add({
      coordinates: new firestore.GeoPoint(
        parkingLot.Coordinates.Latitude,
        parkingLot.Coordinates.Longitude
      ),
      ownerId: ownerId,
      lotId: parkingLotRef.id,
    });

    // Convert the  entity to Firestore document data including the auto-generated ID and the server timestamp
    const documentData = ParkingLotFirestoreModel.fromEntity(
      parkingLot
    ).toDocumentData(parkingLotRef.id, FieldValue.serverTimestamp());
    // Set the document data in Firestore
    await parkingLotRef.set(documentData);

    //add the parking lot to a top level collection called parkingLots
    //this is to enable easy retrieval of all parking lots without having to query the users collection
    await this.parkingLotTopLevelCollection()
      .doc(parkingLotRef.id)
      .set(documentData);

    //Get the created document data from Firestore and convert it back to a ParkingLot entity
    return ParkingLotFirestoreModel.fromDocumentData(
      (await parkingLotRef.get()).data()
    );
  }

  async createParkingLotFromDashboard(
    parkingLot: ParkingLotFromDashboard,
    ownerId: string
  ): Promise<ParkingLot> {
    console.log(
      "parkingLot in the service creating parkingLot from dashboard",
      parkingLot
    );
    //create parkingLot and get the reference
    //strip away unwanted parkingLot properties to create initial parkingLot
    const parkingLotToCreate = new ParkingLot(
      undefined,
      ownerId,
      parkingLot.LotName,
      parkingLot.Description,
      parkingLot.Coordinates,
      parkingLot.Address,
      parkingLot.Capacity,
      0, // Occupancy
      "Low",
      parkingLot.OperatingHours,
      parkingLot.Facilities,
      parkingLot.Images,
      "Inactive", // Status
      new Date()
    );
    console.log("parkingLot in the service", parkingLot);
    // Get a refernce to a new document with an auto-generated ID in the firebase collection
    const parkingLotRef = this.parkingLotDoc(ownerId);
    console.log("Coordinates", parkingLotToCreate.Coordinates);
    console.log("type of lat", typeof parkingLotToCreate.Coordinates.Latitude);
    console.log("type of lon", typeof parkingLotToCreate.Coordinates.Longitude);

    this.geocollection.add({
      coordinates: new firestore.GeoPoint(
        parkingLotToCreate.Coordinates.Latitude,
        parkingLotToCreate.Coordinates.Longitude
      ),
      ownerId: ownerId,
      lotId: parkingLotRef.id,
    });

    // Convert the  entity to Firestore document data including the auto-generated ID and the server timestamp
    const documentData = ParkingLotFirestoreModel.fromEntity(
      parkingLotToCreate
    ).toDocumentData(parkingLotRef.id, FieldValue.serverTimestamp());
    // Set the document data in Firestore
    await parkingLotRef.set(documentData);

    //add the parking lot to a top level collection called parkingLots
    //this is to enable easy retrieval of all parking lots without having to query the users collection
    await this.parkingLotTopLevelCollection()
      .doc(parkingLotRef.id)
      .set(documentData);

    //create parkingSlots from slot configuration
    const newParkingSlots: ParkingSlot[] = [];
    //create parkingRates from rate configuration
    const newParkingRates: ParkingLotRate[] = [];

    parkingLot.SlotsConfig.map((config: SlotConfig) => {
      for (let index = 0; index < config.columns; index++) {
        let slotType = "regular"; // Default slot type
        if (config.row === parkingLot.SlotTypes.handicapped) {
          slotType = "handicapped";
        } else if (config.row === parkingLot.SlotTypes.electric) {
          slotType = "electric";
        }
        let slot = new ParkingSlot(
          undefined, //id
          slotType, //type
          "Available", //status
          { row: config.row, column: index }, //position
          new Date() // createdAt
        );
        newParkingSlots.push(slot);
      }
    });
    parkingLot.Rates.map((rate) => {
      let newRate = new ParkingLotRate(
        undefined, //id
        rate.rateType as ParkingLotRateType, //rateType
        rate.rate, //rate
        rate.duration, //duration
        new Date() //createdAt
      );
      newParkingRates.push(newRate);
    });

    await Promise.all([
      parkingSlotService.createMultipleParkingSlots(
        newParkingSlots,
        ownerId,
        parkingLotRef.id
      ),
      //create parkingLotRates
      parkingLotRatesService.createMultipleParkingLotRates(
        newParkingRates,
        ownerId,
        parkingLotRef.id
      ),
    ]);

    // if parkinglot, parkingSlots and parkingRates are created successfully, inform admin via email
    await this.sendNewParkingLotCreatedEmail(
      this.adminEmail,
      "http://localhost:5173/app/",
      ownerId
    );
    return ParkingLotFirestoreModel.fromDocumentData(
      (await parkingLotRef.get()).data()
    );
  }

  /**
   * Returns a list of all parking lots in the firestore database.
   * @returns A promise that resolves to an array of all parking lots in the firestore database.
   */
  async getParkingLots(ownerId: string): Promise<ParkingLot[]> {
    // Fetch all documents from the collection
    const snapshot = await this.parkingLotsCollection(ownerId)
      .where("Status", "!=", "Inactive")
      .get();
    // Convert each document to a ParkingLot object and return the array
    return snapshot.docs.map((doc) =>
      ParkingLotFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async getParkingLotById(
    ownerId: string,
    parkingLotId: string
  ): Promise<ParkingLot | null> {
    console.log("Getting parking lot by id");
    console.log("ownerId", ownerId);
    console.log("parkingLotId", parkingLotId);
    const parkingLotResult = await this.parkingLotDoc(
      ownerId,
      parkingLotId
    ).get();
    if (!parkingLotResult.exists) {
      console.log("Parking lot not found.");
      return null;
    }
    return ParkingLotFirestoreModel.fromDocumentData(parkingLotResult.data());
  }

  async updateParkingLotById(
    ownerId: string,
    parkingLotId: string,
    partialParkingLot: Partial<Record<keyof ParkingLot, any>>
  ): Promise<void> {
    //convert the partial parking lot data to a format suitable for updating the document
    const documentData =
      PartialParkingLotFirestoreModel.fromPartialEntity(
        partialParkingLot
      ).toDocumentData();

    // Update the parking lot document with the new data
    await this.parkingLotDoc(ownerId, parkingLotId).update(documentData);

    // Update the parking lot in the top level collection
    await this.parkingLotTopLevelCollection()
      .doc(parkingLotId)
      .update(documentData);
  }

  async geosearchParkingLots(
    lat: number,
    lon: number,
    radius: number
  ): Promise<ParkingLot[]> {
    console.log("lat", lat);
    console.log("lon", lon);
    console.log("radius", radius);

    console.log("geocollection", this.geocollection);

    // Perform the geosearch query
    const query = this.geocollection.near({
      center: new firestore.GeoPoint(lat, lon),
      radius: radius,
    });

    // Get the results of the query
    const value = await query.get();
    console.log("value", value);

    // Process the results to fetch each parking lot's full details
    const parkingLotsFromSearch = await Promise.all(
      value.docs.map(async (geoDoc) => {
        // The geosearch only gives us the lotId, so we need to retrieve the full parking lot details
        // Assuming each geodoc data contains ownerId and lotId
        const ownerId = geoDoc.data().ownerId;
        const lotId = geoDoc.data().lotId;

        if (!ownerId || !lotId) {
          throw new Error("Owner ID or Lot ID is missing in geosearch result.");
        }

        // Retrieve the full parking lot details from the subcollection
        const parkingLotRef = this.parkingLotDoc(ownerId, lotId);
        const parkingLotSnapshot = await parkingLotRef.get();

        if (!parkingLotSnapshot.exists) {
          throw new Error(`Parking lot not found: ${lotId}`);
        }

        return ParkingLotFirestoreModel.fromDocumentData(
          parkingLotSnapshot.data()
        );
      })
    );

    return parkingLotsFromSearch;
  }

  async approveParkingLotById(
    ownerId: string,
    parkingLotId: string
  ): Promise<void> {
    //update the status of the parking lot to approved
    try {
      await this.updateParkingLotById(ownerId, parkingLotId, {
        status: "Active",
      });
      //get the email of the parking lot owner
      const user = await admin.auth().getUser(ownerId);
      const email = user?.email;
      try {
        this.sendParkingLotApprovalOrRevocationEmail(
          email,
          "Your parking lot has been approved.",
          "Kindly click the link below to view your parking lot.",
          "View Parking Lot",
          `http://localhost:5173/app/dashboard/${parkingLotId}`
        );
      } catch (error) {
        console.log("error", error);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async revokeApprovalParkingLotById(ownerId: string, parkingLotId: string) {
    try {
      //update the status of the parking lot to approved
      await this.updateParkingLotById(ownerId, parkingLotId, {
        status: "Inactive",
      });

      try {
        //get the email of the parking lot owner
        const user = await admin.auth().getUser(ownerId);
        const email = user?.email;

        this.sendParkingLotApprovalOrRevocationEmail(
          email,
          "Your parking lot has been deactivated.",
          "Kindly contact the support for further information.",
          "Contact support",
          `mailto:${this.adminEmail}`
        );
      } catch (error) {
        console.log("error", error);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  sendParkingLotApprovalOrRevocationEmail = async (
    email: string,
    message: string,
    furtherInformation: string,
    actionMessage: string,
    link: string
  ): Promise<any> => {
    const to: string = email;
    const from: string = this.adminEmail;

    const msg = {
      to,
      from,
      template_id: "d-47713f0267b84b8dab3ce0f14a6bb8a8",
      dynamic_template_data: {
        ApprovalMessage: message,
        FurtherInformation: furtherInformation,
        ActionMessage: actionMessage,
        updateLink: link,
      },
    };

    return await sgMail.send(msg);
  };
  sendNewParkingLotCreatedEmail = async (
    email: string,
    link: string,
    ownerId: string
  ): Promise<any> => {
    const to: string = email;
    const from: string = this.adminEmail;

    const msg = {
      to,
      from,
      template_id: "d-6b054d0e7234489b9ee0df574a387233",
      dynamic_template_data: {
        approvalLink: link,
        ownerId: ownerId,
      },
    };

    return await sgMail.send(msg);
  };

  async deleteParkingLotById(
    ownerId: string,
    parkingLotId: string
  ): Promise<void> {
    // Delete the parking lot document
    await this.parkingLotDoc(ownerId, parkingLotId).delete();

    // Delete the parking lot from the geoloaction collection
    console.log(`deleting ${parkingLotId} parking lot from geohash`);
    firestore()
      .collection("parkingLotsGeohash")
      .where("lotId", "==", parkingLotId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }
}

// Export a singleton instance in the global namespace
// This ensures that there's only one instance of ProductsService throughout the application,
// which allows for consistent state and behavior across different parts of the application.
export const parkingLotService = new ParkingLotService();
