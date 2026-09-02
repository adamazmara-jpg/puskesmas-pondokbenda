# 🚀 Solusi 100% Tuntas: Reset MySQL 8.4 di Laragon

Informasi dari terminal Anda sangat membantu! Folder data MySQL Anda berada di:  
`C:\laragon\data\mysql-8.4`

Pilih salah satu cara di bawah ini yang paling gampang bagi Anda. **Cara 1 adalah yang paling direkomendasikan & paling praktis (hanya butuh 30 detik)!**

---

## 🌟 CARA 1: Reset Folder Data MySQL 8.4 (Paling Cepat & Pasti Berhasil)

Karena folder data ini masih baru dan belum berisi data penting Puskesmas, kita cukup minta Laragon membuatkan database baru yang **100% fresh tanpa password**.

1. Buka aplikasi **Laragon** -> Klik **Stop**.
2. Buka **Windows Explorer**, masuk ke folder: **`C:\laragon\data`**
3. **Hapus** folder **`mysql-8.4`** (atau ubah namanya menjadi `mysql-8.4-old`).
4. Buka aplikasi **Laragon** -> Klik **Start All**.
   > *(Laragon akan otomatis menginisialisasi ulang database MySQL 8.4 bersih dengan user `root` tanpa password).*
5. Buka **HeidiSQL** (tombol *Database* di Laragon):
   - **User**: `root`
   - **Password**: *(KOSONGKAN)*
6. Klik **Open** -> 🎉 **BERHASIL MASUK!**

---

## 🛠️ CARA 2: Jika Menggunakan Perintah `--init-file` di Command Prompt

Jika ingin tetap menggunakan file `C:\reset.txt`, penyebab error DLL `component_reference_cache.dll` sebelumnya adalah karena Command Prompt harus berada di dalam folder `bin` tempat file DLL berada.

Buka **Command Prompt (Administrator)**, lalu jalankan perintah ini:

```cmd
cd /d "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin"
```

Lalu jalankan `mysqld.exe`:

```cmd
mysqld.exe --defaults-file="C:\laragon\bin\mysql\mysql-8.4.3-winx64\my.ini" --datadir="C:\laragon\data\mysql-8.4" --init-file="C:\reset.txt"
```

1. Tunggu 5-10 detik.
2. Tekan **`Ctrl + C`** untuk menghentikan proses.
3. Buka **Laragon** -> **Start All** -> Buka **HeidiSQL** dengan password `root`.
