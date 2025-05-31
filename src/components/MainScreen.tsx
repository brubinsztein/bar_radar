import React, { useState, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Modal, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { HeaderBar } from './HeaderBar';
import { BarCountPill } from './BarCountPill';
import { FilterBar } from './FilterBar';
import { useApp } from '../core/AppContext';
import { filterBars, BarFilter } from '../utils/filterBars';
import { MAP_CONFIG } from '../config/constants';
import { BarMarker } from './BarMarker';
import { Ionicons } from '@expo/vector-icons';
import { Bar } from '../types';
import { BarDetailsSheet } from './BarDetailsSheet';

// Hackney coordinates
const HACKNEY_COORDS = {
  latitude: 51.5432,
  longitude: -0.0557,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const FILTER_MAP: Record<string, Partial<BarFilter>> = {
  bar: { type: 'bar' },
  pub: { type: 'pub' },
  '4star': { minRating: 4 },
  openNow: { openNow: true },
  realAle: { realAle: true },
  realFire: { realFire: true },
  dog: { dog: true },
  wheelchair: { wheelchair: true },
  garden: { garden: true },
  food: { food: true },
  craftBeer: { craftBeer: true },
  liveMusic: { liveMusic: true },
  quizNight: { quizNight: true },
  boardGames: { boardGames: true },
  sundayRoast: { sundayRoast: true }
};

export function MainScreen() {
  const { bars, location } = useApp();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showDealsModal, setShowDealsModal] = useState(false);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const mapRef = useRef<MapView>(null);

  // Combine all selected filters into one BarFilter
  const combinedFilter: BarFilter = useMemo(() => {
    if (!selectedFilters.length) return {};
    return selectedFilters.reduce((acc, key) => {
      return { ...acc, ...FILTER_MAP[key] };
    }, {} as BarFilter);
  }, [selectedFilters]);

  // Compute filtered bars
  const filteredBars = useMemo(() => {
    return filterBars(bars.bars, combinedFilter);
  }, [bars.bars, combinedFilter]);

  // Handle filter selection (toggle on/off for multi-select)
  const handleFilterSelect = useCallback((filterKey: string) => {
    setSelectedFilters(prev => {
      if (prev.includes(filterKey)) {
        return prev.filter(f => f !== filterKey);
      } else {
        return [...prev, filterKey];
      }
    });
  }, []);

  const handleSpecialFilter = useCallback((filterKey: string) => {
    console.log('Special filter selected:', filterKey);
    setShowDealsModal(true);
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setSelectedFilters([]);
  }, []);

  // Open Google Maps directions
  const openDirections = (bar: Bar | null) => {
    if (!bar) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bar.location.latitude},${bar.location.longitude}`;
    Linking.openURL(url);
  };

  // Global loading indicator
  if (location.isLoading || bars.isLoading) {
    // Only show loading screen if we don't have any data yet
    if (!bars.bars.length && !location.location) {
      console.log('SHOWING LOADING SCREEN', { locationLoading: location.isLoading, barsLoading: bars.isLoading });
      return (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.85)',
          zIndex: 99999,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ActivityIndicator size="large" color="#5B4EFF" />
          <Text style={{ marginTop: 16, fontSize: 18, color: '#222' }}>Loading...</Text>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Floating HeaderBar */}
        <View style={styles.floatingHeaderBarContainer} pointerEvents="box-none">
          <HeaderBar />
        </View>
        <MapView
          ref={mapRef}
          style={styles.mapPlaceholder}
          region={location.location ? {
            latitude: location.location.coords.latitude,
            longitude: location.location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          } : HACKNEY_COORDS}
          showsCompass={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          onPress={() => setSelectedBar(null)}
        >
          {/* User location marker */}
          {location.location && (
            <Marker
              coordinate={{
                latitude: location.location.coords.latitude,
                longitude: location.location.coords.longitude,
              }}
              title="You are here"
              pinColor="#5B4EFF"
            />
          )}
          {filteredBars.map((bar) => (
            <BarMarker 
              key={bar.id} 
              bar={bar} 
              onPress={() => {
                console.log('[MainScreen] Bar marker pressed:', bar.name);
                setSelectedBar(bar);
              }}
              isSelected={selectedBar?.id === bar.id}
            />
          ))}
        </MapView>
        {/* Subtle Refresh Location Button (top left) */}
        <TouchableOpacity
          style={styles.refreshButtonSubtle}
          onPress={location.requestPermission}
          activeOpacity={0.7}
        >
          <Text style={styles.refreshButtonIconSubtle}>📍</Text>
        </TouchableOpacity>
        {/* Floating FilterBar */}
        <View style={styles.floatingFilterBarContainer} pointerEvents="box-none">
          <FilterBar 
            selected={selectedFilters} 
            onSelect={handleFilterSelect} 
            count={filteredBars.length} 
            onSpecialFilter={handleSpecialFilter} 
            onClear={selectedFilters.length > 0 ? handleClearFilters : undefined}
          />
        </View>
        {/* Floating Directions FAB */}
        {selectedBar && (
          <TouchableOpacity
            style={styles.fabDirections}
            onPress={() => openDirections(selectedBar)}
            activeOpacity={0.85}
          >
            <Text style={styles.fabDirectionsLabel}>Directions</Text>
            <Ionicons name="navigate" size={28} color="#fff" />
          </TouchableOpacity>
        )}
        {/* Bar Details Sheet */}
        <BarDetailsSheet bar={selectedBar} visible={!!selectedBar} onClose={() => setSelectedBar(null)} />
        {/* Deals Coming Soon Modal Overlay */}
        {showDealsModal && (
          <View style={styles.modalOverlayAbsolute}>
            <View style={styles.modalContentCentered}>
              <Text style={styles.modalTitle}>Coming Soon! 🎉</Text>
              <Text style={styles.modalText}>
                Bar owners will soon be able to post their special deals and happy hours directly on Bar Radar.
              </Text>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowDealsModal(false)}
              >
                <Text style={styles.modalButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#EAF6FA',
    marginHorizontal: 0,
    marginTop: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  floatingHeaderBarContainer: {
    position: 'absolute',
    top: 36,
    left: 16,
    right: 16,
    zIndex: 200,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  modalOverlayAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentCentered: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#5B4EFF',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#5B4EFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButtonSubtle: {
    position: 'absolute',
    top: 140,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  refreshButtonIconSubtle: {
    fontSize: 20,
    color: '#888',
  },
  floatingFilterBarContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 44,
    zIndex: 100,
  },
  fabDirections: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 28,
    bottom: 170,
    backgroundColor: '#5B4EFF',
    borderRadius: 32,
    width: 'auto',
    height: 56,
    paddingHorizontal: 18,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 200,
  },
  fabDirectionsLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 