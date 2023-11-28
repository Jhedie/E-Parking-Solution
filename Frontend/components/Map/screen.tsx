import "expo-dev-client";

import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import * as Location from "expo-location";

import { RN_MAPBOX_MAPS_DOWNLOAD_TOKEN } from "@env";
Mapbox.setAccessToken(RN_MAPBOX_MAPS_DOWNLOAD_TOKEN);

interface Location {
  latitude: number;
  longitude: number;
}

const App: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <Mapbox.MapView style={styles.map}>
          <Mapbox.Camera
            zoomLevel={1}
            centerCoordinate={[location.longitude, location.latitude]}
            animationMode="flyTo"
            animationDuration={2000}
          />
        </Mapbox.MapView>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  map: {
    flex: 1
  }
});
