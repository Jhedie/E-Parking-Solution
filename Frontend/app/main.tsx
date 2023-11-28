import { Stack } from "expo-router";

import MapScreen from "../components/Map/screen";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "main"
        }}
      />

      <MapScreen />
    </>
  );
}
