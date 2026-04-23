import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from './constants/colors';
import { CafeProvider, useCafes } from './context/CafeContext';

import OnboardingScreen from './screens/OnboardingScreen';
import SwipeScreen from './screens/SwipeScreen';
import MyListScreen from './screens/MyListScreen';
import CafeDetailScreen from './screens/CafeDetailScreen';
import AuthorScreen from './screens/AuthorScreen';
import NominateScreen from './screens/NominateScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingHome" component={OnboardingScreen} />
      <Stack.Screen name="SwipeHome" component={SwipeScreen} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} />
    </Stack.Navigator>
  );
}

function MyListStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyListHome" component={MyListScreen} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} />
    </Stack.Navigator>
  );
}

const TAB_ICONS = {
  Discover: 'compass-outline',
  'My List': 'list-outline',
  Author: 'person-outline',
  Recommend: 'star-outline',
};

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: Colors.primary, fontSize: 26, fontWeight: '800', marginBottom: 8 }}>Café Codex</Text>
      <Text style={{ color: Colors.textMuted, fontSize: 13, marginBottom: 24 }}>Loading your cafes...</Text>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

function AppContent() {
  const { loading } = useCafes();
  if (loading) return <LoadingScreen />;
  return (
    <>
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
            <Tab.Screen name="My List" component={MyListStack} />
            <Tab.Screen name="Author" component={AuthorScreen} />
            <Tab.Screen name="Recommend" component={NominateScreen} />
          </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CafeProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </CafeProvider>
    </SafeAreaProvider>
  );
}
