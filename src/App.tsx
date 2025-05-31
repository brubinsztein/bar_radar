import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { VenueList } from './components/VenueList';

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

export default function App() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sunnyFilterActive, setSunnyFilterActive] = useState(false);
  const [sunExposureCache, setSunExposureCache] = useState<Record<string, SunExposureResult>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterSelect = (filter: string) => {
    setSelectedFilters(prev => [...prev, filter]);
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
  };

  const handleSunnyFilter = (filter: string) => {
    if (filter === 'sunny') {
      setSunnyFilterActive(!sunnyFilterActive);
    }
  };

  const fetchSunExposure = async (venue: Venue) => {
    const cacheKey = `${venue.latitude},${venue.longitude}`;
    if (sunExposureCache[cacheKey]) {
      return sunExposureCache[cacheKey];
    }

    try {
      const response = await fetch('http://localhost:3000/sun-exposure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: venue.latitude,
          longitude: venue.longitude,
          datetime: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      setSunExposureCache(prev => ({ ...prev, [cacheKey]: data }));
      return data;
    } catch (error) {
      console.error('Error fetching sun exposure:', error);
      return null;
    }
  };

  const filteredVenues = venues.filter(async venue => {
    if (sunnyFilterActive) {
      setIsLoading(true);
      const sunExposure = await fetchSunExposure(venue);
      setIsLoading(false);
      if (sunExposure && sunExposure.isInSun) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <Header />
      <FilterBar
        selected={selectedFilters}
        onSelect={handleFilterSelect}
        count={filteredVenues.length}
        onSpecialFilter={handleSunnyFilter}
        onClear={handleClearFilters}
      />
      <VenueList
        venues={filteredVenues}
        isLoading={isLoading}
        sunExposureData={sunExposureCache}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 