import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, Image as ImageIcon, LogOut, Sparkles, Trash2,
    ExternalLink, Plus, X, Check, Copy, DollarSign,
    TrendingUp, Share2, Zap, Link as LinkIcon, Package,
    ShoppingBag, ChevronDown, ChevronUp, Store, Tag,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

/* ══════════════════════════════════════════════════════════
   DEMO SEED DATA — 8 ready-made clothing items
   Used by the "Seed Demo Store" button
══════════════════════════════════════════════════════════ */
const DEMO_CLOTHING = [
    {
        name: '2pcs Baby Boy Textured Cute Cartoon Print Shirt',
        image_url: '/clothes_demo/2pcs_Baby_Boy_Textured_Cute_Cartoon_Print_Shirt_.jfif',
        affiliate_link: '',
        price: 14.99, category: 'tops',
    },
    {
        name: '2pcs Set Boys Solid Color Long Sleeve Top And Long Pants Set',
        image_url: '/clothes_demo/2pcs_Set_Boys_Solid_Color_Long_Sleeve_Top_And_Long_Pants_Set.jfif',
        affiliate_link: '',
        price: 14.99, category: 'pants',
    },
    {
        name: '2pcs Set Tween Boys Casual Simple Cartoon Cool Car Print Round Neck Short Sleeve T Shirt And Shorts Summer',
        image_url: '/clothes_demo/2pcs_Set_Tween_Boys_Casual_Simple_Cartoon_Cool_Car_Print_Round_Neck_Short_Sleeve_T-Shirt_And_Shorts__Summer.jfif',
        affiliate_link: '',
        price: 44.99, category: 'pants',
    },
    {
        name: '2 Pieces Baby Boy Unisex Newborn Neutral Set It s',
        image_url: '/clothes_demo/2_Pieces_Baby_Boy_Unisex_Newborn_Neutral_Set__It_s_.jfif',
        affiliate_link: '',
        price: 38.99, category: 'tops',
    },
    {
        name: 'Baby Boys Palm Tree Letter Printed Short Sleeve T Shirt And Shorts Set Casual And Comfortable',
        image_url: '/clothes_demo/Baby_Boys__Palm_Tree___Letter_Printed_Short_Sleeve_T-Shirt_And_Shorts_Set__Casual_And_Comfortable.jfif',
        affiliate_link: '',
        price: 12.99, category: 'pants',
    },
    {
        name: 'Baby Boy Flap Pocket Jacket Pants',
        image_url: '/clothes_demo/Baby_Boy_Flap_Pocket_Jacket___Pants.jfif',
        affiliate_link: '',
        price: 11.99, category: 'jackets',
    },
    {
        name: 'Black Casual Collar Short Sleeve Letter',
        image_url: '/clothes_demo/Black_Casual_Collar_Short_Sleeve__Letter_.jfif',
        affiliate_link: '',
        price: 49.99, category: 'pants',
    },
    {
        name: 'Blue Boho Collar Letter Tropical Plants',
        image_url: '/clothes_demo/Blue_Boho_Collar___Letter_Tropical_Plants_.jfif',
        affiliate_link: '',
        price: 35.99, category: 'tops',
    },
    {
        name: 'Boys style set',
        image_url: '/clothes_demo/Boys_style_set.jfif',
        affiliate_link: '',
        price: 33.99, category: 'tops',
    },
    {
        name: 'Boys Two Tone Pocket Patched Shirt Trousers',
        image_url: '/clothes_demo/Boys_Two_Tone_Pocket_Patched_Shirt___Trousers.jfif',
        affiliate_link: '',
        price: 15.99, category: 'pants',
    },
    {
        name: 'Boys Two Tone Pocket Patched Shirt Trousers 1',
        image_url: '/clothes_demo/Boys_Two_Tone_Pocket_Patched_Shirt___Trousers__1_.jfif',
        affiliate_link: '',
        price: 33.99, category: 'pants',
    },
    {
        name: 'Clothing merchants take a look Our full category wholesale base has been launched',
        image_url: '/clothes_demo/Clothing_merchants__take_a_look__Our_full_category_wholesale_base_has_been_launched.jfif',
        affiliate_link: '',
        price: 11.99, category: 'tops',
    },
    {
        name: 'Conjunto de Roupa Denim com Estampa Ousada e Personalidade em Todo o Tecido Lavagem cida Esp rito Escolar para Menino Pr Adolescente',
        image_url: '/clothes_demo/Conjunto_de_Roupa_Denim_com_Estampa_Ousada_e_Personalidade_em_Todo_o_Tecido__Lavagem__cida__Esp_rito_Escolar_para_Menino_Pr_-Adolescente.jfif',
        affiliate_link: '',
        price: 49.99, category: 'tops',
    },
    {
        name: 'Cute Baby Boy Clothes',
        image_url: '/clothes_demo/Cute_Baby_Boy_Clothes.jfif',
        affiliate_link: '',
        price: 42.99, category: 'tops',
    },
    {
        name: 'download 1',
        image_url: '/clothes_demo/download__1_.jfif',
        affiliate_link: '',
        price: 30.99, category: 'tops',
    },
    {
        name: 'Mint Green Casual Collar Short Sleeve Letter',
        image_url: '/clothes_demo/Mint_Green_Casual_Collar_Short_Sleeve__Letter_.jfif',
        affiliate_link: '',
        price: 29.99, category: 'pants',
    },
    {
        name: 'Multicolor Casual Collar Short Sleeve',
        image_url: '/clothes_demo/Multicolor_Casual_Collar_Short_Sleeve_.jfif',
        affiliate_link: '',
        price: 11.99, category: 'pants',
    },
    {
        name: 'Multicolor Casual Collar Embellished Slight',
        image_url: '/clothes_demo/Multicolor_Casual_Collar_____Embellished_Slight_.jfif',
        affiliate_link: '',
        price: 23.99, category: 'tops',
    },
    {
        name: 'Pink Casual Collar Animal Cartoon Embellished',
        image_url: '/clothes_demo/Pink_Casual_Collar___Animal_Cartoon__Embellished_.jfif',
        affiliate_link: '',
        price: 44.99, category: 'tops',
    },
    {
        name: 'Pink Collar Floral Letter Plants Slogan',
        image_url: '/clothes_demo/Pink__Collar___Floral_Letter_Plants_Slogan_.jfif',
        affiliate_link: '',
        price: 29.99, category: 'tops',
    },
    {
        name: 'SHEIN USA',
        image_url: '/clothes_demo/SHEIN_USA.jfif',
        affiliate_link: '',
        price: 38.99, category: 'tops',
    },
    {
        name: 'Tween Boys Car Pattern Street Fashion Short Sleeve T Shirt And Shorts Set',
        image_url: '/clothes_demo/Tween_Boys_Car_Pattern_Street_Fashion_Short_Sleeve_T-Shirt_And_Shorts_Set.jfif',
        affiliate_link: '',
        price: 16.99, category: 'pants',
    },
    {
        name: 'Young Boys 2 Piece Set Letter Print Round Neck Short Sleeve Top And Elastic Shorts',
        image_url: '/clothes_demo/Young_Boys__2-Piece_Set_Letter_Print_Round_Neck_Short_Sleeve_Top_And_Elastic_Shorts.jfif',
        affiliate_link: '',
        price: 42.99, category: 'pants',
    },
    {
        name: 'Young Boy Flap Detail Corduroy Jacket Pants Without Tee',
        image_url: '/clothes_demo/Young_Boy_Flap_Detail_Corduroy_Jacket___Pants_Without_Tee.jfif',
        affiliate_link: '',
        price: 30.99, category: 'jackets',
    },
]

