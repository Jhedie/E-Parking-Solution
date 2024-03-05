import { storage } from "@utils/asyncStorage";
import { Link, useRouter } from "expo-router";
import { Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Button, H1, Paragraph, SizableText, XStack, YStack } from "tamagui";

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  return (
    <YStack
      flex={1}
      justifyContent="space-around"
      alignItems="center"
      gap="$3"
    >
      <H1>Welcome</H1>
      <YStack>
        <View>
          <AwesomeButton
            height={50}
            width={200}
            onPress={() => {
              router.push("/(public)/sign-in");
            }}
            raiseLevel={1}
            borderRadius={10}
            backgroundColor="black"
            backgroundShadow="black"
          >
            <Text
              numberOfLines={1}
              style={{ overflow: "hidden", color: "white" }}
            >
              Sign In
            </Text>
          </AwesomeButton>
        </View>
        <XStack>
          <Paragraph
            size="$2"
            opacity={0.4}
          >
            <SizableText size="$3">Dont have an account?</SizableText>
          </Paragraph>
          <Link href="/(public)/sign-up">
            <Paragraph
              cursor={"pointer"}
              size="$2"
              fontWeight={"700"}
              opacity={0.5}
              hoverStyle={{ opacity: 0.4 }}
            >
              Sign Up
            </Paragraph>
          </Link>
        </XStack>
      </YStack>

      {/* //TODO: To be remove */}
      <View>
        <AwesomeButton
          height={50}
          width={200}
          onPress={() => {
            const reset = async () => {
              await storage.setItem("onboarding", 0);
              console.log("pressed");
            };
            reset();
          }}
          raiseLevel={1}
          borderRadius={10}
          backgroundColor="black"
          backgroundShadow="black"
        >
          <Text
            numberOfLines={1}
            style={{ overflow: "hidden", color: "white" }}
          >
            Reset OnBoarding
          </Text>
        </AwesomeButton>
      </View>

      {/* <Button
        onPress={() => {
          const reset = async () => {
            await storage.setItem("onboarding", 0);
            console.log("pressed");
          };
          reset();
        }}
        themeInverse
      >
        <Text style={{ color: "white" }}>Reset OnBoarding</Text>
      </Button> */}
    </YStack>
  );
};
