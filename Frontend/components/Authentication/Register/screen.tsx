import auth from "@react-native-firebase/auth";
import { useAppDispatch } from "../../../store/hooks";
import { signUp } from "../../../store/thunks/authThunk";

import { H1, YStack } from "tamagui";

export default function SignUpScreen() {
  const dispatch = useAppDispatch();

  const handleEmailSignUpWithPress = async (
    email: string,
    password: string
  ) => {
    console.log("ATTEMPTING TO SIGN UP");
    dispatch(signUp({ email, password }));
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space
    >
      <H1>Sign Up Screen</H1>
    </YStack>
  );
}
