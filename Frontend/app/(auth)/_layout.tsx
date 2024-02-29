import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const PublicLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black"
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Home"
        }}
      />

      <Tabs.Screen
        name="booking"
        options={{
          headerTitle: "Booking",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="calendar-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Booking"
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "My Profile"
        }}
      />
    </Tabs>
  );
};

export default PublicLayout;
