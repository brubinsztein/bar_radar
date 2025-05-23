import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function BarCountPill({ count }: { count: number }) {
  return (
    <View style={styles.bubble}>
      <Text style={styles.bubbleText}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E6E9FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -8,
    left: -8,
    zIndex: 99999,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  bubbleText: {
    color: '#5B4EFF',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
}); 