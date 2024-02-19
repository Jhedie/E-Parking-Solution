import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import { ParkingLot } from "../../Map/screen";
import { ParkingSpot } from "../SelectSpot/screen";
import { Vehicle } from "../Vehicle/SelectVehicle/screen";
import { PaymentMethod } from "../payment/selectPaymentOption/screen";
import BookingSuccessModal from "./BookingSuccess/screen";

interface BookingConfirmationScreenProps {
  navigation: StackNavigation;
}

type RouteParams = {
  BookingConfirmationScreen: {
    parkingLot: ParkingLot;
    parkingSpot: ParkingSpot;
    vehicle: Vehicle;
    paymentMethod: PaymentMethod;
  };
};

export type ConfirmationDetails = {
  parkingLot: ParkingLot;
  parkingSpot: ParkingSpot;
  vehicle: Vehicle;
  paymentMethod: PaymentMethod;
};

const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  navigation
}) => {
  const route = useRoute<RouteProp<RouteParams, "BookingConfirmationScreen">>();
  const { parkingLot, parkingSpot, vehicle, paymentMethod } = route.params;
  const ConfirmationDetails: ConfirmationDetails = {
    parkingLot: parkingLot,
    parkingSpot: parkingSpot,
    vehicle: vehicle,
    paymentMethod: paymentMethod
  };

  const [openBookingSuccessModal, setOpenBookingSuccessModal] =
    React.useState(false);
  const successBookingModalClose = () => setOpenBookingSuccessModal(false);
  console.log(ConfirmationDetails);

  return (
    <YStack flex={1}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* print the details accumulated by ConfirmationDetails */}

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
                width: 50,
                height: 50,
                backgroundColor: "black"
              }}
            />
          </View>
          <View
            style={{
              flex: 7.5,
              alignItems: "flex-start",
              marginLeft: 10 * 1.5,
              marginRight: 0
            }}
          >
            <Text style={{}}>{ConfirmationDetails.parkingLot.LotId}</Text>
            <Text
              numberOfLines={1}
              style={{
                overflow: "hidden",
                marginVertical: 10 * 0.8
              }}
            >
              Leicester, United Kingdom
            </Text>
            <Text style={{}}>{ConfirmationDetails.parkingLot.Rate}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10 * 1.5,
            paddingVertical: 10,
            marginBottom: 10,
            marginHorizontal: 10 * 2,
            borderRadius: 5,
            backgroundColor: "white"
          }}
        >
          <View style={{ marginHorizontal: 10 * 1.5 }}>
            <Text style={{}}>Parking Spot</Text>
            <Text
              style={{
                marginTop: 10 * 0.4
              }}
            >
              {ConfirmationDetails.parkingSpot.SpotID}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10 * 1.5,
            paddingVertical: 10,
            marginBottom: 10,
            marginHorizontal: 10 * 2,
            borderRadius: 5,
            backgroundColor: "white"
          }}
        >
          <View style={{ marginHorizontal: 10 * 1.5 }}>
            <Text style={{}}>Booking Details</Text>
            <Text
              style={{
                marginTop: 10 * 0.4
              }}
            ></Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10 * 1.5,
            paddingVertical: 10,
            marginBottom: 10,
            marginHorizontal: 10 * 2,
            borderRadius: 5,
            backgroundColor: "white"
          }}
        >
          <View style={{ marginHorizontal: 10 * 1.5 }}>
            <Text style={{}}>Vehicle Details</Text>
            <Text
              style={{
                marginTop: 10 * 0.4
              }}
            >
              {ConfirmationDetails.vehicle.VehicleID}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10 * 1.5,
            paddingVertical: 10,
            marginBottom: 10,
            marginHorizontal: 10 * 2,
            borderRadius: 5,
            backgroundColor: "white"
          }}
        >
          <View style={{ marginHorizontal: 10 * 1.5 }}>
            <Text style={{}}>Payment Method</Text>
            <Text
              style={{
                marginTop: 10 * 0.4
              }}
            >
              {ConfirmationDetails.paymentMethod.type}
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
          onPress={() => setOpenBookingSuccessModal(true)}
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
          navigation.navigate("ParkingTicketScreen");
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
