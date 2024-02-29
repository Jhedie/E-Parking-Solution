import { Response } from "express";
import { Vehicle } from "../models/Vehicle";

type Request = {
  body: Vehicle;
  params: { vehicleId: string };
};

const addVehicle = async (req: Request, res: Response): Promise<void> => {};

const getVehicle = async (req: Request, res: Response): Promise<void> => {};

const getAllVehicles = async (req: Request, res: Response): Promise<void> => {};

const updateVehicle = async (req: Request, res: Response): Promise<void> => {};

const deleteVehicle = async (req: Request, res: Response): Promise<void> => {};

export { addVehicle, deleteVehicle, getAllVehicles, getVehicle, updateVehicle };
