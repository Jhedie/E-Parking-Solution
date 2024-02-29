import { Response } from "express";
import { ParkingLot } from "../models/parkingLot";

type Request = {
  body: ParkingLot;
  params: { parkinglotId: string };
};

const addParkingLot = async (req: Request, res: Response): Promise<void> => {};
const getParkingLot = async (req: Request, res: Response): Promise<void> => {};

const getAllParkingLotsWithinALocation = async (
  req: Request,
  res: Response
): Promise<void> => {};
const getAllParkingLots = async (
  req: Request,
  res: Response
): Promise<void> => {};

const updateParkingLot = async (
  req: Request,
  res: Response
): Promise<void> => {};

const deleteParkingLot = async (
  req: Request,
  res: Response
): Promise<void> => {};

export {
  getAllParkingLotsWithinALocation,
  addParkingLot,
  deleteParkingLot,
  getAllParkingLots,
  getParkingLot,
  updateParkingLot,
};
