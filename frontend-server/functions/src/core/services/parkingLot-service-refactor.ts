import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import * as geofirestore from "geofirestore";
import { ParkingLotFirestoreModel } from "../data/models/parkingLot/firestore/parkingLot-firestore-model";
import { PartialParkingLotFirestoreModel } from "../data/models/parkingLot/firestore/partial-parkingLot-firestore-model";
import { ParkingLot } from "../data/parkingLot";

import FieldValue = firestore.FieldValue;

class ParkingLotService {
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
      .collection("users")
      .doc(ownerId)
      .collection("parkingLots");
  }

  private parkingLotDoc(
    ownerId: string,
    lotId?: string
  ): firestore.DocumentReference {
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

    // Convert the product entity to Firestore document data including the auto-generated ID and the server timestamp
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

  /**
   * Returns a list of all parking lots in the firestore database.
   * @returns A promise that resolves to an array of all parking lots in the firestore database.
   */
  async getParkingLots(ownerId: string): Promise<ParkingLot[]> {
    // Fetch all documents from the collection
    const snapshot = await this.parkingLotsCollection(ownerId).get();
    // Convert each document to a ParkingLot object and return the array
    return snapshot.docs.map((doc) =>
      ParkingLotFirestoreModel.fromDocumentData(doc.data())
    );
  }

  async getParkingLotById(
    ownerId: string,
    parkingLotId: string
  ): Promise<ParkingLot | null> {
    const parkingLotResult = await this.parkingLotDoc(
      ownerId,
      parkingLotId
    ).get();
    if (!parkingLotResult.exists) {
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
  }

}

// Export a singleton instance in the global namespace
// This ensures that there's only one instance of ProductsService throughout the application,
// which allows for consistent state and behavior across different parts of the application.
export const parkingLotService = new ParkingLotService();
