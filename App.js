import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from './constants/colors';
import { CafeProvider } from './context/CafeContext';

import DiscoverScreen from './screens/DiscoverScreen';
import MapScreen from './screens/MapScreen';
import CityGuidesScreen from './screens/CityGuidesScreen';
import TrendingScreen from './screens/TrendingScreen';
import MySipsScreen from './screens/MySipsScreen';
import CafeDetailScreen from './screens/CafeDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Each tab that can push to CafeDetail gets its own stack
function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverHome" component={DiscoverScreen} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} />
    </Stack.Navigator>
  );
}

function TrendingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrendingHome" component={TrendingScreen} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} />
    </Stack.Navigator>
  );
}

function CityGuidesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CityGuidesHome" component={CityGuidesScreen} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} />
    </Stack.Navigator>
  );
}

function MySipsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MySipsHome" component={MySipsScreen} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} />
    </Stack.Navigator>
  );
}

const TAB_ICONS = {
  Discover: 'compass-outline',
  Map: 'map-outline',
  'City Guides': 'book-outline',
  Trending: 'flame-outline',
  'My Sips': 'heart-outline',
};

export default function App() {
  return (
    <SafeAreaProvider>
    <CafeProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: Colors.tabBarBackground,
              borderTopColor: Colors.cardBorder,
              borderTopWidth: 1,
              paddingTop: 8,
            },
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.tabBarInactive,
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '600',
              letterSpacing: 0.2,
            },
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? TAB_ICONS[route.name].replace('-outline', '') : TAB_ICONS[route.name]}
                size={22}
                color={color}
              />
            ),
          })}
        >
          <Tab.Screen name="Discover" component={DiscoverStack} />
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="City Guides" component={CityGuidesStack} />
          <Tab.Screen name="Trending" component={TrendingStack} />
          <Tab.Screen name="My Sips" component={MySipsStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </CafeProvider>
    </SafeAreaProvider>
  );
}
