import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Type safe icon component
type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
};

const TabIcon = ({ name, color, size = 24 }: IconProps) => {
  return <Ionicons name={name} size={size} color={color} />;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0077B6', // TrackTreat AI primary color
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#FFFFFF',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            height: 83, // Add some padding for the home indicator
            paddingBottom: 20,
          },
          default: {
            backgroundColor: '#FFFFFF',
            elevation: 4,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="log-meal"
        options={{
          title: 'Log Meal',
          tabBarIcon: ({ color, size }) => <TabIcon name="add-circle" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <TabIcon name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <TabIcon name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
