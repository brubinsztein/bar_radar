import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Bar } from '../types';

interface BarDetailsSheetProps {
  bar: Bar | null;
  visible: boolean;
  onClose: () => void;
}

export function BarDetailsSheet({ bar, visible, onClose }: BarDetailsSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  if (!bar) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{bar.name}</Text>
        <Text style={styles.address}>{bar.address}</Text>
        {bar.rating && (
          <Text style={styles.rating}>Rating: {bar.rating}⭐️</Text>
        )}
        {bar.isOpen !== undefined && (
          <Text style={styles.status}>
            {bar.isOpen ? 'Open' : 'Closed'}
          </Text>
        )}
        {bar.priceLevel && (
          <Text style={styles.priceLevel}>
            Price Level: {'£'.repeat(bar.priceLevel)}
          </Text>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
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
}); 