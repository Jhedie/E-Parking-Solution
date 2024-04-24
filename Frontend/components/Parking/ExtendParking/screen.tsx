import { ParkingStackNavigation } from "@/(auth)/parking";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BookingDetails } from "@models/BookingDetails";
import { Rate } from "@models/ParkingLotRate";
import { ReservationWithLot } from "@models/ReservationWithLot";
import { useConfig } from "@providers/Config/ConfigProvider";
import { Picker } from "@react-native-picker/picker";
import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { default as dayjs } from "dayjs";
import useToken from "hooks/useToken";
import { default as React, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { default as AwesomeButton } from "react-native-really-awesome-button";
import { YStack } from "tamagui";
interface ExtendParkingScreenProps {
  navigation: ParkingStackNavigation;
}

export type RouteParams = {
  reservation: ReservationWithLot;
};

export const ExtendParkingScreen: React.FC<ExtendParkingScreenProps> = ({
  navigation
}) => {
  const route = useRoute<RouteProp<RouteParams, "reservation">>();
  const reservation = route.params["reservation"] as ReservationWithLot;

  const token = useToken();
  const isFocused = useIsFocused();
  const { BASE_URL } = useConfig();

  const getRatesForParkingLot = async (): Promise<Rate[]> => {
    try {
      console.log("LotId:", reservation.parkingLotDetails.LotId);
      const response = await axios.post(
        `${BASE_URL}/parkingLotRates/parkingLot/${reservation.parkingLotDetails.LotId}`,
        { ownerId: reservation.parkingLotDetails.OwnerId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Fetched parking lot rates:", response.data);

      return response.data;
    } catch (error) {
      console.log("Failed to fetch parking lot rates:", error);
      return [];
    }
  };

  const { data: parkingLotRates } = useQuery({
    queryKey: ["parkingLotRates"],
    queryFn: () => getRatesForParkingLot(),
    enabled: !!token && isFocused
  });

  // Use cachedRates if available, otherwise use data from the query
  const rates = parkingLotRates;

  const [endDateTime, setEndDateTime] = useState<Date>();

  // // responsible for showing the time picker when the user clicks on the datetime inputs
  // const [timePickerVisible, setTimePickerVisibility] = useState<boolean>(false);

  // const handleTimeConfirm = (dateTime: Date) => {
  //   setTimePickerVisibility(false);
  //   animateEndDate();
  // };

  const [selectedRate, setSelectedRate] = useState<Rate>(
    rates?.["parkingLotRates"]?.[0]
  );

  useEffect(() => {
    if (rates?.["parkingLotRates"]?.[0]) {
      setSelectedRate(rates?.["parkingLotRates"]?.[0]);
    }
  }, [rates]);

  const [totalPrice, setTotalPrice] = useState<number>(
    rates?.["parkingLotRates"]?.[0]?.rate ?? 0
  );

  const [bookingExtensionDetails, setBookingExtensionDetails] =
    useState<BookingDetails>();

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
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "minute")
          .toDate();
        break;
      case "hour":
      case "hours":
      case "hr":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "hour")
          .toDate();
        break;
      case "day":
      case "days":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "day")
          .toDate();
        break;
      case "week":
      case "weeks":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "week")
          .toDate();
        break;
      case "month":
      case "months":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "month")
          .toDate();
        break;
      case "year":
      case "years":
        newEndDateTime = dayjs(reservation.endTime)
          .add(selectedRate?.duration, "year")
          .toDate();
        break;
    }

    // Update the end date
    setEndDateTime(newEndDateTime);

    const foundRate = rates?.["parkingLotRates"]?.find(
      (rate: Rate) => rate.rateId === selectedRate?.rateId
    );

    if (foundRate) {
      const totalprice = selectedRate?.rate;
      setTotalPrice(totalprice);
      setBookingExtensionDetails({
        startDateTime: reservation.endTime,
        endDateTime: newEndDateTime.toISOString(),
        totalprice: totalprice,
        rate: selectedRate
      });
    }
  }, [reservation.endTime, selectedRate]);

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

  const handleExtendParking = async () => {
    if (!bookingExtensionDetails) {
      Alert.alert("Error", "Please select a rate to extend the parking");
    }
    console.log("Booking Extension Details:", bookingExtensionDetails);
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
              <Text style={{ fontWeight: "600" }}>Start Date and Time</Text>
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
                  backgroundColor: "#ededed",
                  borderWidth: 1,
                  borderColor: "lightgrey"
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                    padding: 10
                  }}
                >
                  {reservation.startTime
                    ? `${dayjs(reservation.startTime).format(
                        "MMMM D, YYYY"
                      )} at ${dayjs(reservation.startTime, "HH:mm").format(
                        "h:mm A"
                      )}`
                    : reservation.startTime}
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
              const selectedRate = rates?.["parkingLotRates"]?.find(
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
            {rates?.["parkingLotRates"]?.map((rate: Rate, index: number) => (
              <Picker.Item
                key={rate?.rateId}
                label={rate?.duration + " " + rate?.rateType}
                value={rate?.rateId}
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
                  paddingHorizontal: 10,
                  marginTop: 10 * 0.9,
                  borderRadius: 5,
                  backgroundColor: "#ededed",
                  borderWidth: 1,
                  borderColor: "lightgrey"
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
                  {bookingExtensionDetails
                    ? `${dayjs(endDateTime).format("MMMM D, YYYY")} at ${dayjs(
                        endDateTime,
                        "HH:mm"
                      ).format("h:mm A")}`
                    : "Select a start date and time"}
                </Animated.Text>
                <MaterialCommunityIcons
                  name="clock-time-three-outline"
                  size={20}
                  color="grey"
                />
              </TouchableOpacity>

              {/* <DateTimePickerModal
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
                minimumDate={new Date(reservation.endTime)} // Set the minimum date to the current date
              /> */}
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
            <Text style={{ fontWeight: "500", fontSize: 16 }}>
              Previous Total Amount
            </Text>
            <Text style={{ fontSize: 16 }}>
              £{reservation.totalAmount.toFixed(2)}
            </Text>
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
            <Text style={{ fontWeight: "500", fontSize: 16 }}>
              New Total Amount
            </Text>
            <Text style={{ fontSize: 16 }}>
              <Text>£{(totalPrice + reservation.totalAmount).toFixed(2)}</Text>
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
          onPress={handleExtendParking}
          raiseLevel={1}
          stretch={true}
          borderRadius={10}
          backgroundShadow="#fff"
          backgroundDarker="#fff"
          backgroundColor="rgb(253 176 34)"
        >
          <Text style={{ color: "black", fontWeight: "500" }}>Extend</Text>
        </AwesomeButton>
      </View>
    </YStack>
  );
};
