import React from 'react';
import { Stack, router } from 'expo-router';
import LoginScreen from '../src/screens/Auth/LoginScreen';

export default function Login() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Sign In", 
          headerShown: false 
        }} 
      />
      <LoginScreen 
        navigation={{
          navigate: (route: string) => {
            // Map old navigation to Expo Router
            if (route === 'Signup') {
              router.push('/signup');
            } else if (route === 'Main') {
              router.replace('/dashboard');
            }
          }
        }}
      />
    </>
  );
}
