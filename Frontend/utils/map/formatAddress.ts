import { Address } from "@models/ParkingLot";

export const formatAddress = (address: Address): string => {
  return `${address.streetName}\n${address.city}, ${address.state}\n${address.country} ${address.postalCode}`;
};
