import { AntDesign } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import { ParkingLot } from "../../Map/screen";
import { Vehicle } from "../Vehicle/SelectVehicle/screen";

import parkingSpots from "../../../assets/data/parkingSpots.json";

interface SelectSpotScreenProps {
  navigation: StackNavigation;
}

type RouteParams = {
  SelectSpotScreen: {
    parkingLot: ParkingLot;
    vehicle: Vehicle;
  };
};

export interface TimeSlot {
  start: string;
  end: string;
}

export interface ParkingSpot {
  SpotID: number;
  Type: string;
  Status: string;
  ReservedTimeSlots: TimeSlot[];
  Position: string;
}

export const SelectSpotScreen: React.FC<SelectSpotScreenProps> = ({
  navigation
}) => {
  const [selectedParkingSpot, setSelectedParkingSpot] = useState<ParkingSpot>();
  const route = useRoute<RouteProp<RouteParams, "SelectSpotScreen">>();

  //get parking slots for position A and position B separately
  const parkingSpotsForPositionA = parkingSpots.filter((spot) =>
    spot.Position.startsWith("A")
  );
  const parkingSpotsForPositionB = parkingSpots.filter((spot) =>
    spot.Position.startsWith("B")
  );

  const handleSelectParkingSpot = (spot: ParkingSpot) => {
    console.log("Selected parking spot", spot);
    setSelectedParkingSpot(spot);
  };

  return (
    <YStack
      flex={1}
      backgroundColor={"white"}
      justifyContent="center"
      alignItems="center"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            flexDirection: "row",
            marginHorizontal: 10 * 2
          }}
        >
          <View
            style={{
              flexDirection: "column",
              marginRight: 10 * 2
            }}
          >
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10 * 1.5,
                width: "50%",
                height: 30,
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: "black"
              }}
            >
              <Text style={{ color: "white" }}>A</Text>
            </View>
            {parkingSpotsForPositionA.map((spot, index) => {
              const firstItem = index === 0;
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginRight: 10 * 2,
                    paddingVertical: 10 * 1.5,
                    borderTopWidth: firstItem ? 1 : undefined,
                    borderTopColor: firstItem ? "lightgrey" : undefined,
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey"
                  }}
                >
                  {spot.Status === "Occupied" ? (
                    <AntDesign
                      name="car"
                      size={30}
                      color="black"
                      style={{ marginLeft: 10 * 2 }}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleSelectParkingSpot(spot)}
                      style={{
                        width: 70,
                        height: 30,
                        borderWidth: 1.5,
                        borderColor: "black",
                        borderRadius: 5,
                        backgroundColor:
                          selectedParkingSpot?.SpotID === spot.SpotID
                            ? "black"
                            : "white"
                      }}
                    />
                  )}
                  <Text style={{ marginLeft: 10 * 2, fontWeight: "700" }}>
                    {spot.SpotID}
                  </Text>
                </View>
              );
            })}
          </View>
          <View>
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10 * 1.5,
                width: "50%",
                height: 30,
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: "black"
              }}
            >
              <Text style={{ color: "white" }}>B</Text>
            </View>
            {parkingSpotsForPositionB.map((spot, index) => {
              const firstItem = index === 0;
              return (
                <View
                  key={index}
                  style={{
                    marginLeft: 10 * 2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 10 * 1.5,
                    borderTopWidth: firstItem ? 1 : undefined,
                    borderTopColor: firstItem ? "lightgrey" : undefined,
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey"
                  }}
                >
                  {spot.Status === "Occupied" ? (
                    <AntDesign
                      name="car"
                      size={30}
                      color="black"
                      style={{ marginLeft: 10 * 2 }}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleSelectParkingSpot(spot)}
                      style={{
                        width: 70,
                        height: 30,
                        borderWidth: 1.5,
                        borderColor: "black",
                        borderRadius: 5,
                        backgroundColor:
                          selectedParkingSpot?.SpotID === spot.SpotID
                            ? "black"
                            : "white"
                      }}
                    />
                  )}
                  <Text
                    style={{
                      marginLeft: 10 * 2,
                      fontWeight: "700"
                    }}
                  >
                    {spot.SpotID}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          margin: 10 * 2
        }}
      >
        <AwesomeButton
          height={50}
          width={200}
          onPress={() => {
            selectedParkingSpot &&
              navigation.navigate("PaymentOptionScreen", {
                parkingLot: route.params.parkingLot,
                parkingSpot: selectedParkingSpot,
                vehicle: route.params.vehicle
              });
          }}
          raiseLevel={1}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="black"
        >
          <Text style={{ color: "white" }}>
            Proceed with Spot {selectedParkingSpot?.SpotID}
          </Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};
