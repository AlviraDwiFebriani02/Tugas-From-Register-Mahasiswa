import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import PesertaListScreen from "./src/screens/PesertaListScreen";
import PesertaFormScreen from "./src/screens/PesertaFormScreen";
import PesertaDetailScreen from "./src/screens/PesertaDetailScreen";
import ProvinsiListScreen from "./src/screens/ProvinsiListScreen";
import ProvinsiFormScreen from "./src/screens/ProvinsiFormScreen";
import KabkotListScreen from "./src/screens/KabkotListScreen";
import KabkotFormScreen from "./src/screens/KabkotFormScreen";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PesertaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PesertaList" component={PesertaListScreen} options={{ title: "Data Peserta" }} />
      <Stack.Screen name="PesertaForm" component={PesertaFormScreen} options={{ title: "Form Peserta" }} />
      <Stack.Screen name="PesertaDetail" component={PesertaDetailScreen} options={{ title: "Detail Peserta" }} />
    </Stack.Navigator>
  );
}

function ProvinsiStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProvinsiList" component={ProvinsiListScreen} options={{ title: "Data Provinsi" }} />
      <Stack.Screen name="ProvinsiForm" component={ProvinsiFormScreen} options={{ title: "Form Provinsi" }} />
    </Stack.Navigator>
  );
}

function KabkotStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="KabkotList" component={KabkotListScreen} options={{ title: "Data Kabupaten/Kota" }} />
      <Stack.Screen name="KabkotForm" component={KabkotFormScreen} options={{ title: "Form Kabupaten/Kota" }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "#999",
        }}
      >
        <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
        <Tab.Screen
          name="Peserta"
          component={PesertaStack}
          options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text> }}
        />
        <Tab.Screen
          name="Provinsi"
          component={ProvinsiStack}
          options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏛️</Text> }}
        />
        <Tab.Screen
          name="Kabkot"
          component={KabkotStack}
          options={{
            title: "Kab/Kota",
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📍</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}