import axios from "axios";

const BASE_URL = process.env.FRONTEND_SERVER_BASE_URL;
export const getAllParkingLots = async function getParkingLots(token: string) {
  console.log("BASE_URL", `${BASE_URL}/all-parkinglots-public`);
  try {
    const response = await axios.get(`${BASE_URL}/all-parkinglots-public`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch parking lots:", error);
    throw error;
  }
};
