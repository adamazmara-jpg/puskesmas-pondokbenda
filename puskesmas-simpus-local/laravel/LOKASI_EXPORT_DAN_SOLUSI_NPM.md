# 📍 Lokasi Tombol Export & Solusi Error `npm install`

---

## 1. 🔍 Lokasi Tombol Export / Download Project di Google AI Studio

Untuk mengunduh (download) seluruh source code project ini:

1. Lihat di **Pojok Kanan Atas Layar Google AI Studio** (atau menu header paling atas).
2. Cari ikon **Download / ZIP** atau menu **Settings ⚙️** / **Export**.
3. Klik **Download ZIP** / **Export Code**.
4. Simpan file ZIP tersebut di komputer Anda, lalu ekstrak (unzip) ke dalam folder Laragon, contoh:
   👉 `C:\laragon\www\antrean-puskesmas`

---

## 2. 🛠️ Solusi Error `npm install` (`C:\Windows\System32`)

Pesan error:
> `npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open 'C:\Windows\System32\package.json'`

### **Penyebab Error:**
Terminal Anda saat ini berada di folder sistem Windows (**`C:\Windows\System32`**). Di folder itu tidak ada file `package.json` bawaan project Node.js.

---

### **⚡ Solusi Cepat (Hanya 2 Langkah):**

#### **Langkah 1: Masuk ke Folder Project Hasil Ekstrak Download**
Ketik perintah `cd` diikuti lokasi folder project hasil ekstraksi ZIP Anda.

Contoh jika Anda mengekstrak ke `C:\laragon\www\antrean-puskesmas`:
```cmd
cd C:\laragon\www\antrean-puskesmas
```

*(Atau jika di folder lain, ganti alamat jalurnya sesuai lokasi penyimpanan file project Anda).*

---

#### **Langkah 2: Jalankan `npm install` & `npm run dev`**
Setelah terminal menunjukkan lokasi folder project Anda (`C:\laragon\www\antrean-puskesmas>`), jalankan:

```cmd
npm install
```

Setelah selesai install, jalankan servernya:
```cmd
npm run dev
```

🎉 **Selesai!** Aplikasi akan langsung berjalan di browser pada alamat `http://localhost:3000`!
