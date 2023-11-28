import { useToastController } from "@tamagui/toast";
import { useRouter } from "expo-router";
import { YStack } from "tamagui";

import { useSupabase } from "../../../utils/supabase/hooks/useSupabase";
import { SignInSignUpComponent } from "../SignInSignUpComponent";

export default function SignInScreen() {
  const toast = useToastController();
  const supabase = useSupabase();
  const { replace } = useRouter();

  const handleEmailSignInOnPress = async (email: string, password: string) => {
    console.log("ATTEMPTING TO SIGN IN");
    console.log("email", email);
    console.log("password", password);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (error) {
      toast.show("Sign in failed", {
        description: error.message
      });
      return;
    }

    replace("/main");
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
