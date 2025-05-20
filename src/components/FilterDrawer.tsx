import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const PLACEHOLDER_FILTERS = Array.from({ length: 8 }, (_, i) => `Placeholder ${i + 1}`);

export function FilterDrawer({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [120, 320], []); // closed, open

  // Sync open/close state
  React.useEffect(() => {
    if (open) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.collapse();
    }
  }, [open]);

  // Handle swipe gestures
  const handleChange = useCallback(
    (index: number) => {
      if (index === 0 && open) onToggle(); // closed
      if (index === 1 && !open) onToggle(); // open
    },
    [open, onToggle]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={open ? 1 : 0}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableHandlePanningGesture={true}
      enableContentPanningGesture={true}
      onChange={handleChange}
      handleComponent={() => (
        <TouchableOpacity style={styles.handle} onPress={onToggle}>
          <Text style={styles.chevron}>{open ? '⬇️' : '⬆️'}</Text>
        </TouchableOpacity>
      )}
    >
      {open ? (
        <View style={styles.openContent}>
          {PLACEHOLDER_FILTERS.map((name, i) => (
            <View key={i} style={styles.placeholderItem}>
              <Text style={styles.placeholderText}>{name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.closedContent}>
          {PLACEHOLDER_FILTERS.map((name, i) => (
            <View key={i} style={styles.placeholderItemClosed}>
              <Text style={styles.placeholderText}>{name}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  handle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chevron: {
    fontSize: 28,
  },
  openContent: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
  },
  closedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  placeholderItem: {
    width: '90%',
    padding: 16,
    marginVertical: 6,
    backgroundColor: '#F5F8FF',
    borderRadius: 16,
    alignItems: 'center',
  },
  placeholderItemClosed: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#F5F8FF',
    borderRadius: 16,
    marginRight: 10,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#555',
  },
}); 