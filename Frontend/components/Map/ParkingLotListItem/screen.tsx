import { StyleSheet, View } from "react-native";
import { Button, Image, Text, YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import { ParkingLot } from "../screen";

interface ParkingLotListItemProps {
  parkingLot: ParkingLot;
  navigation: StackNavigation;
  setSelectedParkingLot: React.Dispatch<
    React.SetStateAction<ParkingLot | null>
  >;
}
const ParkingLotListItem: React.FC<ParkingLotListItemProps> = ({
  parkingLot,
  navigation,
  setSelectedParkingLot
}) => {
  return (
    <YStack
      position="absolute"
      bottom={10}
      backgroundColor={"white"}
      width="90%"
      height={200}
      padding={7}
      opacity={0.9}
    >
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Button
            padding={10}
            onPress={() => setSelectedParkingLot(null)}
          >
            X
          </Button>
          <Text style={styles.cardHeaderTitle}>{parkingLot.LotId}</Text>
        </View>

        <View style={styles.cardBody}>
          <Image
            resizeMode="contain"
            source={{
              width: 150,
              height: 100,

              uri: require("../../../assets/images/parking-lot-image.png")
            }}
          />

          <View style={styles.cardBodyDetails}>
            <Text>Capacity: {parkingLot.Capacity}</Text>
            <Text>Occupancy: {parkingLot.Occupancy}</Text>
            <Text>Rate: {parkingLot.Rate}</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Button
            onPress={() => navigation.navigate("BookingScreen", { parkingLot })}
          >
            Book
          </Button>
        </View>
      </View>
    </YStack>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%"
  },
  cardHeader: { display: "flex", flexDirection: "row", alignItems: "center" },
  cardHeaderTitle: { fontSize: 15, fontWeight: "bold", marginLeft: 16 },
  cardBody: { display: "flex", flexDirection: "row", alignItems: "flex-start" },
  cardBodyImage: {},
  cardBodyDetails: { marginLeft: 16 },
  cardFooter: {}
});

export default ParkingLotListItem;
