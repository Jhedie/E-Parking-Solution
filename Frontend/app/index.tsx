import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";

export default function Screen() {
  const { initializing } = useAuth();
  console.log("initializing", initializing);
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }
}
