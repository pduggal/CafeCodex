import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Animated } from 'react-native';
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
  Author: 'person-circle-outline',
  'My List': 'bookmark-outline',
  Recommend: 'add-circle-outline',
};

const LOADING_MESSAGES = [
  'Finding the best cups…',
  'Curating your list…',
  "Checking Pallavi's picks…",
  'Almost ready…',
];

function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cycle = () => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    };
    const interval = setInterval(cycle, 2000);
    return () => clearInterval(interval);
  }, [opacity]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Text style={{ color: Colors.primary, fontSize: 28, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 }}>Café Codex</Text>
      <Text style={{ color: Colors.textMuted, fontSize: 13, marginBottom: 40 }}>Your record of the world's best cups</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={{ marginBottom: 24 }} />
      <Animated.Text style={{ color: Colors.textMuted, fontSize: 13, opacity }}>
        {LOADING_MESSAGES[msgIndex]}
      </Animated.Text>
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
            <Tab.Screen name="Author" component={AuthorScreen} />
            <Tab.Screen name="My List" component={MyListStack} />
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
