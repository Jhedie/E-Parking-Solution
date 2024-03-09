import MapIcon from "@assets/static/svgs/map-icon.svg";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Define the types for your props
interface CircleIconWithTextProps {
  title: string;
  showIcon: boolean;
  outerCircleWidth?: number;
  outerCircleHeight?: number;
  innerCircleWidth?: number;
  innerCircleHeight?: number;
  icon?: React.ComponentType<{ width: number; height: number }>;
}

const CircleIconWithText: React.FC<CircleIconWithTextProps> = ({
  title,

  showIcon,
  icon: Icon,

  outerCircleWidth,
  outerCircleHeight,
  innerCircleWidth,
  innerCircleHeight
}) => {
  return (
    <View className="px-8 flex flex-col items-center justify-center mx-auto">
      {showIcon && (
        <View className="icon-container mb-3">
          <View
            style={{
              ...styles.circleStyles,
              height: outerCircleHeight ? outerCircleHeight : 45,
              width: outerCircleWidth ? outerCircleWidth : 45
            }}
            className="outer-circle"
          >
            <View
              style={{
                ...styles.circleStyles,
                height: innerCircleHeight ? innerCircleHeight : 33,
                width: innerCircleWidth ? innerCircleWidth : 33
              }}
              className="inner-circle"
            >
              <MapIcon
                width={15}
                height={15}
              />
            </View>
          </View>
        </View>
      )}
      ;<Text className="text-lg font-bold text-dark head">{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginBottom: 3
  },
  circleStyles: {
    // determine outcircle width and heigh from user or make default 45
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default CircleIconWithText;
