import React from 'react';
import { Stack } from 'expo-router';
import DashboardScreen from '../src/screens/Dashboard/DashboardScreen';

export default function Dashboard() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Dashboard", 
          headerShown: false 
        }} 
      />
      <DashboardScreen />
    </>
  );
}
