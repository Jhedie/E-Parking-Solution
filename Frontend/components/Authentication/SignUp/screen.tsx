import auth from "@react-native-firebase/auth";
import { useToastController } from "@tamagui/toast";
import { Formik, FormikValues } from "formik";
import { useState } from "react";
import { Button, H3, Input, Spinner, YStack } from "tamagui";
import { User, useAuth } from "../../../providers/AuthProvider";

export default function SignUpScreen() {
  const { signUp } = useAuth();

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
          signUp(values.username, values.password);
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
                autoCapitalize="none"
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
