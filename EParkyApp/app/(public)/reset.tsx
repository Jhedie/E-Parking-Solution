import ResetPasswordExternalScreen from "@components/Authentication/resetPasswordExternal/screen";
import { Stack } from "expo-router";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sign Up",
          headerShown: true
        }}
      />
      <ResetPasswordExternalScreen />
    </>
  );
}
