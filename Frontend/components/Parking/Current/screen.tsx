import React from "react";
import { H3, YStack } from "tamagui";

export const CurrentParkingScreen: React.FC = () => {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      bottom={0}
    >
      <H3>Current Parking</H3>
    </YStack>
  );
};
