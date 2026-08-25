import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default
);

let mockAuthLoading = true;
let mockCafeLoading = true;
let mockSession = null;

jest.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    session: mockSession,
    loading: mockAuthLoading,
    user: mockSession?.user ?? null,
    profile: null,
    isAdmin: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    deleteAccount: jest.fn(),
  }),
}));

jest.mock('../context/CafeContext', () => ({
  CafeProvider: ({ children }) => children,
  useCafes: () => ({
    cafes: [],
    countries: [],
    loading: mockCafeLoading,
    isOffline: false,
    userLocation: null,
    savedCafes: [],
    visitedCafes: [],
    favorites: [],
    selectedDrink: 'coffee',
    setSelectedDrink: jest.fn(),
    selectedVibes: [],
    setSelectedVibes: jest.fn(),
    selectedLocation: null,
    setSelectedLocation: jest.fn(),
    hasOnboarded: true,
    savePreferences: jest.fn(),
    resetOnboarding: jest.fn(),
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

afterEach(() => {
  mockAuthLoading = true;
  mockCafeLoading = true;
  mockSession = null;
});

describe('App — auth gate', () => {
  test('shows the LoadingScreen while auth is loading', () => {
    mockAuthLoading = true;
    mockCafeLoading = false;
    const { getByText } = render(<App />);
    expect(getByText('Café Codex')).toBeTruthy();
    expect(
      getByText(/Finding the best cups|Curating your list|Checking Pallavi's picks|Almost ready/)
    ).toBeTruthy();
  });

  test('shows the LoadingScreen while cafes are loading', () => {
    mockAuthLoading = false;
    mockCafeLoading = true;
    const { getByText } = render(<App />);
    expect(getByText('Café Codex')).toBeTruthy();
  });

  test('shows the login screen when there is no session', () => {
    mockAuthLoading = false;
    mockCafeLoading = false;
    mockSession = null;
    const { getByPlaceholderText } = render(<App />);
    expect(getByPlaceholderText('you@email.com')).toBeTruthy();
  });

  test('shows the tab navigator when a session exists', () => {
    mockAuthLoading = false;
    mockCafeLoading = false;
    mockSession = { user: { id: 'user-1', email: 'a@b.com' } };
    const { getByText } = render(<App />);
    expect(getByText('Discover')).toBeTruthy();
    expect(getByText('Feed')).toBeTruthy();
    expect(getByText('Author')).toBeTruthy();
    expect(getByText('My List')).toBeTruthy();
    expect(getByText('Recommend')).toBeTruthy();
  });
});
