import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ParkingTicketScreen } from "../../components/Booking/ParkingTicket/screen";
import { CurrentParkingScreen } from "../../components/Parking/Current/screen";
import { ParkingHistoryScreen } from "../../components/Parking/History/screen";
import { TimerScreen } from "../../components/Parking/Timer/screen";
import { ParkingLot } from "@models/ParkingLot";
import { Vehicle } from "@models/Vehicle";
import { ParkingSlot } from "@models/ParkingSlot";
import { BookingDetails } from "@models/BookingDetails";

// This is the top tabs navigator for the parking screen
function ParkingTopTabsNavigator() {
  const ParkingTopTabs = createMaterialTopTabNavigator();
  return (
    <>
      <ParkingTopTabs.Navigator>
        <ParkingTopTabs.Screen
          name="Current"
          component={CurrentParkingScreen}
        ></ParkingTopTabs.Screen>
        <ParkingTopTabs.Screen
          name="History"
          component={ParkingHistoryScreen}
        />
      </ParkingTopTabs.Navigator>
    </>
  );
}

export type ParkingStackParamList = {
  ParkingTopTabsNavigator: undefined;
  TimerScreen: {
    parkingLot: ParkingLot;
    parkingSlot: ParkingSlot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
  };
  ParkingTicket: {
    parkingLot: ParkingLot;
    parkingSlot: ParkingSlot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
  };
  // Other screens
};

export type ParkingStackNavigation = NavigationProp<ParkingStackParamList>;

export default function Screen() {
  const ParkingScreenStack =
    createNativeStackNavigator<ParkingStackParamList>();

  return (
    <ParkingScreenStack.Navigator>
      {/* Other screens */}
      <ParkingScreenStack.Screen
        name="ParkingTopTabsNavigator"
        component={ParkingTopTabsNavigator}
        options={{ headerShown: false }}
      />
      <ParkingScreenStack.Screen
        name="TimerScreen"
        component={TimerScreen}
        options={{ headerShown: false, presentation: "modal" }}
      />
      {/* parkingTicket */}
      <ParkingScreenStack.Screen
        name="ParkingTicket"
        component={ParkingTicketScreen}
        options={{ headerShown: false, presentation: "modal" }}
      />
      {/* Extend Ticket */}
    </ParkingScreenStack.Navigator>
  );
}
