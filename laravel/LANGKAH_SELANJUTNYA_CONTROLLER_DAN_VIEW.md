# 🎉 HURA! Migrasi Tabel `antreans` SUDAH 100% SUKSES!

Output terminal Anda menunjukkan:
```text
2026_08_10_103623_create_antreans_table .................... 338.30ms DONE
```
Artinya tabel **`antreans`** beserta struktur kolomnya sudah resmi dibuat di database MySQL `puskesmas_antrean` Anda!

---

Berikut adalah **4 Langkah Terakhir** untuk menyelesaikan logika dan tampilan sistem antrean Puskesmas Anda:

---

## 📌 LANGKAH 1: Tambahkan Mass Assignment di Model (`app/Models/Antrean.php`)

Buka file **`app/Models/Antrean.php`** di VS Code, lalu ubah isinya menjadi:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Antrean extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_antrean',
        'nama_pasien',
        'poli',
        'status',
    ];
}
```

---

## 📌 LANGKAH 2: Isi Logika Controller (`app/Http/Controllers/AntreanController.php`)

Buka file **`app/Http/Controllers/AntreanController.php`**, lalu ganti seluruh isinya dengan kode berikut:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Antrean;
use Illuminate\Http\Request;

class AntreanController extends Controller
{
    // Halaman Utama Pasien (Ambil Nomor & Display Status)
    public function index()
    {
        $antreanSaatIni = Antrean::where('status', 'dipanggil')->latest('updated_at')->first();
        $sisaAntrean = Antrean::where('status', 'menunggu')->count();
        $daftarAntrean = Antrean::whereDate('created_at', today())->latest()->get();

        return view('antrean.index', compact('antreanSaatIni', 'sisaAntrean', 'daftarAntrean'));
    }

    // Proses Simpan Pendaftaran Antrean Pasien Baru
    public function store(Request $request)
    {
        $request->validate([
            'nama_pasien' => 'required|string|max:255',
            'poli' => 'required|string',
        ]);

        // Generate Nomor Antrean Otomatis (Contoh: U-001 untuk Umum, G-001 untuk Gigi)
        $kodePoli = strtoupper(substr($request->poli, 0, 1));
        $countToday = Antrean::whereDate('created_at', today())
            ->where('poli', $request->poli)
            ->count() + 1;

        $nomorAntrean = $kodePoli . '-' . str_pad($countToday, 3, '0', STR_PAD_LEFT);

        Antrean::create([
            'nomor_antrean' => $nomorAntrean,
            'nama_pasien' => $request->nama_pasien,
            'poli' => $request->poli,
            'status' => 'menunggu'
        ]);

        return redirect()->back()->with('success', 'Berhasil! Nomor Antrean Anda: ' . $nomorAntrean);
    }

    // Halaman Petugas / Loket untuk Memanggil Pasien
    public function petugas()
    {
        $antreanMenunggu = Antrean::where('status', 'menunggu')->oldest()->get();
        $antreanDipanggil = Antrean::where('status', 'dipanggil')->latest('updated_at')->get();

        return view('antrean.petugas', compact('antreanMenunggu', 'antreanDipanggil'));
    }

    // Ubah Status Antrean Menjadi 'dipanggil'
    public function panggil($id)
    {
        $antrean = Antrean::findOrFail($id);
        $antrean->update(['status' => 'dipanggil']);

        return redirect()->back()->with('success', 'Memanggil nomor antrean: ' . $antrean->nomor_antrean);
    }

    // Ubah Status Antrean Menjadi 'selesai'
    public function selesai($id)
    {
        $antrean = Antrean::findOrFail($id);
        $antrean->update(['status' => 'selesai']);

        return redirect()->back()->with('success', 'Antrean ' . $antrean->nomor_antrean . ' selesai diproses.');
    }
}
```

---

## 📌 LANGKAH 3: Daftarkan Route (`routes/web.php`)

