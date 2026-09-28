# PANDUAN MENJALANKAN PROJECT SIMPUS DI KOMPUTER LOKAL (LOCALHOST)

Aplikasi ini adalah **Sistem Informasi Manajemen Puskesmas (SIMPUS) Terintegrasi ILP (Integrasi Layanan Primer)** dengan fitur Pendaftaran Online, Antrean Real-time, Pelayanan Medis Poli, Farmasi/Apotek, Rekam Medis Elektronik (RME), dan Cetak Struk Tiket Thermal Printer.

---

## 📋 1. Kebutuhan Sistem (Prerequisites)

Sebelum menjalankan aplikasi di komputer lokal (Laptop/PC), pastikan perangkat Anda telah terpasang:
1. **Node.js** (Versi 18 LTS atau Versi 20 LTS disarankan).
   - Unduh dari situs resmi: [https://nodejs.org/](https://nodejs.org/)
   - Cek instalasi via terminal / command prompt:
     ```bash
     node -v
     npm -v
     ```
2. **Web Browser** terbaru (Google Chrome, Microsoft Edge, Mozilla Firefox, atau Opera).
3. **Printer Thermal** (Opsional, ukuran kertas rol 58mm atau 80mm seperti POS-58, POS-80, Epson TM Series, Xprinter jika ingin tes cetak tiket fisik).

---

## 🚀 2. Cara Cepat Menjalankan (1-Klik)

### Di Komputer Windows:
1. Ekstrak file zip project ke folder pilihan Anda (contoh: `D:\simpus-puskesmas`).
2. Masuk ke dalam folder hasil ekstrak.
3. Klik 2x pada file **`run-local.bat`**.
4. Script akan otomatis:
   - Memeriksa Node.js
   - Menginstall dependencies (`npm install`) jika belum ada
   - Menjalankan server aplikasi di `http://localhost:3000`
   - Membuka browser Anda secara otomatis!

### Di Komputer Mac / Linux:
1. Buka Terminal pada folder project.
2. Jalankan perintah:
   ```bash
   ./run-local.sh
   ```
3. Script akan otomatis menjalankan dependencies dan membuka browser ke `http://localhost:3000`.

---

## 💻 3. Cara Membuka & Menjalankan di Visual Studio Code (VS Code)

Bagi pengembang atau mahasiswa yang ingin membuka project ini di **VS Code**:

1. **Buka Folder di VS Code**:
   - Jalankan VS Code di komputer Anda.
   - Pilih menu **File** -> **Open Folder...** (atau tekan `Ctrl + K, Ctrl + O`).
   - Pilih folder project ini: `puskesmas-simpus-local` (atau folder hasil ekstrak).

2. **Buka Terminal Terintegrasi VS Code**:
   - Tekan shortcut keyboard: `` Ctrl + ` `` (Ctrl + Backtick) atau pilih menu **Terminal** -> **New Terminal**.

3. **Jalankan Aplikasi dari Terminal VS Code**:
   ```bash
   # Install dependencies (hanya saat pertama kali):
   npm install

   # Jalankan server aplikasi:
   npm run dev
   ```

4. **Akses Aplikasi**:
   - Klik link `http://localhost:3000` yang muncul di terminal (atau buka browser dan ketik `http://localhost:3000`).

---

## 🗄️ 4. Cara Menghubungkan ke Database MySQL (phpMyAdmin / XAMPP / Laragon)

Aplikasi ini sudah dirancang **Dual-Mode cerdas**:
- **Otomatis terhubung ke MySQL** jika database `puskesmas_pondokbenda` tersedia.
- Jika MySQL belum dinyalakan, aplikasi tetap berjalan lancar menggunakan in-memory store tanpa crash.

Berikut langkah mudah menghubungkan dengan file database `database.sql` yang sudah disediakan:

### Langkah A: Nyalakan MySQL (XAMPP / Laragon)
1. Buka aplikasi **XAMPP Control Panel** atau **Laragon**.
2. Klik tombol **Start** pada modul **Apache** dan **MySQL**.

### Langkah B: Impor Database `database.sql`
1. Buka browser dan buka **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Klik tab **Import** (atau buat database baru bernama `puskesmas_pondokbenda` terlebih dahulu).
3. Klik tombol **Choose File / Pilih File**, lalu arahkan ke file **`database.sql`** yang ada di dalam root folder project ini.
4. Klik tombol **Go / Kirim** di bagian bawah halaman.
5. Tunggu beberapa detik hingga muncul pesan sukses berwarna hijau: *"Import has been successfully finished"*.
   *(Seluruh tabel `polis`, `queue_tickets`, `medical_records`, `doctors`, `surveys`, dll. sudah berhasil terbuat beserta data master lengkapnya).*

### Langkah C: Konfigurasi File `.env` di VS Code
1. Di VS Code, buat file baru di root folder bernama **`.env`** (atau salin dari `.env.example`).
2. Tuliskan konfigurasi database Anda:
   ```env
   # Konfigurasi Database MySQL
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=puskesmas_pondokbenda
   PORT=3000
   ```
   *(Catatan: Jika Anda pengguna XAMPP default di Windows, `DB_USER=root` dan `DB_PASSWORD` dikosongkan tanpa spasi).*

3. Jalankan kembali aplikasi di Terminal VS Code:
   ```bash
   npm run dev
   ```
4. Perhatikan log di terminal:
   ```text
   [Database] Terhubung ke MySQL Database (localhost:3306/puskesmas_pondokbenda)
   [Database] Sinkronisasi data antrean dari MySQL berhasil.
   Puskesmas App running on http://0.0.0.0:3000
   ```
   Setiap ada pasien baru mendaftar atau antrean dipanggil, data akan langsung tersimpan secara otomatis dan persisten ke database MySQL Anda!

---

## ⚙️ 4. Pengaturan Port & Variabel Lingkungan (.env)

Aplikasi secara default menggunakan Port `3000`. Jika port 3000 sedang digunakan oleh aplikasi lain di komputer Anda, Anda dapat menggantinya dengan mudah:

1. Buat file `.env` di root folder (bisa salin dari `.env.example`).
2. Masukkan nomor port yang diinginkan, contoh:
   ```env
   PORT=8080
   ```
3. Jalankan kembali:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:8080`.

---

## 🖨️ 5. Cara Cetak Tiket ke Printer Thermal (POS 58mm / 80mm)

Sistem telah dilengkapi dengan **Dedicated Print CSS Media Query (`@media print`)**:
1. Hubungkan printer thermal (USB atau Bluetooth) ke komputer Anda.
2. Di aplikasi SIMPUS, masuk ke menu **Pendaftaran Online** atau buka nomor tiket antrean di halaman **Antrean**.
3. Klik tombol **"Print Ticket"**.
4. Jendela dialog cetak browser akan muncul:
   - **Destination**: Pilih nama Printer Thermal Anda (misal: POS-58, POS-80, atau Generic Text).
   - **Paper size**: Pilih `80mm Roll` atau `58mm Roll`.
   - **Margins**: Pilih `None` (Tanpa margin).
   - **Options**: Hilangkan centang `Headers and footers` (agar URL browser tidak tercetak).
5. Klik **Print / Cetak**.
   Struk akan tercetak bersih, rapi, dan tajam sesuai standar kertas thermal antrean rumah sakit/puskesmas.

---

## 📦 6. Cara Build untuk Mode Production

Jika ingin mem-build aplikasi menjadi file statis & bundle Node.js yang siap di-deploy ke server mandiri (VPS / Windows Server):

```bash
# 1. Build project
npm run build

# 2. Jalankan server production
npm start
```
Server production akan berjalan secara optimal dan menyajikan aplikasi langsung dari folder `dist/`.

---

## 🗄️ 7. Informasi Basis Data (Database)

- Secara default, aplikasi langsung aktif menggunakan **In-Memory Store & Realtime State** yang sangat cepat tanpa perlu konfigurasi MySQL tambahan.
- Jika untuk keperluan tugas akhir / skripsi memerlukan skema basis data relasional MySQL, file **`database.sql`** telah disertakan di dalam folder ini dan siap diimport ke **phpMyAdmin / HeidiSQL / MySQL Workbench**.

---
*SIMPUS Terintegrasi ILP - Siap Dijalankan di Lingkungan Lokal.*
