import { ParkingStackNavigation } from "@/(auth)/parking";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ExtendedBookingDetails } from "@models/ExtendedBookingDetails";
import { Rate } from "@models/ParkingLotRate";
import { ReservationWithLot } from "@models/ReservationWithLot";
import { useAuth } from "@providers/Authentication/AuthProvider";
import { useConfig } from "@providers/Config/ConfigProvider";
import firestore from "@react-native-firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as Burnt from "burnt";
import { default as dayjs } from "dayjs";
import useToken from "hooks/useToken";
import { default as React, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { default as AwesomeButton } from "react-native-really-awesome-button";
import { YStack } from "tamagui";
interface ExtendParkingScreenProps {
  navigation: ParkingStackNavigation;
}

export type RouteParams = {
  reservation: ReservationWithLot;
};

export const ExtendParkingScreen: React.FC<ExtendParkingScreenProps> = ({
  navigation
}) => {
  const route = useRoute<RouteProp<RouteParams, "reservation">>();
  const reservation = route.params["reservation"] as ReservationWithLot;
  const { user } = useAuth();
  const token = useToken();
  const isFocused = useIsFocused();
  const { BASE_URL, PAYMENT_SERVER_BASE_URL } = useConfig();

  const getRatesForParkingLot = async (): Promise<Rate[]> => {
    try {
      console.log("LotId:", reservation.parkingLotDetails.LotId);
      const response = await axios.post(
        `${BASE_URL}/parkingLotRates/parkingLot/${reservation.parkingLotDetails.LotId}`,
        { ownerId: reservation.parkingLotDetails.OwnerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Fetched parking lot rates:", response.data);

      return response.data;
    } catch (error) {
      console.log("Failed to fetch parking lot rates:", error);
      return [];
    }
  };

  const { data: parkingLotRates } = useQuery({
    queryKey: ["parkingLotRates"],
    queryFn: () => getRatesForParkingLot(),
    enabled: !!token && isFocused
  });

  // Use cachedRates if available, otherwise use data from the query
  const rates = parkingLotRates;

  const [endDateTime, setEndDateTime] = useState<Date>();

  const [selectedRate, setSelectedRate] = useState<Rate>(
    rates?.["parkingLotRates"]?.[0]
  );

  useEffect(() => {
    if (rates?.["parkingLotRates"]?.[0]) {
      setSelectedRate(rates?.["parkingLotRates"]?.[0]);
    }
  }, [rates]);

  const [totalPrice, setTotalPrice] = useState<number>(
    rates?.["parkingLotRates"]?.[0]?.rate ?? 0
  );

  const [bookingExtensionDetails, setBookingExtensionDetails] =
    useState<ExtendedBookingDetails>();

  //when the selected rate changes, calendar should update the marked dates
  //I also want to update the price
  //I also want to update the total price
  useEffect(() => {
    // Calculate the new end date based on the selected rate type and number
    let newEndDateTime: Date = new Date();

    const rateTypeLower = selectedRate?.rateType.toLowerCase(); // Convert to lowercase

    switch (rateTypeLower) {
      case "minute":
      case "minutes":
      case "min":
      case "mins":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "minute")
          .toDate();
        break;
      case "hour":
      case "hours":
      case "hr":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "hour")
          .toDate();
        break;
      case "day":
      case "days":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "day")
          .toDate();
        break;
      case "week":
      case "weeks":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "week")
          .toDate();
        break;
      case "month":
      case "months":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "month")
          .toDate();
        break;
      case "year":
      case "years":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "year")
          .toDate();
        break;
    }

    // Update the end date
    setEndDateTime(newEndDateTime);

    const foundRate = rates?.["parkingLotRates"]?.find(
      (rate: Rate) => rate.rateId === selectedRate?.rateId
    );

    if (foundRate) {
      const totalprice = selectedRate?.rate;
      setTotalPrice(totalprice);
      setBookingExtensionDetails({
        extensionStartTime: reservation.endTime,
        extensionEndTime: newEndDateTime.toISOString(),
        totalAmount: totalprice,
        rate: selectedRate
      });
    }
  }, [reservation.endTime, selectedRate]);

  const endDateScale = React.useRef(new Animated.Value(1)).current;
  const animateEndDate = () => {
    Animated.sequence([
      Animated.timing(endDateScale, {
        toValue: 1.1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.timing(endDateScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  ///INTEND TO MAKE BOOKING EXTENSION
  //real time check for slot availability
  const [checkingSlotAvailability, setCheckingSlotAvailability] =
    useState(false);
  const checkSlotAvailability = async (
    extensionStartTime: string,
    extensionEndTime: string
  ): Promise<boolean> => {
    console.log("Checking slot availability for extension...");
    const slotId = reservation.slotId; // Assuming slotId is part of the reservation object
    const lotId = reservation.parkingLotDetails.LotId;
    const ownerId = reservation.parkingLotDetails.OwnerId;

    try {
      const reservationsRef = firestore()
        .collection(
          `parkingOwner/${ownerId}/parkingLots/${lotId}/parkingSlots/${slotId}/parkingReservations`
        )
        .where("parkingStatus", "==", "active");

      const snapshot = await reservationsRef.get();

      let isAvailable = true;

      snapshot.forEach((doc) => {
        console.log("Checking slot availability for extension:", doc.id);
        const currentReservation = doc.data();
        const currentReservationStart = new Date(
          currentReservation.startTime.seconds * 1000
        );
        const currentReservationEnd = new Date(
          currentReservation.endTime.seconds * 1000
        );
        const extensionStartTimeAsDate = new Date(extensionStartTime);
        const extensionEndTimeAsDate = new Date(extensionEndTime);

        // Check for time overlap
        if (
          extensionStartTimeAsDate < currentReservationEnd &&
          extensionEndTimeAsDate > currentReservationStart
        ) {
          isAvailable = false;
        }
      });

      if (isAvailable) {
        console.log("Slot is available for extension.");
        return true;
      } else {
        console.log("Slot is not available for extension.");
        return false;
      }
    } catch (error) {
      console.error("Error checking slot availability:", error);
      return false;
    }
  };
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const postBookingDetails = async (
    bookingExtensionDetails: ExtendedBookingDetails
  ) => {
    const response = await axios.post(
      `${BASE_URL}/parkingReservations/${reservation.parkingLotDetails.LotId}/${reservation.slotId}/${reservation.reservationId}/extend`,
      bookingExtensionDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: postBookingDetails,
    onSuccess: (data) => {
      Burnt.alert({
        title: "Booking extended successfully",
        duration: 2,
        preset: "done"
      });
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Error posting booking details:", error);
      Burnt.alert({
        title: "Error extending booking",
        duration: 5,
        preset: "error"
      });
    }
  });

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code === "Failed") {
        Alert.alert("Payment failed. Please try again");
      }
      if (error.code === "Canceled") {
        Alert.alert("Payment was cancelled");
      }
      if (error.code === "Timeout") {
        Alert.alert("Payment timed out. Please try again");
      }
    } else {
      console.log("Payment sheet opened");

      // Payment was successful
      // prepare bookingDetails to be sent to the backend
      if (bookingExtensionDetails) {
        mutation.mutate(bookingExtensionDetails);
      }
    }
  };

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(
        `${PAYMENT_SERVER_BASE_URL}/extend-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: 100,
            currency: "gbp",
            parkingDetails: {
              lotId: reservation.parkingLotDetails.LotId,
              slotId: reservation.slotId,
              ownerId: reservation.parkingLotDetails.OwnerId
            },
            customer: reservation.stripeCustomerId,
            customerDetails: {
              id: `${user?.uid}`,
              name: `${user?.displayName}`,
              email: `${user?.email}`,
              phone: `${user?.phoneNumber}`
            }
          })
        }
      );
      const { paymentIntent, ephemeralKey, customer } = await response.json();
      return {
        paymentIntent,
        ephemeralKey,
        customer
      };
    } catch (error) {
      console.error("Error fetching payment sheet params:", error);
      throw error;
    }
  };
  const initializePaymentSheet = async () => {
    try {
      // Make a request to your server to create a PaymentIntent
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "E-Parking-Solution",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: `${user?.displayName}`
        },
        style: "alwaysDark",
        appearance: {
          primaryButton: {
            colors: {
              background: "#FFCC00"
            }
          }
        }
      });
      if (!error) {
        setLoading(true);
      }
    } catch (error) {
      console.error("Error initializing payment sheet:", error);
    }
  };

  // Initialize payment sheet
  useEffect(() => {
    initializePaymentSheet();
  }, [user, reservation, initPaymentSheet]);

  return (
    <YStack flex={1}>
      {checkingSlotAvailability ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView
          style={{ marginHorizontal: 10 * 2.4 }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View
              style={{
                marginTop: 10 * 2.4,
                marginBottom: 10
              }}
            >
              <View style={{ flex: 1, marginBottom: 10 }}>
                <Text style={{ fontWeight: "600" }}>Start Date and Time</Text>
                <TouchableOpacity
                  disabled
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 10 * 1.2,
                    paddingHorizontal: 10,
                    marginTop: 10 * 0.9,
                    borderRadius: 5,
                    backgroundColor: "#ededed",
                    borderWidth: 1,
                    borderColor: "lightgrey"
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 16,
                      padding: 10
                    }}
                  >
                    {reservation.endTime
                      ? `${dayjs(reservation.endTime).format(
                          "MMMM D, YYYY"
                        )} at ${dayjs(reservation.endTime, "HH:mm").format(
                          "h:mm A"
                        )}`
                      : reservation.endTime}
                  </Text>
                  <MaterialCommunityIcons
                    name="clock-time-three-outline"
                    size={20}
                    color="grey"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={{ marginBottom: 10, fontWeight: "600" }}>
            Select Duration
          </Text>

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              borderRadius: 10,
              marginBottom: 10 * 2.5
            }}
          >
            <Picker
              selectedValue={selectedRate?.rateId}
              onValueChange={(itemValue) => {
                console.log("itemValue", itemValue);
                const selectedRate = rates?.["parkingLotRates"]?.find(
                  (rate: Rate) => rate.rateId === itemValue
                );
                if (selectedRate) {
                  console.log("selectedRate", selectedRate);
                  setSelectedRate(selectedRate);
                }
                animateEndDate();
              }}
              style={{
                width: "100%",
                marginTop: 10,
                marginBottom: 10,
                fontWeight: "600"
              }}
              itemStyle={{ fontSize: 18, fontWeight: "600" }}
            >
              {rates?.["parkingLotRates"]?.map((rate: Rate, index: number) => (
                <Picker.Item
                  key={rate?.rateId}
                  label={rate?.duration + " " + rate?.rateType}
                  value={rate?.rateId}
                />
              ))}
            </Picker>
          </View>
          <View>
            <View
              style={{
                marginBottom: 10 * 2.4
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600" }}>End Date and Time</Text>
                <TouchableOpacity
                  disabled
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 10 * 1.2,
                    paddingHorizontal: 10,
                    marginTop: 10 * 0.9,
                    borderRadius: 5,
                    backgroundColor: "#ededed",
                    borderWidth: 1,
                    borderColor: "lightgrey"
                  }}
                >
                  <Animated.Text
                    style={{
                      transform: [{ scale: endDateScale }],
                      fontWeight: "500",
                      fontSize: 16,
                      padding: 10
                    }}
                  >
                    {bookingExtensionDetails
                      ? `${dayjs(endDateTime).format(
                          "MMMM D, YYYY"
                        )} at ${dayjs(endDateTime, "HH:mm").format("h:mm A")}`
                      : "Select a start date and time"}
                  </Animated.Text>
                  <MaterialCommunityIcons
                    name="clock-time-three-outline"
                    size={20}
                    color="grey"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4 * 1,
                marginHorizontal: 4
              }}
            >
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                Previous Total Amount
              </Text>
              <Text style={{ fontSize: 16 }}>
                £{reservation.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4 * 1,
                marginHorizontal: 4
              }}
            >
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                New Total Amount
              </Text>
              <Text style={{ fontSize: 16 }}>
                <Text>
                  £{(totalPrice + reservation.totalAmount).toFixed(2)}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
      <View
        style={{
          margin: 10 * 2
        }}
      >
        <AwesomeButton
          height={50}
          onPress={async () => {
            if (!bookingExtensionDetails) {
              Alert.alert(
                "Error",
                "Please select a rate to extend the parking"
              );
            } else {
              //I want to first check if the slot is still available for that time chosen
              //then if slot is available then I want to make the payment
              //then I want to update the reservation
              setCheckingSlotAvailability(true);
              setTimeout(async () => {
                await checkSlotAvailability(
                  reservation.endTime,
                  bookingExtensionDetails?.extensionEndTime
                ).then((isAvailable) => {
                  setCheckingSlotAvailability(false);
                  console.log("Slot is available:", isAvailable);
                  if (isAvailable) {
                    // Make payment and update reservation
                    console.log(
                      "Proceeding with payment and updating reservation..."
                    );
                    Burnt.toast({
                      title: "Slot Available for extension!",
                      duration: 5,
                      preset: "done"
                    });

                    Alert.alert(
                      "Payment Confirmation",
                      "Do you want to proceed with the payment?",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel"
                        },
                        {
                          text: "OK",
                          onPress: () => openPaymentSheet()
                        }
                      ]
                    );
                  } else {
                    Burnt.alert({
                      title: "Slot not available. Try another slot.",
                      duration: 5,
                      preset: "error"
                    });
                  }
                });
              }, 2000); // Simulate delay in checking slot availability
            }

            console.log("Booking Extension Details:", bookingExtensionDetails);
          }}
          raiseLevel={1}
          stretch={true}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="rgb(253 176 34)"
        >
          <Text style={{ color: "black", fontWeight: "500" }}>
            {checkingSlotAvailability ? "Checking..." : "Extend"}
          </Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};
