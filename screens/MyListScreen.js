import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { VIBE_TAGS, getCafePhoto } from '../data/cafes';
import { useCafes } from '../context/CafeContext';

const TABS = [
  { id: 'wishlist', label: '❤️ Want to Go' },
  { id: 'visited', label: '✓ Been There' },
  { id: 'favorites', label: '⭐ Saved' },
];

export default function MyListScreen({ navigation }) {
  const {
    cafes, savedCafes, visitedCafes, favorites,
    toggleFavorite, moveToVisited, moveToWishlist, isFavorite,
  } = useCafes();

  const [activeTab, setActiveTab] = useState('wishlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('All');

  const tabCafes = useMemo(() => {
    let ids;
    if (activeTab === 'wishlist') ids = savedCafes;
    else if (activeTab === 'visited') ids = visitedCafes;
    else ids = favorites;
    return cafes.filter((c) => ids.includes(c.id));
  }, [cafes, savedCafes, visitedCafes, favorites, activeTab]);

  const filteredCafes = useMemo(() => {
    let list = tabCafes;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          (c.neighborhood || '').toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
      );
    }
    if (filterCity !== 'All') {
      list = list.filter((c) => c.city === filterCity);
    }
    return list;
  }, [tabCafes, searchQuery, filterCity]);

  const cities = useMemo(() => {
    return ['All', ...new Set(tabCafes.map((c) => c.city))];
  }, [tabCafes]);

  const grouped = useMemo(() => {
    if (filterCity !== 'All' || searchQuery) return null;
    const groups = {};
    filteredCafes.forEach((c) => {
      if (!groups[c.city]) groups[c.city] = [];
      groups[c.city].push(c);
    });
    return groups;
  }, [filteredCafes, filterCity, searchQuery]);

  const openMaps = (cafe) => {
    const q = encodeURIComponent(`${cafe.name} ${cafe.city}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  const renderCafe = (cafe) => {
    const photo = getCafePhoto(cafe);
    const isFav = isFavorite(cafe.id);
    return (
      <TouchableOpacity
        key={cafe.id}
        style={styles.listCard}
        onPress={() => navigation.navigate('CafeDetail', { cafe })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: photo }} style={styles.listThumb} />
        <View style={styles.listCardInfo}>
          <Text style={styles.listCardName} numberOfLines={1}>{cafe.name}</Text>
          <Text style={styles.listCardLoc}>{cafe.neighborhood ? `${cafe.neighborhood} · ` : ''}{cafe.city}</Text>
          <View style={styles.listCardActions}>
            <TouchableOpacity
              style={[styles.lcaBtn, styles.lcaFav, isFav && styles.lcaFavOn]}
              onPress={() => toggleFavorite(cafe.id)}
            >
              <Text style={[styles.lcaBtnText, isFav && styles.lcaFavOnText]}>
                {isFav ? '⭐ Saved' : '☆ Save'}
              </Text>
            </TouchableOpacity>
            {activeTab === 'wishlist' && (
              <TouchableOpacity
                style={[styles.lcaBtn, styles.lcaMove]}
                onPress={() => moveToVisited(cafe.id)}
              >
                <Text style={styles.lcaMoveText}>✓ Mark visited</Text>
              </TouchableOpacity>
            )}
            {activeTab === 'visited' && (
              <TouchableOpacity
                style={[styles.lcaBtn, styles.lcaMove]}
                onPress={() => moveToWishlist(cafe.id)}
              >
                <Text style={styles.lcaMoveText}>❤️ Move to want</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.lcaBtn} onPress={() => openMaps(cafe)}>
              <Text style={styles.lcaBtnText}>📍 Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const emptyMessages = {
    wishlist: { icon: '❤️', title: 'No cafes saved yet', sub: 'Swipe right on cafes to add them here' },
    visited: { icon: '✓', title: 'No visited cafes', sub: 'Swipe left on cafes you\'ve been to' },
    favorites: { icon: '⭐', title: 'No favorites yet', sub: 'Star cafes from your lists to save them here' },
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My List</Text>
        <Text style={styles.headerSub}>Your swiped cafes</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => { setActiveTab(tab.id); setFilterCity('All'); setSearchQuery(''); }}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cafes, cities, neighborhoods…"
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {cities.length > 1 && !searchQuery && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityFilter}
          contentContainerStyle={styles.cityFilterContent}
        >
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.cityChip, filterCity === city && styles.cityChipActive]}
              onPress={() => setFilterCity(city)}
            >
              <Text style={[styles.cityChipText, filterCity === city && styles.cityChipTextActive]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filteredCafes.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{emptyMessages[activeTab].icon}</Text>
            <Text style={styles.emptyTitle}>{emptyMessages[activeTab].title}</Text>
            <Text style={styles.emptySub}>{emptyMessages[activeTab].sub}</Text>
          </View>
        ) : grouped ? (
          Object.entries(grouped).map(([city, cafesInCity]) => (
            <View key={city}>
              <Text style={styles.cityHeader}>{city}</Text>
              {cafesInCity.map(renderCafe)}
            </View>
          ))
        ) : (
          filteredCafes.map(renderCafe)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  headerTitle: { color: Colors.primary, fontSize: 22, fontWeight: '800' },
  headerSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  tab: {
    flex: 1, padding: 12, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: Colors.primary },
  searchWrap: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
    position: 'relative',
  },
  searchIcon: { position: 'absolute', left: 26, top: 20, fontSize: 14, zIndex: 1 },
  searchInput: {
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 12, paddingVertical: 10, paddingLeft: 36, paddingRight: 14,
    color: Colors.cream, fontSize: 14,
  },
  cityFilter: {
    flexShrink: 0, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  cityFilterContent: { padding: 10, paddingHorizontal: 16, gap: 8 },
  cityChip: {
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8,
  },
  cityChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  cityChipText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  cityChipTextActive: { color: Colors.background },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  cityHeader: {
    color: Colors.primary, fontSize: 11, fontWeight: '700',
    letterSpacing: 0.8, textTransform: 'uppercase', paddingVertical: 8,
  },
  listCard: {
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 14, padding: 14, paddingHorizontal: 16, marginBottom: 10,
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
  },
  listThumb: { width: 48, height: 48, borderRadius: 10, backgroundColor: Colors.background },
  listCardInfo: { flex: 1 },
  listCardName: { color: Colors.white, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  listCardLoc: { color: Colors.textMuted, fontSize: 12, marginBottom: 8 },
  listCardActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  lcaBtn: {
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 20, paddingHorizontal: 11, paddingVertical: 4,
  },
  lcaBtnText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600' },
  lcaFav: { borderColor: 'rgba(201,151,58,0.4)' },
  lcaFavOn: { backgroundColor: 'rgba(201,151,58,0.12)', borderColor: Colors.primary },
  lcaFavOnText: { color: Colors.primary },
  lcaMove: { borderColor: 'rgba(107,158,107,0.4)' },
  lcaMoveText: { color: 'rgba(107,158,107,0.8)', fontSize: 11, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, opacity: 0.3, marginBottom: 12 },
  emptyTitle: { color: Colors.cream, fontSize: 16, fontWeight: '600', marginBottom: 6 },
  emptySub: { color: Colors.textMuted, fontSize: 13 },
});
