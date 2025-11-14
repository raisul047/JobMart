const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI?.trim();

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in .env.local');
    process.exit(1);
}

async function fixIndexes() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        
        // Drop the bad googleId index
        try {
            console.log('🗑️  Dropping old googleId_1 index...');
            await db.collection('users').dropIndex('googleId_1');
            console.log('✅ Old index dropped');
        } catch (err) {
            if (err.message.includes('index not found')) {
                console.log('ℹ️  Index not found (already removed or never existed)');
            } else {
                throw err;
            }
        }

        // Create new sparse index
        console.log('🔨 Creating new sparse googleId index...');
        await db.collection('users').createIndex({ googleId: 1 }, { unique: true, sparse: true });
        console.log('✅ New sparse index created');

        console.log('✅ All indexes fixed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing indexes:', error.message);
        process.exit(1);
    }
}

fixIndexes();
