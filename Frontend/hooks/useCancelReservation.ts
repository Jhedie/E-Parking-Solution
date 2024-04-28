import { useConfig } from "@providers/Config/ConfigProvider"; // Adjust import based on your project structure
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as Burnt from "burnt";
import useToken from "./useToken";

export const useCancelReservation = (navigation) => {
  const { BASE_URL } = useConfig();
  const token = useToken();

  const cancelReservation = async (reservation) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/parkingReservations/${reservation.parkingLotDetails.LotId}/${reservation.slotDetails.slotId}/${reservation.reservationId}/cancel`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      throw error;
    }
  };

  const { mutateAsync: cancelReservationMutation } = useMutation({
    mutationFn: cancelReservation,
    onSuccess: (data) => {
      console.log("Booking cancelled successfully", data);
      Burnt.alert({
        title: "Booking cancelled successfully",
        duration: 2,
        preset: "done"
      });
    },
    onError: (error) => {
      console.error("Error cancelling booking:", error);
      Burnt.alert({
        title: "Error cancelling booking",
        duration: 5,
        preset: "error"
      });
    }
  });

  return cancelReservationMutation;
};
