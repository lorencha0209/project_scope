const bcrypt = require('bcryptjs');

/**
 * Script to generate password hash for the default user
 * Run this script to generate the hash for "Anto0929**"
 */

async function generatePasswordHash() {
    const password = 'Anto0929**';
    const saltRounds = 10;
    
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('🔐 Password Hash Generated:');
        console.log('========================');
        console.log(`Password: ${password}`);
        console.log(`Hash: ${hash}`);
        console.log('========================');
        console.log('Copy this hash to the database schema file');
        
        // Verify the hash works
        const isValid = await bcrypt.compare(password, hash);
        console.log(`Hash verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
        
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

// Run if called directly
if (require.main === module) {
    generatePasswordHash();
}

module.exports = generatePasswordHash;
