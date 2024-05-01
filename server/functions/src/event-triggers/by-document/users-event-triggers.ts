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
