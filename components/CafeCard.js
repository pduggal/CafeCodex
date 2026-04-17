import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { VIBE_TAGS } from '../data/cafes';
import { useCafes } from '../context/CafeContext';

export default function CafeCard({ cafe, onPress }) {
  const { isSaved, toggleSaved, isVisited } = useCafes();
  const saved = isSaved(cafe.id);
  const visited = isVisited(cafe.id);

  const vibeLabel = (tagId) => {
    const found = VIBE_TAGS.find((t) => t.id === tagId);
    return found ? `${found.emoji} ${found.label}` : tagId;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Photo area — compact */}
      <View style={styles.photoArea}>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoEmoji}>☕</Text>
        </View>

        {/* Badges */}
        <View style={styles.badgeRow}>
          {cafe.curator_pick && (
            <View style={styles.curatorBadge}>
              <Text style={styles.curatorBadgeText}>✦ Pallavi's Pick</Text>
            </View>
          )}
          {cafe.trending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingBadgeText}>🔥 Trending</Text>
            </View>
          )}
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => toggleSaved(cafe.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={18}
            color={saved ? Colors.primary : Colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* Info — tighter padding */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{cafe.name}</Text>
          {cafe.curator_rating && (
            <View style={styles.ratingPill}>
              <Text style={styles.ratingText}>{'★'.repeat(cafe.curator_rating)}</Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.location}>
            {cafe.neighborhood} · {cafe.city}
          </Text>
          {visited && (
            <View style={styles.visitedBadge}>
              <Text style={styles.visitedText}>✓ Visited</Text>
            </View>
          )}
        </View>

        {/* Vibe tags — max 3, inline */}
        <View style={styles.tagRow}>
          {cafe.vibe_tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{vibeLabel(tag)}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  photoArea: {
    height: 140,
    position: 'relative',
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#2A1A12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEmoji: {
    fontSize: 40,
    opacity: 0.35,
  },
  badgeRow: {
    position: 'absolute',
    top: 8,
    left: 10,
    flexDirection: 'row',
  },
  curatorBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginRight: 6,
  },
  curatorBadgeText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  trendingBadge: {
    backgroundColor: 'rgba(26,15,10,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  trendingBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  saveBtn: {
    position: 'absolute',
    top: 8,
    right: 10,
    backgroundColor: 'rgba(26,15,10,0.7)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  name: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  ratingPill: {
    backgroundColor: 'rgba(201,151,58,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: Colors.primary,
    fontSize: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  location: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  visitedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  visitedText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.tagBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '500',
  },
});
