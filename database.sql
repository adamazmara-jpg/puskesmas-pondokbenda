-- ============================================================
-- DATABASE SCHEMA & INITIAL DATA FOR PUSKESMAS PONDOK BENDA TANGSEL
-- Target Database Engine: MySQL 5.7+ / MySQL 8.0+ / MariaDB / phpMyAdmin
-- Default Charset: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS `puskesmas_pondokbenda` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `puskesmas_pondokbenda`;

-- Matikan Cek Foreign Key sementara agar proses DROP & IMPORT berjalan lancar tanpa error #1451
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- Hapus tabel lama jika ada (urutan dari child ke parent)
DROP TABLE IF EXISTS `queue_tickets`;
DROP TABLE IF EXISTS `doctors`;
DROP TABLE IF EXISTS `surveys`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `users_admin`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `articles`;
DROP TABLE IF EXISTS `polis`;

-- ------------------------------------------------------------
-- 1. TABEL POLIKLINIK & LAYANAN (polis)
-- ------------------------------------------------------------
CREATE TABLE `polis` (
  `id` VARCHAR(50) NOT NULL,
  `code` VARCHAR(10) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `icon_name` VARCHAR(50) DEFAULT 'Stethoscope',
  `description` TEXT,
  `room` VARCHAR(100) DEFAULT NULL,
  `queue_prefix` VARCHAR(10) NOT NULL,
  `active_queue_number` VARCHAR(20) DEFAULT '-',
  `doctor_name` VARCHAR(100) DEFAULT NULL,
  `operating_hours` VARCHAR(100) DEFAULT NULL,
  `requirements` TEXT DEFAULT NULL,
  `fee_general` VARCHAR(150) DEFAULT NULL,
  `max_quota` INT DEFAULT 50,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `polis` (`id`, `code`, `name`, `icon_name`, `description`, `room`, `queue_prefix`, `active_queue_number`, `doctor_name`, `operating_hours`, `requirements`, `fee_general`) VALUES
('poli-umum', 'A', 'Poli Umum', 'Stethoscope', 'Pelayanan pemeriksaan kesehatan umum, konsultasi medis dasar, serta pengobatan untuk pasien dewasa dan anak.', 'Lantai 1 - Ruang 101', 'A', '-', 'dr. H. Bambang Suherman', 'Senin - Sabtu (07:30 - 14:00 WIB)', 'KTP / NIK Tangsel, Kartu BPJS Kesehatan (Aktif), Kartu Berobat Puskesmas (bila ada)', 'Gratis (BPJS) / Rp 10.000 (Umum Perda Tangsel)'),
('poli-gigi', 'B', 'Poli Gigi & Mulut', 'Smile', 'Pemeriksaan kesehatan gigi, pencabutan gigi, penambalan, pembersihan karang gigi (scaling), dan konsultasi oral.', 'Lantai 1 - Ruang 104', 'B', '-', 'drg. Maya Rosdiana', 'Senin - Jumat (08:00 - 13:00 WIB)', 'KTP Pasien, Kartu BPJS Kesehatan Tangsel', 'Gratis (BPJS) / Rp 15.000 - Rp 30.000 (Umum)'),
('poli-kia-kb', 'C', 'Poli KIA & KB', 'HeartPulse', 'Pemeriksaan kehamilan (ANC), pelayanan KB (IUD, Implan, Suntik, Pil), imunisasi TT ibu hamil, dan nifas.', 'Lantai 1 - Ruang 102', 'C', '-', 'Bidan Nining Kurnia, S.ST', 'Senin - Sabtu (08:00 - 13:00 WIB)', 'Buku KIA (Pink), KTP & KK Pasien, Kartu BPJS', 'Gratis (BPJS) / Rp 15.000 (Umum)'),
('poli-anak-imunisasi', 'D', 'Poli Anak & Imunisasi', 'Baby', 'Pemeriksaan kesehatan bayi/balita, pemantauan tumbuh kembang, penimbangan, serta imunisasi rutin wajib.', 'Lantai 1 - Ruang 103', 'D', '-', 'dr. Siska Rahmawati, Sp.A', 'Selasa & Kamis (08:00 - 12:00 WIB)', 'Buku KMS / Buku Pink, KTP Orang Tua, Kartu BPJS', 'Gratis Imunisasi Program Pemerintah'),
('poli-lansia-ptm', 'E', 'Poli Lansia & PTM', 'UserCheck', 'Layanan kesehatan prioritas usia lanjut (≥60 tahun) dan pencegahan penyakit tidak menular (Hipertensi, Diabetes).', 'Lantai 1 - Ruang 105 (Akses Ramah Lansia)', 'E', '-', 'dr. Ahmad Fauzi', 'Senin - Jumat (07:30 - 13:00 WIB)', 'KTP Pasien Lansia, Kartu BPJS Kesehatan', 'Gratis (Pemeriksaan Gula & Tensi Rutin)'),
('poli-tb-ispa', 'F', 'Poli Batuk & TB Paru', 'Activity', 'Pemeriksaan dahak Sputum/TCM, pengobatan TB Paru terpadu, pencegahan dan penanganan ISPA.', 'Lantai 2 - Ruang Khusus TB 201', 'F', '-', 'dr. Rian Hidayat', 'Senin, Rabu, Jumat (08:30 - 12:00 WIB)', 'Rujukan internal / Kartu Berobat TB, KTP Pasien', 'Gratis (Program TB Nasional Kemenkes)'),
('laboratorium', 'L', 'Laboratorium Kesehatan', 'TestTube', 'Pemeriksaan Darah Lengkap, Gula Darah, Kolesterol, Asam Urat, Urine, Tes Kehamilan, Malaria, BTA, HIV, & HBsAg.', 'Lantai 1 - Ruang Lab 106', 'L', '-', 'Analis Medis Dewi Astuti, A.Md.AK', 'Senin - Sabtu (07:30 - 12:00 WIB)', 'Formulir Pengantar Dokter Puskesmas, KTP & BPJS', 'Gratis dengan rujukan dokter BPJS / Perda Tangsel'),
('farmasi-apotek', 'P', 'Farmasi & Apotek Obat', 'Pills', 'Penyerahan obat resep dokter, edukasi cara minum obat, serta informasi efek samping obat pasien.', 'Lantai 1 - Loket Apotek 107', 'P', '-', 'Apt. Farida Nurjanah, S.Farm', 'Senin - Sabtu (08:00 - 14:30 WIB)', 'Resep Resmi Dokter Puskesmas Pondok Benda', 'Gratis Paket Resep Puskesmas');


-- ------------------------------------------------------------
-- 2. TABEL DOKTER & TENAGA MEDIS (doctors)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors` (
  `id` VARCHAR(50) NOT NULL,
  `doctor_name` VARCHAR(120) NOT NULL,
  `specialty` VARCHAR(150) DEFAULT NULL,
  `poli_id` VARCHAR(50) DEFAULT NULL,
  `poli_name` VARCHAR(100) NOT NULL,
  `days` VARCHAR(255) NOT NULL DEFAULT 'Senin, Selasa, Rabu, Kamis, Jumat',
  `hours` VARCHAR(100) NOT NULL DEFAULT '08:00 - 12:00 WIB',
  `quota_per_day` INT DEFAULT 30,
  `status` ENUM('Hadir', 'Cuti', 'Pengganti') DEFAULT 'Hadir',
  `photo_url` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_poli_id` (`poli_id`),
  CONSTRAINT `fk_doctors_poli` FOREIGN KEY (`poli_id`) REFERENCES `polis` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `doctors` (`id`, `doctor_name`, `specialty`, `poli_id`, `poli_name`, `days`, `hours`, `quota_per_day`, `status`, `photo_url`) VALUES
('doc-1', 'dr. H. Bambang Suherman', 'Dokter Umum / Kepala Puskesmas', 'poli-umum', 'Poli Umum', 'Senin, Selasa, Rabu, Kamis, Jumat', '08:00 - 12:00 WIB', 40, 'Hadir', ''),
('doc-2', 'dr. Ahmad Fauzi', 'Dokter Umum & Penyakit Tidak Menular', 'poli-umum', 'Poli Umum & Poli Lansia', 'Senin, Rabu, Kamis, Sabtu', '08:00 - 13:30 WIB', 35, 'Hadir', ''),
('doc-3', 'drg. Maya Rosdiana', 'Dokter Gigi & Mulut', 'poli-gigi', 'Poli Gigi & Mulut', 'Senin, Selasa, Rabu, Kamis, Jumat', '08:00 - 12:30 WIB', 15, 'Hadir', ''),
('doc-4', 'Bidan Nining Kurnia, S.ST', 'Bidan Koordinator KIA / KB', 'poli-kia-kb', 'Poli KIA & KB', 'Senin, Selasa, Rabu, Kamis, Jumat, Sabtu', '08:00 - 13:00 WIB', 25, 'Hadir', ''),
('doc-5', 'dr. Siska Rahmawati, Sp.A', 'Spesialis Kesehatan Anak', 'poli-anak-imunisasi', 'Poli Anak & Imunisasi', 'Selasa, Kamis', '08:30 - 12:00 WIB', 20, 'Hadir', ''),
('doc-6', 'dr. Rian Hidayat', 'Dokter Penanggung Jawab TB Paru', 'poli-tb-ispa', 'Poli Batuk & TB Paru', 'Senin, Rabu, Jumat', '09:00 - 12:00 WIB', 15, 'Hadir', '');


-- ------------------------------------------------------------
-- 3. TABEL ARTIKEL, BERITA & VIDEO EDUKASI (articles)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Edukasi',
  `snippet` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `date` VARCHAR(50) DEFAULT NULL,
  `author` VARCHAR(100) DEFAULT 'Tim Promkes Puskesmas',
  `read_time` VARCHAR(50) DEFAULT '3 min baca',
  `badge_color` VARCHAR(100) DEFAULT 'bg-emerald-100 text-emerald-800 border-emerald-200',
  `image_url` TEXT DEFAULT NULL,
  `is_video` TINYINT(1) DEFAULT 0,
  `video_url` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `articles` (`id`, `title`, `category`, `snippet`, `content`, `date`, `author`, `read_time`, `badge_color`, `image_url`, `is_video`, `video_url`) VALUES
('art-b3', 'Simulasi Tumpahan B3 (Bahan Berbahaya dan Beracun) di UPTD Puskesmas Pondok Benda', 'Video Edukasi', 'Video kali ini merupakan Simulasi Tumpahan B3 (Bahan Berbahaya dan Beracun) di UPTD Puskesmas Pondok Benda.', 'UPTD Puskesmas Pondok Benda secara berkala menyelenggarakan Simulasi Penanganan Tumpahan B3 (Bahan Berbahaya dan Beracun) sebagai wujud komitmen dalam menjaga keselamatan pasien, staf, serta kelestarian lingkungan. Kegiatan ini melatih kesiapsiagaan tanggap darurat petugas medis dalam mengisolasi area, menggunakan Alat Pelindung Diri (APD) dan Spill Kit sesuai standar SOP/PPI, hingga mengelola limbah infeksius maupun bahan kimia secara aman dan cepat.', '05 Agustus 2026', 'Tim Promkes Puskesmas', 'Video Edukasi', 'bg-rose-100 text-rose-800 border-rose-200', 'https://img.youtube.com/vi/dYSmq6aBd7k/hqdefault.jpg', 1, 'https://www.youtube.com/embed/dYSmq6aBd7k'),
('art-gempa', 'Simulasi Gempa Bumi di UPTD Puskesmas Pondok Benda', 'Video Edukasi', 'Tujuan dari kegiatan simulasi gempa bumi adalah untuk melatih kesiapsiagaan para pegawai tentang bagaimana mengambil sikap dan tindakan ketika menghadapi bencana gempa bumi.', 'Sebagai langkah mitigasi bencana dan komitmen dalam menjamin keselamatan pasien serta staf medis, UPTD Puskesmas Pondok Benda menyelenggarakan Simulasi Gempa Bumi secara berkala. Kegiatan ini melatih kesiapsiagaan seluruh personel dalam merespons guncangan secara cepat dan tepat—mulai dari melakukan teknik berlindung (Drop, Cover, Hold On), memandu proses evakuasi yang tertib menuju titik kumpul (Assembly Point), hingga memberikan penanganan medis darurat pasca-bencana sesuai dengan standar Keselamatan dan Kesehatan Kerja (K3) Fasilitas Pelayanan Kesehatan.', '04 Agustus 2026', 'Tim Promkes Puskesmas', 'Video Edukasi', 'bg-amber-100 text-amber-800 border-amber-200', 'https://img.youtube.com/vi/1XENj4XlTZ0/hqdefault.jpg', 1, 'https://www.youtube.com/embed/1XENj4XlTZ0'),
('art-codered', 'Simulasi Code Red di UPTD Puskesmas Pondok Benda', 'Video Edukasi', 'Code Red adalah kode emergensi untuk kondisi kebakaran yang membutuhkan kesiapan dan kesigapan petugas untuk memadamkan api, mengevakuasi pasien, alat kesehatan, dokumen dll.', 'Dalam upaya meningkatkan kesiapsiagaan tanggap darurat kebakaran dan perlindungan terhadap keselamatan pasien serta staf, UPTD Puskesmas Pondok Benda menyelenggarakan Simulasi Code Red secara berkala. Kegiatan ini melatih keandalan seluruh tim penanggulangan kebakaran mulai dari Tim Merah (pemadam api dengan APAR), Tim Biru (evakuasi pasien), Tim Hijau (penyelamat dokumen medis), hingga Tim Kuning (penyelamat aset dan peralatan medis) agar dapat merespons pembunyian alarm kebakaran dengan cepat, terkoordinasi, dan sesuai SOP Keselamatan dan Kesehatan Kerja (K3) Fasilitas Pelayanan Kesehatan.', '03 Agustus 2026', 'Tim Promkes Puskesmas', 'Video Edukasi', 'bg-red-100 text-red-800 border-red-200', 'https://img.youtube.com/vi/BpRcZYbcMnw/hqdefault.jpg', 1, 'https://www.youtube.com/embed/BpRcZYbcMnw'),
('art-codeblue', 'Simulasi Code Blue di UPTD Puskesmas Pondok Benda', 'Video Edukasi', 'Code Blue ada sebuah kode sistem aktivasi untuk kondisi gawat darurat untuk pasien yang membutuhkan pertolongan dan penanganan medis sesegera mungkin, seperti pada kasus pasien mengalami henti jantung.', 'Guna menjamin keselamatan dan kecepatan penanganan pasien yang mengalami kondisi gawat darurat medis, UPTD Puskesmas Pondok Benda menyelenggarakan Simulasi Code Blue secara berkala. Kegiatan ini melatih kesiapsiagaan seluruh tenaga kesehatan dan Tim Resusitasi dalam merespons insiden henti jantung atau henti napas secara cepat, tepat, dan terkoordinasi—mulai dari aktivasi sinyal Code Blue, pelaksanaan Bantuan Hidup Dasar (BHD) dan resusitasi jantung paru (RJP), penggunaan instrumen medis darurat, hingga proses stabilisasi dan rujukan pasien sesuai standar keselamatan pasien (patient safety).', '02 Agustus 2026', 'Tim Promkes Puskesmas', 'Video Edukasi', 'bg-blue-100 text-blue-800 border-blue-200', 'https://img.youtube.com/vi/eAlBrKaqpdc/hqdefault.jpg', 1, 'https://www.youtube.com/embed/eAlBrKaqpdc');


-- ------------------------------------------------------------
-- 4. TABEL PENGUMUMAN & KINERJA MUTU (announcements)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `date` VARCHAR(50) DEFAULT NULL,
  `is_urgent` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `announcements` (`id`, `title`, `category`, `content`, `date`, `is_urgent`) VALUES
('ann-1', 'Standar Pelayanan Publik (PermenPAN-RB No. 15/2014)', 'PermenPAN-RB', 'Penerapan 14 komponen standar pelayanan mencakup kepastian persyaratan, kejelasan prosedur, jam layanan, biaya transparan, serta maklumat pelayanan publik.', 'Mutu Pelayanan', 0),
('ann-2', 'Terakreditasi Utama - Kemenkes RI', 'Akreditasi Utama', 'Puskesmas Pondok Benda meraih predikat Akreditasi Utama dalam pemenuhan standar fasilitas kesehatan, keselamatan pasien, dan tata kelola mutu.', 'Resmi Kemenkes', 1),
('ann-3', 'Evaluasi IKM & Penanganan Pengaduan Mampu Usut', 'Penilaian Mutu', 'Tingkat kepuasan masyarakat diukur secara berkala melalui Indeks Kepuasan Masyarakat (IKM) serta saluran pengaduan cepat via Hotline WA 082311366261.', 'Terintegrasi', 0);


-- ------------------------------------------------------------
-- 5. TABEL TIKET ANTREAN PASIEN (queue_tickets)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `queue_tickets`;
CREATE TABLE `queue_tickets` (
  `id` VARCHAR(50) NOT NULL,
  `queue_number` VARCHAR(20) NOT NULL,
  `patient_type` ENUM('BPJS','Umum') NOT NULL DEFAULT 'BPJS',
  `nik` VARCHAR(20) NOT NULL,
  `bpjs_number` VARCHAR(30) DEFAULT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `birth_date` DATE DEFAULT NULL,
  `gender` ENUM('L','P') DEFAULT 'L',
  `phone` VARCHAR(30) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `poli_id` VARCHAR(50) NOT NULL,
  `poli_name` VARCHAR(100) NOT NULL,
  `appointment_date` DATE NOT NULL,
  `time_slot` VARCHAR(50) DEFAULT '08:00 - 11:00 WIB',
  `chief_complaint` TEXT DEFAULT NULL,
  `status` ENUM('Waiting','Called','Completed','Cancelled') NOT NULL DEFAULT 'Waiting',
  `estimated_time` VARCHAR(100) DEFAULT NULL,
  `registration_number` VARCHAR(50) DEFAULT NULL,
  `klaster_name` VARCHAR(100) DEFAULT NULL,
  `medical_record_no` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nik` (`nik`),
  KEY `idx_date_poli` (`appointment_date`, `poli_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_tickets_poli` FOREIGN KEY (`poli_id`) REFERENCES `polis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 5B. TABEL REKAM MEDIS ELEKTRONIK (medical_records)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `medical_records`;
CREATE TABLE `medical_records` (
  `id` VARCHAR(50) NOT NULL,
  `patient_name` VARCHAR(150) NOT NULL,
  `nik` VARCHAR(20) NOT NULL,
  `bpjs_number` VARCHAR(30) DEFAULT NULL,
  `queue_number` VARCHAR(30) DEFAULT NULL,
  `visit_date` DATE NOT NULL,
  `poli_service` VARCHAR(100) NOT NULL,
  `doctor_name` VARCHAR(150) DEFAULT NULL,
  `gender` ENUM('L','P') DEFAULT 'L',
  `age` INT DEFAULT 0,
  `systolic` INT DEFAULT 120,
  `diastolic` INT DEFAULT 80,
  `heart_rate` INT DEFAULT 80,
  `temperature` DECIMAL(4,1) DEFAULT 36.5,
  `respiratory_rate` INT DEFAULT 20,
  `subjective` TEXT DEFAULT NULL,
  `objective` TEXT DEFAULT NULL,
  `assessment` TEXT DEFAULT NULL,
  `icd10_code` VARCHAR(20) DEFAULT NULL,
  `diagnosis_name` VARCHAR(255) DEFAULT NULL,
  `plan` TEXT DEFAULT NULL,
  `prescriptions_json` TEXT DEFAULT NULL,
  `status` ENUM('Menunggu','Diperiksa','Selesai') DEFAULT 'Menunggu',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_nik_rme` (`nik`),
  KEY `idx_visit_date` (`visit_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 6. TABEL SURVEI KEPUASAN MASYARAKAT (surveys)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `surveys`;
CREATE TABLE `surveys` (
  `id` VARCHAR(50) NOT NULL,
  `patient_name` VARCHAR(150) DEFAULT 'Masyarakat Tangsel',
  `rating` INT NOT NULL DEFAULT 5,
  `service_poli` VARCHAR(100) NOT NULL,
  `service_quality` INT DEFAULT 5,
  `waiting_time_rating` INT DEFAULT 5,
  `cleanliness_rating` INT DEFAULT 5,
  `feedback` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 7. TABEL PESAN, SARAN & ADUAN MASYARAKAT (contact_messages)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `subject` VARCHAR(200) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `reply` TEXT DEFAULT NULL,
  `replied_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ------------------------------------------------------------
-- 8. TABEL ADMIN & PETUGAS PUSKESMAS (users_admin)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `users_admin`;
CREATE TABLE `users_admin` (
  `id` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('SuperAdmin','PetugasPoli','PetugasPendaftaran') NOT NULL DEFAULT 'PetugasPoli',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin default: username 'admin', password 'admin' (bisa diubah nanti)
INSERT INTO `users_admin` (`id`, `username`, `password_hash`, `full_name`, `role`) VALUES
('usr-1', 'admin', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Petugas Admin Puskesmas', 'SuperAdmin');


-- ============================================================
-- VIEW UNTUK RINGKASAN ANTREAN HARI INI
-- ============================================================
CREATE OR REPLACE VIEW `vw_daily_queue_summary` AS
SELECT 
  p.id AS poli_id,
  p.name AS poli_name,
  p.queue_prefix,
  COUNT(t.id) AS total_tickets,
  SUM(CASE WHEN t.status = 'Waiting' THEN 1 ELSE 0 END) AS waiting_count,
  SUM(CASE WHEN t.status = 'Called' THEN 1 ELSE 0 END) AS called_count,
  SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_count,
  SUM(CASE WHEN t.status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_count
FROM `polis` p
LEFT JOIN `queue_tickets` t ON p.id = t.poli_id AND t.appointment_date = CURDATE()
GROUP BY p.id, p.name, p.queue_prefix;

-- Re-enable Foreign Key Checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- FINISH INSTRUCTIONS
-- ============================================================
-- Impor file ini langsung di phpMyAdmin (Menu Import -> Choose File -> Go)
-- atau jalankan via MySQL CLI:
-- mysql -u root -p < database.sql
-- ============================================================
