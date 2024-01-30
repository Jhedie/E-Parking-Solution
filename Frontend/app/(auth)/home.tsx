import { NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BookingScreen } from "../../components/Booking/screen";
import MapScreen, { ParkingLot } from "../../components/Map/screen";

export type ScreenNames = ["Home", "BookingScreen"];
export type HomeStackParamList = {
  Home: undefined;
  BookingScreen: { parkingLot: ParkingLot }; // Define a parameter for the BookingScreen route
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
        />
        <HomeScreenStack.Screen
          name="BookingScreen"
          component={BookingScreen}
        />
      </HomeScreenStack.Navigator>
    </>
  );
}
