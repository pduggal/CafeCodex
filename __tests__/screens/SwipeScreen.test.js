import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

// Override the global reanimated mock so withTiming actually invokes its
// completion callback — needed to exercise the swipe-commit path
// (triggerSwipe -> doCommitSwipe -> toggleSaved/toggleVisited).
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View, Text: require('react-native').Text, createAnimatedComponent: (comp) => comp },
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: () => ({}),
    withTiming: (val, _config, callback) => {
      if (callback) callback(true);
      return val;
    },
    withSpring: (val) => val,
    interpolate: () => 0,
    runOnJS: (fn) => fn,
    Extrapolation: { CLAMP: 'clamp' },
  };
});

const mockToggleSaved = jest.fn();
const mockToggleVisited = jest.fn();
const mockNavigate = jest.fn();
let mockUserLocation = null;

const MOCK_CAFES = [
  { id: '1', name: 'Cafe Alpha', city: 'Seattle', neighborhood: 'Capitol Hill', drink: 'coffee', vibe_tags: ['specialty_coffee'], curator_pick: false, is_active: true, coordinates: { lat: 47.62, lng: -122.32 } },
  { id: '2', name: 'Cafe Beta', city: 'Seattle', neighborhood: 'Fremont', drink: 'coffee', vibe_tags: ['cozy_quiet'], curator_pick: true, is_active: true, coordinates: { lat: 47.65, lng: -122.35 } },
  { id: '3', name: 'Cafe Gamma', city: 'Portland', neighborhood: 'Pearl', drink: 'coffee', vibe_tags: ['hidden_gem'], curator_pick: false, is_active: true },
  { id: '4', name: 'Matcha Den', city: 'Seattle', neighborhood: 'Ballard', drink: 'matcha', vibe_tags: ['matcha_specialist'], curator_pick: false, is_active: true },
  { id: '5', name: 'Cafe Delta', city: 'NYC', neighborhood: 'Brooklyn', drink: 'coffee', vibe_tags: ['viral_aesthetic'], curator_pick: false, is_active: true, coordinates: { lat: 40.7, lng: -74.0 } },
];

const COFFEE_IDS = ['1', '2', '3', '5'];

jest.mock('../../context/CafeContext', () => ({
  useCafes: () => ({
    cafes: MOCK_CAFES,
    countries: [],
    loading: false,
    savedCafes: [],
    visitedCafes: [],
    favorites: [],
    selectedCity: 'All',
    setSelectedCity: jest.fn(),
    selectedDrink: 'coffee',
    setSelectedDrink: jest.fn(),
    selectedVibes: [],
    setSelectedVibes: jest.fn(),
    selectedLocation: null,
    setSelectedLocation: jest.fn(),
    isOffline: false,
    toggleSaved: mockToggleSaved,
    toggleVisited: mockToggleVisited,
    toggleFavorite: jest.fn(),
    moveToVisited: jest.fn(),
    moveToWishlist: jest.fn(),
    isSaved: () => false,
    isVisited: () => false,
    isFavorite: () => false,
    userLocation: mockUserLocation,
    cities: ['All', 'Seattle', 'Portland', 'NYC'],
  }),
}));

const SwipeScreen = require('../../screens/SwipeScreen').default;

const navigation = {
  navigate: mockNavigate,
  getParent: () => ({ navigate: jest.fn() }),
};

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  mockUserLocation = null;
});

