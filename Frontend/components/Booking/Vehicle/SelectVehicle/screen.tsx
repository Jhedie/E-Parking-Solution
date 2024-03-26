import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@providers/Authentication/AuthProvider";
import { useConfig } from "@providers/Config/ConfigProvider";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CheckCircle, Circle } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView, Text, YStack } from "tamagui";
import { StackNavigation } from "../../../../app/(auth)/home";
import { ParkingLot } from "../../../Map/screen";
interface VehicleScreenProps {
  navigation: StackNavigation;
}

type RouteParams = {
  VehicleScreen: {
    parkingLot: ParkingLot;
  };
};

export interface Vehicle {
  vehicleId?: string;
  registrationNumber: string;
  nickName: string;
  defaultVehicle: boolean;
}
export const VehicleScreen: React.FC<VehicleScreenProps> = ({ navigation }) => {
  const [selectedVehicle, setselectedVehicle] = useState<Vehicle | null>(null);
  const route = useRoute<RouteProp<RouteParams, "VehicleScreen">>();
  const { parkingLot } = route.params;

  const { user } = useAuth();
  const { BASE_URL } = useConfig();
  const toaster = useToastController();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
      }
    };

    fetchToken();
  }, [user]);

  const getUserVehicles = async (token: string): Promise<Vehicle[]> => {
    console.log("Getting user vehicles");
    try {
      const response = await axios.get(`${BASE_URL}/all-user-vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("User vehicles returned", response.data);
      return response.data;
    } catch (error) {
      console.log("Error getting user vehicles", error);
      return [];
    }
  };

  const {
    data: userVehiclesFromApi,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["userVehicles"],
    queryFn: () => getUserVehicles(token),
    enabled: !!token
  });
  const userVehicles = userVehiclesFromApi?.["vehicles"] || [];

  useEffect(() => {
    userVehicles?.map((vehicle: Vehicle) => {
      if (vehicle.defaultVehicle) {
        setselectedVehicle(vehicle);
      }
    });
  }, [userVehicles]);

  const handleDeleteVehicle = (vehicleToDelete: Vehicle) => {
    axios
      .delete(`${BASE_URL}/vehicle/${vehicleToDelete.vehicleId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        console.log("Vehicle deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["userVehicles"] });
        toaster.show("Vehicle deleted successfully", {
          type: "success"
        });
      })
      .catch((error) => {
        console.log("Error deleting vehicle", error);
        toaster.show("Error deleting vehicle", {
          type: "error"
        });
      });
  };
  const renderRightActions = (progress, dragX, vehicle) => {
    const onPress = () => {
      handleDeleteVehicle(vehicle);
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10 * 4,
          marginHorizontal: 10 * 2,
          marginTop: 10 * 2.4,
          borderRadius: 10,
          backgroundColor: "red"
        }}
      >
        <Ionicons
          name="trash-sharp"
          size={24}
          color="white"
        />
      </TouchableOpacity>
    );
  };

  return (
    <YStack flex={1}>
      <TouchableOpacity
        onPress={() => navigation.navigate("AddVehicleScreen")}
        style={{
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          padding: 10 * 1.2,
          marginHorizontal: 10 * 2,
          marginTop: 10 * 2.4,
          borderRadius: 10,
          backgroundColor: "white"
        }}
      >
        <AntDesign
          name="pluscircle"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontSize: 15, fontWeight: "500" }}>Add Vehicle</Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={true}>
        {isLoading ? (
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
          >
            <ActivityIndicator />
          </YStack>
        ) : isError ? (
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
          >
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              Error loading vehicles
            </Text>
          </YStack>
        ) : (
          <View style={{}}>
            {userVehicles?.map((vehicle: Vehicle) => {
              return (
                <Swipeable
                  key={vehicle.vehicleId}
                  renderRightActions={(progress, dragX) =>
                    renderRightActions(progress, dragX, vehicle)
                  }
                >
                  <TouchableOpacity
                    disabled={selectedVehicle?.vehicleId === vehicle.vehicleId}
                    key={vehicle.vehicleId}
                    onPress={() => setselectedVehicle(vehicle)}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 10 * 4,
                      marginHorizontal: 10 * 2,
                      marginTop: 10 * 2.4,
                      borderRadius: 10,
                      backgroundColor: "white"
                    }}
                  >
                    <View
                      style={{
                        flex: 9,
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <AntDesign
                        name="car"
                        size={30}
                        color="black"
                      />
                      <View
                        style={{
                          alignItems: "flex-start",
                          marginHorizontal: "10%"
                        }}
                      >
                        <Text style={{ fontSize: 15, fontWeight: "500" }}>
                          {vehicle.registrationNumber}{" "}
                        </Text>
                        <Text style={{ fontSize: 12, color: "gray" }}>
                          {vehicle.nickName}
                        </Text>
                      </View>
                    </View>
                    {selectedVehicle ? (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "flex-end"
                        }}
                      >
                        {selectedVehicle.vehicleId === vehicle.vehicleId ? (
                          <CheckCircle
                            size={24}
                            color={"black"}
                          />
                        ) : (
                          <Circle
                            size={24}
                            color={"lightgray"}
                          />
                        )}
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </Swipeable>
              );
            })}
          </View>
        )}
      </ScrollView>
      <View
        style={{
          margin: 10 * 2
        }}
      >
        <AwesomeButton
          height={50}
          onPress={() =>
            navigation.navigate("BookParkingDetailsScreen", {
              parkingLot,
              vehicle: selectedVehicle || userVehicles?.[0] || ({} as Vehicle)
            })
          }
          raiseLevel={1}
          stretch={true}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="black"
        >
          <Text style={{ fontWeight: "500", color: "white" }}>
            Select Booking Details
          </Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};
