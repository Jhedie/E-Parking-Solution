import dayjs from "dayjs";

import { useReservations } from "@providers/Reservation/ReservationProvider";
import { useCancelReservation } from "hooks/useCancelReservation";
import React from "react";
import { FlatList, Text } from "react-native";
import { YStack } from "tamagui";
import { ParkingStackNavigation } from "../../../app/(auth)/parking";
import BookingCard from "../bookingCard";

interface ParkingHistoryScreenProps {
  navigation: ParkingStackNavigation;
}

export const ParkingHistoryScreen: React.FC<ParkingHistoryScreenProps> = ({
  navigation
}) => {
  const { expiredReservations } = useReservations();
  const cancelReservationMutation = useCancelReservation(navigation);
  const renderReservations = ({ reservation }) => {
    return (
      <BookingCard
        key={reservation.id}
        image={reservation.parkingLotDetails.Images[0]}
        title={reservation.parkingLotDetails.LotName}
        address={reservation.parkingLotDetails.Address.formattedAddress ?? ""}
        date={dayjs(reservation.endTime).format("YYYY-MM-DD - HH:mm")}
        totalAmount={reservation.totalAmount.toString() ?? ""}
        duration={reservation.usedRates[0].duration.toString()}
        rateType={reservation.usedRates[0].rateType}
        title1={""}
        title2={"View Ticket"}
        onClickHandler={() => void 0}
        onViewTicketHandler={() =>
          navigation.navigate("ParkingTicket", { reservation })
        }
      />
    );
  };
  return (
    <YStack flex={1}>
      {expiredReservations.length > 0 ? (
        <FlatList
          style={{ marginTop: 10 * 2 }}
          data={expiredReservations}
          keyExtractor={(reservation) => reservation.reservationId}
          renderItem={({ item }) => renderReservations({ reservation: item })}
        />
      ) : (
        <Text
          style={{
            marginTop: 10 * 2,
            marginBottom: 10,
            marginHorizontal: 10 * 2,
            fontWeight: "bold",
            fontSize: 20,
            color: "grey",
            textAlign: "center"
          }}
        >
          No Expired Reservations
        </Text>
      )}
    </YStack>
  );
};
