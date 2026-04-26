import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AuthorScreen from '../../screens/AuthorScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

describe('AuthorScreen', () => {
  test('renders without crash', () => {
    const { getByText } = render(<AuthorScreen />);
    expect(getByText('Pallavi Duggal')).toBeTruthy();
  });

  test('shows real author photo via Image component (not placeholder text)', () => {
    const fs = require('fs');
    const path = require('path');
    const src = fs.readFileSync(
      path.join(__dirname, '../../screens/AuthorScreen.js'),
      'utf-8'
    );
    expect(src).toContain("require('../assets/author.jpg')");
    expect(src).not.toMatch(/style={styles\.photoPlaceholder}/);
  });

  test('shows stats: 7+, 50+, and infinity symbols', () => {
    const { getByText, getAllByText } = render(<AuthorScreen />);
    expect(getByText('7+')).toBeTruthy();
    expect(getByText('50+')).toBeTruthy();
    expect(getAllByText('∞').length).toBe(2);
  });

  test('World Best section opens to show 10 entries including Onyx and Tanat', () => {
    const { getByText, queryByText } = render(<AuthorScreen />);

    expect(queryByText('Onyx Coffee Lab')).toBeNull();

    const toggle = getByText(/World's Best Coffee Shops/);
    fireEvent.press(toggle);

    expect(getByText('Onyx Coffee Lab')).toBeTruthy();
    expect(getByText('Tanat')).toBeTruthy();

    const ranks = [];
    for (let i = 1; i <= 10; i++) {
      try { getByText(String(i)); ranks.push(i); } catch {}
    }
    expect(ranks.length).toBe(10);
  });
});
