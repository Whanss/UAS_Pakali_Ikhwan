# Dashboard Analisis Performa E-Sports (PUBG MOBILE) Mahasiswa STMIK Lombok - UAS

Aplikasi Dashboard Dinamis berbasis Web yang dikembangkan menggunakan Node.js, Express.js, MySQL, EJS, dan D3.js.
Aplikasi ini digunakan untuk menganalisis data performa aktivitas simulasi kompetitif digital mahasiswa STMIK Lombok, yang disajikan dalam bentuk visualisasi data interaktif.

## Identitas Mahasiswa
- **Nama Lengkap**: Ikhwan Maulana Ivansyah
- **NIM**: SI20230016
- **Program Studi**: Sistem Informasi
- **Semester**: 5

## Studi Kasus
**Bidang**: E-Sports/game
**Tema**: Analisis Statistik Performa Pemain PUBG Mobile
**Deskripsi**: Aplikasi ini memvisualisasikan data performa mahasiswa dalam kompetisi e-sports PUBG Mobile yang diambil dari database MySQL melalui REST API. Dashboard menyajikan analisis mendalam mengenai:
Level Skill (Tier): Distribusi kemampuan teknis pemain.
1.Efektivitas Eliminasi: Total poin eliminasi yang diperoleh dalam kompetisi.
2.Kontribusi Dampak (Damage): Total kontribusi damage yang diberikan terhadap lawan.
3.Durasi Bertahan (Survival Time): Rata-rata waktu bertahan hidup dalam menit.
4.Korelasi Performa: Hubungan statistik antara jumlah eliminasi dengan peringkat juara (Rank Placement).

## Fitur Dashboard
1.Terdapat 6 grafik dinamis menggunakan D3.js:
2.Bar Chart: Total Eliminasi / Skor Poin berdasarkan Tier/tingkat.
3.ine Chart: Tren Total Damage Harian.
4.Pie Chart: Persentase Kategori Kompetisi.
5.orizontal Bar Chart: Top 5 Username dengan Eliminasi / Skor Poin Tertinggi
6.Pie Chart: Tren Rata-rata Durasi Bertahan (Menit).
7.Scatter Plot: Korelasi antara Akurasi Presisi (%) vs Peringkat bertahan (dalam game).
8.Serta tabel data lengkap yang mengambil data langsung dari MySQL melalui REST API.

## Struktur Proyek
- `config/db.js`: Konfigurasi koneksi MySQL.
- `config/text-db.js`: Script untuk testing koneksi database.
- `routes/api.js`: Endpoint REST API untuk menyuplai data ke frontend.
- `views/index.ejs`: Halaman utama dashboard.
- `public/js/chart.js`: Logika fetch API dan rendering grafik D3.js.
- `server.js`: Server utama Express.js.
- `database.sql`: File ekspor skema dan data database.

## Cara Menjalankan
1. **Persiapan Database**:
   - Impor file `database.sql` ke MySQL Server Anda.
   - Pastikan database `db__pubg_stmik_lombok` telah terbuat.

2. **Konfigurasi Environment**:
   - Sesuaikan kredensial database di file `.env`.
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=db__pubg_stmik_lombok
   PORT=3000
   ```

3. **Instalasi Dependensi**:
   ```bash
   npm install
   ```

4. **Menjalankan Aplikasi**:
   ```bash
   npm start
   ```
   Buka browser dan akses `http://localhost:3000`.

5. **Test Koneksi Database** (Opsional):
   ```bash
   node config/text-db.js
   ```
