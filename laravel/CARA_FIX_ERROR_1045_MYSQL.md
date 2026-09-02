# 🛠️ Solusi Lengkap Memperbaiki Error 1045 MySQL pada Laragon / HeidiSQL

Jika Anda mendapati error berikut saat mencoba membuka HeidiSQL atau mengganti password di Laragon:
> **ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)**

Artinya server MySQL 8.4 di Laragon Anda saat ini **sudah memiliki password root** yang berbeda (bisa dari bekas instalasi sebelumnya, xampp, atau settingan default tertentu).

---

## 🔑 CARA 1: Coba Password Default Umum (Langkah Paling Cepat)

Sebelum melakukan reset, coba tes masukkan salah satu dari password umum berikut di HeidiSQL:

1. Buka **HeidiSQL**.
2. Pastikan **User**: `root`
3. Coba isi **Password** dengan salah satu kata di bawah ini:
   - **`root`**
   - **`laragon`**
   - **`admin`**
   - **`123456`**
4. Klik **Open**.

👉 *Jika salah satu password di atas berhasil masuk, maka simpan password tersebut untuk diisikan ke file `.env` di Laravel nanti!*

---

## ⚡ CARA 2: Reset Password Root MySQL via Terminal Laragon (100% Pasti Berhasil)

Jika Cara 1 masih gagal, ikuti langkah reset password tanpa kuis ini (hanya butuh waktu 2 menit):

### Langkah 1: Matikan Servis Laragon
1. Buka aplikasi **Laragon**.
2. Klik tombol **Stop** untuk mematikan Apache & MySQL.

### Langkah 2: Buka Terminal Laragon
1. Klik tombol **Terminal** di Laragon.
2. Ketik perintah ini untuk memastikan tidak ada MySQL yang masih mengatung:
   ```cmd
   taskkill /F /IM mysqld.exe
   ```

### Langkah 3: Jalankan MySQL dalam Mode Pengabaian Password (`skip-grant-tables`)
Di Terminal Laragon yang sama, ketik perintah ini lalu tekan Enter:
```cmd
mysqld --console --skip-grant-tables --shared-memory
```
*(Layar terminal akan menampilkan beberapa baris log. Biarkan jendela terminal ini tetap terbuka/terminimalisasi).*

### Langkah 4: Buka Jendela Terminal Baru & Masuk ke MySQL
1. Buka jendela **Terminal Laragon baru** (bisa lewat Laragon -> Klik **Terminal** lagi atau dari menu).
2. Ketik perintah ini lalu tekan Enter:
   ```cmd
   mysql -u root
   ```
   *(Anda akan langsung berhasil masuk ke prompt MySQL `mysql>` tanpa dimintai password!)*

### Langkah 5: Reset Password Menjadi Kosong (Blank)
Ketik perintah SQL berikut ini satu per satu lalu tekan Enter setelah setiap baris:

```sql
FLUSH PRIVILEGES;

ALTER USER 'root'@'localhost' IDENTIFIED BY '';

FLUSH PRIVILEGES;

EXIT;
```

### Langkah 6: Restart Laragon & Buka HeidiSQL!
1. Tutup semua jendela terminal Command Prompt.
2. Buka aplikasi **Laragon** -> Klik **Stop** lalu **Start All**.
3. Klik tombol **Database** (HeidiSQL) di Laragon.
4. Kosongkan kolom **Password** -> Klik **Open**.
5. 🎉 **BERHASIL MASUK!** Sekarang Anda dapat membuat database `puskesmas_antrean` dengan lancar!
