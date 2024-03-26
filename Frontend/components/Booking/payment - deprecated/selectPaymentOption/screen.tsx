import { MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CheckCircle, Circle } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView, YStack } from "tamagui";
import { StackNavigation } from "../../../../app/(auth)/home";
import paymentList from "../../../../assets/data/paymentList-deprecated.json";
import { ParkingLot } from "../../../Map/screen";

import { ParkingSlot } from "../../SelectSpot/screen";
import { Vehicle } from "../../Vehicle/SelectVehicle/screen";
interface PaymentOptionScreenProps {
  navigation: StackNavigation;
}

type RouteParams = {
  PaymentOptionScreen: {
    parkingLot: ParkingLot;
    parkingSlot: ParkingSlot;
    vehicle: Vehicle;
  };
};

export interface PaymentDetails {
  cardNumber: string;
  cardType: string;
}

export interface PaymentMethod {
  paymentId: string;
  type: string;
  default: boolean;
  details?: PaymentDetails;
}

export interface PaymentMethods {
  paymentMethods: PaymentMethod[];
}

export const PaymentOptionScreen: React.FC<PaymentOptionScreenProps> = ({
  navigation
}) => {
  const route = useRoute<RouteProp<RouteParams, "PaymentOptionScreen">>();
  const { parkingLot, parkingSlot, vehicle } = route.params;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();

  useEffect(() => {
    paymentList.map((payment: PaymentMethod) => {
      if (payment.default) {
        setPaymentMethod(payment);
      }
    });
  }, [paymentList]);

  return (
    <YStack flex={1}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={{ paddingTop: 20 }}>
          {paymentList.map((payment: PaymentMethod) => {
            return (
              <TouchableOpacity
                disabled={paymentMethod?.paymentId === payment.paymentId}
                key={payment.paymentId}
                onPress={() => {
                  console.log(payment);
                  setPaymentMethod(payment);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10 * 1.2,
                  marginHorizontal: 10 * 2,
                  marginTop: 10 * 2.4,
                  borderRadius: 10,
                  backgroundColor: "white"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "bold" }}>{payment.type}</Text>
                    <Text>{payment.details?.cardNumber}</Text>
                  </View>
                </View>
                {/* add a check mark if the payment method is selected */}
                {paymentMethod ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "flex-end"
                    }}
                  >
                    {paymentMethod?.paymentId === payment.paymentId ? (
                      <CheckCircle
                        size={20}
                        color={"#00b894"}
                      />
                    ) : (
                      <Circle
                        size={20}
                        color={"#00b894"}
                      />
                    )}
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}

          <View
            style={{
              margin: 10 * 2
            }}
          >
            <AwesomeButton
              height={50}
              onPress={() => navigation.navigate("AddPaymentOptionScreen")}
              raiseLevel={1}
              stretch={true}
              borderRadius={10}
              backgroundShadow="#fff"
              backgroundDarker="#fff"
              backgroundColor="#fff"
            >
              <MaterialIcons
                name="add-box"
                size={20}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={{}}>Add New Card</Text>
            </AwesomeButton>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          margin: 10 * 2
        }}
      >
        <AwesomeButton
          height={50}
          width={200}
          // onPress={() =>
          //   paymentMethod &&
          //   navigation.navigate("BookingConfirmationScreen", {
          //     parkingLot,
          //     parkingSlot,
          //     vehicle,
          //     bookingDetails: {} // Add an initializer for the 'bookingDetails' variable
          //   })
          // }
          raiseLevel={1}
          stretch={true}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="#fff"
        >
          <Text style={{}}>Continue</Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};
