import auth from "@react-native-firebase/auth";
import { useToastController } from "@tamagui/toast";
import { useRouter } from "expo-router";
import { Formik, FormikValues } from "formik";
import { Button, H3, Input, Spinner, YStack } from "tamagui";
import { User } from "../../../providers/AuthProvider";

export default function SignInScreen() {
  const router = useRouter();
  const toaster = useToastController();

  function signInUser(email: string, password: string) {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("User account signed in!");
        router.replace("/(auth)/home");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          toaster.show("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          toaster.show("That email address is invalid!");
        }

        toaster.show(error);
      });
  }

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space
    >
      <H3>Sign In Screen</H3>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={function (
          values: FormikValues,
          actions
        ): void | Promise<User> {
          signInUser(values.email, values.password);
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {(formikProps) => (
          <YStack
            width={300}
            space
          >
            <YStack space>
              <Input
                placeholder="Email"
                onChangeText={formikProps.handleChange("email")}
                value={formikProps.values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                size="$4"
                placeholder="Password"
                secureTextEntry
                onChangeText={formikProps.handleChange("password")}
                value={formikProps.values.password}
                autoCapitalize="none"
              />
            </YStack>
            {formikProps.isSubmitting ? (
              <Spinner />
            ) : (
              <Button
                themeInverse
                onPress={() => formikProps.handleSubmit()}
              >
                Sign In
              </Button>
            )}
          </YStack>
        )}
      </Formik>
    </YStack>
  );
}
