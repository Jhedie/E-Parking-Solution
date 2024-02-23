import { NavigationProp, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BookParkingDetailsScreen } from "../../components/Booking/BookingDetails/screen";
import { SelectSlotScreen } from "../../components/Booking/SelectSlot/screen";
import { AddVehicleScreen } from "../../components/Booking/Vehicle/AddVehicle/screen";
import { VehicleScreen } from "../../components/Booking/Vehicle/SelectVehicle/screen";
import { ParkingLotDetailsScreen } from "../../components/Booking/parkingLotDetails/screen";
import MapScreen, { ParkingLot } from "../../components/Map/screen";

export type ScreenNames = ["Home", "BookingScreen"];
export type HomeStackParamList = {
  Home: undefined;
  ParkingLotDetailsScreen: { parkingLot: ParkingLot }; // Define a parameter for the BookingScreen route
  VehicleScreen: { parkingLot: ParkingLot };
  AddVehicleScreen: undefined;
  BookParkingDetailsScreen: undefined;
  SelectSlotScreen: undefined;
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
      </HomeScreenStack.Navigator>
  );
}

export default function Screen() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}