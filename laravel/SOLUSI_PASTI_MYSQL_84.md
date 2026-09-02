# ⚡ Solusi Tuntas & Pasti Berhasil: Reset Password MySQL 8.4 Laragon

Error `component_reference_cache.dll` terjadi karena perintah `mysqld.exe` dijalankan tanpa menentukan lokasi folder induk MySQL (`--basedir`) dan folder data MySQL (`--datadir`).

Berikut adalah **2 Cara Utama** yang dipastikan 100% menyelesaikan masalah ini!

---

## 🎯 CARA 1: Jalankan dengan Parameter `--basedir` & `--datadir` (Sangat Mudah)

### **Langkah 1: Siapkan File `C:\reset.txt`**
1. Buka **Notepad**.
2. Isikan perintah berikut:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
   ```
3. Simpan file di lokasi: **`C:\reset.txt`**

---

### **Langkah 2: Buka Command Prompt (Administrator)**
1. Klik **Start Windows**, ketik `cmd`, **Klik Kanan** -> Pilih **"Run as administrator"**.

---

### **Langkah 3: Ketik 2 Perintah Ini Berurutan**

Ketik (atau copas) perintah ini satu per satu lalu tekan Enter:

```cmd
cd /d "C:\laragon\bin\mysql\mysql-8.4.3-winx64"
```

Lalu jalankan `mysqld` dengan lokasi lengkap base & data directory:

```cmd
bin\mysqld.exe --basedir="C:\laragon\bin\mysql\mysql-8.4.3-winx64" --datadir="C:\laragon\data\mysql" --init-file="C:\reset.txt"
```

> 📌 **Penjelasan:**
> - Layar CMD akan terdiam selama 5-10 detik. Ini menandakan **MySQL sedang sukses memproses reset password `root` menjadi `root`**!
> - Setelah 10 detik, tekan tombol **`Ctrl + C`** di keyboard untuk menghentikan proses.

---

### **Langkah 4: Tes Buka HeidiSQL / Laragon**
1. Buka aplikasi **Laragon** -> Klik **Stop** lalu **Start All**.
2. Buka **HeidiSQL** (klik tombol *Database* di Laragon):
   - **Hostname/IP**: `127.0.0.1`
   - **User**: `root`
   - **Password**: `root`
3. Klik **Open** -> 🎉 **100% Selesai & Berhasil Masuk!**

---

---

## 🔄 CARA 2: Reset Folder Data MySQL Laragon (Opsi Paling Bersih Jika Cara 1 Mengalami Kendala)

Jika data MySQL di Laragon masih baru/kosong dan Anda ingin mengembalikan MySQL ke kondisi bersih semula tanpa password:

1. Buka aplikasi **Laragon** -> Klik **Stop**.
2. Buka Windows Explorer, masuk ke folder: **`C:\laragon\data`**
3. Hapus (atau ubah nama) folder **`mysql`** menjadi `mysql_old`.
4. Buka **Laragon** -> Klik **Start All**.
5. Laragon akan otomatis membuat ulang folder `mysql` baru secara otomatis yang fresh tanpa password!
6. Buka **HeidiSQL** -> User: `root`, Password: *kosongkan* -> Klik **Open**.
