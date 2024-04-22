import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BookingDetails } from "@models/BookingDetails";
import { ParkingLot } from "@models/ParkingLot";
import { Rate } from "@models/ParkingLotRate";
import { Vehicle } from "@models/Vehicle";
import { Picker } from "@react-native-picker/picker";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView, YStack } from "tamagui";
import { StackNavigation } from "../../../app/(auth)/home";
type RouteParams = {
  BookParkingDetailsScreen: {
    parkingLot: ParkingLot;
    vehicle: Vehicle;
  };
};

interface BookParkingDetailsScreenProps {
  navigation: StackNavigation;
}

export const BookParkingDetailsScreen: React.FC<
  BookParkingDetailsScreenProps
> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams, "BookParkingDetailsScreen">>();

  const queryClient = useQueryClient();

  const parkingLotRates = queryClient.getQueryData(["parkingLotRates"]);

  const [startDateTime, setStartDateTime] = useState<Date>(new Date());

  const ratesRevised = parkingLotRates;
  console.log("ratesRevised", ratesRevised);

  const [endDateTime, setEndDateTime] = useState<Date>();

  // responsible for showing the time picker when the user clicks on the datetime inputs
  const [timePickerVisible, setTimePickerVisibility] = useState<boolean>(false);

  const handleTimeConfirm = (dateTime: Date) => {
    setStartDateTime(dateTime);
    setTimePickerVisibility(false);
    animateEndDate();
  };

  const defaultRate: Rate = {
    duration: 0,
    rate: 0,
    rateId: "",
    rateType: "",
    lotId: ""
  };

  const [selectedRate, setSelectedRate] = useState<Rate>(
    ratesRevised?.["parkingLotRates"]?.[0] ?? defaultRate
  );
  const [totalPrice, setTotalPrice] = useState<number>(
    ratesRevised?.["parkingLotRates"]?.[0]?.rate ?? 0
  );

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>();

  //when the selected rate changes, calendar should update the marked dates
  //I also want to update the price
  //I also want to update the total price
  useEffect(() => {
    // Calculate the new end date based on the selected rate type and number
    let newEndDateTime: Date = new Date();

    const rateTypeLower = selectedRate?.rateType.toLowerCase(); // Convert to lowercase

    switch (rateTypeLower) {
      case "minute":
      case "minutes":
      case "min":
      case "mins":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRate?.duration, "minute")
          .toDate();
        break;
      case "hour":
      case "hours":
      case "hr":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRate?.duration, "hour")
          .toDate();
        break;
      case "day":
      case "days":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRate?.duration, "day")
          .toDate();
        break;
      case "week":
      case "weeks":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRate?.duration, "week")
          .toDate();
        break;
      case "month":
      case "months":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRate?.duration, "month")
          .toDate();
        break;
      case "year":
      case "years":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRate?.duration, "year")
          .toDate();
        break;
    }

    // Update the end date
    setEndDateTime(newEndDateTime);

    const foundRate = ratesRevised?.["parkingLotRates"]?.find(
      (rate: Rate) => rate.rateId === selectedRate?.rateId
    );

    if (foundRate) {
      const totalprice = selectedRate?.rate;
      setTotalPrice(totalprice);
      setBookingDetails({
        startDateTime: startDateTime.toISOString(),
        endDateTime: newEndDateTime.toISOString(),
        totalprice: totalprice,
        rate: selectedRate
      });
    }
  }, [startDateTime, selectedRate]);

  const endDateScale = React.useRef(new Animated.Value(1)).current;
  const animateEndDate = () => {
    Animated.sequence([
      Animated.timing(endDateScale, {
        toValue: 1.1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.timing(endDateScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  return (
    <YStack flex={1}>
      <ScrollView
        style={{ marginHorizontal: 10 * 2.4 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View
            style={{
              marginTop: 10 * 2.4,
              marginBottom: 10
            }}
          >
            <View style={{ flex: 1, marginBottom: 10 }}>
              <Text style={{ fontWeight: "600" }}>
                Select Start Date and Time
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setTimePickerVisibility(true);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10 * 1.2,
                  paddingHorizontal: 10,
                  marginTop: 10 * 0.9,
                  borderRadius: 5,
                  backgroundColor: "white",
                  borderBottomWidth: 2,
                  borderBottomColor: "grey"
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                    padding: 10
                  }}
                >
                  {startDateTime
                    ? `${dayjs(startDateTime).format(
                        "MMMM D, YYYY"
                      )} at ${dayjs(startDateTime, "HH:mm").format("h:mm A")}`
                    : startDateTime}
                </Text>
                <MaterialCommunityIcons
                  name="clock-time-three-outline"
                  size={20}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={{ marginBottom: 10, fontWeight: "600" }}>
          Select Duration
        </Text>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            borderRadius: 10,
            marginBottom: 10 * 2.5
          }}
        >
          <Picker
            selectedValue={selectedRate?.rateId}
            onValueChange={(itemValue) => {
              console.log("itemValue", itemValue);
              const selectedRate = ratesRevised?.["parkingLotRates"]?.find(
                (rate: Rate) => rate.rateId === itemValue
              );
              if (selectedRate) {
                console.log("selectedRate", selectedRate);
                setSelectedRate(selectedRate);
              }
              animateEndDate();
            }}
            style={{
              width: "100%",
              marginTop: 10,
              marginBottom: 10,
              fontWeight: "600"
            }}
            itemStyle={{ fontSize: 18, fontWeight: "600" }}
          >
            {ratesRevised?.["parkingLotRates"]?.map(
              (rate: Rate, index: number) => (
                <Picker.Item
                  key={rate?.rateId}
                  label={rate?.duration + " " + rate?.rateType}
                  value={rate?.rateId}
                />
              )
            )}
          </Picker>
        </View>
        <View>
          <View
            style={{
              marginBottom: 10 * 2.4
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600" }}>End Date and Time</Text>
              <TouchableOpacity
                disabled
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10 * 1.2,
                  paddingHorizontal: 10,
                  marginTop: 10 * 0.9,
                  borderRadius: 5,
                  backgroundColor: "#ededed"
                }}
              >
                <Animated.Text
                  style={{
                    transform: [{ scale: endDateScale }],
                    fontWeight: "500",
                    fontSize: 16,
                    padding: 10
                  }}
                >
                  {endDateTime
                    ? `${dayjs(endDateTime).format("MMMM D, YYYY")} at ${dayjs(
                        endDateTime,
                        "HH:mm"
                      ).format("h:mm A")}`
                    : "End"}
                </Animated.Text>
                <MaterialCommunityIcons
                  name="clock-time-three-outline"
                  size={20}
                  color="grey"
                />
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={timePickerVisible}
                mode="datetime"
                onConfirm={(dateTime: Date) => {
                  handleTimeConfirm(dateTime);
                }}
                onChange={(dateTime) => {
                  console.log("onChange", dateTime);
                }}
                onCancel={() => {
                  setTimePickerVisibility(false);
                }}
                minimumDate={startDateTime} // Set the minimum date to the current date
              />
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 5,
            padding: 10,
            marginBottom: 10
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4 * 1,
              marginHorizontal: 4
            }}
          >
            <Text style={{ fontWeight: "500", fontSize: 16 }}>Total Price</Text>
            <Text style={{ fontSize: 16 }}>
              <Text>£{totalPrice} </Text>
              <Text style={{}}>
                for {selectedRate?.duration} {selectedRate?.rateType}
              </Text>
            </Text>
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
          onPress={() => {
            if (!startDateTime || !endDateTime || !bookingDetails) {
              alert(
                "Please select both start and end times before proceeding."
              );
              return;
            }
            navigation.navigate("SelectSlotScreen", {
              parkingLot: route.params.parkingLot, // Pass the parking lot to the next screen
              vehicle: route.params.vehicle, // Pass the vehicle to the next screen
              bookingDetails: bookingDetails, // Pass the booking details to the next screen
              selectedRate: selectedRate // Pass the selected rate to the next screen
            });
          }}
          raiseLevel={1}
          stretch={true}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="rgb(253 176 34)"
        >
          <Text style={{ color: "black", fontWeight: "500" }}>Next</Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};
