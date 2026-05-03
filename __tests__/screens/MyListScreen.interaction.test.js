import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyListScreen from '../../screens/MyListScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

const mockNavigate = jest.fn();
const mockToggleFavorite = jest.fn();
const mockMoveToVisited = jest.fn();
const mockMoveToWishlist = jest.fn();

const MOCK_CAFES = [
  { id: '1', name: 'Onibus Coffee', city: 'Tokyo', country: 'Japan', neighborhood: 'Nakameguro', photo_url: null, vibe_tags: [] },
  { id: '2', name: 'Elm Coffee', city: 'Seattle', country: 'United States', neighborhood: 'Pioneer Square', photo_url: null, vibe_tags: [] },
  { id: '3', name: 'Blue Bottle', city: 'Tokyo', country: 'Japan', neighborhood: 'Aoyama', photo_url: null, vibe_tags: [] },
  { id: '4', name: 'Stumptown', city: 'Portland', country: 'United States', neighborhood: null, photo_url: null, vibe_tags: [] },
];

let mockSavedCafes = ['1', '2'];
let mockVisitedCafes = ['3'];
let mockFavorites = ['1'];

jest.mock('../../context/CafeContext', () => ({
  useCafes: () => ({
    cafes: MOCK_CAFES,
    savedCafes: mockSavedCafes,
    visitedCafes: mockVisitedCafes,
    favorites: mockFavorites,
    toggleFavorite: mockToggleFavorite,
    moveToVisited: mockMoveToVisited,
    moveToWishlist: mockMoveToWishlist,
    isFavorite: (id) => mockFavorites.includes(id),
  }),
}));

jest.mock('../../data/cafes', () => ({
  VIBE_TAGS: {},
  getCafePhoto: () => 'https://example.com/photo.jpg',
}));

describe('MyListScreen — Tab Switching', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockToggleFavorite.mockClear();
    mockMoveToVisited.mockClear();
    mockMoveToWishlist.mockClear();
  });

  test('renders header and tabs', () => {
    const { getByText, getAllByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    expect(getByText('My List')).toBeTruthy();
    expect(getByText('❤️ Want to Go')).toBeTruthy();
    expect(getByText('✓ Been There')).toBeTruthy();
    const savedElements = getAllByText('⭐ Saved');
    expect(savedElements.length).toBeGreaterThanOrEqual(1);
  });

  test('Want to Go tab shows saved cafes by default', () => {
    const { getByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    expect(getByText('Onibus Coffee')).toBeTruthy();
    expect(getByText('Elm Coffee')).toBeTruthy();
  });

  test('switching to Been There tab shows visited cafes', () => {
    const { getByText, queryByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    fireEvent.press(getByText('✓ Been There'));
    expect(getByText('Blue Bottle')).toBeTruthy();
    expect(queryByText('Elm Coffee')).toBeNull();
  });

  test('switching to Saved tab shows favorites', () => {
    const { getAllByText, getByText, queryByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    const savedTabs = getAllByText('⭐ Saved');
    fireEvent.press(savedTabs[0]);
    expect(getByText('Onibus Coffee')).toBeTruthy();
    expect(queryByText('Elm Coffee')).toBeNull();
  });
});

describe('MyListScreen — Actions', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockToggleFavorite.mockClear();
    mockMoveToVisited.mockClear();
    mockMoveToWishlist.mockClear();
  });

  test('Mark visited button appears in Want to Go tab', () => {
    const { getAllByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    const markBtns = getAllByText('✓ Mark visited');
    expect(markBtns.length).toBeGreaterThan(0);
  });

  test('pressing Mark visited calls moveToVisited', () => {
    const { getAllByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    const markBtns = getAllByText('✓ Mark visited');
    fireEvent.press(markBtns[0]);
    expect(mockMoveToVisited).toHaveBeenCalled();
  });

  test('Move to want button appears in Been There tab', () => {
    const { getByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    fireEvent.press(getByText('✓ Been There'));
    expect(getByText('❤️ Move to want')).toBeTruthy();
  });

  test('pressing Move to want calls moveToWishlist', () => {
    const { getByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    fireEvent.press(getByText('✓ Been There'));
    fireEvent.press(getByText('❤️ Move to want'));
    expect(mockMoveToWishlist).toHaveBeenCalledWith('3');
  });

  test('Save/Unsave toggle calls toggleFavorite', () => {
    const { getByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    fireEvent.press(getByText('☆ Save'));
    expect(mockToggleFavorite).toHaveBeenCalled();
  });

  test('Maps button is rendered for each cafe', () => {
    const { getAllByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    const mapBtns = getAllByText('📍 Maps');
    expect(mapBtns.length).toBe(2);
  });
});

describe('MyListScreen — Search', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('search filters cafes by name', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <MyListScreen navigation={{ navigate: mockNavigate }} />
    );
    fireEvent.changeText(getByPlaceholderText('Search cafes, cities, neighborhoods…'), 'Onibus');
    expect(getByText('Onibus Coffee')).toBeTruthy();
    expect(queryByText('Elm Coffee')).toBeNull();
  });

  test('search filters by city', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <MyListScreen navigation={{ navigate: mockNavigate }} />
    );
    fireEvent.changeText(getByPlaceholderText('Search cafes, cities, neighborhoods…'), 'Seattle');
    expect(getByText('Elm Coffee')).toBeTruthy();
    expect(queryByText('Onibus Coffee')).toBeNull();
  });

  test('search filters by neighborhood', () => {
    const { getByPlaceholderText, getByText } = render(
      <MyListScreen navigation={{ navigate: mockNavigate }} />
    );
    fireEvent.changeText(getByPlaceholderText('Search cafes, cities, neighborhoods…'), 'Nakameguro');
    expect(getByText('Onibus Coffee')).toBeTruthy();
  });
});

describe('MyListScreen — Empty State', () => {
  test('shows empty message for tab with no cafes', () => {
    mockSavedCafes = [];
    mockVisitedCafes = [];
    mockFavorites = [];
    const { getByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    expect(getByText('No cafes saved yet')).toBeTruthy();
    expect(getByText('Swipe right on cafes to add them here')).toBeTruthy();
    mockSavedCafes = ['1', '2'];
    mockVisitedCafes = ['3'];
    mockFavorites = ['1'];
  });
});

describe('MyListScreen — Navigation', () => {
  test('tapping a cafe card navigates to CafeDetail', () => {
    const { getByText } = render(<MyListScreen navigation={{ navigate: mockNavigate }} />);
    fireEvent.press(getByText('Onibus Coffee'));
    expect(mockNavigate).toHaveBeenCalledWith('CafeDetail', { cafe: MOCK_CAFES[0] });
  });
});
