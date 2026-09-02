# 🚀 Panduan Lengkap Mengembangkan Sistem Antrean Puskesmas di Laravel

Selamat! Laravel 12 Anda **sudah berhasil berjalan secara sempurna** di `http://127.0.0.1:8000` dan sudah terhubung dengan database MySQL `puskesmas_antrean`.

Tampilan yang Anda lihat saat ini adalah **halaman default (Welcome Page)** dari Laravel. Berikut adalah langkah-langkah praktis untuk mulai membangun aplikasi Antrean Puskesmas Anda:

---

## 📋 Langkah 1: Generate Authentication (Login & Register) - Opsional / Sangat Direkomendasikan

Agar sistem antrean memiliki akun **Admin / Petugas** dan **Pasien**, Anda bisa memasang starter kit autentikasi bawaan Laravel (Laravel Breeze / Breeze Blade):

Di Terminal (`C:\Users\paqih\proyek-laravel`), jalankan:

```cmd
composer require laravel/breeze --dev
php artisan breeze:install blade
php artisan migrate
npm install
npm run dev
```

> **Hasil:** Anda akan langsung memiliki halaman `/login`, `/register`, dan `/dashboard` yang siap digunakan!

---

## 🛠️ Langkah 2: Buat Model, Migration, & Controller untuk Antrean

Untuk membuat fitur nomor antrean dan pendaftaran poli, Anda memerlukan file pendukung di Laravel.

Jalankan perintah ini di Terminal:

```cmd
php artisan make:model Antrean -mcr
```

> **Penjelasan:**
> - `-m`: Membuat file database migration (`database/migrations/..._create_antreans_table.php`).
> - `-c`: Membuat file Controller (`app/Http/Controllers/AntreanController.php`).
> - `-r`: Menambahkan method Resource (index, create, store, show, edit, update, destroy).

---

## 📐 Langkah 3: Edit Struktur Tabel Antrean (`database/migrations/..._create_antreans_table.php`)

Buka project Anda di **VS Code** (`code .`), lalu buka file migrasi antrean dan tambahkan kolom-kolom berikut:

```php
public function up(): void
{
    Schema::create('antreans', function (Blueprint $table) {
        $table->id();
        $table->string('nomor_antrean'); // Contoh: A-001, B-002
        $table->string('nama_pasien');
        $table->string('nik')->nullable();
        $table->string('poli'); // Contoh: Poli Umum, Poli Gigi, Poli KIA
        $table->enum('status', ['menunggu', 'dipanggil', 'selesai', 'batal'])->default('menunggu');
        $table->timestamps();
    });
}
```

Jalankan migrasi lagi:
```cmd
php artisan migrate
```

---

## 🗺️ Langkah 4: Buat Route Aplikasi (`routes/web.php`)

Buka file `routes/web.php` dan atur halaman utama agar menampilkan Halaman Antrean:

```php
use App\Http\Controllers\AntreanController;
use Illuminate\Support\Facades\Route;

// Halaman Utama Antrean Pasien
Route::get('/', [AntreanController::class, 'index'])->name('antrean.index');

// Ambil Nomor Antrean Baru
Route::post('/antrean/ambil', [AntreanController::class, 'store'])->name('antrean.store');

// Halaman Panggil Antrean (Petugas/Admin)
Route::get('/petugas', [AntreanController::class, 'petugas'])->name('antrean.petugas');
Route::post('/antrean/panggil/{id}', [AntreanController::class, 'panggil'])->name('antrean.panggil');
```

---

## 💻 Langkah 5: Isi Controller (`app/Http/Controllers/AntreanController.php`)

Tambahkan logika untuk mengambil antrean dan menampilkan daftar antrean:

```php
namespace App\Http\Controllers;

use App\Models\Antrean;
use Illuminate\Http\Request;

class AntreanController extends Controller
{
    public function index()
    {
        $antreanSaatIni = Antrean::where('status', 'dipanggil')->latest()->first();
        $sisaAntrean = Antrean::where('status', 'menunggu')->count();
        return view('antrean.index', compact('antreanSaatIni', 'sisaAntrean'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_pasien' => 'required|string|max:255',
            'poli' => 'required|string',
        ]);

        // Generate nomor antrean otomatis
        $countToday = Antrean::whereDate('created_at', today())->where('poli', $request->poli)->count() + 1;
        $kodePoli = strtoupper(substr($request->poli, 0, 1));
        $nomorAntrean = $kodePoli . '-' . str_pad($countToday, 3, '0', STR_PAD_LEFT);

        Antrean::create([
            'nomor_antrean' => $nomorAntrean,
            'nama_pasien' => $request->nama_pasien,
            'poli' => $request->poli,
            'status' => 'menunggu'
        ]);

        return redirect()->back()->with('success', 'Nomor Antrean Anda: ' . $nomorAntrean);
    }
}
```

---

## 🎨 Langkah 6: Tampilkan Halaman Antrean (`resources/views/antrean/index.blade.php`)

Buat file baru di `resources/views/antrean/index.blade.php` dengan desain tampilan nomor antrean yang rapi (menggunakan Tailwind CSS / Bootstrap).

---

## ⚡ Ringkasan Perintah Penting yang Selalu Digunakan:

1. **Memulai Server Laravel:**
   ```cmd
   php artisan serve
   ```
2. **Kompilasi Asset Frontend (jika pakai Tailwind/Vite):**
   ```cmd
   npm run dev
   ```
3. **Membuka Project di VS Code:**
   ```cmd
   code .
   ```
