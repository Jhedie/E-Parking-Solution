import { H1, YStack } from "tamagui";
import { useAppDispatch } from "../../../store/hooks";

export default function SignInScreen() {
  const dispatch = useAppDispatch();

  const handleEmailSignInOnPress = async (email: string, password: string) => {
    console.log("ATTEMPTING TO SIGN IN");

    console.log(email, password);
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space
    >
      <H1>Sign In Screen</H1>
    </YStack>
  );
}
