import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useCafes } from '../context/CafeContext';
import { VIBE_TAGS } from '../data/cafes';

export default function MySipsScreen({ navigation }) {
  const { cafes, savedCafes, visitedCafes, isSaved, isVisited, toggleSaved, toggleVisited } =
    useCafes();

  const saved = cafes.filter((c) => isSaved(c.id));
  const visited = cafes.filter((c) => isVisited(c.id));

  const vibeLabel = (tagId) => {
    const found = VIBE_TAGS.find((t) => t.id === tagId);
    return found ? `${found.emoji}` : '•';
  };

  const renderMiniCard = (cafe, showVisited = false) => (
    <TouchableOpacity
      key={cafe.id}
      style={styles.miniCard}
      onPress={() =>
        navigation.navigate('Discover', {
          screen: 'CafeDetail',
          params: { cafe },
        })
      }
      activeOpacity={0.85}
    >
      <View style={styles.miniPhoto}>
        <Text style={styles.miniPhotoEmoji}>☕</Text>
      </View>
      <View style={styles.miniInfo}>
        <Text style={styles.miniName} numberOfLines={1}>{cafe.name}</Text>
        <Text style={styles.miniLocation}>
          {cafe.neighborhood} · {cafe.city}
        </Text>
        <View style={styles.miniTagRow}>
          {cafe.vibe_tags.slice(0, 3).map((tag) => (
            <Text key={tag} style={styles.miniTagEmoji}>{vibeLabel(tag)}</Text>
          ))}
        </View>
      </View>
      <View style={styles.miniActions}>
        <TouchableOpacity onPress={() => toggleSaved(cafe.id)}>
          <Ionicons
            name={isSaved(cafe.id) ? 'heart' : 'heart-outline'}
            size={18}
            color={isSaved(cafe.id) ? Colors.primary : Colors.textMuted}
          />
        </TouchableOpacity>
        {showVisited && (
          <TouchableOpacity onPress={() => toggleVisited(cafe.id)} style={{ marginTop: 8 }}>
            <Ionicons
              name={isVisited(cafe.id) ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={18}
              color={isVisited(cafe.id) ? Colors.success : Colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Sips</Text>
          <Text style={styles.subtitle}>Your personal coffee map</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{visited.length}</Text>
            <Text style={styles.statLabel}>Visited</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{saved.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {new Set([...savedCafes, ...visitedCafes].map(id => cafes.find(c=>c.id===id)?.city).filter(Boolean)).size}
            </Text>
            <Text style={styles.statLabel}>Cities</Text>
          </View>
        </View>

        {/* Visited */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
              {'  '}Visited
            </Text>
            <Text style={styles.sectionCount}>{visited.length}</Text>
          </View>

          {visited.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🗺️</Text>
              <Text style={styles.emptyText}>No visits yet</Text>
              <Text style={styles.emptySubText}>
                Mark cafes as visited after you go
              </Text>
            </View>
          ) : (
            visited.map((cafe) => renderMiniCard(cafe, true))
          )}
        </View>

        {/* Want to Try */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="heart" size={14} color={Colors.primary} />
              {'  '}Want to Try
            </Text>
            <Text style={styles.sectionCount}>{saved.length}</Text>
          </View>

          {saved.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>☕</Text>
              <Text style={styles.emptyText}>No saved spots yet</Text>
              <Text style={styles.emptySubText}>
                Tap the heart on any cafe to save it
              </Text>
            </View>
          ) : (
            saved.map((cafe) => renderMiniCard(cafe, false))
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 24,
    padding: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.cardBorder,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionCount: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  emptyState: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 32,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 10,
    opacity: 0.5,
  },
  emptyText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  miniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  miniPhoto: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2A1A12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPhotoEmoji: {
    fontSize: 20,
    opacity: 0.4,
  },
  miniInfo: {
    flex: 1,
  },
  miniName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  miniLocation: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 5,
  },
  miniTagRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniTagEmoji: {
    fontSize: 12,
  },
  miniActions: {
    alignItems: 'center',
  },
});
