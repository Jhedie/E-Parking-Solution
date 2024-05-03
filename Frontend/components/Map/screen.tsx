import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import * as Burnt from "burnt";
import "expo-dev-client";
import { LinearGradient } from "expo-linear-gradient";
import { debounce } from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  AppState,
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Geocoder from "react-native-geocoding";
import MapView, {
  Circle,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Region,
  enableLatestRenderer
} from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useQuery } from "@tanstack/react-query";

import { ParkingLot } from "@models/ParkingLot";
import { useConfig } from "@providers/Config/ConfigProvider";
import { formatAddress } from "@utils/map/formatAddress";
import axios from "axios";
import useToken from "hooks/useToken";
import { Image, Text, YStack } from "tamagui";
import { StackNavigation } from "../../app/(auth)/home";
import { UserLocationContext } from "../../providers/UserLocation/UserLocationProvider";
import { calculateDistance1 } from "../../utils/map/geoUtils";

interface MapScreenProps {
  navigation: StackNavigation;
}

// Get the width of the screen
const { width } = Dimensions.get("window");
// Set the width of the card to be 90% of the screen width
const CARD_WIDTH = width * 0.9;

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const token = useToken();
  const { BASE_URL } = useConfig();
  const userLocationContext = useContext(UserLocationContext);
  if (!userLocationContext) {
    throw new Error("MapScreen must be used within a UserLocationProvider");
  }
  const { location } = userLocationContext;

  //users location
  const initialMapRegion: Region = {
    latitude: location?.coords.latitude as number,
    longitude: location?.coords.longitude as number,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  };
  //LOCATION_CHANGE_THRESHOLD is a small number that represents the minimum change in coordinates to consider the map's center as having moved. This helps in ignoring minor, insignificant changes.
  const LOCATION_CHANGE_THRESHOLD = 0.001;

  // Search state to store the search query
  const [searchBox, setSearchBox] = useState<string | undefined>(undefined);

  // Marker position state which is by default set to the user's current location.
  const [markerPosition, setMarkerPosition] = useState({
    latitude: location?.coords.latitude as number,
    longitude: location?.coords.longitude as number,
    radius: 5
  });

  useEffect(() => {
    Geocoder.init(process.env.GEOCODER_API_KEY as string);
  }, []);

  const [tempAddress, setTempAddress] = useState<string>("");
  const fetchAddress = async () => {
    try {
      const { latitude, longitude } = markerPosition;
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0].formatted_address;
      console.log(address);
      setTempAddress(address);
    } catch (error) {
      console.log("Address not found", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (markerPosition.latitude && markerPosition.longitude) {
      fetchAddress();
    }
  }, [markerPosition]);

  const fetchNearbyPlaces = async () => {
    console.log("Marker changed, you may fetch nearby places here.");
    await fetchAddress();
  };

  const fetchAddressFromSearch = async () => {
    if (!searchBox) {
      setIsSearching(false);
      return;
    }
    try {
      const response = await Geocoder.from(searchBox);
      const { lat, lng } = response.results[0].geometry.location;
      setMarkerPosition({
        latitude: lat,
        longitude: lng,
        radius: 5
      });
      _map.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        },
        2000
      );
      setIsSearching(false);

      setSearchBox("");
      return response.results[0].formatted_address;
    } catch (error) {
      Burnt.toast({
        title: "Address not found",
        message: "Please enter a valid address.",
        duration: 5,
        preset: "error",
        haptic: "error"
      });
      return "Address not found";
    }
  };

  // const fetchNearbyPlaces = async () => {
  //   console.log("Marker changed, you may fetch nearby places here.");
  //   await fetchAddress();
  // };

  const debouncedFetchNearbyPlaces = useCallback(
    debounce(() => {
      fetchNearbyPlaces();
    }, 1000),
    [markerPosition]
  ); // 1000ms = 1 second debounce time

  useEffect(() => {
    debouncedFetchNearbyPlaces();
  }, [debouncedFetchNearbyPlaces, markerPosition]);

  const geoSearchParkingLots = async (
    token: string,
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<ParkingLot[]> => {
    console.log("fetching parking lots in method", latitude, longitude, radius);

    try {
      setIsSearching(true);
      const response = await axios.post(
        `${BASE_URL}/parkingLot/geosearch`,
        {
          lat: latitude,
          lon: longitude,
          radius: radius
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(
        "fetching parking lots in method end",
        response.data.parkingLots
      );
      console.log("isFocused", isFocused);

      if (isFocused) {
        if (response.data.parkingLots.length > 0) {
          // Burnt.toast({
          //   title: "Parking lots found",
          //   duration: 5,
          //   preset: "done",
          //   haptic: "success"
          // });
        } else {
          Burnt.toast({
            title: "No parking lots found",
            duration: 5,
            preset: "error",
            haptic: "error"
          });
        }
      }
      setIsSearching(false);
      return response.data;
    } catch (error) {
      console.log("Failed to fetch parking lots:", error);
      setIsSearching(false);
      return [];
    }
  };

  const isFocused = useIsFocused();

  const {
    data: parkingLots,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["allParkingLots"],
    queryFn: () =>
      geoSearchParkingLots(
        token as string,
        markerPosition.latitude,
        markerPosition.longitude,
        markerPosition.radius
      ),
    enabled: !!token && isFocused
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

  /**MapView Related Logic */

  // This is used to determine if the search button should be displayed based on the distance between the marker position and the current location.
  const isMarkerVisible =
    Math.abs(markerPosition.latitude - (location?.coords.latitude as number)) >
      LOCATION_CHANGE_THRESHOLD ||
    Math.abs(
      markerPosition.longitude - (location?.coords.longitude as number)
    ) > LOCATION_CHANGE_THRESHOLD;

  // This is used to determine if the search button should be displayed based on the distance between the marker position and the current location.
  const [showSearchButton, setShowSearchButton] = useState(false);

  // _map is a mutable reference object where we store the map instance.
  // useRef is used so that the value persists across re-renders without causing additional renders.
  // Initial value is set to null, it will be assigned when the map is initialized.
  const _map = useRef<MapView>(null);
  // scrollViewRef is a mutable reference object where we store the ScrollView instance.
  const scrollViewRef = useRef<ScrollView>(null);

  const mapIndex = useRef(0);
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

  // This function is used to create an array of interpolations for the markers.
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

  // This useEffect hook is used to animate the map to the selected parking lot when the user scrolls through the cards.
  useEffect(() => {
    let regionTimeout: NodeJS.Timeout;

    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3);

      const lotArray = parkingLots?.["parkingLots"];
      console.log("lotArray", lotArray);
      if (index >= lotArray?.length) {
        index = lotArray?.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
      if (regionTimeout) clearTimeout(regionTimeout);

      regionTimeout = setTimeout(() => {
        if (mapIndex.current !== index) {
          mapIndex.current = index;

          const { Coordinates } = lotArray[index];
          console.log("Coordinates", Coordinates);
          _map.current?.animateToRegion(
            {
              latitude: Coordinates._lat || Coordinates["_latitude"],
              longitude: Coordinates._long || Coordinates["_longitude"],
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            },
            2000
          );
        }
      }, 10);
    });
  }, [mapAnimation, parkingLots]);

  enableLatestRenderer(); // This is a workaround for a bug in react-native-maps

  const [isSearching, setIsSearching] = useState(false);

  return isLoading ? (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      bottom={0}
    >
      <ActivityIndicator />
    </YStack>
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
              longitude: region.longitude,
              radius: 5
            });
          }}
        >
          {parkingLots?.["parkingLots"]?.map(
            (parkingLot: ParkingLot, index) => {
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
                    latitude:
                      parkingLot.Coordinates._lat ||
                      parkingLot.Coordinates["_latitude"],
                    longitude:
                      parkingLot.Coordinates._long ||
                      parkingLot.Coordinates["_longitude"]
                  }}
                  title={parkingLot.LotName}
                  description={`Status: ${parkingLot.LiveStatus} | Occupancy: ${parkingLot.Occupancy}/${parkingLot.Capacity}`}
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
            }
          )}

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
          {/* Circle around the car location */}
          <Circle
            center={{
              latitude: markerPosition.latitude,
              longitude: markerPosition.longitude
            }}
            radius={markerPosition.radius * 1000} // Radius in meters and convert to Kilometers
            fillColor="rgba(0, 0, 0, 0.1)" // No fill color
            strokeColor="rgba(192, 192, 192, 1.0)" // Lighter solid grey border
            strokeWidth={2} // Border width
          />
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
              <TextInput
                value={searchBox}
                placeholder={`${
                  tempAddress ? ` ${tempAddress}` : "Search for a location"
                }`}
                onChangeText={(text) => {
                  setSearchBox(text);
                }}
                placeholderTextColor={"grey"}
                selectionColor={"black"}
                style={{
                  flex: 8.3,
                  textAlign: "left",
                  marginHorizontal: 10 * 1.3
                }}
                onSubmitEditing={() => {
                  console.log("searching", searchBox);
                  fetchAddressFromSearch();
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  console.log("searching", searchBox);
                  setIsSearching(true);
                  fetchAddressFromSearch();
                  Keyboard.dismiss();
                }}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                {isSearching ? (
                  <ActivityIndicator />
                ) : (
                  <Ionicons
                    name="search"
                    size={20}
                    color="black"
                  />
                )}
              </TouchableOpacity>
              {/* Floating search marker area button which appears when the user swipes or searches away from their location */}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              {showSearchButton && (
                <TouchableOpacity
                  onPress={() => {
                    setShowSearchButton(false);
                    refetch();
                  }}
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

        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          {isMarkerVisible && (
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
              <View>
                <MaterialCommunityIcons
                  onPress={() => {
                    _map.current?.animateToRegion(initialMapRegion, 1000);
                  }}
                  name="crosshairs-gps"
                  size={25}
                  color="white"
                />
              </View>
            </View>
          )}
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
              {parkingLots?.["parkingLots"]?.map((parkingLot: ParkingLot) => {
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
                          source={{ uri: parkingLot.Images[0] }}
                          style={{
                            overflow: "hidden",
                            width: 84,
                            height: 74,
                            borderRadius: 5
                          }}
                        />
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
                          {`Distance: ${calculateDistance1(
                            location?.coords.latitude as number,
                            location?.coords.longitude as number,
                            parkingLot.Coordinates._lat ||
                              parkingLot.Coordinates["_latitude"],
                            parkingLot.Coordinates._long ||
                              parkingLot.Coordinates["_longitude"],
                            "K"
                          ).toFixed(1)} km`}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden",
                            width: "50%"
                          }}
                        >
                          {`Slots Available: ${
                            parkingLot?.Capacity - parkingLot?.Occupancy
                          }`}
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
                          marginHorizontal: 10 * 0.5
                        }}
                        className="bg-primary-400"
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden",
                            color: "black"
                          }}
                          className="text-color-black font-semibold"
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
                          marginHorizontal: 10 * 0.5
                        }}
                        className="border border-primary-400 text-color-black"
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            overflow: "hidden"
                          }}
                          className="text-color-black "
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
