import { CancelParkingScreen } from "@components/Parking/CancelParking/screen";
import { ExtendParkingScreen } from "@components/Parking/ExtendParking/screen";
import { ParkingTicketScreen } from "@components/Parking/ParkingTicket/screen";
import { ReservationWithLot } from "@models/ReservationWithLot";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CurrentParkingScreen } from "../../components/Parking/Current/screen";
import { ParkingHistoryScreen } from "../../components/Parking/History/screen";
import { TimerScreen } from "../../components/Parking/Timer/screen";

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
    reservation: ReservationWithLot;
  };
  ParkingTicket: {
    reservation: ReservationWithLot;
  };
  ExtendParkingScreen: { reservation: ReservationWithLot };
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
      <ParkingScreenStack.Screen
        name="ExtendParkingScreen"
        component={ExtendParkingScreen}
        options={{ headerShown: true }}
      />
    </ParkingScreenStack.Navigator>
  );
}
