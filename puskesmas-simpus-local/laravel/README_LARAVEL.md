# Panduan Migrasi Proyek Sistem Antrean Puskesmas ke Laravel (PHP 8.2+ / Laravel 11)

Proyek ini telah dikonversi ke struktur **Laravel 11** lengkap yang dapat langsung dipindahkan ke environment PHP/Laravel Anda (seperti Laragon, XAMPP, Docker, atau Server Cloud).

> **Catatan Environment Preview**:
> Aplikasi live preview AI Studio berjalan pada container Node.js / Vite (port 3000). Direktori `/laravel` di bawah ini menyediakan seluruh kode sumber PHP Laravel (Model, Migration, Seeder, Controller, Route, dan Blade Views) yang siap Anda jalankan di server Laravel lokal atau hosting Anda.

---

## 🔑 Akun & Kredensial Default (Seeder)

Seluruh akun menggunakan password: `password`

| Role | Email | Password | Hak Akses |
| --- | --- | --- | --- |
| **Super Admin** | `superadmin@puskesmas.go.id` | `password` | Akses Penuh Sistem & Pengaturan IT |
| **Admin** | `admin@puskesmas.go.id` | `password` | Manajemen Laporan, IKM, & Data Master |
| **Petugas Loket** | `petugas@puskesmas.go.id` | `password` | Pemanggilan Antrean Loket & Pendaftaran |

---

## 📁 Struktur File Laravel Yang Telah Dibuat

```text
laravel/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── QueueController.php            # Manajemen Pendaftaran & Antrean
│   │       ├── AdminController.php            # Dashboard Admin & Petugas
│   │       ├── PoliController.php             # Master Data Poliklinik & Dokter
│   │       └── ConfusionMatrixController.php  # Evaluasi Machine Learning (Slot Tersedia)
│   └── Models/
│       ├── User.php                           # Model User / Pengguna
│       ├── PoliService.php
│       ├── QueueTicket.php
│       ├── DoctorSchedule.php
│       ├── HealthArticle.php
│       └── ConfusionMatrixDataset.php
├── database/
│   ├── migrations/
│   │   ├── 2026_01_01_000000_create_users_table.php
│   │   ├── 2026_01_01_000001_create_poli_services_table.php
│   │   ├── 2026_01_01_000002_create_queue_tickets_table.php
│   │   ├── 2026_01_01_000003_create_doctor_schedules_table.php
│   │   ├── 2026_01_01_000004_create_health_articles_table.php
│   │   └── 2026_01_01_000005_create_confusion_matrix_datasets_table.php
│   └── seeders/
│       ├── UserSeeder.php                     # Seeder Super Admin, Admin, Petugas Loket
│       └── DatabaseSeeder.php                 # Master Seeder
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php                  # Layout utama dengan Tailwind CSS
│       ├── antrean/
│       │   └── index.blade.php                # Halaman Pendaftaran Pasien
│       └── confusion_matrix/
│           └── index.blade.php                # Halaman Uji Confusion Matrix ML
└── routes/
    ├── web.php                                # Route Halaman Blade
    └── api.php                                # RESTful API Endpoint
```

---

## ⚡ Langkah-Langkah Menginstal & Jalankan di Lokal

### 1. Buat Proyek Baru Laravel 11
```bash
composer create-project laravel/laravel puskesmas-antrean
cd puskesmas-antrean
```

### 2. Salin Kode dari Folder `/laravel`
Salin folder `app/`, `database/`, `resources/`, dan `routes/` dari folder `/laravel` dalam proyek ini ke proyek Laravel Anda.

### 3. Konfigurasi Database (`.env`)
Buka file `.env` dan atur koneksi database MySQL/PostgreSQL Anda:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=puskesmas_antrean
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Jalankan Migration & Seeder (Pengisian Akun User & Data Master)
```bash
php artisan migrate:fresh --seed
```

### 5. Jalankan Server Development
```bash
php artisan serve
```
Akses di browser: `http://127.0.0.1:8000`
