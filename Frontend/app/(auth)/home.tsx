import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BookingScreen } from "../../components/Booking/screen";
import MapScreen, { ParkingLot } from "../../components/Map/screen";
import { BookParkingDetailsScreen } from "../../components/Parking/ParkingDetails/screen";
import { AddVehicleScreen } from "../../components/Vehicle/AddVehicle/screen";
import { VehicleScreen } from "../../components/Vehicle/screen";

export type ScreenNames = ["Home", "BookingScreen"];
export type HomeStackParamList = {
  Home: undefined;
  BookingScreen: { parkingLot: ParkingLot }; // Define a parameter for the BookingScreen route
  VehicleScreen: undefined;
  AddVehicleScreen: undefined;
  BookParkingDetailsScreen: undefined;
};
export type StackNavigation = NavigationProp<HomeStackParamList>;

export default function Screen() {
  const HomeScreenStack = createNativeStackNavigator<HomeStackParamList>();
  return (
    <>
      <HomeScreenStack.Navigator initialRouteName="Home">
        <HomeScreenStack.Screen
          name="Home"
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <HomeScreenStack.Screen
          name="BookingScreen"
          component={BookingScreen}
          options={{ headerTitle: "Booking" }}
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
      </HomeScreenStack.Navigator>
    </>
  );
}
