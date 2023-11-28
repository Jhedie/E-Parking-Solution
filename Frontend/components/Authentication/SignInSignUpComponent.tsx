/* eslint-disable @typescript-eslint/no-empty-function */
import { useState } from "react";
import { Link } from "expo-router";
import { Button, Input, Paragraph, XStack, YStack } from "tamagui";

interface Props {
  type: "sign-in" | "sign-up";
  handleEmailWithPress: (email: string, password: string) => void;
}

export const SignInSignUpComponent = ({
  type,
  handleEmailWithPress
}: Props): React.ReactNode => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <YStack
      borderRadius="$10"
      space
      paddingHorizontal="$7"
      paddingVertical="$6"
      width={350}
      shadowColor={"#00000020"}
      shadowRadius={26}
      shadowOffset={{ width: 0, height: 4 }}
      backgroundColor="$background"
    >
      <Paragraph
        size="$5"
        fontWeight={"700"}
        opacity={0.8}
        marginBottom="$1"
      >
        {type === "sign-up" ? "Create your account" : "Sign in to your account"}
      </Paragraph>

      {/* email sign up option */}
      <Input
        autoCapitalize="none"
        placeholder="Email"
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
      <Input
        autoCapitalize="none"
        placeholder="Password"
        onChangeText={(text) => {
          setPassword(text);
        }}
        textContentType="password"
        secureTextEntry
      />

      {/* sign up button */}
      <Button
        themeInverse
        onPress={() => {
          handleEmailWithPress(email, password);
        }}
        hoverStyle={{ opacity: 0.8 }}
        onHoverIn={() => {}}
        onHoverOut={() => {}}
        focusStyle={{ scale: 0.975 }}
      >
        {type === "sign-up" ? "Sign up" : "Sign in"}
      </Button>

      {/* or sign in, in small and less opaque font */}
      <XStack>
        <Paragraph
          size="$2"
          marginRight="$2"
          opacity={0.4}
        >
          {type === "sign-up"
            ? "Already have an account?"
            : "Don’t have an account?"}
        </Paragraph>
        <Link href={type === "sign-up" ? "/sign-in" : "/sign-up"}>
          <Paragraph
            cursor={"pointer"}
            size="$2"
            fontWeight={"700"}
            opacity={0.5}
            hoverStyle={{ opacity: 0.4 }}
          >
            {type === "sign-up" ? "Sign in" : "Sign up"}
          </Paragraph>
        </Link>
      </XStack>
    </YStack>
  );
};
