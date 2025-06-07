import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BarCountPill } from './BarCountPill';

interface FilterBarProps {
  filters: { id: string; label: string; icon: string }[];
  selected: string[];
  onSelect: (filter: string) => void;
  count: number;
  onSpecialFilter?: (filter: string) => void;
  onClear?: () => void;
}

export function FilterBar({ filters, selected, onSelect, count, onSpecialFilter, onClear }: FilterBarProps) {
  // Create zigzag pattern for filters
  const firstRowFilters = filters.filter((_, index) => index % 2 === 0);
  const secondRowFilters = filters.filter((_, index) => index % 2 === 1);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.countContainer}>
      <BarCountPill count={count} />
        </View>
        <View style={{ flex: 1 }} />
        {onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear all filters</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            {firstRowFilters.map((filter) => (
          <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selected.includes(filter.id) && styles.filterButtonSelected,
                ]}
                onPress={() => filter.id === 'sunny' && onSpecialFilter ? onSpecialFilter(filter.id) : onSelect(filter.id)}
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
          </View>
          <View style={styles.filterRow}>
            {secondRowFilters.map((filter) => (
          <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selected.includes(filter.id) && styles.filterButtonSelected,
                ]}
                onPress={() => filter.id === 'sunny' && onSpecialFilter ? onSpecialFilter(filter.id) : onSelect(filter.id)}
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
          </View>
        </View>
      </ScrollView>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  countContainer: {
    flexShrink: 0,
    marginTop: 8,
    marginBottom: 8,
  },
  scrollContent: {
    paddingRight: 16,
  },
  filtersContainer: {
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 8,
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
    fontFamily: 'Tanker',
  },
  filterLabelSelected: {
    color: 'white',
    fontFamily: 'Tanker',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  clearButtonText: {
    color: '#5B4EFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Tanker',
  },
}); 