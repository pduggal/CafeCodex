import React from 'react';
import { Linking } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import CafeDetailScreen from '../../screens/CafeDetailScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

const mockToggleFavorite = jest.fn();
const mockToggleVisited = jest.fn();
const mockIsFavorite = jest.fn(() => false);
const mockIsVisited = jest.fn(() => false);
let mockUserLocation = null;

jest.mock('../../context/CafeContext', () => ({
  useCafes: () => ({
    isSaved: () => false,
    toggleSaved: jest.fn(),
    isVisited: mockIsVisited,
    toggleVisited: mockToggleVisited,
    isFavorite: mockIsFavorite,
    toggleFavorite: mockToggleFavorite,
    userLocation: mockUserLocation,
  }),
}));

const BASE_CAFE = {
  id: 'cafe-1',
  name: 'Test Cafe',
  city: 'Seattle',
  country: 'United States',
  neighborhood: 'Capitol Hill',
  drink: 'coffee',
  vibe_tags: ['specialty_coffee'],
  curator_notes: {},
  must_try: null,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUserLocation = null;
  jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
});

describe('CafeDetailScreen — not found', () => {
  test('shows "Cafe not found" and goes back when no cafe param is given', () => {
    const goBack = jest.fn();
    const { getByText } = render(
      <CafeDetailScreen route={{ params: {} }} navigation={{ goBack }} />
    );
    expect(getByText('Cafe not found')).toBeTruthy();
    fireEvent.press(getByText('← Go back'));
    expect(goBack).toHaveBeenCalled();
  });
});

describe('CafeDetailScreen — save / visit toggles', () => {
  test('pressing Save calls toggleFavorite with the cafe id', () => {
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe: BASE_CAFE } }} navigation={{ goBack: jest.fn() }} />
    );
    fireEvent.press(getByText('Save'));
    expect(mockToggleFavorite).toHaveBeenCalledWith('cafe-1');
  });

  test('shows "Saved" label when isFavorite is true', () => {
    mockIsFavorite.mockReturnValue(true);
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe: BASE_CAFE } }} navigation={{ goBack: jest.fn() }} />
    );
    expect(getByText('Saved')).toBeTruthy();
  });

  test('pressing Mark Visited calls toggleVisited with the cafe id', () => {
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe: BASE_CAFE } }} navigation={{ goBack: jest.fn() }} />
    );
    fireEvent.press(getByText('Mark Visited'));
    expect(mockToggleVisited).toHaveBeenCalledWith('cafe-1');
  });

  test('shows "Visited" label when isVisited is true', () => {
    mockIsVisited.mockReturnValue(true);
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe: BASE_CAFE } }} navigation={{ goBack: jest.fn() }} />
    );
    expect(getByText('Visited')).toBeTruthy();
  });
});

describe('CafeDetailScreen — Instagram link', () => {
  test('opens instagram URL when handle is present', () => {
    const cafe = { ...BASE_CAFE, instagram_handle: 'testcafe' };
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe } }} navigation={{ goBack: jest.fn() }} />
    );
    fireEvent.press(getByText('@testcafe'));
    expect(Linking.openURL).toHaveBeenCalledWith('https://instagram.com/testcafe');
  });

  test('does not render an instagram button when handle is absent', () => {
    const { queryByText } = render(
      <CafeDetailScreen route={{ params: { cafe: BASE_CAFE } }} navigation={{ goBack: jest.fn() }} />
    );
    expect(queryByText(/^@/)).toBeNull();
  });
});

describe('CafeDetailScreen — directions', () => {
  test('Google Maps uses coordinates when available', () => {
    const cafe = { ...BASE_CAFE, coordinates: { lat: 47.6, lng: -122.3 } };
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe } }} navigation={{ goBack: jest.fn() }} />
    );
    fireEvent.press(getByText('Google Maps'));
    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://www.google.com/maps/dir/?api=1&destination=47.6,-122.3'
    );
  });

  test('Google Maps falls back to a name/city search when coordinates are missing', () => {
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe: BASE_CAFE } }} navigation={{ goBack: jest.fn() }} />
    );
    fireEvent.press(getByText('Google Maps'));
    expect(Linking.openURL).toHaveBeenCalledWith(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Test Cafe Seattle')}`
    );
  });

  test('Apple Maps uses coordinates when available', () => {
    const cafe = { ...BASE_CAFE, coordinates: { lat: 47.6, lng: -122.3 } };
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe } }} navigation={{ goBack: jest.fn() }} />
    );
    fireEvent.press(getByText('Apple Maps'));
    expect(Linking.openURL).toHaveBeenCalledWith('maps://?daddr=47.6,-122.3');
  });

  test('Apple Maps falls back to a name/city search when coordinates are missing', () => {
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe: BASE_CAFE } }} navigation={{ goBack: jest.fn() }} />
    );
    fireEvent.press(getByText('Apple Maps'));
    expect(Linking.openURL).toHaveBeenCalledWith(
      `maps://?q=${encodeURIComponent('Test Cafe Seattle')}`
    );
  });
});

describe('CafeDetailScreen — distance', () => {
  test('shows formatted distance when userLocation and cafe coordinates are present', () => {
    mockUserLocation = { latitude: 47.61, longitude: -122.33 };
    const cafe = { ...BASE_CAFE, coordinates: { lat: 47.6, lng: -122.3 } };
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe } }} navigation={{ goBack: jest.fn() }} />
    );
    expect(getByText(/mi away/)).toBeTruthy();
  });

  test('shows no distance when userLocation is unavailable', () => {
    const cafe = { ...BASE_CAFE, coordinates: { lat: 47.6, lng: -122.3 } };
    const { queryByText } = render(
      <CafeDetailScreen route={{ params: { cafe } }} navigation={{ goBack: jest.fn() }} />
    );
    expect(queryByText(/away/)).toBeNull();
  });
});

describe('CafeDetailScreen — badges and content', () => {
  test('shows curator pick badge', () => {
    const cafe = { ...BASE_CAFE, curator_pick: true };
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe } }} navigation={{ goBack: jest.fn() }} />
    );
    expect(getByText("✦ Pallavi's Pick")).toBeTruthy();
  });

  test('shows permanently closed badge when is_active is false', () => {
    const cafe = { ...BASE_CAFE, is_active: false };
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe } }} navigation={{ goBack: jest.fn() }} />
    );
    expect(getByText('⚠ Permanently Closed')).toBeTruthy();
  });

  test('shows must-try section when present', () => {
    const cafe = { ...BASE_CAFE, must_try: { drink: 'Oat Latte', note: 'Ask for it iced' } };
    const { getByText } = render(
      <CafeDetailScreen route={{ params: { cafe } }} navigation={{ goBack: jest.fn() }} />
    );
    expect(getByText('Oat Latte')).toBeTruthy();
    expect(getByText('Ask for it iced')).toBeTruthy();
  });
});
