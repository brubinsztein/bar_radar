import React from 'react';
import { Marker } from 'react-native-maps';
import { Bar } from '../types';

interface BarMarkerProps {
  bar: Bar;
  onPress: () => void;
  isSelected?: boolean;
}

export function BarMarker({ bar, onPress }: BarMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: bar.location.latitude,
        longitude: bar.location.longitude,
      }}
      title={bar.name}
      description={bar.vicinity}
      onPress={onPress}
    />
  );
}