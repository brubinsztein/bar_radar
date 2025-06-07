import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Modal, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { HeaderBar } from './HeaderBar';
import { BarCountPill } from './BarCountPill';
import { FilterBar } from './FilterBar';
import { useApp } from '../core/AppContext';
import { filterBars, BarFilter, isOpenNow } from '../utils/filterBars';
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

// Custom filters always present (Garden removed, Beer garden will be inserted dynamically)
const CUSTOM_FILTERS = [
  { id: 'openNow', label: 'Open Now', icon: '🕒' },
  { id: 'pub', label: 'Pubs', icon: '🍺' },
  { id: 'bar', label: 'Bars', icon: '🍸' },
  { id: '4star', label: '4★+', icon: '⭐' },
  { id: 'sunny', label: 'Sunny', icon: '☀️' }
];

// Map feature labels to emojis
const FEATURE_EMOJIS: Record<string, string> = {
  'Beer garden': '🌳',
  'Cocktails': '🍹',
  'Craft beer': '🍺',
  'Dog-friendly': '🐶',
  'Food menu': '🍽️',
  'Late-night': '🌙',
  'Live music': '🎵',
  'Outdoor seating': '☀️',
  'Real ale': '🍺',
  'Sunday roast': '🍖',
  'Trivia night': '❓',
  'Wine': '🍷',
  'Fireplace': '🔥',
  'Karaoke': '🎤',
  'LGBTQ+ friendly': '🏳️‍🌈',
  'Dancing': '💃',
  'Pool table': '🎱',
  'Sports screening': '🏟️',
  'Vegetarian options': '🥦',
  'Vegan options': '🥗',
  'DJ': '🎧',
  'Street food': '🌮',
  'Nightlife': '🌃',
  'Board games': '🎲',
};

interface SunExposureResult {
  isInSun: boolean;
  azimuth: number;
  elevation: number;
}

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

function normalizeTime(raw: string): string {
  if (!raw) return '';
  let t = raw.trim().toUpperCase()
    .replace(/P\.M\./i, 'PM').replace(/A\.M\./i, 'AM')
    .replace(/P\.M/i, 'PM').replace(/A\.M/i, 'AM')
    .replace(/PM\./i, 'PM').replace(/AM\./i, 'AM')
    .replace(/P(?![M\.])/i, 'PM').replace(/A(?![M\.])/i, 'AM')
    .replace('NOON', '12:00 PM')
    .replace('MIDNIGHT', '12:00 AM');
  // Add :00 if only hour is present
  if (/^\d{1,2}(AM|PM)?$/.test(t)) {
    t = t.replace(/^(\d{1,2})(AM|PM)?$/, '$1:00$2');
  }
  // Add AM/PM if missing and hour is 1-11
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const hour = parseInt(t.split(':')[0], 10);
    if (hour >= 1 && hour <= 11) t += ' AM';
    if (hour === 12) t += ' PM';
  }
  t = t.replace(/AM/i, 'AM').replace(/PM/i, 'PM');
  return t;
}

function parseWorkingHours(workingHours: string): { day: string, open: string, close: string }[] {
  const dayMap: Record<string, string> = {
    'Monday': 'Monday', 'Tuesday': 'Tuesday', 'Wednesday': 'Wednesday',
    'Thursday': 'Thursday', 'Friday': 'Friday', 'Saturday': 'Saturday', 'Sunday': 'Sunday'
  };
  const entries = workingHours.split('|').map(e => e.trim());
  const result: { day: string, open: string, close: string }[] = [];
  for (const entry of entries) {
    const [day, open, close] = entry.split(',').map(s => s.trim());
    result.push({
      day: dayMap[day] || day,
      open: normalizeTime(open),
      close: normalizeTime(close)
    });
  }
  // Ensure all days are present and in order
  const ordered: { day: string, open: string, close: string }[] = [];
  for (const day of DAYS) {
    const found = result.find(r => r.day === day);
    ordered.push(found || { day, open: '', close: '' });
  }
  return ordered;
}

