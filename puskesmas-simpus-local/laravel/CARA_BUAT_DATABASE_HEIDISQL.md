# 💡 Cara Membuat Database Baru di HeidiSQL (2 Cara Mudah)

Opsi **Database** menjadi abu-abu (greyed out) karena Anda mengeklik kanan pada salah satu database bawaan (`information_schema` / `mysql`).

Berikut adalah **2 Cara Mudah** untuk membuat database `puskesmas_antrean`:

---

## ⚡ CARA 1: Pakai Perintah Query SQL (Paling Cepat & 100% Pasti Berhasil!)

1. Di HeidiSQL, klik tab **Query** di bagian atas (atau tekan tombol **`Ctrl + T`** di keyboard).
2. Ketik perintah berikut:
   ```sql
   CREATE DATABASE puskesmas_antrean;
   ```
3. Tekan tombol **`F9`** di keyboard (atau klik tombol **Play berwarna biru** ▶️ di toolbar atas).
4. Klik kanan di area kosong sebelah kiri -> Klik **Refresh** (atau tekan **`F5`**).
5. 🎉 **SELESAI!** Database `puskesmas_antrean` akan langsung muncul di daftar sebelah kiri!

---

## 🖱️ CARA 2: Klik Kanan di Sesi Utama (Bukan di Nama Database)

1. Di panel sebelah kiri, **Klik Kanan pada nama sesi paling atas**: **`Laragon.MySQL`** (atau di area kosong paling atas di atas `information_schema`).
2. Pilih **Create new** -> Klik **Database**.
3. Ketik nama: **`puskesmas_antrean`**
4. Klik **OK**.
