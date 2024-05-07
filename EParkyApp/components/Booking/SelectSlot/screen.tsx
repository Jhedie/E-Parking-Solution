import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";

import { BookingDetails } from "@models/BookingDetails";
import { ParkingLot } from "@models/ParkingLot";
import { Rate } from "@models/ParkingLotRate";
import { ParkingSlot } from "@models/ParkingSlot";
import { Vehicle } from "@models/Vehicle";
import * as Burnt from "burnt";
import { useFocusEffect } from "expo-router";
import useToken from "hooks/useToken";
import { debounce } from "lodash";
interface SelectSlotScreenProps {
  navigation: StackNavigation;
}

type RouteParams = {
  SelectSlotScreen: {
    parkingLot: ParkingLot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
    selectedRate: Rate;
  };
};

const debouncedSelectAndToast = debounce(
  (slots, setSelectedParkingSlot, Burnt) => {
    if (slots.length === 0) return;

    // Filter out only the slots that are not occupied
    const availableSlots = slots.filter(
      (slot) =>
        slot.status !== "Reserved" &&
        !slot.type.includes("disabled") &&
        !slot.type.includes("electric")
    );
    //sort by position row and column
    availableSlots.sort((a, b) => {
      if (a.position.row === b.position.row) {
        return a.position.column - b.position.column;
      }
      return a.position.row.localeCompare(b.position.row);
    });
    console.log("Available slots", availableSlots);

    if (availableSlots.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSlots.length);

      const randomAvailableSlot = availableSlots[randomIndex];
      setSelectedParkingSlot(randomAvailableSlot);
      Burnt.toast({
        title: "Parking slot selected",
        message: `Selected spot ${randomAvailableSlot.position.row}${randomAvailableSlot.position.column}`,
        preset: "done",
        duration: 5
      });
    } else {
      Burnt.toast({
        title: "No available parking slots",
        preset: "error",
        duration: 5
      });
    }
  },
  2000
);

