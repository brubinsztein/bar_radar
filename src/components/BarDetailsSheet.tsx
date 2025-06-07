import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { Bar } from '../types';
import { GOOGLE_PLACES_API_KEY } from '@env'; // Use your env variable

interface BarDetailsSheetProps {
  bar: Bar | null;
  visible: boolean;
  onClose: () => void;
}

export function BarDetailsSheet({ bar, visible, onClose }: BarDetailsSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const [isVisible, setIsVisible] = useState(false);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Debug logging for visibility changes
  useEffect(() => {
    console.log('[BarDetailsSheet] Visibility changed:', { visible, hasBar: !!bar });
    setIsVisible(visible);
  }, [visible, bar]);

  React.useEffect(() => {
    console.log('[BarDetailsSheet] Attempting to control sheet:', { visible });
    if (visible) {
      console.log('[BarDetailsSheet] Expanding sheet');
      bottomSheetRef.current?.expand();
    } else {
      console.log('[BarDetailsSheet] Closing sheet');
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  // Add debug logging for bar data
  useEffect(() => {
    if (bar) {
      console.log('[BarDetailsSheet] Bar data:', {
        name: bar.name,
        osmTags: bar.osmTags,
        opening_hours: bar.osmTags?.opening_hours,
        location: bar.location
      });
    }
  }, [bar]);

  if (!bar) {
    return null;
  }

  // Parse OSM opening hours format
  const parseOpeningHours = (hours: string) => {
    // OSM opening hours format is like: "Mo-Fr 11:00-23:00; Sa-Su 12:00-00:00"
    const dayMap: Record<string, string> = {
      'Mo': 'Monday',
      'Tu': 'Tuesday',
      'We': 'Wednesday',
      'Th': 'Thursday',
      'Fr': 'Friday',
      'Sa': 'Saturday',
      'Su': 'Sunday'
    };

    return hours.split(';').map(period => {
      const [days, times] = period.trim().split(' ');
      // Convert day abbreviations to full names
      const fullDays = days.split('-').map(day => dayMap[day] || day).join('-');
      return `${fullDays}: ${times}`;
    });
  };

  console.log('[BarDetailsSheet] Rendering with bar:', bar.name);

  return (
    <Portal>
    <BottomSheet
      ref={bottomSheetRef}
        index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: '#999', width: 40 }}
        backgroundStyle={{ backgroundColor: 'white' }}
        style={styles.bottomSheet}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{bar.name}</Text>
        <Text style={styles.address}>{bar.address}</Text>
        {bar.rating && (
          <Text style={styles.rating}>Rating: {bar.rating}⭐️</Text>
        )}
        {bar.isOpen !== undefined && (
          <Text style={styles.status}>
            {bar.isOpen ? 'Open Now' : 'Closed'}
          </Text>
        )}
        {bar.priceLevel && (
          <Text style={styles.priceLevel}>
            Price Level: {'£'.repeat(bar.priceLevel)}
          </Text>
        )}
        {/* OSM Tags Badges */}
        {bar.osmTags && (
          <View style={styles.osmTagsRow}>
            {bar.osmTags.real_ale && (
              <View style={styles.osmTagBadge}><Text style={styles.osmTagText}>🍺 Real Ale</Text></View>
            )}
            {bar.osmTags.real_fire && (
              <View style={styles.osmTagBadge}><Text style={styles.osmTagText}>🔥 Real Fire</Text></View>
            )}
            {bar.osmTags.dog && (
              <View style={styles.osmTagBadge}><Text style={styles.osmTagText}>🐶 Dog Friendly</Text></View>
            )}
            {bar.osmTags.wheelchair && (
              <View style={styles.osmTagBadge}><Text style={styles.osmTagText}>♿ Wheelchair</Text></View>
            )}
          </View>
        )}
        {/* Show opening hours if available from OSM */}
        {bar.osmTags?.opening_hours && (
            <View style={styles.openingHoursContainer}>
              <Text style={styles.openingHoursTitle}>Opening Hours</Text>
            {parseOpeningHours(bar.osmTags.opening_hours).map((line, idx) => (
                <Text key={idx} style={styles.openingHoursText}>{line}</Text>
            ))}
          </View>
        )}
      </View>
    </BottomSheet>
    </Portal>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    marginBottom: 4,
    color: '#2ecc71',
  },
  priceLevel: {
    fontSize: 16,
    color: '#666',
  },
  osmTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  osmTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  osmTagText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  openingHoursContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  openingHoursTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  openingHoursText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
}); 