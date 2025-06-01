import React from 'react';
import { Stack } from 'expo-router';
import CalendarScreen from '../src/screens/Calendar/CalendarScreen';

export default function Calendar() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Calendar", 
          headerShown: false 
        }} 
      />
      <CalendarScreen />
    </>
  );
}
