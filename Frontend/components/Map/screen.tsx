import "expo-dev-client";
import React, { useContext } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE
} from "react-native-maps";

import { YStack } from "tamagui";
import { useAuth } from "../../providers/Authentication/AuthProvider";
import { UserLocationContext } from "../../providers/UserLocation/UserLocationProvider";
import MapViewStyle from "../../utils/MapViewStyle.json";

const MapScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const userLocationContext = useContext(UserLocationContext);

  if (!userLocationContext) {
    throw new Error("MapScreen must be used within a UserLocationProvider");
  }
  const { location, setLocation } = userLocationContext;

  return (
    location?.coords.latitude && (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
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
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
          ></Marker>
        </MapView>
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
