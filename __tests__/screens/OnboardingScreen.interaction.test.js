import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OnboardingScreen from '../../screens/OnboardingScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockSavePreferences = jest.fn();

const MOCK_CAFES = [
  { id: '1', name: 'Onibus Coffee', city: 'Tokyo', country: 'Japan', neighborhood: 'Nakameguro', is_active: true },
  { id: '2', name: 'Elm Coffee', city: 'Seattle', country: 'United States', neighborhood: 'Pioneer Square', is_active: true },
  { id: '3', name: 'Blue Bottle', city: 'Kyoto', country: 'Japan', neighborhood: 'Higashiyama', is_active: true },
];

const MOCK_COUNTRIES = [
  { name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', aliases: ['japan', 'jp'], cities: ['Tokyo', 'Kyoto'], planned_cities: ['Osaka'] },
  { name: 'United States', flag: '\u{1F1FA}\u{1F1F8}', aliases: ['usa', 'us', 'america'], cities: ['Seattle', 'New York'] },
  { name: 'France', flag: '\u{1F1EB}\u{1F1F7}', aliases: ['france', 'fr'], cities: [], planned_cities: ['Paris'], message: 'France coming soon!' },
];

jest.mock('../../context/CafeContext', () => ({
  useCafes: () => ({
    cafes: MOCK_CAFES,
    countries: MOCK_COUNTRIES,
    hasOnboarded: false,
    savePreferences: mockSavePreferences,
    selectedDrink: null,
    selectedVibes: [],
    selectedLocation: null,
  }),
}));

const defaultProps = {
  navigation: { navigate: mockNavigate, replace: mockReplace },
  route: { params: {} },
};

describe('OnboardingScreen — Step 1: Drink & Location', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockReplace.mockClear();
    mockSavePreferences.mockClear();
  });

  test('renders step 1 with drink selection', () => {
    const { getByText } = render(<OnboardingScreen {...defaultProps} />);
    expect(getByText('What are you in the mood for?')).toBeTruthy();
    expect(getByText('Coffee')).toBeTruthy();
    expect(getByText('Matcha')).toBeTruthy();
  });

  test('Coffee is default selection', () => {
    const { getByText } = render(<OnboardingScreen {...defaultProps} />);
    expect(getByText('Pour-overs, espresso, lattes')).toBeTruthy();
  });

  test('can switch to Matcha', () => {
    const { getByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.press(getByText('Matcha'));
    expect(getByText('Ceremonial bowls, hojicha')).toBeTruthy();
  });

  test('Find cafes button advances to step 2', () => {
    const { getByText, queryByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.press(getByText('Find cafes →'));
    expect(getByText('What kind of place?')).toBeTruthy();
    expect(queryByText('What are you in the mood for?')).toBeNull();
  });

  test('location search shows results for valid city', () => {
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search city or country…'), 'Tokyo');
    expect(getByText('Tokyo, Japan')).toBeTruthy();
  });

  test('location search shows In the Codex for visited city', () => {
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search city or country…'), 'Tokyo');
    expect(getByText('✓ In the Codex')).toBeTruthy();
  });

  test('location search shows Not explored for unvisited country', () => {
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search city or country…'), 'France');
    expect(getByText('✦ Not explored yet — nominate a café')).toBeTruthy();
  });

  test('selecting visited city shows location badge', () => {
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search city or country…'), 'Tokyo');
    fireEvent.press(getByText('Tokyo, Japan'));
    expect(getByText(/Tokyo, Japan/)).toBeTruthy();
  });

  test('selecting unvisited country shows nominate prompt', () => {
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search city or country…'), 'France');
    fireEvent.press(getByText('France'));
    expect(getByText("France isn't in the Codex yet")).toBeTruthy();
    expect(getByText('✦ Nominate a café there')).toBeTruthy();
  });

  test('nominate button navigates to Recommend', () => {
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search city or country…'), 'France');
    fireEvent.press(getByText('France'));
    fireEvent.press(getByText('✦ Nominate a café there'));
    expect(mockNavigate).toHaveBeenCalledWith('Recommend');
  });

  test('clear button removes location', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search city or country…'), 'To');
    const clearBtn = getByText('✕');
    fireEvent.press(clearBtn);
    expect(queryByText('Tokyo, Japan')).toBeNull();
  });

  test('location search matches by country alias', () => {
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search city or country…'), 'usa');
    expect(getByText('United States')).toBeTruthy();
  });

  test('short queries (< 2 chars) show no results', () => {
    const { getByPlaceholderText, queryByText } = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Search city or country…'), 'T');
    expect(queryByText('Tokyo, Japan')).toBeNull();
  });
});

describe('OnboardingScreen — Step 2: Vibes', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSavePreferences.mockClear();
  });

  function goToStep2(rendered) {
    fireEvent.press(rendered.getByText('Find cafes →'));
  }

  test('renders all four vibe options', () => {
    const rendered = render(<OnboardingScreen {...defaultProps} />);
    goToStep2(rendered);
    expect(rendered.getByText('Trending')).toBeTruthy();
    expect(rendered.getByText("Pallavi's Picks")).toBeTruthy();
    expect(rendered.getByText('Aesthetic')).toBeTruthy();
    expect(rendered.getByText('Hidden Gems')).toBeTruthy();
  });

  test('can toggle vibes on and off', () => {
    const rendered = render(<OnboardingScreen {...defaultProps} />);
    goToStep2(rendered);
    fireEvent.press(rendered.getByText('Trending'));
    fireEvent.press(rendered.getByText('Aesthetic'));
    expect(rendered.getByText('Trending')).toBeTruthy();
    expect(rendered.getByText('Aesthetic')).toBeTruthy();
  });

  test('Show me cafes calls savePreferences and navigates', () => {
    const rendered = render(<OnboardingScreen {...defaultProps} />);
    goToStep2(rendered);
    fireEvent.press(rendered.getByText('Aesthetic'));
    fireEvent.press(rendered.getByText('Show me cafes →'));
    expect(mockSavePreferences).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('SwipeHome');
  });

  test('Change my drink goes back to step 1', () => {
    const rendered = render(<OnboardingScreen {...defaultProps} />);
    goToStep2(rendered);
    fireEvent.press(rendered.getByText('← Change my drink'));
    expect(rendered.getByText('What are you in the mood for?')).toBeTruthy();
  });

  test('step 2 shows selected drink context', () => {
    const rendered = render(<OnboardingScreen {...defaultProps} />);
    goToStep2(rendered);
    expect(rendered.getByText('☕ Coffee')).toBeTruthy();
  });

  test('switching to matcha shows in step 2 context', () => {
    const rendered = render(<OnboardingScreen {...defaultProps} />);
    fireEvent.press(rendered.getByText('Matcha'));
    goToStep2(rendered);
    expect(rendered.getByText('🍵 Matcha')).toBeTruthy();
  });
});
