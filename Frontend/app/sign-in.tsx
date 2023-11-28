import { Stack } from "expo-router";

import SignInScreen from "../components/Authentication/SignIn/screen";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sign In"
        }}
      />

      <SignInScreen />
    </>
  );
}
