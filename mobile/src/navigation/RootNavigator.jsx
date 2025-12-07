import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { palette } from "../theme/colors.js";
import HomeScreen from "../screens/HomeScreen.jsx";
import ExploreScreen from "../screens/ExploreScreen.jsx";
import DetailScreen from "../screens/DetailScreen.jsx";
import PlayerScreen from "../screens/PlayerScreen.jsx";
import LibraryScreen from "../screens/LibraryScreen.jsx";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#0B0B14",
    card: "#0B0B14",
    text: palette.snow,
  },
};

const tabBarOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: "rgba(7,7,15,0.95)",
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  tabBarActiveTintColor: palette.tangerine,
  tabBarInactiveTintColor: palette.fog,
};

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="compass" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="bookmark" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{ headerShown: false, presentation: "fullScreenModal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
