import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
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

  test('loads profile and sets isAdmin when getSession returns a user', async () => {
    const { supabase } = require('../../lib/supabase');
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-1', email: 'a@b.com' } } },
    });
    supabase.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: { name: 'A', phone: null, role: 'admin' }, error: null }),
        }),
      }),
    }));

    let ctx;
    render(
      <AuthProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </AuthProvider>
    );

    await waitFor(() => expect(ctx?.loading).toBe(false));
    expect(ctx.session.user.id).toBe('user-1');
    expect(ctx.user.id).toBe('user-1');
    expect(ctx.profile).toEqual({ name: 'A', phone: null, role: 'admin' });
    expect(ctx.isAdmin).toBe(true);
  });

  test('fetchProfile catches errors and leaves profile null', async () => {
    const { supabase } = require('../../lib/supabase');
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-2', email: 'b@c.com' } } },
    });
    supabase.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.reject(new Error('db error')),
        }),
      }),
    }));

    let ctx;
    render(
      <AuthProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </AuthProvider>
    );

    await waitFor(() => expect(ctx?.loading).toBe(false));
    expect(ctx.profile).toBeNull();
    expect(ctx.isAdmin).toBe(false);
  });

  test('onAuthStateChange sign-in transition fetches profile', async () => {
    const { supabase } = require('../../lib/supabase');
    let authStateCallback;
    supabase.auth.onAuthStateChange.mockImplementationOnce((cb) => {
      authStateCallback = cb;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    supabase.from.mockImplementationOnce(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: { name: 'C', phone: '123', role: 'user' }, error: null }),
        }),
      }),
    }));

    let ctx;
    render(
      <AuthProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    await waitFor(() => expect(ctx?.loading).toBe(false));
    expect(authStateCallback).toBeDefined();

    await act(async () => {
      authStateCallback('SIGNED_IN', { user: { id: 'user-3' } });
    });

    await waitFor(() => expect(ctx.session?.user?.id).toBe('user-3'));
    expect(ctx.profile).toEqual({ name: 'C', phone: '123', role: 'user' });
  });

  test('onAuthStateChange sign-out transition clears profile', async () => {
    const { supabase } = require('../../lib/supabase');
    let authStateCallback;
    supabase.auth.onAuthStateChange.mockImplementationOnce((cb) => {
      authStateCallback = cb;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    let ctx;
    render(
      <AuthProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </AuthProvider>
    );
    await waitFor(() => expect(ctx?.loading).toBe(false));

    await act(async () => {
      authStateCallback('SIGNED_OUT', null);
    });

    await waitFor(() => expect(ctx.session).toBeNull());
    expect(ctx.user).toBeNull();
    expect(ctx.profile).toBeNull();
  });

  describe('deleteAccount', () => {
    test('returns error when no user is logged in', async () => {
      let ctx;
      render(
        <AuthProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      await waitFor(() => expect(ctx?.loading).toBe(false));

      const result = await ctx.deleteAccount();
      expect(result.error).toEqual({ message: 'No user logged in' });
    });

    test('deletes profile, calls RPC, and signs out on success', async () => {
      const { supabase } = require('../../lib/supabase');
      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: { user: { id: 'user-4' } } },
      });
      supabase.from.mockImplementationOnce(() => ({
        select: () => ({
          eq: () => ({ single: () => Promise.resolve({ data: { name: 'D', role: 'user' }, error: null }) }),
        }),
      }));

      let ctx;
      render(
        <AuthProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      await waitFor(() => expect(ctx?.loading).toBe(false));

      const deleteEq = jest.fn(() => Promise.resolve({ error: null }));
      supabase.from.mockImplementationOnce(() => ({
        delete: () => ({ eq: deleteEq }),
      }));
      supabase.rpc = jest.fn(() => Promise.resolve({ error: null }));

      const result = await ctx.deleteAccount();

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(deleteEq).toHaveBeenCalledWith('id', 'user-4');
      expect(supabase.rpc).toHaveBeenCalledWith('delete_own_account');
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    test('returns error and does not call RPC when profile delete fails', async () => {
      const { supabase } = require('../../lib/supabase');
      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: { user: { id: 'user-5' } } },
      });
      supabase.from.mockImplementationOnce(() => ({
        select: () => ({
          eq: () => ({ single: () => Promise.resolve({ data: { name: 'E', role: 'user' }, error: null }) }),
        }),
      }));

      let ctx;
      render(
        <AuthProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      await waitFor(() => expect(ctx?.loading).toBe(false));

      supabase.from.mockImplementationOnce(() => ({
        delete: () => ({ eq: () => Promise.resolve({ error: { message: 'profile delete failed' } }) }),
      }));
      supabase.rpc = jest.fn(() => Promise.resolve({ error: null }));

      const result = await ctx.deleteAccount();

      expect(result.error).toEqual({ message: 'profile delete failed' });
      expect(supabase.rpc).not.toHaveBeenCalled();
      expect(supabase.auth.signOut).not.toHaveBeenCalled();
    });

    test('returns error when RPC call fails after successful profile delete', async () => {
      const { supabase } = require('../../lib/supabase');
      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: { user: { id: 'user-6' } } },
      });
      supabase.from.mockImplementationOnce(() => ({
        select: () => ({
          eq: () => ({ single: () => Promise.resolve({ data: { name: 'F', role: 'user' }, error: null }) }),
        }),
      }));

      let ctx;
      render(
        <AuthProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      await waitFor(() => expect(ctx?.loading).toBe(false));

      supabase.from.mockImplementationOnce(() => ({
        delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
      }));
      supabase.rpc = jest.fn(() => Promise.resolve({ error: { message: 'rpc failed' } }));

      const result = await ctx.deleteAccount();

      expect(result.error).toEqual({ message: 'rpc failed' });
      expect(supabase.auth.signOut).not.toHaveBeenCalled();
    });
  });
});
