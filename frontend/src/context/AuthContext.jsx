/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch profile from DB
    const fetchProfile = useCallback(async (userId) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('id, role, created_at')
                .eq('id', userId)
                .maybeSingle()
            if (data) { setProfile(data); return data }
        } catch (e) {
            console.warn('fetchProfile error:', e.message)
        }
        return null
    }, [])

    useEffect(() => {
        let mounted = true
        let resolved = false

        const done = () => {
            if (mounted && !resolved) {
                resolved = true
                setLoading(false)
            }
        }

        // Safety net: resolve loading after 2s max (not 5s)
        const safetyTimer = setTimeout(() => {
            if (!resolved) {
                console.warn('AuthContext: 2s safety timer fired')
                done()
            }
        }, 2000)

        // Fast path: check existing session from localStorage immediately
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!mounted || resolved) return
            const u = session?.user ?? null
            setUser(u)
            if (u) {
                fetchProfile(u.id).then(() => done())
            } else {
                done()
            }
        }).catch(() => done())

        // Also subscribe to auth changes (login/logout events)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return
                // Only process real changes (SIGNED_IN, SIGNED_OUT)
                // Skip INITIAL_SESSION since getSession() above handles it
                if (event === 'INITIAL_SESSION') return

                const u = session?.user ?? null
                setUser(u)
                if (u) {
                    await fetchProfile(u.id)
                } else {
                    setProfile(null)
                }
                done()
            }
        )

        return () => {
            mounted = false
            clearTimeout(safetyTimer)
            subscription.unsubscribe()
        }
    }, [fetchProfile])

    // Sign in
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        return data
    }

    // Sign up
    const signUp = async (email, password, role = 'b2c') => {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user && role === 'b2b') {
            await new Promise(r => setTimeout(r, 1500))
            await supabase.from('profiles').update({ role: 'b2b' }).eq('id', data.user.id)
            await fetchProfile(data.user.id)
        }
        return data
    }

    // Sign out — clears session immediately without waiting for network
    const signOut = () => {
        // 1. Fire Supabase signOut in background (don't await — can hang)
        supabase.auth.signOut({ scope: 'local' }).catch(() => {})
        // 2. Clear sessionStorage (where we now store the session)
        sessionStorage.clear()
        // 3. Clear React state
        setUser(null)
        setProfile(null)
    }

    const refreshProfile = () => user && fetchProfile(user.id)

    return (
        <AuthContext.Provider value={{
            user, profile,
            role: profile?.role ?? null,
            loading, signIn, signUp, signOut, refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}
