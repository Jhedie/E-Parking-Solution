import { CheckCircle, Circle } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Image, ScrollView, Text, YStack } from "tamagui";
import { StackNavigation } from "../../app/(auth)/home";
import Vehicles from "../../assets/data/Vehicles.json";

interface VehicleScreenProps {
  navigation: StackNavigation;
}
interface Vehicle {
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
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    Vehicles.map((vehicle: Vehicle) => {
      if (vehicle.DefaultVehicle) {
        setSelectedId(vehicle.VehicleID);
      }
    });
  }, []);

  return (
    <YStack flex={1}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <View style={{ paddingTop: 20 }}>
          {Vehicles.map((vehicle: Vehicle) => {
            return (
              <TouchableOpacity
                disabled={selectedId === vehicle.VehicleID}
                key={vehicle.VehicleID}
                onPress={() => setSelectedId(vehicle.VehicleID)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10 * 1.2,
                  marginHorizontal: 10 * 2,
                  marginBottom: 10 * 2,
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
                  <Image
                    source={require("../../assets/images/vehicleSelectCar.png")}
                    resizeMode="contain"
                    style={{
                      width: 50,
                      height: 50
                    }}
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
                {selectedId ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "flex-end"
                    }}
                  >
                    {selectedId === vehicle.VehicleID ? (
                      <CheckCircle
                        size={24}
                        color="black"
                      />
                    ) : (
                      <Circle
                        size={24}
                        color="black"
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
          onPress={() => navigation.navigate("BookParkingDetailsScreen")}
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
