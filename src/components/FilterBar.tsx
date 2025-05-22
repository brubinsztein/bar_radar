import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const FILTERS = [
  { key: 'bar', label: 'Bar', emoji: '🍸' },
  { key: 'pub', label: 'Pub', emoji: '🍺' },
  { key: '4star', label: '4+ Stars', emoji: '⭐️' },
  { key: 'openNow', label: 'Open Now', emoji: '🟢' },
  { key: 'openLate', label: 'Open Late', emoji: '🌙' },
  { key: 'deals', label: 'Deals', emoji: '🍻' },
  { key: 'outside', label: 'Outside', emoji: '☀️' },
  { key: 'garden', label: 'Garden', emoji: '🌳' },
  { key: 'pool', label: 'Pool', emoji: '🎱' },
  { key: 'realAle', label: 'Real Ale', emoji: '🍺' },
  { key: 'realFire', label: 'Real Fire', emoji: '🔥' },
  { key: 'dog', label: 'Dog Friendly', emoji: '🐶' },
  { key: 'wheelchair', label: 'Wheelchair', emoji: '♿' },
];

export function FilterBar({ selected, onSelect, count, onSpecialFilter, onClear }: {
  selected: string[];
  onSelect: (key: string) => void;
  count: number;
  onSpecialFilter?: (key: string) => void;
  onClear?: () => void;
}) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Show Clear button if any filter is selected */}
        {onClear && (
          <TouchableOpacity
            style={[styles.filter, styles.clearButton]}
            onPress={onClear}
          >
            <Text style={[styles.label, styles.clearLabel]}>Clear</Text>
          </TouchableOpacity>
        )}
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filter, selected.includes(f.key) && styles.selected]}
            onPress={() => {
              if (["deals", "outside", "openLate"].includes(f.key)) {
                onSpecialFilter && onSpecialFilter(f.key);
              } else {
                onSelect(f.key);
              }
            }}
          >
            <Text style={styles.emoji}>{f.emoji}</Text>
            <Text style={[styles.label, selected.includes(f.key) && styles.selectedLabel]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
        {/* Bar count badge */}
        <View style={styles.countPill}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    minWidth: 48,
    maxWidth: '100%',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#E6E9FF',
  },
  emoji: {
    fontSize: 22,
    marginRight: 6,
  },
  label: {
    fontSize: 16,
    color: '#222',
  },
  selectedLabel: {
    color: '#5B4EFF',
    fontWeight: 'bold',
  },
  count: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    marginRight: 8,
  },
  clearLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  countPill: {
    backgroundColor: '#5B4EFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
    alignSelf: 'center',
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 