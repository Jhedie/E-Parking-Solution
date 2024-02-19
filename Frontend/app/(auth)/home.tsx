import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BookParkingDetailsScreen } from "../../components/Booking/BookingDetails/screen";

import BookingConfirmationScreen from "../../components/Booking/BookingConfirmation/screen";
import { ParkingTicketScreen } from "../../components/Booking/ParkingTicket/screen";
import {
  ParkingSpot,
  SelectSpotScreen
} from "../../components/Booking/SelectSpot/screen";
import { AddVehicleScreen } from "../../components/Booking/Vehicle/AddVehicle/screen";
import {
  Vehicle,
  VehicleScreen
} from "../../components/Booking/Vehicle/SelectVehicle/screen";
import { ParkingLotDetailsScreen } from "../../components/Booking/parkingLotDetails/screen";
import { AddPaymentOptionScreen } from "../../components/Booking/payment/addPaymentOption/screen";
import {
  PaymentMethod,
  PaymentOptionScreen
} from "../../components/Booking/payment/selectPaymentOption/screen";
import MapScreen, { ParkingLot } from "../../components/Map/screen";

export type ScreenNames = [
  "Home",
  "BookingScreen",
  "VehicleScreen",
  "AddVehicleScreen",
  "BookParkingDetailsScreen",
  "SelectSpotScreen",
  "PaymentOptionScreen",
  "AddPaymentOptionScreen",
  "BookingConfirmationScreen",
  "ParkingTicketScreen"
];
export type HomeStackParamList = {
  Home: undefined;
  ParkingLotDetailsScreen: { parkingLot: ParkingLot }; // Define a parameter for the BookingScreen route
  VehicleScreen: { parkingLot: ParkingLot };
  AddVehicleScreen: undefined;
  BookParkingDetailsScreen: {
    parkingLot: ParkingLot;
    vehicle: Vehicle;
  };
  SelectSpotScreen: { parkingLot: ParkingLot; vehicle: Vehicle };
  PaymentOptionScreen: {
    parkingLot: ParkingLot;
    parkingSpot: ParkingSpot;
    vehicle: Vehicle;
  };
  AddPaymentOptionScreen: undefined;
  BookingConfirmationScreen: {
    parkingLot: ParkingLot;
    parkingSpot: ParkingSpot;
    vehicle: Vehicle;
    paymentMethod: PaymentMethod;
  };
  ParkingTicketScreen: undefined;
};
export type StackNavigation = NavigationProp<HomeStackParamList>;

export default function Screen() {
  const HomeScreenStack = createNativeStackNavigator<HomeStackParamList>();
  return (
    <HomeScreenStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleStyle: { fontSize: 15 }
      }}
    >
      <HomeScreenStack.Screen
        name="Home"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <HomeScreenStack.Screen
        name="ParkingLotDetailsScreen"
        component={ParkingLotDetailsScreen}
        options={{
          headerTitle: "Parking Details"
        }}
      />
      <HomeScreenStack.Screen
        name="VehicleScreen"
        component={VehicleScreen}
        options={{ headerTitle: "Select your Vehicle" }}
      />
      <HomeScreenStack.Screen
        name="AddVehicleScreen"
        component={AddVehicleScreen}
        options={{
          headerTitle: "Add Vehicle",
          presentation: "modal"
        }}
      />
      <HomeScreenStack.Screen
        name="BookParkingDetailsScreen"
        component={BookParkingDetailsScreen}
        options={{ headerTitle: "Booking Details" }}
      />
      <HomeScreenStack.Screen
        name="SelectSpotScreen"
        component={SelectSpotScreen}
        options={{ headerTitle: "Select Slot" }}
      />
      <HomeScreenStack.Screen
        name="PaymentOptionScreen"
        component={PaymentOptionScreen}
        options={{ headerTitle: "Payment" }}
      />
      <HomeScreenStack.Screen
        name="AddPaymentOptionScreen"
        component={AddPaymentOptionScreen}
        options={{
          headerTitle: "Add Payment Option",
          presentation: "modal"
        }}
      />
      <HomeScreenStack.Screen
        name="BookingConfirmationScreen"
        component={BookingConfirmationScreen}
        options={{
          headerTitle: "Booking Confirmation"
        }}
      />
      <HomeScreenStack.Screen
        name="ParkingTicketScreen"
        component={ParkingTicketScreen}
        options={{
          headerTitle: "Parking Ticket"
        }}
      />
    </HomeScreenStack.Navigator>
  );
}
