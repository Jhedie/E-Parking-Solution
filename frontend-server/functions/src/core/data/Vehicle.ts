class Vehicle {
  public readonly vehicleId: string;
  public readonly registrationNumber: string;
  public readonly image: string;
  public readonly defaultVehicle: boolean;
  public readonly userId: string;
  public readonly createdAt: Date;

  constructor(
    vehicleId: string,
    registrationNumber: string,
    image: string,
    defaultVehicle: boolean,
    userId: string,
    createdAt: Date
  ) {
    this.vehicleId = vehicleId;
    this.registrationNumber = registrationNumber;
    this.image = image;
    this.defaultVehicle = defaultVehicle;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  static empty() {
    return new Vehicle("", "", "", false, "", new Date());
  }
}

export { Vehicle };
