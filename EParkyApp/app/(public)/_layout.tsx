import { Stack } from "expo-router";

const PublicLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          headerTitle: "Sign In"
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="sign-up"
        options={{
          headerTitle: "Sign Up"
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: "Reset Password"
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="welcome"
        options={{
          headerTitle: "Welcome"
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="verification"
        options={{
          headerTitle: "Verification"
        }}
      ></Stack.Screen>
    </Stack>
  );
};

export default PublicLayout;