export function MainScreen() {
  const { location } = useApp();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showDealsModal, setShowDealsModal] = useState(false);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [sunExposureCache, setSunExposureCache] = useState<Record<string, SunExposureResult>>({});
  const [isLoadingSunData, setIsLoadingSunData] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [venues, setVenues] = useState<Bar[]>([]);
  const [dynamicFilters, setDynamicFilters] = useState<{id: string, label: string, icon: string}[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Fetch sun exposure data for a bar
  const fetchSunExposure = async (bar: Bar): Promise<SunExposureResult | null> => {
    const cacheKey = `${bar.location.latitude},${bar.location.longitude}`;
    // Return cached result if available
    if (sunExposureCache[cacheKey]) {
      return sunExposureCache[cacheKey];
    }
    try {
      const response = await fetch('http://192.168.0.6:3000/sun-exposure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: bar.location.latitude,
          longitude: bar.location.longitude,
          datetime: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch sun exposure data');
      }
      const data = await response.json();
      setSunExposureCache(prev => ({ ...prev, [cacheKey]: data }));
      return data;
    } catch (error) {
      console.error('Error fetching sun exposure:', error);
      return null;
    }
  };

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
    if (filterKey === 'sunny') {
      // Handle sunny filter
      setSelectedFilters(prev => {
        if (prev.includes(filterKey)) {
          return prev.filter(f => f !== filterKey);
        } else {
          return [...prev, filterKey];
        }
      });
    } else {
      // Show coming soon modal for other special filters
    console.log('Special filter selected:', filterKey);
    setShowDealsModal(true);
    }
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

  // Remove updateBarsWithSunData and useEffect that calls it
  // Instead, fetch sun data for filtered bars when sunny filter is toggled ON
  useEffect(() => {
    const fetchAllSunData = async () => {
      if (!selectedFilters.includes('sunny')) return;
      setIsLoadingSunData(true);
      try {
        await Promise.all(
          venues.map(async (bar) => {
            const cacheKey = `${bar.location.latitude},${bar.location.longitude}`;
            if (!sunExposureCache[cacheKey]) {
              const sunData = await fetchSunExposure(bar);
              // sunExposureCache is updated in fetchSunExposure
            }
          })
        );
      } catch (error) {
        console.error('Error fetching sun data:', error);
      } finally {
        setIsLoadingSunData(false);
      }
    };
    fetchAllSunData();
    // Only run when sunny filter is toggled ON
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters.includes('sunny')]);

  // Extract unique features from venues
  useEffect(() => {
    if (!venues.length) return;
    const featureSet = new Set<string>();
    venues.forEach(venue => {
      if (venue.osmTags && venue.osmTags.features) {
        venue.osmTags.features.split(',').forEach(f => featureSet.add(f.trim()));
      }
    });
    let featureFilters = Array.from(featureSet).map(f => ({
      id: f.replace(/[^a-zA-Z0-9]/g, ''),
      label: f,
      icon: FEATURE_EMOJIS[f] || '✨'
    }));
    // Ensure 'Beer garden' is the first dynamic filter if present
    const beerGardenIndex = featureFilters.findIndex(f => f.label === 'Beer garden');
    if (beerGardenIndex !== -1) {
      const [beerGarden] = featureFilters.splice(beerGardenIndex, 1);
      featureFilters = [beerGarden, ...featureFilters];
    }
    setDynamicFilters(featureFilters);
  }, [venues]);

  // Combine custom and dynamic filters for the UI
  const FILTERS = useMemo(() => {
    // Remove dynamic filters that are already in custom
    const customIds = new Set(CUSTOM_FILTERS.map(f => f.id));
    const filteredDynamic = dynamicFilters.filter(f => !customIds.has(f.id));
    return [...CUSTOM_FILTERS, ...filteredDynamic];
  }, [dynamicFilters]);

  // Map filter id to filter logic
  const FILTER_MAP: Record<string, Partial<BarFilter>> = {
    bar: { type: 'bar' },
    pub: { type: 'pub' },
    '4star': { minRating: 4 },
    openNow: { openNow: true },
    sunny: { sunny: true }
    // Dynamic features handled separately
  };

  // Combine all selected filters into one BarFilter (for custom filters)
  const combinedFilter: BarFilter = useMemo(() => {
    if (!selectedFilters.length) return {};
    return selectedFilters.reduce((acc, key) => {
      return { ...acc, ...FILTER_MAP[key] };
    }, {} as BarFilter);
  }, [selectedFilters]);

  // Compute filtered bars
  const filteredBars = useMemo(() => {
    // First, apply custom filter logic
    let filtered = filterBars(venues, combinedFilter);
    // Then, apply dynamic feature filters
    const selectedDynamic = selectedFilters.filter(f => !FILTER_MAP[f]);
    if (selectedDynamic.length) {
      filtered = filtered.filter(bar =>
        selectedDynamic.every(fId => {
          // Find the label for this id
          const filterObj = dynamicFilters.find(df => df.id === fId);
          if (!filterObj) return true;
          if (!bar.osmTags || !bar.osmTags.features) return false;
          return bar.osmTags.features.split(',').map(f => f.trim()).includes(filterObj.label);
        })
      );
    }
    if (selectedFilters.includes('sunny')) {
      filtered = filtered.filter(bar => {
        const cacheKey = `${bar.location.latitude},${bar.location.longitude}`;
        return sunExposureCache[cacheKey]?.isInSun;
      });
      console.log('Bars in sun:', filtered.map(bar => bar.name));
    }
    return filtered;
  }, [venues, combinedFilter, selectedFilters, sunExposureCache, dynamicFilters]);

  // Compute if we should show the loading screen
  const shouldShowLoading = (isLoadingSunData) && !venues.length && !location.location;

  // Load all venues on app load (ignore location for now)
  const fetchVenues = async () => {
    try {
      // For launch: load all venues, ignore location
      const response = await fetch(`http://192.168.0.6:4000/venues?lat=51.5432&lng=-0.0557&radius=10000`); // Large radius to get all
      if (!response.ok) throw new Error('Failed to fetch venues');
      const data = await response.json();
      setVenues(data.venues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  useEffect(() => {
    fetchVenues();
    // In the future, re-enable location-based search here
    // e.g. by watching location.location
  }, []);

      return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {shouldShowLoading ? (
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
            <Text style={{ marginTop: 16, fontSize: 18, color: '#222' }}>
              {isLoadingSunData ? 'Checking sun exposure...' : 'Loading...'}
            </Text>
        </View>
        ) : null}
        {/* Floating HeaderBar and Refresh Button Container */}
        <View style={styles.headerContainer} pointerEvents="box-none">
          {selectedBar ? (
            <View style={styles.venueHeaderOverlay}>
              <Text style={styles.venueHeaderText}>{selectedBar.name}</Text>
              <View style={styles.venueHeaderDetails}>
                <Text style={styles.venueHeaderAddress}>{selectedBar.address}</Text>
                <View style={styles.venueHeaderStatus}>
                  {selectedBar.osmTags && selectedBar.osmTags.opening_hours && (
                    <TouchableOpacity onPress={() => setIsAccordionOpen(!isAccordionOpen)} style={styles.accordionHeader}>
                      <View style={[
                        styles.statusIndicator,
                        { backgroundColor: isOpenNow(selectedBar.osmTags.opening_hours as string) ? '#4CAF50' : '#FF3B30' }
                      ]} />
                      <Text style={styles.statusText}>
                        {isOpenNow(selectedBar.osmTags.opening_hours as string) ? 'Open now' : 'Closed now'}
                      </Text>
                      <Ionicons name={isAccordionOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#333" />
                    </TouchableOpacity>
                  )}
                </View>
                {isAccordionOpen && (
                  <View>
                    {parseWorkingHours(selectedBar.osmTags.opening_hours).map(({ day, open, close }) => (
                      <Text style={styles.openingHours} key={day}>
                        {day}: {open && close ? `${open} - ${close}` : 'Closed'}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ) : (
            <HeaderBar />
          )}
          <TouchableOpacity
            style={styles.refreshButtonSubtle}
            onPress={location.requestPermission}
            activeOpacity={0.7}
          >
            <Text style={styles.refreshButtonIconSubtle}>📍</Text>
          </TouchableOpacity>
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
              onPress={() => setSelectedBar(null)}
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
        {/* Floating FilterBar */}
        <View style={styles.floatingFilterBarContainer} pointerEvents="box-none">
          <FilterBar 
            filters={FILTERS}
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
  headerContainer: {
    position: 'absolute',
    top: 36,
    left: 16,
    right: 16,
    zIndex: 200,
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
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#eee',
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
    bottom: 200,
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
  venueHeaderOverlay: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
  },
  venueHeaderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
    fontFamily: 'Tanker',
  },
  venueHeaderDetails: {
    gap: 4,
  },
  venueHeaderAddress: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Tanker',
  },
  venueHeaderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#222',
    fontFamily: 'Tanker',
  },
  openingHours: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Tanker',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
}); 