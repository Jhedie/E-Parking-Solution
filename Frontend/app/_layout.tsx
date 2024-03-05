import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-get-random-values";
import { Provider } from "react-redux";
import { TamaguiProvider, Theme } from "tamagui";
import { CustomToast } from "../components/CustomToast";
import { AuthProvider } from "../providers/Authentication/AuthProvider";
import { UserLocationProvider } from "../providers/UserLocation/UserLocationProvider";
import { store } from "../store/index";
import config from "../tamagui.config";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
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
    <QueryClientProvider client={queryClient}>
      <UserLocationProvider>
        <StripeProvider
          publishableKey="pk_test_51OlYLWB1AMLkBmu1BFmgWiauMWOF8ceITmtOaLoEKq9lfLPk6aTfSUlBPDVBtPEgHWqSCuuMMwSfrs88Gud7LQ4k00IBlTIko7"
          merchantIdentifier="merchant.com.jhedie.frontend"
        >
          <Provider store={store}>
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
          </Provider>
        </StripeProvider>
      </UserLocationProvider>
    </QueryClientProvider>
  );
}
