import React from 'react';
import { Stack } from 'expo-router';
import ProfileScreen from '../src/screens/Profile/ProfileScreen';

export default function Profile() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Profile", 
          headerShown: false 
        }} 
      />
      <ProfileScreen />
    </>
  );
}
