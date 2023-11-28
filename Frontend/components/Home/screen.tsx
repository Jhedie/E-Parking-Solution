import { Link } from "expo-router";
import { Button, H1, YStack } from "tamagui";

export default function HomeScreen() {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space
    >
      <H1>Parking App</H1>
      <YStack space="$2">
        <Link
          href={"/sign-up"}
          asChild
        >
          <Button>Register</Button>
        </Link>
        <Link
          href={"/sign-in"}
          asChild
        >
          <Button>Login</Button>
        </Link>
        <Link
          href={"/main"}
          asChild
        >
          <Button>Map</Button>
        </Link>
      </YStack>
    </YStack>
  );
}
