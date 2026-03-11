import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles, LogOut, ShoppingBag, Search, Upload, X,
    Shirt, Camera, ExternalLink, ChevronLeft, Loader2,
    Zap, AlertCircle, User, DollarSign, TrendingUp,
    Copy, Check, Plus, Tag, Star, Download,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001'
const BODY_PARTS = ['All', 'Full Body', 'Top', 'Pants', 'Shoes']

/* ═══════════════════════════════════════════════════════════
   TRY-ON MODAL
═══════════════════════════════════════════════════════════ */
function TryOnModal({ item: initialItem, allItems, onClose }) {
    const { user } = useAuth()
    const [bodyTab, setBodyTab] = useState('Full Body')
    const [userFile, setUserFile] = useState(null)
    const [userPreview, setUserPreview] = useState(null)
    const [resultImg, setResultImg] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedItem, setSelectedItem] = useState(initialItem)
    const [linkCopied, setLinkCopied] = useState(false)
    const fileRef = useRef(null)

    const sideItems = allItems.filter((i) => i.id !== selectedItem.id).slice(0, 4)

    const handleFileChange = (e) => {
        const f = e.target.files[0]; if (!f) return
        setUserFile(f); setUserPreview(URL.createObjectURL(f)); setResultImg(null); setError(null)
    }

    const handleTryOn = async () => {
        if (!userFile) { setError('Please upload your full-body photo first.'); return }
        setLoading(true); setError(null); setResultImg(null)
        try {
            // ✅ تحويل الصورة مباشرة بدون رفع لـ Supabase Storage
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(userFile)
            })

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/try-on`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userImageBase64: base64,  // ✅ بدل userImageUrl
                    clothingImageUrl: selectedItem.image_url,
                }),
            })
            const json = await res.json()
            if (!res.ok || !json.success) throw new Error(json.error ?? 'Try-on failed')
            setResultImg(json.resultImageBase64)
        } catch (err) { setError(err.message) }
        finally { setLoading(false) }
    }

    const copyAffiliateLink = () => {
        if (!selectedItem.affiliate_link) return
        navigator.clipboard.writeText(selectedItem.affiliate_link)
        setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000)
    }

    const handleDownload = async () => {
        if (!resultImg) return;
        try {
            const res = await fetch(resultImg);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `kidfit-tryon-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (err) {
            console.error('Download failed:', err);
        }
    }

    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
    }, [onClose])

    /* Side item card */
    const SideCard = ({ sideItem }) => (
        <motion.button whileHover={{ scale: 1.04 }}
            onClick={() => { setSelectedItem(sideItem); setResultImg(null) }}
            className="glass rounded-2xl overflow-hidden text-left w-full animate-float-slow">
            <div className="aspect-[3/4] bg-white/5 overflow-hidden">
                <img src={sideItem.image_url} alt={sideItem.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
                <p className="text-white text-xs font-semibold truncate">{sideItem.name}</p>
                {sideItem.price && <p className="text-green-400 text-xs font-bold mt-0.5">${sideItem.price}</p>}
                {sideItem.affiliate_link && (
                    <p className="text-yellow-400/70 text-xs flex items-center gap-1 mt-0.5">
                        <TrendingUp size={9} /> Earn
                    </p>
                )}
            </div>
        </motion.button>
    )

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: 'linear-gradient(135deg, #05050f 0%, #0d0618 40%, #100a1f 100%)' }}>

            {/* bg glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/6  rounded-full blur-3xl pointer-events-none" />

            {/* TOP NAV */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4 flex-shrink-0">
                <button onClick={onClose}
                    className="flex items-center gap-2 glass px-4 py-2 rounded-full text-gray-300 hover:text-white text-sm transition-all">
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Back</span>
                </button>

                {/* Body part tabs */}
                <div className="flex items-center gap-1 glass rounded-full px-2 py-1.5">
                    {BODY_PARTS.slice(1).map((bp) => (
                        <button key={bp} onClick={() => setBodyTab(bp)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${bodyTab === bp ? 'btn-gradient shadow-glow-v' : 'text-gray-400 hover:text-white'}`}>
                            {bp}
                        </button>
                    ))}
                </div>

                <span className="hidden sm:block gradient-text font-bold text-sm">VirtualFit™</span>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden px-4 pb-2 gap-3 min-h-0">

                {/* Left icons */}
                <div className="hidden md:flex flex-col items-center gap-4 py-4 w-14 flex-shrink-0">
                    {[Shirt, User, ShoppingBag, Zap].map((Icon, i) => (
                        <button key={i}
                            className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-violet-400 transition-all">
                            <Icon size={16} />
                        </button>
                    ))}
                </div>

                {/* Left side item */}
                <div className="hidden lg:flex flex-col justify-center w-40 xl:w-48 flex-shrink-0">
                    {sideItems[0] && <SideCard sideItem={sideItems[0]} />}
                </div>

                {/* CENTRAL VIEWER */}
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                    {/* Main panel */}
                    <div className="flex-1 glass rounded-3xl overflow-hidden relative flex items-center justify-center min-h-0">

                        <AnimatePresence mode="wait">
                            {loading && (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                                    <div className="relative w-24 h-24 mb-6">
                                        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-ping" />
                                        <div className="absolute inset-2 rounded-full border-2 border-violet-500/30 animate-spin-slow" />
                                        <div className="absolute inset-4 rounded-full border-2 border-t-violet-400 animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles size={20} className="text-violet-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="text-white font-semibold">Generating your look…</p>
                                    <p className="text-gray-400 text-sm mt-1">AI is working its magic ✨</p>
                                </motion.div>
                            )}

                            {resultImg && !loading && (
                                <motion.div key="result"
                                    initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
                                    className="relative w-full h-full flex items-center justify-center">
                                    <img src={resultImg} alt="Try-on result" className="w-full h-full object-contain" />
                                    <button onClick={handleDownload} title="Download Result"
                                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md transition-all border border-white/10 shadow-lg">
                                        <Download size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {userPreview && !resultImg && !loading && (
                                <motion.img key="user" src={userPreview} alt="Your photo"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="w-full h-full object-contain" />
                            )}

                            {!userPreview && !resultImg && !loading && (
                                <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col items-center gap-4 px-8 text-center">
                                    <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center animate-float">
                                        <Camera size={32} className="text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-lg">Upload your photo</p>
                                        <p className="text-gray-400 text-sm mt-1">A full-body photo works best</p>
                                    </div>
                                    <button onClick={() => fileRef.current?.click()}
                                        className="btn-gradient px-6 py-3 rounded-xl text-sm font-semibold shadow-glow-v">
                                        <span className="flex items-center gap-2"><Upload size={16} />Choose Photo</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Selected item thumbnail badge */}
                        {selectedItem.image_url && (
                            <div className="absolute top-4 right-4 glass rounded-xl overflow-hidden w-16 shadow-glass">
                                <img src={selectedItem.image_url} alt="" className="w-full h-20 object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="glass rounded-2xl px-5 py-3 flex flex-wrap items-center gap-3 flex-shrink-0">
                        <button onClick={() => fileRef.current?.click()}
                            className="flex items-center gap-2 glass-sm px-4 py-2.5 rounded-xl text-gray-300 hover:text-white text-sm transition-all">
                            <Upload size={15} />
                            {userPreview ? 'Change Photo' : 'Upload Photo'}
                        </button>
                        <input id="user-photo-input" ref={fileRef} type="file" accept="image/*"
                            onChange={handleFileChange} className="sr-only" />

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                <AlertCircle size={13} /> {error}
                            </div>
                        )}

                        <div className="flex-1" />

                        <button id="try-on-btn" onClick={handleTryOn} disabled={loading || !userFile}
                            className="btn-gradient flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-glow-vp disabled:opacity-40 transition-transform active:scale-95">
                            {loading ? <><Loader2 size={16} className="animate-spin" />Generating…</> : <><Zap size={16} />Try It On</>}
                        </button>
                    </div>
                </div>

                {/* Right side item */}
                <div className="hidden lg:flex flex-col justify-center w-40 xl:w-48 flex-shrink-0">
                    {sideItems[1] && <SideCard sideItem={sideItems[1]} />}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
          AFFILIATE MARKETING BOTTOM BAR  (ميزة التسويق بالعمولة)
      ══════════════════════════════════════════════════════ */}
            <div className="relative z-10 flex-shrink-0 px-4 pb-4">
                <div className="glass rounded-2xl overflow-hidden">

                    {/* Affiliate banner (if item has an affiliate link) */}
                    {selectedItem.affiliate_link && (
                        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-yellow-500/15 px-5 py-2.5
                            flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-yellow-400" />
                                <span className="text-yellow-400 text-xs font-medium">Affiliate Product</span>
                                <span className="text-gray-500 text-xs">— Buy through this link to support KidFit DZ</span>
                            </div>
                            <button onClick={copyAffiliateLink}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${linkCopied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                                {linkCopied ? <><Check size={11} />Copied!</> : <><Copy size={11} />Copy Link</>}
                            </button>
                        </div>
                    )}

                    {/* Main bottom bar */}
                    <div className="px-5 py-4 flex items-center gap-4">
                        {/* Item image + info */}
                        {selectedItem.image_url && (
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                                <img src={selectedItem.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <p className="text-white font-bold truncate">{selectedItem.name}</p>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                {selectedItem.price && (
                                    <span className="text-green-400 font-bold text-lg">${selectedItem.price}</span>
                                )}
                                {selectedItem.category && (
                                    <span className="text-gray-500 text-xs capitalize flex items-center gap-1">
                                        <Tag size={10} /> {selectedItem.category}
                                    </span>
                                )}
                                {resultImg && <span className="text-violet-400 text-xs flex items-center gap-1"><Star size={10} />Try-on complete</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Save result */}
                            {resultImg && (
                                <button onClick={handleDownload}
                                    className="flex items-center gap-1.5 glass-sm px-3 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white transition-colors">
                                    <Download size={14} /> Save Image
                                </button>
                            )}

                            {/* BUY NOW — main affiliate CTA */}
                            {selectedItem.affiliate_link ? (
                                <a id="buy-now-btn" href={selectedItem.affiliate_link}
                                    target="_blank" rel="noopener noreferrer"
                                    className="btn-gradient flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-black
                             shadow-glow-vp animate-glow">
                                    <ShoppingBag size={18} />
                                    BUY NOW
                                    <ExternalLink size={14} />
                                </a>
                            ) : (
                                <div className="glass px-5 py-3.5 rounded-xl text-sm text-gray-500 font-medium">
                                    No purchase link
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Other items row (bottom alternative picks) */}
                    {sideItems.length > 0 && (
                        <div className="border-t border-white/5 px-5 py-3 flex items-center gap-3 overflow-x-auto">
                            <span className="text-gray-500 text-xs flex-shrink-0">Also try:</span>
                            {sideItems.slice(0, 5).map((si) => (
                                <button key={si.id} onClick={() => { setSelectedItem(si); setResultImg(null) }}
                                    className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-white/10
                             hover:border-violet-500/40 transition-all">
                                    <img src={si.image_url} alt={si.name} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

/* ═══════════════════════════════════════════════════════════
   Product Card
═══════════════════════════════════════════════════════════ */
function ProductCard({ item, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.3 }}
            onClick={onClick}
            className="glass rounded-2xl overflow-hidden cursor-pointer group hover:border-violet-500/30 hover:shadow-glow-v transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-[3/4] bg-white/5 overflow-hidden">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Shirt size={32} className="text-gray-600" />
                    </div>
                )}

                {/* Affiliate badge */}
                {item.affiliate_link && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full
                          bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-sm">
                        <TrendingUp size={10} className="text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-medium">Affiliate</span>
                    </div>
                )}

                {/* Price badge */}
                {item.price && (
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full
                          bg-black/50 border border-white/10 text-white text-xs font-bold backdrop-blur-sm">
                        ${item.price}
                    </div>
                )}

                {/* Try-on hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="btn-gradient w-full text-center py-2.5 rounded-xl text-xs font-bold shadow-glow-v">
                        <span className="flex items-center justify-center gap-1.5">
                            <Zap size={13} /> Try It On
                        </span>
                    </div>
                </div>
            </div>

            {/* Meta */}
            <div className="p-3">
                <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1.5">
                    {item.price ? (
                        <span className="text-green-400 font-bold text-sm">${item.price}</span>
                    ) : <span />}
                    {item.affiliate_link && (
                        <span className="text-yellow-400/80 text-xs flex items-center gap-1">
                            <DollarSign size={10} /> Buy
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

/* ═══════════════════════════════════════════════════════════
   Store — B2C page
═══════════════════════════════════════════════════════════ */
export default function Store() {
    const { user, role, signOut } = useAuth()
    const navigate = useNavigate()

    const [items, setItems] = useState([])
    const [fetching, setFetching] = useState(true)
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState('All')
    const [modalItem, setModalItem] = useState(null)

    useEffect(() => {
        const load = async () => {
            setFetching(true)

            // 5s fallback timeout
            const timer = setTimeout(() => setFetching(false), 5000)

            try {
                const { data, error } = await supabase.from('clothing_items').select('*')
                    .order('created_at', { ascending: false })
                if (error) throw error
                setItems(data ?? [])
            } catch (err) {
                console.error("Store data fetch error:", err)
            } finally {
                clearTimeout(timer)
                setFetching(false)
            }
        }
        load()
    }, [])

    const filtered = items.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) &&
        (activeTab === 'All' || (i.category && i.category.toLowerCase().includes(activeTab.toLowerCase())))
    )

    const handleSignOut = async () => { await signOut(); navigate('/auth') }

    /* affiliate items count */
    const affiliateCount = items.filter((i) => i.affiliate_link).length

    return (
        <>
            <div className="min-h-screen page-bg">

                {/* Navbar */}
                <nav className="glass-dark border-b border-white/5 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <img src="/logo.png" alt="KidFit DZ"
                                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                            <span className="font-bold gradient-text text-lg">KidFit DZ</span>
                            {affiliateCount > 0 && (
                                <span className="hidden sm:flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full
                                 bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 text-xs">
                                    <TrendingUp size={10} /> {affiliateCount} affiliate items
                                </span>
                            )}
                        </div>

                        {/* Search */}
                        <div className="hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-full w-60">
                            <Search size={14} className="text-gray-500 flex-shrink-0" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search items…"
                                className="bg-transparent text-white text-sm placeholder-gray-500 outline-none w-full" />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-white text-sm font-medium">{user?.email?.split('@')[0]}</p>
                                <p className="text-gray-500 text-xs">Customer</p>
                            </div>
                            <button onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-gray-400 hover:text-white text-sm transition-all">
                                <LogOut size={15} />
                                <span className="hidden sm:inline">Sign out</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="orb w-[600px] h-[400px] bg-violet-600/10 top-0 left-1/2 -translate-x-1/2 blur-3xl" />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-8 text-center">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-5xl font-bold tracking-tight">
                            Try Before You <span className="gradient-text">Buy</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="text-gray-400 mt-3 text-lg">
                            Click any item — see it on you in seconds, powered by AI ✨
                        </motion.p>

                        {/* Stats row */}
                        {items.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className="flex items-center justify-center gap-6 mt-5">
                                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                    <ShoppingBag size={14} className="text-violet-400" />
                                    <span><strong className="text-white">{items.length}</strong> items</span>
                                </div>
                                {affiliateCount > 0 && (
                                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                        <TrendingUp size={14} className="text-yellow-400" />
                                        <span><strong className="text-yellow-400">{affiliateCount}</strong> available to buy</span>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Category tabs */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-2 mt-7 flex-wrap">
                            {BODY_PARTS.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab ? 'btn-gradient shadow-glow-v' : 'glass text-gray-400 hover:text-white'}`}>
                                    {tab}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Product Grid */}
                <main className="max-w-7xl mx-auto px-6 pb-28">
                    {fetching ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="glass rounded-2xl overflow-hidden">
                                    <div className="aspect-[3/4] shimmer" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-3 shimmer rounded w-3/4" />
                                        <div className="h-2 shimmer rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="glass rounded-3xl p-20 text-center max-w-md mx-auto mt-8">
                            <Shirt size={40} className="text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-300 font-semibold">
                                {search ? `No results for "${search}"` : 'Store is empty'}
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                {search ? 'Try a different keyword.' : 'Check back soon — items are being added.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {filtered.map((item, i) => (
                                <motion.div key={item.id}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}>
                                    <ProductCard item={item} onClick={() => setModalItem(item)} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* ── B2B Floating Action Button ─────────────────────── */}
            {role === 'b2b' && (
                <Link to="/dashboard">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        className="fixed bottom-8 right-8 z-40 btn-gradient w-16 h-16 rounded-2xl shadow-glow-vp
                       flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                        title="Add new clothing item">
                        <Plus size={22} className="text-white" />
                        <span className="text-white text-xs font-bold">Add</span>
                    </motion.div>
                </Link>
            )}

            {/* Try-On Modal */}
            <AnimatePresence>
                {modalItem && (
                    <TryOnModal key={modalItem.id} item={modalItem} allItems={items}
                        onClose={() => setModalItem(null)} />
                )}
            </AnimatePresence>
        </>
    )
}
