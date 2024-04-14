import * as admin from "firebase-admin";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { DbChangedRecord } from "../../core/data/db-changed-record";
import { UserFirestoreModel } from "../../core/data/models/user/firestore/user-firestore-model";
import { dbChangesService } from "../../core/services/db-changes-service";
import {
  AddEventTrigger,
  EventTriggerV2Function,
  InitializeEventTriggers,
} from "../initialize-event-triggers";

export class UsersEventTriggers implements InitializeEventTriggers {
  initialize(add: AddEventTrigger): void {
    add(this.onCreated);
    add(this.onDeleted);
    add(this.onUpdated);
  }

  private readonly onCreated: EventTriggerV2Function = {
    name: "onUserCreated",
    handler: onDocumentCreated("users/{userId}", async (document) => {
      const user = UserFirestoreModel.fromDocumentData(document.data.data());
      const record = new DbChangedRecord(
        "USER_CREATED",
        `User ${user.name} (${user.role}) has been created`,
        user.uid
      );
      await dbChangesService.addRecord(record);
    }),
  };

  private readonly onDeleted: EventTriggerV2Function = {
    name: "onUserDeleted",
    handler: onDocumentDeleted("users/{userId}", async (document) => {
      const user = await admin.auth().getUser(document.data.data().uid);
      console.log("event trigger to delete user", user.uid);
      const record = new DbChangedRecord(
        "USER_DELETED",
        `User ${user.displayName} with userId: (${user.uid}) has been deleted`,
        user.uid
      );
      await dbChangesService.addRecord(record);

      const uid = user.uid;

      console.log(`customClaims: ${JSON.stringify(user.customClaims)}`);

      if (user.customClaims.parkingOwner === true) {
        // Delete all related documents for a parking owner
        await Promise.all([
          deleteParkingLotCollectionForUser(uid),
          deleteParkingReservationCollectionForUser(uid),
          deleteParkingSlotCollectionForUser(uid),
          deleteParkingOwnerCollectionForUser(uid),
          admin.firestore().collection("users").doc(uid).delete(),
        ]);
      } else if (user.customClaims.driver === true) {
        // Delete all related documents for a driver
        await Promise.all([
          deleteVehicleCollectionForUser("vehicles", uid),
          deleteDriverCollectionForUser("driver", uid),
          admin.firestore().collection("users").doc(uid).delete(),
        ]);
      }

      async function deleteParkingLotCollectionForUser(userId: string) {
        const collectionRef = admin.firestore().collection("parkingLots");
        const snapshot = await collectionRef.where("Owner", "==", userId).get();

        const batch = admin.firestore().batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        try {
          console.log("Deleting all parking lots for user", userId);
          await batch.commit();
        } catch (error) {
          console.error(`Error deleting parking lot for user ${uid}:`, error);
        }
      }

      async function deleteParkingReservationCollectionForUser(userId: string) {
        const collectionRef = admin
          .firestore()
          .collection("parkingReservations");
        const snapshot = await collectionRef
          .where("userId", "==", userId)
          .get();
        const batch = admin.firestore().batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        try {
          console.log("Deleting all parking reservations for user", userId);
          await batch.commit();
        } catch (error) {
          console.error(
            `Error deleting parking reservation for user ${uid}:`,
            error
          );
        }
      }

      async function deleteParkingSlotCollectionForUser(userId: string) {
        const collectionRef = admin.firestore().collection("parkingSlots");
        const snapshot = await collectionRef.where("uid", "==", userId).get();
        const batch = admin.firestore().batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        console.log("Deleting all parking slots for user", userId);
        try {
          await batch.commit();
        } catch (error) {
          console.error(`Error deleting parking slot for user ${uid}:`, error);
        }
      }

      async function deleteParkingOwnerCollectionForUser(userId: string) {
        const collectionRef = admin.firestore().collection("parkingOwner");
        const snapshot = await collectionRef.where("uid", "==", userId).get();
        const batch = admin.firestore().batch();
        snapshot.docs.forEach((doc) => {
          console.log("parking owner", doc.data());
          batch.delete(doc.ref);
        });
        console.log("Deleting all parking owners for user", userId);

        try {
          await batch.commit();
        } catch (error) {
          console.error(`Error deleting parking owner for user ${uid}:`, error);
        }
      }

      async function deleteDriverCollectionForUser(
        collectionName: string,
        userId: string
      ) {
        const collectionRef = admin.firestore().collection(collectionName);
        const snapshot = await collectionRef
          .where("userId", "==", userId)
          .get();

        const batch = admin.firestore().batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        console.log("Deleting driver for user", userId);
        try {
          await batch.commit();
        } catch (error) {
          console.error(`Error deleting driver for user ${uid}:`, error);
        }
      }

      async function deleteVehicleCollectionForUser(
        collectionName: string,
        userId: string
      ) {
        const collectionRef = admin.firestore().collection(collectionName);
        const snapshot = await collectionRef
          .where("userId", "==", userId)
          .get();

        const batch = admin.firestore().batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        console.log("Deleting all documents for user", userId);
        await batch.commit();
      }
      try {
        await admin.auth().deleteUser(uid);
        console.log(
          `Successfully deleted user ${uid} from Firebase Authentication.`
        );
      } catch (error) {
        console.error(
          `Error deleting user ${uid} from Firebase Authentication:`,
          error
        );
      }
    }),
  };

  private readonly onUpdated: EventTriggerV2Function = {
    name: "onUserUpdated",
    handler: onDocumentUpdated("users/{userId}", async (document) => {
      const user = await admin.auth().getUser(document.data.after.data().uid);
      console.log("event trigger to update user", user.uid);
      const record = new DbChangedRecord(
        "USER_UPDATED",
        `User ${user.displayName} (${user.uid}) has been updated`,
        user.uid
      );
      await dbChangesService.addRecord(record);

      // const _uid = user.uid;

      console.log(`customClaims: ${JSON.stringify(user.customClaims)}`);
    }),
  };
}
