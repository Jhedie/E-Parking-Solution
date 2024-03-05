import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export async function getParkingLots() {
  try {
    const response = await axios.get(`${BASE_URL}/parkingLots`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch parking lots:", error);
    throw error;
  }
}
