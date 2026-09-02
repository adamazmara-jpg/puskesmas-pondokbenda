# 🔒 LENGKAP: Jawaban Pendaftaran Database & Proteksi Login Staff / Admin

---

## 1. 📝 Apakah Pasien Daftar Online Langsung Masuk ke Database?

**JAWABAN: YA, 100% LANGSUNG MASUK KE DATABASE / SERVER!**

Setiap kali pasien atau masyarakat umum mendaftar nomor antrean melalui menu **Pendaftaran Online**:
1. Data pasien (Nama, NIK, No HP, Poli Tujuan, Tanggal Kunjungan) akan dikirim langsung ke server API (`/api/antrean`).
2. Tiket antrean resmi (contoh: `A-015`, `B-008`) otomatis terbuat.
3. Data pendaftaran tersebut **langsung tersimpan di database MySQL / server** (`queue_tickets`).
4. Petugas loket dapat melihat, memanggil, dan merekap data pasien tersebut secara *real-time* di portal internal.

---

## 2. 🔐 Keamanan Portal: Pengguna Umum / Non-Admin Ditolak Masuk Login Staff

Sesuai aturan keamanan Sistem Informasi Manajemen Kesehatan Kedinasan:
* **Masyarakat / Pasien BUKAN merupakan pegawai resmi**, sehingga **TIDAK BISA MENDAFTAR** atau **TIDAK BISA LOGIN** sebagai staff/admin.
* Jika seseorang mencoba login menggunakan email/username sembarangan (seperti email pribadi, email pasien, atau akun tidak resmi), sistem akan menampilkan **Notifikasi Peringatan Keamanan Merah (Akses Ditolak)**:

> 🚫 **AKSES DITOLAK: Bukan Akun Staff / Admin Resmi!**  
> *Sistem mendeteksi bahwa akun Anda BUKAN merupakan Pegawai / Staff Resmi Puskesmas Pondok Benda. Portal ini terenkripsi khusus untuk Petugas Loket, Dokter, dan Administrator Internal Puskesmas.*

---

## 🔑 3. Daftar Akun Resmi Staff Internal Puskesmas (Dapat Digunakan untuk Pengujian)

Untuk keperluan pengujian / demo bagi Petugas & Administrator Resmi, telah disediakan **3 Akun Kedinasan Terdaftar**:

### **1. Petugas Loket & Poliklinik**
* **Username / Email**: `petugas@puskesmas.go.id` (atau `petugas`)
* **Password**: `password`
* **Wewenang**: Memanggil nomor antrean, mengubah status panggilan, melayani pendaftaran offline di lokasi.

---

### **2. Admin Tata Usaha & Manajemen Puskesmas**
* **Username / Email**: `admin@puskesmas.go.id` (atau `admin`)
* **Password**: `password`
* **Wewenang**: Melihat grafik survei kepuasan pasien (IKM), cetak laporan rekapitulasi harian/bulanan, ekspor data ke Excel CSV.

---

### **3. Super Admin IT Dinas Kesehatan**
* **Username / Email**: `superadmin@puskesmas.go.id` (atau `it` / `superadmin`)
* **Password**: `password`
* **Wewenang**: Monitoring status server Node.js & MySQL, melihat log aktivitas sistem (Audit Logs), mengelola konfigurasi sistem.

---

## 💡 Desain Form Login Bersih & Standar:
Tampilan form login dibuat bersih dan standar tanpa tombol preset/demo. Sistem akan langsung memvalidasi input email/username dan menolak akun non-staff secara otomatis dengan pesan peringatan merah.
