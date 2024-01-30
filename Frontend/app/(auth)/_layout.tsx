import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const PublicLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "black"
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Home",
          headerShown: false,
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
        name="sessions"
        options={{
          headerTitle: "Session",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="stopwatch-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Session"
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "Profile"
        }}
      />
    </Tabs>
  );
};

export default PublicLayout;
