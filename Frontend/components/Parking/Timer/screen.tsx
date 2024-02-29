import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import AwesomeButton from "react-native-really-awesome-button";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { YStack } from "tamagui";
import { ParkingStackNavigation } from "../../../app/(auth)/parking";
import { BookingDetails } from "../../Booking/BookingDetails/screen";
import { ParkingSlot } from "../../Booking/SelectSpot/screen";
import { Vehicle } from "../../Booking/Vehicle/SelectVehicle/screen";
import { ParkingLot } from "../../Map/screen";

interface TimerScreenProps {
  navigation: ParkingStackNavigation;
}

export type RouteParams = {
  ParkingTicketScreen: {
    parkingLot: ParkingLot;
    parkingSlot: ParkingSlot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
  };
};

export const TimerScreen: React.FC<TimerScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams, "ParkingTicketScreen">>();
  const bookedParkingDetails = route.params.bookingDetails;
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
            duration={120}
            initialRemainingTime={120}
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
                <Text>userName</Text>
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
                <Text>Position</Text>
              </View>

              <View
                style={{
                  marginTop: 15
                }}
              >
                {/* Parking area */}
                <Text style={{ fontWeight: "600" }}>Parking Area</Text>
                <Text>Leicester, UK</Text>
              </View>

              <View
                style={{
                  marginTop: 15
                }}
              >
                {/* vehicle */}
                <Text style={{ fontWeight: "600" }}>Vehicle</Text>
                <Text>Toyota Corolla</Text>
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
                  Date
                </Text>
                <Text
                  style={{
                    textAlign: "right"
                  }}
                >
                  12/12/2021
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
                  12:00 PM - 1:00 PM
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
                  £10.00
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Extend time button */}
        <View
          style={{
            margin: 10 * 2
          }}
        >
          <AwesomeButton
            height={50}
            raiseLevel={1}
            borderRadius={10}
            backgroundShadow="#fff"
            backgroundDarker="#fff"
            backgroundColor="black"
            onPress={() => console.log("Extend Parking Session")}
          >
            <Text style={{ color: "white", fontWeight: "500" }}>
              Extend Parking Session
            </Text>
          </AwesomeButton>
        </View>
      </View>
    </YStack>
  );
};
