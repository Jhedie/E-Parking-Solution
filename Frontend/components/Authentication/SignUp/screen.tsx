import { Formik, FormikValues } from "formik";
import { Button, H3, Input, Spinner, YStack } from "tamagui";
import { User, useAuth } from "../../../providers/Authentication/AuthProvider";

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
        initialValues={{ email: "", password: "" }}
        onSubmit={function (
          values: FormikValues,
          actions
        ): void | Promise<User> {
          signUp(values.email, values.password);
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
                Sign Up
              </Button>
            )}
          </YStack>
        )}
      </Formik>
    </YStack>
  );
}
