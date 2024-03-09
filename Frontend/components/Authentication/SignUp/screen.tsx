import { Formik, FormikValues } from "formik";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Input, Spinner, YStack } from "tamagui";
import validator from "validator";
import { ZodError, z } from "zod";
import { User, useAuth } from "../../../providers/Authentication/AuthProvider";

export default function SignUpScreen() {
  const { signUpBackend } = useAuth();

  const signUpValidationSchema = z
    .object({
      userName: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Please enter a valid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z.string(),

      phoneNumber: z.string().refine((data) => validator.isMobilePhone(data), {
        message: "Invalid phone number",
        path: ["phoneNumber"]
      })
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"]
    });

  const initialValues = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: ""
  };
  type FormValues = z.infer<typeof signUpValidationSchema>;

  const validateForm = (values: FormValues) => {
    try {
      signUpValidationSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flexGrow: 0, height: "100%", backgroundColor: "white" }}
    >
      <YStack
        flex={1}
        alignItems="center"
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
          onSubmit={function (
            values: FormikValues,
            actions
          ): void | Promise<User> {
            signUpBackend(
              values.email,
              values.password,
              values.userName,
              values.phoneNumber
            );
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
                  placeholder={"Username"}
                  onChangeText={formikProps.handleChange("userName")}
                  onBlur={formikProps.handleBlur("userName")}
                  value={formikProps.values.userName}
                  style={{
                    ...(formikProps.errors.userName &&
                      formikProps.touched.userName && {
                        borderBottomColor: "rgb(100, 0, 0)",
                        borderWidth: 1
                      })
                  }}
                />
                {formikProps.errors.userName &&
                  formikProps.touched.userName && (
                    <Text style={styles.error}>
                      {formikProps.errors.userName}
                    </Text>
                  )}

                <Input
                  placeholder="Email"
                  onChangeText={formikProps.handleChange("email")}
                  value={formikProps.values.email}
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
                  textContentType="none"
                  onBlur={formikProps.handleBlur("password")}
                  onChangeText={formikProps.handleChange("password")}
                  value={formikProps.values.password}
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
                <Input
                  size="$4"
                  placeholder="Confirm Password"
                  secureTextEntry
                  textContentType="none"
                  onBlur={formikProps.handleBlur("confirmPassword")}
                  onChangeText={formikProps.handleChange("confirmPassword")}
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
                <Input
                  size="$4"
                  placeholder="Phone Number"
                  onChangeText={formikProps.handleChange("phoneNumber")}
                  onBlur={formikProps.handleBlur("phoneNumber")}
                  style={{
                    ...(formikProps.errors.phoneNumber &&
                      formikProps.touched.phoneNumber && {
                        borderBottomColor: "rgb(100, 0, 0)",
                        borderWidth: 1
                      })
                  }}
                />
                {formikProps.errors.phoneNumber &&
                  formikProps.touched.phoneNumber && (
                    <Text style={styles.error}>
                      {formikProps.errors.phoneNumber}
                    </Text>
                  )}
              </YStack>
              {formikProps.isSubmitting ? (
                <Spinner />
              ) : (
                <View
                  style={{
                    marginTop: 10 * 2
                  }}
                >
                  <AwesomeButton
                    height={50}
                    onPress={() => formikProps.handleSubmit()}
                    raiseLevel={1}
                    stretch={true}
                    borderRadius={10}
                    backgroundColor="black"
                    backgroundShadow="black"
                  >
                    <Text
                      numberOfLines={1}
                      style={{ overflow: "hidden", color: "white" }}
                    >
                      Sign Up
                    </Text>
                  </AwesomeButton>
                </View>
              )}
            </YStack>
          )}
        </Formik>
      </YStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 10,
    marginTop: 30
  },
  input: {
    textAlign: "center",
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    height: 50
  },
  error: {
    fontSize: 12,
    color: "rgb(100, 0, 0)",
    marginBottom: 10,
    textAlign: "center"
  }
});
