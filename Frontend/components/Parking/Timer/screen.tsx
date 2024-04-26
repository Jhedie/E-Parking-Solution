import { ReservationWithLot } from "@models/ReservationWithLot";
import { useAuth } from "@providers/Authentication/AuthProvider";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCancelReservation } from "hooks/useCancelReservation";
import React from "react";
import { Alert, Text, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";
import { ParkingStackNavigation } from "../../../app/(auth)/parking";

interface TimerScreenProps {
  navigation: ParkingStackNavigation;
}

export type RouteParams = {
  reservation: ReservationWithLot;
};

export const TimerScreen: React.FC<TimerScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams, "reservation">>();
  const nav = useNavigation<ParkingStackNavigation>();
  const reservation = route.params["reservation"] as ReservationWithLot;
  const { user } = useAuth();
  const cancelReservationMutation = useCancelReservation(navigation);
  const handleCancelParking = (reservation: ReservationWithLot) => {
    Alert.alert(
      "Cancel Parking",
      "Are you sure you want to cancel this parking session?",
      [
        {
          text: "Yes",
          onPress: () => {
            console.log("Cancel parking");
            cancelReservationMutation(reservation);
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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around"
        }}
      >
        {/* Count Down timer */}
        <View style={{}}>
          <CountdownCircleTimer
            isPlaying
            duration={dayjs(reservation.endTime).diff(
              dayjs(reservation.startTime),
              "seconds"
            )}
            initialRemainingTime={dayjs(reservation.endTime).diff(
              dayjs(),
              "seconds"
            )} //get the difference between the end time and the current time
            colors="#232626"
            rotation="counterclockwise"
            strokeLinecap="round"
            trailColor="#CDDCE1"
            // eslint-disable-next-line react/no-children-prop
            children={({ remainingTime }) => {
              const hours = Math.floor(remainingTime / 3600);
              const minutes = Math.floor((remainingTime % 3600) / 60);
              const seconds = remainingTime % 60;

              return (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 200,
                    height: 200,
                    borderRadius: 100
                  }}
                >
                  <Text style={{}}>
                    {hours.toString().padStart(2, "0")}:
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                  </Text>
                </View>
              );
            }}
          ></CountdownCircleTimer>
        </View>
        {/* parking details */}
        <View
          style={{
            marginTop: 10 * 2,
            backgroundColor: "white",
            borderRadius: 10,
            paddingHorizontal: 10 * 2,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10 * 2
          }}
        >
          <View
            style={{
              marginTop: 15,
              backgroundColor: "white",
              borderRadius: 10,
              width: "100%",
              paddingHorizontal: 10 * 2,
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 15,
              borderColor: "lightgrey"
            }}
          >
            <View>
              <View style={{}}>
                {/* Name */}
                <Text style={{ fontWeight: "600" }}>Name</Text>
                <Text>{user?.displayName}</Text>
              </View>

              <View
                style={{
                  marginTop: 15
                }}
              >
                {/* Parking slot */}
                <Text style={{ fontWeight: "600", textAlign: "left" }}>
                  Parking Slot
                </Text>
                <Text>
                  {reservation.slotDetails.position.row}
                  {reservation.slotDetails.position.column}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 15
                }}
              >
                {/* Parking area */}
                <Text style={{ fontWeight: "600" }}>Parking Area</Text>
                <Text>{reservation.parkingLotDetails.Address.streetName}</Text>
              </View>

              <View
                style={{
                  marginTop: 15
                }}
              >
                {/* vehicle */}
                <Text style={{ fontWeight: "600" }}>Vehicle</Text>
                <Text>{reservation.vehicleDetails.registrationNumber}</Text>
              </View>
            </View>
            <View>
              <View style={{}}>
                {/* Duration */}
                <Text style={{ fontWeight: "600", textAlign: "right" }}>
                  Duration
                </Text>
                <Text
                  style={{
                    textAlign: "right"
                  }}
                >
                  2 hours
                </Text>
              </View>

              <View
                style={{
                  marginTop: 15
                }}
              >
                {/* Date */}
                <Text style={{ fontWeight: "600", textAlign: "right" }}>
                  End Date
                </Text>
                <Text
                  style={{
                    textAlign: "right"
                  }}
                >
                  {dayjs(reservation.endTime).format("DD/MM/YYYY")}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 15
                }}
              >
                {/* hour */}
                <Text style={{ fontWeight: "600", textAlign: "right" }}>
                  Hour
                </Text>
                <Text
                  style={{
                    textAlign: "right"
                  }}
                >
                  {dayjs(reservation.startTime).format("h:mm A")} -{" "}
                  {dayjs(reservation.endTime).format("h:mm A")}
                </Text>
              </View>

              <View
                style={{
                  marginTop: 15
                }}
              >
                {/* Total */}
                <Text style={{ fontWeight: "600", textAlign: "right" }}>
                  Total
                </Text>
                <Text
                  style={{
                    textAlign: "right"
                  }}
                >
                  {"£" + reservation.totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* buttons */}
        <View
          style={{
            marginTop: 10 * 5
          }}
        >
          <AwesomeButton
            height={50}
            width={300}
            raiseLevel={1}
            borderRadius={10}
            backgroundShadow="#fff"
            backgroundDarker="#fff"
            backgroundColor="rgb(253, 176, 34)"
            onPress={() => {
              navigation.goBack();
              nav.navigate("ExtendParkingScreen", { reservation });
            }}
          >
            <Text style={{ color: "black", fontWeight: "500" }}>
              Extend Parking Session
            </Text>
          </AwesomeButton>
          <View style={{ marginTop: 10 }}>
            <AwesomeButton
              height={50}
              width={300}
              raiseLevel={1}
              borderRadius={10}
              backgroundShadow="#fff"
              backgroundDarker="#fff"
              backgroundColor="#FF474D"
              onPress={() => handleCancelParking(reservation)}
            >
              <Text style={{ color: "white", fontWeight: "500" }}>
                Cancel Parking Session
              </Text>
            </AwesomeButton>
          </View>
        </View>
      </View>
    </YStack>
  );
};
