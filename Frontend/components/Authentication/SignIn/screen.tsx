import { useRouter } from "expo-router";
import { Formik } from "formik";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Button, Input, Spinner, YStack } from "tamagui";
import { ZodError, z } from "zod";
import { useAuth } from "../../../providers/Authentication/AuthProvider";

const signInValidationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
});
type SignInFormValues = z.infer<typeof signInValidationSchema>;

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const initialValues: SignInFormValues = {
    email: "",
    password: ""
  };

  const validateForm = (values: SignInFormValues) => {
    try {
      signInValidationSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        return error.formErrors.fieldErrors;
      }
      return {};
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        gap
        backgroundColor="white"
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
            marginTop: 30
          }}
        >
          <Image
            source={require("../../../assets/static/logo/Icon-1024x1024.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            signIn(values.email, values.password);
            setTimeout(() => {
              actions.setSubmitting(false);
            }, 1000);
          }}
          validate={validateForm}
        >
          {(formikProps) => (
            <YStack
              width={300}
              gap={20}
            >
              <YStack gap={10}>
                <Input
                  placeholder="Email"
                  onChangeText={formikProps.handleChange("email")}
                  value={formikProps.values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={formikProps.handleBlur("email")}
                  style={{
                    ...(formikProps.errors.email &&
                      formikProps.touched.email && {
                        borderBottomColor: "rgb(100, 0, 0)",
                        borderWidth: 1
                      })
                  }}
                />
                {formikProps.errors.email && formikProps.touched.email && (
                  <Text style={styles.error}>{formikProps.errors.email}</Text>
                )}
                <Input
                  size="$4"
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={formikProps.handleChange("password")}
                  value={formikProps.values.password}
                  onBlur={formikProps.handleBlur("password")}
                  style={{
                    ...(formikProps.errors.password &&
                      formikProps.touched.password && {
                        borderBottomColor: "rgb(100, 0, 0)",
                        borderWidth: 1
                      })
                  }}
                />
                {formikProps.errors.password &&
                  formikProps.touched.password && (
                    <Text style={styles.error}>
                      {formikProps.errors.password}
                    </Text>
                  )}
              </YStack>
              {formikProps.isSubmitting ? (
                <Spinner />
              ) : (
                <>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 30,
                      marginTop: 30
                    }}
                  >
                    <AwesomeButton
                      height={50}
                      width={200}
                      onPress={() => formikProps.handleSubmit()}
                      raiseLevel={1}
                      borderRadius={10}
                      backgroundColor="black"
                      backgroundShadow="black"
                    >
                      <Text
                        numberOfLines={1}
                        style={{ overflow: "hidden", color: "white" }}
                      >
                        Sign In
                      </Text>
                    </AwesomeButton>
                  </View>

                  {/* <Button
                  themeInverse
                  onPress={() => formikProps.handleSubmit()}
                >
                  Sign In
                </Button> */}
                  <Button onPress={() => router.push("/(public)/reset")}>
                    Forgot Password?
                  </Button>
                </>
              )}
            </YStack>
          )}
        </Formik>
      </YStack>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  error: {
    fontSize: 12,
    color: "rgb(100, 0, 0)",
    marginBottom: 10,
    textAlign: "center"
  }
});
