import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps a route so it is only accessible when:
 *  - the user is authenticated, AND
 *  - the user's role matches `requiredRole` (if provided)
 *
 * While auth is loading → show a spinner (max 8s then redirect to /auth).
 * If not authenticated → redirect to /auth.
 * If wrong role → redirect to the user's correct page.
 */
export default function ProtectedRoute({ children, requiredRole }) {
    const { user, role, loading } = useAuth()
    const [timedOut, setTimedOut] = useState(false)

    // Hard fallback: if still loading after 8s, give up and redirect to auth
    useEffect(() => {
        const timer = setTimeout(() => setTimedOut(true), 8000)
        return () => clearTimeout(timer)
    }, [])

    // Still resolving session or profile
    if (loading && !timedOut) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#05050f',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
            }}>
                <img src="/logo.png" alt="KidFit DZ"
                    style={{
                        width: 72, height: 72, objectFit: 'contain',
                        filter: 'drop-shadow(0 0 16px rgba(139,92,246,0.8))',
                    }} />
                <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: '3px solid rgba(139,92,246,0.2)',
                    borderTopColor: '#8b5cf6',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    // Loading timed out or not logged in → go to auth
    if (!user) return <Navigate to="/auth" replace />

    // User is authenticated but role not yet loaded — wait a tick
    // (this can briefly happen if fetchProfile is still in-flight)
    if (user && role === null && !timedOut) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#05050f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: '3px solid rgba(139,92,246,0.2)',
                    borderTopColor: '#8b5cf6',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    // Role confirmed (or timed out — default to b2c for safety)
    const effectiveRole = role ?? 'b2c'

    // Wrong role → redirect to correct home
    if (requiredRole && effectiveRole !== requiredRole) {
        const home = effectiveRole === 'b2b' ? '/dashboard' : '/store'
        return <Navigate to={home} replace />
    }

    return children
}
