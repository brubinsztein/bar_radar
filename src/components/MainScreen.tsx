import React, { useState, useMemo, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Modal, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { HeaderBar } from './HeaderBar';
import { BarCountPill } from './BarCountPill';
import { FilterBar } from './FilterBar';
import { useApp } from '../core/AppContext';
import { filterBars, BarFilter } from '../utils/filterBars';
import { MAP_CONFIG } from '../config/constants';
import { BarMarker } from './BarMarker';

const FILTER_MAP: Record<string, Partial<BarFilter>> = {
  bar: { type: 'bar' },
  pub: { type: 'pub' },
  '4star': { minRating: 4 },
  openNow: { openNow: true },
  outside: { type: 'pub', openNow: true },
  garden: { type: 'bar', maxPriceLevel: 2 },
  pool: { type: 'pub', minRating: 3.5 },
  // openLate handled as a modal for now
};

export function MainScreen() {
  const { bars, location } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string | null>('garden');
  const [showDealsModal, setShowDealsModal] = useState(false);

  // Debug logs
  console.log('MainScreen rendered');
  React.useEffect(() => {
    console.log('Location loaded', location);
  }, [location.location, location.isLoading]);
  React.useEffect(() => {
    console.log('Bars loaded', bars);
  }, [bars.bars, bars.isLoading]);

  // Handle filter selection (toggle off if same filter is clicked)
  const handleFilterSelect = (filterKey: string | null) => {
    setSelectedFilter(prev => (prev === filterKey ? null : filterKey));
  };

  const handleSpecialFilter = (filterKey: string) => {
    setShowDealsModal(true);
  };

  // Compose filter object from selected filter
  const filter: BarFilter = useMemo(() => {
    return selectedFilter ? (FILTER_MAP[selectedFilter] || {}) : {};
  }, [selectedFilter]);

  // Filter bars using backend logic
  const filteredBars = useMemo(() => filterBars(bars.bars, filter), [bars.bars, filter]);

  // Global loading indicator
  if (location.isLoading || bars.isLoading) {
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Floating HeaderBar */}
        <View style={styles.floatingHeaderBarContainer} pointerEvents="box-none">
          <HeaderBar />
        </View>
        <MapView
          style={styles.mapPlaceholder}
          region={location.location ? {
            latitude: location.location.coords.latitude,
            longitude: location.location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          } : MAP_CONFIG.DEFAULT_REGION}
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
            <BarMarker key={bar.id} bar={bar} onPress={() => {}} />
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
          <FilterBar selected={selectedFilter} onSelect={handleFilterSelect} count={filteredBars.length} onSpecialFilter={handleSpecialFilter} />
        </View>
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
    top: 130,
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
}); 