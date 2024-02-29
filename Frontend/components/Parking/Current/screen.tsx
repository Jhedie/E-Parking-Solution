import dayjs from "dayjs";
import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { H3, Image, YStack } from "tamagui";
import { ParkingStackNavigation } from "../../../app/(auth)/parking";
import currentBooking from "../../../assets/data/currentBooking.json";

interface CurrentParkingScreenProps {
  navigation: ParkingStackNavigation;
}

export const CurrentParkingScreen: React.FC<CurrentParkingScreenProps> = ({
  navigation
}) => {
  return (
    <YStack flex={1}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
        <View
          style={{
            overflow: "hidden",
            marginHorizontal: 10 * 2,
            marginBottom: 10 * 2,
            borderRadius: 10,
            backgroundColor: "white"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10
            }}
          >
            <View style={{ flex: 3.3 }}>
              <Image
                source={require("../../../assets/images/parking-lot-image.png")}
                style={{
                  overflow: "hidden",
                  width: 84,
                  height: 74,
                  borderRadius: 5
                }}
              />
            </View>
            <View
              style={{
                flex: 6.7,
                alignItems: "flex-start",
                marginLeft: 10 * 1.5,
                marginRight: 0
              }}
            >
              {/* //TODO Name for parking Lot */}
              <Text style={{ marginTop: 5 }}>
                {currentBooking.currentBooking.parkingLot.LotId}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  overflow: "hidden",
                  marginVertical: 10 * 0.2,
                  marginTop: 5
                }}
              >
                {/* //TODO address for parking Lot */}
                Leiceter, United Kingdom
              </Text>
              <Text style={{ marginTop: 5 }}>
                {dayjs(
                  currentBooking.currentBooking.bookingDetails.startDateTime
                ).format("dddd, MMMM D, YYYY")}
              </Text>

              <Text style={{ marginVertical: 10 * 0.2, marginTop: 5 }}>
                £{currentBooking.currentBooking.bookingDetails.totalprice}
                {" / "}
                {currentBooking.currentBooking.bookingDetails.rateNumber}{" "}
                {currentBooking.currentBooking.bookingDetails.rateType}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10 * 0.5
            }}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("Viewing timer");
                navigation.navigate("TimerScreen", {
                  parkingLot: currentBooking.currentBooking.parkingLot,
                  parkingSlot: currentBooking.currentBooking.parkingSlot,
                  vehicle: currentBooking.currentBooking.vehicle,
                  bookingDetails: currentBooking.currentBooking.bookingDetails
                });
              }}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                backgroundColor: "black"
              }}
            >
              <Text
                numberOfLines={1}
                style={{ overflow: "hidden", color: "white" }}
              >
                View Timer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log("View Ticket");
                navigation.navigate("ParkingTicket", {
                  parkingLot: currentBooking.currentBooking.parkingLot,
                  parkingSlot: currentBooking.currentBooking.parkingSlot,
                  vehicle: currentBooking.currentBooking.vehicle,
                  bookingDetails: currentBooking.currentBooking.bookingDetails
                });
              }}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                backgroundColor: "white"
              }}
            >
              <Text
                numberOfLines={1}
                style={{ overflow: "hidden" }}
              >
                View Ticket
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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

        <View
          style={{
            overflow: "hidden",
            marginHorizontal: 10 * 2,
            marginBottom: 10 * 2,
            borderRadius: 10,
            backgroundColor: "white"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10
            }}
          >
            <View style={{ flex: 3.3 }}>
              <Image
                source={require("../../../assets/images/parking-lot-image.png")}
                style={{
                  overflow: "hidden",
                  width: 84,
                  height: 74,
                  borderRadius: 5
                }}
              />
            </View>
            <View
              style={{
                flex: 6.7,
                alignItems: "flex-start",
                marginLeft: 10 * 1.5,
                marginRight: 0
              }}
            >
              {/* //TODO Name for parking Lot */}
              <Text style={{ marginTop: 5 }}>
                {currentBooking.currentBooking.parkingLot.LotId}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  overflow: "hidden",
                  marginVertical: 10 * 0.2,
                  marginTop: 5
                }}
              >
                {/* //TODO address for parking Lot */}
                Leiceter, United Kingdom
              </Text>
              <Text style={{ marginTop: 5 }}>
                {dayjs(
                  currentBooking.currentBooking.bookingDetails.startDateTime
                ).format("dddd, MMMM D, YYYY")}
              </Text>

              <Text style={{ marginVertical: 10 * 0.2, marginTop: 5 }}>
                £{currentBooking.currentBooking.bookingDetails.totalprice}
                {" / "}
                {currentBooking.currentBooking.bookingDetails.rateNumber}{" "}
                {currentBooking.currentBooking.bookingDetails.rateType}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 10 * 0.5
            }}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("Viewing timer");
                navigation.navigate("TimerScreen", {
                  parkingLot: currentBooking.currentBooking.parkingLot,
                  parkingSlot: currentBooking.currentBooking.parkingSlot,
                  vehicle: currentBooking.currentBooking.vehicle,
                  bookingDetails: currentBooking.currentBooking.bookingDetails
                });
              }}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                backgroundColor: "black"
              }}
            >
              <Text
                numberOfLines={1}
                style={{ overflow: "hidden", color: "white" }}
              >
                View Timer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log("View Ticket");
                navigation.navigate("ParkingTicket", {
                  parkingLot: currentBooking.currentBooking.parkingLot,
                  parkingSlot: currentBooking.currentBooking.parkingSlot,
                  vehicle: currentBooking.currentBooking.vehicle,
                  bookingDetails: currentBooking.currentBooking.bookingDetails
                });
              }}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                backgroundColor: "white"
              }}
            >
              <Text
                numberOfLines={1}
                style={{ overflow: "hidden" }}
              >
                View Ticket
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </YStack>
  );
};
