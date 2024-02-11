import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SessionScreen } from "../../components/Booking/Session/screen";
import { HistoryScreen } from "../../components/History/screen";
export default function Screen() {
  const SessionTopTabs = createMaterialTopTabNavigator();
  return (
    <>
      <SessionTopTabs.Navigator>
        <SessionTopTabs.Screen
          name="Current"
          component={SessionScreen}
        />
        <SessionTopTabs.Screen
          name="History"
          component={HistoryScreen}
        />
      </SessionTopTabs.Navigator>
    </>
  );
}
