class Vehicle {
  vehicleId: string;
  registrationNumber: string;
  image: string;
  make: string;
  model: string;
  year: string;
  type: string;
  colour: string;
  defaultVehicle: boolean;

  constructor(
    vehicleId: string,
    registrationNumber: string,
    image: string,
    make: string,
    model: string,
    year: string,
    type: string,
    colour: string,
    defaultVehicle: boolean
  ) {
    this.vehicleId = vehicleId;
    this.registrationNumber = registrationNumber;
    this.image = image;
    this.make = make;
    this.model = model;
    this.year = year;
    this.type = type;
    this.colour = colour;
    this.defaultVehicle = defaultVehicle;
  }
}

export { Vehicle };
