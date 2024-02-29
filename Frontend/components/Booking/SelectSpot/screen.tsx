import { AntDesign } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import parkingSlots from "../../../assets/data/parkingSlots.json";
import { ParkingLot } from "../../Map/screen";
import { Vehicle } from "../Vehicle/SelectVehicle/screen";

import { BookingDetails } from "../BookingDetails/screen";
interface SelectSpotScreenProps {
  navigation: StackNavigation;
}

type RouteParams = {
  SelectSpotScreen: {
    parkingLot: ParkingLot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
  };
};

export interface TimeSlot {
  start: string;
  end: string;
}

interface Position {
  Row: string;
  Column: number;
}

export interface ParkingSlot {
  SpotID: number;
  Type: string;
  Status: string;
  ReservedTimeSlots: TimeSlot[];
  Position: Position;
}

export const SelectSpotScreen: React.FC<SelectSpotScreenProps> = ({
  navigation
}) => {
  const [selectedParkingSlot, setSelectedParkingSlot] = useState<ParkingSlot>();
  const route = useRoute<RouteProp<RouteParams, "SelectSpotScreen">>();

  const handleSelectParkingSot = (spot: ParkingSlot) => {
    setSelectedParkingSlot(spot);
  };

  const columns = [...new Set(parkingSlots.map((spot) => spot.Position.Row))];

  // Dynamically generate parking spots based on row positions
  const generateParkingSlots = (row: string) => {
    const parkingSlotsForPosition = parkingSlots.filter(
      (spot) => spot.Position.Row === row
    );

    return (
      <View>
        <View
          style={{
            flexDirection: "column",
            padding: 10
          }}
        >
          <View
            style={{
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 15,
              width: "50%",
              height: 30,
              borderRadius: 4,
              borderWidth: 1,
              backgroundColor: "black"
            }}
          >
            <Text style={{ color: "white" }}>{row}</Text>
          </View>
          {parkingSlotsForPosition.map((spot, index) => (
            <View
              key={spot.SpotID}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: 20,
                paddingVertical: 15,
                borderTopWidth: index === 0 ? 1 : undefined,
                borderTopColor: index === 0 ? "lightgrey" : undefined,
                borderBottomWidth: 1,
                borderBottomColor: "lightgrey"
              }}
            >
              {spot.Status === "Occupied" ? (
                <AntDesign
                  name="car"
                  size={30}
                  color="black"
                  style={{ marginLeft: 20 }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => handleSelectParkingSot(spot)}
                  style={{
                    width: 70,
                    height: 30,
                    borderWidth: 1.5,
                    borderColor: "black",
                    borderRadius: 5,

                    backgroundColor:
                      selectedParkingSlot?.SpotID === spot.SpotID
                        ? "black"
                        : "white"
                  }}
                />
              )}
              <Text style={{ marginLeft: 20, fontWeight: "700" }}>
                {spot.SpotID}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <YStack
      flex={1}
      backgroundColor={"white"}
      alignItems="center"
      justifyContent="center"
    >
      <View
        style={{
          padding: 10,
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "80%"
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          <View
            style={{
              padding: 10,
              borderRadius: 10,
              flexDirection: "row",
              marginHorizontal: 20
            }}
          >
            {/* Dynamically generate parking spots based on row positions */}
            {columns.map((row, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderColor: "black"
                }}
              >
                {generateParkingSlots(row)}
                {index !== columns.length - 1 && (
                  <View
                    style={{
                      flex: 2
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignSelf: "center",
                        alignItems: "center",
                        paddingHorizontal: 10 * 0.5,
                        width: 60,
                        height: 25,
                        borderRadius: 4,
                        backgroundColor: "lightgrey"
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{ overflow: "hidden" }}
                      >
                        Entry
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: 1,
                        marginTop: 10 * 0.5,
                        marginBottom: 10 * 0.5,
                        borderLeftWidth: 1,
                        alignSelf: "center",
                        borderLeftColor: "lightgrey"
                      }}
                    />
                    <View
                      style={{
                        justifyContent: "center",
                        alignSelf: "center",
                        alignItems: "center",
                        paddingHorizontal: 10 * 0.5,
                        width: 60,
                        height: 25,
                        borderRadius: 4,
                        backgroundColor: "lightgrey"
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{ overflow: "hidden" }}
                      >
                        Exit
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View
        style={{
          margin: 10 * 2
        }}
      >
        <AwesomeButton
          height={50}
          width={200}
          onPress={() => {
            if (selectedParkingSlot) {
              navigation.navigate("BookingConfirmationScreen", {
                parkingLot: route.params.parkingLot,
                parkingSlot: selectedParkingSlot,
                vehicle: route.params.vehicle,
                bookingDetails: route.params.bookingDetails // Pass the booking details to the next screen
              });
            } else {
              alert("Please select a parking slot");
            }
          }}
          raiseLevel={1}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="black"
        >
          <Text style={{ color: "white", fontWeight: "500" }}>
            Proceed with Spot {selectedParkingSlot?.SpotID}
          </Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};
