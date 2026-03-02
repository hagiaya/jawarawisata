import { createBrowserClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined;

export function createClient() {
    if (client) return client;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase environment variables are missing! Falling back to localhost...");
    }

    client = createBrowserClient(
        supabaseUrl || 'http://localhost:54321',
        supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aWFwd3BveWhtcnVhbWZweXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzMTUxMjksImV4cCI6MjAyNDg5MTEyOX0'
    );

    return client;
}
