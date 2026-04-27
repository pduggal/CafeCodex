# Cafe Codex

**Your personal record of the world's best cups.**

A curated coffee and matcha cafe discovery app for iOS, Android, and the web. Not crowd-sourced noise. Editorial curation from a trusted firsthand voice.

*Built by [Pallavi Duggal](https://instagram.com/honestcoffeestop)*

---

## The Vision

A codex is an ancient handwritten manuscript — a personal record of knowledge compiled by a single author. Cafe Codex is exactly that: my personal record of every great cafe I've visited around the world.

Every cafe in Cafe Codex has been visited, photographed, and reviewed by me. No algorithms. No paid placements. No anonymous reviews. Just honest recommendations from someone who has tried the oat latte, sat in the corner seat, and knows which barista makes the best pour-over.

The coffee and matcha world is full of noise — Cafe Codex cuts through it.

---

## What It Does

### Discover
Swipe through curated cafes like a dating app for coffee. Swipe right to save a cafe to your "Want to Go" list. Swipe left to mark it as "Been There." Tap any card for the full story.

### Browse & Search
Switch to list view to search by name, city, neighborhood, or vibe. Filter by drink type (coffee or matcha) and curated vibe tags like Hidden Gem, Viral & Aesthetic, or Matcha Specialist.

### Your Lists
Three personal lists that sync across sessions:
- **Want to Go** — cafes you've saved to visit
- **Been There** — cafes you've already visited
- **Saved** — your all-time favorites, starred from any list

### Curator's Picks
Every cafe comes with my personal notes: what to order, the best time to visit, content tips for creators, and a must-try drink recommendation.

### Nominate
Know a cafe that should be in the codex? Submit it through the nomination form. I personally review every submission.

---

## Architecture

```
                    +------------------+
                    |    Supabase      |
                    |  (Postgres DB)   |
                    |  362+ cafes      |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------+----------+     +------------+-----------+
    |   React Native     |     |   Webapp (HTML/JS)     |
    |   Expo (iOS/Android)|     |   GitHub Pages         |
    |                    |     |   Single-file           |
    +--------------------+     +------------------------+
```

Two clients, one backend. The React Native app and the webapp share the same Supabase database and the same cafe data. Features are kept in sync across both platforms.

---

## Tech Stack

### React Native App
| Layer | Technology |
|---|---|
| Framework | React Native + Expo (managed workflow) |
| Navigation | React Navigation (bottom tabs + native stack) |
| Gestures | react-native-gesture-handler + react-native-reanimated |
| State | Context API + AsyncStorage |
| Backend | Supabase (Postgres, Auth, Storage) |
| Icons | @expo/vector-icons (Ionicons) |

### Webapp
| Layer | Technology |
|---|---|
| Framework | Single-file HTML/CSS/JS |
| Hosting | GitHub Pages |
| Backend | Supabase (shared instance) |
| Analytics | GoatCounter |
| Email | Web3Forms |

---

## Folder Structure

```
CafeCodex/
+-- index.html              # Webapp (all inline, GitHub Pages)
+-- App.js                  # RN root: navigation, providers, loading screen
+-- app.json                # Expo config
+-- babel.config.js          # Expo preset + reanimated plugin
+-- package.json
+-- assets/
|   +-- icon.png            # App icon
|   +-- splash.png          # Splash screen
|   +-- author.jpg          # Pallavi's author photo
+-- constants/
|   +-- colors.js           # Brand palette
+-- context/
|   +-- CafeContext.js      # Global state: cafes, lists, preferences, offline cache
+-- lib/
|   +-- supabase.js         # Supabase client
+-- data/
|   +-- cafes.js            # Vibe tags, photo fallbacks, shared utilities
+-- components/
|   +-- CafeCard.js         # Reusable cafe card (photo, badges, vibe tags)
+-- screens/
|   +-- OnboardingScreen.js # Drink preference + location + vibe selection
|   +-- SwipeScreen.js      # Swipe cards + list/browse + city filter
|   +-- CafeDetailScreen.js # Full cafe detail: notes, must-try, directions
|   +-- MyListScreen.js     # 3 tabs: Want to Go, Been There, Saved
|   +-- AuthorScreen.js     # Author story, stats, World's Best list
|   +-- NominateScreen.js   # Nomination form + email notification
+-- __tests__/              # Jest test suite (57 tests)
```

---

## Data Model

### Cafe Object
```js
{
  id, name, city, country, neighborhood, drink,
  photo_url,
  vibe_tags: [],
  curator_pick: boolean,
  curator_rating: 1-5,
  curator_notes: { what_to_order, best_time, content_tips },
  must_try: { drink, note },
  instagram_handle,
  is_active: boolean,
  trending: boolean,
  press_mention: string,
}
```

### Vibe Tags (8)
| Tag | Label |
|---|---|
| `viral_aesthetic` | Viral & Aesthetic |
| `matcha_specialist` | Matcha Specialist |
| `specialty_coffee` | Specialty Coffee |
| `pour_over` | Pour-Over |
| `creative_drinks` | Creative Drinks |
| `cozy_quiet` | Cozy & Quiet |
| `hidden_gem` | Hidden Gem |
| `collab_worthy` | Collab-Worthy |

---

## Brand

| Token | Value | Usage |
|---|---|---|
| Background | `#1A0F0A` | Dark coffee-brown base |
| Primary | `#C9973A` | Gold accents, active states |
| Cream | `#FDF6EC` | Primary text |
| Card | `#2A1A12` | Card surfaces |
| Success | `#6B9E6B` | "Want to Go" actions |
| Muted | `#A89080` | Secondary text |

The design language is dark, warm, and editorial — like a coffee shop menu written on a chalkboard.

---

## Running Locally

```bash
git clone https://github.com/pduggal/CafeCodex.git
cd CafeCodex
npm install
npx expo start --clear
```

Scan the QR code with Expo Go on your phone, or press `w` for the web version.

### Tests
```bash
npm test              # Run all 57 tests
npm run test:watch    # Watch mode
```

---

## Roadmap

### Phase 1 — MVP (current)
- [x] Core app: swipe, list, detail, save, nominate
- [x] Webapp deployed and mobile-responsive
- [x] Supabase backend with 362+ cafes
- [x] Email notifications on nominations
- [x] Analytics (GoatCounter)
- [x] Native gesture handling (react-native-gesture-handler + reanimated)
- [ ] Real app icon and splash screen
- [ ] Fix remaining runtime issues on device

### Phase 2 — Features
- Nomination approval pipeline (Google Places + Instagram validation)
- User authentication (Supabase Auth)
- Pro tier (Freemium, $3.99/mo)

### Phase 3 — Growth
- India: Bangalore, Mumbai, Delhi, Hyderabad
- Europe: London, Paris, Amsterdam, Copenhagen
- Japan: Tokyo, Kyoto
- Brand collab booking

---

## Launch Cities

1. **Seattle / Bellevue** — home base, richest data
2. **New York City**
3. **Los Angeles, Chicago**
4. **India** — Bangalore, Mumbai, Delhi, Hyderabad
5. **Europe** — London, Paris, Amsterdam, Copenhagen
6. **Japan** — Tokyo, Kyoto

---

## Author

**Pallavi Duggal** ([@honestcoffeestop](https://instagram.com/honestcoffeestop))

Creator, curator, and the only reviewer. Every cafe in Cafe Codex has been personally visited and vetted.
