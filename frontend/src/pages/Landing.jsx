import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Zap, ShoppingBag, TrendingUp, ArrowRight, Star, Shield, Shirt } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/* ── tiny animated orb helper ─────────────────────────────── */
function Orb({ style }) {
    return <div className="orb animate-pulse-soft" style={style} />
}

/* ── floating feature card ─────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="glass rounded-3xl p-7 flex flex-col gap-4 cursor-default"
            style={{ border: `1px solid ${color}25` }}
        >
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
                <Icon size={26} style={{ color }} />
            </div>
            <div>
                <h3 className="text-white font-bold text-lg">{title}</h3>
                <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    )
}

/* ── stat pill ─────────────────────────────────────────────── */
function Stat({ value, label }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="gradient-text font-black text-4xl sm:text-5xl">{value}</span>
            <span className="text-gray-500 text-sm">{label}</span>
        </div>
    )
}

export default function Landing() {
    const navigate = useNavigate()
    const { user, role } = useAuth()

    const handleShopNow = () => {
        if (user) {
            navigate(role === 'b2b' ? '/dashboard' : '/store')
        } else {
            navigate('/auth')
        }
    }

    return (
        <div className="relative min-h-screen page-bg overflow-hidden">

            {/* ── Background orbs ─────────────────────────── */}
            <Orb style={{ width: 700, height: 700, background: 'rgba(139,92,246,0.07)', top: '-15%', left: '-10%', borderRadius: '50%', filter: 'blur(80px)', position: 'absolute' }} />
            <Orb style={{ width: 500, height: 500, background: 'rgba(236,72,153,0.06)', bottom: '10%', right: '-8%', borderRadius: '50%', filter: 'blur(80px)', position: 'absolute' }} />
            <Orb style={{ width: 350, height: 350, background: 'rgba(139,92,246,0.05)', top: '50%', right: '25%', borderRadius: '50%', filter: 'blur(60px)', position: 'absolute' }} />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* ── Navbar ──────────────────────────────────── */}
            <nav className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-5">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="KidFit DZ"
                        className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                    />
                    <span className="font-black gradient-text text-xl tracking-tight">KidFit DZ</span>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <button
                            id="go-to-app-btn"
                            onClick={handleShopNow}
                            className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold shadow-glow-v flex items-center gap-2"
                        >
                            <ShoppingBag size={15} />
                            {role === 'b2b' ? 'Dashboard' : 'Store'}
                        </button>
                    ) : (
                        <>
                            <button
                                id="nav-signin-btn"
                                onClick={() => navigate('/auth')}
                                className="glass px-5 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white transition-all font-medium"
                            >
                                Sign In
                            </button>
                            <button
                                id="nav-getstarted-btn"
                                onClick={() => navigate('/auth')}
                                className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold shadow-glow-v"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* ── Hero ────────────────────────────────────── */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">

                {/* Pill badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass border border-violet-500/30"
                >
                    <Sparkles size={14} className="text-violet-400" />
                    <span className="text-violet-300 text-sm font-medium">AI-Powered Virtual Try-On</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl sm:text-7xl font-black tracking-tight leading-tight"
                >
                    Dress Your Kids
                    <br />
                    <span className="gradient-text">Before You Buy</span>
                </motion.h1>

                {/* Sub-headline */}
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
                >
                    Upload a photo and see any outfit on your child in seconds —
                    powered by cutting-edge AI. No more guessing sizes or returns.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                >
                    <button
                        id="hero-shop-btn"
                        onClick={handleShopNow}
                        className="btn-gradient flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold shadow-glow-vp"
                        style={{ animation: 'glow 2s ease-in-out infinite alternate' }}
                    >
                        <Zap size={18} />
                        {user ? 'Go to Store' : 'Try It Free'}
                        <ArrowRight size={18} />
                    </button>

                    {!user && (
                        <button
                            id="hero-learn-btn"
                            onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="glass flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-medium text-gray-300 hover:text-white transition-all"
                        >
                            Learn More
                        </button>
                    )}
                </motion.div>

                {/* Star / trust badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-2 mt-8 text-gray-500 text-sm"
                >
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#fbbf24" stroke="none" className="text-yellow-400" />
                    ))}
                    <span>Trusted by hundreds of parents across Algeria</span>
                </motion.div>

                {/* Hero visual card */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative mt-20 mx-auto max-w-3xl"
                >
                    <div className="glass rounded-3xl overflow-hidden border border-violet-500/20 shadow-[0_0_80px_rgba(139,92,246,0.15)]">
                        {/* Mock UI bar */}
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-black/20">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="glass px-4 py-1 rounded-full text-gray-500 text-xs">
                                    kidfit-dz.com/store
                                </div>
                            </div>
                        </div>

                        {/* Mock store preview */}
                        <div className="p-6 bg-gradient-to-b from-black/10 to-black/30">
                            <div className="text-center mb-6">
                                <p className="text-2xl font-black text-white">Try Before You <span className="gradient-text">Buy</span></p>
                                <p className="text-gray-500 text-sm mt-1">Click any item — see it on you in seconds ✨</p>
                            </div>

                            {/* Mock product grid */}
                            <div className="grid grid-cols-4 gap-3">
                                {['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b'].map((color, i) => (
                                    <div key={i} className="glass rounded-xl overflow-hidden">
                                        <div
                                            className="aspect-[3/4] flex items-center justify-center"
                                            style={{ background: `${color}12` }}
                                        >
                                            <Shirt size={28} style={{ color, opacity: 0.6 }} />
                                        </div>
                                        <div className="p-2">
                                            <div className="h-2 rounded bg-white/10 w-3/4 mb-1" />
                                            <div className="h-1.5 rounded bg-white/5 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Try-on Mock CTA */}
                            <div className="mt-4 glass rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
                                    <Zap size={20} className="text-violet-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white text-sm font-semibold">AI Try-On Ready</p>
                                    <p className="text-gray-500 text-xs">Upload a photo and generate your look instantly</p>
                                </div>
                                <div className="btn-gradient px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
                                    <Sparkles size={12} /> Try It
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating badge */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-4 -right-4 glass px-4 py-2.5 rounded-2xl border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                    >
                        <p className="text-green-400 text-xs font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            AI Online
                        </p>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        className="absolute -bottom-4 -left-4 glass px-4 py-2.5 rounded-2xl border border-violet-500/30"
                    >
                        <p className="text-violet-300 text-xs font-bold flex items-center gap-1.5">
                            <Sparkles size={12} />
                            Instant Results
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── Stats ───────────────────────────────────── */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                <div className="glass rounded-3xl p-10">
                    <div className="grid grid-cols-3 gap-6 divide-x divide-white/10">
                        <Stat value="500+" label="Clothing items" />
                        <Stat value="3s" label="Try-on speed" />
                        <Stat value="100%" label="AI powered" />
                    </div>
                </div>
            </section>

            {/* ── Features ────────────────────────────────── */}
            <section id="features-section" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Why <span className="gradient-text">KidFit DZ</span>?
                    </h2>
                    <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
                        The smartest way to shop kids' fashion in Algeria
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <FeatureCard
                        icon={Zap}
                        title="Instant AI Try-On"
                        desc="Upload any photo and see clothes on your child in under 3 seconds using state-of-the-art AI."
                        color="#8b5cf6"
                        delay={0}
                    />
                    <FeatureCard
                        icon={ShoppingBag}
                        title="Shop & Affiliate"
                        desc="Buy directly through partner links. Affiliate badges show you where you can earn cashback."
                        color="#ec4899"
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={TrendingUp}
                        title="Store Owners Dashboard"
                        desc="Are you a seller? Add your products, manage inventory and reach thousands of Algerian parents."
                        color="#f59e0b"
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Safe & Secure"
                        desc="Your photos are never stored. All try-on processing is ephemeral and privacy-first."
                        color="#06b6d4"
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={Star}
                        title="Curated Selection"
                        desc="Every item is hand-picked and categorised by Full Body, Top, Pants and Shoes."
                        color="#a78bfa"
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={Sparkles}
                        title="Made for Algeria"
                        desc="Prices in DA, local brands, and a catalog tailored for Algerian parents and kids."
                        color="#34d399"
                        delay={0.5}
                    />
                </div>
            </section>

            {/* ── Final CTA ───────────────────────────────── */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-3xl p-12 text-center border border-violet-500/20 shadow-[0_0_60px_rgba(139,92,246,0.1)]"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6"
                        style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
                        <Sparkles size={36} className="text-violet-400" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Ready to <span className="gradient-text">Try It?</span>
                    </h2>
                    <p className="text-gray-400 mt-4 text-base max-w-md mx-auto">
                        Join the future of kids' fashion shopping in Algeria. It's free, it's instant, it's magical.
                    </p>
                    <button
                        id="cta-final-btn"
                        onClick={handleShopNow}
                        className="btn-gradient inline-flex items-center gap-2.5 mt-8 px-10 py-4 rounded-2xl text-base font-bold shadow-glow-vp"
                    >
                        <Zap size={18} />
                        {user ? 'Go to Store' : 'Start Shopping Now'}
                        <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>

            {/* ── Footer ──────────────────────────────────── */}
            <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center text-gray-600 text-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <img src="/logo.png" alt="" className="w-6 h-6 object-contain opacity-50" />
                    <span className="font-bold text-gray-500">KidFit DZ</span>
                </div>
                <p>© {new Date().getFullYear()} KidFit DZ — AI-Powered Kids Fashion in Algeria</p>
            </footer>
        </div>
    )
}
