import { ActivityIndicator, View } from "react-native";
import { Spinner, YStack } from "tamagui";

export default function Screen() {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
    >
      <Spinner size="large" />
    </YStack>
  );
}
