import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { TamaguiProvider, Theme } from "tamagui";

import "react-native-get-random-values";
import { CustomToast } from "../components/CustomToast";
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

  return (
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
              <Stack>
                <Stack.Screen
                  name="index"
                  options={{
                    title: "Index",
                    headerShown: true
                  }}
                />
              </Stack>
              <CustomToast />
              <ToastViewport />
            </ToastProvider>
          </ThemeProvider>
        </Theme>
      </TamaguiProvider>
    </Provider>
  );
}
