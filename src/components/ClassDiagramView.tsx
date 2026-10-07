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
  AlertCircle
} from 'lucide-react';

export const ClassDiagramView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'class-diagram' | 'elisitasi' | 'roles' | 'random-forest'>('class-diagram');
  const [selectedClassId, setSelectedClassId] = useState<string>('Pendaftaran');
  const [elisitasiFilter, setElisitasiFilter] = useState<'all' | 'final' | 'tahap1' | 'tahap2' | 'tahap3'>('final');

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

  const nonFungsionalElisitasi = [
    { no: 1, item: 'Tampilan Sistem Mudah Dipahami Pengguna', status: 'Sesuai 100%' },
    { no: 2, item: 'Menampilkan Role User Yang Sedang Login', status: 'Sesuai 100%' },
    { no: 3, item: 'Memiliki Waktu Respon yang Cepat Saat Berpindah Halaman', status: 'Sesuai 100%' },
    { no: 4, item: 'Menampilkan Desain Antarmuka yang Konsisten dan Responsive di Setiap Halaman', status: 'Sesuai 100%' },
    { no: 5, item: 'Sistem Dapat Diakses Selama 24 Jam', status: 'Sesuai 100%' },
    { no: 6, item: 'Menjamin Keamanan Data Pasien (Enkripsi Data)', status: 'Sesuai 100%' },
  ];

  const selectedClass = skripsiClasses.find(c => c.id === selectedClassId) || skripsiClasses[2];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner - Sesuai Identitas Skripsi Raharja */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-black px-3.5 py-1 rounded-full border border-emerald-400/30">
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>Skripsi Teknik Informatika • Universitas Raharja Tangerang</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Class Diagram & Elisitasi Sistem Usulan
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            Rancang Bangun Sistem Pendaftaran Online Pasien Berdasarkan Jadwal Waktu Jaga Dokter Berbasis Algoritma Random Forest Pada Puskesmas Pondok Benda.
            <br />
            <span className="text-amber-300 font-bold">Peneliti: Adam Azmara Azra Putra (NIM: 2222476189)</span> • Pembimbing: Aris Martono, S.Kom, M.M.Si. & Fifit Alfiah, M.Kom.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('class-diagram')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'class-diagram'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Gambar 4.7 Class Diagram Skripsi</span>
        </button>

        <button
          onClick={() => setActiveTab('elisitasi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'elisitasi'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Elisitasi Kebutuhan (Tahap I s/d Final Draft)</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'roles'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Hak Akses Role: Super Admin vs Admin</span>
        </button>

        <button
          onClick={() => setActiveTab('random-forest')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'random-forest'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Model Random Forest (Akurasi 92.5%)</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: GAMBAR 4.7 CLASS DIAGRAM SISTEM USULAN DARI SKRIPSI
          ========================================================================= */}
      {activeTab === 'class-diagram' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>Kesesuaian 100% dengan Halaman 94 (Gambar 4.7 Class Diagram Sistem Usulan):</strong> Terdiri dari 8 kelas utama yaitu <strong>User</strong>, <strong>Pasien</strong>, <strong>Pendaftaran</strong>, <strong>JadwalDokter</strong>, <strong>Dokter</strong>, <strong>Poli</strong>, <strong>ModelRF</strong>, dan <strong>Prediksi</strong> dengan tipe data dan operasi method persis sesuai buku skripsi Anda.
            </div>
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
      )}

      {/* =========================================================================
          TAB 2: ELISITASI TAHAP I, II, III DAN FINAL DRAFT ELISITASI
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
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 hover:bg-emerald-50/40 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                        {item.no}
                      </span>
                      <span className="font-semibold text-slate-800">{item.item}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md shrink-0 border border-emerald-300">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Functional List */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Kebutuhan Non-Fungsional (1 s/d 6)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {nonFungsionalElisitasi.map((item) => (
                  <div
                    key={item.no}
                    className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                        {item.no}
                      </span>
                      <span className="font-semibold text-blue-950">{item.item}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded-md shrink-0 border border-blue-300">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PEMBAGIAN ROLE: SUPER ADMIN VS ADMIN
          ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Subbab 4.4.3 Spesifikasi Hak Akses (Brainware) & Permintaan User
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Pemisahan Hak Akses: Super Admin vs Admin
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Sistem menerapkan kontrol akses berbasis peran (Role-Based Access Control) yang ketat untuk menjamin integritas data operasional Puskesmas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: SUPER ADMIN */}
              <div className="p-6 rounded-3xl border-2 border-emerald-600 bg-emerald-50/30 space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                      <Unlock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">Super Admin (Akses Penuh)</h4>
                      <span className="text-xs font-mono font-bold text-emerald-700">superadmin@puskesmas.go.id</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg">
                    Full Control
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="font-extrabold text-slate-900">Hak Akses Super Admin:</div>
                  <ul className="space-y-1.5">
                    <li className="flex items-center gap-2 text-emerald-950 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bisa Tambah Dokter & Edit Dokter</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-950 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bisa MENGHAPUS DOKTER (Hak Eksklusif)</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-950 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bisa Mengedit & MENGHAPUS LAYANAN POLIKLINIK</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-950 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bisa Menghapus Seluruh Data / Factory Reset & Restore</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-950 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Akses penuh ke Pelatihan Model Random Forest & Evaluasi</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-[11px] text-slate-600 font-mono">
                  Password Login: <strong className="text-slate-900">admin123</strong> / <strong className="text-slate-900">password</strong>
                </div>
              </div>

              {/* Card 2: ADMIN / PETUGAS LOKET */}
              <div className="p-6 rounded-3xl border-2 border-slate-300 bg-slate-50/60 space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-slate-800 text-white rounded-xl">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">Admin (Akses Terbatas)</h4>
                      <span className="text-xs font-mono font-bold text-slate-700">admin@puskesmas.go.id</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-200 text-slate-800 text-[10px] font-black uppercase rounded-lg border border-slate-300">
                    Restricted
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="font-extrabold text-slate-900">Batasan Hak Akses Admin:</div>
                  <ul className="space-y-1.5">
                    <li className="flex items-center gap-2 text-rose-700 font-bold">
                      <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] shrink-0">✕</span>
                      <span>TIDAK BISA menghapus data dokter (Tombol Terkunci)</span>
                    </li>
                    <li className="flex items-center gap-2 text-rose-700 font-bold">
                      <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] shrink-0">✕</span>
                      <span>TIDAK BISA mengedit / menghapus layanan poliklinik</span>
                    </li>
                    <li className="flex items-center gap-2 text-rose-700 font-bold">
                      <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] shrink-0">✕</span>
                      <span>TIDAK BISA melakukan reset database / hapus permanen master</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bisa verifikasi pendaftaran & antrean pasien harian</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bisa panggil antrean suara & ekspor rekap Excel</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 font-mono">
                  Password Login: <strong className="text-slate-900">admin123</strong> / <strong className="text-slate-900">password</strong>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: METRIK RANDOM FOREST (SESUAI SUBBAB 4.6 & 4.7 SKRIPSI)
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
