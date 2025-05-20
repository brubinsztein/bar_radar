import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function BarCountPill({ count }: { count: number }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.pill, { bottom: insets.bottom + 80 }]}>
      <Text style={styles.text}>Showing <Text style={styles.bold}>{count}</Text> bars</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  text: {
    fontSize: 18,
    color: '#222',
  },
  bold: {
    fontWeight: 'bold',
    color: '#5B4EFF',
  },
}); 