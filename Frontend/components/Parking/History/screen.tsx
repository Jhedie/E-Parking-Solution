import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { H3, YStack } from "tamagui";

export const ParkingHistoryScreen: React.FC = () => {
  return (
    <SafeAreaView>
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
      ></YStack>
      <H3>History</H3>
    </SafeAreaView>
  );
};
