import React, { useState } from 'react';
import {
  Layers,
  Database,
  ArrowRight,
  GitBranch,
  CheckCircle2,
  Users,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  Printer,
  ShieldCheck,
  Stethoscope,
  Network,
  HelpCircle,
  BrainCircuit,
  Lock,
  Unlock,
  Key,
  BarChart3,
  Award,
  ListOrdered,
  AlertCircle,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  ChevronDown,
  Table as TableIcon,
  Workflow,
  GitCommit,
  User,
  Radio,
  ArrowDownRight,
  CircleDot,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export interface DataFieldSpec {
  no: number;
  fieldName: string;
  dataType: string;
  size: string | number;
  isNull: 'NOT NULL' | 'NULL';
  keyType?: 'PK' | 'FK';
  description: string;
}

export interface TableSpec {
  id: string;
  tableNumber: string;
  tableName: string;
  fileAcronym: string;
  functionDesc: string;
  media: string;
  recordLength: string;
  primaryKey: string;
  foreignKey: string;
  category: 'utama' | 'pendukung';
  classDiagramEntity: string;
  fields: DataFieldSpec[];
}

export const ClassDiagramView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'use-case' | 'activity' | 'sequence' | 'class-diagram' | 'spek-basisdata' | 'elisitasi' | 'roles' | 'random-forest'
  >('use-case');

  const [selectedClassId, setSelectedClassId] = useState<string>('Pendaftaran');
  const [selectedTableCategory, setSelectedTableCategory] = useState<'all' | 'utama' | 'pendukung'>('all');
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [copiedTableId, setCopiedTableId] = useState<string | null>(null);
  const [copyAllStatus, setCopyAllStatus] = useState<boolean>(false);
  const [copiedDiagramId, setCopiedDiagramId] = useState<string | null>(null);

  // Helper copy to clipboard
  const copyTextToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDiagramId(id);
    setTimeout(() => setCopiedDiagramId(null), 3000);
  };

  // Exact 8 Classes from Gambar 4.7 Class Diagram Sistem Usulan (Halaman 94 / 107 Skripsi)
  const skripsiClasses = [
    {
      id: 'User',
      name: 'User',
      stereotype: '<<Entity>>',
      category: 'Otentikasi & Akun Pengguna',
      color: 'border-slate-800 bg-slate-50 text-slate-900',
      badge: 'Tabel User',
      description: 'Menyimpan kredensial akun pengguna sistem (Super Admin, Admin/Petugas, Dokter, dan Pasien).',
      attributes: [
        '- id_user: int',
        '- nama: string',
        '- email: string',
        '- password: string',
        '- role: enum'
      ],
      operations: [
        '+ login()',
        '+ logout()'
      ],
      relations: [
        'User (1) ────── (1..*) Pasien'
      ]
    },
    {
      id: 'Pasien',
      name: 'Pasien',
      stereotype: '<<Entity>>',
      category: 'Master Data Pasien',
      color: 'border-blue-600 bg-blue-50/50 text-blue-950',
      badge: 'Tabel Pasien',
      description: 'Menyimpan identitas lengkap pasien yang berobat ke Puskesmas Pondok Benda.',
      attributes: [
        '- id_pasien: int',
        '- nik: string',
        '- nama: string',
        '- alamat: string',
        '- no_telp: string',
        '- tgl_lahir: date'
      ],
      operations: [
        '+ register()',
        '+ updateData()'
      ],
      relations: [
        'User (1) ────── (1..*) Pasien',
        'Pasien (1) ────── (1..*) Pendaftaran'
      ]
    },
    {
      id: 'Pendaftaran',
      name: 'Pendaftaran',
      stereotype: '<<Entity / Transaksi>>',
      category: 'Pendaftaran Online Pasien',
      color: 'border-emerald-600 bg-emerald-50/60 text-emerald-950',
      badge: 'Tabel Pendaftaran',
      description: 'Menghubungkan Pasien dengan JadwalDokter, mencatat tanggal pendaftaran dan status verifikasi.',
      attributes: [
        '- id_daftar: int',
        '- id_pasien: int',
        '- id_jadwal: int',
        '- tgl_daftar: datetime',
        '- status: enum'
      ],
      operations: [
        '+ create()',
        '+ updateStatus()'
      ],
      relations: [
        'Pasien (1) ────── (1..*) Pendaftaran',
        'Pendaftaran (1..*) ────── (1) JadwalDokter'
      ]
    },
    {
      id: 'JadwalDokter',
      name: 'JadwalDokter',
      stereotype: '<<Entity / Penjadwalan>>',
      category: 'Jadwal Waktu Jaga Dokter',
      color: 'border-amber-600 bg-amber-50/50 text-amber-950',
      badge: 'Tabel JadwalDokter',
      description: 'Menyimpan alokasi jadwal jaga dokter, poliklinik tugas, tanggal praktik, serta jam mulai dan selesai.',
      attributes: [
        '- id_jadwal: int',
        '- id_dokter: int',
        '- id_poli: int',
        '- tanggal: date',
        '- jam_mulai: time',
        '- jam_selesai: time'
      ],
      operations: [
        '+ create()',
        '+ update()'
      ],
      relations: [
        'Pendaftaran (1..*) ────── (1) JadwalDokter',
        'JadwalDokter (1..*) ────── (1) Dokter',
        'JadwalDokter (1..*) ────── (1) Poli',
        'Prediksi (1..*) ────── (1) JadwalDokter'
      ]
    },
    {
      id: 'Dokter',
      name: 'Dokter',
      stereotype: '<<Entity>>',
      category: 'Master Data Tenaga Medis',
      color: 'border-purple-600 bg-purple-50/50 text-purple-950',
      badge: 'Tabel Dokter',
      description: 'Menyimpan master data dokter pemeriksa dan spesialisasi tugasnya di Puskesmas.',
      attributes: [
        '- id_dokter: int',
        '- nama: string',
        '- spesialis: string'
      ],
      operations: [
        '+ create()',
        '+ update()'
      ],
      relations: [
        'JadwalDokter (1..*) ────── (1) Dokter'
      ]
    },
    {
      id: 'Poli',
      name: 'Poli',
      stereotype: '<<Entity>>',
      category: 'Master Data Unit Layanan',
      color: 'border-teal-600 bg-teal-50/50 text-teal-950',
      badge: 'Tabel Poli',
      description: 'Menyimpan master data poliklinik pelayanan kesehatan (Poli Umum, Poli Gigi, Poli KIA/KB, dll).',
      attributes: [
        '- id_poli: int',
        '- nama_poli: string'
      ],
      operations: [
        '+ create()',
        '+ update()'
      ],
      relations: [
        'JadwalDokter (1..*) ────── (1) Poli'
      ]
    },
    {
      id: 'ModelRF',
      name: 'ModelRF',
      stereotype: '<<Machine Learning>>',
      category: 'Algoritma Random Forest',
      color: 'border-cyan-600 bg-cyan-50/50 text-cyan-950',
      badge: 'Tabel ModelRF',
      description: 'Menyimpan metadata model Random Forest hasil pelatihan (tanggal latih, skor akurasi 92.5%).',
      attributes: [
        '- id_model: int',
        '- nama_model: string',
        '- tgl_latih: datetime',
        '- akurasi: float'
      ],
      operations: [
        '+ train()',
        '+ predict()'
      ],
      relations: [
        'ModelRF (1) ────── (1..*) Prediksi'
      ]
    },
    {
      id: 'Prediksi',
      name: 'Prediksi',
      stereotype: '<<Hasil Prediksi / AI>>',
      category: 'Hasil Prediksi Ketersediaan Dokter',
      color: 'border-indigo-600 bg-indigo-50/50 text-indigo-950',
      badge: 'Tabel Prediksi',
      description: 'Menyimpan output prediksi probabilitas ketersediaan slot/dokter per jadwal waktu jaga.',
      attributes: [
        '- id_prediksi: int',
        '- id_jadwal: int',
        '- tgl_prediksi: datetime',
        '- probabilitas: float',
        '- kategori: string'
      ],
      operations: [
        '+ predict()'
      ],
      relations: [
        'ModelRF (1) ────── (1..*) Prediksi',
        'Prediksi (1..*) ────── (1) JadwalDokter'
      ]
    }
  ];

  // 12 Database Specifications
  const databaseSpecifications: TableSpec[] = [
    {
      id: 'tb_user',
      tableNumber: 'Tabel 4.10',
      tableName: 'User',
      fileAcronym: 'tb_user',
      functionDesc: 'Untuk menyimpan data kredensial akun pengguna sistem (Super Admin IT, Admin Petugas Loket, Dokter, dan Pasien terdaftar).',
      media: 'Harddisk',
      recordLength: '391 Byte',
      primaryKey: 'id_user',
      foreignKey: '-',
      category: 'utama',
      classDiagramEntity: 'Class User (Gambar 4.7)',
      fields: [
        { no: 1, fieldName: 'id_user', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID unik pengguna' },
        { no: 2, fieldName: 'nama', dataType: 'VARCHAR', size: 100, isNull: 'NOT NULL', description: 'Nama lengkap resmi pengguna sistem' },
        { no: 3, fieldName: 'email', dataType: 'VARCHAR', size: 100, isNull: 'NOT NULL', description: 'Alamat email aktif untuk otentikasi login' },
        { no: 4, fieldName: 'password', dataType: 'VARCHAR', size: 255, isNull: 'NOT NULL', description: 'Kata sandi akun terenkripsi (Hash Bcrypt/Argon2)' },
        { no: 5, fieldName: 'role', dataType: 'ENUM', size: 20, isNull: 'NOT NULL', description: 'Hak akses: superadmin, admin, dokter, pasien' },
        { no: 6, fieldName: 'created_at', dataType: 'TIMESTAMP', size: '-', isNull: 'NOT NULL', description: 'Waktu dan tanggal pembuatan data akun' },
        { no: 7, fieldName: 'updated_at', dataType: 'TIMESTAMP', size: '-', isNull: 'NULL', description: 'Waktu terakhir data akun diperbarui' }
      ]
    },
    {
      id: 'tb_pasien',
      tableNumber: 'Tabel 4.11',
      tableName: 'Pasien',
      fileAcronym: 'tb_pasien',
      functionDesc: 'Untuk menyimpan data identitas kependudukan pasien yang mendaftar dan berobat di Puskesmas Pondok Benda.',
      media: 'Harddisk',
      recordLength: '408 Byte',
      primaryKey: 'id_pasien',
      foreignKey: 'id_user',
      category: 'utama',
      classDiagramEntity: 'Class Pasien (Gambar 4.7)',
      fields: [
        { no: 1, fieldName: 'id_pasien', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID unik data pasien' },
        { no: 2, fieldName: 'id_user', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'FK', description: 'Foreign Key mereferensi ke tb_user(id_user)' },
        { no: 3, fieldName: 'nik', dataType: 'VARCHAR', size: 16, isNull: 'NOT NULL', description: 'Nomor Induk Kependudukan (16 digit) sesuai e-KTP' },
        { no: 4, fieldName: 'nama', dataType: 'VARCHAR', size: 100, isNull: 'NOT NULL', description: 'Nama lengkap pasien sesuai kartu identitas resmi' },
        { no: 5, fieldName: 'alamat', dataType: 'TEXT', size: '-', isNull: 'NOT NULL', description: 'Alamat domisili lengkap tempat tinggal pasien' },
        { no: 6, fieldName: 'no_telp', dataType: 'VARCHAR', size: 15, isNull: 'NOT NULL', description: 'Nomor telepon / kontak WhatsApp aktif pasien' },
        { no: 7, fieldName: 'tgl_lahir', dataType: 'DATE', size: '-', isNull: 'NOT NULL', description: 'Tanggal lahir pasien (format: YYYY-MM-DD)' },
        { no: 8, fieldName: 'jenis_kelamin', dataType: 'ENUM', size: 1, isNull: 'NOT NULL', description: 'Jenis kelamin (L = Laki-laki, P = Perempuan)' },
        { no: 9, fieldName: 'jenis_pasien', dataType: 'ENUM', size: 10, isNull: 'NOT NULL', description: 'Kategori kepesertaan penjamin: BPJS atau UMUM' },
        { no: 10, fieldName: 'no_bpjs', dataType: 'VARCHAR', size: 20, isNull: 'NULL', description: 'Nomor kartu kepesertaan BPJS Kesehatan (jika ada)' }
      ]
    },
    {
      id: 'tb_pendaftaran',
      tableNumber: 'Tabel 4.12',
      tableName: 'Pendaftaran',
      fileAcronym: 'tb_pendaftaran',
      functionDesc: 'Untuk mencatat riwayat transaksi pendaftaran antrean berobat pasien online maupun verifikasi di loket puskesmas.',
      media: 'Harddisk',
      recordLength: '326 Byte',
      primaryKey: 'id_daftar',
      foreignKey: 'id_pasien, id_jadwal',
      category: 'utama',
      classDiagramEntity: 'Class Pendaftaran (Gambar 4.7)',
      fields: [
        { no: 1, fieldName: 'id_daftar', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID transaksi pendaftaran' },
        { no: 2, fieldName: 'nomor_antrean', dataType: 'VARCHAR', size: 15, isNull: 'NOT NULL', description: 'Kode nomor tiket antrean resmi (contoh: A-001, B-005)' },
        { no: 3, fieldName: 'id_pasien', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'FK', description: 'Foreign Key mereferensi ke tb_pasien(id_pasien)' },
        { no: 4, fieldName: 'id_jadwal', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'FK', description: 'Foreign Key mereferensi ke tb_jadwal_dokter(id_jadwal)' },
        { no: 5, fieldName: 'tgl_daftar', dataType: 'DATETIME', size: '-', isNull: 'NOT NULL', description: 'Tanggal dan jam transaksi pendaftaran dibuat' },
        { no: 6, fieldName: 'tgl_kunjungan', dataType: 'DATE', size: '-', isNull: 'NOT NULL', description: 'Tanggal rencana berobat/kunjungan ke puskesmas' },
        { no: 7, fieldName: 'keluhan', dataType: 'TEXT', size: '-', isNull: 'NULL', description: 'Keluhan utama atau gejala kesehatan yang dirasakan' },
        { no: 8, fieldName: 'status', dataType: 'ENUM', size: 20, isNull: 'NOT NULL', description: 'Status antrean: menunggu, dipanggil, selesai, batal' },
        { no: 9, fieldName: 'waktu_panggil', dataType: 'DATETIME', size: '-', isNull: 'NULL', description: 'Waktu pemanggilan antrean oleh petugas loket/poli' }
      ]
    },
    {
      id: 'tb_jadwal_dokter',
      tableNumber: 'Tabel 4.13',
      tableName: 'JadwalDokter',
      fileAcronym: 'tb_jadwal_dokter',
      functionDesc: 'Untuk menyimpan alokasi jadwal waktu jaga dokter, poliklinik tugas, tanggal praktik, serta kuota pendaftaran.',
      media: 'Harddisk',
      recordLength: '122 Byte',
      primaryKey: 'id_jadwal',
      foreignKey: 'id_dokter, id_poli',
      category: 'utama',
      classDiagramEntity: 'Class JadwalDokter (Gambar 4.7)',
      fields: [
        { no: 1, fieldName: 'id_jadwal', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID unik jadwal praktik' },
        { no: 2, fieldName: 'id_dokter', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'FK', description: 'Foreign Key mereferensi ke tb_dokter(id_dokter)' },
        { no: 3, fieldName: 'id_poli', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'FK', description: 'Foreign Key mereferensi ke tb_poli(id_poli)' },
        { no: 4, fieldName: 'tanggal', dataType: 'DATE', size: '-', isNull: 'NOT NULL', description: 'Tanggal kalender pelaksanaan jadwal jaga' },
        { no: 5, fieldName: 'hari', dataType: 'VARCHAR', size: 10, isNull: 'NOT NULL', description: 'Hari jaga: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu' },
        { no: 6, fieldName: 'jam_mulai', dataType: 'TIME', size: '-', isNull: 'NOT NULL', description: 'Jam mulai pelayanan (contoh: 08:00:00)' },
        { no: 7, fieldName: 'jam_selesai', dataType: 'TIME', size: '-', isNull: 'NOT NULL', description: 'Jam selesai pelayanan (contoh: 12:00:00)' },
        { no: 8, fieldName: 'kuota_maksimal', dataType: 'INT', size: 5, isNull: 'NOT NULL', description: 'Alokasi kuota pasien per sesi waktu (30-40 orang)' },
        { no: 9, fieldName: 'status_ketersediaan', dataType: 'ENUM', size: 15, isNull: 'NOT NULL', description: 'Status ketersediaan: tersedia, penuh, cuti' }
      ]
    },
    {
      id: 'tb_dokter',
      tableNumber: 'Tabel 4.14',
      tableName: 'Dokter',
      fileAcronym: 'tb_dokter',
      functionDesc: 'Untuk menyimpan master data tenaga medis pemeriksa (dokter) di Puskesmas Pondok Benda.',
      media: 'Harddisk',
      recordLength: '195 Byte',
      primaryKey: 'id_dokter',
      foreignKey: '-',
      category: 'utama',
      classDiagramEntity: 'Class Dokter (Gambar 4.7)',
      fields: [
        { no: 1, fieldName: 'id_dokter', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID unik dokter' },
        { no: 2, fieldName: 'nip', dataType: 'VARCHAR', size: 25, isNull: 'NULL', description: 'Nomor Induk Pegawai dokter (PNS / PPPK / Non-ASN)' },
        { no: 3, fieldName: 'nama', dataType: 'VARCHAR', size: 100, isNull: 'NOT NULL', description: 'Nama lengkap dokter beserta gelar profesi medis' },
        { no: 4, fieldName: 'spesialis', dataType: 'VARCHAR', size: 50, isNull: 'NOT NULL', description: 'Bidang spesialisasi tugas (Dokter Umum, Gigi, KIA)' },
        { no: 5, fieldName: 'no_telp', dataType: 'VARCHAR', size: 15, isNull: 'NULL', description: 'Nomor telepon / kontak WhatsApp dokter' },
        { no: 6, fieldName: 'status_aktif', dataType: 'TINYINT', size: 1, isNull: 'NOT NULL', description: 'Status keaktifan praktik (1 = Aktif, 0 = Non-aktif)' }
      ]
    },
    {
      id: 'tb_poli',
      tableNumber: 'Tabel 4.15',
      tableName: 'Poli',
      fileAcronym: 'tb_poli',
      functionDesc: 'Untuk menyimpan master data unit pelayanan poliklinik kesehatan di Puskesmas Pondok Benda.',
      media: 'Harddisk',
      recordLength: '165 Byte',
      primaryKey: 'id_poli',
      foreignKey: '-',
      category: 'utama',
      classDiagramEntity: 'Class Poli (Gambar 4.7)',
      fields: [
        { no: 1, fieldName: 'id_poli', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID unik poliklinik' },
        { no: 2, fieldName: 'kode_poli', dataType: 'VARCHAR', size: 10, isNull: 'NOT NULL', description: 'Kode unik poli (contoh: POL-UM, POL-GG, POL-KIA)' },
        { no: 3, fieldName: 'nama_poli', dataType: 'VARCHAR', size: 50, isNull: 'NOT NULL', description: 'Nama poliklinik pelayanan kesehatan masyarakat' },
        { no: 4, fieldName: 'deskripsi', dataType: 'TEXT', size: '-', isNull: 'NULL', description: 'Uraian ruang lingkup pelayanan poliklinik' },
        { no: 5, fieldName: 'klaster_ilp', dataType: 'VARCHAR', size: 50, isNull: 'NULL', description: 'Klaster Integrasi Layanan Primer (ILP Kemenkes)' }
      ]
    },
    {
      id: 'tb_model_rf',
      tableNumber: 'Tabel 4.16',
      tableName: 'ModelRF',
      fileAcronym: 'tb_model_rf',
      functionDesc: 'Untuk menyimpan konfigurasi parameter dan metrik performa model Random Forest hasil pelatihan data.',
      media: 'Harddisk',
      recordLength: '145 Byte',
      primaryKey: 'id_model',
      foreignKey: '-',
      category: 'utama',
      classDiagramEntity: 'Class ModelRF (Gambar 4.7)',
      fields: [
        { no: 1, fieldName: 'id_model', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID unik model AI' },
        { no: 2, fieldName: 'nama_model', dataType: 'VARCHAR', size: 50, isNull: 'NOT NULL', description: 'Nama model: RF-Ketersediaan-Dokter-v1' },
        { no: 3, fieldName: 'n_estimators', dataType: 'INT', size: 5, isNull: 'NOT NULL', description: 'Jumlah decision tree dalam ensemble model (100)' },
        { no: 4, fieldName: 'max_depth', dataType: 'INT', size: 5, isNull: 'NULL', description: 'Batas kedalaman maksimal pohon keputusan' },
        { no: 5, fieldName: 'tgl_latih', dataType: 'DATETIME', size: '-', isNull: 'NOT NULL', description: 'Waktu dan tanggal proses pelatihan model selesai' },
        { no: 6, fieldName: 'akurasi', dataType: 'FLOAT', size: '-', isNull: 'NOT NULL', description: 'Nilai akurasi model pada data uji (0.925 / 92.5%)' },
        { no: 7, fieldName: 'precision_score', dataType: 'FLOAT', size: '-', isNull: 'NOT NULL', description: 'Skor presisi evaluasi model data uji (0.931 / 93.1%)' },
        { no: 8, fieldName: 'recall_score', dataType: 'FLOAT', size: '-', isNull: 'NOT NULL', description: 'Skor recall / sensitivitas model (0.964 / 96.4%)' },
        { no: 9, fieldName: 'f1_score', dataType: 'FLOAT', size: '-', isNull: 'NOT NULL', description: 'Skor F1 harmonic mean evaluasi model (0.947 / 94.72%)' }
      ]
    },
    {
      id: 'tb_prediksi',
      tableNumber: 'Tabel 4.17',
      tableName: 'Prediksi',
      fileAcronym: 'tb_prediksi',
      functionDesc: 'Untuk menyimpan riwayat hasil inferensi probabilitas ketersediaan slot dan waktu jaga dokter kepada pasien.',
      media: 'Harddisk',
      recordLength: '162 Byte',
      primaryKey: 'id_prediksi',
      foreignKey: 'id_model, id_jadwal',
      category: 'utama',
      classDiagramEntity: 'Class Prediksi (Gambar 4.7)',
      fields: [
        { no: 1, fieldName: 'id_prediksi', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID hasil prediksi AI' },
        { no: 2, fieldName: 'id_model', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'FK', description: 'Foreign Key mereferensi ke tb_model_rf(id_model)' },
        { no: 3, fieldName: 'id_jadwal', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'FK', description: 'Foreign Key mereferensi ke tb_jadwal_dokter(id_jadwal)' },
        { no: 4, fieldName: 'tgl_prediksi', dataType: 'DATETIME', size: '-', isNull: 'NOT NULL', description: 'Waktu eksekusi proses inferensi probabilitas' },
        { no: 5, fieldName: 'probabilitas', dataType: 'FLOAT', size: '-', isNull: 'NOT NULL', description: 'Nilai probabilitas ketersediaan dokter (0.00 - 1.00)' },
        { no: 6, fieldName: 'kategori', dataType: 'VARCHAR', size: 30, isNull: 'NOT NULL', description: 'Kategori hasil: Sangat Tersedia, Padat, Penuh' },
        { no: 7, fieldName: 'rekomendasi', dataType: 'VARCHAR', size: 100, isNull: 'NULL', description: 'Rekomendasi saran alternatif pemilihan jadwal' }
      ]
    },
    {
      id: 'tb_artikel',
      tableNumber: 'Tabel 4.18',
      tableName: 'Artikel',
      fileAcronym: 'tb_artikel',
      functionDesc: 'Untuk menyimpan artikel berita, edukasi kesehatan, dan tips medis (Elisitasi Fungsional No. 22-25).',
      media: 'Harddisk',
      recordLength: '360 Byte',
      primaryKey: 'id_artikel',
      foreignKey: 'id_user',
      category: 'pendukung',
      classDiagramEntity: 'Tabel Pendukung Elisitasi Website',
      fields: [
        { no: 1, fieldName: 'id_artikel', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID artikel' },
        { no: 2, fieldName: 'id_user', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'FK', description: 'Foreign Key pembuat artikel ke tb_user(id_user)' },
        { no: 3, fieldName: 'judul', dataType: 'VARCHAR', size: 150, isNull: 'NOT NULL', description: 'Judul artikel publikasi kesehatan' },
        { no: 4, fieldName: 'kategori', dataType: 'VARCHAR', size: 50, isNull: 'NOT NULL', description: 'Kategori: Edukasi, Pengumuman, Pola Hidup Sehat' },
        { no: 5, fieldName: 'ringkasan', dataType: 'VARCHAR', size: 255, isNull: 'NOT NULL', description: 'Ringkasan singkat isi artikel' },
        { no: 6, fieldName: 'konten', dataType: 'TEXT', size: '-', isNull: 'NOT NULL', description: 'Isi lengkap teks artikel berita' },
        { no: 7, fieldName: 'penulis', dataType: 'VARCHAR', size: 50, isNull: 'NOT NULL', description: 'Nama penulis artikel (Tim Promkes / Admin)' },
        { no: 8, fieldName: 'tgl_publish', dataType: 'DATE', size: '-', isNull: 'NOT NULL', description: 'Tanggal artikel dipublikasikan di website' }
      ]
    },
    {
      id: 'tb_galeri',
      tableNumber: 'Tabel 4.19',
      tableName: 'Galeri',
      fileAcronym: 'tb_galeri',
      functionDesc: 'Untuk menyimpan dokumentasi foto kegiatan pelayanan dan penyuluhan puskesmas (Elisitasi Fungsional No. 26-27).',
      media: 'Harddisk',
      recordLength: '275 Byte',
      primaryKey: 'id_galeri',
      foreignKey: '-',
      category: 'pendukung',
      classDiagramEntity: 'Tabel Pendukung Elisitasi Website',
      fields: [
        { no: 1, fieldName: 'id_galeri', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID foto galeri' },
        { no: 2, fieldName: 'judul_kegiatan', dataType: 'VARCHAR', size: 100, isNull: 'NOT NULL', description: 'Nama kegiatan dokumentasi puskesmas' },
        { no: 3, fieldName: 'kategori', dataType: 'VARCHAR', size: 50, isNull: 'NOT NULL', description: 'Kategori dokumentasi: Posyandu, Vaksinasi, Penyuluhan' },
        { no: 4, fieldName: 'foto_url', dataType: 'VARCHAR', size: 255, isNull: 'NOT NULL', description: 'Path atau URL file foto dokumentasi kegiatan' },
        { no: 5, fieldName: 'tgl_kegiatan', dataType: 'DATE', size: '-', isNull: 'NOT NULL', description: 'Tanggal pelaksanaan kegiatan' }
      ]
    },
    {
      id: 'tb_kritik_saran',
      tableNumber: 'Tabel 4.20',
      tableName: 'KritikSaran',
      fileAcronym: 'tb_kritik_saran',
      functionDesc: 'Untuk mencatat pesan kritik, saran aspirasi masyarakat, serta status balasan admin (Elisitasi Fungsional No. 29-31).',
      media: 'Harddisk',
      recordLength: '385 Byte',
      primaryKey: 'id_saran',
      foreignKey: '-',
      category: 'pendukung',
      classDiagramEntity: 'Tabel Pendukung Elisitasi Website',
      fields: [
        { no: 1, fieldName: 'id_saran', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID kritik saran' },
        { no: 2, fieldName: 'nama_pengirim', dataType: 'VARCHAR', size: 100, isNull: 'NOT NULL', description: 'Nama lengkap pengirim pesan' },
        { no: 3, fieldName: 'email_pengirim', dataType: 'VARCHAR', size: 100, isNull: 'NOT NULL', description: 'Email pengirim untuk balasan respon' },
        { no: 4, fieldName: 'subjek', dataType: 'VARCHAR', size: 100, isNull: 'NOT NULL', description: 'Topik atau perihal pesan saran' },
        { no: 5, fieldName: 'pesan', dataType: 'TEXT', size: '-', isNull: 'NOT NULL', description: 'Isi lengkap uraian kritik dan saran' },
        { no: 6, fieldName: 'balasan', dataType: 'TEXT', size: '-', isNull: 'NULL', description: 'Tanggapan resmi balasan dari tim admin puskesmas' },
        { no: 7, fieldName: 'status', dataType: 'ENUM', size: 15, isNull: 'NOT NULL', description: 'Status pesan: belum_dibalas, sudah_dibalas' },
        { no: 8, fieldName: 'tgl_kirim', dataType: 'DATETIME', size: '-', isNull: 'NOT NULL', description: 'Waktu dan tanggal pesan dikirimkan' }
      ]
    },
    {
      id: 'tb_survei_ikm',
      tableNumber: 'Tabel 4.21',
      tableName: 'SurveiIKM',
      fileAcronym: 'tb_survei_ikm',
      functionDesc: 'Untuk menyimpan kuesioner Survei Indeks Kepuasan Masyarakat (PermenPAN-RB No. 14 Tahun 2017) oleh pasien.',
      media: 'Harddisk',
      recordLength: '245 Byte',
      primaryKey: 'id_survei',
      foreignKey: 'id_daftar',
      category: 'pendukung',
      classDiagramEntity: 'Tabel Pendukung Elisitasi Website',
      fields: [
        { no: 1, fieldName: 'id_survei', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'PK', description: 'Primary Key, Auto Increment, ID pengisian survei' },
        { no: 2, fieldName: 'id_daftar', dataType: 'INT', size: 11, isNull: 'NOT NULL', keyType: 'FK', description: 'Foreign Key ke tb_pendaftaran(id_daftar)' },
        { no: 3, fieldName: 'nilai_pelayanan', dataType: 'TINYINT', size: 1, isNull: 'NOT NULL', description: 'Skor kesesuaian persyaratan pelayanan (1 - 4)' },
        { no: 4, fieldName: 'nilai_waktu', dataType: 'TINYINT', size: 1, isNull: 'NOT NULL', description: 'Skor kecepatan waktu pelayanan (1 - 4)' },
        { no: 5, fieldName: 'nilai_biaya', dataType: 'TINYINT', size: 1, isNull: 'NOT NULL', description: 'Skor kesesuaian tarif biaya pelayanan (1 - 4)' },
        { no: 6, fieldName: 'nilai_petugas', dataType: 'TINYINT', size: 1, isNull: 'NOT NULL', description: 'Skor kesopanan dan keramahan petugas (1 - 4)' },
        { no: 7, fieldName: 'skor_total_ikm', dataType: 'FLOAT', size: '-', isNull: 'NOT NULL', description: 'Skor konversi IKM (rentang 25 - 100)' },
        { no: 8, fieldName: 'mutu_pelayanan', dataType: 'VARCHAR', size: 10, isNull: 'NOT NULL', description: 'Mutu pelayanan: A (Sangat Baik), B (Baik)' },
        { no: 9, fieldName: 'tgl_survei', dataType: 'DATETIME', size: '-', isNull: 'NOT NULL', description: 'Waktu pengisian survei kepuasan masyarakat' }
      ]
    }
  ];

  // Helper format single table
  const formatTableForSkripsi = (table: TableSpec): string => {
    let text = `${table.tableNumber} Spesifikasi Basis Data ${table.tableName}\n`;
    text += `Nama Basis Data   : db_puskesmas_pondokbenda\n`;
    text += `Nama File / Tabel : ${table.tableName}\n`;
    text += `Akronim File      : ${table.fileAcronym}\n`;
    text += `Fungsi            : ${table.functionDesc}\n`;
    text += `Media             : ${table.media}\n`;
    text += `Panjang Record    : ${table.recordLength}\n`;
    text += `Primary Key       : ${table.primaryKey}\n`;
    text += `Foreign Key       : ${table.foreignKey}\n\n`;
    text += `No\tNama Field\tTipe Data\tPanjang\tNull\tKeterangan\n`;
    table.fields.forEach((f) => {
      text += `${f.no}\t${f.fieldName}\t${f.dataType}\t${f.size}\t${f.isNull}\t${f.description}\n`;
    });
    return text;
  };

  const handleCopySingleTable = (table: TableSpec) => {
    const formatted = formatTableForSkripsi(table);
    navigator.clipboard.writeText(formatted);
    setCopiedTableId(table.id);
    setTimeout(() => setCopiedTableId(null), 3000);
  };

  const handleCopyAllTables = () => {
    let allText = `4.3.5 SPESIFIKASI BASIS DATA SISTEM USULAN\n`;
    allText += `Sistem Pendaftaran Online Pasien Berdasarkan Jadwal Waktu Jaga Dokter Berbasis Algoritma Random Forest\n`;
    allText += `Puskesmas Pondok Benda Kota Tangerang Selatan\n\n`;
    allText += `Spesifikasi basis data menjelaskan secara terperinci setiap file tabel basis data yang digunakan dalam sistem usulan, meliputi nama basis data, nama file, akronim, fungsi, media penyimpanan, panjang record, kunci utama (primary key), kunci tamu (foreign key), dan elemen data masing-masing tabel.\n\n`;
    allText += `=========================================================================\n\n`;

    databaseSpecifications.forEach((t) => {
      allText += formatTableForSkripsi(t);
      allText += `\n-------------------------------------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(allText);
    setCopyAllStatus(true);
    setTimeout(() => setCopyAllStatus(false), 4000);
  };

  // Filtered tables
  const filteredTables = databaseSpecifications.filter((t) => {
    const matchesCategory =
      selectedTableCategory === 'all'
        ? true
        : t.category === selectedTableCategory;
    const query = tableSearchQuery.trim().toLowerCase();
    const matchesQuery =
      query === '' ||
      t.tableName.toLowerCase().includes(query) ||
      t.fileAcronym.toLowerCase().includes(query) ||
      t.functionDesc.toLowerCase().includes(query) ||
      t.fields.some((f) => f.fieldName.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  // Final Draft Elisitasi (Tabel 3.9 Halaman 83-86 Skripsi)
  const finalDraftElisitasi = [
    { no: 1, item: 'Menampilkan Halaman Login', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 2, item: 'Menampilkan Halaman Registrasi Pasien', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 3, item: 'Menampilkan Halaman Dashboard', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 4, item: 'Menampilkan Profil Puskesmas (Visi, Misi, Sejarah)', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 5, item: 'Menampilkan Struktur Organisasi Puskesmas', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 6, item: 'Menampilkan Jam Operasional Layanan', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 7, item: 'Menampilkan Menu Layanan Kesehatan', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 8, item: 'Menginput Data Layanan Kesehatan (Hak Super Admin)', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 9, item: 'Mengedit Data Layanan Kesehatan (Hak Super Admin)', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 10, item: 'Menghapus Data Layanan Kesehatan (Hak Super Admin)', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 11, item: 'Menampilkan Jadwal Dokter dan Poli', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 12, item: 'Menginput Jadwal Dokter (Super Admin & Admin)', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 13, item: 'Mengedit Jadwal Dokter (Super Admin & Admin)', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 14, item: 'Menampilkan Menu Pendaftaran Online', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 15, item: 'Menginput Data Pendaftaran Pasien', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 16, item: 'Menampilkan Nomor antrean Pendaftaran', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 17, item: 'Mengedit Status Pendaftaran Pasien', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 18, item: 'Menampilkan Data Pasien', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 19, item: 'Menyediakan Fitur Filter Data Pasien', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 20, item: 'Menyediakan Fitur Search Bar Data Pasien', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 21, item: 'Menyediakan Fitur Reset Untuk Kembali ke Data Awal', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 22, item: 'Menampilkan Menu Artikel dan Berita Kesehatan', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 23, item: 'Menginput Artikel Kesehatan', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 24, item: 'Mengedit Artikel Kesehatan', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 25, item: 'Menghapus Artikel Kesehatan (Hak Super Admin)', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 26, item: 'Menampilkan Menu Galeri Kegiatan', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 27, item: 'Menginput Foto Dokumentasi Kegiatan Puskesmas', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 28, item: 'Menampilkan Menu Kontak dan Lokasi (Peta)', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 29, item: 'Menampilkan Menu Kritik dan Saran', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 30, item: 'Menginput Kritik dan Saran', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 31, item: 'Menampilkan Balasan Kritik dan Saran', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 32, item: 'Menampilkan Menu Laporan Kunjungan Pasien', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 33, item: 'Mengexport Laporan Kunjungan Pasien Perbulan dan Pertahun (Excel)', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 34, item: 'Menampilkan Grafik Jumlah Kunjungan Pasien', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 35, item: 'Menampilkan Menu Hotline puskesmas', jenis: 'Fungsional', status: 'Sesuai 100%' },
    { no: 36, item: 'Menu Logout', jenis: 'Fungsional', status: 'Sesuai 100%' },
  ];

  const selectedClass = skripsiClasses.find((c) => c.id === selectedClassId) || skripsiClasses[2];

  // Render Table Component for Database Specification
  const renderTableSection = () => (
    <div className="space-y-6" id="spesifikasi-basis-data-section">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-0.5 rounded-full border border-emerald-300">
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>Subbab 4.3.5 Spesifikasi Basis Data (Naskah Skripsi)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kamus Data & Spesifikasi Basis Data Sistem Usulan
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Format baku naskah skripsi Universitas Raharja (Media: Harddisk, Nama Basis Data: <code className="text-emerald-700 font-bold font-mono">db_puskesmas_pondokbenda</code>). 
              Terdiri dari <strong>8 Tabel Utama</strong> implementasi fisik Gambar 4.7 Class Diagram dan <strong>4 Tabel Pendukung</strong> website sesuai Final Draft Elisitasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyAllTables}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition shadow-xs ${
                copyAllStatus
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              title="Salin seluruh tabel spesifikasi basis data untuk dipindahkan ke Word"
            >
              {copyAllStatus ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Seluruh Tabel Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Seluruh Tabel untuk Bab IV Skripsi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedTableCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTableCategory === 'all'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Tabel ({databaseSpecifications.length})
            </button>
            <button
              onClick={() => setSelectedTableCategory('utama')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTableCategory === 'utama'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              8 Tabel Utama Class Diagram
            </button>
            <button
              onClick={() => setSelectedTableCategory('pendukung')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTableCategory === 'pendukung'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4 Tabel Pendukung Website
            </button>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              placeholder="Cari nama tabel atau field..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
            />
          </div>
        </div>
      </div>

      {/* Render Table Cards */}
      <div className="space-y-6">
        {filteredTables.map((table) => {
          const isCopied = copiedTableId === table.id;
          return (
            <div
              key={table.id}
              className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-3xl p-6 sm:p-7 shadow-xs transition space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-700 text-white text-xs font-black rounded-lg font-mono">
                      {table.tableNumber}
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      Spesifikasi Basis Data {table.tableName}
                    </h4>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200">
                      {table.classDiagramEntity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-700">Fungsi:</strong> {table.functionDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopySingleTable(table)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                      isCopied
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-extrabold text-emerald-700">Tersalin ke Word!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin Tabel Ini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Akronim File:</span>
                  <span className="font-mono font-bold text-emerald-800">{table.fileAcronym}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Media / Basis Data:</span>
                  <span className="font-semibold text-slate-800">{table.media} (MySQL / MariaDB)</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Panjang Record:</span>
                  <span className="font-mono font-bold text-slate-800">{table.recordLength}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Primary / Foreign Key:</span>
                  <span className="font-mono text-slate-800">
                    <strong className="text-emerald-700">PK:</strong> {table.primaryKey} | <strong className="text-blue-700">FK:</strong> {table.foreignKey}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white font-bold">
                      <th className="p-3 text-center w-12 border-r border-slate-700">No</th>
                      <th className="p-3 border-r border-slate-700">Elemen Data (Nama Field)</th>
                      <th className="p-3 border-r border-slate-700">Tipe Data</th>
                      <th className="p-3 border-r border-slate-700 text-center">Panjang (Size)</th>
                      <th className="p-3 border-r border-slate-700 text-center">Null / Not Null</th>
                      <th className="p-3">Keterangan / Fungsi Atribut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {table.fields.map((f) => (
                      <tr key={f.no} className="hover:bg-slate-50/80 transition font-sans">
                        <td className="p-3 text-center font-bold text-slate-500 bg-slate-50/50 border-r border-slate-200">
                          {f.no}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900 border-r border-slate-200 flex items-center gap-1.5">
                          {f.keyType === 'PK' && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded border border-amber-300">
                              PK
                            </span>
                          )}
                          {f.keyType === 'FK' && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-black rounded border border-blue-300">
                              FK
                            </span>
                          )}
                          <span>{f.fieldName}</span>
                        </td>
                        <td className="p-3 font-mono text-emerald-800 font-semibold border-r border-slate-200">
                          {f.dataType}
                        </td>
                        <td className="p-3 font-mono text-center text-slate-700 border-r border-slate-200">
                          {f.size}
                        </td>
                        <td className="p-3 text-center font-mono text-[11px] border-r border-slate-200">
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              f.isNull === 'NOT NULL'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {f.isNull}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 leading-relaxed">
                          {f.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner - Sesuai Identitas Skripsi Raharja */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-black px-3.5 py-1 rounded-full border border-emerald-400/30">
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>Bab IV Rancangan Sistem Usulan • Universitas Raharja Tangerang</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Diagram Sistem Usulan: Pendaftaran Online & Prediksi Ketersediaan Dokter
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Rancang Bangun Sistem Pendaftaran Online Pasien Berdasarkan Jadwal Waktu Jaga Dokter Berbasis Algoritma Random Forest Pada Puskesmas Pondok Benda.
            <br />
            <span className="text-amber-300 font-bold">Peneliti: Adam Azmara Azra Putra (NIM: 2222476189)</span> • Pembimbing: Aris Martono, S.Kom, M.M.Si. & Fifit Alfiah, M.Kom.
          </p>
        </div>
      </div>

      {/* Tabs Navigation (Bab IV Rancangan Sistem Usulan) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('use-case')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'use-case'
              ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Workflow className="w-4 h-4 text-amber-300" />
          <span>4.3.1 Use Case Diagram Usulan</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'activity'
              ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <GitBranch className="w-4 h-4 text-cyan-300" />
          <span>4.3.2 Activity Diagram (Alur Pendaftaran & RF)</span>
        </button>

        <button
          onClick={() => setActiveTab('sequence')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'sequence'
              ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 text-teal-300" />
          <span>4.3.3 Sequence Diagram (Pendaftaran & Prediksi)</span>
        </button>

        <button
          onClick={() => setActiveTab('class-diagram')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'class-diagram'
              ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-200" />
          <span>4.3.4 Class Diagram (Gambar 4.7)</span>
        </button>

        <button
          onClick={() => setActiveTab('spek-basisdata')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'spek-basisdata'
              ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-amber-200" />
          <span>4.3.5 Spesifikasi Basis Data</span>
        </button>

        <button
          onClick={() => setActiveTab('elisitasi')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition ${
            activeTab === 'elisitasi'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Elisitasi (Tabel 3.9)</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition ${
            activeTab === 'roles'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Role RBAC</span>
        </button>

        <button
          onClick={() => setActiveTab('random-forest')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition ${
            activeTab === 'random-forest'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Random Forest (92.5%)</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: USE CASE DIAGRAM SISTEM USULAN
          ========================================================================= */}
      {activeTab === 'use-case' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Subbab 4.3.1 Rancangan Sistem yang Diusulkan
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Gambar 4.1 Use Case Diagram Sistem Usulan
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Menjelaskan interaksi aktor (Pasien, Petugas Loket/Admin, Super Admin, dan Dokter) dengan batas sistem pendaftaran online dan modul prediksi Random Forest.
                </p>
              </div>

              <button
                onClick={() => {
                  const useCaseNarrative = `4.3.1 USE CASE DIAGRAM SISTEM USULAN\n` +
                    `Sistem Pendaftaran Online Pasien Berdasarkan Jadwal Waktu Jaga Dokter Berbasis Algoritma Random Forest Pada Puskesmas Pondok Benda\n\n` +
                    `1. Aktor yang Terlibat:\n` +
                    `- Pasien: Mengakses informasi jadwal, mendaftar antrean online, melihat prediksi ketersediaan dokter, mengunduh nomor tiket/QR code, memantau antrean live, dan mengisi survei kepuasan masyarakat (IKM).\n` +
                    `- Petugas Loket / Admin: Melakukan login kedinasan, memanggil antrean pasien, memperbarui status antrean, menginput jadwal jaga harian, dan mengekspor rekapitulasi pasien ke Excel.\n` +
                    `- Super Admin (IT): Memiliki hak akses penuh, mengelola master data dokter (tambah/edit/hapus), mengelola poliklinik, mengelola parameter model Random Forest, dan memantau audit log.\n` +
                    `- Dokter Pemeriksa: Mengetahui jadwal waktu jaga praktik dan konfirmasi kehadiran.\n\n` +
                    `2. Skenario Use Case Pendaftaran Online & Prediksi Ketersediaan Dokter:\n` +
                    `- Use Case: Pendaftaran Online & Prediksi Ketersediaan Dokter\n` +
                    `- Primary Actor: Pasien\n` +
                    `- Deskripsi: Pasien melakukan registrasi berobat dengan memilih poli dan jadwal jaga dokter, kemudian sistem melakukan inferensi prediksi ketersediaan dokter berbasis Random Forest sebelum tiket resmi diterbitkan.\n` +
                    `- Pre-condition: Pasien mengakses website Puskesmas Pondok Benda pada menu Pendaftaran Online.\n` +
                    `- Alur Utama:\n` +
                    `  1. Pasien memasukkan NIK, Nama Lengkap, Nomor Kontak, dan Kategori Pasien (BPJS/Umum).\n` +
                    `  2. Pasien memilih Poliklinik, Tanggal Kunjungan, dan Sesi Waktu Jaga Dokter.\n` +
                    `  3. Sistem memicu modul Random Forest untuk menghitung probabilitas ketersediaan dokter berdasarkan 100 decision trees.\n` +
                    `  4. Sistem menampilkan hasil prediksi (contoh: Probabilitas 92.5%, Status: Sangat Tersedia) beserta estimasi kuota.\n` +
                    `  5. Pasien mengonfirmasi pendaftaran.\n` +
                    `  6. Sistem memverifikasi kuota, menyimpan transaksi ke tb_pendaftaran, dan menerbitkan nomor tiket antrean resmi.\n` +
                    `  7. Pasien mengunduh dan mencetak struk thermal tiket antrean.\n` +
                    `- Post-condition: Data tersimpan di basis data dan nomor tiket siap dipanggil pada hari kunjungan.`;
                  copyTextToClipboard(useCaseNarrative, 'use-case');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 shrink-0"
              >
                {copiedDiagramId === 'use-case' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Skenario Tersalin ke Word!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Salin Skenario Use Case (Word)</span>
                  </>
                )}
              </button>
            </div>

            {/* Visual UML Use Case Diagram Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                    UML Boundary: Sistem Pendaftaran Online & Prediksi Ketersediaan Dokter (Puskesmas Pondok Benda)
                  </span>
                </div>
                <span className="text-[11px] text-amber-300 font-mono bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800">
                  4 Aktor • 12 Use Case Terpadu
                </span>
              </div>

              {/* Grid 4 Actors & Associated Use Cases */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Aktor 1: Pasien */}
                <div className="bg-slate-800/80 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-300 uppercase">Aktor: Pasien</h4>
                      <span className="text-[10px] text-slate-400">Masyarakat Umum / BPJS</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Input Data Identitas Pasien (NIK)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Pilih Poli & Jadwal Waktu Jaga</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-950/70 border border-amber-500/60 text-amber-200 flex items-center gap-1.5 font-bold shadow-xs">
                      <BrainCircuit className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>Lihat Prediksi Ketersediaan Dokter (RF)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Cetak Struk Tiket Antrean (Thermal/QR)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Pantau Status Antrean Berjalan (Live)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                      <CircleDot className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>Isi Survei IKM Kepuasan Masyarakat</span>
                    </div>
                  </div>
                </div>

                {/* Aktor 2: Petugas Loket / Admin */}
                <div className="bg-slate-800/80 border-2 border-blue-500/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-blue-300 uppercase">Aktor: Admin / Loket</h4>
                      <span className="text-[10px] text-slate-400">admin@puskesmas.go.id</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-700/60 text-blue-200 flex items-center gap-1.5 font-medium">
                      <Lock className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>Login Sistem Kedinasan</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-700/60 text-blue-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>Panggil Antrean Pasien (Audio TTS)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-700/60 text-blue-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>Update Status: Dipanggil / Selesai</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-700/60 text-blue-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>Input Jadwal Jaga Harian Dokter</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-700/60 text-blue-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>Ekspor Rekapitulasi Pasien ke Excel</span>
                    </div>
                  </div>
                </div>

                {/* Aktor 3: Super Admin / IT */}
                <div className="bg-slate-800/80 border-2 border-purple-500/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white text-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-purple-300 uppercase">Aktor: Super Admin</h4>
                      <span className="text-[10px] text-slate-400">superadmin@puskesmas.go.id</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-700/60 text-purple-200 flex items-center gap-1.5 font-bold">
                      <Key className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>Akses Penuh CRUD Dokter & Poli</span>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-700/60 text-purple-200 flex items-center gap-1.5 font-medium">
                      <BrainCircuit className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>Evaluasi Model Random Forest (92.5%)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-700/60 text-purple-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>Kelola Confusion Matrix & Data Uji</span>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-700/60 text-purple-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>Akses Audit Log & Cadangan Sistem</span>
                    </div>
                  </div>
                </div>

                {/* Aktor 4: Dokter Pemeriksa */}
                <div className="bg-slate-800/80 border-2 border-teal-500/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-xs">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-teal-300 uppercase">Aktor: Dokter</h4>
                      <span className="text-[10px] text-slate-400">Tenaga Medis Puskesmas</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-teal-950/60 border border-teal-700/60 text-teal-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-teal-400 shrink-0" />
                      <span>Lihat Jadwal Praktik Sesuai Waktu Jaga</span>
                    </div>
                    <div className="p-2 rounded-lg bg-teal-950/60 border border-teal-700/60 text-teal-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-teal-400 shrink-0" />
                      <span>Konfirmasi Kehadiran Praktik</span>
                    </div>
                    <div className="p-2 rounded-lg bg-teal-950/60 border border-teal-700/60 text-teal-200 flex items-center gap-1.5 font-medium">
                      <CircleDot className="w-3 h-3 text-teal-400 shrink-0" />
                      <span>Menerima Pasien Sesuai Nomor Tiket</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* UML Relasi Include & Extend Banner */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2 font-mono">
                <span className="text-amber-400 font-bold block font-sans text-xs">
                  Relasi Stereotype UML & Dependency Use Case:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold">UC Pendaftaran Online</span> $\xrightarrow{`<<include>>`}$ <span className="text-amber-300 font-bold">UC Prediksi Ketersediaan Dokter (Random Forest)</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold">UC Pendaftaran Online</span> $\xrightarrow{`<<include>>`}$ <span className="text-blue-300 font-bold">UC Validasi NIK & Kuota Jadwal</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold">UC Pendaftaran Online</span> $\xrightarrow{`<<extend>>`}$ <span className="text-purple-300 font-bold">UC Cetak Struk Thermal Tiket</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-blue-400 font-bold">UC Panggil Antrean</span> $\xrightarrow{`<<include>>`}$ <span className="text-teal-300 font-bold">UC Text-to-Speech Suara Pemanggil</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Skenario Tabel Use Case */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Tabel 4.1 Skenario Use Case Pendaftaran Online & Prediksi Ketersediaan Dokter</span>
              </h4>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="p-3 font-bold bg-slate-50 w-44 text-slate-700">Nama Use Case</td>
                      <td className="p-3 font-bold text-emerald-900">Pendaftaran Online Pasien & Prediksi Ketersediaan Dokter</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold bg-slate-50 text-slate-700">Aktor Utama</td>
                      <td className="p-3 text-slate-800">Pasien (Masyarakat Pengguna Layanan)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold bg-slate-50 text-slate-700">Tujuan</td>
                      <td className="p-3 text-slate-800">Memperoleh nomor antrean berobat secara terjadwal dengan kepastian ketersediaan dokter pemeriksa berbasis algoritma machine learning Random Forest.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold bg-slate-50 text-slate-700">Kondisi Awal (Pre-Condition)</td>
                      <td className="p-3 text-slate-800">Pasien membuka antarmuka website pendaftaran Puskesmas Pondok Benda.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold bg-slate-50 text-slate-700">Alur Utama (Main Scenario)</td>
                      <td className="p-3 text-slate-800 space-y-1">
                        <p>1. Pasien menginput data identitas (NIK 16 digit, Nama lengkap, No HP, dan Jenis Pasien BPJS/Umum).</p>
                        <p>2. Pasien memilih Poliklinik tujuan, Tanggal kunjungan, dan Sesi waktu jaga dokter.</p>
                        <p>3. Sistem mengeksekusi modul model Random Forest (100 Decision Trees) untuk memprediksi peluang ketersediaan dokter dan beban kuota.</p>
                        <p>4. Sistem menampilkan probabilitas hasil prediksi (Akurasi 92.5%, Status: Sangat Tersedia) beserta status sisa kuota.</p>
                        <p>5. Pasien meninjau data ringkasan dan menekan tombol Konfirmasi Pendaftaran.</p>
                        <p>6. Sistem memvalidasi, menyimpan pendaftaran ke tabel <code>tb_pendaftaran</code>, dan menerbitkan Nomor Tiket Antrean resmi.</p>
                        <p>7. Pasien mengunduh atau mencetak struk thermal tiket antrean.</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold bg-slate-50 text-slate-700">Alur Alternatif</td>
                      <td className="p-3 text-slate-800">Jika kuota jadwal dokter telah penuh atau probabilitas kehadiran rendah (kategori Tidak Tersedia), sistem menampilkan rekomendasi tanggal alternatif lain.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold bg-slate-50 text-slate-700">Kondisi Akhir (Post-Condition)</td>
                      <td className="p-3 text-slate-800">Nomor tiket antrean berhasil diterbitkan dan status antrean dapat dipantau langsung di layar antrean.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ACTIVITY DIAGRAM SISTEM USULAN
          ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Subbab 4.3.2 Rancangan Sistem yang Diusulkan
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Gambar 4.2 Activity Diagram Alur Pendaftaran & Prediksi Random Forest
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Menyajikan alur kerja aktivitas sistem dalam 4 Swimlanes terintegrasi: Pasien, Web Pendaftaran, Engine Random Forest, dan Database Puskesmas.
                </p>
              </div>

              <button
                onClick={() => {
                  const activityNarrative = `4.3.2 ACTIVITY DIAGRAM SISTEM USULAN\n` +
                    `Alur Pendaftaran Online Pasien dan Prediksi Ketersediaan Dokter Berbasis Random Forest Puskesmas Pondok Benda\n\n` +
                    `Activity Diagram menggambarkan aliran kerja sistem yang dibagi menjadi 4 swimlane:\n` +
                    `1. Swimlane Pasien:\n` +
                    `   - Mulai (Start Node).\n` +
                    `   - Membuka menu Pendaftaran Online.\n` +
                    `   - Menginput data identitas (NIK, Nama, No. HP, Jenis Pasien BPJS/Umum).\n` +
                    `   - Memilih Poliklinik, Tanggal Kunjungan, dan Sesi Waktu Jaga Dokter.\n` +
                    `   - Melihat hasil inferensi probabilitas ketersediaan dokter.\n` +
                    `   - Mengonfirmasi pendaftaran.\n` +
                    `   - Menerima dan mencetak struk tiket antrean.\n` +
                    `   - Selesai (End Node).\n\n` +
                    `2. Swimlane Sistem Web Pendaftaran (Frontend):\n` +
                    `   - Menampilkan form pendaftaran pasien.\n` +
                    `   - Mengambil master data jadwal jaga dokter yang aktif.\n` +
                    `   - Mengirim parameter jadwal (hari, poli, jam) ke Engine Random Forest.\n` +
                    `   - Menampilkan skor probabilitas dan rekomendasi ketersediaan dokter kepada pasien.\n` +
                    `   - Menerbitkan struk tiket antrean resmi dengan kode QR.\n\n` +
                    `3. Swimlane Engine Random Forest (Machine Learning):\n` +
                    `   - Menerima input fitur waktu jaga dokter dan beban poliklinik.\n` +
                    `   - Menjalankan inferensi pada 100 ensemble decision trees (Akurasi 92.5%).\n` +
                    `   - Mengembalikan nilai probabilitas ketersediaan dokter (contoh: 0.925 / Sangat Tersedia).\n\n` +
                    `4. Swimlane Database & Server (Backend):\n` +
                    `   - Melakukan validasi nomor kuota antrean.\n` +
                    `   - Menyimpan transaksi ke tabel tb_pendaftaran dan mengupdate tb_pasien.\n` +
                    `   - Menghasilkan nomor urut antrean unik (contoh: A-001, B-005).`;
                  copyTextToClipboard(activityNarrative, 'activity');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 shrink-0"
              >
                {copiedDiagramId === 'activity' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Narasi Tersalin ke Word!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Salin Narasi Activity Diagram (Word)</span>
                  </>
                )}
              </button>
            </div>

            {/* Visual 4 Swimlanes Diagram */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6">
              
              <div className="text-center font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-3">
                Swimlanes Alur Kerja Pendaftaran Online & Prediksi Ketersediaan Dokter
              </div>

              {/* 4 Swimlane Columns */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                
                {/* Lane 1: Pasien */}
                <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 space-y-3 flex flex-col justify-between">
                  <div className="text-center p-2 rounded-xl bg-slate-700 font-black text-emerald-300 uppercase tracking-wide">
                    1. Pasien (User)
                  </div>

                  <div className="space-y-3 py-2">
                    {/* Start Node */}
                    <div className="flex justify-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50 flex items-center justify-center" title="Start Node">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Buka Menu Pendaftaran Online
                    </div>
                    
                    <div className="flex justify-center text-slate-400">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Input NIK, Nama, No. HP, BPJS/Umum
                    </div>

                    <div className="flex justify-center text-slate-400">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Pilih Poli, Tanggal, & Sesi Waktu Jaga
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-600 text-center font-bold text-emerald-300">
                      Tinjau Prediksi Ketersediaan & Tekan "Konfirmasi"
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Ambil / Cetak Struk Tiket Antrean
                    </div>

                    {/* End Node */}
                    <div className="flex justify-center pt-2">
                      <div className="w-7 h-7 rounded-full border-2 border-emerald-400 flex items-center justify-center" title="End Node">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-center text-slate-400 font-mono">
                    Peran: Aktor Pemohon
                  </div>
                </div>

                {/* Lane 2: Web Frontend */}
                <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 space-y-3 flex flex-col justify-between">
                  <div className="text-center p-2 rounded-xl bg-slate-700 font-black text-cyan-300 uppercase tracking-wide">
                    2. Web Pendaftaran (UI)
                  </div>

                  <div className="space-y-3 py-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Tampilkan Form Pendaftaran Multi-Step
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Validasi Kelengkapan NIK (16 Digit)
                    </div>

                    <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-600 text-center font-semibold text-cyan-200">
                      Kirim Parameter Jadwal ke Engine Random Forest
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Tampilkan Badge Probabilitas Ketersediaan Dokter
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Terbitkan Nomor Tiket Resmi & Kode QR
                    </div>
                  </div>

                  <div className="text-[10px] text-center text-slate-400 font-mono">
                    Peran: Boundary Controller
                  </div>
                </div>

                {/* Lane 3: Machine Learning Engine */}
                <div className="bg-slate-800/60 rounded-2xl p-4 border border-amber-600/50 space-y-3 flex flex-col justify-between">
                  <div className="text-center p-2 rounded-xl bg-amber-950/80 border border-amber-500 font-black text-amber-300 uppercase tracking-wide">
                    3. Random Forest (AI)
                  </div>

                  <div className="space-y-3 py-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center text-[11px] text-slate-400">
                      Menunggu Parameter Jadwal Dokter
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950 border-2 border-amber-500 text-center font-bold text-amber-200 space-y-1">
                      <BrainCircuit className="w-4 h-4 mx-auto text-amber-300" />
                      <span>Eksekusi 100 Decision Trees</span>
                      <span className="block text-[10px] text-amber-400 font-mono">Fitur: Hari, Jam, Poli, Tren</span>
                    </div>

                    {/* Decision Node */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-600 text-center font-mono text-[11px] text-amber-300">
                      Decision: Hitung Voting Mayoritas (Akurasi 92.5%)
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500 text-center font-bold text-emerald-300 text-[11px]">
                      Kategori: "Sangat Tersedia" (Prob &gt; 80%)
                    </div>
                  </div>

                  <div className="text-[10px] text-center text-amber-400 font-mono">
                    Peran: Predictive Engine
                  </div>
                </div>

                {/* Lane 4: Database & Server */}
                <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 space-y-3 flex flex-col justify-between">
                  <div className="text-center p-2 rounded-xl bg-slate-700 font-black text-teal-300 uppercase tracking-wide">
                    4. Database & Loket
                  </div>

                  <div className="space-y-3 py-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Query Master Jadwal & Kuota Maksimal
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Verifikasi Sisa Slot Kuota Terisi
                    </div>

                    <div className="p-2.5 rounded-xl bg-teal-950 border border-teal-500 text-center font-bold text-teal-200">
                      Simpan Transaksi ke tabel tb_pendaftaran
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-medium">
                      Update Kuota & Integrasi ke Monitor Antrean
                    </div>
                  </div>

                  <div className="text-[10px] text-center text-slate-400 font-mono">
                    Peran: Entity Repository
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SEQUENCE DIAGRAM SISTEM USULAN
          ========================================================================= */}
      {activeTab === 'sequence' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Subbab 4.3.3 Rancangan Sistem yang Diusulkan
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Gambar 4.3 Sequence Diagram Pendaftaran Online & Prediksi Ketersediaan
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Menggambarkan urutan pengiriman pesan (messages) antar objek / lifeline secara kronologis waktu.
                </p>
              </div>

              <button
                onClick={() => {
                  const sequenceNarrative = `4.3.3 SEQUENCE DIAGRAM SISTEM USULAN\n` +
                    `Urutan Pesan Interaksi Objek Pendaftaran Online dan Prediksi Ketersediaan Dokter Berbasis Random Forest Puskesmas Pondok Benda\n\n` +
                    `Lifeline Objek yang Terlibat:\n` +
                    `1. :Pasien (Aktor Pemohon)\n` +
                    `2. :FormPendaftaranView (Boundary UI)\n` +
                    `3. :PendaftaranController (Control Logic)\n` +
                    `4. :RandomForestService (Machine Learning Predictor)\n` +
                    `5. :JadwalDokterService (Service Jadwal & Kuota)\n` +
                    `6. :DatabaseRepository (Entity Database MySQL)\n\n` +
                    `Urutan Pesan (Sequence of Messages):\n` +
                    `1: bukaMenuPendaftaran() -> Pasien membuka halaman pendaftaran web.\n` +
                    `2: getPoliDanJadwal() -> Form meminta daftar poliklinik dan jadwal aktif.\n` +
                    `3: returnJadwal() -> JadwalDokterService mengembalikan daftar jadwal aktif.\n` +
                    `4: pilihJadwal(poliId, tglKunjungan, sesiJam) -> Pasien memilih waktu praktik dokter.\n` +
                    `5: requestPrediksiKetersediaan(jadwalId, fitur) -> Form meminta prediksi ketersediaan dokter.\n` +
                    `6: inferensi100Trees(fitur) -> RandomForestService mengeksekusi 100 decision trees.\n` +
                    `7: returnProbabilitas(prob=0.925, status="Sangat Tersedia") -> Mengembalikan hasil estimasi ke Form.\n` +
                    `8: displayHasilPrediksi(probabilitas, kuota) -> Form menampilkan estimasi kepada pasien.\n` +
                    `9: submitPendaftaran(dataPasien, jadwalId) -> Pasien menekan konfirmasi pendaftaran.\n` +
                    `10: validasiKuota(jadwalId) -> Controller memeriksa sisa slot antrean.\n` +
                    `11: kuotaTersedia() -> Service mengonfirmasi ketersediaan kuota.\n` +
                    `12: simpanPendaftaran(tb_pendaftaran) -> Controller menyimpan transaksi pendaftaran.\n` +
                    `13: generateNomorAntrean() -> Database menerbitkan nomor antrean unik.\n` +
                    `14: returnNomorTiket(nomorAntrean, idDaftar) -> Database mengembalikan data tiket resmi.\n` +
                    `15: showTiketModal(strukThermal, qrCode) -> Form menampilkan struk tiket antrean.\n` +
                    `16: cetakStrukTiket() -> Pasien mencetak atau mengunduh tiket antrean.`;
                  copyTextToClipboard(sequenceNarrative, 'sequence');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 shrink-0"
              >
                {copiedDiagramId === 'sequence' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Sequence Tersalin ke Word!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Salin Narasi Sequence Diagram (Word)</span>
                  </>
                )}
              </button>
            </div>

            {/* Sequence Diagram Visual Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md space-y-6">
              
              <div className="text-center font-mono text-xs text-teal-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-3">
                Lifelines Objek & Urutan Pengiriman Pesan Sinkron
              </div>

              {/* Lifeline Headers */}
              <div className="grid grid-cols-6 gap-2 text-center text-[11px] font-mono font-bold">
                <div className="p-2 bg-emerald-950 border border-emerald-600 rounded-xl text-emerald-300">
                  :Pasien (Aktor)
                </div>
                <div className="p-2 bg-cyan-950 border border-cyan-600 rounded-xl text-cyan-300">
                  :FormView (UI)
                </div>
                <div className="p-2 bg-blue-950 border border-blue-600 rounded-xl text-blue-300">
                  :Controller
                </div>
                <div className="p-2 bg-amber-950 border border-amber-500 rounded-xl text-amber-300">
                  :ModelRF (AI)
                </div>
                <div className="p-2 bg-purple-950 border border-purple-600 rounded-xl text-purple-300">
                  :JadwalService
                </div>
                <div className="p-2 bg-teal-950 border border-teal-600 rounded-xl text-teal-300">
                  :Database
                </div>
              </div>

              {/* Step-by-Step Sequence Messages List */}
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <span><strong>1.</strong> Pasien $\rightarrow$ FormView: <code className="text-emerald-300">bukaMenuPendaftaran()</code></span>
                  <span className="text-[10px] text-slate-400">Panggilan Awal</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <span><strong>2.</strong> FormView $\rightarrow$ JadwalService: <code className="text-cyan-300">getPoliDanJadwal()</code></span>
                  <span className="text-[10px] text-slate-400">Query Jadwal Praktik</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <span><strong>3.</strong> Pasien $\rightarrow$ FormView: <code className="text-emerald-300">pilihJadwal(poliId, tgl, sesiJam)</code></span>
                  <span className="text-[10px] text-slate-400">Seleksi Pilihan</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-600/80 flex items-center justify-between text-amber-200">
                  <span><strong>4.</strong> FormView $\rightarrow$ ModelRF: <code className="text-amber-300">requestPrediksiKetersediaan(jadwalId, fitur)</code></span>
                  <span className="text-[10px] text-amber-400 font-bold">Pemicu Machine Learning</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-600/80 flex items-center justify-between text-amber-200">
                  <span><strong>5.</strong> ModelRF $\rightarrow$ ModelRF: <code className="text-amber-300">inferensi100Trees(hari, sesi, kuota)</code></span>
                  <span className="text-[10px] text-amber-400 font-bold">Self-Call Random Forest</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-600/80 flex items-center justify-between text-amber-200">
                  <span><strong>6.</strong> ModelRF $\dashrightarrow$ FormView: <code className="text-amber-300">returnProbabilitas(prob=0.925, status="Tersedia")</code></span>
                  <span className="text-[10px] text-amber-400 font-bold">Return Akurasi 92.5%</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <span><strong>7.</strong> FormView $\dashrightarrow$ Pasien: <code className="text-cyan-300">displayHasilPrediksiDanSlot()</code></span>
                  <span className="text-[10px] text-slate-400">Tampil di Layar</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-600 flex items-center justify-between text-emerald-200 font-bold">
                  <span><strong>8.</strong> Pasien $\rightarrow$ Controller: <code className="text-emerald-300">submitPendaftaran(dataPasien, jadwalId)</code></span>
                  <span className="text-[10px] text-emerald-400">Konfirmasi Transaksi</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <span><strong>9.</strong> Controller $\rightarrow$ JadwalService: <code className="text-blue-300">cekSisaKuota(jadwalId)</code></span>
                  <span className="text-[10px] text-slate-400">Validasi Kuota</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <span><strong>10.</strong> Controller $\rightarrow$ Database: <code className="text-teal-300">simpanPendaftaran(tb_pendaftaran)</code></span>
                  <span className="text-[10px] text-slate-400">Insert Database</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <span><strong>11.</strong> Database $\dashrightarrow$ FormView: <code className="text-teal-300">returnNomorTiket(nomorAntrean, qrCode)</code></span>
                  <span className="text-[10px] text-slate-400">Tiket Diterbitkan</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <span><strong>12.</strong> Pasien $\rightarrow$ FormView: <code className="text-emerald-300">cetakStrukThermalTiket()</code></span>
                  <span className="text-[10px] text-slate-400">Pencetakan Selesai</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CLASS DIAGRAM SISTEM USULAN & SEGERA DILANJUTKAN SPESIFIKASI BASIS DATA
          ========================================================================= */}
      {activeTab === 'class-diagram' && (
        <div className="space-y-10">
          
          {/* Bagian 1: Class Diagram Gambar 4.7 */}
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start justify-between gap-3 text-xs text-emerald-950">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Kesesuaian 100% dengan Halaman 94 (Gambar 4.7 Class Diagram Sistem Usulan):</strong> Terdiri dari 8 kelas utama yaitu <strong>User</strong>, <strong>Pasien</strong>, <strong>Pendaftaran</strong>, <strong>JadwalDokter</strong>, <strong>Dokter</strong>, <strong>Poli</strong>, <strong>ModelRF</strong>, dan <strong>Prediksi</strong> dengan tipe data dan operasi method persis sesuai buku skripsi Anda.
                </div>
              </div>

              <a
                href="#spesifikasi-basis-data-section"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-xl font-bold text-xs shrink-0 hover:bg-emerald-800 transition"
              >
                <span>Lihat Spek Basis Data ↓</span>
              </a>
            </div>

            {/* Interactive Visual Grid of 8 Classes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {skripsiClasses.map((cls) => {
                const isSelected = selectedClassId === cls.id;
                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`border-2 rounded-2xl bg-white shadow-xs hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col justify-between ${
                      isSelected ? 'ring-2 ring-emerald-500 border-emerald-600 shadow-md scale-[1.01]' : 'border-slate-300'
                    }`}
                  >
                    {/* UML Class Header */}
                    <div className={`p-3 text-center border-b font-mono ${cls.color}`}>
                      <span className="text-[9px] uppercase tracking-wider block opacity-70 font-sans font-extrabold">{cls.stereotype}</span>
                      <h3 className="text-base font-black tracking-tight font-sans">{cls.name}</h3>
                      <span className="text-[9px] font-bold text-slate-500 block font-sans">{cls.badge}</span>
                    </div>

                    {/* Attributes Section */}
                    <div className="p-3 bg-white border-b border-slate-100 font-mono text-[11px] space-y-1 text-slate-800">
                      <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1 font-sans">
                        Atribut (- Private)
                      </div>
                      {cls.attributes.map((attr, idx) => (
                        <div key={idx} className="truncate" title={attr}>
                          {attr}
                        </div>
                      ))}
                    </div>

                    {/* Operations Section */}
                    <div className="p-3 bg-slate-50 font-mono text-[11px] space-y-1 text-emerald-900 flex-1">
                      <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1 font-sans">
                        Operasi (+ Public)
                      </div>
                      {cls.operations.map((op, idx) => (
                        <div key={idx} className="truncate font-semibold" title={op}>
                          {op}
                        </div>
                      ))}
                    </div>

                    {/* Relationships Section */}
                    <div className="p-2.5 bg-slate-100 text-[10px] text-slate-600 border-t border-slate-200 font-sans">
                      <div className="font-bold text-slate-700 mb-0.5">Relasi Kardinalitas:</div>
                      {cls.relations.map((rel, idx) => (
                        <div key={idx} className="truncate text-slate-500 font-mono text-[9px]" title={rel}>
                          • {rel}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Deep Dive on Selected Class */}
            <div className="bg-white border-2 border-emerald-600 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-lg">
                      Detail Kelas Gambar 4.7
                    </span>
                    <h3 className="text-xl font-black text-slate-900 font-mono">
                      Class {selectedClass.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedClass.description}
                  </p>
                </div>

                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
                  Kategori: {selectedClass.category}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Struktur Atribut & Tipe Data
                  </h4>
                  <div className="space-y-1 font-mono text-xs">
                    {selectedClass.attributes.map((a, i) => (
                      <div key={i} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-800">
                        {a}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Operasi / Method & Relasi Terhubung
                  </h4>
                  <div className="space-y-1 font-mono text-xs mb-3">
                    {selectedClass.operations.map((op, i) => (
                      <div key={i} className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-900 font-semibold">
                        {op}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs space-y-1 pt-1 border-t border-emerald-200 font-sans">
                    <span className="font-bold text-slate-700 block">Keterhubungan Antar Kelas (Gambar 4.7):</span>
                    {selectedClass.relations.map((r, i) => (
                      <div key={i} className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Divider Prominen */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-dashed border-emerald-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-emerald-800 text-white px-5 py-2 rounded-full text-xs font-black shadow-md flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-300" />
                <span>LANJUTAN BAB IV NASKAH SKRIPSI: 4.3.5 SPESIFIKASI BASIS DATA</span>
              </span>
            </div>
          </div>

          {/* Bagian 2: Spesifikasi Basis Data */}
          {renderTableSection()}

        </div>
      )}

      {/* =========================================================================
          TAB 5: SPESIFIKASI BASIS DATA DEDICATED TAB
          ========================================================================= */}
      {activeTab === 'spek-basisdata' && renderTableSection()}

      {/* =========================================================================
          TAB 6: ELISITASI TAHAP I, II, III DAN FINAL DRAFT ELISITASI
          ========================================================================= */}
      {activeTab === 'elisitasi' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Subbab 3.6 User Requirement (Halaman 70-86 Skripsi)
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Matriks Elisitasi Kebutuhan Sistem Pendaftaran Online
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-xl border border-emerald-300">
                  Total Final Draft: 36 Fungsional + 6 Non-Fungsional
                </span>
              </div>
            </div>

            {/* Explanation of Elimination in Tahap II (MDI) */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 space-y-1">
              <strong className="block text-amber-900 font-extrabold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Penjelasan Eliminasi Kebutuhan pada Elisitasi Tahap II (Metode MDI):</span>
              </strong>
              <p className="leading-relaxed text-amber-900/90">
                Pada Elisitasi Tahap II (Tabel 3.7 Halaman 75), kebutuhan <strong>No. 38 (Fitur Chat/Konsultasi Online)</strong> dan <strong>No. 39 (Rekam Medis Elektronik Pasien)</strong> diklasifikasikan sebagai <strong>Inessential (I)</strong> dan dieliminasi agar sistem fokus penuh pada <strong>Pendaftaran Online Pasien berdasarkan Jadwal Jaga Dokter Berbasis Random Forest</strong>.
              </p>
              <p className="leading-relaxed text-amber-900/90">
                Oleh karena itu, Final Draft Elisitasi (Tabel 3.9) memuat <strong>36 Kebutuhan Fungsional</strong> dan <strong>6 Kebutuhan Non-Fungsional</strong> yang seluruhnya telah <strong>TERPENUHI 100%</strong> di dalam aplikasi ini.
              </p>
            </div>

            {/* Final Draft Functional List */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tabel 3.9 Final Draft Elisitasi Kebutuhan Fungsional (1 s/d 36)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {finalDraftElisitasi.map((item) => (
                  <div
                    key={item.no}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5 hover:bg-white transition"
                  >
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                      {item.no}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-800 font-medium">{item.item}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 font-semibold">{item.jenis}</span>
                        <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{item.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: HAK AKSES ROLE: SUPER ADMIN VS ADMIN OPERASIONAL
          ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Hak Akses & Role Based Access Control (RBAC)
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Perbedaan Hak Akses: Super Admin vs Admin Operasional
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Sesuai permintaan peneliti, sistem membedakan secara tegas otentikasi login kedinasan dengan pemisahan wewenang mutlak.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Super Admin Card */}
              <div className="p-6 rounded-3xl bg-purple-50/60 border-2 border-purple-300 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-purple-950 font-mono">
                      superadmin@puskesmas.go.id
                    </h4>
                    <span className="text-xs font-bold text-purple-700">
                      Role: Super Admin / IT Administrator (Akses Penuh)
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-purple-900">Kewenangan Istimewa Super Admin:</div>
                  <ul className="space-y-1.5 text-purple-950">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Tambah, Edit, dan Hapus Dokter</strong> secara menyeluruh.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Tambah, Edit, dan Hapus Poliklinik Layanan</strong> Puskesmas.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Hapus Semua Data</strong> pendaftaran, artikel, galeri, dan pesan saran.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Akses menu Audit Log sistem dan parameter Model Random Forest.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Admin Operasional Card */}
              <div className="p-6 rounded-3xl bg-blue-50/60 border-2 border-blue-300 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-blue-950 font-mono">
                      admin@puskesmas.go.id
                    </h4>
                    <span className="text-xs font-bold text-blue-700">
                      Role: Admin Operasional / Petugas Loket (Terbatas)
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-blue-900">Batasan Akses Admin Operasional:</div>
                  <ul className="space-y-1.5 text-blue-950">
                    <li className="flex items-center gap-2 text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span><strong>DILARANG menghapus data Dokter</strong> (tombol hapus terkunci).</span>
                    </li>
                    <li className="flex items-center gap-2 text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span><strong>DILARANG mengedit atau menghapus Layanan Poliklinik</strong>.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Dapat memanggil antrean dan mengupdate status antrean pasien.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Dapat menginput jadwal harian dan mengekspor rekap pasien ke Excel.</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: MODEL RANDOM FOREST (AKURASI 92.5%)
          ========================================================================= */}
      {activeTab === 'random-forest' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Subbab 4.7 Proses Rumus dan Perhitungan Hasil Akurasi (Halaman 111-113 Skripsi)
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Hasil Evaluasi Model Random Forest (200 Data Uji)
              </h3>
            </div>

            {/* 4 Cards: Accuracy, Precision, Recall, F1 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Accuracy</span>
                <div className="text-3xl font-black text-emerald-950 font-mono">92,5%</div>
                <span className="text-[10px] text-emerald-700">Target Minimal: 85% (Tercapai)</span>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Precision</span>
                <div className="text-3xl font-black text-blue-950 font-mono">93,1%</div>
                <span className="text-[10px] text-blue-700">TP / (TP + FP)</span>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-1">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">Recall</span>
                <div className="text-3xl font-black text-teal-950 font-mono">96,4%</div>
                <span className="text-[10px] text-teal-700">TP / (TP + FN)</span>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">F1-Score</span>
                <div className="text-3xl font-black text-purple-950 font-mono">94,72%</div>
                <span className="text-[10px] text-purple-700">Harmonic Mean</span>
              </div>
            </div>

            {/* Confusion Matrix Table */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tabel 4.6 Matriks Konfusi (Confusion Matrix Data Uji)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs border border-slate-300 bg-white">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th className="p-2.5 border border-slate-300">Status Aktual \ Prediksi</th>
                      <th className="p-2.5 border border-slate-300 text-emerald-700">Prediksi: Tersedia (Ya)</th>
                      <th className="p-2.5 border border-slate-300 text-rose-700">Prediksi: Tidak Tersedia</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 font-bold border border-slate-300 bg-slate-50">Aktual: Tersedia (Ya)</td>
                      <td className="p-2.5 font-mono font-bold bg-emerald-50 text-emerald-900 border border-slate-300">
                        TP = 135
                      </td>
                      <td className="p-2.5 font-mono font-bold bg-rose-50 text-rose-900 border border-slate-300">
                        FN = 5
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold border border-slate-300 bg-slate-50">Aktual: Tidak Tersedia</td>
                      <td className="p-2.5 font-mono font-bold bg-amber-50 text-amber-900 border border-slate-300">
                        FP = 10
                      </td>
                      <td className="p-2.5 font-mono font-bold bg-blue-50 text-blue-900 border border-slate-300">
                        TN = 50
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500">
                Total Data Uji = 135 + 5 + 10 + 50 = <strong>200 Data Uji</strong> (dari total 350 dataset historis Puskesmas Pondok Benda).
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