Buka file **`routes/web.php`**, ganti isinya dengan:

```php
<?php

use App\Http\Controllers\AntreanController;
use Illuminate\Support\Facades\Route;

// Halaman Utama Pasien
Route::get('/', [AntreanController::class, 'index'])->name('antrean.index');
Route::post('/antrean/store', [AntreanController::class, 'store'])->name('antrean.store');

// Halaman Petugas Loket
Route::get('/petugas', [AntreanController::class, 'petugas'])->name('antrean.petugas');
Route::post('/antrean/panggil/{id}', [AntreanController::class, 'panggil'])->name('antrean.panggil');
Route::post('/antrean/selesai/{id}', [AntreanController::class, 'selesai'])->name('antrean.selesai');
```

---

## 📌 LANGKAH 4: Buat Tampilan Halaman Pasien (`resources/views/antrean/index.blade.php`)

Buat folder **`antrean`** di dalam `resources/views`, lalu buat file baru **`index.blade.php`**:

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Antrean Puskesmas</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 text-slate-800 font-sans min-h-screen p-6">
    <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- Header -->
        <header class="bg-emerald-600 text-white rounded-2xl p-6 shadow-lg text-center">
            <h1 class="text-3xl font-bold">🏥 PUSKESMAS SEHAT SEJAHTERA</h1>
            <p class="text-emerald-100 mt-1">Sistem Antrean Pendaftaran Online & Display Loket</p>
        </header>

        <!-- Alert Notifikasi -->
        @if(session('success'))
            <div class="bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-xl text-center font-semibold">
                {{ session('success') }}
            </div>
        @endif

        <div class="grid md:grid-cols-2 gap-6">
            <!-- Form Ambil Nomor Antrean -->
            <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
                <h2 class="text-xl font-bold mb-4 text-emerald-700">🎟️ Ambil Nomor Antrean</h2>
                <form action="{{ route('antrean.store') }}" method="POST" class="space-y-4">
                    @csrf
                    <div>
                        <label class="block text-sm font-medium mb-1">Nama Pasien</label>
                        <input type="text" name="nama_pasien" required placeholder="Masukkan nama lengkap" class="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Pilih Poli Tujuan</label>
                        <select name="poli" required class="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option value="Poli Umum">Poli Umum</option>
                            <option value="Poli Gigi">Poli Gigi</option>
                            <option value="Poli KIA">Poli KIA (Ibu & Anak)</option>
                        </select>
                    </div>
                    <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition">
                        Ambil Nomor Antrean
                    </button>
                </form>
            </div>

            <!-- Display Status Antrean Dipanggil -->
            <div class="bg-emerald-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between items-center text-center">
                <h2 class="text-lg font-semibold text-emerald-200">📢 ANTREAN SEDANG DIPANGGIL</h2>
                <div class="my-4">
                    <span class="text-6xl font-extrabold tracking-wider text-amber-400">
                        {{ $antreanSaatIni ? $antreanSaatIni->nomor_antrean : '---' }}
                    </span>
                    <p class="text-sm text-emerald-200 mt-2">
                        {{ $antreanSaatIni ? $antreanSaatIni->nama_pasien . ' (' . $antreanSaatIni->poli . ')' : 'Belum Ada Panggilan' }}
                    </p>
                </div>
                <div class="bg-emerald-800 px-4 py-2 rounded-lg text-sm text-emerald-100 w-full">
                    Sisa Antrean Menunggu: <strong class="text-white">{{ $sisaAntrean }} Pasien</strong>
                </div>
            </div>
        </div>

    </div>
</body>
</html>
```

---

🚀 **Uji Coba Sekarang:**
1. Pastikan server Laravel Anda menyala dengan perintah `php artisan serve`.
2. Buka browser di **`http://127.0.0.1:8000`**.
3. Coba isi nama pasien dan klik **Ambil Nomor Antrean**! 🎉
