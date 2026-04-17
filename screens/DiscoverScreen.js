import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { VIBE_TAGS } from '../data/cafes';
import { useCafes } from '../context/CafeContext';
import CafeCard from '../components/CafeCard';

export default function DiscoverScreen({ navigation }) {
  const { cafes, cities, selectedCity, setSelectedCity } = useCafes();
  const [activeVibes, setActiveVibes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleVibe = (vibeId) => {
    setActiveVibes((prev) =>
      prev.includes(vibeId) ? prev.filter((v) => v !== vibeId) : [...prev, vibeId]
    );
  };

  const clearAll = () => {
    setActiveVibes([]);
    setSelectedCity('All');
  };

  const hasFilters = activeVibes.length > 0 || selectedCity !== 'All';

  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      const cityMatch = selectedCity === 'All' || cafe.city === selectedCity;
      const vibeMatch =
        activeVibes.length === 0 ||
        activeVibes.every((v) => cafe.vibe_tags.includes(v));
      const searchMatch =
        searchQuery === '' ||
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      return cityMatch && vibeMatch && searchMatch;
    });
  }, [cafes, selectedCity, activeVibes, searchQuery]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Café Codex</Text>
          <Text style={styles.headerSub}>Your record of the world's best cups</Text>
        </View>
        <View style={styles.headerDot}>
          <Text style={styles.headerDotText}>✦</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={16} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search cafes or neighborhoods…"
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* City pills + Filter button on one row */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.pill, selectedCity === city && styles.pillActive]}
              onPress={() => setSelectedCity(city)}
            >
              <Text style={[styles.pillText, selectedCity === city && styles.pillTextActive]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter button */}
        <TouchableOpacity
          style={[styles.filterBtn, activeVibes.length > 0 && styles.filterBtnActive]}
          onPress={() => setFilterOpen(true)}
        >
          <Ionicons
            name="options-outline"
            size={15}
            color={activeVibes.length > 0 ? Colors.background : Colors.textMuted}
          />
          {activeVibes.length > 0 && (
            <Text style={styles.filterBtnCount}>{activeVibes.length}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Count + Clear */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {filteredCafes.length} {filteredCafes.length === 1 ? 'cafe' : 'cafes'}
          {hasFilters ? ' · filtered' : ''}
        </Text>
        {hasFilters && (
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cafe list */}
      <FlatList
        data={filteredCafes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <CafeCard
            cafe={item}
            onPress={() => navigation.navigate('CafeDetail', { cafe: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>☕</Text>
            <Text style={styles.emptyText}>No cafes match your filters</Text>
            <Text style={styles.emptySubText}>Try adjusting your vibe or city</Text>
          </View>
        }
      />

      {/* Vibe filter modal */}
      <Modal
        visible={filterOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterOpen(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by Vibe</Text>
            {activeVibes.length > 0 && (
              <TouchableOpacity onPress={() => setActiveVibes([])}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.vibeGrid}>
            {VIBE_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[styles.vibeTag, activeVibes.includes(tag.id) && styles.vibeTagActive]}
                onPress={() => toggleVibe(tag.id)}
              >
                <Text style={styles.vibeEmoji}>{tag.emoji}</Text>
                <Text style={[styles.vibeText, activeVibes.includes(tag.id) && styles.vibeTextActive]}>
                  {tag.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterOpen(false)}>
            <Text style={styles.applyBtnText}>
              Show {filteredCafes.length} {filteredCafes.length === 1 ? 'cafe' : 'cafes'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  headerDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDotText: {
    color: Colors.primary,
    fontSize: 15,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
  },
  // City pills + filter button side by side
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: 20,
  },
  pillRow: {
    paddingHorizontal: 20,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  pillTextActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    minWidth: 36,
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterBtnCount: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  countText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  clearText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 12,
    opacity: 0.4,
  },
  emptyText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  // Modal bottom sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'android' ? 24 : 36,
    borderTopWidth: 1,
    borderColor: Colors.cardBorder,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.cardBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  vibeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  vibeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  vibeTagActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(201,151,58,0.12)',
  },
  vibeEmoji: {
    fontSize: 13,
    marginRight: 5,
  },
  vibeText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  vibeTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyBtnText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
