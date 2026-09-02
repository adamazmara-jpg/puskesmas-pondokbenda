# 🛠️ Solusi Error: "Could not open input file: artisan"

Pesan error ini terjadi karena posisi Terminal Laragon Anda saat ini masih berada di luar folder project Laravel (**`C:\laragon\www`**), bukan di dalam folder project Anda.

---

## ⚡ Langkah Mudah Penyelesaian (Hanya 2 Perintah):

### **Langkah 1: Masuk ke Dalam Folder Project Anda**
Di Terminal Laragon (`C:\laragon\www`), ketik `cd` diikuti nama folder project Anda. 

Contoh (sesuaikan dengan nama folder project Anda di `C:\laragon\www`):
```cmd
cd nama-folder-project-anda
```
*(Misalnya: `cd puskesmas-antrean` atau `cd antrean`)*

> 💡 **Tips:** Anda bisa mengetik `dir` lalu tekan **Enter** untuk melihat nama-nama folder project yang ada di dalam `C:\laragon\www`.

---

### **Langkah 2: Jalankan Migrasi Laravel**
Setelah lokasi terminal berubah menjadi `C:\laragon\www\nama-project-anda>`, jalankan perintah migrasi:

```cmd
php artisan migrate
```

🎉 **BERHASIL!** Laravel akan langsung memproses migrasi dan membuat seluruh tabel ke dalam database `puskesmas_antrean`!
