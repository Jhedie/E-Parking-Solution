import { Stack } from "expo-router";
import SignUpScreen from "../../components/Authentication/SignUp/screen";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sign Up",
          headerShown: false
        }}
      />

      <SignUpScreen />
    </>
  );
}
