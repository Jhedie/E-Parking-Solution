import { Vehicle } from "@models/Vehicle";
import { useConfig } from "@providers/Config/ConfigProvider";
import firestore from "@react-native-firebase/firestore";
import { Car, Sun, User } from "@tamagui/lucide-icons";
import axios from "axios";
import * as Burnt from "burnt";
import useToken from "hooks/useToken";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import { Avatar, ListItem, XStack, YGroup, YStack } from "tamagui";
import { useAuth } from "../../../providers/Authentication/AuthProvider";
const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const token = useToken();
  const [defaultVehicle, setDefaultVehicle] = useState<Vehicle | null>(null);
  const { BASE_URL } = useConfig();

  useEffect(() => {
    const fetchDefaultVehicle = async () => {
      try {
        const vehicleRef = firestore()
          .collection("driver")
          .doc(user?.uid)
          .collection("vehicles")
          .where("defaultVehicle", "==", true)
          .limit(1);

        const docSnapshot = await vehicleRef.get();
        if (!docSnapshot.empty) {
          const vehicleData = docSnapshot.docs[0].data() as Vehicle;
          setDefaultVehicle(vehicleData);
        } else {
          console.log("No default vehicle found");
        }
      } catch (error) {
        console.error("Error fetching user's default vehicle:", error);
      }
    };

    if (user?.uid) {
      fetchDefaultVehicle();
    }
  }, [user?.uid]);

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="$6"
    >
      <XStack
        alignItems="center"
        gap="$6"
      >
        <Avatar
          circular
          size="$10"
        >
          <Avatar.Image
            accessibilityLabel="Cam"
            src="https://picsum.photos/200/300"
          />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
      </XStack>

      <YGroup
        alignSelf="center"
        bordered
        width={300}
        size="$4"
      >
        <YGroup.Item>
          <ListItem
            hoverTheme
            icon={User}
            title="Name"
            subTitle={user?.displayName}
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            hoverTheme
            icon={Sun}
            title="Email"
            subTitle={user?.email}
          />
        </YGroup.Item>
        <YGroup.Item>
          <ListItem
            hoverTheme
            icon={Car}
            title="Your Vehicle"
            subTitle={
              defaultVehicle?.registrationNumber ?? "No default vehicle"
            }
          />
        </YGroup.Item>
      </YGroup>
      <YStack>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
            marginTop: 30
          }}
        >
          <AwesomeButton
            height={50}
            width={200}
            onPress={async () => {
              try {
                await axios.delete(`${BASE_URL}/account/${user?.uid}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                Burnt.toast({
                  title: "Account deleted successfully",
                  duration: 5000,
                  preset: "done"
                });
                signOut();
              } catch (error) {
                Burnt.toast({
                  title: "Failed to delete account",
                  duration: 5,
                  preset: "error"
                });
                console.error("Error deleting user account:", error);
              }
            }}
            raiseLevel={1}
            borderRadius={10}
            backgroundColor="black"
            backgroundShadow="black"
          >
            <Text
              numberOfLines={1}
              style={{ overflow: "hidden", color: "white" }}
            >
              Delete Account
            </Text>
          </AwesomeButton>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
            marginTop: 30
          }}
        >
          <AwesomeButton
            height={50}
            width={200}
            onPress={() => {
              Burnt.toast({
                title: "Signed out",
                duration: 5,
                preset: "done"
              });
              signOut();
            }}
            raiseLevel={1}
            borderRadius={10}
            backgroundColor="rgb(253 176 34)"
            backgroundShadow="black"
          >
            <Text
              numberOfLines={1}
              style={{ overflow: "hidden", color: "black" }}
            >
              Sign Out
            </Text>
          </AwesomeButton>
        </View>
      </YStack>
    </YStack>
  );
};

export default ProfileScreen;
