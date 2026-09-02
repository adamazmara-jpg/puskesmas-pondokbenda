# 🏥 Panduan Langkah Demi Langkah: Running & Hosting Lokal Puskesmas dengan Laragon / XAMPP

Panduan ini disusun secara bertahap agar Anda dapat langsung mempraktikkannya dan mengirimkan bukti (screenshot/foto) di setiap prosesnya.

---

## ⚖️ Rekomendasi Teknologi: PHP (Laravel) vs Python

### **Saran Terbaik untuk Puskesmas: PHP (Laravel 11 + MySQL)** 🌟

Untuk kebutuhan operasional Puskesmas dan kenyamanan pasien, **PHP (Laravel)** adalah pilihan yang **paling optimal dan praktis**, dengan alasan:

1. **Kemudahan Infrastruktur & Hosting**
   - Sebagian besar server Dinas Kesehatan, Puskesmas, maupun hosting lokal di Indonesia menggunakan **Laragon, XAMPP, atau cPanel (MySQL + Apache/Nginx)**.
   - PHP (Laravel) dapat langsung berjalan di Laragon/XAMPP tanpa perlu setup server rumit. Jika menggunakan Python (Django/FastAPI), Anda memerlukan konfigurasi WSGI, Gunicorn, Supervisor, dan Virtual Environment yang jauh lebih kompleks untuk staf IT Puskesmas.
2. **Kenyamanan Pasien (Sangat Ringan di HP)**
   - Tampilan antrean pasien dapat dimuat dengan sangat cepat di smartphone (HP) Android/iOS dengan konsumsi kuota yang minim.
3. **Kenyamanan Petugas Loket Puskesmas**
   - Dashboard petugas di PC/Laptop Puskesmas sangat responsif untuk pemanggilan nomor antrean, cetak tiket, hingga grafik laporan bulanan.
4. **Maintenance & Ketersediaan SDM**
   - Mayoritas teknisi IT Dinkes/Puskesmas sudah familiar dengan Laravel & PHP, sehingga mudah dirawat dalam jangka panjang.

---

## 📋 PERSIAPAN AWAAL (Software yang Wajib Ada)

Sebelum mulai, pastikan di komputer/laptop Anda sudah terpasang:
1. **Laragon Full** ATAU **XAMPP** (Saran: **Laragon** lebih cepat dan praktis).
2. **Node.js** (Versi 18 atau 20+).
3. **Git** (Opsional, untuk download dari GitHub).

---

## 🚦 CARA LENGKAP BISA DIJALANKAN & HOSTING LOKAL (PROSES DEMI PROSES)

Anda dapat mengikuti **5 TAHAP UTAMA** berikut. Di setiap akhir tahap, Anda bisa mengirimkan **bukti screenshot** agar kita bisa mengecek bersama!

---

### 🔹 TAHAP 1: Ekstrak / Masukkan Folder Proyek ke Laragon

1. Buka folder instalasi Laragon di komputer Anda (biasanya di `C:\laragon\www`).
2. Buat folder baru bernama **`puskesmas-antrean`** di dalam `C:\laragon\www\`.
3. Salin/masukkan seluruh isi file proyek Anda ke dalam folder `C:\laragon\www\puskesmas-antrean`.
4. Buka aplikasi **Laragon**, lalu klik **Start All** (memastikan Apache dan MySQL berwarna hijau).

📸 **BUKTI PROSES TAHAP 1 yang bisa dikirimkan:**
> *Screenshot aplikasi Laragon dengan status Apache & MySQL sudah "Started" (tombol berwarna hijau).*

---

### 🔹 TAHAP 2: Buat Database di MySQL (HeidiSQL / phpMyAdmin)

**Jika Menggunakan Laragon:**
1. Klik tombol **Database** di Laragon (akan membuka HeidiSQL).
2. Klik **Open** (Default Username: `root`, Password: *kosong*).
3. Klik kanan di area kiri -> **Create new** -> **Database**.
4. Beri nama database: **`puskesmas_antrean`** -> Klik **OK**.

**Jika Menggunakan XAMPP:**
1. Buka browser, ketik alamat: `http://localhost/phpmyadmin`
2. Klik menu **New** / **Baru** di sebelah kiri.
3. Isi nama database: **`puskesmas_antrean`** -> Klik **Buat**.

