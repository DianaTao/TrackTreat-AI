import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import DashboardScreen from '../../src/screens/Dashboard/DashboardScreen';

export default function TabIndex() {
  return (
    <SafeAreaView style={styles.container}>
      <DashboardScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
