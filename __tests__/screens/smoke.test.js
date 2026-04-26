import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

jest.mock('../../context/CafeContext', () => ({
  useCafes: () => ({
    cafes: [],
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
    toggleSaved: jest.fn(),
    toggleVisited: jest.fn(),
    toggleFavorite: jest.fn(),
    moveToVisited: jest.fn(),
    moveToWishlist: jest.fn(),
    isSaved: () => false,
    isVisited: () => false,
    isFavorite: () => false,
    cities: ['All'],
  }),
}));

describe('Screen smoke tests', () => {
  test('OnboardingScreen renders without crash', () => {
    const OnboardingScreen = require('../../screens/OnboardingScreen').default;
    const { getByText } = render(<OnboardingScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByText).toBeTruthy();
  });

  test('SwipeScreen renders without crash', () => {
    const SwipeScreen = require('../../screens/SwipeScreen').default;
    const { toJSON } = render(
      <SwipeScreen navigation={{ navigate: jest.fn() }} route={{ params: {} }} />
    );
    expect(toJSON()).toBeTruthy();
  });

  test('CafeDetailScreen renders without crash', () => {
    const CafeDetailScreen = require('../../screens/CafeDetailScreen').default;
    const mockCafe = {
      id: '1', name: 'Smoke Cafe', city: 'NYC', drink: 'coffee',
      vibe_tags: [], curator_notes: {}, must_try: null,
    };
    const { toJSON } = render(
      <CafeDetailScreen route={{ params: { cafe: mockCafe } }} navigation={{ goBack: jest.fn() }} />
    );
    expect(toJSON()).toBeTruthy();
  });

  test('MyListScreen renders without crash', () => {
    const MyListScreen = require('../../screens/MyListScreen').default;
    const { toJSON } = render(
      <MyListScreen navigation={{ navigate: jest.fn() }} />
    );
    expect(toJSON()).toBeTruthy();
  });
});