const CATEGORIES = ['tops', 'jackets', 'pants', 'dresses', 'shoes', 'accessories']

/* ── Item card ──────────────────────────────────────────── */
function ItemCard({ item, onDelete }) {
    const [deleting, setDeleting] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        await onDelete(item.id)
    }

    const handleCopy = () => {
        if (!item.affiliate_link) return
        navigator.clipboard.writeText(item.affiliate_link)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            className="glass rounded-2xl overflow-hidden group hover:border-violet-500/30 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-[3/4] bg-white/5 overflow-hidden">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={32} className="text-gray-600" />
                    </div>
                )}

                {/* Category badge */}
                {item.category && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/40 text-white text-xs backdrop-blur-sm">
                        {item.category}
                    </div>
                )}

                {/* Price badge */}
                {item.price && (
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30
                          text-green-400 text-xs font-bold backdrop-blur-sm">
                        ${item.price}
                    </div>
                )}

                {/* Delete overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity
                        flex items-center justify-center">
                    <button onClick={handleDelete} disabled={deleting}
                        className="w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors">
                        {deleting
                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <Trash2 size={16} className="text-white" />}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-3 space-y-2">
                <p className="text-white font-semibold text-sm truncate">{item.name}</p>

                {item.affiliate_link ? (
                    <button onClick={handleCopy}
                        className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${copied
                            ? 'bg-green-500/15 border border-green-500/30 text-green-400'
                            : 'bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20'
                            }`}>
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copied!' : 'Copy Affiliate Link'}
                    </button>
                ) : (
                    <p className="text-gray-600 text-xs text-center">No affiliate link</p>
                )}
            </div>
        </motion.div>
    )
}

/* ── Affiliate stats card ───────────────────────────────── */
function AffiliateCard({ label, value, icon, color, sub }) {
    const Icon = icon
    return (
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={18} className="text-white" />
            </div>
            <div>
                <p className="text-white font-bold text-lg leading-none">{value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                {sub && <p className="text-gray-600 text-xs">{sub}</p>}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════
   B2B Dashboard
═══════════════════════════════════════════════════════════ */
export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    /* form state */
    const [name, setName] = useState('')
    const [affiliateLink, setAffiliateLink] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('tops')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [seeding, setSeeding] = useState(false)
    const [toast, setToast] = useState(null)

    /* gallery & affiliate */
    const [items, setItems] = useState([])
    const [fetching, setFetching] = useState(true)
    const [showAffiliate, setShowAffiliate] = useState(false)

    const fileInputRef = useRef(null)

    /* ── toast ──────────────────────────────────────────────── */
    const showToast = (type, msg) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 3500)
    }

    /* ── fetch items ────────────────────────────────────────── */
    const fetchItems = async () => {
        setFetching(true)
        const timer = setTimeout(() => setFetching(false), 5000)
        try {
            const { data, error } = await supabase
                .from('clothing_items')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            setItems(data ?? [])
        } catch (err) {
            console.error("Dashboard fetch error:", err)
        } finally {
            clearTimeout(timer)
            setFetching(false)
        }
    }

    useEffect(() => { fetchItems() }, []) // eslint-disable-line

    /* ── seed demo items ────────────────────────────────────── */
    const seedDemoItems = async () => {
        setSeeding(true)
        const rows = DEMO_CLOTHING.map((d) => ({ ...d, owner_id: user.id }))
        const { error } = await supabase.from('clothing_items').insert(rows)
        if (error) showToast('error', error.message)
        else { showToast('success', '8 demo items added to your store! 🎉'); fetchItems() }
        setSeeding(false)
    }

    /* ── upload image ───────────────────────────────────────── */
    const onFileChange = (e) => {
        const f = e.target.files[0]
        if (!f) return
        setImageFile(f)
        setImagePreview(URL.createObjectURL(f))
    }

    const uploadImage = async (file) => {
        const ext = file.name.split('.').pop()
        const filePath = `${user.id}/${Date.now()}.${ext}`
        const { error } = await supabase.storage.from('clothes')
            .upload(filePath, file, { contentType: file.type, upsert: false })
        if (error) throw error
        return supabase.storage.from('clothes').getPublicUrl(filePath).data.publicUrl
    }

    /* ── submit new item ────────────────────────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return showToast('error', 'Name is required.')
        if (!imageFile) return showToast('error', 'Please select an image.')
        setUploading(true)
        try {
            const imageUrl = await uploadImage(imageFile)
            const { error } = await supabase.from('clothing_items').insert({
                owner_id: user.id,
                name: name.trim(),
                image_url: imageUrl,
                affiliate_link: affiliateLink.trim() || null,
                price: price ? parseFloat(price) : null,
                category,
            })
            if (error) throw error
            showToast('success', 'Item published! ✅')
            setName(''); setAffiliateLink(''); setPrice(''); setImageFile(null); setImagePreview(null)
            fetchItems()
        } catch (err) { showToast('error', err.message) }
        finally { setUploading(false) }
    }

    const handleDelete = async (id) => {
        await supabase.from('clothing_items').delete().eq('id', id)
        setItems((p) => p.filter((i) => i.id !== id))
        showToast('success', 'Item removed.')
    }

    const handleSignOut = async () => { await signOut(); navigate('/auth') }

    /* derived affiliate stats */
    const withLink = items.filter((i) => i.affiliate_link)
    const totalValue = items.reduce((s, i) => s + (i.price || 0), 0).toFixed(2)

    return (
        <div className="min-h-screen page-bg">

            {/* ── Navbar ─────────────────────────────────────────── */}
            <nav className="glass-dark border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img src="/logo.png" alt="KidFit DZ"
                            className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                        <span className="font-bold gradient-text text-lg">KidFit DZ</span>
                        <span className="ml-2 px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/25 text-pink-400 text-xs font-medium">
                            B2B Dashboard
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/store"
                            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-gray-400 hover:text-white text-sm transition-all">
                            <Store size={14} /> View Store
                        </Link>
                        <div className="hidden sm:block text-right">
                            <p className="text-white text-sm font-medium truncate max-w-[150px]">{user?.email}</p>
                        </div>
                        <button onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-gray-400 hover:text-white text-sm transition-all">
                            <LogOut size={15} />
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* ── Top stats ────────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <AffiliateCard label="Total Items" value={items.length} icon={Package} color="bg-violet-500/20" />
                    <AffiliateCard label="With Affiliate Link" value={withLink.length} icon={LinkIcon} color="bg-pink-500/20" />
                    <AffiliateCard label="Catalogue Value" value={`$${totalValue}`} icon={DollarSign} color="bg-green-500/20" />
                    <AffiliateCard label="Store Status" value="Live ✓" icon={Zap} color="bg-blue-500/20" />
                </div>

                {/* ══════════════════════════════════════════════════
            AFFILIATE MARKETING CENTRAL SECTION
        ══════════════════════════════════════════════════ */}
                <div className="glass rounded-3xl overflow-hidden">
                    <button
                        onClick={() => setShowAffiliate((v) => !v)}
                        className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/3 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20
                              border border-yellow-500/25 flex items-center justify-center">
                                <TrendingUp size={18} className="text-yellow-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-bold">مركز التسويق بالعمولة — Affiliate Marketing Central</p>
                                <p className="text-gray-400 text-xs">Share your items and earn commission on every sale</p>
                            </div>
                        </div>
                        <div className="text-gray-400">
                            {showAffiliate ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </button>

                    <AnimatePresence>
                        {showAffiliate && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden border-t border-white/5"
                            >
                                <div className="p-6 space-y-6">

                                    {/* How it works */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            {
                                                step: '1', icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-500/10',
                                                title: 'Customer Tries On',
                                                desc: 'A B2C customer opens your item in the Virtual Try-On viewer'
                                            },
                                            {
                                                step: '2', icon: ShoppingBag, color: 'text-pink-400', bg: 'bg-pink-500/10',
                                                title: 'They Love It → Buy',
                                                desc: 'They click "Buy Now" and are redirected to your affiliate link'
                                            },
                                            {
                                                step: '3', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10',
                                                title: 'You Earn Commission',
                                                desc: 'You earn a percentage from Amazon, Shopify, or any affiliate program'
                                            },
                                        ].map(({ step, icon, color, bg, title, desc }) => {
                                            const Icon = icon
                                            return (
                                                <div key={step} className={`rounded-2xl p-4 border border-white/5 ${bg}`}>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className={`text-2xl font-black ${color}`}>{step}</span>
                                                        <Icon size={18} className={color} />
                                                    </div>
                                                    <p className="text-white font-semibold text-sm">{title}</p>
                                                    <p className="text-gray-400 text-xs mt-1">{desc}</p>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Item affiliate links table */}
                                    {withLink.length > 0 && (
                                        <div>
                                            <p className="text-white font-semibold mb-3 flex items-center gap-2">
                                                <LinkIcon size={16} className="text-violet-400" />
                                                Your Active Affiliate Links ({withLink.length})
                                            </p>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {withLink.map((item) => (
                                                    <AffiliateRow key={item.id} item={item} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {withLink.length === 0 && (
                                        <div className="text-center py-6">
                                            <LinkIcon size={28} className="text-gray-600 mx-auto mb-2" />
                                            <p className="text-gray-400 text-sm">No affiliate links yet.</p>
                                            <p className="text-gray-600 text-xs">Add an affiliate link when uploading items.</p>
                                        </div>
                                    )}

                                    {/* Tips */}
                                    <div className="rounded-2xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/15 p-4">
                                        <p className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                                            <Zap size={14} className="text-yellow-400" /> Pro Tips
                                        </p>
                                        <ul className="space-y-1 text-gray-400 text-xs">
                                            <li>• Use Amazon Associates, ShareASale, or Impact Radius for affiliate links</li>
                                            <li>• Set competitive prices — customers who try on are 3x more likely to buy</li>
                                            <li>• Upload high-quality, flat-lay product images for best try-on results</li>
                                            <li>• Share your store link on social media: <span className="text-violet-400">localhost:5173/store</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Main grid ────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Upload form */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-3xl p-6 shadow-glass sticky top-24 space-y-6">

                            <div className="flex items-center justify-between">
                                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Plus size={20} className="text-violet-400" /> Add New Item
                                </h2>
                                {/* Seed Demo Button */}
                                <button
                                    onClick={seedDemoItems}
                                    disabled={seeding}
                                    title="Seed 8 demo clothing items"
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/25
                             text-yellow-400 text-xs font-medium hover:bg-yellow-500/20 transition-all disabled:opacity-50"
                                >
                                    {seeding
                                        ? <span className="w-3.5 h-3.5 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                                        : <Zap size={13} />}
                                    {seeding ? 'Adding…' : 'Seed Demo'}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Image drop zone */}
                                <div onClick={() => fileInputRef.current?.click()}
                                    className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${imagePreview ? 'border-violet-500/40' : 'border-white/10 hover:border-violet-500/40 bg-white/3'
                                        }`}>
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                                <span className="text-white text-xs font-medium">Click to change</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-3 p-8 h-44">
                                            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                                                <Upload size={22} className="text-violet-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white text-sm font-medium">Upload clothing image</p>
                                                <p className="text-gray-500 text-xs mt-1">PNG, JPG, WEBP · max 10 MB</p>
                                            </div>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} id="item-image" type="file" accept="image/*"
                                        onChange={onFileChange} className="sr-only" />
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="text-gray-400 text-xs mb-1.5 block">Item Name *</label>
                                    <input id="item-name" type="text" value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Premium White Shirt"
                                        required className="input-glass" />
                                </div>

                                {/* Price + Category row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-gray-400 text-xs mb-1.5 flex items-center gap-1">
                                            <DollarSign size={11} /> Price (USD)
                                        </label>
                                        <input id="item-price" type="number" step="0.01" min="0" value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.00" className="input-glass" />
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-xs mb-1.5 flex items-center gap-1">
                                            <Tag size={11} /> Category
                                        </label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)}
                                            className="input-glass appearance-none">
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c} style={{ background: '#0a0a1a' }}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Affiliate link */}
                                <div>
                                    <label className="text-gray-400 text-xs mb-1.5 flex items-center gap-1.5">
                                        <TrendingUp size={11} className="text-yellow-400" />
                                        <span className="text-yellow-400 font-medium">Affiliate Link</span>
                                        <span className="text-gray-600">(earn commission)</span>
                                    </label>
                                    <input id="item-link" type="url" value={affiliateLink}
                                        onChange={(e) => setAffiliateLink(e.target.value)}
                                        placeholder="https://amazon.com/your-item?tag=yourID"
                                        className="input-glass" style={{ borderColor: affiliateLink ? 'rgba(234,179,8,0.4)' : undefined }} />
                                    {affiliateLink && (
                                        <p className="text-yellow-500/70 text-xs mt-1 flex items-center gap-1">
                                            <Check size={10} /> Customers will be sent here after trying on ✓
                                        </p>
                                    )}
                                </div>

                                <button id="item-submit" type="submit" disabled={uploading}
                                    className="btn-gradient w-full py-3.5 rounded-xl text-sm font-semibold shadow-glow-v
                             disabled:opacity-50 transition-transform active:scale-95">
                                    {uploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Uploading…
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Plus size={16} /> Publish Item
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="lg:col-span-3 space-y-4">
                        <h2 className="text-white font-bold text-lg flex items-center justify-between">
                            <span>Your Collection</span>
                            <span className="text-gray-500 text-sm font-normal">{items.length} items</span>
                        </h2>

                        {fetching ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="glass rounded-2xl overflow-hidden">
                                        <div className="aspect-[3/4] shimmer" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-3 shimmer rounded w-3/4" />
                                            <div className="h-6 shimmer rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="glass rounded-3xl p-16 text-center">
                                <ImageIcon size={40} className="text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">No items yet</p>
                                <p className="text-gray-600 text-sm mt-1 mb-4">Click <strong className="text-yellow-400">Seed Demo</strong> to instantly add 8 example items!</p>
                                <button onClick={seedDemoItems} disabled={seeding}
                                    className="btn-gradient px-6 py-3 rounded-xl text-sm font-semibold mx-auto">
                                    <span className="flex items-center gap-2">
                                        <Zap size={15} /> Seed Demo Store
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <ItemCard key={item.id} item={item} onDelete={handleDelete} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div key="toast"
                        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }}
                        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-glass text-sm font-medium ${toast.type === 'success'
                            ? 'bg-green-500/15 border border-green-500/25 text-green-400'
                            : 'bg-red-500/15 border border-red-500/25 text-red-400'
                            }`}>
                        {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

/* ── Affiliate link row ──────────────────────────────────── */
function AffiliateRow({ item }) {
    const [copied, setCopied] = useState(false)
    const copy = () => {
        navigator.clipboard.writeText(item.affiliate_link)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
            {item.image_url && (
                <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                <p className="text-gray-500 text-xs truncate">{item.affiliate_link}</p>
            </div>
            {item.price && (
                <span className="text-green-400 text-sm font-bold flex-shrink-0">${item.price}</span>
            )}
            <button onClick={copy}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20'
                    }`}>
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy'}
            </button>
            <a href={item.affiliate_link} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 text-gray-500 hover:text-white transition-colors">
                <ExternalLink size={14} />
            </a>
        </div>
    )
}
