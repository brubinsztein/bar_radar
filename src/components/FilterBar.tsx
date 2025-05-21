import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const FILTERS = [
  { key: 'deals', label: 'Deals', emoji: '🍻' },
  { key: 'outside', label: 'Outside', emoji: '☂️' },
  { key: 'garden', label: 'Garden', emoji: '🌳' },
  { key: 'pool', label: 'Pool', emoji: '🎱' },
];

export function FilterBar({ selected, onSelect }: { selected: string | null; onSelect: (key: string | null) => void }) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* All/Clear button */}
        <TouchableOpacity
          style={[styles.filter, !selected && styles.selected]}
          onPress={() => onSelect(null)}
        >
          <Text style={[styles.label, !selected && styles.selectedLabel]}>All</Text>
        </TouchableOpacity>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filter, selected === f.key && styles.selected]}
            onPress={() => onSelect(selected === f.key ? null : f.key)}
          >
            <Text style={styles.emoji}>{f.emoji}</Text>
            <Text style={[styles.label, selected === f.key && styles.selectedLabel]}>{f.label}</Text>
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    marginHorizontal: 16,
    marginBottom: 24,
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
    minWidth: 64,
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
}); 