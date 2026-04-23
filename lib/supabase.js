import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://slwymfjwjhklgbijgixc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsd3ltZmp3amhrbGdiaWpnaXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTQ1MzUsImV4cCI6MjA5MjI5MDUzNX0.uluPL86awSIie7Hu70P72v3qi4rCIucKr2y4HhYwnOQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
