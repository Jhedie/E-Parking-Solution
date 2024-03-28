import { useAuth } from "@providers/Authentication/AuthProvider";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Image, YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import { ParkingLot } from "../../Map/screen";
import { BookingDetails } from "../BookingDetails/screen";
import { ParkingSlot } from "../SelectSpot/screen";
import { Vehicle } from "../Vehicle/SelectVehicle/screen";
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
    // paymentMethod: PaymentMethod;  - to be replaced with stripe
  };
};

export type ConfirmationDetails = {
  parkingLot: ParkingLot;
  parkingSlot: ParkingSlot;
  vehicle: Vehicle;
  bookingDetails: BookingDetails;
  // paymentMethod: PaymentMethod; - to be replaced with stripe
};

const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  navigation
}) => {
  const route = useRoute<RouteProp<RouteParams, "BookingConfirmationScreen">>();
  const { parkingLot, parkingSlot, vehicle, bookingDetails } = route.params;
  const ConfirmationDetails: ConfirmationDetails = {
    parkingLot: parkingLot,
    parkingSlot: parkingSlot,
    vehicle: vehicle,
    bookingDetails: bookingDetails
    // paymentMethod: paymentMethod  - to be replaced with stripe
  };

  const { user } = useAuth();

  const [openBookingSuccessModal, setOpenBookingSuccessModal] =
    React.useState(false);
  const successBookingModalClose = () => setOpenBookingSuccessModal(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3000";

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${API_URL}/payment-sheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: route.params.bookingDetails.totalprice * 100,
          currency: "gbp",
          description:
            "Payment for parking - " +
            ConfirmationDetails.parkingLot.LotId +
            " - " +
            ConfirmationDetails.parkingSlot.Position.Row +
            ConfirmationDetails.parkingSlot.Position.Column,
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

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setOpenBookingSuccessModal(true);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);
  console.log("ConfirmationDetails", ConfirmationDetails);

  return (
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
                source={require("../../../assets/images/parking-lot-image.png")}
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
            <Text style={{ fontWeight: "500" }}>
              {ConfirmationDetails.parkingLot.LotId}
            </Text>
            {/* //TODO - Add the address of the parking lot */}
            <Text
              numberOfLines={1}
              style={{
                overflow: "hidden",
                marginVertical: 10 * 0.8
              }}
            >
              Leicester, United Kingdom
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
              {ConfirmationDetails.parkingSlot.Position.Row}
              {ConfirmationDetails.parkingSlot.Position.Column}
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
              {dayjs(ConfirmationDetails.bookingDetails.startDateTime).format(
                "dddd, MMMM D, YYYY"
              )}
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
              {dayjs(ConfirmationDetails.bookingDetails.endDateTime).format(
                "dddd, MMMM D, YYYY"
              )}
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
                {dayjs(ConfirmationDetails.bookingDetails.startDateTime).format(
                  "h:mm A"
                )}
              </Text>
              <Text> - </Text>
              <Text>
                {dayjs(ConfirmationDetails.bookingDetails.endDateTime).format(
                  "h:mm A"
                )}
              </Text>
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
              {ConfirmationDetails.bookingDetails.duration}{" "}
              {ConfirmationDetails.bookingDetails.rateType}
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
              {ConfirmationDetails.vehicle.nickName}
              {" |"}
            </Text>

            <Text style={{}}>
              {ConfirmationDetails.vehicle.registrationNumber}
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
            backgroundColor: "white",
            justifyContent: "space-between"
          }}
        >
          {/* price */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontWeight: "500" }}>Price</Text>
            <Text style={{}}>
              <Text>£{ConfirmationDetails.bookingDetails.duration}</Text>
            </Text>
          </View>
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
              <Text>£{ConfirmationDetails.bookingDetails.totalprice}</Text>
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
            parkingLot: ConfirmationDetails.parkingLot,
            parkingSlot: ConfirmationDetails.parkingSlot,
            vehicle: ConfirmationDetails.vehicle,
            bookingDetails: ConfirmationDetails.bookingDetails
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
