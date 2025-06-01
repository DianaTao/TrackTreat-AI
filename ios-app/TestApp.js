import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function TestApp() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TrackTreat AI</Text>
        <Text style={styles.subtitle}>Welcome to the iOS app!</Text>
        <Text style={styles.info}>This is a test component to verify rendering</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  info: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  }
});
