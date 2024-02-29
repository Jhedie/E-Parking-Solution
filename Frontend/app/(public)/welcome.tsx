import { storage } from "@utils/asyncStorage";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { Button, YStack } from "tamagui";
import { WelcomeScreen } from "../../components/Welcome/screen";

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Sign Up",
          headerShown: true
        }}
      />

      <WelcomeScreen />
      {/* 
      <View>
        <Button
          onPress={() => {
            const reset = async () => {
              await storage.setItem("onboarding", 0);
              console.log("pressed");
            };
            reset();
          }}
          themeInverse
        >
          Reset OnBoarding
        </Button>
      </View> */}
    </>
  );
}
