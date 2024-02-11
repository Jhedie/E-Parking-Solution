import { RouteProp, useRoute } from "@react-navigation/native";

import React from "react";
import { Button, H3, Paragraph, YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import { ParkingLot } from "../../Map/screen";

type RouteParams = {
  ParkingLotDetailsScreen: {
    parkingLot: ParkingLot;
  };
};

interface ParkingLotDetailsScreenProps {
  navigation: StackNavigation;
}

export const ParkingLotDetailsScreen: React.FC<
  ParkingLotDetailsScreenProps
> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams, "ParkingLotDetailsScreen">>();
  const { parkingLot } = route.params;
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      {
        <Paragraph>
          {/* Print all parking details */}
          {JSON.stringify(parkingLot, null, 2)}
        </Paragraph>
      }

      <Button
        themeInverse
        onPress={() => navigation.navigate("VehicleScreen")}
      >
        Proceed to Booking
      </Button>
    </YStack>
  );
};
