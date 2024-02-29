import dayjs from "dayjs";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Image, YStack } from "tamagui";
import { ParkingStackNavigation } from "../../../app/(auth)/parking";
import oldBookings from "../../../assets/data/oldbookings.json";

interface ParkingHistoryScreenProps {
  navigation: ParkingStackNavigation;
}

export const ParkingHistoryScreen: React.FC<ParkingHistoryScreenProps> = ({
  navigation
}) => {
  return (
    <YStack flex={1}>
      <FlatList
        style={{ marginTop: 10 * 2 }}
        data={oldBookings.oldBookings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
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
                <Text style={{ marginTop: 5 }}>{item.parkingLot.LotId}</Text>
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
                  {dayjs(item.bookingDetails.startDateTime).format(
                    "dddd, MMMM D, YYYY"
                  )}
                </Text>

                <Text style={{ marginVertical: 10 * 0.2, marginTop: 5 }}>
                  £{item.bookingDetails.totalprice}
                  {" / "}
                  {item.bookingDetails.rateNumber}{" "}
                  {item.bookingDetails.rateType}
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
                  navigation.navigate("TimerScreen");
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
                    parkingLot: item.parkingLot,
                    parkingSlot: item.parkingSlot,
                    vehicle: item.vehicle,
                    bookingDetails: item.bookingDetails
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
        )}
      />
    </YStack>
  );
};
