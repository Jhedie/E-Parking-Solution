import { useAuth } from "@providers/Authentication/AuthProvider";
import auth from "@react-native-firebase/auth";
import * as Burnt from "burnt";
import AwesomeButton from "react-native-really-awesome-button";

import { useConfig } from "@providers/Config/ConfigProvider";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { H3, Spinner, Text, YStack } from "tamagui";

export default function VerificationScreen() {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const { user } = useAuth();
  const { BASE_URL } = useConfig();

  const checkEmailVerificationStatus = async () => {
    await auth().currentUser?.reload();
    if (auth().currentUser?.emailVerified) {
      Burnt.toast({
        title: "Email verified!",
        message: "Your account has been verified. Please sign in to continue.",
        duration: 5,
        preset: "done"
      });
      console.log("Email verified!");
      router.replace("/(auth)/home"); // Redirect to home page
    } else {
      Burnt.toast({
        title: "Email not verified",
        message: "Please try again later.",
        duration: 5,
        preset: "error"
      });
      console.log("Email not verified");
    }
  };
  useEffect(() => {
    const checkEmailVerified = setInterval(checkEmailVerificationStatus, 5000); // Check every 5 seconds

    return () => clearInterval(checkEmailVerified);
  }, []);
  const handleResendEmail = async () => {
    Burnt.toast({
      title: "Resending email...",
      message: "Please wait.",
      duration: 5,
      preset: "done"
    });
    console.log("Resending email...");
    setIsResending(true);
    await user?.getIdToken().then((token) => {
      console.log("Token: ", token);
      axios
        .post(
          `${BASE_URL}/account/verify`,
          {
            email: user?.email
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(() => {
          Burnt.toast({
            title: "Verification email resent!",
            message: "Please check your email.",
            duration: 5,
            preset: "done"
          });
          console.log("Verification email resent!");
          setIsResending(false);
        })
        .catch((error) => {
          Burnt.toast({
            title: "Failed to resend verification email",
            message: "Please try again later.",
            duration: 5,
            preset: "error"
          });
          console.log("Failed to resend verification email: ", error);
          setIsResending(false);
        });
    });
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap={3}
    >
      <H3>Verify Your Account</H3>
      <Text
        width={300}
        textAlign="center"
      >
        We have sent an email to your registered email address. Please verify
        your account by clicking the link in the email.
      </Text>
      {!isResending && <Spinner />}
      <View
        style={{
          marginTop: 20
        }}
      >
        {isResending ? (
          <Spinner /> // Adjust this to match your Spinner component
        ) : (
          <View>
            <AwesomeButton
              height={50}
              width={150}
              onPress={() => handleResendEmail()}
              raiseLevel={1}
              borderRadius={10}
              backgroundColor="black"
              backgroundShadow="black"
            >
              <Text
                numberOfLines={1}
                style={{ overflow: "hidden", color: "white" }}
              >
                Resend
              </Text>
            </AwesomeButton>
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <AwesomeButton
            height={50}
            width={150}
            onPress={() => router.replace("/(public)/welcome")}
            raiseLevel={1}
            borderRadius={10}
            backgroundColor="lightgrey"
            backgroundShadow="black"
          >
            <Text
              numberOfLines={1}
              style={{ overflow: "hidden", color: "white" }}
            >
              Back to Login
            </Text>
          </AwesomeButton>
        </View>
      </View>
    </YStack>
  );
}
