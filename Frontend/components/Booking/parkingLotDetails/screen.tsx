import { AnimatedScrollView } from "@kanelloc/react-native-animated-header-scroll-view";
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AwesomeButton from "react-native-really-awesome-button";
import { Image, YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import { ParkingLot } from "../../Map/screen";
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

  const { width } = Dimensions.get("window");

  console.log(parkingLot.LotId, "In the parking lot details screen");

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor={"white"}
    >
      <AnimatedScrollView
        maxWidth={width}
        headerImage={require("../../../assets/images/parking-lot-image.png")}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        headerMaxHeight={150}
        
      >
        <View
          style={{
            padding: 10 * 2
          }}
        >
          <View style={{ padding: 10, borderRadius: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {parkingLot.LotId}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                overflow: "hidden",
                marginVertical: 10 * 0.8,
                fontSize: 16
              }}
            >
              Leicester, United Kingdom
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
                Parking Information
              </Text>
              <Text style={{ fontSize: 16 }}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste
                id soluta culpa rem quidem excepturi numquam assumenda nisi
                omnis itaque officia harum, unde error a illo voluptatibus amet
                quas esse!
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Price</Text>
              <Text style={{ fontSize: 16 }}>{parkingLot.Rate}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Capacity</Text>
              <Text>{parkingLot.Capacity} Slots</Text>

              <Text style={{ fontSize: 16 }}>
                {parkingLot.Capacity - parkingLot.Occupancy} Slots
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
          </View>
          <View style={styles.container}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(parkingLot.Location.Latitude),
                longitude: parseFloat(parkingLot.Location.Longitude),
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
                  latitude: parseFloat(parkingLot.Location.Latitude),
                  longitude: parseFloat(parkingLot.Location.Longitude)
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
      </AnimatedScrollView>
      <View
        style={{
          margin: 10 * 2
        }}
      >
        <AwesomeButton
          height={50}
          width={200}
          onPress={() => navigation.navigate("VehicleScreen", { parkingLot })}
          raiseLevel={1}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="black"
        >
          <Text style={{ color: "white" }}> Proceed to Booking</Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 30
  }
});
