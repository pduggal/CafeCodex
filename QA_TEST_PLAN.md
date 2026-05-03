# Cafe Codex QA Test Plan

**App:** Cafe Codex v1.0
**Date:** May 2, 2026
**Platforms:** iOS, Android
**Tech:** React Native + Expo (SDK 54)

---

## Stream 1: Android App Testing

### 1.1 Installation & Launch
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| A-1 | Install via Expo Go | Scan QR code from `npx expo start` | App installs and opens |
| A-2 | Cold start | Kill app, reopen | Login screen if no session; tabs if session exists |
| A-3 | Splash screen | Open app fresh | Splash image displays, then loading screen with cycling messages |
| A-4 | Status bar | Check status bar on all screens | Light text on dark background |

### 1.2 Keyboard Behavior (Android-Specific)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| A-5 | Login keyboard | Tap email field | Keyboard opens, form scrolls up, fields not hidden behind keyboard |
| A-6 | Signup keyboard | Fill all 4 fields | KeyboardAvoidingView (behavior="height") keeps Submit visible |
| A-7 | Nomination form keyboard | Tap multiline "What makes it honest" | Keyboard opens, textarea scrolls into view |
| A-8 | Search keyboard | Tap search in Browse mode (SwipeScreen) | Keyboard opens, list adjusts |
| A-9 | Keyboard dismiss | Tap outside input field | Keyboard dismisses |
| A-10 | Country dropdown + keyboard | Type "jap" in Country field | Dropdown appears above keyboard, items tappable |

### 1.3 Gesture Handling (Android-Specific)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| A-11 | Swipe right to save | Pan card >75px right | Card animates off-screen right, "Saved!" toast, next card appears |
| A-12 | Swipe left to visited | Pan card >75px left | Card animates off-screen left, "Visited!" toast, next card appears |
| A-13 | Tap vs swipe conflict | Tap center of card with <5px movement | Opens CafeDetail, does NOT trigger swipe |
| A-14 | Partial swipe cancel | Drag card 30px right, release | Card snaps back to center |
| A-15 | Fast fling gesture | Quick flick right | Card saves even if <75px distance (velocity threshold) |
| A-16 | Back button (hardware) | Press Android back button on CafeDetail | Returns to previous screen |
| A-17 | Back button on root tab | Press Android back button on Discover tab | App goes to background (does NOT crash) |
| A-18 | Pull-to-refresh Feed | Pull down on Feed screen | Refresh indicator shows, posts reload |
| A-19 | ScrollView inside tabs | Scroll any long screen (Author, Nomination) | Smooth scrolling, no jank |

### 1.4 Navigation (Android)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| A-20 | Tab switching | Tap each of 5 tabs | Correct screen loads, icon highlights gold |
| A-21 | Deep navigation stack | Discover > Swipe > CafeDetail > Back > Back | Returns through stack correctly |
| A-22 | Feed to CafeDetail | Tap a cafe-type feed post | CafeDetail opens with correct cafe data |
| A-23 | Cross-tab state | Save cafe in Discover, switch to My List | Cafe appears in "Want to Go" tab |

### 1.5 External Links (Android)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| A-24 | Google Maps link | CafeDetail > tap "Google Maps" | Opens Google Maps app with cafe search |
| A-25 | Apple Maps link | CafeDetail > tap "Apple Maps" | Opens browser/maps with query (may not have Apple Maps app) |
| A-26 | Instagram link | CafeDetail > tap @handle | Opens Instagram app or browser |
| A-27 | Social links (Author) | Tap Instagram/TikTok/YouTube pills | Each opens correct app or browser |
| A-28 | Interview Watch Now | Feed > tap Watch Now on interview post | Opens YouTube/Instagram in browser or app |
| A-29 | Share nomination | Submit nomination > tap Share | Android share sheet opens with nomination text |

### 1.6 Display & Rendering (Android)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| A-30 | Image loading | Scroll through swipe cards with photos | Images load, no broken images; fallback photos for cafes without photo_url |
| A-31 | Long text wrapping | View cafe with long curator notes | Text wraps properly, no overflow |
| A-32 | Emoji rendering | Check type badges (coffee, map, etc.) | All emojis render on Android |
| A-33 | Font weights | Check bold/light text across screens | Consistent weight rendering (800, 700, 600, 500, 400) |
| A-34 | Dark theme | All screens | Background #1A0F0A, no white flashes, no unstyled elements |
| A-35 | Dropdown overlay (zIndex) | Open country dropdown when city field visible | Dropdown renders ON TOP of city field, not behind |

