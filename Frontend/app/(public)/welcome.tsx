import { Stack } from "expo-router";
import { WelcomeScreen } from "../../components/Welcome/screen";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sign Up",
          headerShown: true,
        }}
      />

      <WelcomeScreen />
    </>
  );
}