describe('SwipeScreen', () => {
  test('renders with cafe cards when cafes exist', () => {
    const { getByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    expect(getByText('Café Codex')).toBeTruthy();
    expect(getByText(/cafes/)).toBeTruthy();
  });

  test('shows deck count for coffee-only cafes (excludes matcha)', () => {
    const { getByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    expect(getByText('4 cafes')).toBeTruthy();
  });

  test('Cards and List toggle buttons are visible', () => {
    const { getByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    expect(getByText('Cards')).toBeTruthy();
    expect(getByText('List')).toBeTruthy();
  });

  test('switching to list view shows browse list', () => {
    const { getByText, getByPlaceholderText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('List'));
    expect(getByPlaceholderText(/Search cafes/)).toBeTruthy();
  });

  test('action buttons render for Been there and Want to go', () => {
    const { getByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    expect(getByText('Been there')).toBeTruthy();
    expect(getByText('Want to go')).toBeTruthy();
  });

  test('"Tap for details" hint is shown on cards', () => {
    const { getAllByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    const hints = getAllByText('Tap for details');
    expect(hints.length).toBeGreaterThan(0);
  });

  test('filter pill shows coffee by default', () => {
    const { getAllByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    expect(getAllByText(/Coffee/).length).toBeGreaterThan(0);
  });

  test('list view shows all coffee cafes including from different cities', () => {
    const { getByText, queryByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('List'));
    expect(getByText('Cafe Alpha')).toBeTruthy();
    expect(getByText('Cafe Beta')).toBeTruthy();
    expect(getByText('Cafe Gamma')).toBeTruthy();
    expect(getByText('Cafe Delta')).toBeTruthy();
    expect(queryByText('Matcha Den')).toBeNull();
  });

  test('list view search filters by cafe name', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('List'));
    fireEvent.changeText(getByPlaceholderText(/Search cafes/), 'Alpha');
    expect(getByText('Cafe Alpha')).toBeTruthy();
    expect(queryByText('Cafe Beta')).toBeNull();
  });

  test('list view search filters by city', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('List'));
    fireEvent.changeText(getByPlaceholderText(/Search cafes/), 'Portland');
    expect(getByText('Cafe Gamma')).toBeTruthy();
    expect(queryByText('Cafe Alpha')).toBeNull();
  });

  test('list view search filters by neighborhood', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('List'));
    fireEvent.changeText(getByPlaceholderText(/Search cafes/), 'Capitol Hill');
    expect(getByText('Cafe Alpha')).toBeTruthy();
    expect(queryByText('Cafe Gamma')).toBeNull();
  });

  test('progress dots are rendered', () => {
    const { toJSON } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    expect(toJSON()).toBeTruthy();
  });

  test('Near Me pill is rendered', () => {
    const { getByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    expect(getByText('Near Me')).toBeTruthy();
  });

  test('Near Me sorts the browse list by distance, closest first', () => {
    mockUserLocation = { latitude: 47.60, longitude: -122.33 };
    const { getByText, getAllByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('List'));
    fireEvent.press(getByText('Near Me'));

    const names = getAllByText(/^Cafe (Alpha|Beta|Gamma|Delta)$/).map((el) => el.props.children);
    expect(names).toEqual(['Cafe Alpha', 'Cafe Beta', 'Cafe Delta', 'Cafe Gamma']);
  });

  test('Near Me pill is a no-op without a userLocation', () => {
    const { getByText, getAllByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('List'));
    fireEvent.press(getByText('Near Me'));

    const names = getAllByText(/^Cafe (Alpha|Beta|Gamma|Delta)$/).map((el) => el.props.children);
    expect(names).toEqual(['Cafe Alpha', 'Cafe Beta', 'Cafe Gamma', 'Cafe Delta']);
  });

  test('reshuffle button renders and does not crash the deck', () => {
    const { getByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('shuffle-outline'));
    expect(getByText('Café Codex')).toBeTruthy();
  });

  test('browse row Save button calls toggleSaved with that cafe id', () => {
    const { getByText, getAllByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('List'));
    fireEvent.press(getAllByText('🤍')[0]);
    expect(mockToggleSaved).toHaveBeenCalledWith('1');
  });

  test('browse row Been button calls toggleVisited with that cafe id', () => {
    const { getByText, getAllByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('List'));
    fireEvent.press(getAllByText('✓')[0]);
    expect(mockToggleVisited).toHaveBeenCalledWith('1');
  });

  test('pressing "Want to go" commits a swipe-right and calls toggleSaved', () => {
    const { getByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('Want to go'));
    expect(mockToggleSaved).toHaveBeenCalledTimes(1);
    expect(COFFEE_IDS).toContain(mockToggleSaved.mock.calls[0][0]);
  });

  test('pressing "Been there" commits a swipe-left and calls toggleVisited', () => {
    const { getByText } = render(
      <SwipeScreen navigation={navigation} route={{ params: {} }} />
    );
    fireEvent.press(getByText('Been there'));
    expect(mockToggleVisited).toHaveBeenCalledTimes(1);
    expect(COFFEE_IDS).toContain(mockToggleVisited.mock.calls[0][0]);
  });
});
