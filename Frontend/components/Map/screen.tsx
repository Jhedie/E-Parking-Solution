import "expo-dev-client";
import React, { useContext } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  enableLatestRenderer
} from "react-native-maps";

import { Image, YStack } from "tamagui";
import { StackNavigation } from "../../app/(auth)/home";
import parkingLots from "../../assets/data/parkingLots.json";
import { UserLocationContext } from "../../providers/UserLocation/UserLocationProvider";
import ParkingLotMarker from "./Markers/ParkingLotMarker/screen";
import ParkingLotListItem from "./ParkingLotListItem/screen";

export type ParkingLot = {
  LotId: string;
  Location: {
    Latitude: string;
    Longitude: string;
  };
  Owner: {
    OwnerId: string;
    Name: string;
  };
  Capacity: number;
  Occupancy: number;
  LiveStatus: string;
  Rate: string;
  OperatingHours: string;
  Facilities: string[];
};

interface MapScreenProps {
  navigation: StackNavigation;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const userLocationContext = useContext(UserLocationContext);
  const [selectedParkingLot, setSelectedParkingLot] =
    React.useState<ParkingLot | null>(null);

  if (!userLocationContext) {
    throw new Error("MapScreen must be used within a UserLocationProvider");
  }
  const { location } = userLocationContext;
  enableLatestRenderer();
  return (
    location?.coords.latitude && (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        bottom={0}
      >
        <MapView
          style={styles.map}
          provider={
            Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
          }}
        >
          {parkingLots.map((parkingLot) => (
            <ParkingLotMarker
              key={parkingLot.LotId}
              parkingLot={parkingLot}
              onPress={() => {
                setSelectedParkingLot(parkingLot);
              }}
            />
          ))}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
          >
            <Image
              source={require("../../assets/images/sports-car.png")}
              style={{ width: 35, height: 35 }}
            />
          </Marker>
        </MapView>
        {/* Display selected apartment */}
        {selectedParkingLot && (
          <ParkingLotListItem
            parkingLot={selectedParkingLot}
            navigation={navigation}
            setSelectedParkingLot={setSelectedParkingLot}
          />
        )}
      </YStack>
    )
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
});
export default MapScreen;
