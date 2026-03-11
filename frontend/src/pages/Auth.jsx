import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Sparkles, Store, User } from 'lucide-react'

/* ─── small animated background orb ─────────────────────── */
function Orb({ className }) {
    return <div className={`orb animate-pulse-soft ${className}`} />
}

export default function Auth() {
    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()

    const [mode, setMode] = useState('login')   // 'login' | 'register'
    const [role, setRole] = useState('b2c')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPwd, setShowPwd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // 5s fallback timeout
        const safetyTimer = setTimeout(() => {
            setLoading(false)
            setError("Connection timed out. Please check your network and try again.")
        }, 5000)

        try {
            if (mode === 'login') {
                const data = await signIn(email, password)
                // role redirect handled by App.jsx after context updates
                navigate(data.user ? '/' : '/auth')
            } else {
                await signUp(email, password, role)
                navigate('/')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            clearTimeout(safetyTimer)
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen page-bg flex items-center justify-center p-4 overflow-hidden">

            {/* Background orbs */}
            <Orb className="w-[500px] h-[500px] bg-violet-600/15 top-[-10%] left-[-10%]" />
            <Orb className="w-[400px] h-[400px] bg-pink-600/10   bottom-[-5%] right-[-8%]" />
            <Orb className="w-[300px] h-[300px] bg-violet-400/8  top-[40%]   right-[20%]" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="glass rounded-3xl p-8 shadow-glass-lg">

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="inline-flex flex-col items-center gap-1"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <img
                                src="/logo.png"
                                alt="KidFit DZ Logo"
                                className="w-24 h-24 object-contain drop-shadow-[0_0_18px_rgba(139,92,246,0.7)]"
                            />
                        </motion.div>
                    </div>

                    {/* Mode tabs */}
                    <div className="flex bg-white/5 rounded-xl p-1 mb-7 gap-1">
                        {['login', 'register'].map((m) => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(null) }}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${mode === m
                                    ? 'btn-gradient shadow-glow-v'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {m === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <input
                                id="auth-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                                autoComplete="email"
                                className="input-glass"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                id="auth-password"
                                type={showPwd ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                className="input-glass pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd((v) => !v)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Role selection (register only) */}
                        <AnimatePresence>
                            {mode === 'register' && (
                                <motion.div
                                    key="role-select"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-gray-400 text-xs mb-3 uppercase tracking-widest">I am a…</p>
                                    <div className="grid grid-cols-2 gap-3">

                                        {/* B2C */}
                                        <button
                                            type="button"
                                            id="role-b2c"
                                            onClick={() => setRole('b2c')}
                                            className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${role === 'b2c'
                                                ? 'border-violet-500/60 bg-violet-500/10 shadow-glow-v'
                                                : 'border-white/10 hover:border-white/30 bg-white/3'
                                                }`}
                                        >
                                            <User
                                                size={22}
                                                className={`mb-2 ${role === 'b2c' ? 'text-violet-400' : 'text-gray-500'}`}
                                            />
                                            <p className="text-white font-semibold text-sm">Customer</p>
                                            <p className="text-gray-500 text-xs mt-0.5">Try on & shop</p>
                                            {role === 'b2c' && (
                                                <motion.div
                                                    layoutId="role-check"
                                                    className="absolute top-3 right-3 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center"
                                                >
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                </motion.div>
                                            )}
                                        </button>

                                        {/* B2B */}
                                        <button
                                            type="button"
                                            id="role-b2b"
                                            onClick={() => setRole('b2b')}
                                            className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${role === 'b2b'
                                                ? 'border-pink-500/60 bg-pink-500/10 shadow-glow-p'
                                                : 'border-white/10 hover:border-white/30 bg-white/3'
                                                }`}
                                        >
                                            <Store
                                                size={22}
                                                className={`mb-2 ${role === 'b2b' ? 'text-pink-400' : 'text-gray-500'}`}
                                            />
                                            <p className="text-white font-semibold text-sm">Store Owner</p>
                                            <p className="text-gray-500 text-xs mt-0.5">Manage products</p>
                                            {role === 'b2b' && (
                                                <motion.div
                                                    layoutId="role-check"
                                                    className="absolute top-3 right-3 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center"
                                                >
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                </motion.div>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-red-400 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit */}
                        <button
                            id="auth-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-gradient w-full py-3.5 rounded-xl font-semibold text-sm shadow-glow-v disabled:opacity-50 transition-transform active:scale-95"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                                </span>
                            ) : (
                                mode === 'login' ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Toggle hint */}
                    <p className="text-center text-gray-500 text-xs mt-6">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
                            className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                        >
                            {mode === 'login' ? 'Create one' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
