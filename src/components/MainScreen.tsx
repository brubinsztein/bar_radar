import React, { useState, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import MapView from 'react-native-maps';
import { HeaderBar } from './HeaderBar';
import { BarCountPill } from './BarCountPill';
import { FilterBar } from './FilterBar';
import { FilterDrawer } from './FilterDrawer';
import { useApp } from '../core/AppContext';
import { filterBars, BarFilter } from '../utils/filterBars';
import { MAP_CONFIG } from '../config/constants';
import { BarMarker } from './BarMarker';

const FILTER_MAP: Record<string, Partial<BarFilter>> = {
  deals: { type: 'bar', minRating: 4.0, openNow: true },
  outside: { type: 'pub', openNow: true },
  garden: { type: 'bar', maxPriceLevel: 2 },
  pool: { type: 'pub', minRating: 3.5 },
};

export function MainScreen() {
  const { bars } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('garden');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Compose filter object from selected filter
  const filter: BarFilter = useMemo(() => {
    return FILTER_MAP[selectedFilter] || {};
  }, [selectedFilter]);

  // Filter bars using backend logic
  const filteredBars = useMemo(() => filterBars(bars.bars, filter), [bars.bars, filter]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <HeaderBar />
        <MapView
          style={styles.mapPlaceholder}
          initialRegion={MAP_CONFIG.DEFAULT_REGION}
        >
          {filteredBars.map((bar) => (
            <BarMarker key={bar.id} bar={bar} onPress={() => {}} />
          ))}
        </MapView>
        {/* BarCountPill moves to top when drawer is open */}
        {drawerOpen ? (
          <View style={styles.topPill}><BarCountPill count={filteredBars.length} /></View>
        ) : (
          <BarCountPill count={filteredBars.length} />
        )}
        <View style={styles.spacer} />
        <FilterBar selected={selectedFilter} onSelect={setSelectedFilter} />
        <FilterDrawer open={drawerOpen} onToggle={() => setDrawerOpen(o => !o)} />
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
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  spacer: {
    height: 12,
  },
  topPill: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
  },
}); 