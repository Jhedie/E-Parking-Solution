import { Car, Sun, User } from "@tamagui/lucide-icons";
import { Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Avatar, ListItem, XStack, YGroup, YStack } from "tamagui";
import { useAuth } from "../../../providers/Authentication/AuthProvider";

const ProfileScreen = () => {
  const { user, signOut } = useAuth();

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
            subTitle={user?.displayName}
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
      </YGroup>
      <XStack>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
            marginTop: 30
          }}
        >
          <AwesomeButton
            height={50}
            width={200}
            onPress={() => signOut()}
            raiseLevel={1}
            borderRadius={10}
            backgroundColor="black"
            backgroundShadow="black"
          >
            <Text
              numberOfLines={1}
              style={{ overflow: "hidden", color: "white" }}
            >
              Sign Out
            </Text>
          </AwesomeButton>
        </View>
      </XStack>
    </YStack>
  );
};

export default ProfileScreen;
