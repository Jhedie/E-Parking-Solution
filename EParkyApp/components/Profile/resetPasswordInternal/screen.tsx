import { Formik, FormikErrors } from "formik";
import { Image, StyleSheet, Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Button, Input, Spinner, YStack } from "tamagui";
import { ZodError, z } from "zod";

export default function ResetPasswordInternalScreen() {
  const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
  const resetPasswordValidationSchema = z
    .object({
      email: z.string().email("Please enter a valid email address"),
      newPassword: z
        .string()
        .regex(
          passwordRegex,
          "Password must be at least 8 characters long and include at least one letter and one number"
        ),
      confirmPassword: z.string()
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"]
    });

  const initialValues = {
    email: "",
    newPassword: "",
    confirmPassword: ""
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
      <Formik
        initialValues={initialValues}
        onSubmit={(values: FormValues, actions) => {
          console.log(values);
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
            <Input
              placeholder="New Password"
              secureTextEntry
              onChangeText={formikProps.handleChange("newPassword")}
              onBlur={formikProps.handleBlur("newPassword")}
              value={formikProps.values.newPassword}
              style={{
                ...(formikProps.errors.newPassword &&
                  formikProps.touched.newPassword && {
                    borderBottomColor: "rgb(100, 0, 0)",
                    borderWidth: 1
                  })
              }}
            />
            {formikProps.errors.newPassword &&
              formikProps.touched.newPassword && (
                <Text style={styles.error}>
                  {formikProps.errors.newPassword}
                </Text>
              )}
            <Input
              placeholder="Confirm New Password"
              secureTextEntry
              onChangeText={formikProps.handleChange("confirmPassword")}
              onBlur={formikProps.handleBlur("confirmPassword")}
              value={formikProps.values.confirmPassword}
              style={{
                ...(formikProps.errors.confirmPassword &&
                  formikProps.touched.confirmPassword && {
                    borderBottomColor: "rgb(100, 0, 0)",
                    borderWidth: 1
                  })
              }}
            />
            {formikProps.errors.confirmPassword &&
              formikProps.touched.confirmPassword && (
                <Text style={styles.error}>
                  {formikProps.errors.confirmPassword}
                </Text>
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
              // <Button
              //   themeInverse
              //   onPress={() => formikProps.handleSubmit()}
              // >
              //   Reset Password
              // </Button>
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