### 1.7 App Lifecycle (Android)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| A-36 | Background/foreground | Open app, press Home, reopen | App resumes without re-login, state intact |
| A-37 | Kill and reopen | Force-stop app, reopen | Session restored from AsyncStorage, no login needed |
| A-38 | Low memory | Open multiple apps to stress memory | App recovers on foreground, data reloads from cache |
| A-39 | Screen rotation | Rotate device (if not locked) | App handles rotation or stays portrait |

---

## Stream 2: iOS App Testing

### 2.1 Installation & Launch
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I-1 | Install via Expo Go | Scan QR code from `npx expo start` | App installs and opens |
| I-2 | Cold start | Kill app, reopen | Login screen if no session; tabs if session exists |
| I-3 | Splash screen | Open app fresh | Splash image displays, then animated loading messages |
| I-4 | Status bar | Check across all screens | Light content style, no overlap with notch/Dynamic Island |

### 2.2 Keyboard Behavior (iOS-Specific)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I-5 | Login keyboard | Tap email field | Keyboard opens with padding behavior, fields push up |
| I-6 | Signup keyboard | Fill all 4 fields | KeyboardAvoidingView (behavior="padding") keeps Submit visible |
| I-7 | Nomination form keyboard | Tap "What makes it honest" textarea | Content scrolls, textarea visible above keyboard |
| I-8 | Search keyboard | Tap search in Browse mode | Keyboard opens, list adjusts |
| I-9 | Keyboard dismiss | Tap outside input | Keyboard dismisses smoothly |
| I-10 | Input zoom prevention | Tap any TextInput | iOS does NOT auto-zoom (font size >= 16px) |
| I-11 | Country dropdown + keyboard | Type in Country field | Dropdown appears, tapping item dismisses keyboard |

### 2.3 Gesture Handling (iOS-Specific)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I-12 | Swipe right to save | Pan card >75px right | Smooth 60fps animation, card flies off, toast appears |
| I-13 | Swipe left to visited | Pan card >75px left | Smooth animation, "Visited!" toast |
| I-14 | Tap vs swipe conflict | Tap center of card | Opens CafeDetail without any swipe trigger |
| I-15 | Partial swipe cancel | Drag 30px and release | Spring animation back to center |
| I-16 | Gesture on reanimated thread | Rapid swipes (5+ fast swipes) | No frame drops, no gesture desyncs — runs on UI thread |
| I-17 | iOS back swipe | On CafeDetail, swipe from left edge | iOS native back gesture works, returns to previous screen |
| I-18 | Pull-to-refresh Feed | Pull down on Feed | Native iOS bounce + refresh indicator |
| I-19 | Scroll bounce | Scroll past bottom of AuthorScreen | iOS elastic bounce, no glitch |

### 2.4 Safe Area & Notch (iOS-Specific)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I-20 | Top safe area | All screens | Content below notch/Dynamic Island, no overlap |
| I-21 | Bottom safe area | Tab bar, scrollable content | Tab bar above home indicator, content not cut off |
| I-22 | Landscape (if supported) | Rotate device | App handles gracefully or locks to portrait |

### 2.5 Navigation (iOS)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I-23 | Tab switching | Tap each of 5 tabs | Correct screen, gold active icon |
| I-24 | Stack navigation | Discover > Swipe > CafeDetail > Back | Native stack transition, back button works |
| I-25 | Feed to CafeDetail | Tap cafe post in feed | Navigates to CafeDetail with correct cafe |
| I-26 | Cross-tab state | Save in Discover, check My List | Cafe present in Want to Go |

### 2.6 External Links (iOS)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I-27 | Apple Maps link | CafeDetail > "Apple Maps" | Opens Apple Maps app with cafe search query |
| I-28 | Google Maps link | CafeDetail > "Google Maps" | Opens Google Maps app (if installed) or Safari |
| I-29 | Instagram link | Tap @handle on CafeDetail | Opens Instagram app or Safari |
| I-30 | Social links (Author) | Tap each social pill | Opens correct app (Instagram, TikTok, YouTube) |
| I-31 | Interview Watch Now | Tap Watch Now CTA on interview post | Opens YouTube/Instagram via Linking.openURL |
| I-32 | Share nomination | Submit > Share | iOS share sheet with nomination text |
| I-33 | Clipboard fallback | If share fails | Text copied to clipboard, "Copied!" alert |

