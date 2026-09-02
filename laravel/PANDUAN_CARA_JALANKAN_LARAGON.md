# 🚀 Panduan Lengkap Instalasi & Menjalankan Proyek Laravel di Laragon

Panduan langkah demi langkah bagi Anda yang sudah mengunduh/clone proyek ini dari GitHub dan ingin menjalankannya di laptop/PC lokal menggunakan **Laragon** serta menyiapkannya untuk hosting.

---

## 📥 1. Apa Saja Yang Perlu Didownload & Diinstall?

Sebelum memulai, pastikan software berikut telah terpasang di komputer/laptop Anda:

1. **Laragon Full (Versi Terbaru - PHP 8.1 / 8.2+)**
   - **Download Link**: [https://laragon.org/download/](https://laragon.org/download/)
   - *Penjelasan*: Laragon sudah mencakup Web Server (Apache/Nginx), Database Server (MySQL), Composer, Git, dan PHP.

2. **Node.js (LTS Version - v18 atau v20+)**
   - **Download Link**: [https://nodejs.org/](https://nodejs.org/)
   - *Penjelasan*: Diperlukan untuk kompilasi tampilan frontend / Tailwind CSS / Vite pada Laravel.

3. **VS Code / Text Editor** *(Opsional tapi Disarankan)*
   - **Download Link**: [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

## 📂 2. Penempatan Folder di Laragon

1. Buka folder instalasi Laragon di komputer Anda (Default biasanya di `C:\laragon\www`).
2. Masukkan folder hasil ekstrak / clone dari GitHub ke dalam folder `www`.
3. Beri nama foldernya, contoh: **`puskesmas-antrean`**
   - Jalur lokasinya menjadi: `C:\laragon\www\puskesmas-antrean`

---

## 🛠️ 3. Langkah-Langkah Menginstal & Menjalankan Proyek di Laragon

### Langkah 1: Buka Terminal Laragon
1. Buka aplikasi **Laragon**.
2. Klik tombol **"Start All"** di Laragon untuk menyalakan Apache & MySQL.
3. Klik tombol **"Terminal"** di Laragon (maka terminal/command prompt akan terbuka otomatis di folder `C:\laragon\www`).
4. Masuk ke folder proyek Anda:
   ```bash
   cd puskesmas-antrean
   ```

---

### Langkah 2: Buat Proyek Fresh Laravel 11 & Salin Kode
Jika Anda mendownload repositori gabungan (React + Laravel), Anda bisa menyalin kode Laravel dari folder `/laravel` ke proyek Laravel 11 Anda dengan langkah mudah berikut:

1. Jalankan perintah composer untuk buat Laravel baru (jika belum ada):
   ```bash
   composer create-project laravel/laravel .
   ```
2. Salin isi folder **`laravel/app`**, **`laravel/database`**, **`laravel/resources`**, dan **`laravel/routes`** dari hasil download GitHub Anda langsung menimpa (*overwrite*) folder bawaan Laravel tersebut.

---

### Langkah 3: Install Dependensi PHP & Node.js

Jalankan perintah ini di Terminal Laragon:

```bash
# 1. Install library PHP Laravel
composer install

# 2. Install dependensi JavaScript/Tailwind/Vite
npm install
```

---

### Langkah 4: Buat & Setting File Environment `.env`

1. Buat salinan file `.env` dari `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(Atau di Windows CMD: `copy .env.example .env`)*

2. Generate kunci enkripsi aplikasi:
   ```bash
   php artisan key:generate
   ```

---

### Langkah 5: Buat Database di MySQL Laragon

1. Buka aplikasi Laragon, lalu klik tombol **"Database"** (maka HeidiSQL akan terbuka otomatis).
2. Klik **Open** untuk masuk ke MySQL (Default Username: `root`, Password: *kosong/blank*).
3. Klik kanan di panel kiri -> **Create new** -> **Database**.
4. Beri nama database: `puskesmas_antrean`
5. Klik **OK**.

---

### Langkah 6: Hubungkan Database di File `.env`

Buka file `.env` di proyek Anda dengan VS Code / Notepad, lalu pastikan bagian database disesuaikan seperti berikut:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=puskesmas_antrean
DB_USERNAME=root
DB_PASSWORD=
```

---

### Langkah 7: Jalankan Database Migration & Seeder (Buat Tabel & Akun Default)

Jalankan perintah ini di Terminal Laragon untuk otomatis membuat seluruh tabel database dan mengisinya dengan data awal (termasuk **Super Admin**, **Admin**, dan **Petugas Loket**):

```bash
php artisan migrate:fresh --seed
```

---

### Langkah 8: Jalankan Aplikasi di Browser!

Di Laragon, Anda dapat mengaksesnya dengan 2 cara:

#### **Cara A: Menggunakan Automatic Virtual Host Laragon (Rekomendasi)**
Karena ditaruh di `C:\laragon\www\puskesmas-antrean`, Laragon membuat domain lokal otomatis:
👉 Buka Browser & Akses: **`http://puskesmas-antrean.test`**

#### **Cara B: Menggunakan Artisan Serve**
Jalankan di Terminal Laragon:
```bash
php artisan serve
```
👉 Buka Browser & Akses: **`http://127.0.0.1:8000`**

---

## 🔑 Data Akun Default Untuk Login (Hasil Seeder)

Password untuk seluruh akun bawaan adalah: **`password`**

| Role Login | Email Username | Password | Deskripsi / Hak Akses |
| --- | --- | --- | --- |
| **Super Admin** | `superadmin@puskesmas.go.id` | `password` | Hak Akses Penuh Sistem & Pengaturan IT |
| **Admin Puskesmas** | `admin@puskesmas.go.id` | `password` | Manajemen Laporan IKM, Master Data & Dokter |
| **Petugas Loket** | `petugas@puskesmas.go.id` | `password` | Panggilan Antrean Pasien & Pendaftaran Loket |

---

## 🌐 4. Panduan Cara Hosting (Deploy ke Web Hosting / VPS / cPanel)

Apabila proyek ini ingin di-publish agar bisa diakses online lewat internet oleh pasien/masyarakat, berikut langkah ringkasnya:

### **Langkah Hosting di cPanel (Shared Hosting):**
1. **Compress File Proyek**: Zip seluruh folder proyek Anda dari laptop (kecuali folder `node_modules` dan `vendor`).
2. **Upload ke cPanel**: Buka **File Manager** cPanel -> Upload file `.zip` ke luar folder `public_html` (misal ke `/home/username/puskesmas-antrean`).
3. **Ekstrak & Pindahkan Folder `public`**:
   - Pindahkan seluruh isi folder `puskesmas-antrean/public/*` ke dalam folder **`public_html`**.
   - Edit file `public_html/index.php`, ubah jalur path autoload dan app ke folder tempat Laravel disimpan:
     ```php
     require __DIR__.'/../puskesmas-antrean/vendor/autoload.php';
     $app = require_once __DIR__.'/../puskesmas-antrean/bootstrap/app.php';
     ```
4. **Buat Database MySQL di cPanel**:
   - Masuk ke menu **MySQL Database Wizard** di cPanel, buat nama database & user baru.
   - Edit file `.env` di cPanel sesuaikan `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` cPanel Anda.
5. **Import Database**:
   - Export database `puskesmas_antrean` dari HeidiSQL Laragon ke file `.sql`.
   - Import file `.sql` tersebut via **phpMyAdmin** di cPanel.
6. **Selesai!** Website antrean Puskesmas Anda sudah bisa diakses online via domain Anda (`https://domainpuskesmasanda.sch.id` atau `.go.id`).

---

Jika ada pertanyaan atau kendala seputar instalasi Laragon, pastikan versi PHP di Laragon Anda adalah PHP 8.1 / 8.2 atau yang lebih baru!
