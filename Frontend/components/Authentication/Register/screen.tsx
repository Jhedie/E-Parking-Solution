import auth from "@react-native-firebase/auth";
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
    // dispatch(signUp({ email, password }));

    auth()
      .createUserWithEmailAndPassword(
        "jeddiahawukku12@example.com",
        "SuperSecretPassword!"
      )
      .then(() => {
        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.error(error);
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
        type="sign-up"
        handleEmailWithPress={handleEmailSignUpWithPress}
      />
    </YStack>
  );
}
