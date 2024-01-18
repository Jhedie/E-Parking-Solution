import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useEffect } from "react";
import { useAuth } from "../contexts/FirebaseAuthContext";
export default function Screen() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  console.log("segments", segments);
  console.log("user", user);
  console.log("initializing", initializing);

  useEffect(() => {
    //avoid navigating before the navigator is ready. It also avoids having to add a listener to the navigation state.

    if (!initializing) return;

    if (!rootNavigationState?.key) return;
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
