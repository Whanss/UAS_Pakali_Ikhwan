const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET All Match Data (dengan JOIN)
router.get('/all-data', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                m.id,
                p.username,
                p.nama_lengkap,
                p.tier,
                p.umur,
                p.jurusan,
                p.semester,
                m.match_date,
                m.game_mode,
                m.kills,
                m.damage,
                m.survival_time,
                m.placement,
                m.headshot_rate,
                m.assists
            FROM match_stats m
            JOIN players p ON m.player_id = p.id
            ORDER BY m.match_date DESC, p.username
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET Players Summary
router.get('/players-summary', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                tier,
                COUNT(*) as total_players,
                AVG(umur) as avg_age,
                AVG(total_matches) as avg_matches
            FROM players
            GROUP BY tier
            ORDER BY 
                FIELD(tier, 'Conqueror', 'Ace', 'Crown', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze')
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;