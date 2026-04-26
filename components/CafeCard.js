import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { VIBE_TAGS, getCafePhoto } from '../data/cafes';
import { useCafes } from '../context/CafeContext';

function CafeCard({ cafe, onPress }) {
  const { isSaved, toggleSaved, isVisited } = useCafes();
  const saved = isSaved(cafe.id);
  const visited = isVisited(cafe.id);
  const photo = getCafePhoto(cafe);

  const vibeLabel = (tagId) => {
    const found = VIBE_TAGS.find((t) => t.id === tagId);
    return found ? `${found.emoji} ${found.label}` : tagId;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.photoArea}>
        <Image source={{ uri: photo }} style={styles.photoImg} />

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

        {cafe.is_active === false && (
          <View style={styles.closedBadge}>
            <Text style={styles.closedBadgeText}>⚠ Closed</Text>
          </View>
        )}

        {cafe.press_mention && (
          <View style={styles.pressBadge}>
            <Text style={styles.pressBadgeText}>{cafe.press_mention}</Text>
          </View>
        )}

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
            {cafe.neighborhood ? `${cafe.neighborhood} · ` : ''}{cafe.city}
          </Text>
          {visited && (
            <View style={styles.visitedBadge}>
              <Text style={styles.visitedText}>✓ Visited</Text>
            </View>
          )}
        </View>

        {cafe.instagram_handle && (
          <Text style={styles.instagramHandle}>@{cafe.instagram_handle}</Text>
        )}

        {cafe.must_try && (
          <View style={styles.mustTryRow}>
            <Text style={styles.mustTryText} numberOfLines={1}>
              ✦ Must try: {cafe.must_try.drink}
            </Text>
          </View>
        )}

        <View style={styles.tagRow}>
          {(cafe.vibe_tags || []).slice(0, 3).map((tag) => (
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
  photoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  closedBadge: {
    position: 'absolute',
    top: 8,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  closedBadgeText: {
    color: '#ff6b6b',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pressBadge: {
    position: 'absolute',
    top: 8,
    right: 44,
    backgroundColor: 'rgba(201,151,58,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  pressBadgeText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: '800',
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
  instagramHandle: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 6,
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
  mustTryRow: {
    backgroundColor: 'rgba(201,151,58,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201,151,58,0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  mustTryText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.cardBackground,
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

export default React.memo(CafeCard);
