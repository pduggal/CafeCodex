import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/LoginScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

const mockSignIn = jest.fn(() => Promise.resolve({ data: {}, error: null }));
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ signIn: mockSignIn }),
}));

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LoginScreen', () => {
  test('renders email and password fields', () => {
    const { getByPlaceholderText } = render(<LoginScreen navigation={navigation} />);
    expect(getByPlaceholderText('you@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Your password')).toBeTruthy();
  });

  test('renders sign in button', () => {
    const { getByTestId } = render(<LoginScreen navigation={navigation} />);
    expect(getByTestId('login-button')).toBeTruthy();
  });

  test('shows error when email is empty', async () => {
    const { getByText, getByTestId } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByTestId('login-button'));
    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  test('shows error when password is empty', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<LoginScreen navigation={navigation} />);
    fireEvent.changeText(getByPlaceholderText('you@email.com'), 'test@test.com');
    fireEvent.press(getByTestId('login-button'));
    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  test('calls signIn with entered credentials', async () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen navigation={navigation} />);
    fireEvent.changeText(getByPlaceholderText('you@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Your password'), 'pass123');
    fireEvent.press(getByTestId('login-button'));
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({ email: 'test@test.com', password: 'pass123' });
    });
  });

  test('navigates to Signup when create account is pressed', () => {
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByText('Create one'));
    expect(mockNavigate).toHaveBeenCalledWith('Signup');
  });

  test('shows error on wrong credentials', async () => {
    mockSignIn.mockResolvedValueOnce({ error: { message: 'Invalid login credentials' } });
    const { getByText, getByPlaceholderText, getByTestId } = render(<LoginScreen navigation={navigation} />);
    fireEvent.changeText(getByPlaceholderText('you@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Your password'), 'wrong');
    fireEvent.press(getByTestId('login-button'));
    await waitFor(() => {
      expect(getByText('Wrong email or password')).toBeTruthy();
    });
  });
});
