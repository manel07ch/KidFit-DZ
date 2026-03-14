const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ozjtdxuyptlcgeavdnbw.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96anRkeHV5cHRsY2dlYXZkbmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjg4ODUsImV4cCI6MjA4ODYwNDg4NX0.WsmDvB4cEoNqqB0jeVUJrFOhhLDrR2fluKvmlgIqWSE';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
    console.log('Fetching all clothing items to delete...');
    const { data: items, error: fetchError } = await supabase.from('clothing_items').select('id');
    
    if (fetchError) {
        console.error('Error fetching items:', fetchError);
        return;
    }

    console.log(`Found ${items.length} items to delete.`);
    
    // Some rows might fail if RLS blocks it, but we'll try to delete each.
    let count = 0;
    for (const item of items) {
        const { error } = await supabase.from('clothing_items').delete().eq('id', item.id);
        if (error) {
            console.error(`Failed to delete ${item.id}:`, error.message);
        } else {
            console.log(`Deleted item ${item.id}`);
            count++;
        }
    }
    
    console.log(`Successfully deleted ${count} items from the database!`);
}

run();
