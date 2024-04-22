import { BookingDetails } from "@models/BookingDetails";
import { ParkingLot } from "@models/ParkingLot";
import { Rate } from "@models/ParkingLotRate";
import { ParkingSlot } from "@models/ParkingSlot";
import { Vehicle } from "@models/Vehicle";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useRouter, useSegments } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";

interface ParkingTicketScreenProps {
  navigation: StackNavigation;
}

export type RouteParams = {
  ParkingTicketScreen: {
    parkingLot: ParkingLot;
    parkingSlot: ParkingSlot;
    vehicle: Vehicle;
    bookingDetails: BookingDetails;
    selectedRate: Rate;
  };
};

export const ParkingTicketScreen: React.FC<ParkingTicketScreenProps> = ({
  navigation
}) => {
  const router = useRouter();

  const segments = useSegments(); // hook that allows all navigation routes defined.

  const route = useRoute<RouteProp<RouteParams, "ParkingTicketScreen">>();
  const [isLoading, setIsLoading] = useState(false);

  const bookedParkingDetails = route.params.bookingDetails;
  const initialItemState = bookedParkingDetails;

  return (
    <YStack flex={1}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginHorizontal: 10 * 2,
          marginVertical: 10 * 2.4,
          backgroundColor: "white",
          borderRadius: 10
        }}
      >
        <Text
          style={{
            marginTop: 10,
            textAlign: "center",
            width: "70%",
            fontWeight: "300"
          }}
        >
          Scan the QR code below at the machine upon arrival
        </Text>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20
          }}
        >
          <QRCodeStyled
            data={JSON.stringify(initialItemState)}
            pieceSize={5}
            color="black"
            style={{ backgroundColor: "white" }}
          />
        </View>
        <View
          style={{
            marginTop: 15,
            backgroundColor: "white",
            borderRadius: 10,
            width: "100%",
            paddingHorizontal: 10 * 2,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View>
            <View
              style={{
                marginTop: 15
              }}
            >
              {/* Name */}
              <Text style={{ fontWeight: "600" }}>Name</Text>
              <Text>userName</Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* Parking slot */}
              <Text style={{ fontWeight: "600", textAlign: "left" }}>
                Parking Slot
              </Text>
              <Text>Position</Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* Parking area */}
              <Text style={{ fontWeight: "600" }}>Parking Area</Text>
              <Text>Leicester, UK</Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* vehicle */}
              <Text style={{ fontWeight: "600" }}>Vehicle</Text>
              <Text>Toyota Corolla</Text>
            </View>
          </View>
          <View>
            <View
              style={{
                marginTop: 15
              }}
            >
              {/* Duration */}
              <Text style={{ fontWeight: "600", textAlign: "right" }}>
                Duration
              </Text>
              <Text
                style={{
                  textAlign: "right"
                }}
              >
                2 hours
              </Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* Date */}
              <Text style={{ fontWeight: "600", textAlign: "right" }}>
                Date
              </Text>
              <Text
                style={{
                  textAlign: "right"
                }}
              >
                12/12/2021
              </Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* hour */}
              <Text style={{ fontWeight: "600", textAlign: "right" }}>
                Hour
              </Text>
              <Text
                style={{
                  textAlign: "right"
                }}
              >
                12:00 PM - 1:00 PM
              </Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* Total */}
              <Text style={{ fontWeight: "600", textAlign: "right" }}>
                Total
              </Text>
              <Text
                style={{
                  textAlign: "right"
                }}
              >
                £10.00
              </Text>
            </View>
          </View>
        </View>
      </View>
      {route.name === "ParkingTicketScreen" && (
        <View
          style={{
            margin: 10 * 2
          }}
        >
          <AwesomeButton
            height={50}
            stretch={true}
            raiseLevel={1}
            borderRadius={10}
            backgroundShadow="#fff"
            backgroundDarker="#fff"
            backgroundColor="black"
            onPress={() => {
              setIsLoading(true);

              setTimeout(() => {
                setIsLoading(false);
                router.replace("/(auth)/parking");
              }, 1000);
            }}
          >
            <Text style={{ color: "white", fontWeight: "500" }}>
              {isLoading ? "Loading..." : "View Parking Session"}
            </Text>
          </AwesomeButton>
        </View>
      )}
    </YStack>
  );
};
