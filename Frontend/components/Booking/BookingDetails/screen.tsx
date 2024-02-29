import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { RouteProp, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AwesomeButton from "react-native-really-awesome-button";
import { ScrollView, YStack } from "tamagui";
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
  startDateTime: string;
  endDateTime: string;
  totalprice: number;
  rateType?: string;
  rateNumber?: number;
};

const rates = [
  {
    RateType: "hour",
    Rate: 5,
    minimum: 1,
    maximum: 24,
    discount: 0, // data ideas regarding discounts may be added here
    dynamicPricing: {
      baseRate: 5,
      peakRate: 10,
      offPeakRate: 3,
      peakTimes: ["08:00", "18:00"]
    } // data ideas regarding dynamic pricing may be added here
  },
  {
    RateType: "day",
    Rate: 30,
    minimum: 1,
    maximum: 7,
    discount: 0,
    dynamicPricing: {
      baseRate: 5,
      peakRate: 10,
      offPeakRate: 3,
      peakTimes: ["08:00", "18:00"]
    }
  },
  {
    RateType: "week",
    Rate: 150,
    minimum: 1,
    maximum: 4,
    discount: 0,
    dynamicPricing: {
      baseRate: 5,
      peakRate: 10,
      offPeakRate: 3,
      peakTimes: ["08:00", "18:00"]
    }
  },
  {
    RateType: "month",
    Rate: 500,
    minimum: 1,
    maximum: 12,
    discount: 0,
    dynamicPricing: {
      baseRate: 5,
      peakRate: 10,
      offPeakRate: 3,
      peakTimes: ["08:00", "18:00"]
    }
  }
];
export const BookParkingDetailsScreen: React.FC<
  BookParkingDetailsScreenProps
> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams, "BookParkingDetailsScreen">>();

  const [startDateTime, setStartDateTime] = useState<Date>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date>();

  // responsible for showing the time picker when the user clicks on the datetime inputs
  const [timePickerVisible, setTimePickerVisibility] = useState<boolean>(false);

  const handleTimeConfirm = (dateTime: Date) => {
    setStartDateTime(dateTime);
    setTimePickerVisibility(false);
    animateEndDate();
  };

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>();

  const [price, setPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [selectedRateType, setSelectedRateType] = useState(rates[0].RateType);
  const [selectedRateNumber, setSelectedRateNumber] = useState(1);
  const [rateNumbers, setRateNumbers] = useState(
    [...Array(24).keys()].map((n) => n + 1)
  );

  //when the selected rate type changes or the selected rate number changes, I want the calendar to update the marked dates
  //I also want to update the price
  //I also want to update the total price
  useEffect(() => {
    // Calculate the new end date based on the selected rate type and number
    let newEndDateTime: Date = new Date();
    switch (selectedRateType) {
      case "hour":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRateNumber, "hour")
          .toDate();
        break;
      case "day":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRateNumber, "day")
          .toDate();
        break;
      case "week":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRateNumber, "week")
          .toDate();
        break;
      case "month":
        newEndDateTime = dayjs(startDateTime)
          .add(selectedRateNumber, "month")
          .toDate();
        break;
    }

    // Update the end date
    setEndDateTime(newEndDateTime);

    // Calculate and update the price and total price
    const selectedRate = rates.find(
      (rate) => rate.RateType === selectedRateType
    );
    if (selectedRate) {
      const price = selectedRate.Rate;
      const totalprice = selectedRate.Rate * selectedRateNumber;
      // Update the price and total price
      setPrice(price);
      setTotalPrice(totalprice);
      setBookingDetails({
        startDateTime: startDateTime.toISOString(),
        endDateTime: newEndDateTime.toISOString(),
        totalprice: totalprice,
        rateType: selectedRateType,
        rateNumber: selectedRateNumber
      });
    }
  }, [startDateTime, selectedRateType, selectedRateNumber]);

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
                  paddingHorizontal: 10 * 1.5,
                  marginTop: 10 * 0.9,
                  borderRadius: 5,
                  backgroundColor: "white"
                }}
              >
                <Text style={{}}>
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
        <Text style={{ marginBottom: 10, fontWeight: "600" }}>Select Rate</Text>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            borderRadius: 10,
            marginBottom: 10 * 2.5
          }}
        >
          <Picker
            selectedValue={selectedRateNumber}
            onValueChange={(itemValue) => {
              setSelectedRateNumber(itemValue);
              animateEndDate();
            }}
            style={{
              width: "50%",
              marginTop: 10,
              marginBottom: 10
            }}
            itemStyle={{ fontSize: 15 }}
          >
            {rateNumbers.map((number) => (
              <Picker.Item
                key={number}
                label={String(number)}
                value={number}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedRateType}
            onValueChange={(itemValue) => {
              setSelectedRateType(itemValue);
              const selectedRate = rates.find(
                (rate) => rate.RateType === itemValue
              );
              if (selectedRate) {
                setSelectedRateNumber(selectedRate.minimum); // Set the selected number to the minimum of the new rate

                // Create an array with a length equal to the difference between the maximum and minimum of the new rate plus 1
                // The Array.keys() method is used to create an array of keys (indices), which are the numbers from 0 to the difference between the maximum and minimum
                // The map() method is then used to add the minimum of the new rate to each number, resulting in an array of numbers from the minimum to the maximum of the new rate
                setRateNumbers(
                  [
                    ...Array(
                      selectedRate.maximum - selectedRate.minimum + 1
                    ).keys()
                  ].map((n) => n + selectedRate.minimum)
                ); // Update the numbers array
              }
              animateEndDate();
            }}
            style={{
              width: "50%",
              marginTop: 10,
              marginBottom: 10
            }}
            itemStyle={{ fontSize: 15 }}
          >
            {rates.map((rate, index) => (
              <Picker.Item
                key={index}
                label={rate.RateType}
                value={rate.RateType}
              />
            ))}
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
                  paddingHorizontal: 10 * 1.5,
                  marginTop: 10 * 0.9,
                  borderRadius: 5,
                  backgroundColor: "white"
                }}
              >
                <Animated.Text style={{ transform: [{ scale: endDateScale }] }}>
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
                onCancel={() => setTimePickerVisibility(false)}
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
              marginBottom: 4 * 1.5,
              marginHorizontal: 5 * 2
            }}
          >
            <Text style={{ fontWeight: "500" }}>Price</Text>
            <Text style={{}}>
              <Text>£{price}</Text>
              <Text style={{}}> per {selectedRateType}</Text>
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
            <Text style={{ fontWeight: "500" }}>TotalPrice</Text>
            <Text style={{}}>
              <Text>£{totalPrice} </Text>
              <Text style={{}}>
                for {selectedRateNumber} {selectedRateType}
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
            navigation.navigate("SelectSpotScreen", {
              parkingLot: route.params.parkingLot, // Pass the parking lot to the next screen
              vehicle: route.params.vehicle, // Pass the vehicle to the next screen
              bookingDetails: bookingDetails // Pass the booking details to the next screen
            });
          }}
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
