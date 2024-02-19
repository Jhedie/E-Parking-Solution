import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { RouteProp, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import DashedLine from "react-native-dashed-line";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AwesomeButton from "react-native-really-awesome-button";
import { H6, ScrollView, YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
import { ParkingLot } from "../../Map/screen";
import { Vehicle } from "../Vehicle/SelectVehicle/screen";

type RouteParams = {
  BookParkingDetailsScreen: {
    parkingLot: ParkingLot;
    vehicle: Vehicle;
  };
};

interface BookParkingDetailsScreenProps {
  navigation: StackNavigation;
}

export type BookingDetails = {
  date: string;
  startTime: string;
  endTime: string;
  price: number;
};

export const BookParkingDetailsScreen: React.FC<
  BookParkingDetailsScreenProps
> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams, "BookParkingDetailsScreen">>();
  const today = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [date, setDate] = useState("");
  const [selectedStartHour, setSelectedStartHour] = useState();
  const [selectedEndHour, setSelectedEndHour] = useState();

  const [startTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  console.log("Date time ", today);
  return (
    <YStack flex={1}>
      <ScrollView style={{ marginHorizontal: 10 * 2.4 }}>
        <H6
          style={{
            marginTop: 4 * 2.4,
            marginBottom: 4 * 1.2
          }}
        >
          Select Date
        </H6>
        <View style={{ marginBottom: 5 }}>
          <Calendar
            minDate={today}
            onDayPress={(day) => {
              setDate(day.dateString);
              console.log(day.dateString);
            }}
            markedDates={{
              [dayjs(date).format("YYYY-MM-DD")]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: "orange"
              }
            }}
          />
        </View>

        <View style={{ marginBottom: 10 }}>
          <H6
            style={{
              marginTop: 4 * 2.4,
              marginBottom: 4 * 1.2
            }}
          >
            Duration
          </H6>

          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={24} // Change maximum value to 24 for hours
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            onValueChange={(value) => console.log(value)}
            step={0.5}
          />
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
              marginBottom: 10 * 2
            }}
          >
            <View
              style={{
                flex: 1,
                marginHorizontal: 10
              }}
            >
              <Text>Start Hour</Text>
              <TouchableOpacity
                onPress={showDatePicker}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10 * 1.2,
                  paddingHorizontal: 10 * 1.5,
                  marginTop: 10 * 0.9,
                  borderRadius: 5,
                  backgroundColor: "white"
                }}
              >
                <Text>{selectedStartHour ? selectedStartHour : "9:00 AM"}</Text>
                <MaterialCommunityIcons
                  name="clock-time-three-outline"
                  size={20}
                  color="grey"
                />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text>End Hour</Text>
              <TouchableOpacity
                onPress={showDatePicker}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10 * 1.2,
                  paddingHorizontal: 10 * 1.5,
                  marginTop: 10 * 0.9,
                  borderRadius: 5,
                  backgroundColor: "white"
                }}
              >
                <Text>{selectedEndHour ? selectedEndHour : "13:00 PM"}</Text>
                <MaterialCommunityIcons
                  name="clock-time-three-outline"
                  size={20}
                  color="grey"
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
          <DashedLine
            dashGap={2}
            dashLength={2}
            dashThickness={1.5}
            dashColor={"grey"}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 4 * 2,
            marginBottom: 4 * 1.5,
            marginHorizontal: 5 * 2
          }}
        >
          <Text style={{}}>Price</Text>
          <Text style={{}}>
            <Text>£5.00 </Text>
            <Text style={{}}>for 1 hour</Text>
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 4 * 2,
            marginBottom: 4 * 1.5
          }}
        >
          <Text style={{}}>Total price</Text>
          <Text style={{}}>
            <Text>£20.00 </Text>
            <Text style={{}}>for 4 hours</Text>
          </Text>
        </View>
      </ScrollView>

      <View
        style={{
          margin: 10 * 2
        }}
      >
        <AwesomeButton
          height={50}
          onPress={() =>
            navigation.navigate("SelectSpotScreen", {
              parkingLot: route.params.parkingLot, // Pass the parking lot to the next screen
              vehicle: route.params.vehicle // Pass the vehicle to the next screen
            })
          }
          raiseLevel={1}
          stretch={true}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="#fff"
        >
          <Text style={{}}>Select Slot</Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};