export const SelectSlotScreen: React.FC<SelectSlotScreenProps> = ({
  navigation
}) => {
  const [selectedParkingSlot, setSelectedParkingSlot] = useState<
    ParkingSlot | undefined
  >(undefined);
  const route = useRoute<RouteProp<RouteParams, "SelectSlotScreen">>();
  const token = useToken();

  const chosenStartTime = route.params.bookingDetails.startDateTime;
  const chosenEndTime = route.params.bookingDetails.endDateTime;
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  useFocusEffect(
    useCallback(() => {
      console.log("Parking Lot", route.params.parkingLot);
      if (!token || !route.params.parkingLot.LotId) return;

      console.log("SelectSlotScreen mounted");
      const unsubscribeFns: (() => void)[] = []; // To store unsubscribe functions

      // Fetch all slots
      const slotsRef = firestore().collection(
        `parkingOwner/${route.params.parkingLot.OwnerId}/parkingLots/${route.params.parkingLot.LotId}/parkingSlots`
      );

      slotsRef.get().then((slotsSnapshot) => {
        const fetchedSlots = slotsSnapshot.docs.map((doc) => {
          return {
            slotId: doc.id,
            position: doc.data().position,
            type: doc.data().type,
            status: "Available" // Assume all slots are available initially
          };
        }) as ParkingSlot[];

        setSlots(fetchedSlots);
        // Set up listeners for reservations on each slot
        fetchedSlots.forEach((slot) => {
          const reservationsRef = firestore()
            .collection(
              `parkingOwner/${route.params.parkingLot.OwnerId}/parkingLots/${route.params.parkingLot.LotId}/parkingSlots/${slot.slotId}/parkingReservations`
            )
            .where(
              "endTime",
              ">=",
              firestore.Timestamp.fromDate(new Date(chosenStartTime))
            );

          const unsubscribe = reservationsRef.onSnapshot((snapshot) => {
            const overlappingReservations = snapshot.docs.filter((doc) => {
              const reservation = doc.data();
              const reservationStartTime = reservation.startTime;
              return reservationStartTime <= new Date(chosenStartTime);
            });

            // Determine if the slot is reserved based on the filtered overlapping reservations
            const isReserved = overlappingReservations.length > 0;
            setSlots((prevSlots) =>
              prevSlots.map((s) =>
                s.slotId === slot.slotId
                  ? { ...s, status: isReserved ? "Reserved" : "Available" }
                  : s
              )
            );
          });

          unsubscribeFns.push(unsubscribe); // Store the unsubscribe function
        });
      });

      return () => {
        // Cleanup: Unsubscribe from all listeners
        unsubscribeFns.forEach((unsubscribe) => unsubscribe());
      };
    }, [token, chosenStartTime, chosenEndTime])
  );
  const handleSelectParkingSlot = (slot: ParkingSlot) => {
    setSelectedParkingSlot(slot);
  };

  const [columns, setColumns] = useState<string[]>([]);
  useEffect(() => {
    const columns = [...new Set(slots?.map((slot) => slot.position.row))].sort(
      (a, b) => a.localeCompare(b)
    );
    setColumns(columns);
  }, [slots]);

  const slotPositions = useRef<{ [key: number]: number }>({}).current; // To store positions

  // Dynamically generate parking spots based on row positions and sort by columns
  const generateParkingSlots = (row: string) => {
    console.log("Generating parking slots for row", row);
    // Filter out parking slots for the current row
    const parkingSlotsForPosition = slots
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
          {parkingSlotsForPosition.map((slot, index) => (
            <View
              key={slot.slotId}
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                slotPositions[slot.slotId] = layout.y; // Capture the Y position of each slot
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
              {slot.status === "Reserved" || slot.status === "Occupied" ? (
                <AntDesign
                  name="car"
                  size={30}
                  color="black"
                  style={{ marginLeft: 20 }}
                />
              ) : selectedParkingSlot?.slotId === slot.slotId ? (
                <FontAwesome
                  name="car"
                  size={24}
                  color="rgb(253 176 34)"
                  style={{ marginLeft: 20 }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => handleSelectParkingSlot(slot)}
                  style={{
                    width: 70,
                    height: 30,
                    borderWidth: 1.5,
                    borderColor: slot.type.includes("electric")
                      ? "green"
                      : "black",
                    borderRadius: 5,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: slot.type.includes("disabled")
                      ? "#ADD8E6"
                      : slot.type.includes("electric")
                      ? "#90EE90"
                      : "white"
                  }}
                >
                  {slot.type.includes("disabled") && (
                    <FontAwesome
                      name="wheelchair"
                      size={24}
                      color="black"
                    />
                  )}
                  {slot.type.includes("electric") && (
                    <MaterialIcons
                      name="bolt"
                      size={24}
                      color="green"
                    />
                  )}
                </TouchableOpacity>
              )}
              <Text style={{ marginLeft: 20, fontWeight: "700" }}>
                {slot.position.row}
                {slot.position.column}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const scrollViewRef = useRef<ScrollView>(null);

  //logic handles cases were there are multiple slots updates I want to show the toast only once and it should be the last
  useEffect(() => {
    if (slots.length === 0) return;

    // Call the debounced function
    debouncedSelectAndToast(slots, setSelectedParkingSlot, Burnt);

    // Cleanup function to cancel the debounced call if the component unmounts
    return () => {
      debouncedSelectAndToast.cancel();
    };
  }, [slots]); // Depend on `slots`

  return (
    <YStack
      flex={1}
      backgroundColor={"white"}
      alignItems="center"
      justifyContent="center"
    >
      <ScrollView>
        <View>
          <Text
            style={{ fontSize: 16, fontWeight: "500", textAlign: "center" }}
          >
            Slot availabilities for the selected time. Go back to view others.
          </Text>
        </View>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={true}
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
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
            padding: 10,
            borderWidth: 2,
            borderColor: "rgb(253 176 34)",
            borderRadius: 10,
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "rgb(253 176 34)"
            }}
          >
            Selected Slot
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "black",
              marginTop: 5
            }}
          >
            {selectedParkingSlot
              ? `Row: ${selectedParkingSlot.position.row}, Column: ${selectedParkingSlot.position.column}`
              : "None"}
          </Text>
        </View>

        <View
          style={{
            margin: 10 * 2,
            alignItems: "center"
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
                  bookingDetails: route.params.bookingDetails,
                  selectedRate: route.params.selectedRate
                });
              } else {
                alert("Please select a parking slot");
              }
            }}
            raiseLevel={1}
            borderRadius={10}
            backgroundShadow="#fff"
            backgroundDarker="#fff"
            backgroundColor="rgb(253 176 34)"
          >
            <Text style={{ color: "black", fontWeight: "500" }}>Next</Text>
          </AwesomeButton>
        </View>
      </ScrollView>
    </YStack>
  );
};
