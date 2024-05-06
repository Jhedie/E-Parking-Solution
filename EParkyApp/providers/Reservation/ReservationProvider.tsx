/* eslint-disable @typescript-eslint/no-empty-function */
import { successfulBookingConfirmation } from "@models/BookingConfirmationDetails";
import { ParkingLot } from "@models/ParkingLot";
import { ParkingSlot } from "@models/ParkingSlot";
import { ReservationWithLot } from "@models/ReservationWithLot";
import { Vehicle } from "@models/Vehicle";
import { useAuth } from "@providers/Authentication/AuthProvider";
import firestore from "@react-native-firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

const ReservationContext = createContext({
  activeReservations: Array<ReservationWithLot>(),
  pendingReservations: Array<ReservationWithLot>(),
  expiredReservations: Array<ReservationWithLot>(),
});

export const useReservations = () => useContext(ReservationContext);
export const ReservationProvider = ({ children }) => {
  const [activeReservations, setActiveReservations] = useState<
    ReservationWithLot[]
  >([]);
  const [pendingReservations, setPendingReservations] = useState<
    ReservationWithLot[]
  >([]);
  const [expiredReservations, setExpiredReservations] = useState<
    ReservationWithLot[]
  >([]);

  const { user } = useAuth();

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    const fetchReservations = async (status: string) => {
      const unsubscribe = firestore()
        .collectionGroup("parkingReservations")
        .where("userId", "==", user?.uid)
        .where("parkingStatus", "==", status)
        .onSnapshot(async (querySnapshot) => {
          try {
            const promises = querySnapshot.docs.map(async (doc) => {
              const reservation = {
                id: doc.id,
                ...(doc.data() as successfulBookingConfirmation)
              };

              const processedStartTime = new Date(
                reservation.startTime["seconds"] * 1000
              );

              const processedEndTime = new Date(
                reservation.endTime["seconds"] * 1000
              );

              const parkingLotDoc = await firestore()
                .collection("parkingLots")
                .doc(reservation.lotId)
                .get();
              const ownerId = parkingLotDoc.data()?.OwnerId;

              const slotDoc = await firestore()
                .collection("parkingOwner")
                .doc(ownerId)
                .collection("parkingLots")
                .doc(reservation.lotId)
                .collection("parkingSlots")
                .doc(reservation.slotId)
                .get();

              const vehicleDoc = await firestore()
                .collection("driver")
                .doc(reservation.userId)
                .collection("vehicles")
                .doc(reservation.vehicleId)
                .get();

              return {
                ...reservation,
                startTime: processedStartTime.toISOString(),
                endTime: processedEndTime.toISOString(),
                parkingLotDetails: parkingLotDoc.data() as ParkingLot,
                slotDetails: slotDoc.data() as ParkingSlot,
                vehicleDetails: vehicleDoc.data() as Vehicle
              };
            });
            const results = await Promise.all(promises);

            //Collection Group Query may return duplicates, so we filter them out
            const uniqueResults = results.filter(
              (value, index, self) =>
                index ===
                self.findIndex((t) => t.reservationId === value.reservationId)
            );
            console.log(
              "uniqueResults and length",
              uniqueResults,
              uniqueResults.length
            );
            if (status === "active") {
              setActiveReservations(uniqueResults);
            } else if (status === "pending") {
              setPendingReservations(uniqueResults);
            } else if (status === "expired") {
              setExpiredReservations(uniqueResults);
            }
          } catch (error) {
            console.log("Error fetching reservations:", error);
          }
        });
      return unsubscribe; // Return the unsubscribe function directly
    };

    // Immediately-invoked async function to handle async logic within useCallback
    (async () => {
      unsubscribes.push(await fetchReservations("active"));
      unsubscribes.push(await fetchReservations("pending"));
      unsubscribes.push(await fetchReservations("expired"));
    })();

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe()); // Unsubscribe on cleanup
    };
  }, [user]);

  return (
    <ReservationContext.Provider
      value={{
        activeReservations,
        pendingReservations,
        expiredReservations
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
