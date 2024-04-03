import { AntDesign } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import { ParkingLot } from "../../Map/screen";
import { Vehicle } from "../Vehicle/SelectVehicle/screen";

import { useConfig } from "@providers/Config/ConfigProvider";
import { useToastController } from "@tamagui/toast";
import { useQuery } from "@tanstack/react-query";
import useToken from "hooks/useToken";
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

interface Position {
  row: string;
  column: number;
}

export interface ParkingSlot {
  slotId: number;
  type: string;
  status: string;
  position: Position;
}

export const SelectSpotScreen: React.FC<SelectSpotScreenProps> = ({
  navigation
}) => {
  const [selectedParkingSlot, setSelectedParkingSlot] = useState<ParkingSlot>();
  const route = useRoute<RouteProp<RouteParams, "SelectSpotScreen">>();

  const token = useToken();
  const { BASE_URL } = useConfig();
  const toaster = useToastController();
  const getAvailableParkingSlots = async (
    token: string
  ): Promise<ParkingSlot[]> => {
    try {
      const response = await fetch(
        `${BASE_URL}/parkingSlots/${route.params.parkingLot.LotId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch parking slots");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching available parking slots", error);
      return [];
    }
  };
  const {
    data: parkingSlotsData,
    isLoading: parkingSlotsLoading,
    isError: parkingSlotsError
  } = useQuery({
    queryKey: ["parkingSlots"],
    queryFn: () => getAvailableParkingSlots(token as string),
    enabled: !!token
  });
  const parkingSlotFromAPI = parkingSlotsData?.[
    "parkingSlots"
  ] as ParkingSlot[];

  useEffect(() => {
    // Check if there's already a selected parking slot and if parkingSlotsData is available
    if (
      !selectedParkingSlot &&
      parkingSlotFromAPI &&
      parkingSlotFromAPI.length > 0
    ) {
      selectRandomParkingSlot(parkingSlotFromAPI);

      //scroll to the selected parking slot
    }
  }, [parkingSlotFromAPI]);

  // Function to select a random parking slot
  const selectRandomParkingSlot = (slots: ParkingSlot[]) => {
    // Filter out only the slots that are not occupied
    const availableSlots = slots.filter((slot) => slot.status !== "Occupied");

    if (availableSlots.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSlots.length);
      const randomSlot = availableSlots[randomIndex];
      setSelectedParkingSlot(randomSlot);
      toaster.show(`Slot Choice`, {
        title: "Random parking slot selected",
        message: `Selected spot ${randomSlot.position.row}${randomSlot.position.column}`,
        intent: "success",
        timeout: 5000
      });
    } else {
      // Handle the case where there are no available slots
      toaster.show("No available parking slots", {
        title: "No slots available",
        message: "All parking slots are currently occupied.",
        intent: "error"
      });
    }

    if (selectedParkingSlot) {
      console.log(
        "scrolling to selected parking slot",
        selectedParkingSlot.slotId
      );
      // Ensure the UI has been updated and positions captured
      requestAnimationFrame(() => {
        const xPos = slotPositions[selectedParkingSlot.slotId];
        scrollViewRef.current?.scrollTo({ x: xPos, animated: true });
      });
    }
  };

  const handleSelectParkingSot = (spot: ParkingSlot) => {
    setSelectedParkingSlot(spot);
  };

  const columns = [
    ...new Set(parkingSlotFromAPI?.map((spot) => spot.position.row))
  ].sort((a, b) => a.localeCompare(b));

  const slotPositions = useRef<{ [key: number]: number }>({}).current; // To store positions

  // Dynamically generate parking spots based on row positions and sort by columns
  const generateParkingSlots = (row: string) => {
    const parkingSlotsForPosition = parkingSlotFromAPI
      ?.filter((spot) => spot.position.row === row)
      .sort((a, b) => a.position.column - b.position.column);

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
              key={spot.slotId}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                slotPositions[spot.slotId] = layout.y; // Capture the Y position of each slot
              }}
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
              {spot.status === "Occupied" ? (
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
                      selectedParkingSlot?.slotId === spot.slotId
                        ? "black"
                        : "white"
                  }}
                />
              )}
              <Text style={{ marginLeft: 20, fontWeight: "700" }}>
                {spot.position.row}
                {spot.position.column}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const scrollViewRef = useRef<ScrollView>(null);

  return parkingSlotsLoading ? (
    <YStack
      flex={1}
      backgroundColor={"white"}
      alignItems="center"
      justifyContent="center"
    >
      <ActivityIndicator />
    </YStack>
  ) : parkingSlotsError ? (
    <YStack
      flex={1}
      backgroundColor={"white"}
      alignItems="center"
      justifyContent="center"
    >
      <Text>Error fetching parking slots</Text>
    </YStack>
  ) : (
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
          ref={scrollViewRef}
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
            Proceed with Spot {selectedParkingSlot?.position.row}
            {selectedParkingSlot?.position.column}
          </Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};
