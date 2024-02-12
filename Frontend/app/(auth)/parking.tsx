import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CurrentParkingScreen } from "../../components/Parking/Current/screen";
import { ParkingHistoryScreen } from "../../components/Parking/History/screen";
export default function Screen() {
  const ParkingTopTabs = createMaterialTopTabNavigator();
  return (
    <>
      <ParkingTopTabs.Navigator>
        <ParkingTopTabs.Screen
          name="Current"
          component={CurrentParkingScreen}
        />
        <ParkingTopTabs.Screen
          name="History"
          component={ParkingHistoryScreen}
        />
      </ParkingTopTabs.Navigator>
    </>
  );
}
