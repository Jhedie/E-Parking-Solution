import { RouteProp, useRoute } from "@react-navigation/native";

import React from "react";
import { Button, H3, Paragraph, YStack } from "tamagui";
import { ParkingLot } from "../Map/screen";

type RouteParams = {
  BookingScreen: {
    parkingLot: ParkingLot;
  };
};
export const BookingScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, "BookingScreen">>();
  const { parkingLot } = route.params;
  return (
    <YStack>
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
      ></YStack>
      <H3>Booking</H3>
      {
        <Paragraph>
          {/* Print all parking details */}
          {JSON.stringify(parkingLot, null, 2)}
        </Paragraph>
      }

      <Button themeInverse>Book</Button>
    </YStack>
  );
};
