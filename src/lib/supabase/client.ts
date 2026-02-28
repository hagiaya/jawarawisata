import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aWFwd3BveWhtcnVhbWZweXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkzMTUxMjksImV4cCI6MjAyNDg5MTEyOX0'
    )
}
