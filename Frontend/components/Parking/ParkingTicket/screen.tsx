import {
  ParkingStackNavigation,
  ParkingStackParamList
} from "@/(auth)/parking";
import { ReservationWithLot } from "@models/ReservationWithLot";
import { useAuth } from "@providers/Authentication/AuthProvider";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  Alert,
  AlertButton,
  Linking,
  Platform,
  Text,
  View
} from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import AwesomeButton from "react-native-really-awesome-button";
import { YStack } from "tamagui";

interface ParkingTicketScreenProps {
  navigation: ParkingStackNavigation;
}

export type RouteParams = {
  reservation: ReservationWithLot;
};

export const ParkingTicketScreen: React.FC<ParkingTicketScreenProps> = ({
  navigation
}) => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<RouteParams, "reservation">>();
  const reservation = route.params["reservation"] as ReservationWithLot;

  const handleChooseMapApp = () => {
    Alert.alert(
      "Choose Map App",
      "Select the map app you want to use:",
      [
        {
          text: "Google Maps",
          onPress: () => handleNavigateToLocation("google")
        },
        Platform.OS === "ios"
          ? {
              text: "Apple Maps",
              onPress: () => handleNavigateToLocation("apple")
            }
          : null,
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel");
          },
          style: "cancel"
        } // Add this line
      ].filter(Boolean) as AlertButton[],
      { cancelable: true }
    );
  };

  const handleNavigateToLocation = (mapApp) => {
    const latitude = reservation.parkingLotDetails.Coordinates["latitude"];
    const longitude = reservation.parkingLotDetails.Coordinates["longitude"];
    const label = encodeURIComponent("Parking Location");
    let url;

    if (mapApp === "google") {
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    } else if (mapApp === "apple") {
      url = `http://maps.apple.com/?q=${label}@${latitude},${longitude}`;
    }

    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("An error occurred", err)
      );
    } else {
      console.error("Unable to generate map URL for the selected app");
    }
  };
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
            data={reservation.reservationId}
            pieceSize={10}
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
              <Text>{user?.displayName}</Text>
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
              <Text>
                {reservation.slotDetails.position.row}
                {reservation.slotDetails.position.column}
              </Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* Parking area */}
              <Text style={{ fontWeight: "600" }}>Parking Area</Text>
              <Text>{reservation.parkingLotDetails.Address.streetName}</Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* vehicle */}
              <Text style={{ fontWeight: "600" }}>Vehicle</Text>
              <Text>{reservation.vehicleDetails.registrationNumber}</Text>
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
                {reservation.usedRates[0].duration}{" "}
                {reservation.usedRates[0].rateType}(s)
              </Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* Date */}
              <Text style={{ fontWeight: "600", textAlign: "right" }}>
                End Date
              </Text>
              <Text
                style={{
                  textAlign: "right"
                }}
              >
                {dayjs(reservation.endTime).format("DD MMM YYYY")}
              </Text>
            </View>

            <View
              style={{
                marginTop: 15
              }}
            >
              {/* hour */}
              <Text style={{ fontWeight: "600", textAlign: "right" }}>
                Hours
              </Text>
              <Text
                style={{
                  textAlign: "right"
                }}
              >
                {dayjs(reservation.startTime).format("h:mm A")} -{" "}
                {dayjs(reservation.endTime).format("h:mm A")}
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
                £{reservation.totalAmount}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 10 * 5
          }}
        >
          <AwesomeButton
            height={50}
            width={300}
            raiseLevel={1}
            borderRadius={10}
            backgroundShadow="#fff"
            backgroundDarker="#fff"
            backgroundColor="black"
            onPress={handleChooseMapApp}
          >
            <Text style={{ color: "white", fontWeight: "500" }}>
              Navigate to Location
            </Text>
          </AwesomeButton>
        </View>
      </View>
    </YStack>
  );
};
