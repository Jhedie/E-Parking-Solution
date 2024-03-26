import { useAuth } from "@providers/Authentication/AuthProvider";
import { Formik, FormikErrors } from "formik";
import { Image, StyleSheet, Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Input, Spinner, YStack } from "tamagui";
import { ZodError, z } from "zod";

export default function ResetPasswordExternalScreen() {
  const { resetPassword } = useAuth();
  const resetPasswordValidationSchema = z.object({
    email: z.string().email("Please enter a valid email address")
  });

  const initialValues = {
    email: ""
  };

  type FormValues = z.infer<typeof resetPasswordValidationSchema>;

  const validateForm = (values: FormValues): FormikErrors<FormValues> => {
    try {
      resetPasswordValidationSchema.parse(values);
      return {}; // Return an empty object if no validation errors
    } catch (error) {
      if (error instanceof ZodError) {
        // Convert ZodError to FormikErrors format
        const formikErrors: FormikErrors<FormValues> = {};
        for (const [key, value] of Object.entries(
          error.formErrors.fieldErrors
        )) {
          // Assuming error messages are in an array, take the first message
          if (value?.length) formikErrors[key] = value[0];
        }
        return formikErrors;
      }
      return {}; // Return an empty object if the error is not a ZodError
    }
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
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
      <View
        style={{
          marginBottom: 20,
          marginHorizontal: 10 * 5
        }}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: "center"
          }}
        >
          Enter your email address to receive a password reset link
        </Text>
      </View>
      <Formik
        initialValues={initialValues}
        onSubmit={(values: FormValues, actions) => {
          console.log("resetting password");
          resetPassword(values.email);
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 3000);
        }}
        validate={validateForm}
      >
        {(formikProps) => (
          <YStack
            width={300}
            gap={20}
          >
            <Input
              placeholder="Email"
              onChangeText={formikProps.handleChange("email")}
              onBlur={formikProps.handleBlur("email")}
              value={formikProps.values.email}
              autoCapitalize="none"
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

            {formikProps.isSubmitting ? (
              <Spinner />
            ) : (
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
                    Reset Password
                  </Text>
                </AwesomeButton>
              </View>
            )}
          </YStack>
        )}
      </Formik>
    </YStack>
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
