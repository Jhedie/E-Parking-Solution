import { useToastController } from "@tamagui/toast";
import { useRouter } from "expo-router";
import { YStack } from "tamagui";

import { useSupabase } from "../../../utils/supabase/hooks/useSupabase";
import { SignInSignUpComponent } from "../SignInSignUpComponent";

export default function SignUpScreen() {
  const toast = useToastController();
  const supabase = useSupabase();
  const { push } = useRouter();

  const handleEmailSignUpWithPress = async (
    email: string,
    password: string
  ) => {
    console.log("ATTEMPTING TO SIGN UP");
    console.log("email", email);
    console.log("password", password);
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) {
      console.log("error", error);
      toast.show("Sign up failed", {
        message: error.message
      });
    } else if (data?.user) {
      toast.show("Email Confirmation", {
        message: "Check your email "
      });
      push("/");
    }
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
