import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments
} from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useEffect } from "react";
import { WelcomeScreen } from "../components/Welcome/screen";
import { useAuth } from "../contexts/FirebaseAuthContext";
export default function Screen() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  console.log("segments", segments);

  useEffect(() => {
    //avoid navigating before the navigator is ready. It also avoids having to add a listener to the navigation state.
    if (!rootNavigationState?.key) return;

    if (!initializing) return;

    const inTabsGroup = segments[0] === "(app)";
    if (user && !inTabsGroup) {
      console.log("routing to main");
      router.replace("/(auth)/home");
    } else if (!user) {
      console.log("routing to sign-up");
      router.replace("/(public)/welcome");
    }
  }, [user, rootNavigationState?.key, segments]);
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator
        size="large"
        color="#0000ff"
      />
    </View>
  );
}
