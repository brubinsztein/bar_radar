import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { HeaderBar } from './HeaderBar';
import { BarCountPill } from './BarCountPill';
import { FilterBar } from './FilterBar';
import { FilterDrawer } from './FilterDrawer';

export function UiPrototype() {
  const [selectedFilter, setSelectedFilter] = useState('garden');
  const [barCount, setBarCount] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <HeaderBar />
        <View style={styles.mapPlaceholder} />
        {/* BarCountPill moves to top when drawer is open */}
        {drawerOpen ? (
          <View style={styles.topPill}><BarCountPill count={barCount} /></View>
        ) : (
          <BarCountPill count={barCount} />
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