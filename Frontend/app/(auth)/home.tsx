import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BookParkingDetailsScreen } from "../../components/Booking/BookingDetails/screen";

import BookingConfirmationScreen from "../../components/Booking/BookingConfirmation/screen";
import { ParkingTicketScreen } from "../../components/Booking/ParkingTicket/screen";

import { SelectSlotScreen } from "@components/Booking/SelectSlot/screen";
import { BookingDetails } from "@models/BookingDetails";
import { ParkingLot } from "@models/ParkingLot";
import { Rate } from "@models/ParkingLotRate";
import { ParkingSlot } from "@models/ParkingSlot";
import { Vehicle } from "@models/Vehicle";
import { AddVehicleScreen } from "../../components/Booking/Vehicle/AddVehicle/screen";
import { VehicleScreen } from "../../components/Booking/Vehicle/SelectVehicle/screen";
import { ParkingLotDetailsScreen } from "../../components/Booking/parkingLotDetails/screen";
import MapScreen from "../../components/Map/screen";

export type ScreenNames = [
  "Home",
  "BookingScreen",
  "VehicleScreen",
  "AddVehicleScreen",
  "BookParkingDetailsScreen",
  "SelectSlotScreen",
  "BookingConfirmationScreen",
  "ParkingTicketScreen"
];
export type HomeStackParamList = {
  Home: undefined;
  OnboardingScreen: undefined;
  ParkingLotDetailsScreen: { parkingLot: ParkingLot };
  VehicleScreen: { parkingLot: ParkingLot };
  AddVehicleScreen: undefined;
  BookParkingDetailsScreen: {
    parkingLot: ParkingLot;
    vehicle: Vehicle;
  };
  SelectSlotScreen: {
    parkingLot: ParkingLot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
    selectedRate: Rate;
  };
  PaymentOptionScreen: {
    parkingLot: ParkingLot;
    parkingSlot: ParkingSlot;
    vehicle: Vehicle;
  };
  AddPaymentOptionScreen: undefined;
  BookingConfirmationScreen: {
    parkingLot: ParkingLot;
    parkingSlot: ParkingSlot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
    selectedRate: Rate;
  };
  ParkingTicketScreen: {
    parkingLot: ParkingLot;
    parkingSlot: ParkingSlot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
    selectedRate: Rate;
  };
};
export type StackNavigation = NavigationProp<HomeStackParamList>;

const HomeScreenStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStack() {
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
        name="SelectSlotScreen"
        component={SelectSlotScreen}
        options={{ headerTitle: "Select Slot" }}
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
export default function Screen() {
  return <HomeStack />;
}
