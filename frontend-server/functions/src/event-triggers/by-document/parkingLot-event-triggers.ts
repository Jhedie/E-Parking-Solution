// import {
//   onDocumentCreated,
//   onDocumentDeleted,
//   onDocumentUpdated,
// } from "firebase-functions/v2/firestore";
// import { DbChangedRecord } from "../../core/data/db-changed-record";
// import { ParkingLotFirestoreModel } from "../../core/data/models/parkingLot/firestore/parkingLot-firestore-model";
// import { ParkingLot } from "../../core/data/parkingLot";
// import { dbChangesService } from "../../core/services/db-changes-service";
// import {
//   AddEventTrigger,
//   EventTriggerV2Function,
//   InitializeEventTriggers,
// } from "../initialize-event-triggers";

// /**
//  * Class representing event triggers for parking lots.
//  * @implements {InitializeEventTriggers}
//  */
// export class ParkingLotEventTriggers implements InitializeEventTriggers {
//   /**
//    * Initializes event triggers by adding them to the provided add function.
//    * @param {AddEventTrigger} add - Function to add event triggers.
//    */
//   initialize(add: AddEventTrigger): void {
//     add(this.onCreated);
//     add(this.onUpdated);
//     add(this.onDeleted);
//   }

//   /**
//    * Event trigger for when a parking lot is created.
//    * @type {EventTriggerV2Function}
//    * @memberof ParkingLotEventTriggers
//    */
//   private readonly onCreated: EventTriggerV2Function = {
//     name: "onParkingLotCreated",
//     handler: onDocumentCreated("parkingLots/{lotId}", async (document) => {
//       const parkingLot: ParkingLot = ParkingLotFirestoreModel.fromDocumentData(
//         document.data.data()
//       );
//       const record = new DbChangedRecord(
//         "PARKING_LOT_CREATED",
//         `Parking lot ${parkingLot.LotName} has been created by document ID ${document.id}`,
//         "admin"
//       );

//       await dbChangesService.addRecord(record);
//     }),
//   };

//   /**
//    * Event trigger for when a parking lot is updated.
//    * @type {EventTriggerV2Function}
//    * @memberof ParkingLotEventTriggers
//    */
//   private readonly onUpdated: EventTriggerV2Function = {
//     name: "onParkingLotUpdated",
//     handler: onDocumentUpdated("parkingLots/{lotId}", async (document) => {
//       const parkingLot: ParkingLot = ParkingLotFirestoreModel.fromDocumentData(
//         document.data.after.data() // Use the after data to get the updated document
//       );

//       const record = new DbChangedRecord(
//         "PARKING_LOT_UPDATED",
//         `Parking lot ${parkingLot.LotName} has been updated by document ID ${document.id}`,
//         "admin"
//       );

//       await dbChangesService.addRecord(record);
//     }),
//   };

//   private readonly onDeleted: EventTriggerV2Function = {
//     name: "onParkingLotDeleted",
//     handler: onDocumentDeleted("parkingLots/{lotId}", async (document) => {
//       const parkingLot: ParkingLot = ParkingLotFirestoreModel.fromDocumentData(
//         document.data.data()
//       );
//       const record = new DbChangedRecord(
//         "PARKING_LOT_DELETED",
//         `Parking lot ${parkingLot.LotName} has been deleted by document ID ${document.id}`,
//         "admin"
//       );

//       await dbChangesService.addRecord(record);
//     }),
//   };
// }
