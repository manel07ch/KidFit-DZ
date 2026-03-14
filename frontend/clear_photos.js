import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ozjtdxuyptlcgeavdnbw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96anRkeHV5cHRsY2dlYXZkbmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjg4ODUsImV4cCI6MjA4ODYwNDg4NX0.WsmDvB4cEoNqqB0jeVUJrFOhhLDrR2fluKvmlgIqWSE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function clearBucketAndTable() {
    console.log('🔄 Starting cleanup process...');

    try {
        // 1. Delete all records from clothing_items first
        console.log('🗑️ Deleting all records from clothing_items table...');
        const { error: dbError } = await supabase
            .from('clothing_items')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
        
        if (dbError) throw dbError;
        console.log('✅ All clothing_items records deleted.');

        // 2. Fetch all folders/files in 'clothes' bucket
        console.log('📂 Fetching files from "clothes" bucket...');
        const { data: list, error: listError } = await supabase.storage.from('clothes').list('', { limit: 1000 });
        if (listError) throw listError;

        if (!list || list.length === 0) {
            console.log('✅ Bucket "clothes" is already empty.');
            return;
        }

        // Collect all file paths (including those inside folders)
        let pathsToDelete = [];
        for (const fileOrFolder of list) {
            if (!fileOrFolder.id && fileOrFolder.name) {
                // It's a folder (user ID folder)
                const folderName = fileOrFolder.name;
                const { data: sublist } = await supabase.storage.from('clothes').list(folderName, { limit: 1000 });
                if (sublist) {
                    sublist.forEach(f => pathsToDelete.push(`${folderName}/${f.name}`));
                }
            } else if (fileOrFolder.id) {
                // It's a file at root
                pathsToDelete.push(fileOrFolder.name);
            }
        }

        if (pathsToDelete.length > 0) {
            console.log(`🗑️ Deleting ${pathsToDelete.length} files from storage...`);
            const { error: deleteError } = await supabase.storage.from('clothes').remove(pathsToDelete);
            if (deleteError) throw deleteError;
            console.log('✅ All files deleted from storage.');
        } else {
            console.log('✅ No actual files found to delete.');
        }

        console.log('🎉 Cleanup finished successfully!');
    } catch (err) {
        console.error('❌ Error during cleanup:', err);
    }
}

clearBucketAndTable();
