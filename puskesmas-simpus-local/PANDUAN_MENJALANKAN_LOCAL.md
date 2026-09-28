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

## 💻 3. Cara Manual via Terminal / Command Prompt

Jika ingin menjalankan melalui terminal secara manual:

### Langkah 1: Buka Terminal di Folder Project
- Buka terminal / command prompt / PowerShell / VSCode Terminal pada direktori project ini.

### Langkah 2: Install Dependencies
Jalankan perintah berikut:
```bash
npm install
```
*(Tunggu hingga proses unduh dependencies selesai)*.

### Langkah 3: Jalankan Mode Development
Jalankan perintah:
```bash
npm run dev
```

### Langkah 4: Buka Aplikasi di Browser
Buka browser Anda dan akses:
👉 **`http://localhost:3000`**

Aplikasi SIMPUS Puskesmas Jurumudi Baru sudah berjalan 100% aktif di komputer lokal Anda!

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
