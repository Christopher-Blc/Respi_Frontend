import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppIndex from './src/app'; // or './src/app/index'

export default function App() {
  return (
    <View style={styles.container}>
      <AppIndex />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
});