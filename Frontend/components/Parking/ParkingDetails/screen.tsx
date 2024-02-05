import Slider from "@react-native-community/slider";
import dayjs from "dayjs";
import React, { useState } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { H4, ScrollView, YStack } from "tamagui";

export const BookParkingDetailsScreen: React.FC = () => {
  const today = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [date, setDate] = useState("");

  console.log(today);
  return (
    <YStack flex={1}>
      <ScrollView style={{ marginHorizontal: 10 * 2.4 }}>
        <H4 style={{}}>Select Date</H4>
        <View>
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
        <View>
          <H4>Duration</H4>

          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
        </View>
      </ScrollView>
    </YStack>
  );
};
