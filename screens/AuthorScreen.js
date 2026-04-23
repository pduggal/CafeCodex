import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export default function AuthorScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ── Avatar + name ── */}
        <View style={styles.hero}>
          <View style={styles.photoRing}>
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoInitial}>P</Text>
            </View>
          </View>
          <Text style={styles.heroName}>Pallavi Duggal</Text>
          <Text style={styles.heroHandle}>@honestcoffeestop</Text>

          <View style={styles.socialRow}>
            {[
              { icon: 'logo-instagram', label: 'Instagram', url: 'https://instagram.com/honestcoffeestop' },
              { icon: 'logo-tiktok',    label: 'TikTok',    url: 'https://tiktok.com/@honestcoffeestop' },
              { icon: 'logo-youtube',   label: 'YouTube',   url: 'https://youtube.com/@honestcoffeestop' },
            ].map(({ icon, label, url }) => (
              <TouchableOpacity
                key={label}
                style={styles.socialPill}
                onPress={() => Linking.openURL(url)}
              >
                <Ionicons name={icon} size={13} color={Colors.primary} />
                <Text style={styles.socialText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Letter header ── */}
        <View style={styles.letterHeader}>
          <Text style={styles.eyebrow}>a letter from the author</Text>
          <Text style={styles.title}>Why I Built{'\n'}Café Codex</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* ── Story body ── */}
        <View style={styles.body}>

          {/* Opening — inline first-letter styling, no broken float */}
          <Text style={styles.openingPara}>
            <Text style={styles.firstLetter}>I </Text>
            don't remember the exact moment I fell in love with coffee. It wasn't
            a single cup — it was a slow accumulation of mornings, of cities, of
            quiet conversations held over something warm.
          </Text>

          <Text style={styles.para}>
            It started young. Before I understood roast profiles or brew ratios,
            I understood the <Text style={styles.em}>feeling</Text> — that first
            sip that made the world slow down for a second. That feeling became a
            compass. I started chasing it.
          </Text>

          <Text style={styles.para}>
            Every city I visited, every trip I planned — there was always a quiet
            second agenda: find the best cup{' '}
            <Text style={styles.em}>here.</Text> Not the most famous. Not the
            most photographed. The most honest one. The one where the owner could
            tell you exactly where the beans came from, and why they opened this
            place at all.
          </Text>

          {/* Pull quote */}
          <View style={styles.pullQuote}>
            <Text style={styles.pullQuoteText}>
              "Every cafe has a story.{'\n'}I love knowing it."
            </Text>
          </View>

          <Text style={styles.para}>
            Then came Japan. I wasn't prepared for what matcha would do to me.
            Not the powder-in-milk version the world had watered down — a{' '}
            <Text style={styles.em}>real</Text> bowl. Stone-ground. Whisked by
            hand. Bright, grassy, almost electric. It was the coffee feeling all
            over again, but ancient. Ceremonial. I've been chasing that too ever
            since.
          </Text>

          <Text style={styles.para}>
            Here's what nobody tells you about traveling for coffee and matcha:
            the research is exhausting. Every city is a rabbit hole. You spend
            hours before a trip just trying to answer one question —
            where do I actually go?
          </Text>

          {/* Second pull quote */}
          <View style={styles.pullQuote}>
            <Text style={styles.pullQuoteText}>
              "I built Café Codex so you don't{'\n'}have to do that anymore."
            </Text>
          </View>

          <Text style={styles.para}>
            Every cafe in here I've either visited myself or personally vetted.
            I've ordered the thing. I've sat in the light. I've talked to the
            person behind the counter. This isn't a review app — it's a record.
          </Text>

          <Text style={[styles.para, styles.closing]}>
            My record. And now it's yours to use.
          </Text>

          {/* Signature */}
          <View style={styles.signature}>
            <Text style={styles.signatureDash}>—</Text>
            <Text style={styles.signatureName}>Pallavi</Text>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          {[
            { value: '6',    label: 'Countries' },
            { value: '362',  label: 'Cafes in Codex' },
            { value: '∞',   label: 'Coffees tried' },
            { value: '∞',   label: 'Matchas tried' },
          ].map(({ value, label }, i, arr) => (
            <React.Fragment key={label}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── In the Press ── */}
        <View style={styles.pressSection}>
          <Text style={styles.pressTitle}>In the Press</Text>
          <View style={styles.pressCard}>
            <View style={styles.pressBadge}>
              <Text style={styles.pressBadgeText}>Featured</Text>
            </View>
            <Text style={styles.pressQuote}>
              "One of the most thoughtfully curated cafe guides we've seen —
              part travel journal, part love letter to coffee culture."
            </Text>
            <Text style={styles.pressSource}>— Honest Coffee Stop</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingBottom: 20,
  },

  // ── Hero ──────────────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
  },
  photoRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    padding: 3,
    marginBottom: 14,
  },
  photoPlaceholder: {
    flex: 1,
    borderRadius: 48,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoInitial: {
    color: Colors.primary,
    fontSize: 34,
    fontWeight: '700',
  },
  heroName: {
    color: Colors.cream,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  heroHandle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  socialText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Letter header ─────────────────────────────────────────────────────
  letterHeader: {
    paddingHorizontal: 26,
    marginBottom: 28,
  },
  eyebrow: {
    color: Colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  title: {
    color: Colors.cream,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  titleUnderline: {
    width: 40,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  // ── Body ──────────────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 26,
  },
  openingPara: {
    color: Colors.cream,
    fontSize: 17,
    lineHeight: 30,
    fontWeight: '400',
    marginBottom: 22,
  },
  firstLetter: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 30,
  },
  para: {
    color: Colors.cream,
    fontSize: 16,
    lineHeight: 28,
    fontWeight: '400',
    marginBottom: 20,
  },
  em: {
    fontStyle: 'italic',
    color: Colors.cream,
  },
  closing: {
    fontWeight: '500',
  },

  // Pull quote
  pullQuote: {
    alignItems: 'center',
    marginVertical: 28,
    paddingHorizontal: 12,
  },
  pullQuoteText: {
    color: Colors.primary,
    fontSize: 19,
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.3,
  },

  // Highlight — same style as pull quote, centered, no box
  highlight: {
    alignItems: 'center',
    marginVertical: 28,
    paddingHorizontal: 12,
  },
  highlightText: {
    color: Colors.primary,
    fontSize: 19,
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.3,
  },

  // Signature
  signature: {
    marginTop: 24,
    marginBottom: 36,
  },
  signatureDash: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 4,
  },
  signatureName: {
    color: Colors.primary,
    fontSize: 26,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },

  // ── Stats ─────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 26,
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 22,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.cardBorder,
  },

  pressSection: {
    marginHorizontal: 26,
    marginTop: 28,
  },
  pressTitle: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  pressCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 18,
  },
  pressBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,151,58,0.15)',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 12,
  },
  pressBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pressQuote: {
    color: Colors.cream,
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 10,
  },
  pressSource: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
