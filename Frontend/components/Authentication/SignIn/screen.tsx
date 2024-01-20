import auth from "@react-native-firebase/auth";
import { useToastController } from "@tamagui/toast";
import { useRouter } from "expo-router";
import { Formik, FormikValues } from "formik";
import { Button, H3, Input, Spinner, YStack } from "tamagui";
import { User, useAuth } from "../../../providers/AuthProvider";

export default function SignInScreen() {
  const router = useRouter();
  const toaster = useToastController();
  const { signIn } = useAuth();
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
          signIn(values.email, values.password);
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
