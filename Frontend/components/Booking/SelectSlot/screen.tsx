import { AntDesign } from "@expo/vector-icons";
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
import useToken from "hooks/useToken";
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
  useEffect(() => {
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

      console.log("Fetched slots", fetchedSlots);
      setSlots(fetchedSlots);
      // Set up listeners for reservations on each slot
      fetchedSlots.forEach((slot) => {
        const reservationsRef = firestore()
          .collection(
            `parkingOwner/${route.params.parkingLot.OwnerId}/parkingLots/${route.params.parkingLot.LotId}/parkingSlots/${slot.slotId}/parkingReservations`
          )
          .where(
            "startTime",
            "<=",
            firestore.Timestamp.fromDate(new Date(chosenEndTime))
          );

        const unsubscribe = reservationsRef.onSnapshot((snapshot) => {
          const overlappingReservations = snapshot.docs.filter((doc) => {
            const reservation = doc.data();
            const reservationEndTime = reservation.endTime.toDate();
            return reservationEndTime >= new Date(chosenStartTime);
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
  }, [token, route.params.parkingLot.LotId, chosenStartTime, chosenEndTime]);

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
              {slot.status === "Reserved" ? (
                <AntDesign
                  name="car"
                  size={30}
                  color="black"
                  style={{ marginLeft: 20 }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => handleSelectParkingSlot(slot)}
                  style={{
                    width: 70,
                    height: 30,
                    borderWidth: 1.5,
                    borderColor: "black",
                    borderRadius: 5,

                    backgroundColor:
                      selectedParkingSlot?.slotId === slot.slotId
                        ? "black"
                        : "white"
                  }}
                />
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

  useEffect(() => {
    // Wait for the initial render to complete
    requestAnimationFrame(() => {
      // Check if the ScrollView is currently in view
      if (scrollViewRef.current) {
        // Animate the ScrollView to scroll a small distance to indicate swiping action
        scrollViewRef.current.scrollTo({ x: 1000, animated: true }); // Scroll further to make it slower
        setTimeout(() => {
          // Scroll back, but not to the very beginning. Adjust the x value as needed.
          scrollViewRef.current?.scrollTo({ x: 10, animated: true });
        }, 1000); // Delay the scroll back to simulate a slower scroll
      }
    });
  }, []);

  // Function to select a random parking slot
  useEffect(() => {
    if (slots.length === 0) return;
    if (selectedParkingSlot === undefined) {
      // Filter out only the slots that are not occupied
      const availableSlots = slots.filter((slot) => slot.status !== "Occupied");
      //sort by position row and column
      availableSlots.sort((a, b) => {
        if (a.position.row === b.position.row) {
          return a.position.column - b.position.column;
        }
        return a.position.row.localeCompare(b.position.row);
      });

      if (availableSlots.length > 0) {
        const firstAvailableSlot = availableSlots[0];
        setSelectedParkingSlot(firstAvailableSlot);
        Burnt.toast({
          title: "Parking slot selected",
          message: `Selected spot ${firstAvailableSlot.position.row}${firstAvailableSlot.position.column}`,
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
    }
  }, [slots]);

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
