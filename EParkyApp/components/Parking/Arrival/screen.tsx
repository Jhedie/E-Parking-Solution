import { ParkingStackNavigation } from "@/(auth)/parking";
import { ReservationWithLot } from "@models/ReservationWithLot";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";

export interface ArrivalScreenProps {
  navigation: ParkingStackNavigation;
}

export type RouteParams = {
  reservation: ReservationWithLot;
};

export const ArrivalScreen: React.FC<ArrivalScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams, "reservation">>();

  const reservation = route.params["reservation"] as ReservationWithLot;
  return (
    <YStack flex={1}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginHorizontal: 10 * 2,
          marginVertical: 10 * 2.4,
          backgroundColor: "white",
          borderRadius: 10
        }}
      >
        <View style={{ marginBottom: 10 * 2, marginTop: 10 * 2 }}>
          <Text
            style={{
              color: "black",
              fontSize: 24,
              fontWeight: "bold"
            }}
          >
            Your Slot Position
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 100, fontWeight: "bold" }}>
            {reservation.slotDetails.position.row}
          </Text>
          <Text style={{ fontSize: 100, fontWeight: "bold" }}>
            {reservation.slotDetails.position.column}
          </Text>
        </View>

        <View style={{ marginTop: 10 * 2 }}>
          <Text style={{ fontSize: 16, textAlign: "center" }}>
            Please ensure that the slot you have occupied is the correct one. If
            it is incorrect, please report the slot as occupied.
          </Text>
        </View>
        <View style={{ marginTop: 10 * 2, justifyContent: "flex-end" }}>
          <AwesomeButton
            height={50}
            raiseLevel={1}
            borderRadius={10}
            backgroundShadow="#fff"
            backgroundDarker="#fff"
            backgroundColor="lightblue"
            onPress={() => {
              navigation.goBack();
              navigation.goBack();
              navigation.navigate("ReportOccupiedSlotScreen", {
                reservation
              });
            }}
          >
            <Text style={{ color: "black", fontWeight: "500" }}>
              {" "}
              Slot Unavailable?{" "}
            </Text>
          </AwesomeButton>
        </View>
      </View>
    </YStack>
  );
};
