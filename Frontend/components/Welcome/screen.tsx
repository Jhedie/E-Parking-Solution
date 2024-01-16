import { Link } from "expo-router";
import { Button, H1, Paragraph, Spinner, XStack, YStack } from "tamagui";

export const WelcomeScreen: React.FC = () => {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space
    >
      <H1>Welcome</H1>
      <YStack>
        <XStack>
          <Button>Sign In</Button>
          <Paragraph
            size="$2"
            marginRight="$2"
            opacity={0.4}
          >
            Already have an account
          </Paragraph>
          <Link href="/">
            <Paragraph
              cursor={"pointer"}
              size="$2"
              fontWeight={"700"}
              opacity={0.5}
              hoverStyle={{ opacity: 0.4 }}
            >
              sign in
            </Paragraph>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  );
};
