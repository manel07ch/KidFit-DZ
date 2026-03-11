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

        // Hard safety: always clear spinner after 3s no matter what (requested by user)
        const safetyTimer = setTimeout(() => {
            if (mounted) {
                console.warn('AuthContext: 3s safety timer fired — clearing loading')
                setLoading(false)
            }
        }, 3000)

        // onAuthStateChange is the single source of truth in Supabase v2.
        // It fires INITIAL_SESSION synchronously from localStorage cache (or
        // after the first network check), so we don't need a separate getSession().
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return
                const u = session?.user ?? null
                setUser(u)
                if (u) {
                    await fetchProfile(u.id)
                } else {
                    setProfile(null)
                }
                setLoading(false)
                clearTimeout(safetyTimer)
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

    // Sign out
    const signOut = async () => {
        await supabase.auth.signOut()
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
