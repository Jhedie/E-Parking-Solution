import { YStack } from "tamagui";
import { useAppDispatch } from "../../../store/hooks";
import { signUp } from "../../../store/thunks/authThunk";
import { SignInSignUpComponent } from "../SignInSignUpComponent";

export default function SignInScreen() {
  const dispatch = useAppDispatch();

  const handleEmailSignInOnPress = async (email: string, password: string) => {
    console.log("ATTEMPTING TO SIGN IN");
    console.log("email", email);
    console.log("password", password);
    dispatch(signUp({ email, password }))
      .then(() => {
        console.log("SIGN IN SUCCESSFUL");
      })
      .catch((error) => {
        console.log("SIGN IN FAILED");
      });
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space
    >
      <SignInSignUpComponent
        type="sign-in"
        handleEmailWithPress={handleEmailSignInOnPress}
      />
    </YStack>
  );
}
