# 🛠️ Solusi Tuntas Error "Access Is Denied" & Reset Password MySQL 8.4 Laragon

Terjadinya pesan **"Access is denied"** saat `taskkill` disebabkan karena Terminal/Command Prompt dibuka sebagai user biasa, bukan **Administrator**. 

Selain itu, pada **MySQL versi 8.4** di Laragon, sistem memang mengharuskan password terisi (tidak boleh kosong) demi alasan keamanan baru MySQL 8.

Berikut adalah langkah-langkah mudah 100% berhasil untuk mengatasinya:

---

## ⚡ TAHAP 1: Buka Command Prompt Sebagai Administrator (Mengatasi Access Denied)

1. Di keyboard laptop Anda, tekan tombol **Windows** (atau klik logo Windows di pojok kiri bawah).
2. Ketik: `cmd` atau `Command Prompt`.
3. **Klik Kanan** pada *Command Prompt* -> Pilih **"Run as Administrator"** (*Jalankan sebagai Administrator*).
4. Jika muncul konfirmasi layar biru/kuning dari Windows (User Account Control), klik **YES**.

---

## ⚡ TAHAP 2: Matikan Service MySQL & Jalankan Mode Bypass

Di jendela **Command Prompt Administrator** yang hitam tersebut, jalankan perintah ini:

### 1. Matikan proses MySQL:
```cmd
taskkill /F /IM mysqld.exe
```
*(Kali ini TIDAK AKAN error "Access is denied" lagi karena sudah berjalan sebagai Administrator!)*

---

### 2. Jalankan MySQL tanpa pemeriksaan password:
```cmd
"C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqld.exe" --skip-grant-tables --shared-memory
```
*(Ganti versi folder mysql jika folder mysql Anda sedikit berbeda, atau ketik langsung `mysqld --skip-grant-tables --shared-memory`).*

> **Biarkan jendela CMD hitam ini tetap terbuka!**

---

## ⚡ TAHAP 3: Buka Terminal Baru & Set Password Menjadi `root`

1. Buka lagi jendela **Command Prompt Administrator baru** (atau buka Terminal dari aplikasi Laragon).
2. Ketik perintah ini untuk masuk ke MySQL:
   ```cmd
   mysql -u root
   ```
3. Setelah masuk ke tampilan prompt `mysql>`, ketik perintah SQL berikut satu per satu lalu tekan Enter:

```sql
FLUSH PRIVILEGES;

ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';

FLUSH PRIVILEGES;

EXIT;
```

---

## ⚡ TAHAP 4: Tes Buka HeidiSQL & Laragon!

1. Tutup semua jendela Command Prompt.
2. Buka aplikasi **Laragon** -> Klik **Stop** lalu **Start All**.
3. Buka **HeidiSQL**:
   - **User**: `root`
   - **Password**: `root`
4. Klik **Open** -> 🎉 **BERHASIL MASUK!**

---

## ⚙️ Sesuaikan di File `.env` Proyek Laravel Anda

Di file `.env` proyek Laravel Anda, tinggal samakan passwordnya menjadi `root`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=puskesmas_antrean
DB_USERNAME=root
DB_PASSWORD=root
```
