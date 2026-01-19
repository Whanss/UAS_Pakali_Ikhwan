# Dashboard Analisis Performa E-Sports (PUBG MOBILE) Mahasiswa STMIK Lombok - UAS

Aplikasi Dashboard Dinamis berbasis Web yang dikembangkan menggunakan Node.js, Express.js, MySQL, EJS, dan D3.js.
Aplikasi ini digunakan untuk menganalisis data performa aktivitas simulasi kompetitif digital mahasiswa STMIK Lombok, yang disajikan dalam bentuk visualisasi data interaktif.

## Identitas Mahasiswa

- **Nama Lengkap**: Ikhwan Maulana Ivansyah
- **NIM**: SI20230016
- **Program Studi**: Sistem Informasi
- **Semester**: 5

## 📊 Studi Kasus

- **Bidang**: E-Sports/Game
- **Tema**: Analisis Statistik Performa Pemain PUBG Mobile
- **Deskripsi**:
  Aplikasi ini memvisualisasikan data performa mahasiswa dalam kompetisi e-sports PUBG Mobile yang diambil dari database MySQL melalui REST API. Dashboard menyajikan analisis mendalam mengenai:
  - **Level Skill (Tier)**: Distribusi kemampuan teknis pemain.
  - **Efektivitas Eliminasi**: Total poin eliminasi yang diperoleh dalam kompetisi.
  - **Kontribusi Dampak (Damage)**: Total kontribusi damage yang diberikan terhadap lawan.
  - **Durasi Bertahan (Survival Time)**: Rata-rata waktu bertahan hidup dalam menit.
  - **Korelasi Performa**: Hubungan statistik antara jumlah eliminasi dengan peringkat juara (Rank Placement).

## 🚀 Fitur Dashboard

Dashboard dilengkapi dengan **Statistik Ringkas** dan **6 Grafik Dinamis** yang dibangun menggunakan library **Chart.js**:

### Statistik Ringkas:

- **Total Eliminasi**: Total keseluruhan jumlah eliminasi dari semua pertandingan
- **Total Damage**: Total kontribusi damage dari semua pertandingan
- **Rata-rata Akurasi Headshot**: Persentase rata-rata headshot rate dari semua pemain

### Grafik Dinamis:

1. **Bar Chart**: Total **Eliminasi** berdasarkan **Tier/Tingkat Skill** pemain
2. **Bar Chart**: Rata-rata **Total Damage** berdasarkan **Tier**
3. **Pie Chart**: Persentase Distribusi **Kategori Kompetisi** (Game Mode)
4. **Bar Chart**: Persentase Distribusi **Tier/Tingkat Skill** pemain
5. **Line Chart**: Tren **Headshot Rate (%)** berdasarkan **Tanggal Pertandingan**
6. **Scatter Plot**: Korelasi antara **Akurasi Presisi (%)** vs **Total Damage**

### Tabel Data:

- **Tabel Data Lengkap** dengan informasi detail setiap pertandingan yang mengambil data langsung dari MySQL melalui REST API
- Kolom: Username, Tier, Mode Kompetisi, Eliminasi, Total Damage, Peringkat, Durasi Bertahan, Akurasi Presisi, Tanggal

## 📁 Struktur Proyek

```
jsALI/
├── config/
│   ├── db.js              # Konfigurasi koneksi MySQL
│   └── text-db.js         # Script untuk testing koneksi database
├── routes/
│   └── api.js             # Endpoint REST API (/api/stats) untuk menyuplai data ke frontend
├── views/
│   └── index.ejs          # Template EJS halaman utama dashboard
├── public/
│   └── js/
│       └── chart.js       # Logika fetch API dan rendering grafik Chart.js
├── server.js              # Server utama Express.js
├── package.json           # Dependensi dan konfigurasi proyek
├── .env                   # File konfigurasi environment (DB kredensial, PORT)
└── README.md              # Dokumentasi proyek
```

## ⚙️ Instalasi & Konfigurasi

### Prerequisites

- Node.js (v14 atau lebih tinggi)
- MySQL Server
- npm atau yarn

### Langkah-langkah Instalasi

1. **Clone atau Download Proyek**:

   ```bash
   cd d:/PKL/jsALI
   ```

2. **Persiapan Database**:
   - Impor file `database.sql` ke MySQL Server Anda.
   - Pastikan database `db__pubg_stmik_lombok` telah terbuat dengan tabel `players` dan `match_stats`.

3. **Konfigurasi Environment**:
   Sesuaikan kredensial database di file `.env`.

4. **Instalasi Dependensi**:

   ```bash
   npm install
   ```

   Dependensi yang akan diinstall:
   - **express**: Web framework
   - **ejs**: Template engine
   - **mysql2**: MySQL driver
   - **dotenv**: Environment variable management
   - **nodemon**: (dev) Auto-restart server saat development

5. **Menjalankan Aplikasi**:

   **Mode Production**:

   ```bash
   npm start
   ```

   **Mode Development** (dengan auto-reload):

   ```bash
   npm run dev
   ```

   Buka browser dan akses `http://localhost:3000`.

6. **Test Koneksi Database** (Opsional):
   ```bash
   node config/text-db.js
   ```

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0+
- **Frontend**: EJS Template Engine, HTML5, CSS3, JavaScript ES6+
- **Visualisasi Data**: Chart.js
- **Development**: Nodemon
- **Environment Management**: Dotenv

## 📝 Catatan Penting

- Pastikan MySQL Server berjalan sebelum menjalankan aplikasi.
- Sesuaikan kredensial database di file `.env` dengan konfigurasi MySQL lokal Anda.
- Port default adalah 3000, dapat diubah melalui variabel `PORT` di `.env`.
- Dashboard akan menampilkan data realtime dari database MySQL.
- Grafik dan statistik diupdate secara otomatis saat halaman dimuat.
