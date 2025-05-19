import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CustomMarkerProps {
  type: 'bar' | 'pub';
  isSelected?: boolean;
}

export function CustomMarker({ type, isSelected }: CustomMarkerProps) {
  return (
    <View style={[styles.container, isSelected && styles.selected]}>
      <MaterialCommunityIcons
        name={type === 'bar' ? 'glass-cocktail' : 'beer-outline'}
        size={24}
        color={isSelected ? '#fff' : '#2ecc71'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2ecc71',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selected: {
    backgroundColor: '#2ecc71',
    borderColor: '#fff',
  },
}); 