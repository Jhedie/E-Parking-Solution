import { Link, useRouter } from "expo-router";
import { Button, H1, Paragraph, SizableText, XStack, YStack } from "tamagui";

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space="$3"
    >
      <H1>Welcome</H1>
      <YStack>
        <Button
          themeInverse
          onPress={() => {
            router.push("/(public)/sign-in");
          }}
        >
          Sign In
        </Button>
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
    </YStack>
  );
};
