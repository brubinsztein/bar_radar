import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BarCountPill } from './BarCountPill';

interface FilterBarProps {
  selected: string[];
  onSelect: (filter: string) => void;
  count: number;
  onSpecialFilter?: (filter: string) => void;
  onClear?: () => void;
}

const FILTERS = [
  { id: 'pub', label: 'Pubs', icon: '🍺' },
  { id: 'bar', label: 'Bars', icon: '🍸' },
  { id: '4star', label: '4★+', icon: '⭐' },
  { id: 'openNow', label: 'Open Now', icon: '🕒' },
  { id: 'realAle', label: 'Real Ale', icon: '🍺' },
  { id: 'realFire', label: 'Fireplace', icon: '🔥' },
  { id: 'dog', label: 'Dog Friendly', icon: '🐕' },
  { id: 'wheelchair', label: 'Wheelchair', icon: '♿' },
  { id: 'garden', label: 'Garden', icon: '🌳' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'craftBeer', label: 'Craft Beer', icon: '🍺' },
  { id: 'liveMusic', label: 'Live Music', icon: '🎵' },
  { id: 'quizNight', label: 'Quiz Night', icon: '❓' },
  { id: 'boardGames', label: 'Board Games', icon: '🎲' },
  { id: 'sundayRoast', label: 'Sunday Roast', icon: '🍖' },
  { id: 'outdoorSeating', label: 'Outdoor', icon: '☀️' },
  { id: 'dj', label: 'DJ', icon: '🎧' },
  { id: 'streetFood', label: 'Street Food', icon: '🌮' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { id: 'cocktails', label: 'Cocktails', icon: '🍹' },
];

export function FilterBar({ selected, onSelect, count, onSpecialFilter, onClear }: FilterBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.countContainer}>
        <BarCountPill count={count} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selected.includes(filter.id) && styles.filterButtonSelected,
            ]}
            onPress={() => onSelect(filter.id)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text style={[
              styles.filterLabel,
              selected.includes(filter.id) && styles.filterLabelSelected,
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {onClear && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  countContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  scrollContent: {
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E9F2',
  },
  filterButtonSelected: {
    backgroundColor: '#5B4EFF',
    borderColor: '#5B4EFF',
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  filterLabel: {
    fontSize: 14,
    color: '#5B4EFF',
    fontWeight: '600',
  },
  filterLabelSelected: {
    color: 'white',
  },
  clearButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearButtonText: {
    color: '#5B4EFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 