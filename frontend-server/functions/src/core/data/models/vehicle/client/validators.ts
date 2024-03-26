import * as admin from "firebase-admin";

export async function validateRegistrationNumber(number: string) {
  if (!isValidFormat(number)) {
    throw new Error("Invalid registration number format.");
  }
  const isUnique = await checkRegistrationNumberUniqueness(number);

  if (!isUnique) {
    throw new Error("Registration number already exists.");
  }
}

function isValidFormat(number: string): boolean {
  const regex = new RegExp(
    "^(?:[A-Z]{2}[0-9]{2}[A-Z]{3}$)|" +
      "(?:[A-Z][0-9]{1,3}[A-Z]{3}$)|" +
      "(?:[A-Z]{3}[0-9]{1,3}[A-Z]$)|" +
      "(?:[0-9]{1,4}[A-Z]{1,2}$)|" +
      "(?:[0-9]{1,3}[A-Z]{1,3}$)|" +
      "(?:[A-Z]{1,2}[0-9]{1,4}$)|" +
      "(?:[A-Z]{1,3}[0-9]{1,3}$)|" +
      "(?:[A-Z]{1,3}[0-9]{1,4}$)|" +
      "(?:[0-9]{3}[DX]{1}[0-9]{3}$)"
  );
  return regex.test(number);
}

async function checkRegistrationNumberUniqueness(
  number: string
): Promise<boolean> {
  try {
    const querySnapshot = await admin
      .firestore()
      .collection("vehicles")
      .where("registrationNumber", "==", number)
      .get();
    return querySnapshot.empty;
  } catch (error) {
    console.error("Error checking registration number uniqueness:", error);
    throw new Error(
      "Failed to check registration number uniqueness due to a database error."
    );
  }

  // (?<Current>^[A-Z]{2}[0-9]{2}[A-Z]{3}$)|(?<Prefix>^[A-Z][0-9]{1,3}[A-Z]{3}$)|(?<Suffix>^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(?<DatelessLongNumberPrefix>^[0-9]{1,4}[A-Z]{1,2}$)|(?<DatelessShortNumberPrefix>^[0-9]{1,3}[A-Z]{1,3}$)|(?<DatelessLongNumberSuffix>^[A-Z]{1,2}[0-9]{1,4}$)|(?<DatelessShortNumberSufix>^[A-Z]{1,3}[0-9]{1,3}$)|(?<DatelessNorthernIreland>^[A-Z]{1,3}[0-9]{1,4}$)|(?<DiplomaticPlate>^[0-9]{3}[DX]{1}[0-9]{3}$)
  //source: https://gist.github.com/danielrbradley/7567269
}

// Examples of reg numbers:
// 1. Standard Format (Current Style): AA12AAA
// Example: AB22XYZ
// 2. Prefix Style: A123AAA
// Example: B234BCD
// 3. Suffix Style: AAA123A
// Example: XYZ234E
// 4. Dateless Long Number Prefix: 1234AA
// Example: 5678BC
// 5. Dateless Short Number Prefix: 123AAA
// Example: 456DEF
// 6. Dateless Long Number Suffix: AA1234
// Example: CD5678
// 7. Dateless Short Number Suffix: AAA123
// Example: GHI456
// Dateless Northern Ireland: AZ1234
// Example: UI8901
// 9. Diplomatic Plate: 123DX456
// Example: 789DX012
