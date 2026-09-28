# SIMPUS Puskesmas Jurumudi Baru (Integrasi Layanan Primer - ILP)

Aplikasi Web Terpadu Sistem Informasi Manajemen Puskesmas (SIMPUS) berbasis Integrasi Layanan Primer (ILP) Kemenkes RI. Dilengkapi dengan:
- Alur Pendaftaran Mandiri Pasien (Input NIK -> Pilih Klaster ILP -> Masukkan Keluhan -> Print Ticket)
- Struk Cetak Antrean Thermal Printer (Ukuran POS 58mm / 80mm via `@media print`)
- Antrean Pasien Real-time & Panggilan Suara Audio Bell / TTS Loket
- Pelayanan Medis Pemeriksaan Dokter (Kajian Awal, Diagnosis ICD-10, Tindakan Medis)
- Farmasi & Apotek e-Resep (Telaah Obat, Penyiapan, dan Penyerahan)
- Rekam Medis Elektronik (RME) Pasien
- Rekapitulasi & Ekspor Data Spreadsheet SIMPUS (Excel XLSX)

---

## ⚡ Cara Menjalankan di Komputer Lokal

1. **Pastikan Node.js sudah terpasang** di komputer Anda (versi 18+ atau 20+ LTS).
2. **Cara Otomatis (Windows)**: Klik 2x file `run-local.bat`.
3. **Cara Otomatis (Mac/Linux)**: Jalankan `./run-local.sh`.
4. **Cara Manual (Terminal)**:
   ```bash
   npm install
   npm run dev
   ```
5. Buka web browser Anda di: **`http://localhost:3000`**

Untuk panduan lengkap dalam Bahasa Indonesia, silakan buka file **`PANDUAN_MENJALANKAN_LOCAL.md`**.
