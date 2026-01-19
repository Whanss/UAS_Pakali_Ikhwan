# Aplikasi Dashboard Dinamis - UAS

Aplikasi Dashboard Dinamis menggunakan Node.js, Express.js, MySQL, EJS, dan D3.js untuk analisis data ekonomi (Retail Sales Performance).

## Identitas Mahasiswa
- **Nama Lengkap**: Ikhwan Maulana Ivansyah
- **NIM**: SI20230016
- **Program Studi**: Sistem Informasi
- **Semester**: 5

## Studi Kasus
**Bidang**: Ekonomi
**Tema**: Analisis Penjualan Retail
**Deskripsi**: Aplikasi ini menampilkan visualisasi data performa penjualan retail berdasarkan kategori produk dan tren bulanan. Dashboard mencakup metrik pendapatan (revenue), keuntungan (profit), jumlah transaksi, kuantitas produk terjual, dan tingkat kepuasan pelanggan.

## Fitur Dashboard
Terdapat 6 grafik dinamis menggunakan D3.js:
1. **Bar Chart**: Total Revenue per Kategori.
2. **Line Chart**: Tren Pendapatan Bulanan.
3. **Pie Chart**: Distribusi Kuantitas Produk Terjual per Kategori.
4. **Horizontal Bar Chart**: Total Profit per Kategori.
5. **Area Chart**: Tren Jumlah Transaksi Bulanan.
6. **Scatter Plot**: Rata-rata Kepuasan Pelanggan per Kategori.

Serta tabel data lengkap yang mengambil data langsung dari MySQL melalui REST API.

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
