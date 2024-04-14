class Vehicle {
  public readonly vehicleId: string;
  public readonly registrationNumber: string;
  public readonly nickName: string;
  public readonly defaultVehicle: boolean;
  public readonly userId: string;
  public readonly createdAt: Date;

  constructor(
    vehicleId: string,
    registrationNumber: string,
    nickName: string,
    defaultVehicle: boolean,
    createdAt: Date
  ) {
    this.vehicleId = vehicleId;
    this.registrationNumber = registrationNumber;
    this.nickName = nickName;
    this.defaultVehicle = defaultVehicle;
    this.createdAt = createdAt;
  }

  static empty() {
    return new Vehicle(
      "", //vehicleId
      "", //registrationNumber
      "", //nickName
      false, //defaultVehicle
      new Date() //createdAt
    );
  }
}

export { Vehicle };