### 2.7 Display & Rendering (iOS)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I-34 | Image loading | Scroll cards | Photos load smoothly, fallback photos for missing URLs |
| I-35 | Font rendering | Check all text styles | SF Pro renders cleanly at all weights |
| I-36 | Emoji rendering | Type badges, vibe tags | All emojis display correctly |
| I-37 | Dark theme consistency | Navigate all screens | Pure dark (#1A0F0A) throughout, no white flashes on transition |
| I-38 | Dropdown overlay | Open country dropdown | Dropdown overlays city field correctly (zIndex) |

### 2.8 App Lifecycle (iOS)
| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I-39 | Background/foreground | Home button, reopen | State intact, no re-login |
| I-40 | Kill and reopen | Swipe up to kill, reopen | Session restored, previous tab state loaded |
| I-41 | Low memory warning | Simulate memory pressure | App recovers, reloads from cache |
| I-42 | Interrupted by call | Receive phone call during use | App resumes correctly after call |

---

## Stream 3: Functional Testing (A to Z)

### 3.1 Authentication — Login

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-1 | Valid login | Enter valid email + password > Sign In | Redirects to Discover tab, session stored | P0 |
| F-2 | Invalid password | Enter valid email + wrong password | Alert: "Wrong email or password" | P0 |
| F-3 | Non-existent email | Enter unregistered email | Alert: "Wrong email or password" | P0 |
| F-4 | Empty email | Leave email blank > Sign In | Alert: "Please enter your email and password" | P1 |
| F-5 | Empty password | Leave password blank > Sign In | Alert: "Please enter your email and password" | P1 |
| F-6 | Invalid email format | Enter "notanemail" > Sign In | Alert shown (email validation) | P1 |
| F-7 | Navigate to Signup | Tap "Create one" link | SignupScreen appears | P0 |
| F-8 | Session persistence | Login, kill app, reopen | Auto-logged in, no login screen | P0 |

### 3.2 Authentication — Signup

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-9 | Valid signup | Fill Name, Email, Password > Create Account | Auto-login, profile created, redirects to tabs | P0 |
| F-10 | Valid signup with phone | Fill all 4 fields including phone | Account created with phone number | P1 |
| F-11 | Missing name | Leave name blank > submit | Alert: "Please enter your name" | P1 |
| F-12 | Missing email | Leave email blank > submit | Alert: "Please enter a valid email" | P1 |
| F-13 | Invalid email | Enter "bad@" > submit | Alert: "Please enter a valid email" | P1 |
| F-14 | Short password | Enter 3-char password > submit | Alert: "Password must be at least 6 characters" | P1 |
| F-15 | Invalid phone | Enter "123" > submit | Alert: "Please enter a valid phone number (10+ digits)" | P2 |
| F-16 | Duplicate email | Sign up with existing email | Alert: "already registered" | P0 |
| F-17 | Navigate to Login | Tap "Sign in" link | LoginScreen appears | P0 |

### 3.3 Authentication — Logout

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-18 | Sign out | (If signout button exists) Tap sign out | Session cleared, LoginScreen shown | P0 |
| F-19 | Session cleared | After logout, kill app, reopen | LoginScreen shown (not auto-logged in) | P0 |

### 3.4 Onboarding

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-20 | Drink selection — Coffee | Tap Coffee card | Gold highlight, selection stored | P0 |
| F-21 | Drink selection — Matcha | Tap Matcha card | Gold highlight, selection stored | P0 |
| F-22 | Drink selection — Both | Tap Both option (if exists) | Both selected | P1 |
| F-23 | Vibe tag multi-select | Tap 3 different vibe tags | All 3 highlighted, stored to AsyncStorage | P0 |
| F-24 | Vibe tag deselect | Tap a selected tag again | Tag deselects | P1 |
| F-25 | Location search — valid city | Type "Seattle" | Dropdown shows "Seattle, United States" with flag | P0 |
| F-26 | Location search — alias | Type "NYC" | Shows "New York, United States" | P1 |
| F-27 | Location search — neighborhood | Type "Nakameguro" | Shows matching city result | P2 |
| F-28 | Location search — unvisited | Type "Seoul" | Shows "South Korea" with "Not explored yet" | P1 |
| F-29 | Location select | Tap a search result | Location saved, dropdown closes | P0 |
| F-30 | Location — min chars | Type 1 character | No results shown (minimum 2 chars) | P2 |
| F-31 | Continue to Swipe | Complete onboarding > Continue | SwipeScreen loads with filtered cafes | P0 |
| F-32 | Preferences persist | Complete onboarding, leave tab, return | Preferences still saved | P1 |

### 3.5 Discover — Swipe Mode

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-33 | Card displays | View top swipe card | Shows photo, name, city, neighborhood, vibe tags, rating | P0 |
| F-34 | Card photo fallback | Cafe with no photo_url | Shows random coffee/matcha fallback photo | P1 |
| F-35 | Swipe right — save | Swipe card right past threshold | Card saved to "Want to Go", next card shows | P0 |
| F-36 | Swipe left — visited | Swipe card left past threshold | Card saved to "Been There", next card shows | P0 |
| F-37 | Tap card — detail | Tap card center | Opens CafeDetailScreen for that cafe | P0 |
| F-38 | Swipe all cards | Swipe through entire deck | "That's all for now" message + "Reshuffle deck" button | P0 |
| F-39 | Reshuffle deck | Tap "Reshuffle deck" after swiping all | Deck resets, can swipe again | P0 |
| F-40 | City filter | Tap city pill at top | Only cafes from that city shown | P0 |
| F-41 | City filter — no results | Select city with 0 matching cafes | "No cafes here yet" + "Nominate a cafe" button | P1 |
| F-42 | Vibe filter | Tap filter icon > select vibe | Only cafes with that vibe shown | P1 |
| F-43 | Trending filter | Tap "Trending" toggle | Only trending cafes shown | P2 |
| F-44 | Save/visited mutual exclusion | Save cafe, then swipe same cafe left | Moved from saved to visited (not in both) | P0 |
| F-45 | Card order stable | Swipe 3 cards, navigate away, return | Same deck order maintained | P1 |
| F-46 | No card flash | Swipe card, observe next card | No visual flash/jump when next card appears | P1 |

### 3.6 Discover — Browse/List Mode

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-47 | Toggle to list view | Tap list/browse toggle icon | Grid/list of all matching cafes appears | P0 |
| F-48 | Search by name | Type cafe name in search | Matching cafes shown | P0 |
| F-49 | Search by city | Type city name | Cafes in that city shown | P0 |
| F-50 | Search by neighborhood | Type neighborhood name | Matching cafes shown | P1 |
| F-51 | Search by Instagram | Type @handle | Matching cafe shown | P2 |
| F-52 | Search case insensitive | Type "SEATTLE" | Same results as "seattle" | P1 |
| F-53 | Clear search | Tap clear button on search | Full list restored | P1 |
| F-54 | Tap cafe in list | Tap a cafe card | Opens CafeDetailScreen | P0 |
| F-55 | Toggle back to swipe | Tap toggle icon again | Swipe card view returns | P1 |

### 3.7 Cafe Detail Screen

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-56 | Detail loads | Open any cafe detail | Name, city, neighborhood, rating, photo all display | P0 |
| F-57 | Curator notes | View cafe with notes | "What to order", "Best time", "Content tips" sections show | P0 |
| F-58 | Must-try drink | View cafe with must_try | Must-try drink + note displayed | P1 |
| F-59 | Vibe tags | View cafe with vibe_tags | Tags display with emoji + label (e.g. "Specialty Coffee") | P0 |
| F-60 | Save button | Tap save/bookmark on detail | Cafe added to "Want to Go" in My List | P0 |
| F-61 | Visited button | Tap visited/checkmark on detail | Cafe added to "Been There" | P0 |
| F-62 | Favorite/star | Tap star on detail | Cafe added to "Saved" favorites | P0 |
| F-63 | Instagram link | Tap @handle button | Opens Instagram for that handle | P1 |
| F-64 | Google Maps | Tap "Google Maps" button | Opens Google Maps with cafe location search | P0 |
| F-65 | Apple Maps | Tap "Apple Maps" button | Opens Apple Maps with cafe location | P1 |
| F-66 | No Instagram | View cafe without instagram_handle | Instagram button not shown | P2 |
| F-67 | Curator pick badge | View curator_pick cafe | Badge/indicator shown | P2 |
| F-68 | Press mention | View cafe with press_mention | Press mention text displayed | P2 |
| F-69 | Back navigation | Tap back from CafeDetail | Returns to originating screen (Discover, Feed, or My List) | P0 |

### 3.8 What's New Feed

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-70 | Feed loads | Tap Feed tab | "What's New" header + "The latest from the codex" subtitle | P0 |
| F-71 | Empty feed | (No posts in Supabase) | "Nothing new yet" empty state | P1 |
| F-72 | Cafe post card | View cafe-type post | Badge "JUST ADDED", hero image, title, subtitle, owner quote | P0 |
| F-73 | Cafe post CTA | Tap "View Cafe" on cafe post | Opens CafeDetail for linked cafe | P0 |
| F-74 | City post card | View city-type post | Badge "NEW CITY LIVE", city name, cafe count | P0 |
| F-75 | City post CTA | Tap "Explore [City]" on city post | Navigates to city view | P1 |
| F-76 | Recipe post card | View recipe-type post | Badge "SECRET RECIPE", ingredient list with bullet points | P0 |
| F-77 | Recipe ingredients | Check ingredient rendering | Each ingredient on own line with "◦" prefix | P1 |
| F-78 | Update post card | View update-type post | Badge "FROM PALLAVI", body text, no CTA | P0 |
| F-79 | Update no CTA | Verify update post | No "View Cafe", "Explore", or "Watch Now" button | P1 |
| F-80 | Interview post card | View interview-type post | Badge "INTERVIEW", title, subtitle, body | P0 |
| F-81 | Interview YouTube CTA | Interview with platform="youtube" | Shows "Watch Now" with play icon, opens YouTube link | P0 |
| F-82 | Interview Instagram CTA | Interview with platform="instagram" | Shows "Watch Now" with camera icon, opens Instagram link | P1 |
| F-83 | Relative timestamps | Check timestamp on recent post | Shows "just now", "5m ago", "3h ago", "2d ago", or "1w ago" | P1 |
| F-84 | Hero image | Post with image_url | 180px height image displays, full width | P1 |
| F-85 | No hero image | Post without image_url | No image section, text renders cleanly | P1 |
| F-86 | Pull-to-refresh | Pull down on feed | Refresh indicator, posts reload from Supabase | P0 |
| F-87 | Feed cache fallback | Load feed, go offline, reload | Shows cached posts | P1 |
| F-88 | Post ordering | Multiple posts | Sorted by published_at descending (newest first) | P0 |

### 3.9 My List

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-89 | Want to Go tab | Tap "Want to Go" tab | Shows all saved (right-swiped) cafes | P0 |
| F-90 | Been There tab | Tap "Been There" tab | Shows all visited (left-swiped) cafes | P0 |
| F-91 | Saved tab | Tap "Saved" tab | Shows all favorited/starred cafes | P0 |
| F-92 | Empty tab | View tab with no items | Empty state message shown | P1 |
| F-93 | Mark visited | In Want to Go, tap "Mark visited" | Cafe moves from Want to Go to Been There | P0 |
| F-94 | Move to want | In Been There, tap "Move to want" | Cafe moves from Been There to Want to Go | P0 |
| F-95 | Star/favorite | Tap star icon on any cafe | Cafe appears in Saved tab | P0 |
| F-96 | Unstar/unfavorite | Tap star again on favorited cafe | Cafe removed from Saved tab | P1 |
| F-97 | Search in My List | Type cafe name in search bar | Filters current tab's cafes | P1 |
| F-98 | City filter | Tap city pill in My List | Filters by city within current tab | P1 |
| F-99 | Group by city | No search/filter active | Cafes grouped under city headers | P2 |
| F-100 | Maps link | Tap "Maps" on a cafe | Opens Google Maps with cafe location | P1 |
| F-101 | Tap to detail | Tap a cafe in My List | Opens CafeDetail screen | P0 |
| F-102 | Persistence | Save cafes, kill app, reopen | All saves/visits/favorites intact | P0 |
| F-103 | Tab switch clears search | Search in Want to Go, switch to Been There | Search cleared, full list shows | P2 |

### 3.10 Author/Pallavi Screen

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-104 | Author photo | Open Author tab | Pallavi's photo displays in circular ring | P0 |
| F-105 | Name and handle | View header | "Pallavi Duggal" and "@honestcoffeestop" shown | P0 |
| F-106 | Social pills | Tap Instagram pill | Opens Instagram profile | P0 |
| F-107 | Social pills | Tap TikTok pill | Opens TikTok profile | P1 |
| F-108 | Social pills | Tap YouTube pill | Opens YouTube channel | P1 |
| F-109 | Letter eyebrow | View letter section | "a letter from the author" in italics | P2 |
| F-110 | Letter title | View letter section | "Why I Built Cafe Codex" displayed | P0 |
| F-111 | Story body | Scroll through story | Full letter text renders, readable | P0 |
| F-112 | Stats section | View stats | Cafe count, city count, country count shown | P1 |
| F-113 | World's Best collapse | Tap "World's Best Coffee 2026" | List expands showing 10 ranked cafes | P0 |
| F-114 | World's Best items | Expand list | Each item shows rank, name, location, flag, description | P1 |
| F-115 | World's Best source | View bottom of expanded list | Source link to theworlds100bestcoffeeshops.com | P2 |
| F-116 | Collapse toggle | Tap header again | List collapses | P1 |
| F-117 | Full scroll | Scroll entire Author page | All content accessible, no cut-off at bottom | P1 |

### 3.11 Nomination Form

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-118 | Form renders | Open Recommend tab | Header "Nominate a Cafe", all fields visible | P0 |
| F-119 | Required field indicators | Check labels | Cafe name, Country, City, What makes it honest, Must order, Your name show * | P1 |
| F-120 | Optional field indicators | Check labels | Neighborhood, Best time, @handle show "optional" | P2 |
| F-121 | Country dropdown — type | Type "Jap" | Dropdown shows "Japan" with flag | P0 |
| F-122 | Country dropdown — alias | Type "usa" | Dropdown shows "United States" with flag | P0 |
| F-123 | Country dropdown — select | Tap "Japan" in dropdown | Field fills "Japan", dropdown closes, city field focuses | P0 |
| F-124 | Country dropdown — clear | Tap clear (x) button | Country and City both cleared | P0 |
| F-125 | Country dropdown — max results | Type "a" | Max 6 results shown | P2 |
| F-126 | Country change clears city | Select Japan, type Tokyo, then change country to US | City field cleared when country changes | P0 |
| F-127 | City dropdown — with country | Select "United States", type "Sea" | Shows "Seattle" in dropdown | P0 |
| F-128 | City dropdown — without country | Type "Tok" without selecting country | Shows Tokyo from all cafes | P1 |
| F-129 | City dropdown — select | Tap "Seattle" | Field fills, dropdown closes | P0 |
| F-130 | City dropdown — free text | Type "Smalltown" (not in DB) | No dropdown, free text accepted | P1 |
| F-131 | City dropdown — clear | Tap clear (x) | City cleared | P1 |
| F-132 | Submit disabled | Leave required fields empty | Submit button grayed out (opacity 0.5), not tappable | P0 |
| F-133 | Submit — invalid country | Type bogus country, fill all fields | Alert: "Please select a valid country from the suggestions" | P0 |
| F-134 | Submit — exact typed country | Type "Japan" (exact match, no dropdown select) | Auto-confirms, submission proceeds | P1 |
| F-135 | Submit — valid | Fill all required fields with valid country | "Nomination sent!" success screen | P0 |
| F-136 | Success screen — card | After submit | Shows cafe name, location, nominator name in styled card | P0 |
| F-137 | Success screen — share | Tap "Share your nomination" | Share sheet opens with nomination text | P1 |
| F-138 | Success screen — nominate another | Tap "Nominate another" | Form resets to empty, ready for new nomination | P0 |
| F-139 | Telegram notification | Submit valid nomination | Pallavi receives formatted Telegram message | P0 |
| F-140 | Supabase insert | Submit valid nomination | Row appears in nominations table in Supabase | P1 |
| F-141 | Offline nomination | Disable network, submit | Alert: "Could not send nomination" with retry message | P1 |
| F-142 | Multiline field | Type long text in "What makes it honest" | Textarea expands, text wraps | P1 |
| F-143 | Instagram handle | Enter "@handle" with @ prefix | @ is not doubled in output (strip + re-add logic) | P2 |

### 3.12 Data & Caching

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-144 | Initial data load | First launch with network | Cafes + countries load from Supabase | P0 |
| F-145 | Cache on load | Load data, check AsyncStorage | Cafe data cached for offline use | P1 |
| F-146 | Offline fallback — cafes | Open app with no network | App loads from AsyncStorage cache, "cached" badge shown | P0 |
| F-147 | Offline fallback — feed | Open Feed tab offline | Shows cached posts (if previously loaded) | P1 |
| F-148 | Offline fallback — countries | Open Nomination form offline | Country dropdown works from cached data | P1 |
| F-149 | Data freshness | Add new cafe in Supabase, pull to refresh | New cafe appears in swipe deck | P1 |
| F-150 | 362+ cafes | Verify cafe count | All cafes from Supabase load and are swipeable | P1 |

### 3.13 Cross-Feature Integration

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-151 | Save in Discover, view in My List | Swipe right on cafe, go to My List | Cafe in "Want to Go" with correct details | P0 |
| F-152 | Detail from Feed vs Discover | Open same cafe from Feed and Discover | Same data displayed both times | P1 |
| F-153 | Nominate from empty deck | Swipe deck empty for city, tap "Nominate" | Recommend tab opens/nomination form shown | P1 |
| F-154 | Onboarding filters swipe | Set Coffee + Seattle in onboarding | Only Seattle coffee cafes appear in deck | P0 |
| F-155 | Vibe filter + city filter | Set city filter + vibe filter | Intersection of both filters applied | P1 |
| F-156 | Star from detail, check My List | Open cafe detail, tap star, go to My List > Saved | Cafe appears in favorites | P0 |
| F-157 | Full user journey | Signup > Onboarding > Swipe > Save > Detail > My List > Nominate | All screens work end-to-end | P0 |

### 3.14 Edge Cases & Boundary Testing

| # | Test Case | Steps | Expected | Priority |
|---|-----------|-------|----------|----------|
| F-158 | Empty cafe list | (Delete all cafes from Supabase) | Empty deck state, no crash | P2 |
| F-159 | Very long cafe name | View cafe with 100+ char name | Text wraps, no overflow/crash | P2 |
| F-160 | Special chars in nomination | Enter emojis/special chars in form | Saved correctly, Telegram formats properly | P2 |
| F-161 | Rapid tab switching | Tap tabs rapidly 10+ times | No crash, no duplicate renders | P1 |
| F-162 | Double-tap submit | Tap "Send to Pallavi" rapidly | Only one submission (button disables during submit) | P1 |
| F-163 | Network timeout | Slow network (>8s response) | Falls back to cache, no infinite loading | P1 |
| F-164 | Cafe with all null optionals | Cafe with no photo, no notes, no must_try | Detail renders without crash, shows available data only | P1 |
| F-165 | Multiple sessions | Login on 2 devices simultaneously | Both sessions work independently | P2 |

---

## Test Summary

| Stream | Total Test Cases |
|--------|-----------------|
| Android App Testing | 39 |
| iOS App Testing | 42 |
| Functional Testing | 165 |
| **Total** | **246** |

## Priority Guide

| Priority | Meaning | Test Before |
|----------|---------|-------------|
| P0 | Critical path, must pass | Every release |
| P1 | Important, high-impact | Every release |
| P2 | Nice to have, edge cases | Major releases |

## Test Data Required

| Data | Where | Notes |
|------|-------|-------|
| Valid user account | Supabase Auth | email: test@cafecodex.com |
| Admin user account | Supabase Auth + profiles | role = 'admin' |
| Seeded posts (all 5 types) | Supabase `posts` table | cafe, city, recipe, update, interview |
| 362+ cafes | Supabase `cafes` table | Already live |
| Countries with aliases | Supabase `countries` table | Already live |

## Environment Setup

```bash
# Start dev server
cd CafeCodex-main
npx expo start

# Run automated tests
npm test

# iOS: Scan QR with Camera app → opens in Expo Go
# Android: Scan QR with Expo Go app
```
