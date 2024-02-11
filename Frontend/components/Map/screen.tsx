import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import "expo-dev-client";
import React, { useContext, useEffect } from "react";
import { Animated, StyleSheet } from "react-native";

import {
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Region,
  enableLatestRenderer
} from "react-native-maps";

import { Image, Text, YStack } from "tamagui";
import { StackNavigation } from "../../app/(auth)/home";
import parkingLots from "../../assets/data/parkingLots.json";
import { UserLocationContext } from "../../providers/UserLocation/UserLocationProvider";

export type ParkingLot = {
  LotId: string;
  Location: {
    Latitude: string;
    Longitude: string;
  };
  Owner: {
    OwnerId: string;
    Name: string;
  };
  Capacity: number;
  Occupancy: number;
  LiveStatus: string;
  Rate: string;
  OperatingHours: string;
  Facilities: string[];
};

interface MapScreenProps {
  navigation: StackNavigation;
}

// Get the width of the screen
const { width } = Dimensions.get("window");
// Set the width of the card to be 90% of the screen width
const CARD_WIDTH = width * 0.9;

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const userLocationContext = useContext(UserLocationContext);
  const [selectedParkingLot, setSelectedParkingLot] =
    React.useState<ParkingLot | null>(null);

  // _map is a mutable reference object where we store the map instance.
  // useRef is used so that the value persists across re-renders without causing additional renders.
  // Initial value is set to null, it will be assigned when the map is initialized.
  const _map = React.useRef<MapView>(null);
  // scrollViewRef is a mutable reference object where we store the ScrollView instance.
  const scrollViewRef = React.useRef<ScrollView>(null);

  let mapIndex = 0;
  const mapAnimation: Animated.Value = new Animated.Value(0);

  // This function is called when a marker is pressed.
  // It takes the mapEventData object as an argument, which contains information about the marker that was pressed.
  const handleMarkerPress = (mapEventData) => {
    // the _targetInst.return.key property to get the index of the marker that was pressed.
    const markerID = mapEventData._targetInst.return.key;
    // calculate the x value to scroll to by multiplying the index by the width of the card and the margin between the cards.
    const x = markerID * CARD_WIDTH + markerID * 10;
    scrollViewRef.current?.scrollTo({ x: x, y: 0, animated: true });
  };

  const interpolations = parkingLots.map((_, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp"
    });

    return { scale };
  });

  if (!userLocationContext) {
    throw new Error("MapScreen must be used within a UserLocationProvider");
  }
  const { location } = userLocationContext;
  enableLatestRenderer();

  const initialMapRegion: Region = {
    latitude: location?.coords.latitude as number,
    longitude: location?.coords.longitude as number,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  };

  // This useEffect hook is used to animate the map to the selected parking lot when the user scrolls through the cards.
  useEffect(() => {
    let regionTimeout: NodeJS.Timeout;

    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3);
      if (index >= parkingLots.length) {
        index = parkingLots.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      if (regionTimeout) clearTimeout(regionTimeout);

      regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { Location } = parkingLots[index];
          _map.current?.animateToRegion(
            {
              latitude: parseFloat(Location.Latitude),
              longitude: parseFloat(Location.Longitude),
              latitudeDelta: initialMapRegion.latitudeDelta,
              longitudeDelta: initialMapRegion.longitudeDelta
            },
            2000
          );
        }
      }, 10);
    });
  });

  return (
    location?.coords.latitude && (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        bottom={0}
      >
        <MapView
          ref={_map}
          onPress={() => _map.current?.animateToRegion(initialMapRegion, 1000)}
          style={styles.map}
          provider={
            Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          initialRegion={initialMapRegion}
        >
          {parkingLots.map((parkingLot, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale
                }
              ]
            };
            return (
              <Marker
                key={index}
                onPress={handleMarkerPress}
                coordinate={{
                  latitude: parseFloat(parkingLot.Location.Latitude),
                  longitude: parseFloat(parkingLot.Location.Longitude)
                }}
                title={parkingLot.LotId}
                description="Parking Lot"
              >
                <Animated.View style={[styles.markerWrap]}>
                  <Animated.Image
                    resizeMode="contain"
                    source={require("../../assets/images/parking-lot-marker.png")}
                    style={[styles.marker, scaleStyle]}
                  />
                </Animated.View>
              </Marker>
            );
          })}

          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
          >
            <Image
              source={require("../../assets/images/sports-car.png")}
              style={{ width: 35, height: 35 }}
            />
          </Marker>
        </MapView>
        <View style={{ position: "absolute", bottom: 0 }}>
          <View
            style={{
              alignSelf: "flex-end",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
              marginHorizontal: 10,
              width: 40,
              height: 40,
              backgroundColor: "black",
              borderRadius: 20
            }}
          >
            <MaterialCommunityIcons
              onPress={() => {
                _map.current?.animateToRegion(initialMapRegion, 1000);
              }}
              name="crosshairs-gps"
              size={25}
              color="white"
            />
          </View>
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 15}
            snapToAlignment="center"
            decelerationRate="fast"
            // This is an event handler for the onScroll event of the scrollable component.
            // It uses the Animated.event function to map the horizontal scroll offset (x) to the mapAnimation Animated value.
            // As the user scrolls, the mapAnimation value will change to match the scroll offset.
            // The useNativeDriver option is set to true, which offloads operations to the native UI thread for smoother animations.
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: mapAnimation
                    }
                  }
                }
              ],
              { useNativeDriver: true }
            )}
          >
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 10 * 1.5
              }}
            >
              {parkingLots.map((parkingLot) => {
                return (
                  <TouchableOpacity
                    onPress={() => console.log("card pressed")}
                    key={parkingLot.LotId}
                    style={{
                      paddingTop: 10 * 1.5,
                      marginBottom: 10 * 3,
                      marginHorizontal: 10 * 0.5,
                      width: CARD_WIDTH,
                      borderRadius: 10,
                      backgroundColor: "white"
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingBottom: 10 * 1.2,
                        paddingHorizontal: 10 * 1.5
                      }}
                    >
                      <View
                        style={{
                          flex: 2.8
                        }}
                      >
                        <Image
                          source={require("../../assets/images/parking-lot-image.png")}
                          style={{
                            overflow: "hidden",
                            width: 84,
                            height: 74,
                            borderRadius: 5
                          }}
                        />

                        <View
                          style={{
                            position: "absolute",
                            alignSelf: "flex-end",
                            justifyContent: "flex-end",
                            bottom: 0,
                            top: 0
                          }}
                        >
                          <Text style={{ color: "white" }}>review</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 7.2,
                          alignItems: "flex-start",
                          marginLeft: 10 * 2,
                          marginRight: 0
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden"
                          }}
                        >
                          {parkingLot.LotId}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden",
                            paddingVertical: 10 * 0.3
                          }}
                        >
                          address
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden"
                          }}
                        >
                          {parkingLot.Rate}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        paddingTop: 10 * 1.2,
                        paddingBottom: 10 * 1.4,
                        paddingHorizontal: 10 * 1.5
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{ overflow: "hidden", width: "50%" }}
                        >
                          distance: {4 + " " + "km"}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden",
                            width: "50%"
                          }}
                        >
                          slotAvailable:
                          {parkingLot.Capacity - parkingLot.Occupancy}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginLeft: 10,
                        marginRight: 10,
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10 * 1.5
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => console.log("Book now")}
                        style={{
                          flex: 5.0,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: 10,
                          paddingHorizontal: 10 * 0.5,
                          borderRadius: 5,
                          backgroundColor: "black",
                          marginHorizontal: 10 * 0.5
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden",
                            color: "white"
                          }}
                        >
                          Book
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ParkingLotDetailsScreen", {
                            parkingLot
                          })
                        }
                        style={{
                          flex: 5.0,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: 10,
                          paddingHorizontal: 10 * 0.5,
                          borderRadius: 5,
                          flexDirection: "row",
                          backgroundColor: "lightgrey",
                          marginHorizontal: 10 * 0.5
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden",
                            color: "grey"
                          }}
                        >
                          View Details
                        </Text>
                        <Entypo
                          name="chevron-right"
                          size={18}
                          color="grey"
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.ScrollView>
        </View>
      </YStack>
    )
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25
  },
  marker: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 16
  }
});
export default MapScreen;
