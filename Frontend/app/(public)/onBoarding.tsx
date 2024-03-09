import React, { useEffect } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";

import { useNavigation, useRouter } from "expo-router";

import Onboarding from "react-native-onboarding-swiper";
import { Button, Image } from "tamagui";

import { colors } from "@theme/colors";

import { storage } from "@utils/asyncStorage";

import CardsAndBikeAndBuildingInBackgroundSvg from "@assets/static/images/building-and-parked-cars-andbikes.png";
import parkingPanalWithBikeusingMobile from "../../assets/static/images/Parking-panal-with-bikeusing-mobile.png";
import parkingAreaPlace from "../../assets/static/images/parking-area-place.png";
import userScanningCard from "../../assets/static/images/user-scanning-card.png";

import LockIcon from "@assets/static/svgs/lock-icon.svg";
import MapIcon from "@assets/static/svgs/map-icon.svg";
import SettingIcon from "@assets/static/svgs/settings-icon.svg";

interface OnboardingPage {
  backgroundColor: string;
  image: JSX.Element;
  title: JSX.Element;
  subtitle: JSX.Element;
}

const { height, width } = Dimensions.get("window");
const potrait = height > width;
// const isLight = tinycolor(backgroundColor).getBrightness() > 180;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const pages: OnboardingPage[] = [
    {
      backgroundColor: "white",
      image: (
        <View style={styles.topContainer}>
          <View style={styles.parkingAreaContainer}>
            <View style={styles.parkingAreaPlaceBackground}></View>
            <Image
              style={styles.svgImage}
              source={parkingAreaPlace}
            />
          </View>
        </View>
      ),
      // <Image source={require('../../assets/static/images/parking-area-place.png')} />,
      title: (
        <View
          style={styles.titleContainer}
          className="px-8 flex-col mb-4"
        >
          <Text style={styles.title}>Welcome to</Text>
          <Text
            style={[
              styles.title,
              {
                fontWeight: "700",
                color: colors.PRIMARY
              }
            ]}
            className=""
          >
            E-Parky
          </Text>
        </View>
      ),
      subtitle: (
        <View className="px-8">
          <Text
            style={styles.subtitle}
            className="flex flex text-base text-gray-500"
          >
            Smart parking app that helps you find and book parking spots near
            you.
          </Text>
        </View>
      )
    },
    {
      backgroundColor: "white",
      image: (
        <View style={styles.topContainer}>
          <View style={styles.parkingAreaContainer}>
            <View
              style={{
                ...styles.parkingAreaPlaceBackground,
                backgroundColor: colors.WARNING[50]
              }}
            ></View>
            <Image
              style={styles.svgImage}
              source={parkingPanalWithBikeusingMobile}
            />
          </View>
        </View>
      ),
      // <Image style={styles.svgImage} source={require('../../assets/static/images/Parking-panal-with-bikeusing-mobile.png')} />,
      title: (
        <View className="px-8 flex flex-col items-center justify-center mx-auto">
          <View className="icon-container mb-3">
            <View
              className="bg-primary-100"
              style={{
                width: 45,
                height: 45,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: 33,
                  height: 33,
                  borderRadius: 40
                }}
                className="flex justify-center items-center bg-primary-200"
              >
                <MapIcon
                  width={15}
                  height={15}
                />
              </View>
            </View>
          </View>
          <Text className="text-lg font-bold text-dark head ">
            Explore Near By Parking
          </Text>
        </View>
        // <CircleIconWithText
        // showIcon
        // icon={MapIcon}
        // title="Explore Near By Parking"
        // />
      ),
      subtitle: (
        <View className="px-8 mx-auto">
          <Text className="text-sm font-muted text-gray-500 text-center mt-1">
            Search for available parking spaces on a map or by address
          </Text>
        </View>
      )
    },
    {
      backgroundColor: "white",
      image: (
        <View style={styles.topContainer}>
          <View style={styles.parkingAreaContainer}>
            <View
              style={{
                ...styles.parkingAreaPlaceBackground,
                backgroundColor: colors.WARNING[50]
              }}
            ></View>
            <Image
              style={styles.svgImage}
              source={CardsAndBikeAndBuildingInBackgroundSvg}
            />
          </View>
        </View>
      ),
      title: (
        <View className="px-8 flex flex-col items-center justify-center mx-auto">
          <View className="icon-container mb-3">
            <View
              className="bg-primary-100"
              style={{
                width: 45,
                height: 45,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: 33,
                  height: 33,
                  borderRadius: 40
                }}
                className="flex justify-center items-center bg-primary-200"
              >
                <SettingIcon
                  width={15}
                  height={15}
                />
              </View>
            </View>
          </View>
          <Text className="text-lg font-bold text-dark head ">
            Parking Facility Details
          </Text>
        </View>
      ),
      subtitle: (
        <View className="px-8 mx-auto">
          <Text className="text-sm font-muted text-gray-500 text-center mt-1">
            View detailed information about parking facilities, such as price,
            and hours.
          </Text>
        </View>
      )
    },
    {
      backgroundColor: "white",
      image: (
        <View style={styles.topContainer}>
          <View style={styles.parkingAreaContainer}>
            <View
              style={{
                ...styles.parkingAreaPlaceBackground,
                backgroundColor: colors.WARNING[50]
              }}
            ></View>
            <Image
              style={styles.svgImage}
              source={userScanningCard}
            />
          </View>
        </View>
      ),
      title: (
        <View className="px-8 flex flex-col items-center justify-center mx-auto">
          <View className="icon-container mb-3">
            <View
              className="bg-primary-100"
              style={{
                width: 45,
                height: 45,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: 33,
                  height: 33,
                  borderRadius: 40
                }}
                className="flex justify-center items-center bg-primary-200"
              >
                <LockIcon
                  width={15}
                  height={15}
                />
              </View>
            </View>
          </View>
          <Text className="text-lg font-bold text-dark head ">
            Parking Facility Details
          </Text>
        </View>
      ),
      subtitle: (
        <View className="px-8 mx-auto">
          <Text className="text-sm font-muted text-gray-500 text-center mt-1">
            Reserve a parking spot in advance and pay securely with your
            preferred method
          </Text>
        </View>
      )
    }
  ];

  const CustomNextButton = ({ isLight, selected, onPress, ...props }) => {
    return (
      <View className={"mr-6"}>
        <Button
          className="px-10  text-center bg-primary-400 rounded-lg dark:bg-primary-700 dark:text-white"
          size="$4"
          theme="active"
          onPress={onPress}
        >
          Next
        </Button>
      </View>
    );
  };

  const CustomSkiButton = ({ isLight, skipLabel, selected, ...props }) => {
    return (
      <View className={"ml-3"}>
        <Button
          className="px-10 text-sm text-center rounded-lg focus:ring-4 focus:outline-none bg-transparent"
          {...props}
        >
          {skipLabel}
        </Button>
        {/* <Text className="text-base">
              Next
            </Text> */}
      </View>
    );
  };

  const CustomDots = ({ isLight, selected }) => {
    return (
      <View
        className={`${selected ? "bg-primary-400" : "bg-gray-300"} rounded-md`}
        style={{
          width: 10,
          height: 10,
          marginHorizontal: 3
        }}
      />
    );
  };

  const CustomDoneComponent = ({ isLight, ...props }) => {
    return (
      <View className={"mr-6"}>
        <Button
          className="px-10  text-center bg-primary-400 rounded-lg dark:bg-primary-700 dark:text-white"
          {...props}
        >
          Start
        </Button>
      </View>
    );
  };

  async function handleDoneButtonAction() {
    // update the 'onboarding' to 1 (complete)
    // storage.setItem("onboarding", 1);
    console.log("Pressed");
    const onboardingValue = await storage.setItem("onboarding", 1);
    router.replace("/(public)/welcome");
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Onboarding
        pages={pages}
        bottomBarHighlight={false}
        containerStyles={styles.containerStyles}
        imageContainerStyles={styles.imageContainer}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        allowFontScaling={true}
        controlStatusBar={true}
        NextButtonComponent={CustomNextButton}
        SkipButtonComponent={CustomSkiButton}
        DotComponent={CustomDots}
        DoneButtonComponent={CustomDoneComponent}
        skipToPage={pages.length - 1}
        onDone={handleDoneButtonAction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 25
  },
  containerStyles: {
    alignItems: "flex-start"
  },
  topContainer: {
    width: width,
    alignItems: "center",
    display: "flex",
    height: height * 0.3
  },
  image: {
    width: width,
    alignItems: "center",
    display: "flex"
  },
  parkingAreaContainer: {
    width: width,
    top: 0,
    display: "flex",
    height: height * 0.1
  },
  parkingAreaPlaceBackground: {
    backgroundColor: "#FEF0C7",
    zIndex: 1,
    width: width,
    borderEndEndRadius: 35,
    position: "absolute",
    height: height * 0.6,
    bottom: -135
  },
  svgImage: {
    width: width,
    position: "absolute",
    bottom: -135,
    zIndex: 2
  },

  imageContainer: {
    flex: 0,
    paddingBottom: potrait ? 30 : 10,
    alignItems: "center",
    width: "100%"
  },
  padding: {
    paddingHorizontal: 10
  },

  titleContainer: {
    paddingHorizontal: 15,
    width: width * 0.8
  },

  title: {
    textAlign: "left",
    fontSize: 36,
    fontWeight: "600"
  },
  subtitle: {
    textAlign: "left",
    // paddingHorizontal: 15,
    fontWeight: "300"
  }
});

export default OnboardingScreen;
