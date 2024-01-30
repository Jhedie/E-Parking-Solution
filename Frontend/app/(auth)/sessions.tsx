import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HistoryScreen } from "../../components/History/screen";
import { SessionScreen } from "../../components/Session/screen";
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
