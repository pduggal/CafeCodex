import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupScreen from '../../screens/SignupScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

const mockSignUp = jest.fn(() => Promise.resolve({ data: {}, error: null }));
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ signUp: mockSignUp }),
}));

const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SignupScreen', () => {
  test('renders all form fields', () => {
    const { getByPlaceholderText } = render(<SignupScreen navigation={navigation} />);
    expect(getByPlaceholderText('Your name')).toBeTruthy();
    expect(getByPlaceholderText('you@email.com')).toBeTruthy();
    expect(getByPlaceholderText('1234567890')).toBeTruthy();
    expect(getByPlaceholderText('Min 6 characters')).toBeTruthy();
  });

  test('validates name is required', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SignupScreen navigation={navigation} />);
    fireEvent.changeText(getByPlaceholderText('you@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Min 6 characters'), 'pass123');
    fireEvent.press(getByTestId('signup-button'));
    await waitFor(() => {
      expect(getByText('Name is required')).toBeTruthy();
    });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test('validates email format', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SignupScreen navigation={navigation} />);
    fireEvent.changeText(getByPlaceholderText('Your name'), 'Test');
    fireEvent.changeText(getByPlaceholderText('you@email.com'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Min 6 characters'), 'pass123');
    fireEvent.press(getByTestId('signup-button'));
    await waitFor(() => {
      expect(getByText('Enter a valid email')).toBeTruthy();
    });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test('validates password length', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SignupScreen navigation={navigation} />);
    fireEvent.changeText(getByPlaceholderText('Your name'), 'Test');
    fireEvent.changeText(getByPlaceholderText('you@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Min 6 characters'), '123');
    fireEvent.press(getByTestId('signup-button'));
    await waitFor(() => {
      expect(getByText('At least 6 characters')).toBeTruthy();
    });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test('validates phone format when provided', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SignupScreen navigation={navigation} />);
    fireEvent.changeText(getByPlaceholderText('Your name'), 'Test');
    fireEvent.changeText(getByPlaceholderText('you@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('1234567890'), 'abc');
    fireEvent.changeText(getByPlaceholderText('Min 6 characters'), 'pass123');
    fireEvent.press(getByTestId('signup-button'));
    await waitFor(() => {
      expect(getByText('Enter a valid phone number')).toBeTruthy();
    });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  test('calls signUp with valid form data', async () => {
    const { getByPlaceholderText, getByTestId } = render(<SignupScreen navigation={navigation} />);
    fireEvent.changeText(getByPlaceholderText('Your name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('you@email.com'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('Min 6 characters'), 'pass123');
    fireEvent.press(getByTestId('signup-button'));
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@test.com',
        password: 'pass123',
        phone: null,
      });
    });
  });

  test('navigates to Login when sign in link pressed', () => {
    const { getByText } = render(<SignupScreen navigation={navigation} />);
    fireEvent.press(getByText('Sign in'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  test('shows error for already registered email', async () => {
    mockSignUp.mockResolvedValueOnce({ error: { message: 'User already registered' } });
    const { getByText, getByPlaceholderText, getByTestId } = render(<SignupScreen navigation={navigation} />);
    fireEvent.changeText(getByPlaceholderText('Your name'), 'Test');
    fireEvent.changeText(getByPlaceholderText('you@email.com'), 'existing@test.com');
    fireEvent.changeText(getByPlaceholderText('Min 6 characters'), 'pass123');
    fireEvent.press(getByTestId('signup-button'));
    await waitFor(() => {
      expect(getByText('This email is already registered. Try signing in.')).toBeTruthy();
    });
  });
});
