import "expo-dev-client";
import React, { useContext } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  enableLatestRenderer
} from "react-native-maps";

import { Image, Text, XStack, YStack } from "tamagui";
import parkingLots from "../../assets/data/parkingLots.json";
import { UserLocationContext } from "../../providers/UserLocation/UserLocationProvider";
import MapViewStyle from "../../utils/MapViewStyle.json";
import ParkingLotListItem from "./ParkingLotListItem/screen";

type ParkingLot = {
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

const MapScreen: React.FC = () => {
  const userLocationContext = useContext(UserLocationContext);
  const [selectedParkingLot, setSelectedParkingLot] =
    React.useState<ParkingLot | null>(null);

  if (!userLocationContext) {
    throw new Error("MapScreen must be used within a UserLocationProvider");
  }
  const { location } = userLocationContext;
  enableLatestRenderer();
  console.log("parking", parkingLots);
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
          customMapStyle={MapViewStyle}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
          }}
          onPress={() => setSelectedParkingLot(null)}
        >
          {parkingLots.map((parkingLot, index) => (
            <Marker
              onPress={() => setSelectedParkingLot(parkingLot)}
              coordinate={{
                latitude: parseFloat(parkingLot.Location.Latitude),
                longitude: parseFloat(parkingLot.Location.Longitude)
              }}
              title={parkingLot.LotId}
              description="Parking Lot"
              key={index}
            >
              <Image
                source={require("../../assets/images/parking-lot-marker.png")}
                style={{ width: 35, height: 35 }}
              />
              {/* <YStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                backgroundColor={"white"}
                padding={10}
                borderRadius={10}
              ></YStack> */}
            </Marker>
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
          <ParkingLotListItem parkingLot={selectedParkingLot} />
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
    width: "100%",
    height: "100%"
  }
});
export default MapScreen;
