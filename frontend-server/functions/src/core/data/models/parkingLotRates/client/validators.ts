export function validateLotID(body: any) {
  const lotID = body["lotId"];
  if (!lotID) {
    throw new Error("Lot ID is required");
  }
}

export function rateTypePresent(body: any) {
  const rateType = body["rateType"];
  if (!rateType) {
    throw new Error("Rate type is required");
  }
}

export function validateTimeRange(body: any) {
  const minutes = body["minute"];
  const day = body["day"];
  const week = body["week"];
  const month = body["month"];
  const year = body["year"];

  if (minutes) {
    if (minutes < 1 || minutes > 60) {
      throw new Error("Minutes should be between 1 and 60");
    }
  }

  if (day) {
    if (day < 1 || day > 24) {
      throw new Error("Day should be between 1 and 24");
    }
  }

  if (week) {
    if (week < 1 || week > 7) {
      throw new Error("Week should be between 1 and 7");
    }
  }

  if (month) {
    if (month < 1 || month > 31) {
      throw new Error("Month should be between 1 and 31");
    }
  }

  if (year) {
    if (year < 1 || year > 365) {
      throw new Error("Year should be between 1 and 365");
    }
  }
}
