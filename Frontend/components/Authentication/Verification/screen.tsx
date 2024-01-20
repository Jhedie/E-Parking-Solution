import auth from "@react-native-firebase/auth";
import { useToastController } from "@tamagui/toast";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Button, H3, Spinner, Text, YStack } from "tamagui";
import { useAuth } from "../../../providers/AuthProvider";
export default function VerificationScreen() {
  const router = useRouter();
  const toaster = useToastController();
  const { user, pendingVerification } = useAuth();

  useEffect(() => {
    console.log("In am in the useEffect for pendingVerification");
    router.replace("/(public)/verification");
    const checkEmailVerified = setInterval(async () => {
      await auth().currentUser?.reload();
      if (auth().currentUser?.emailVerified) {
        toaster.show("Email verified!");
        console.log("Email verified!");
        clearInterval(checkEmailVerified); // Stop checking
        router.replace("/(auth)/home"); // Redirect to home page
      } else {
        console.log("Email not verified");
      }
    }, 5000); // Check every 5 seconds
    return () => clearInterval(checkEmailVerified);
  }, []);
  const resendEmail = () => {
    auth()
      .currentUser?.sendEmailVerification()
      .then(() => {
        toaster.show("Verification email sent!");
        console.log("Verification email sent!");
      });
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      space="$3"
    >
      <H3>Verify Your Account</H3>
      <Text width={300}>
        We have sent an email to your registered email address. Please verify
        your account by clicking the link in the email.
      </Text>

      <Spinner />
      <Button onPress={resendEmail}>Resend Email</Button>
      <Button onPress={() => router.replace("/(public)/welcome")}>
        Back to Login
      </Button>
    </YStack>
  );
}
