import { ParkingStackNavigation } from "@/(auth)/parking";
import { ReportWrongOccupantData } from "@models/ReportWrongOccupantData";
import { ReservationWithLot } from "@models/ReservationWithLot";
import { useConfig } from "@providers/Config/ConfigProvider";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import * as Burnt from "burnt";
import { Formik } from "formik";
import useToken from "hooks/useToken";
import React, { useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import AwesomeButton from "react-native-really-awesome-button";

interface ReportOccupiedSlotScreenProps {
  navigation: ParkingStackNavigation;
}

export type RouteParams = {
  reservation: ReservationWithLot;
};

export const ReportOccupiedSlotScreen: React.FC<
  ReportOccupiedSlotScreenProps
> = ({ navigation }) => {
  const initialValues = {
    registrationNumber: ""
  };
  const { BASE_URL } = useConfig();
  const route = useRoute<RouteProp<RouteParams, "reservation">>();
  const token = useToken();
  const reservation = route.params["reservation"] as ReservationWithLot;

  const validateForm = (values: typeof initialValues) => {
    const errors: Partial<typeof initialValues> = {};

    if (!values.registrationNumber) {
      errors.registrationNumber = "Required";
    }

    return errors;
  };

  const makeWrongOccupantReport = async (values: ReportWrongOccupantData) => {
    const response = await axios.post(
      `${BASE_URL}/parkingReservations/report-wrong-occupant`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  };
  const [isProcessingReport, setIsProcessingReport] = useState(false);
  const { mutateAsync: reportWrongOccupant } = useMutation({
    mutationFn: makeWrongOccupantReport,
    onSuccess: () => {
      navigation.navigate("NewSlotSelectionScreen", {
        reservation: reservation
      });
    },
    onError: (error) => {
      console.log("error", error);
      Burnt.toast({
        title: "Error",
        message: "An error occurred while reporting the wrong occupant.",
        preset: "error",
        duration: 5
      });
    }
  });

  return (
    <View style={styles.container}>
      {isProcessingReport ? (
        <ActivityIndicator
          size="large"
          color="black"
        />
      ) : (
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(false);
            setIsProcessingReport(true);
            reportWrongOccupant(
              {
                reservation: reservation,
                registrationNumber: values.registrationNumber
              },
              {
                onSuccess: () => {
                  setSubmitting(false);
                  setIsProcessingReport(false);
                },
                onError: () => {
                  setSubmitting(false);
                  setIsProcessingReport(false);
                }
              }
            );
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
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
                  backgroundColor="rgb(253 176 34)"
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
                      style={{
                        overflow: "hidden",
                        color: "black",
                        fontWeight: "500"
                      }}
                    >
                      Report
                    </Text>
                  )}
                </AwesomeButton>
              </View>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 10,
    marginTop: 30
  },
  error: {
    color: "red"
  }
});
