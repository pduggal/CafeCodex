import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const WORLD_BEST = [
  { rank: 1, name: 'Onyx Coffee Lab', loc: 'Rogers, Arkansas, USA', flag: '\u{1F1FA}\u{1F1F8}', known: 'Multi-award-winning roaster known for sourcing the world’s rarest lots', top3: true },
  { rank: 2, name: 'Tim Wendelboe', loc: 'Grünerløkka, Oslo, Norway', flag: '\u{1F1F3}\u{1F1F4}', known: 'Legendary Nordic micro-roastery — single-origin light roasts, no milk menu', top3: true },
  { rank: 3, name: 'Alquimia Coffee', loc: 'Santa Ana, El Salvador', flag: '\u{1F1F8}\u{1F1FB}', known: 'Farm-to-cup at origin — brews from their own volcanic-soil estate', top3: true },
  { rank: 4, name: 'ONA Coffee', loc: 'Marrickville, Sydney, Australia', flag: '\u{1F1E6}\u{1F1FA}', known: 'World Barista Championship winners — precision-driven specialty' },
  { rank: 5, name: 'Toby’s Estate Roasters', loc: 'Chippendale, Sydney, Australia', flag: '\u{1F1E6}\u{1F1FA}', known: 'Warehouse roastery with seasonal blends and single origins' },
  { rank: 6, name: 'Apartment Coffee', loc: 'Lavender, Singapore', flag: '\u{1F1F8}\u{1F1EC}', known: 'Minimalist café bar serving refined espresso and batch brews' },
  { rank: 7, name: 'Gota Coffee Experts', loc: 'Neubau, Vienna, Austria', flag: '\u{1F1E6}\u{1F1F9}', known: 'Third-wave pioneer in a city famous for traditional coffeehouses' },
  { rank: 8, name: 'Story of Ono', loc: 'Kuala Lumpur, Malaysia', flag: '\u{1F1F2}\u{1F1FE}', known: 'Japanese-inspired pour-over bar with single-estate Malaysian beans' },
  { rank: 9, name: 'Tropicalia Coffee', loc: 'Chapinero, Bogotá, Colombia', flag: '\u{1F1E8}\u{1F1F4}', known: 'Colombian specialty at origin — fruit-forward roasts and cascara' },
  { rank: 10, name: 'Tanat', loc: 'Le Marais, Paris, France', flag: '\u{1F1EB}\u{1F1F7}', known: 'New-wave Parisian espresso bar redefining café culture in the Marais' },
];

export default function AuthorScreen() {
  const [worldBestOpen, setWorldBestOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* ── Avatar + name ── */}
        <View style={styles.hero}>
          <View style={styles.photoRing}>
            <Image
              source={require('../assets/author.jpg')}
              style={styles.photoImage}
            />
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

          <View style={styles.signature}>
            <Text style={styles.signatureDash}>—</Text>
            <Text style={styles.signatureName}>Pallavi</Text>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          {[
            { value: '7+',   label: 'Countries' },
            { value: '50+',  label: 'Cafes visited' },
            { value: '∞', label: 'Coffees tried' },
            { value: '∞', label: 'Matchas tried' },
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

        {/* ── World's Best Coffee Shops 2026 ── */}
        <View style={styles.worldBest}>
          <TouchableOpacity
            style={styles.worldBestToggle}
            onPress={() => setWorldBestOpen(!worldBestOpen)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.worldBestTitle}>{'✦'} World's Best Coffee Shops 2026</Text>
              <Text style={styles.worldBestSubtitle}>Top 10 from 100+ shops worldwide — tap to explore</Text>
            </View>
            <Text style={[styles.worldBestChevron, worldBestOpen && styles.worldBestChevronOpen]}>
              {'▼'}
            </Text>
          </TouchableOpacity>

          {worldBestOpen && (
            <View style={styles.worldBestCard}>
              {WORLD_BEST.map((item) => (
                <View key={item.rank} style={[styles.wbRow, item.top3 && styles.wbRowTop3]}>
                  <Text style={[styles.wbRank, item.top3 && styles.wbRankTop3]}>{item.rank}</Text>
                  <View style={styles.wbInfo}>
                    <Text style={[styles.wbName, item.top3 && styles.wbNameTop3]}>{item.name}</Text>
                    <Text style={styles.wbLoc}>{item.flag} {item.loc}</Text>
                    <Text style={styles.wbKnown}>{item.known}</Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={styles.wbSource}
                onPress={() => Linking.openURL('https://theworlds100bestcoffeeshops.com/top-100-coffee-shops/')}
              >
                <Text style={styles.wbSourceText}>Source: The World's 100 Best Coffee Shops 2026 {'→'}</Text>
              </TouchableOpacity>
            </View>
          )}
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
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
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

  worldBest: {
    marginHorizontal: 26,
    marginTop: 28,
  },
  worldBestToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  worldBestTitle: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  worldBestSubtitle: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  worldBestChevron: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  worldBestChevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  worldBestCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.cardBorder,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
  },
  wbRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  wbRowTop3: {
    backgroundColor: 'rgba(201,151,58,0.06)',
  },
  wbRank: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '800',
    width: 22,
    textAlign: 'center',
    paddingTop: 1,
  },
  wbRankTop3: {
    fontSize: 16,
  },
  wbInfo: {
    flex: 1,
  },
  wbName: {
    color: Colors.cream,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  wbNameTop3: {
    fontSize: 14,
  },
  wbLoc: {
    color: Colors.textMuted,
    fontSize: 10,
    marginBottom: 3,
  },
  wbKnown: {
    color: Colors.cream,
    fontSize: 10,
    fontStyle: 'italic',
    opacity: 0.6,
    lineHeight: 14,
  },
  wbSource: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    alignItems: 'center',
  },
  wbSourceText: {
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
