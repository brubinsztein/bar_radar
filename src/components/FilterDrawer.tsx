import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const FILTERS = [
  { key: 'deals', label: 'Deals', emoji: '🍻' },
  { key: 'outside', label: 'Outside', emoji: '☂️' },
  { key: 'garden', label: 'Garden', emoji: '🌳' },
  { key: 'pool', label: 'Pool', emoji: '🎱' },
];

export function FilterDrawer({ selected, onSelect }: { selected: string | null; onSelect: (key: string | null) => void }) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* All button, no emoji, centered text */}
        <TouchableOpacity
          style={[styles.filterItem, !selected && styles.selected, styles.allFilterItem]}
          onPress={() => onSelect(null)}
        >
          <Text style={[styles.filterText, styles.allFilterText, !selected && styles.selectedLabel]}>All</Text>
        </TouchableOpacity>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterItem, selected === f.key && styles.selected]}
            onPress={() => onSelect(selected === f.key ? null : f.key)}
          >
            <Text style={styles.emoji}>{f.emoji}</Text>
            <Text style={[styles.filterText, selected === f.key && styles.selectedLabel]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
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
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  scrollContent: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    minWidth: 64,
  },
  selected: {
    backgroundColor: '#E6E9FF',
  },
  emoji: {
    fontSize: 22,
    marginRight: 6,
  },
  filterText: {
    fontSize: 16,
    color: '#222',
  },
  selectedLabel: {
    color: '#5B4EFF',
    fontWeight: 'bold',
  },
  allFilterItem: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 64,
  },
  allFilterText: {
    textAlign: 'center',
    width: '100%',
  },
}); 