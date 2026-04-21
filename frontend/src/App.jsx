import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Store from './pages/Store'
import Landing from './pages/Landing'

/* Spinner shown while the auth/profile state is loading */
function FullScreenLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#05050f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <img src="/logo.png" alt="KidFit DZ"
        style={{
          width: 80, height: 80, objectFit: 'contain',
          filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.8))'
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

export default function App() {
  const { user, role, loading } = useAuth()

  // Wait until BOTH the session AND the profile/role are loaded
  if (loading) return <FullScreenLoader />

  return (
    <Routes>

      {/* ── Landing: always visible at root ──────────────── */}
      <Route path="/" element={<Landing />} />

      {/* ── Public: Auth page ────────────────────────────── */}
      <Route
        path="/auth"
        element={
          !user
            ? <Auth />
            : <Navigate to="/" replace />
        }
      />

      {/* ── B2B only: Dashboard ──────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="b2b">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ── B2C only: Store ──────────────────────────────── */}
      <Route
        path="/store"
        element={
          <ProtectedRoute requiredRole="b2c">
            <Store />
          </ProtectedRoute>
        }
      />

      {/* ── 404 catch-all ────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
