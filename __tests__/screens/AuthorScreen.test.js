import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import AuthorScreen from '../../screens/AuthorScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

const mockSignOut = jest.fn(() => Promise.resolve());
const mockDeleteAccount = jest.fn(() => Promise.resolve({ error: null }));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    signOut: mockSignOut,
    deleteAccount: mockDeleteAccount,
    user: { email: 'pallavi@test.com' },
  }),
}));

jest.spyOn(Alert, 'alert');

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
    expect(src).toContain("require('../assets/author.png')");
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

describe('AuthorScreen — account actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows the logged-in user email', () => {
    const { getByText } = render(<AuthorScreen />);
    expect(getByText('pallavi@test.com')).toBeTruthy();
  });

  test('pressing Sign Out calls signOut', async () => {
    const { getByText } = render(<AuthorScreen />);
    await act(async () => { fireEvent.press(getByText('Sign Out')); });
    expect(mockSignOut).toHaveBeenCalled();
  });

  test('pressing Delete Account shows a confirmation alert', () => {
    const { getByText } = render(<AuthorScreen />);
    fireEvent.press(getByText('Delete Account'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Account',
      'This will permanently delete your account and all your data. This action cannot be undone.',
      expect.any(Array)
    );
  });

  test('confirming the delete alert calls deleteAccount', async () => {
    const { getByText } = render(<AuthorScreen />);
    fireEvent.press(getByText('Delete Account'));
    const buttons = Alert.alert.mock.calls[Alert.alert.mock.calls.length - 1][2];
    const deleteBtn = buttons.find((b) => b.text === 'Delete');
    await act(async () => { await deleteBtn.onPress(); });
    expect(mockDeleteAccount).toHaveBeenCalled();
  });

  test('shows an error alert when deleteAccount fails', async () => {
    mockDeleteAccount.mockResolvedValueOnce({ error: { message: 'Boom' } });
    const { getByText } = render(<AuthorScreen />);
    fireEvent.press(getByText('Delete Account'));
    const buttons = Alert.alert.mock.calls[Alert.alert.mock.calls.length - 1][2];
    const deleteBtn = buttons.find((b) => b.text === 'Delete');
    await act(async () => { await deleteBtn.onPress(); });
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Boom');
  });

  test('cancel button does not call deleteAccount', () => {
    const { getByText } = render(<AuthorScreen />);
    fireEvent.press(getByText('Delete Account'));
    const buttons = Alert.alert.mock.calls[Alert.alert.mock.calls.length - 1][2];
    const cancelBtn = buttons.find((b) => b.text === 'Cancel');
    expect(cancelBtn.onPress).toBeUndefined();
    expect(mockDeleteAccount).not.toHaveBeenCalled();
  });
});
