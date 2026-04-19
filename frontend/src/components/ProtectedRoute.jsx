import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps a route so it is only accessible when:
 *  - the user is authenticated, AND
 *  - the user's role matches `requiredRole` (if provided)
 *
 * While auth is loading → show a spinner.
 * If not authenticated → redirect to /auth.
 * If wrong role → redirect to correct home page.
 */
export default function ProtectedRoute({ children, requiredRole }) {
    const { user, role, loading } = useAuth()

    // Still resolving auth state — show spinner
    if (loading) {
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

    // Not logged in → go to auth
    if (!user) return <Navigate to="/auth" replace />

    // Use effective role (default to b2c if profile fetch failed)
    const effectiveRole = role || 'b2c'

    // Wrong role → redirect to correct home
    if (requiredRole && effectiveRole !== requiredRole) {
        const home = effectiveRole === 'b2b' ? '/dashboard' : '/store'
        return <Navigate to={home} replace />
    }

    return children
}
