import { Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import AwesomeButton from "react-native-really-awesome-button";

import { useAuth } from "@providers/Authentication/AuthProvider";
import { useConfig } from "@providers/Config/ConfigProvider";
import { useToastController } from "@tamagui/toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
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
  const { BASE_URL } = useConfig();
  const { user } = useAuth();
  const toaster = useToastController();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
      }
    };

    fetchToken();
  }, [user]);

  const vehicleValidationSchema = z.object({
    registrationNumber: z
      .string()
      .min(1, "Please enter a valid registration number, e.g. AB12 CDE"),
    defaultVehicle: z.boolean().optional()
  });
  const initialValues: Vehicle = {
    registrationNumber: "",
    nickName: "",
    defaultVehicle: false
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
            axios
              .post(`${BASE_URL}/vehicle`, values, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              })
              .then((response) => {
                console.log("Vehicle added successfully", response.data);
                toaster.show("Vehicle added successfully", {
                  type: "success"
                });
                queryClient.invalidateQueries({ queryKey: ["userVehicles"] });
                navigation.goBack();
              })
              .catch((error) => {
                toaster.show("Error adding vehicle", {
                  type: "error"
                });
                console.error("Error adding vehicle", error);
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            isSubmitting
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
                    handleChange("registrationNumber")(text.toUpperCase())
                  }
                  onBlur={handleBlur("registrationNumber")}
                  value={values.registrationNumber}
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
                {touched.registrationNumber && errors.registrationNumber && (
                  <Text style={styles.error}>{errors.registrationNumber}</Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <TextInput
                  onChangeText={handleChange("nickName")}
                  onBlur={handleBlur("Nickname")}
                  value={values.nickName}
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
                {touched.nickName && errors.nickName && (
                  <Text style={styles.error}>{errors.nickName}</Text>
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
                  thumbColor={values.defaultVehicle ? "white" : "black"}
                  value={values.defaultVehicle}
                  onValueChange={() => {
                    setFieldValue("defaultVehicle", !values.defaultVehicle);
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
                  {isSubmitting ? (
                    <ActivityIndicator
                      size="small"
                      color="white"
                    />
                  ) : (
                    <Text
                      numberOfLines={1}
                      style={{ overflow: "hidden", color: "white" }}
                    >
                      Next
                    </Text>
                  )}
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
