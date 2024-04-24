import { ParkingStackNavigation } from "@/(auth)/parking";
import {
  BookingConfirmationDetails,
  successfulBookingConfirmation
} from "@models/BookingConfirmationDetails";
import { BookingDetails } from "@models/BookingDetails";
import { ParkingLot } from "@models/ParkingLot";
import { Rate } from "@models/ParkingLotRate";
import { ParkingSlot } from "@models/ParkingSlot";
import { Vehicle } from "@models/Vehicle";
import { useAuth } from "@providers/Authentication/AuthProvider";
import { useConfig } from "@providers/Config/ConfigProvider";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import { useMutation } from "@tanstack/react-query";
import { formatAddress } from "@utils/map/formatAddress";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigation, useRouter } from "expo-router";
import useToken from "hooks/useToken";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";
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
  const { user } = useAuth();
  const nav = useNavigation<ParkingStackNavigation>();

  const { BASE_URL, PAYMENT_SERVER_BASE_URL } = useConfig();
  const token = useToken();

  const { parkingLot, parkingSlot, vehicle, bookingDetails, selectedRate } =
    route.params;
  const [openBookingSuccessModal, setOpenBookingSuccessModal] =
    React.useState(false);
  const successBookingModalClose = () => setOpenBookingSuccessModal(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

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

  const router = useRouter();

  const [isProcessingBooking, setIsProcessingBooking] = useState(false);

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

  const [successfulBookingDetailsData, setSuccessfulBookingDetailsData] =
    useState<successfulBookingConfirmation>();
  const mutation = useMutation({
    mutationFn: postBookingDetails,
    onSuccess: (data: successfulBookingConfirmation) => {
      setSuccessfulBookingDetailsData(data);
      setOpenBookingSuccessModal(true);
      setIsProcessingBooking(false);
    },
    onError: (error) => {
      console.error("Error posting booking details:", error);
      setIsProcessingBooking(false);
      navigation.goBack();
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

            margin: 20,
            padding: 20,
            borderRadius: 10,
            backgroundColor: "white"
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {parkingLot.LotName}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 20,
            marginBottom: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            backgroundColor: "white",
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          }}
        >
          <View
            style={{
              flex: 7,
              alignItems: "flex-start"
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Address</Text>
            <Text
              style={{
                marginVertical: 10,
                fontSize: 16
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
            paddingHorizontal: 20,
            paddingVertical: 20,
            marginBottom: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            backgroundColor: "white",
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Parking Slot</Text>
          <View>
            <Text style={{ fontSize: 16 }}>
              {parkingSlot.position.row}
              {parkingSlot.position.column}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            marginBottom: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            backgroundColor: "white",
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Start Date</Text>
            <Text style={{ fontSize: 16 }}>
              {dayjs(bookingDetails.startDateTime).format("dddd, MMMM D, YYYY")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>End Date</Text>
            <Text style={{ fontSize: 16 }}>
              {dayjs(bookingDetails.endDateTime).format("dddd, MMMM D, YYYY")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Hours</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Text style={{ fontSize: 16 }}>
                {dayjs(bookingDetails.startDateTime).format("h:mm A")}
              </Text>
              <Text style={{ fontSize: 16 }}> - </Text>
              <Text style={{ fontSize: 16 }}>
                {dayjs(bookingDetails.endDateTime).format("h:mm A")}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Duration</Text>
            <Text style={{ fontSize: 16 }}>
              {bookingDetails.rate.duration} {bookingDetails.rate.rateType}(s)
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 20,
            marginBottom: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            backgroundColor: "white",
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Vehicle</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Text style={{ marginRight: 6, fontSize: 16 }}>
              {vehicle.nickName}
              {" |"}
            </Text>

            <Text style={{ fontSize: 16 }}>{vehicle.registrationNumber}</Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            marginBottom: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            backgroundColor: "white",
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            justifyContent: "space-between"
          }}
        >
          {/* total price */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Total Price
            </Text>
            <Text style={{ fontSize: 16 }}>£{bookingDetails.totalprice}</Text>
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
          backgroundColor="rgb(253, 176, 34)"
          stretch={true}
        >
          <Text style={{ color: "black", fontWeight: "bold" }}>
            Confirm Booking
          </Text>
        </AwesomeButton>
      </View>
      <BookingSuccessModal
        visible={openBookingSuccessModal}
        bookingSuccessModalClose={successBookingModalClose}
        onParkingTicketHandler={() => {
          successBookingModalClose();
          if (successfulBookingDetailsData) {
            navigation.navigate("ParkingTicketScreen", {
              parkingLot: parkingLot,
              parkingSlot: parkingSlot,
              vehicle: vehicle,
              bookingDetails: bookingDetails,
              selectedRate: selectedRate,
              successfulBookingConfirmation: successfulBookingDetailsData
            });
          } else {
            Alert.alert(
              "Error",
              "Something went wrong with your booking. Please try again"
            );
          }
        }}
        onBackToHomeHandler={() => {
          setOpenBookingSuccessModal(false);
          nav.navigate("ParkingTopTabsNavigator");
        }}
      />
    </YStack>
  );
};

export default BookingConfirmationScreen;
