import { Car, Sun, User } from "@tamagui/lucide-icons";
import { GestureResponderEvent, Text } from "react-native";
import {
  Avatar,
  Button,
  ButtonText,
  H3,
  ListItem,
  XStack,
  YGroup,
  YStack
} from "tamagui";
import { useAuth } from "../../../providers/Authentication/AuthProvider";

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  function handleSignOutButtonPress(event: GestureResponderEvent): void {
    event.preventDefault();
    signOut();
  }

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="$6"
    >
      <XStack
        alignItems="center"
        gap="$6"
      >
        <Avatar
          circular
          size="$10"
        >
          <Avatar.Image
            accessibilityLabel="Cam"
            src="https://picsum.photos/200/300"
          />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
      </XStack>

      <Text>Name: {user?.email}</Text>

      <YGroup
        alignSelf="center"
        bordered
        width={300}
        size="$4"
      >
        <YGroup.Item>
          <ListItem
            hoverTheme
            icon={User}
            title="Name"
            subTitle="John Doe"
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            hoverTheme
            icon={Sun}
            title="Email"
            subTitle={user?.email}
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            hoverTheme
            icon={Car}
            title="Your Vehicle"
            subTitle="ABC-123"
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            hoverTheme
            title="Parking Spot"
            subTitle="B3"
          />
        </YGroup.Item>
      </YGroup>
      <XStack>
        <Button onPress={handleSignOutButtonPress}>
          <ButtonText>Sign Out</ButtonText>
        </Button>
      </XStack>
    </YStack>
  );
};

export default ProfileScreen;
