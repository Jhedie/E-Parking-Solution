import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import "expo-dev-client";
import { LinearGradient } from "expo-linear-gradient";
import { debounce } from "lodash";
import Geocoder from "react-native-geocoding";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  AppState,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
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

import { useQuery } from "@tanstack/react-query";

import { formatAddress } from "@components/Booking/parkingLotDetails/screen";
import { useAuth } from "@providers/Authentication/AuthProvider";
import axios from "axios";
import useToken from "hooks/useToken";
import { Image, Text, YStack } from "tamagui";
import { StackNavigation } from "../../app/(auth)/home";
import { UserLocationContext } from "../../providers/UserLocation/UserLocationProvider";
import { calculateDistance1 } from "../../utils/map/geoUtils";

export const BASE_URL = process.env.FRONTEND_SERVER_BASE_URL;

export type GeoPoint = {
  Latitude: string;
  Longitude: string;
};

export type Rate = {
  rateId: string;
  lotId: string;
  rateType: string;
  rate: number;
  duration: number;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export type Facility =
  | "EV Charging"
  | "Disabled Access"
  | "Bicycle Parking"
  | "Motorcycle Parking";

export type ParkingLot = {
  LotId: string | undefined;
  LotName: string;
  Description: string;
  Coordinates: GeoPoint;
  Owner: string;
  Address: Address;
  Capacity: number;
  Occupancy: number;
  LiveStatus: "Low" | "Medium" | "High";
  OperatingHours: string;
  Facilities: Facility[];
  Rates: Rate[];
  createdAt: Date;
};

interface MapScreenProps {
  navigation: StackNavigation;
}

// Get the width of the screen
const { width } = Dimensions.get("window");
// Set the width of the card to be 90% of the screen width
const CARD_WIDTH = width * 0.9;

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const { user } = useAuth();

  // const [token, setToken] = useState<string>("");
  // useEffect(() => {
  //   const fetchToken = async () => {
  //     if (user) {
  //       const token = await user.getIdToken();
  //       setToken(token);
  //     }
  //   };

  //   fetchToken();
  // }, [user]);
  const token = useToken();

  const getAllParkingLots = async (token: string): Promise<ParkingLot[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/all-parkinglots-public`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch parking lots:", error);
      return [];
    }
  };

  const {
    data: parkingLots,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["allParkingLots"],
    queryFn: () => getAllParkingLots(token as string),
    enabled: !!token
  });

  useEffect(() => {
    // Define the function to handle app state changes
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        // App has come to the foreground, refetch the data
        console.log("App has come to the foreground, refetching data");
        refetch();
      }
    };

    // Subscribe to app state change events
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup function to remove the event listener
    return () => {
      appStateSubscription.remove(); // Use the remove function on the subscription to clean up
    };
  }, [refetch]); // Dependency array includes refetch function

  const userLocationContext = useContext(UserLocationContext);

  // _map is a mutable reference object where we store the map instance.
  // useRef is used so that the value persists across re-renders without causing additional renders.
  // Initial value is set to null, it will be assigned when the map is initialized.
  const _map = useRef<MapView>(null);
  // scrollViewRef is a mutable reference object where we store the ScrollView instance.
  const scrollViewRef = useRef<ScrollView>(null);

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

  const interpolations = parkingLots?.["parkingLots"]?.map((_, index) => {
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
  enableLatestRenderer(); // This is a workaround for a bug in react-native-maps

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

      const lotArray = parkingLots?.["parkingLots"];
      if (index >= lotArray.length) {
        index = lotArray.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      if (regionTimeout) clearTimeout(regionTimeout);

      regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;

          const { Coordinates } = lotArray[index];
          console.log("Coordinates", Coordinates);
          _map.current?.animateToRegion(
            {
              latitude: Coordinates.Latitude,
              longitude: Coordinates.Longitude,
              latitudeDelta: initialMapRegion.latitudeDelta,
              longitudeDelta: initialMapRegion.longitudeDelta
            },
            2000
          );
        }
      }, 10);
    });
  });

  //GEOLOCATION SEARCH

  //LOCATION_CHANGE_THRESHOLD is a small number that represents the minimum change in coordinates to consider the map's center as having moved. This helps in ignoring minor, insignificant changes.
  const LOCATION_CHANGE_THRESHOLD = 0.001;
  const [markerPosition, setMarkerPosition] = useState({
    latitude: location?.coords.latitude as number,
    longitude: location?.coords.longitude as number
  });

  const isMarkerVisible =
    Math.abs(markerPosition.latitude - (location?.coords.latitude as number)) >
      LOCATION_CHANGE_THRESHOLD ||
    Math.abs(
      markerPosition.longitude - (location?.coords.longitude as number)
    ) > LOCATION_CHANGE_THRESHOLD;

  const [showSearchButton, setShowSearchButton] = useState(false);

  useEffect(() => {
    Geocoder.init(process.env.GEOCODER_API_KEY as string);
  }, []);

  const [search, setSearch] = useState("");
  const fetchAddress = async () => {
    try {
      const { latitude, longitude } = markerPosition;
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0].formatted_address;
      console.log(address);
      return address;
    } catch (error) {
      console.error(error);
      return "Address not found";
    }
  };

  const fetchNearbyPlaces = async () => {
    const fetchedAddress = await fetchAddress();
    setSearch(fetchedAddress);
    // const places = await fetchPlacesNearby(
    //   markerPosition.latitude,
    //   markerPosition.longitude
    // );
    // Handle the fetched places as needed
    console.log("fetching nearby places");
  };

  const debouncedFetchNearbyPlaces = useCallback(
    debounce(() => {
      fetchNearbyPlaces();
    }, 1000),
    [markerPosition]
  ); // 1000ms = 1 second debounce time

  useEffect(() => {
    debouncedFetchNearbyPlaces();
  }, [debouncedFetchNearbyPlaces, markerPosition]);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    location?.coords.latitude && (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        bottom={0}
      >
        <MapView
          ref={_map}
          // onPress={() => _map.current?.animateToRegion(initialMapRegion, 1000)}
          style={styles.map}
          provider={
            Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          initialRegion={initialMapRegion}
          onRegionChangeComplete={(region) => {
            const distanceLat = Math.abs(
              region.latitude - (location?.coords.latitude as number)
            );
            const distanceLng = Math.abs(
              region.longitude - (location?.coords.longitude as number)
            );

            if (
              distanceLat > LOCATION_CHANGE_THRESHOLD ||
              distanceLng > LOCATION_CHANGE_THRESHOLD
            ) {
              setShowSearchButton(true);
            } else {
              setShowSearchButton(false);
            }
            setMarkerPosition({
              latitude: region.latitude,
              longitude: region.longitude
            });
          }}
        >
          {parkingLots?.["parkingLots"]?.map((parkingLot, index) => {
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
                  latitude: parkingLot.Coordinates.Latitude,
                  longitude: parkingLot.Coordinates.Longitude
                }}
                title={parkingLot.LotName}
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
          {isMarkerVisible && (
            <Marker
              coordinate={markerPosition}
              title="Search Location"
              style={{ width: 35, height: 35 }}
            >
              <Image
                source={require("../../assets/images/marker-pin-1873372_1280.png")}
                style={{ width: 35, height: 35 }}
              />
            </Marker>
          )}
        </MapView>

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0
          }}
        >
          <LinearGradient colors={["#808080", "transparent", "transparent"]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10 * 1.2,
                paddingHorizontal: 10 * 1.6,
                marginTop: 20 * 3.5,
                marginHorizontal: 10 * 2,
                borderRadius: 5,
                backgroundColor: "white"
              }}
            >
              <Ionicons
                name="search"
                color={"grey"}
                size={18}
                style={{
                  flex: 0.7
                }}
              />
              <TextInput
                value={search}
                onChangeText={(text) => {
                  console.log("searching", text);
                  setSearch(text);
                }}
                placeholder={"search"}
                placeholderTextColor={"grey"}
                selectionColor={"black"}
                style={{
                  flex: 8.3,
                  textAlign: "left",
                  marginHorizontal: 10 * 1.3
                }}
              />
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <Ionicons
                  name="filter"
                  color={"grey"}
                  size={18}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              {showSearchButton && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "black",
                    padding: 10,
                    borderRadius: 20,
                    marginTop: 10,
                    paddingHorizontal: 10 * 1.5
                  }}
                >
                  <Text style={{ color: "white" }}>Search This Area</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>

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
              {parkingLots?.["parkingLots"]?.map((parkingLot) => {
                return (
                  <TouchableOpacity
                    onPress={() => console.log("card pressed")}
                    key={parkingLot?.LotId}
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

                        {/* <View
                          style={{
                            position: "absolute",
                            alignSelf: "flex-end",
                            justifyContent: "flex-end",
                            bottom: 0,
                            top: 0
                          }}
                        >
                          <Text style={{ color: "white" }}>review</Text>
                        </View> */}
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
                            overflow: "hidden",
                            fontWeight: "bold"
                          }}
                        >
                          {parkingLot?.LotName}
                        </Text>
                        <Text
                          // numberOfLines={1}
                          style={{
                            overflow: "hidden",
                            paddingVertical: 10 * 0.3
                          }}
                        >
                          {formatAddress(parkingLot.Address)}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden"
                          }}
                        >
                          Rate to be added
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
                          {/* {calculateDistance(
                            location?.coords.latitude as number,
                            location?.coords.longitude as number,
                            parseFloat(parkingLot.Coordinates.Latitude),
                            parseFloat(parkingLot.Coordinates.Longitude)
                          )} */}
                          {calculateDistance1(
                            location?.coords.latitude as number,
                            location?.coords.longitude as number,
                            parseFloat(parkingLot.Coordinates.Latitude),
                            parseFloat(parkingLot.Coordinates.Longitude),
                            "K"
                          )}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden",
                            width: "50%"
                          }}
                        >
                          slotAvailable:
                          {parkingLot?.Capacity - parkingLot?.Occupancy}
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
                        onPress={() => {
                          navigation.navigate("VehicleScreen", {
                            parkingLot: parkingLot
                          });
                        }}
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
                            parkingLot: parkingLot
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
