# ⚠️ Perbaikan Kode Migration `create_antreans_table.php`

Kode yang Anda tulis **memiliki sedikit error sintaks PHP** (ada penutup kurung `});` ganda dan `$table->timestamps();` yang ditulis 2 kali). Jika dijalankan, PHP akan menampilkan error syntax.

---

## ✅ Kode Yang Benar (Tinggal Copas)

Hapus semua isi file migrasi tersebut, lalu ganti dengan kode yang sudah dirapikan berikut ini:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('antreans', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_antrean'); // Contoh: A-001, B-002
            $table->string('nama_pasien');
            $table->string('poli');          // Contoh: Poli Umum, Poli Gigi, Poli KIA
            $table->enum('status', ['menunggu', 'dipanggil', 'selesai', 'batal'])->default('menunggu');
            $table->timestamps();            // Cukup tulis 1 kali di bagian bawah
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('antreans');
    }
};
```

---

## 🛠️ Apa Saja Yang Diperbaiki?
1. **Menghapus `$table->timestamps();` ganda**: `timestamps()` cukup ditulis 1 kali saja di akhir urutan kolom.
2. **Merapikan kurung penutup `});`**: Menghapus baris penutup berlebih di bagian bawah `up()`.
3. **Merapikan Indentasi (Spasi)** agar kode rapi dan mudah dibaca.

---

## 🚀 Setelah Disimpan, Jalankan Perintah Ini di Terminal:

```cmd
php artisan migrate
```

🎉 **Selesai!** Tabel `antreans` beserta kolom-kolomnya akan langsung terbentuk sempurna di database MySQL Anda!
