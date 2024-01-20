import { Stack } from "expo-router";
import VerificationScreen from "../../components/Authentication/Verification/screen";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Verification",
          headerShown: false
        }}
      />
      <VerificationScreen />
    </>
  );
}
