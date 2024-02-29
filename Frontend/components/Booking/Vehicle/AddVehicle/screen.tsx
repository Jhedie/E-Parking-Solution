import { Formik, FormikHelpers } from "formik";
import React from "react";
import AwesomeButton from "react-native-really-awesome-button";

import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { YStack } from "tamagui";
import { ZodError, z } from "zod";
import { StackNavigation } from "../../../../app/(auth)/home";
import { Vehicle } from "../SelectVehicle/screen";

interface AddVehicleScreenProps {
  navigation: StackNavigation;
}

export const AddVehicleScreen: React.FC<AddVehicleScreenProps> = ({
  navigation
}) => {
  const vehicleValidationSchema = z.object({
    RegistrationNumber: z
      .string()
      .min(1, "Please enter a valid registration number, e.g. AB12 CDE"),
    DefaultVehicle: z.boolean().optional()
  });
  const initialValues: Vehicle = {
    RegistrationNumber: "",
    Nickname: "",
    DefaultVehicle: false
  };

  type FormValues = z.infer<typeof vehicleValidationSchema>;

  const validateForm = (values: FormValues) => {
    try {
      vehicleValidationSchema.parse(values);
    } catch (error) {
      if (error instanceof ZodError) {
        return error.formErrors.fieldErrors;
      }
    }
  };

  //An API POST request to add a vehicle to the user's account
  return (
    <YStack flex={1}>
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={(
            values: Vehicle,
            { setSubmitting }: FormikHelpers<Vehicle>
          ) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
              navigation.goBack();
            }, 500);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched
          }) => (
            <View>
              <View
                style={{
                  marginBottom: 20
                }}
              >
                <Text
                  style={{
                    marginBottom: 7,
                    fontWeight: "500"
                  }}
                >
                  Registration Number <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  onChangeText={(text) =>
                    handleChange("RegistrationNumber")(text.toUpperCase())
                  }
                  onBlur={handleBlur("RegistrationNumber")}
                  value={values.RegistrationNumber}
                  placeholder="AB12 CDE"
                  style={{
                    textAlign: "center",
                    borderColor: "gray",
                    padding: 10,
                    marginBottom: 10,
                    backgroundColor: "white",
                    borderRadius: 10,
                    height: 100,
                    fontSize: 25,
                    fontWeight: "bold",
                    letterSpacing: 10
                  }}
                />
                {touched.RegistrationNumber && errors.RegistrationNumber && (
                  <Text style={styles.error}>{errors.RegistrationNumber}</Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <TextInput
                  onChangeText={handleChange("Nickname")}
                  onBlur={handleBlur("Nickname")}
                  value={values.Nickname}
                  placeholder="Nickname"
                  style={{
                    textAlign: "center",
                    borderColor: "gray",
                    padding: 10,
                    marginBottom: 10,
                    backgroundColor: "white",
                    borderRadius: 10,
                    height: 50
                  }}
                />
                {touched.Nickname && errors.Nickname && (
                  <Text style={styles.error}>{errors.Nickname}</Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 15
                }}
              >
                <Text style={{ marginBottom: 7, fontWeight: "500" }}>
                  DefaultVehicle
                </Text>
                <Switch
                  trackColor={{ false: "white", true: "black" }}
                  thumbColor={values.DefaultVehicle ? "white" : "black"}
                  value={values.DefaultVehicle}
                  onValueChange={() => {
                    setFieldValue("DefaultVehicle", !values.DefaultVehicle);
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 10 * 2
                }}
              >
                <AwesomeButton
                  height={50}
                  onPress={() => handleSubmit()}
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
                    Next
                  </Text>
                </AwesomeButton>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </YStack>
  );
};

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
    marginBottom: 10
  }
});
