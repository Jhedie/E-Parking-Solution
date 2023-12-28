import { useAppDispatch } from "../../../store/hooks";
import { signUp } from "../../../store/thunks/authThunk";

import { YStack } from "tamagui";

import { SignInSignUpComponent } from "../SignInSignUpComponent";

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
      <SignInSignUpComponent
        type="sign-up"
        handleEmailWithPress={handleEmailSignUpWithPress}
      />
    </YStack>
  );
}
