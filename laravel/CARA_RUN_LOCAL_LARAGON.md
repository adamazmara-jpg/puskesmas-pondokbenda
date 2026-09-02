# 🚀 CARA MENJALANKAN PROJECT GOOGLE AI STUDIO DI LOCALHOST (LARAGON / PC LOKAL)

Project yang dibuat di **Google AI Studio** ini adalah aplikasi web modern berbasis **Node.js + React + Vite + Express + MySQL**.

Berikut adalah panduan **langkah demi langkah** untuk mendownload dan menjalankannya di komputer lokal Anda (menggunakan Laragon / Node.js):

---

## 📥 LANGKAH 1: Download / Export Project dari Google AI Studio

1. Lihat di pojok kanan atas layar Google AI Studio.
2. Klik tombol **Export / Download** (atau ikon **ZIP**).
3. Simpan file `.zip` ke komputer Anda.
4. Ekstrak file ZIP tersebut ke folder Laragon Anda, contohnya:
   👉 `C:\laragon\www\antrean-puskesmas-aistudio`

---

## 🗄️ LANGKAH 2: Import Database MySQL ke HeidiSQL / Laragon

Di dalam folder project yang diekstrak, sudah tersedia file **`database.sql`** yang berisi skema tabel poliklinik, dokter, jadwal, dan tiket antrean!

1. Buka **Laragon** -> Klik **Database** (Buka HeidiSQL).
2. Klik kanan pada nama sesi `Laragon.MySQL` -> pilih **Create new** -> **Database**.
3. Beri nama database: **`puskesmas_pondokbenda`** (atau `puskesmas_antrean`).
4. Klik tab **Query** (atau tekan `Ctrl + T`).
5. Buka file **`database.sql`** dari folder project, copy seluruh raises/kodenya, lalu paste di tab Query HeidiSQL.
6. Tekan tombol **F9** (Play) untuk mengeksekusi query.
7. Tekan **F5** (Refresh). Semua tabel (`polis`, `doctors`, `queue_tickets`, `articles`, dll.) otomatis siap digunakan!

---

## ⚡ LANGKAH 3: Install Dependencies & Jalankan Server

1. Buka **Terminal Laragon** (atau Command Prompt / PowerShell / VS Code Terminal).
2. Masuk ke folder project yang diekstrak:
   ```cmd
   cd C:\laragon\www\antrean-puskesmas-aistudio
   ```
3. Install seluruh paket library Node.js:
   ```cmd
   npm install
   ```
4. Buat file `.env` untuk konfigurasi environment (salin dari `.env.example`):
   ```cmd
   copy .env.example .env
   ```
5. Jalankan aplikasi dalam mode Development:
   ```cmd
   npm run dev
   ```

---

## 🌐 LANGKAH 4: Akses Aplikasi di Browser

Setelah menjalankan `npm run dev`, terminal akan menampilkan alamat lokal:

👉 **`http://localhost:3000`** atau **`http://127.0.0.1:3000`**

Buka browser Chrome / Edge / Firefox Anda, lalu ketik alamat tersebut.
🎉 **Aplikasi Sistem Antrean Puskesmas AI Studio Anda SIAP DIGUNAKAN DI LOCALHOST!**

---

## 💡 PERINTAH RINGKASAN LOKAL:

| Perintah | Fungsi |
| :--- | :--- |
| `npm install` | Menginstall semua paket dependency (Cukup 1x di awal) |
| `npm run dev` | Menjalankan server aplikasi lokal |
| `npm run build` | Membuat file build siap produksi |
