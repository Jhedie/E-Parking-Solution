import { ParkingLot } from "@models/ParkingLot";
import { useConfig } from "@providers/Config/ConfigProvider";
import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { formatAddress } from "@utils/map/formatAddress";
import axios from "axios";
import useToken from "hooks/useToken";
import { Rate } from "models/ParkingLotRate";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AwesomeButton from "react-native-really-awesome-button";
import Carousel from "react-native-reanimated-carousel";
import { Image, YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";

type RouteParams = {
  ParkingLotDetailsScreen: {
    parkingLot: ParkingLot;
  };
};

interface ParkingLotDetailsScreenProps {
  navigation: StackNavigation;
}

export const ParkingLotDetailsScreen: React.FC<
  ParkingLotDetailsScreenProps
> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams, "ParkingLotDetailsScreen">>();
  const { parkingLot } = route.params;
  const token = useToken();
  const { width } = Dimensions.get("window");
  const isFocused = useIsFocused();
  const { BASE_URL } = useConfig();

  const getRatesForParkingLot = async (): Promise<Rate[]> => {
    try {
      console.log("LotId:", parkingLot.LotId);
      const response = await axios.post(
        `${BASE_URL}/parkingLotRates/parkingLot/${parkingLot.LotId}`,
        { ownerId: parkingLot.OwnerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Fetched parking lot rates:", response.data);

      return response.data;
    } catch (error) {
      console.log("Failed to fetch parking lot rates:", error);
      return [];
    }
  };

  const { data: parkingLotRates, refetch } = useQuery({
    queryKey: ["parkingLotRates"],
    queryFn: () => getRatesForParkingLot(),
    enabled: !!token && isFocused
  });

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={"white"}
    >
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Carousel
            loop
            width={width}
            height={width / 2}
            autoPlay={true}
            data={parkingLot.Images}
            scrollAnimationDuration={3000}
            renderItem={({ index }) => (
              <View
                style={{
                  flex: 1
                }}
              >
                <Image
                  source={{ uri: parkingLot.Images[index] }}
                  style={{ width: "100%", height: "100%" }} // Adjust the size as needed
                  resizeMode="stretch"
                />
              </View>
            )}
          />
        </View>
        <View
          style={{
            padding: 10 * 2
          }}
        >
          <View style={{ padding: 10, borderRadius: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parkingLot.LotName}
            </Text>
            <Text
              style={{
                overflow: "hidden",
                marginVertical: 10,
                fontSize: 16
              }}
            >
              {formatAddress(parkingLot.Address)}
            </Text>
          </View>
          {/* add parking information block */}
          <View
            style={{
              padding: 10,
              borderRadius: 10
            }}
          >
            <View>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Description
              </Text>
              <Text style={{ fontSize: 16 }}>{parkingLot.Description}</Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Price</Text>
              {parkingLotRates?.["parkingLotRates"]?.map((rate: Rate) => (
                <View
                  key={rate.rateId}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 5
                  }}
                >
                  <Text style={{ fontSize: 16 }}>
                    Duration: {rate.duration} hours
                  </Text>
                  <Text style={{ fontSize: 16 }}>Rate: £{rate.rate}</Text>
                </View>
              ))}
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Parking Availability
              </Text>
              <Text style={{ fontSize: 16 }}>
                Total Slots: {parkingLot.Capacity}
              </Text>
              <Text style={{ fontSize: 16 }}>
                Occupied Slots: {parkingLot.Occupancy}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color:
                    parkingLot.LiveStatus === "Low"
                      ? "green"
                      : parkingLot.LiveStatus === "Medium"
                      ? "orange"
                      : "red"
                }} // Change the color based on the availability
              >
                Available Slots: {parkingLot.Capacity - parkingLot.Occupancy}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Facilities
              </Text>
              <View>
                {parkingLot.Facilities.map((facility, index) => {
                  return (
                    <View key={index}>
                      <Text
                        style={{
                          marginTop: 5,
                          fontSize: 16
                        }}
                      >
                        {facility}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Operating Hours
              </Text>
              {parkingLot.OperatingHours.map((hour, index) => {
                const isToday = new Date().getDay() === index + 1; // Assuming the days in OperatingHours are 0-indexed (0 + 1 for Sunday, 1 + 1 for Monday, etc.)
                return (
                  <View
                    key={index}
                    style={{
                      marginTop: 5
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: isToday ? "green" : "black",
                        fontWeight: isToday ? "bold" : "normal"
                      }}
                    >
                      {hour.day}: {hour.start} - {hour.end}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.container}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Location</Text>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude:
                    parkingLot.Coordinates._lat ||
                    parkingLot.Coordinates["_latitude"],
                  longitude:
                    parkingLot.Coordinates._long ||
                    parkingLot.Coordinates["_longitude"],
                  latitudeDelta: 0.0015, // Try smaller values
                  longitudeDelta: 0.0015 // Try smaller values
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude:
                      parkingLot.Coordinates._lat ||
                      parkingLot.Coordinates["_latitude"],
                    longitude:
                      parkingLot.Coordinates._long ||
                      parkingLot.Coordinates["_longitude"]
                  }}
                  title={parkingLot.LotId}
                >
                  <Image
                    resizeMode="contain"
                    source={require("../../../assets/images/parking-lot-marker.png")}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 16
                    }}
                  />
                </Marker>
              </MapView>
            </View>
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
          raiseLevel={1}
          width={200}
          onPress={() => navigation.navigate("VehicleScreen", { parkingLot })}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="rgb(253 176 34)"
        >
          <Text style={{ color: "black", fontWeight: "500" }}>
            {" "}
            Proceed to Booking
          </Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    marginTop: 10
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 30,
    marginTop: 10
  }
});
