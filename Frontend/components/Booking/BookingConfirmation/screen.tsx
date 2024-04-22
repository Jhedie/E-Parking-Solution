import { BookingConfirmationDetails } from "@models/BookingConfirmationDetails";
import { BookingDetails } from "@models/BookingDetails";
import { ParkingLot } from "@models/ParkingLot";
import { Rate } from "@models/ParkingLotRate";
import { ParkingSlot } from "@models/ParkingSlot";
import { Vehicle } from "@models/Vehicle";
import { useAuth } from "@providers/Authentication/AuthProvider";
import { useConfig } from "@providers/Config/ConfigProvider";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatAddress } from "@utils/map/formatAddress";
import axios from "axios";
import dayjs from "dayjs";
import useToken from "hooks/useToken";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Image, YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import BookingSuccessModal from "./BookingSuccess/screen";

export interface BookingConfirmationScreenProps {
  navigation: StackNavigation;
}

type RouteParams = {
  BookingConfirmationScreen: {
    parkingLot: ParkingLot;
    parkingSlot: ParkingSlot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
    selectedRate: Rate;
  };
};

const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  navigation
}) => {
  const route = useRoute<RouteProp<RouteParams, "BookingConfirmationScreen">>();
  const { parkingLot, parkingSlot, vehicle, bookingDetails, selectedRate } =
    route.params;

  const { user } = useAuth();

  const [openBookingSuccessModal, setOpenBookingSuccessModal] =
    React.useState(false);
  const successBookingModalClose = () => setOpenBookingSuccessModal(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);
  const { BASE_URL, PAYMENT_SERVER_BASE_URL } = useConfig();
  const token = useToken();

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${PAYMENT_SERVER_BASE_URL}/payment-sheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: route.params.bookingDetails.totalprice * 100,
          currency: "gbp",
          description:
            "Payment for parking - " +
            parkingLot.LotId +
            " - " +
            parkingSlot.position.row +
            parkingSlot.position.column,
          customer: {
            id: `${user?.uid}`,
            name: `${user?.displayName}`,
            email: `${user?.email}`
          }
        })
      });
      const { paymentIntent, ephemeralKey, customer } = await response.json();

      return {
        paymentIntent,
        ephemeralKey,
        customer
      };
    } catch (error) {
      console.error("Error fetching payment sheet params:", error);
      throw error; // Throw the error so it can be caught and handled outside
    }
  };

  const initializePaymentSheet = async () => {
    try {
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
      console.log("initializePaymentSheet", error);
    }
  };

  const postBookingDetails = async (bookingDetails) => {
    const response = await axios.post(
      `${BASE_URL}/parkingReservations/${parkingLot.LotId}/${parkingSlot.slotId}`,
      bookingDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  };

  const [isProcessingBooking, setIsProcessingBooking] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postBookingDetails,
    onSuccess: () => {
      setOpenBookingSuccessModal(true);
      setIsProcessingBooking(false);
    },
    onError: (error) => {
      console.error("Error posting booking details:", error);
      setIsProcessingBooking(false);
    }
  });
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert("Something went wrong. Please try again");
      console.log("Error opening payment sheet:", error);
    } else {
      // Payment was successful
      //prepare bookingDetails to be sent to the backend
      setIsProcessingBooking(true);
      const bookingConfirmationDetails: BookingConfirmationDetails = {
        userId: user?.uid ?? "",
        slotId: parkingSlot.slotId,
        lotId: parkingLot.LotId ?? "",
        vehicleId: vehicle.vehicleId ?? "",
        startTime: bookingDetails.startDateTime,
        endTime: bookingDetails.endDateTime,
        usedRates: [bookingDetails.rate],
        totalAmount: bookingDetails.totalprice,
        parkingStatus: "pending",
        paymentStatus: "completed"
      };

      mutation.mutate(bookingConfirmationDetails);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return isProcessingBooking ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text>Processing Booking...</Text>
    </View>
  ) : (
    <YStack flex={1}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            margin: 10 * 2,
            padding: 10,
            borderRadius: 5,
            backgroundColor: "white"
          }}
        >
          <View style={{ flex: 2.5 }}>
            <View
              style={{
                backgroundColor: "black",
                borderRadius: 10
              }}
            >
              <Image
                source={{ uri: parkingLot.Images[0] }}
                style={{
                  overflow: "hidden",
                  width: 84,
                  height: 74,
                  borderRadius: 5
                }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 7.5,
              alignItems: "flex-start",
              marginLeft: 10 * 1.5
            }}
          >
            <Text style={{ fontWeight: "500" }}>{parkingLot.LotName}</Text>

            <Text
              style={{
                overflow: "hidden",
                marginVertical: 10 * 0.8
              }}
            >
              {formatAddress(parkingLot.Address)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10 * 1.5,
            paddingVertical: 15,
            marginBottom: 10,
            marginHorizontal: 10 * 2,
            borderRadius: 5,
            backgroundColor: "white"
          }}
        >
          <Text style={{ fontWeight: "500" }}>Parking Slot</Text>
          <View style={{}}>
            <Text style={{}}>
              {parkingSlot.position.row}
              {parkingSlot.position.column}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10 * 1.5,
            paddingVertical: 15,
            marginBottom: 10,
            marginHorizontal: 10 * 2,
            borderRadius: 5,
            backgroundColor: "white"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "500" }}>Start Date</Text>
            <Text>
              {dayjs(bookingDetails.startDateTime).format("dddd, MMMM D, YYYY")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10 * 0.5,
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "500" }}>End Date</Text>
            <Text>
              {dayjs(bookingDetails.endDateTime).format("dddd, MMMM D, YYYY")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10 * 0.5,
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "500" }}>Hours</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10 * 0.5,
                justifyContent: "space-between"
              }}
            >
              <Text>
                {dayjs(bookingDetails.startDateTime).format("h:mm A")}
              </Text>
              <Text> - </Text>
              <Text>{dayjs(bookingDetails.endDateTime).format("h:mm A")}</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10 * 0.5,
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "500" }}>Duration</Text>
            <Text style={{}}>
              {bookingDetails.rate.duration} {bookingDetails.rate.rateType}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10 * 1.5,
            paddingVertical: 15,
            marginBottom: 10,
            marginHorizontal: 10 * 2,
            borderRadius: 5,
            backgroundColor: "white"
          }}
        >
          <Text style={{ fontWeight: "500" }}>Vehicle</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={{ marginRight: 6 }}>
              {vehicle.nickName}
              {" |"}
            </Text>

            <Text style={{}}>{vehicle.registrationNumber}</Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10 * 1.5,
            paddingVertical: 15,
            marginBottom: 10,
            marginHorizontal: 10 * 2,
            borderRadius: 5,
            backgroundColor: "white",
            justifyContent: "space-between"
          }}
        >
          {/* total price */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 10 * 0.5,
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "500" }}>Total Price</Text>
            <Text style={{}}>
              <Text>£{bookingDetails.totalprice}</Text>
            </Text>
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
          onPress={openPaymentSheet}
          // onPress={() => {
          //   setOpenBookingSuccessModal(true);
          // }}
          raiseLevel={1}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="black"
          stretch={true}
        >
          <Text style={{ color: "white" }}> Confirm Booking</Text>
        </AwesomeButton>
      </View>
      <BookingSuccessModal
        visible={openBookingSuccessModal}
        bookingSuccessModalClose={successBookingModalClose}
        onParkingTicketHandler={() => {
          successBookingModalClose();
          navigation.navigate("ParkingTicketScreen", {
            parkingLot: parkingLot,
            parkingSlot: parkingSlot,
            vehicle: vehicle,
            bookingDetails: bookingDetails,
            selectedRate: selectedRate
          });
        }}
        onBackToHomeHandler={() => {
          successBookingModalClose();
          navigation.navigate("Home");
        }}
      />
    </YStack>
  );
};

export default BookingConfirmationScreen;
