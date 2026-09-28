# 🛠️ Solusi Tuntas Reset Password MySQL 8.4 Laragon (Menggunakan `--init-file`)

Pesan error `component_reference_cache.dll` terjadi karena **MySQL 8.4** memerlukan jalur file konfigurasi (`my.ini`) agar plugin dan komponennya terbaca dengan benar.

Metode `--init-file` ini adalah cara resmi dari MySQL yang **100% aman, cepat, dan tanpa error plugin**.

---

## 🔑 Langkah Reset Password Menjadi `root` (Hanya 1 Menit):

### **1. Buat File `reset.txt` di Drive `C:\`**
1. Buka aplikasi **Notepad**.
2. Tuliskan kode berikut:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
   ```
3. Simpan file dengan nama: **`C:\reset.txt`**

---

### **2. Jalankan Perintah Reset di Command Prompt Administrator**
Buka **Command Prompt (Administrator)** (`C:\Windows\System32>`), lalu jalankan perintah ini:

```cmd
"C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqld.exe" --defaults-file="C:\laragon\bin\mysql\mysql-8.4.3-winx64\my.ini" --init-file=C:\reset.txt
```

> 📌 **Catatan:** 
> - Diamkan selama **10 detik** sampai proses selesai.
> - Tekan tombol **`Ctrl + C`** di keyboard untuk mengakhiri proses `mysqld.exe`.

---

### **3. Buka Laragon & Buka HeidiSQL!**
1. Buka aplikasi **Laragon** -> Klik **Stop** lalu **Start All**.
2. Buka **HeidiSQL** (tombol *Database* di Laragon):
   - **User**: `root`
   - **Password**: `root`
3. Klik **Open** -> 🎉 **BERHASIL MASUK!**

---

### **4. Buat Database Baru**
1. Klik kanan di panel sebelah kiri HeidiSQL -> **Create new** -> **Database**.
2. Isi nama: **`puskesmas_antrean`**
3. Klik **OK**.
