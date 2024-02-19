import { AntDesign } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { CheckCircle, Circle } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView, Text, YStack } from "tamagui";
import { StackNavigation } from "../../../../app/(auth)/home";
import Vehicles from "../../../../assets/data/Vehicles.json";
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
  VehicleID: string;
  RegistrationNumber: string;
  image: string;
  Make: string;
  Model: string;
  Year: string;
  Type: string;
  Colour: string;
  DefaultVehicle: boolean;
}
export const VehicleScreen: React.FC<VehicleScreenProps> = ({ navigation }) => {
  const [selectedVehicle, setselectedVehicle] = useState<Vehicle>();
  //get parkinglot selected
  const route = useRoute<RouteProp<RouteParams, "VehicleScreen">>();
  const { parkingLot } = route.params;

  useEffect(() => {
    console.log(parkingLot.LotId, "\n-------");
  }, [parkingLot]);

  useEffect(() => {
    Vehicles.map((vehicle: Vehicle) => {
      if (vehicle.DefaultVehicle) {
        // create a vehicle and set it to the selected vehicle
        setselectedVehicle(vehicle);
      }
    });
  }, [Vehicles]);

  return (
    <YStack flex={1}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={{ paddingTop: 20 }}>
          {Vehicles.map((vehicle: Vehicle) => {
            return (
              <TouchableOpacity
                disabled={selectedVehicle?.VehicleID === vehicle.VehicleID}
                key={vehicle.VehicleID}
                onPress={() => setselectedVehicle(vehicle)}
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
                    <Text style={{}}>{vehicle.VehicleID}</Text>
                    <Text>{vehicle.RegistrationNumber} </Text>
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
                    {selectedVehicle.VehicleID === vehicle.VehicleID ? (
                      <CheckCircle
                        size={24}
                        color={"#00b894"}
                      />
                    ) : (
                      <Circle
                        size={24}
                        color={"#00b894"}
                      />
                    )}
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddVehicleScreen")}
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10 * 1.2,
            marginHorizontal: 10 * 2,
            marginBottom: 10 * 2,
            marginTop: 10 * 2.4,
            borderRadius: 10,
            backgroundColor: "white"
          }}
        >
          <Text style={{}}>Add Vehicle</Text>
        </TouchableOpacity>
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
              // if no vehicle is selected, use the default vehicle
              vehicle: selectedVehicle || Vehicles[0]
            })
          }
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
