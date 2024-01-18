import auth from "@react-native-firebase/auth";
import "expo-dev-client";
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import { H3, YStack } from "tamagui";
const App: React.FC = () => {
  const user = auth().currentUser;
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
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
export default App;
