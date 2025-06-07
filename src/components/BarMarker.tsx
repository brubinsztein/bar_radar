import React from 'react';
import { Marker } from 'react-native-maps';
import { Bar } from '../types';

interface BarMarkerProps {
  bar: Bar;
  onPress: () => void;
  isSelected?: boolean;
}

export function BarMarker({ bar, onPress, isSelected }: BarMarkerProps) {
  // Validate coordinates
  if (!bar.location?.latitude || !bar.location?.longitude || 
      isNaN(bar.location.latitude) || isNaN(bar.location.longitude)) {
    console.warn(`[BarMarker] Invalid coordinates for bar: ${bar.name}`, bar.location);
    return null;
  }

  return (
    <Marker
      coordinate={{
        latitude: bar.location.latitude,
        longitude: bar.location.longitude,
      }}
      onPress={onPress}
      pinColor={isSelected ? "#5B4EFF" : "#FF3B30"}
    />
  );
}