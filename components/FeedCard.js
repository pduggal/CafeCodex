import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { Colors } from '../constants/colors';
import { timeAgo } from '../data/cafes';

const TYPE_BADGES = {
  cafe: '☕ JUST ADDED',
  city: '🗺 NEW CITY LIVE',
  recipe: '🧪 SECRET RECIPE',
  interview: '🎙 INTERVIEW',
  update: '✦ FROM PALLAVI',
};

function FeedCard({ post, onPress }) {
  const meta = post.metadata || {};

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.typeBadge}>{TYPE_BADGES[post.type] || post.type}</Text>
        <Text style={styles.timestamp}>{timeAgo(post.published_at)}</Text>
      </View>

      {post.image_url && (
        <Image source={{ uri: post.image_url }} style={styles.heroImage} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>

        {post.subtitle ? (
          <Text style={styles.subtitle}>{post.subtitle}</Text>
        ) : null}

        {post.type === 'recipe' && meta.ingredients ? (
          <View style={styles.ingredientList}>
            {meta.ingredients.map((item, i) => (
              <Text key={i} style={styles.ingredient}>◦  {item}</Text>
            ))}
          </View>
        ) : null}

        {post.body ? (
          <Text style={[
            styles.body,
            (post.type === 'cafe' || post.type === 'city') && styles.bodyQuote,
          ]}>
            {post.body}
          </Text>
        ) : null}

        {meta.owner_quote ? (
          <Text style={styles.bodyQuote}>
            "{meta.owner_quote}"{meta.instagram ? `  — ${meta.instagram}` : ''}
          </Text>
        ) : null}

        {post.type === 'interview' && meta.url ? (
          <TouchableOpacity
            style={styles.cta}
            onPress={() => Linking.openURL(meta.url)}
          >
            <Text style={styles.ctaText}>
              {meta.platform === 'youtube' ? '▶ Watch Now' : '📷 Watch Now'} →
            </Text>
          </TouchableOpacity>
        ) : null}

        {(post.type === 'cafe' || post.type === 'city') && onPress ? (
          <TouchableOpacity style={styles.cta} onPress={onPress}>
            <Text style={styles.ctaText}>
              {post.type === 'cafe' ? '☕ View Cafe' : `☕ Explore ${meta.city || 'City'}`} →
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  typeBadge: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timestamp: {
    color: Colors.tabBarInactive,
    fontSize: 11,
    fontWeight: '500',
  },
  heroImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    color: Colors.cream,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 3,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  body: {
    color: Colors.cream,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  bodyQuote: {
    fontStyle: 'italic',
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  ingredientList: {
    marginTop: 8,
  },
  ingredient: {
    color: Colors.cream,
    fontSize: 14,
    lineHeight: 22,
  },
  cta: {
    marginTop: 14,
    alignSelf: 'center',
    backgroundColor: 'rgba(201,151,58,0.12)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(201,151,58,0.3)',
  },
  ctaText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default React.memo(FeedCard);
