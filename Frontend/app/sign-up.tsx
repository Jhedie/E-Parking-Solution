import { Stack } from "expo-router";

import SignUpScreen from "../components/Authentication/Register/screen";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sign Up"
        }}
      />
      <SignUpScreen />
    </>
  );
}
