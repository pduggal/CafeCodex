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
import { CAFES, VIBE_TAGS } from '../data/cafes';
import { useCafes } from '../context/CafeContext';

export default function TrendingScreen({ navigation }) {
  const { toggleSaved, isSaved } = useCafes();
  const trendingCafes = CAFES.filter((c) => c.trending);
  const curatorPicks = CAFES.filter((c) => c.curator_pick);

  const vibeLabel = (tagId) => {
    const found = VIBE_TAGS.find((t) => t.id === tagId);
    return found ? `${found.emoji} ${found.label}` : tagId;
  };

  const renderCard = (cafe, rank) => {
    const saved = isSaved(cafe.id);
    return (
      <TouchableOpacity
        key={cafe.id}
        style={styles.card}
        onPress={() =>
          navigation.navigate('Discover', {
            screen: 'CafeDetail',
            params: { cafe },
          })
        }
        activeOpacity={0.85}
      >
        <View style={styles.cardLeft}>
          {rank && (
            <View style={styles.rankBubble}>
              <Text style={styles.rankText}>#{rank}</Text>
            </View>
          )}
          <View style={styles.cardPhoto}>
            <Text style={styles.cardPhotoEmoji}>☕</Text>
          </View>
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.cardNameRow}>
            <Text style={styles.cardName} numberOfLines={1}>{cafe.name}</Text>
            {cafe.curator_pick && <Text style={styles.starPick}>✦</Text>}
          </View>
          <Text style={styles.cardLocation}>
            {cafe.neighborhood} · {cafe.city}
          </Text>
          <View style={styles.tagRow}>
            {cafe.vibe_tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{vibeLabel(tag)}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => toggleSaved(cafe.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={18}
            color={saved ? Colors.primary : Colors.textMuted}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trending</Text>
          <Text style={styles.subtitle}>Updated weekly by Pallavi</Text>
        </View>

        {/* This week banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>🔥</Text>
          <View>
            <Text style={styles.bannerTitle}>This week's hot spots</Text>
            <Text style={styles.bannerSub}>April 2026 · Curated by @honestcoffeestop</Text>
          </View>
        </View>

        {/* Trending list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          {trendingCafes.map((cafe, i) => renderCard(cafe, i + 1))}
        </View>

        {/* Pallavi's picks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✦ Pallavi's All-Time Picks</Text>
          <Text style={styles.sectionSub}>
            Every cafe she's personally vetted
          </Text>
          {curatorPicks.map((cafe) => renderCard(cafe, null))}
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(201,151,58,0.1)',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
  },
  bannerEmoji: {
    fontSize: 28,
  },
  bannerTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  bannerSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionSub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 12,
  },
  card: {
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
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankBubble: {
    width: 24,
    alignItems: 'center',
  },
  rankText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  cardPhoto: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#2A1A12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPhotoEmoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  cardInfo: {
    flex: 1,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  cardName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  starPick: {
    color: Colors.primary,
    fontSize: 12,
  },
  cardLocation: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.tagBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: 9,
  },
  saveBtn: {
    padding: 4,
  },
});
