import { ConfigProvider } from "@providers/Config/ConfigProvider";
import NetInfo from "@react-native-community/netinfo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import {
  QueryClient,
  QueryClientProvider,
  onlineManager
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-get-random-values";
import { TamaguiProvider, Theme } from "tamagui";
import { CustomToast } from "../components/CustomToast";
import { AuthProvider } from "../providers/Authentication/AuthProvider";
import { UserLocationProvider } from "../providers/UserLocation/UserLocationProvider";
import config from "../tamagui.config";

import { ReservationProvider } from "@providers/Reservation/ReservationProvider";
import { focusManager } from "@tanstack/react-query";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // Set an event listener for online status changes using the onlineManager from react-query.
  // This listener uses the NetInfo library to listen for connectivity changes and updates the online status.
  onlineManager.setEventListener((setOnline) => {
    console.log("Setting online manager");
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });

  // Define a function to handle app state changes (active, background, etc.).
  // This function updates the focus state in the application using the focusManager from react-query,
  // but only for platforms other than web.
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }
  // Use an effect to subscribe to app state changes when the component mounts.
  // This effect adds an event listener to the AppState, which calls onAppStateChange whenever the app state changes.
  // It also cleans up by removing the event listener when the component unmounts.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf")
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  // Create a new instance of QueryClient
  const queryClient = new QueryClient();

  return (
    <UserLocationProvider>
      <ConfigProvider>
        <ReservationProvider>
          <StripeProvider
            publishableKey="pk_test_51OlYLWB1AMLkBmu1BFmgWiauMWOF8ceITmtOaLoEKq9lfLPk6aTfSUlBPDVBtPEgHWqSCuuMMwSfrs88Gud7LQ4k00IBlTIko7"
            merchantIdentifier="merchant.com.jhedie.frontend"
          >
            <QueryClientProvider client={queryClient}>
              <TamaguiProvider config={config}>
                <Theme name={colorScheme}>
                  <ThemeProvider
                    value={colorScheme === "light" ? DefaultTheme : DarkTheme}
                  >
                    <ToastProvider
                      swipeDirection="horizontal"
                      duration={6000}
                      native={["mobile"]}
                    >
                      <AuthProvider>
                        <Stack
                          screenOptions={{
                            headerShown: false
                          }}
                        ></Stack>
                      </AuthProvider>
                      <CustomToast />
                      <ToastViewport />
                    </ToastProvider>
                  </ThemeProvider>
                </Theme>
              </TamaguiProvider>
            </QueryClientProvider>
          </StripeProvider>
        </ReservationProvider>
      </ConfigProvider>
    </UserLocationProvider>
  );
}
