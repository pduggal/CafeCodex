import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../context/AuthContext';

function TestConsumer({ onContext }) {
  const ctx = useAuth();
  useEffect(() => { onContext(ctx); }, [ctx]);
  return <Text testID="child">loaded</Text>;
}

beforeEach(() => {
  const { supabase } = require('../../lib/supabase');
  supabase.auth.getSession.mockClear();
  supabase.auth.onAuthStateChange.mockClear();
  supabase.auth.signUp.mockClear();
  supabase.auth.signInWithPassword.mockClear();
  supabase.auth.signOut.mockClear();
  supabase.from.mockClear();
});

describe('AuthProvider', () => {
  test('renders children', () => {
    const { getByTestId } = render(
      <AuthProvider><Text testID="child">hello</Text></AuthProvider>
    );
    expect(getByTestId('child')).toBeTruthy();
  });

  test('starts with no session', async () => {
    let ctx;
    render(
      <AuthProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    await waitFor(() => expect(ctx?.loading).toBe(false));
    expect(ctx.session).toBeNull();
    expect(ctx.user).toBeNull();
  });

  test('signIn calls supabase.auth.signInWithPassword', async () => {
    const { supabase } = require('../../lib/supabase');
    let ctx;
    render(
      <AuthProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    await waitFor(() => expect(ctx?.signIn).toBeDefined());
    await ctx.signIn({ email: 'test@test.com', password: 'pass123' });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'pass123',
    });
  });

  test('signUp calls supabase.auth.signUp and inserts profile', async () => {
    const { supabase } = require('../../lib/supabase');
    let ctx;
    render(
      <AuthProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    await waitFor(() => expect(ctx?.signUp).toBeDefined());
    await ctx.signUp({ name: 'Test', email: 'test@test.com', password: 'pass123', phone: '1234567890' });
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'pass123',
    });
    expect(supabase.from).toHaveBeenCalledWith('profiles');
  });

  test('signOut calls supabase.auth.signOut', async () => {
    const { supabase } = require('../../lib/supabase');
    let ctx;
    render(
      <AuthProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    await waitFor(() => expect(ctx?.signOut).toBeDefined());
    await ctx.signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  test('isAdmin is false by default', async () => {
    let ctx;
    render(
      <AuthProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    await waitFor(() => expect(ctx?.loading).toBe(false));
    expect(ctx.isAdmin).toBe(false);
  });
});
