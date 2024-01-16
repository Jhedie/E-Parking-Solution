import { Stack } from "expo-router";
import React from "react";

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
          headerTitle: "Sign In",
          headerShown: false
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="sign-up"
        options={{
          headerTitle: "Sign Up",
          headerShown: false
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: "Reset Password",
          headerShown: false
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="welcome"
        options={{
          headerTitle: "Welcome",
          headerShown: false
        }}
      ></Stack.Screen>
    </Stack>
  );
};

export default PublicLayout;
