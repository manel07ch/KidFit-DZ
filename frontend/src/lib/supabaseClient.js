import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — copy .env.example to .env and fill in your values.'
    )
}

// ── One-time cleanup of OLD localStorage sessions (before sessionStorage switch)
// Without this, users who logged in before this fix would still be auto-logged in
;['kidfit-auth-v2', ...Object.keys(localStorage).filter(k => k.startsWith('sb-'))].forEach(
    k => localStorage.removeItem(k)
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storageKey: 'kidfit-auth-v2',
        // sessionStorage = session dies when tab closes or user opens new URL
        // localStorage (default) = session persists forever → caused the auto-login bug
        storage: window.sessionStorage,
        persistSession: true,
        autoRefreshToken: true,
    }
})