📸 **BUKTI PROSES TAHAP 2 yang bisa dikirimkan:**
> *Screenshot phpMyAdmin / HeidiSQL yang memperlihatkan nama database `puskesmas_antrean` sudah berhasil dibuat.*

---

### 🔹 TAHAP 3: Konfigurasi File Environment `.env`

1. Buka folder `C:\laragon\www\puskesmas-antrean`.
2. Cari file bernama `.env.example`, lalu buat salinannya dan ubah namanya menjadi **`.env`**.
3. Buka file `.env` tersebut menggunakan Notepad / VS Code.
4. Sesuaikan bagian database seperti berikut:

```env
APP_NAME="Puskesmas Antrean"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=puskesmas_antrean
DB_USERNAME=root
DB_PASSWORD=
```

📸 **BUKTI PROSES TAHAP 3 yang bisa dikirimkan:**
> *Screenshot file `.env` yang sudah disesuaikan nama databasenya.*

---

### 🔹 TAHAP 4: Install Vendor, Generate Key & Isikan Data Awal (Migration + Seeder)

1. Buka **Terminal** di Laragon (atau Buka Command Prompt/CMD di folder proyek Anda).
2. Pastikan posisi folder berada di `C:\laragon\www\puskesmas-antrean`.
3. Jalankan perintah berikut satu per satu secara berurutan:

```bash
# 1. Install library backend PHP
composer install

# 2. Generate kunci keamanan Laravel
php artisan key:generate

# 3. Buat tabel & isi otomatis akun Super Admin, Admin, & Petugas Loket
php artisan migrate:fresh --seed

# 4. Install dependensi frontend / Tailwind CSS
npm install

# 5. Build asset frontend
npm run build
```

📸 **BUKTI PROSES TAHAP 4 yang bisa dikirimkan:**
> *Screenshot layar Terminal saat perintah `php artisan migrate:fresh --seed` selesai dijalankan dengan pesan "Database seeding completed successfully".*

---

### 🔹 TAHAP 5: Jalankan & Uji Coba Aplikasi!

#### **Cara A (Sangat Mudah dengan Laragon Auto Domain):**
Langsung buka browser di laptop Anda, lalu akses:
👉 **`http://puskesmas-antrean.test`**

#### **Cara B (Dengan Artisan Serve):**
Di Terminal Laragon, ketik perintah:
```bash
php artisan serve
```
Lalu buka browser dan akses:
👉 **`http://127.0.0.1:8000`**

---

## 🔑 KREDENSIAL LOGIN AKUN DEFAULTS (Hasil Seeder)

Gunakan akun berikut untuk login dan menguji coba sistem:

| Role Akses | Email Login | Password | Fungsi di Puskesmas |
| --- | --- | --- | --- |
| 🛡️ **Super Admin** | `superadmin@puskesmas.go.id` | `password` | Pengaturan IT, User & Sistem |
| 👨‍⚕️ **Admin Puskesmas** | `admin@puskesmas.go.id` | `password` | Manajemen Laporan IKM, Master Dokter & Poli |
| 🖥️ **Petugas Loket** | `petugas@puskesmas.go.id` | `password` | Pemanggilan Antrean & Cetak Tiket Loket |

---

## 📲 Trik Bikin Bisa Diakses Dari HP Pasien di Area Puskesmas (Local WiFi)

Jika laptop/PC di Puskesmas terhubung ke jaringan Wi-Fi Puskesmas yang sama dengan HP pasien/petugas:
1. Buka Command Prompt (CMD), ketik `ipconfig` untuk melihat IP laptop Anda (misal: `192.168.1.5`).
2. Jalankan server Laravel dengan melampirkan host 0.0.0.0:
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```
3. Buka HP pasien yang terhubung ke Wi-Fi yang sama, ketik di browser HP: `http://192.168.1.5:8000`
4. Pendaftaran antrean pasien bisa langsung dipakai secara real-time!

---

Silakan ikuti **Tahap 1** terlebih dahulu. Anda bisa mengirimkan foto/screenshot hasilnya ke saya, dan saya akan membantu memandu langkah selanjutnya hingga aplikasi berjalan lancar! 🚀
