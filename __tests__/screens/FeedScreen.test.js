import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import FeedScreen from '../../screens/FeedScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

jest.mock('../../context/CafeContext', () => ({
  useCafes: () => ({ cafes: [] }),
}));

const mockNavigation = { navigate: jest.fn() };

describe('FeedScreen', () => {
  test('renders What\'s New header', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText("What's New")).toBeTruthy();
    });
  });

  test('shows empty state when no posts', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Nothing new yet')).toBeTruthy();
    });
  });

  test('shows subtitle text', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('The latest from the codex')).toBeTruthy();
    });
  });
});
