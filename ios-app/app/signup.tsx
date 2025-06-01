import React from 'react';
import { Stack, router } from 'expo-router';
import SignupScreen from '../src/screens/Auth/SignupScreen';

export default function Signup() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Create Account", 
          headerShown: false 
        }} 
      />
      <SignupScreen 
        navigation={{
          navigate: (route: string) => {
            // Map old navigation to Expo Router
            if (route === 'Login') {
              router.push('/login');
            } else if (route === 'Main') {
              router.replace('/dashboard');
            }
          }
        }}
      />
    </>
  );
}
