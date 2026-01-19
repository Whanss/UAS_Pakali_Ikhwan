const db = require('./db');

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('Database connection successful. Result:', rows[0].result);
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
}

testConnection();
