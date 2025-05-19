import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useApp } from './src/core/AppContext';
import { BarMarker } from './src/components/BarMarker';
import { BarDetailsSheet } from './src/components/BarDetailsSheet';
import { MAP_CONFIG } from './src/config/constants';

function AppContent() {
  const { location, bars } = useApp();
  const [isMapReady, setIsMapReady] = React.useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = React.useState(false);

  const initialRegion = {
    latitude: location.location?.coords.latitude || MAP_CONFIG.DEFAULT_REGION.latitude,
    longitude: location.location?.coords.longitude || MAP_CONFIG.DEFAULT_REGION.longitude,
    latitudeDelta: MAP_CONFIG.DEFAULT_REGION.latitudeDelta,
    longitudeDelta: MAP_CONFIG.DEFAULT_REGION.longitudeDelta,
  };

  if (location.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{location.error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation
        onMapReady={() => setIsMapReady(true)}
        zoomEnabled
        scrollEnabled
        rotateEnabled
      >
        {bars.bars.map((bar) => (
          <BarMarker
            key={bar.id}
            bar={bar}
            isSelected={bars.selectedBar?.id === bar.id}
            onPress={() => {
              bars.setSelectedBar(bar);
              setIsBottomSheetVisible(true);
            }}
          />
        ))}
      </MapView>
      
      {(!isMapReady || bars.isLoading) && (
        <View style={styles.loadingContainer}>
          <Text>
            {bars.isLoading ? 'Finding bars nearby...' : 'Loading map...'}
          </Text>
        </View>
      )}

      <BarDetailsSheet
        bar={bars.selectedBar}
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
      />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
