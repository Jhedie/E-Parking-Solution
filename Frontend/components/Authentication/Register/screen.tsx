import auth from "@react-native-firebase/auth";
import { Formik, FormikValues } from "formik";
import { Button, H3, Input, Spinner, YStack } from "tamagui";
import { User } from "../../../contexts/FirebaseAuthContext";

export default function SignUpScreen() {
  function createUser(email: string, password: string) {
    auth()
      .createUserWithEmailAndPassword(email, password)
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
  }

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space
    >
      <H3>Sign Up Screen</H3>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={function (
          values: FormikValues,
          actions
        ): void | Promise<User> {
          createUser(values.username, values.password);
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
                placeholder="Username"
                onChangeText={formikProps.handleChange("username")}
                value={formikProps.values.username}
              />
              <Input
                size="$4"
                placeholder="Password"
                secureTextEntry
                onChangeText={formikProps.handleChange("password")}
                value={formikProps.values.password}
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
