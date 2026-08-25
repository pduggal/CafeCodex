// jest.setup.js globally mocks lib/supabase for every other test file; this
// file explicitly unmocks it to verify the real client configuration.
jest.unmock('../../lib/supabase');

describe('lib/supabase', () => {
  test('both clients point at the same Supabase project URL', () => {
    const { supabase, publicSupabase } = require('../../lib/supabase');
    expect(supabase.supabaseUrl).toBe('https://slwymfjwjhklgbijgixc.supabase.co');
    expect(publicSupabase.supabaseUrl).toBe(supabase.supabaseUrl);
  });

  test('both clients expose working auth and query builders', () => {
    const { supabase, publicSupabase } = require('../../lib/supabase');
    expect(typeof supabase.auth.getSession).toBe('function');
    expect(typeof supabase.from).toBe('function');
    expect(typeof publicSupabase.from).toBe('function');
  });

  test('main client persists sessions, public client does not', () => {
    const { supabase, publicSupabase } = require('../../lib/supabase');
    expect(supabase.auth.persistSession).toBe(true);
    expect(publicSupabase.auth.persistSession).toBe(false);
  });
});
