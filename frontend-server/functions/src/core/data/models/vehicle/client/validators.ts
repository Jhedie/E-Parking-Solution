import * as admin from "firebase-admin";

export function validateVehicleId(id: string) {
  // Validate vehicleId (e.g., non-empty, valid format)
  if (!id) {
    throw new Error("Vehicle id is required");
  }
}

export function validateRegistrationNumber(number: string) {
  //check if the registration number is unique by querying the database
  admin
    .firestore()
    .collection("vehicles")
    .where("registrationNumber", "==", number)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        throw new Error("Registration number already exists");
      }
    });
  // (?<Current>^[A-Z]{2}[0-9]{2}[A-Z]{3}$)|(?<Prefix>^[A-Z][0-9]{1,3}[A-Z]{3}$)|(?<Suffix>^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(?<DatelessLongNumberPrefix>^[0-9]{1,4}[A-Z]{1,2}$)|(?<DatelessShortNumberPrefix>^[0-9]{1,3}[A-Z]{1,3}$)|(?<DatelessLongNumberSuffix>^[A-Z]{1,2}[0-9]{1,4}$)|(?<DatelessShortNumberSufix>^[A-Z]{1,3}[0-9]{1,3}$)|(?<DatelessNorthernIreland>^[A-Z]{1,3}[0-9]{1,4}$)|(?<DiplomaticPlate>^[0-9]{3}[DX]{1}[0-9]{3}$)
  //source: https://gist.github.com/danielrbradley/7567269
  const regex =
    "^[A-Z]{2}[0-9]{2}s?[A-Z]{3}$)|(^[A-Z][0-9]{1,3}[A-Z]{3}$)|(^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(^[0-9]{1,4}[A-Z]{1,2}$)|(^[0-9]{1,3}[A-Z]{1,3}$)|(^[A-Z]{1,2}[0-9]{1,4}$)|(^[A-Z]{1,3}[0-9]{1,3}$)|(^[A-Z]{1,3}[0-9]{1,4}$)|(^[0-9]{3}[DX]{1}[0-9]{3}$";

  if (!number.match(regex)) {
    throw new Error("Invalid registration number");
  }
}
