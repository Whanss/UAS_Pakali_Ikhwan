const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/stats', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.username, p.tier, p.jurusan,
                m.game_mode AS kategori_kompetisi,
                m.kills AS eliminasi,
                m.damage AS total_damage,
                m.placement AS peringkat_bertahan,
                m.survival_time AS durasi_detik,
                ROUND(m.survival_time / 60, 2) AS durasi_bertahan,
                m.headshot_rate AS akurasi_presisi,
                m.assists,
                m.match_date AS tanggal
            FROM match_stats m
            JOIN players p ON m.player_id = p.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;