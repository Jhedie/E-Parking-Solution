import { EntityCollectionsBuilder } from "@firecms/core";
import { AdminCollection } from "./admins";
import { DbChangesCollection } from "./dbchanges";
import { DriverCollection } from "./driver";
import { parkingLotsTopLevelCollection } from "./parkingLotsTopLevel";
import { ParkingOwnerCollection } from "./parkingOwners";
import { ParkingReservationCollection } from "./parkingReservations";
import { UserCollection } from "./users";

export const collectionsBuilder: EntityCollectionsBuilder = async ({
  user,
  authController,
  dataSource,
}) => {
  const isAdmin = (() => {
    try {
      const customAttributes = (authController.user as any)?.reloadUserInfo
        ?.customAttributes;
      if (typeof customAttributes === "string") {
        return JSON.parse(customAttributes).admin;
      }
      return false; // Default to false if customAttributes is not a valid string
    } catch (error) {
      console.error("Error parsing customAttributes:", error);
      return false; // Default to false in case of parsing error
    }
  })();

  if (!isAdmin) {
    return [];
  }
  return [
    UserCollection,
    ParkingReservationCollection,
    AdminCollection,
    DriverCollection,
    ParkingOwnerCollection,
    parkingLotsTopLevelCollection,
    DbChangesCollection,
  ];
};
