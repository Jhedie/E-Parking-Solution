import auth from "@react-native-firebase/auth";
import "expo-dev-client";
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

import { Button, Text } from "tamagui";
const App: React.FC = () => {
  const user = auth().currentUser;
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      <Button
        themeInverse
        onPress={() => auth().signOut()}
      >
        <Text>Logout</Text>
      </Button>
      <Text>{user?.email}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: "100%",
    height: "80%"
  }
});
export default App;
