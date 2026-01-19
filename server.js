const express = require("express");
const path = require("path");
const apiRoutes = require("./routes/api");
const db = require("./config/db"); // 1. Tambahkan import koneksi database

const app = express();
const PORT = process.env.PORT || 3000; // 2. Gunakan port dari .env agar bisa di-hosting

// Set EJS sebagai template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Routes Utama
app.get("/", async (req, res) => {
  // 3. Tambahkan 'async' di sini
  try {
    // 4. Ambil data dari database untuk ditampilkan di tabel pertama kali
    const [rows] = await db.query(`
            SELECT 
                p.username,
                p.tier,
                m.game_mode AS kategori_kompetisi,
                m.kills AS eliminasi,
                m.damage AS total_damage,
                m.placement AS peringkat_bertahan,
                ROUND(m.survival_time / 60, 2) AS durasi_bertahan,
                m.headshot_rate AS akurasi_presisi,
                m.match_date AS tanggal
            FROM match_stats m
            JOIN players p ON m.player_id = p.id
            ORDER BY m.match_date DESC
        `);

    // 5. Kirim data hasil query ke index.ejs
    res.render("index", {
      title: "Dashboard Analisis PUBG Mobile",
      author: "Ikhwan Maulana Ivansyah",
      nim: "SI20230016",
      prodi: "Sistem Informasi",
      semester: 5,
      data: rows, // <-- Variabel 'data' ini yang akan dibaca oleh tabel di index.ejs
    });
  } catch (error) {
    console.error("Error rendering page:", error);
    res.render("index", {
      title: "Dashboard Analisis PUBG Mobile",
      author: "Ikhwan Maulana Ivansyah",
      nim: "SI20230016",
      prodi: "Sistem Informasi",
      semester: 5,
      data: [], // Kirim array kosong jika database error agar web tidak crash
    });
  }
});

// API Routes
app.use("/api", apiRoutes);

// Start Server
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🎮 PUBG MOBILE ANALYTICS DASHBOARD");
  console.log("=".repeat(50));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log("=".repeat(50));
});
