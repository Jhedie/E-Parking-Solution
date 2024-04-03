import { onDocumentCreated } from "firebase-functions/v2/firestore";
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
    handler: onDocumentCreated("users/{userId}", async (document) => {
      const user = UserFirestoreModel.fromDocumentData(document.data.data());
      const record = new DbChangedRecord(
        "USER_DELETED",
        `User ${user.name} (${user.role}) has been deleted`,
        user.uid
      );
      await dbChangesService.addRecord(record);
    }),
  };
}
