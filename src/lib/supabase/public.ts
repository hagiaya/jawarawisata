import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const publicSupabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aWFwd3BveWhtcnVhbWZweXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzMTUxMjksImV4cCI6MjAyNDg5MTEyOX0'
)
