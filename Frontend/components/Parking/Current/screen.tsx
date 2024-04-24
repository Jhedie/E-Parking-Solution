import { ReservationWithLot } from "@models/ReservationWithLot";
import { useReservations } from "@providers/Reservation/ReservationProvider";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text } from "react-native";
import { YStack } from "tamagui";
import { ParkingStackNavigation } from "../../../app/(auth)/parking";
import BookingCard from "../bookingCard";

interface CurrentParkingScreenProps {
  navigation: ParkingStackNavigation;
}

export const CurrentParkingScreen: React.FC<CurrentParkingScreenProps> = ({
  navigation
}) => {
  const nav = useNavigation<ParkingStackNavigation>();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  const { activeReservations, pendingReservations } = useReservations();
  const handleCancelParking = () => {
    Alert.alert(
      "Cancel Parking",
      "Are you sure you want to cancel this parking session?",
      [
        {
          text: "Yes",
          onPress: () => {
            console.log("Cancel parking");
            navigation.goBack();
          }
        },
        {
          text: "No",
          onPress: () => {
            console.log("No Action");
          }
        }
      ]
    );
  };
  return (
    <YStack flex={1}>
      {activeReservations.length === 0 && pendingReservations.length === 0 && (
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
          No Active or Pending Reservations
        </Text>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {activeReservations.length > 0 && (
          <Text
            style={{
              marginTop: 10 * 2,
              marginBottom: 10,
              marginHorizontal: 10 * 2,
              fontWeight: "bold",
              fontSize: 20,
              color: "grey"
            }}
          >
            Active Now
          </Text>
        )}
        {activeReservations.map((reservation: ReservationWithLot, index) => {
          return (
            <BookingCard
              key={index}
              image={reservation.parkingLotDetails.Images[0]}
              title={reservation.parkingLotDetails.LotName}
              address={
                reservation.parkingLotDetails.Address.formattedAddress ?? ""
              }
              date={dayjs(reservation.endTime).format("YYYY-MM-DD - HH:mm")}
              totalAmount={reservation.totalAmount.toString() ?? ""}
              duration={reservation.usedRates[0].duration.toString()}
              rateType={reservation.usedRates[0].rateType}
              title1={"View Timer"}
              title2={"View Ticket"}
              onClickHandler={() => {
                navigation.navigate("TimerScreen", {
                  reservation: reservation
                });
              }}
              onViewTicketHandler={() =>
                navigation.navigate("ParkingTicket", {
                  reservation: reservation
                })
              }
            />
          );
        })}

        {pendingReservations.length > 0 && (
          <Text
            style={{
              marginTop: 10 * 2,
              marginBottom: 10,
              marginHorizontal: 10 * 2,
              fontWeight: "bold",
              fontSize: 20,
              color: "grey"
            }}
          >
            Pending
          </Text>
        )}
        {pendingReservations.map((reservation: ReservationWithLot, index) => {
          return (
            <BookingCard
              key={index}
              image={reservation.parkingLotDetails.Images[0]}
              title={reservation.parkingLotDetails.LotName}
              address={
                reservation.parkingLotDetails.Address.formattedAddress ?? ""
              }
              date={dayjs(reservation.endTime).format("YYYY-MM-DD HH:mm")}
              totalAmount={reservation.totalAmount.toString() ?? ""}
              duration={reservation.usedRates[0].duration.toString()}
              rateType={reservation.usedRates[0].rateType}
              title1={"Cancel"}
              title2={"View Ticket"}
              onClickHandler={handleCancelParking}
              onViewTicketHandler={() => {
                navigation.navigate("ParkingTicket", {
                  reservation: reservation
                });
              }}
            />
          );
        })}
      </ScrollView>
    </YStack>
  );
};
