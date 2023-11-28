import { Stack, useRouter } from "expo-router";

import HomeScreen from "../components/Home/screen";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true
        }}
      />
      <HomeScreen />
    </>
  );
}
