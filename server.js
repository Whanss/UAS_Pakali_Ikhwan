const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

// Set EJS sebagai template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Dashboard Analisis PUBG Mobile',
        author: 'Ikhwan Maulana Ivansyah',
        nim: 'SI20230016',
        prodi: 'Sistem Informasi',
        semester: 5
    });
});

// API Routes
app.use('/api', apiRoutes);

// Start Server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🎮 PUBG MOBILE ANALYTICS DASHBOARD');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`👤 Author: Ikhwan Maulana Ivansyah`);
    console.log(`🎓 NIM: SI20230016 | Prodi: Sistem Informasi | Semester: 5`);
    console.log(`🏫 Kampus: STMIK Lombok`);
    console.log('='.repeat(50));
});