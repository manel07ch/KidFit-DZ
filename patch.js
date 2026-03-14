const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend', 'src', 'pages', 'Dashboard.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add Loader2 to lucide imports
content = content.replace(
    /ChevronUp, Store, Tag, Alien,\r?\n} from 'lucide-react'/g,
    "ChevronUp, Store, Tag, Alien, Loader2,\n} from 'lucide-react'"
);

// 2. Add clearAllItems below seedDemoItems
const seedContent = `    /* ── seed demo items ────────────────────────────────────── */
    const seedDemoItems = async () => {
        setSeeding(true)
        const rows = DEMO_CLOTHING.map((d) => ({ ...d, owner_id: user.id }))
        const { error } = await supabase.from('clothing_items').insert(rows)
        if (error) showToast('error', error.message)
        else { showToast('success', '8 demo items added to your store! 🎉'); fetchItems() }
        setSeeding(false)
    }`;

const clearContent = `
    /* ── clear all items ────────────────────────────────────── */
    const [clearing, setClearing] = useState(false)
    const clearAllItems = async () => {
        if (!window.confirm('Are you sure you want to delete ALL your items and photos? This cannot be undone.')) return;
        setClearing(true)
        showToast('success', 'Clearing items... Please wait.')
        try {
            const paths = items.filter(i => i.image_url).map(i => {
                const urlObj = new URL(i.image_url)
                const parts = urlObj.pathname.split('/clothes/')
                return parts.length > 1 ? parts[1] : null
            }).filter(Boolean)
            if (paths.length > 0) Object.assign(await supabase.storage.from('clothes').remove(paths))
            await supabase.from('clothing_items').delete().eq('owner_id', user.id)
            setItems([])
            showToast('success', 'All items and photos have been deleted! 🗑️')
        } catch (err) {
            console.error(err)
            showToast('error', 'Failed to clear items.')
        } finally {
            setClearing(false)
        }
    }`;

content = content.replace(seedContent, seedContent + clearContent);

// 3. Add Clear All Button
const btnTarget = `                                {/* Seed Demo Button */}
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
                                </button>`;

const btnReplace = `                                {/* Clear All Button */}
                                {items.length > 0 && (
                                    <button
                                        onClick={clearAllItems}
                                        disabled={clearing || uploading}
                                        title="Delete all items"
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
                                    >
                                        {clearing ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                        {clearing ? 'Clearing…' : 'Clear All'}
                                    </button>
                                )}
                                {/* Seed Demo Button */}
                                <button
                                    onClick={seedDemoItems}
                                    disabled={seeding || clearing}
                                    title="Seed 8 demo clothing items"
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 text-xs font-medium hover:bg-yellow-500/20 transition-all disabled:opacity-50"
                                >
                                    {seeding ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
                                    {seeding ? 'Adding…' : 'Seed Demo'}
                                </button>`;

content = content.replace(btnTarget, btnReplace);

// 4. Update seed button in empty state
const emptyBtnTarget = `                                <button onClick={seedDemoItems} disabled={seeding}
                                    className="btn-gradient px-6 py-3 rounded-xl text-sm font-semibold mx-auto">
                                    <span className="flex items-center gap-2">
                                        <Zap size={15} /> Seed Demo Store
                                    </span>
                                </button>`;
const emptyBtnReplace = `                                <button onClick={seedDemoItems} disabled={seeding || clearing}
                                    className="btn-gradient px-6 py-3 rounded-xl text-sm font-semibold mx-auto">
                                    <span className="flex items-center gap-2">
                                        {seeding ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />} Seed Demo Store
                                    </span>
                                </button>`;
                                
content = content.replace(emptyBtnTarget, emptyBtnReplace);

fs.writeFileSync(file, content);
console.log('Patched Dashboard.jsx successfully!');
