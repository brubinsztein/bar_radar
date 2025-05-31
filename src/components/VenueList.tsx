import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

interface Venue {
  name: string;
  latitude: number;
  longitude: number;
  // Add other properties as needed
}

interface SunExposureResult {
  isInSun: boolean;
  azimuth: number;
  elevation: number;
}

interface VenueListProps {
  venues: Venue[];
  isLoading: boolean;
  sunExposureData: Record<string, SunExposureResult>;
}

export const VenueList: React.FC<VenueListProps> = ({ venues, isLoading, sunExposureData }) => {
  const renderItem = ({ item }: { item: Venue }) => {
    const sunExposure = sunExposureData[`${item.latitude},${item.longitude}`];
    return (
      <View style={styles.venueItem}>
        <Text style={styles.venueName}>{item.name}</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color="#5B4EFF" />
        ) : sunExposure ? (
          <Text style={styles.sunStatus}>
            {sunExposure.isInSun ? '☀️ In Sun' : '🌙 In Shade'}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <FlatList
      data={venues}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  venueItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
  },
  sunStatus: {
    fontSize: 14,
    color: '#5B4EFF',
  },
}); 