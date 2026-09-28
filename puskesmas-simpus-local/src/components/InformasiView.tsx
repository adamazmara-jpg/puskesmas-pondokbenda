import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calendar,
  Smartphone,
  HelpCircle,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  MessageSquare,
  Award,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export interface InformasiViewProps {
  initialSubSection?: string;
  setActiveTab: (tab: string) => void;
}

export const INFO_SUBSECTIONS = [
  { id: 'standar-pelayanan', label: 'Standar Pelayanan Publik', icon: ShieldCheck, badge: 'PermenPAN-RB' },
  { id: 'antrian-live', label: 'Informasi Antrian Live', icon: Clock, badge: 'Real-time' },
  { id: 'persyaratan-poli', label: 'Persyaratan Daftar Poliklinik', icon: FileCheck, badge: 'Lengkap' },
  { id: 'pendaftaran-perjanjian', label: 'Pendaftaran Melalui Perjanjian', icon: Calendar, badge: 'H-1 s/d H-7' },
  { id: 'pendaftaran-online', label: 'Pendaftaran Online', icon: QrCode, badge: 'Web App' },
  { id: 'cara-daftar-website', label: 'Cara Daftar Online Via Website', icon: HelpCircle, badge: 'Panduan' },
  { id: 'alur-pendaftaran', label: 'Alur Pendaftaran Online', icon: ArrowRight, badge: 'Flowchart' },
  { id: 'cara-daftar-wa', label: 'Cara Daftar Via Whatsapp', icon: Smartphone, badge: 'WA Center' },
  { id: 'survei-ikm', label: 'Survei Kepuasan Masyarakat', icon: MessageSquare, badge: 'IKM Tangsel' },
];

export const InformasiView: React.FC<InformasiViewProps> = ({
  initialSubSection = 'standar-pelayanan',
  setActiveTab,
}) => {
  const [activeSection, setActiveSection] = useState<string>(initialSubSection);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pusat Informasi Pelayanan Publik Puskesmas Pondok Benda</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Informasi & Panduan Pelayanan
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
          Temukan informasi lengkap terkait standar pelayanan publik, tarif MCU, persyaratan poliklinik, pendaftaran online, dan panduan layanan Puskesmas Pondok Benda Tangerang Selatan.
        </p>
      </div>

      {/* Subsections Navigation Grid / Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {INFO_SUBSECTIONS.map((sub) => {
            const Icon = sub.icon;
            const isActive = activeSection === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  if (sub.id === 'survei-ikm') {
                    setActiveTab('survei');
                  } else if (sub.id === 'pendaftaran-online') {
                    setActiveTab('pendaftaran');
                  } else if (sub.id === 'antrian-live') {
                    setActiveTab('antrean');
                  } else {
                    setActiveSection(sub.id);
                  }
                }}
                className={`p-3 rounded-xl text-left transition flex items-start gap-2.5 border ${
                  isActive
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-slate-50 hover:bg-emerald-50/60 text-slate-700 border-slate-200/80 hover:border-emerald-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-emerald-800 text-amber-300' : 'bg-white text-emerald-600 border border-slate-200'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${isActive ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}>
                      {sub.badge}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold leading-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {sub.label}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Detailed Content Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        
        {/* SECTION 1: STANDAR PELAYANAN PUBLIK */}
        {activeSection === 'standar-pelayanan' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  PermenPAN-RB No. 15 Tahun 2014
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Standar Pelayanan Publik & Maklumat Pelayanan
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              UPTD Puskesmas Pondok Benda berkomitmen menyelenggarakan pelayanan kesehatan berstandar tinggi yang transparan, akuntabel, dan bebas dari pungutan liar sesuai dengan 14 Komponen Standar Pelayanan Publik Kementerian PAN-RB.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="text-xs font-extrabold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Maklumat Pelayanan Publik</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai ketentuan peraturan perundang-undangan."
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <h4 className="text-xs font-extrabold text-emerald-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Akreditasi Utama Kemenkes RI</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Puskesmas Pondok Benda telah tersertifikasi <strong>Akreditasi Utama</strong> oleh Kementerian Kesehatan RI, menjamin keselamatan pasien (patient safety), fasilitas medis higienis, dan manajemen mutu berkesinambungan.
                </p>
              </div>
            </div>

            <div className="bg-emerald-900 text-white p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase text-emerald-300 tracking-wider">
                14 Komponen Standar Pelayanan Publik
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-emerald-100">
                <div>• Persyaratan Pelayanan</div>
                <div>• Sistem, Mekanisme & Prosedur</div>
                <div>• Jangka Waktu Penyelesaian</div>
                <div>• Biaya / Tarif Layanan</div>
                <div>• Produk Pelayanan</div>
                <div>• Sarana, Prasarana & Fasilitas</div>
                <div>• Kompetensi Pelaksana</div>
                <div>• Pengawasan Internal</div>
                <div>• Penanganan Pengaduan</div>
                <div>• Jumlah Pelaksana Medis</div>
                <div>• Jaminan Pelayanan</div>
                <div>• Jaminan Keselamatan</div>
                <div>• Evaluasi Kinerja Pelaksana</div>
                <div>• Maklumat Pelayanan</div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: PERSYARATAN DAFTAR POLIKLINIK */}
        {activeSection === 'persyaratan-poli' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Dokumen Persyaratan Pasien
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Persyaratan Pendaftaran Poliklinik
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pasien BPJS Kesehatan */}
              <div className="p-5 border-2 border-emerald-200 rounded-2xl bg-emerald-50/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Pasien BPJS Kesehatan / KIS</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 shrink-0"></span>
                    <span>Kartu BPJS Kesehatan / KIS / Aplikasi Mobile JKN (Faskes Tingkat 1: Puskesmas Pondok Benda)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 shrink-0"></span>
                    <span>KTP Asli / Kartu Identitas Anak (KIA) / Kartu Keluarga (KK)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 shrink-0"></span>
                    <span>Kartu Berobat Puskesmas (Bagi Pasien Lama)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 shrink-0"></span>
                    <span>Surat Kontrol / Rujukan Internal (Bila berkunjung ulang)</span>
                  </li>
                </ul>
              </div>

              {/* Pasien Umum Tangsel / Non-Tangsel */}
              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/60 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <UserCheck className="w-5 h-5 text-slate-700" />
                  <span>Pasien UMUM (KTP Tangsel / Luar Daerah)</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 shrink-0"></span>
                    <span>KTP Asli / KK (Warga Tangsel Gratis Retribusi Loket Dasar)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 shrink-0"></span>
                    <span>Kartu Berobat Pasien Puskesmas Pondok Benda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 shrink-0"></span>
                    <span>Retribusi Layanan Umum sesuai Perda Tangsel (Rp 10.000) bagi pasien non-BPJS</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 6: PENDAFTARAN MELALUI PERJANJIAN */}
        {activeSection === 'pendaftaran-perjanjian' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  Booking Kuota Berobat
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Pendaftaran Melalui Perjanjian (H-1 s/d H-7)
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hindari antrean panjang di loket pagi hari dengan memanfaatkan fitur <strong>Pendaftaran Berobat Melalui Perjanjian</strong>. Anda dapat memilih tanggal pemeriksaan mulai H-1 hingga H-7 sebelum hari kunjungan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                <h4 className="text-xs font-bold text-slate-900">Pilih Tanggal Kunjungan</h4>
                <p className="text-[11px] text-slate-600">Pilih hari dan poliklinik tujuan sesuai jadwal dokter yang tersedia.</p>
              </div>

              <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                <h4 className="text-xs font-bold text-slate-900">Isi NIK & Data Diri</h4>
                <p className="text-[11px] text-slate-600">Masukkan NIK KTP Tangsel atau nomor BPJS Kesehatan secara akurat.</p>
              </div>

              <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                <h4 className="text-xs font-bold text-slate-900">Dapatkan QR E-Tiket</h4>
                <p className="text-[11px] text-slate-600">Tunjukkan QR E-Tiket di scan-box loket kedatangan tanpa perlu antre ulang.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('pendaftaran')}
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Buat Perjanjian Berobat Sekarang</span>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 7: CARA DAFTAR ONLINE VIA WEBSITE */}
        {activeSection === 'cara-daftar-website' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  Panduan Penggunaan Portal
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Cara Daftar Online Via Website Puskesmas
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Buka Menu "Pendaftaran Online"</h4>
                  <p className="text-xs text-slate-600">Klik tombol hijau 'Daftar Online' pada bagian navigasi atas website ini.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Pilih Jenis Pasien & Poliklinik</h4>
                  <p className="text-xs text-slate-600">Tentukan jenis kepesertaan (BPJS Kesehatan / Pasien Umum) dan poli spesialisasi tujuan.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Lengkapi Identitas & Keluhan Medis</h4>
                  <p className="text-xs text-slate-600">Ketik NIK KTP, Nama Lengkap, Nomor HP WhatsApp, serta keluhan singkat penyakit Anda.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">Cetak / Simpan E-Tiket Antrean</h4>
                  <p className="text-xs text-slate-600">Sistem akan secara otomatis menerbitkan Kode Antrean (Contoh: A-015) beserta estimasi jam pemanggilan.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 8: ALUR PENDAFTARAN ONLINE */}
        {activeSection === 'alur-pendaftaran' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ArrowRight className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Infografis Pelayanan Pasien
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Alur Pelayanan Pendaftaran Online Puskesmas
                </h3>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-xs">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-amber-400 font-extrabold block">LANGKAH 1</span>
                  <p className="font-bold">Booking Online Website / WA</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-amber-400 font-extrabold block">LANGKAH 2</span>
                  <p className="font-bold">Datang 15 Menit Sebelum Jam Estimasi</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-amber-400 font-extrabold block">LANGKAH 3</span>
                  <p className="font-bold">Scan QR / Tap Kode di Loket Fast-Track</p>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-amber-400 font-extrabold block">LANGKAH 4</span>
                  <p className="font-bold">Pemeriksaan Dokter & Pengambilan Obat</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 9: CARA DAFTAR VIA WHATSAPP */}
        {activeSection === 'cara-daftar-wa' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Layanan Fast-Track WA
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Cara Daftar Antrean Via WhatsApp
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Selain melalui portal website, Anda juga dapat melakukan booking antrean secara cepat melalui layanan WhatsApp Hotline resmi UPTD Puskesmas Pondok Benda.
            </p>

            <div className="p-5 border-2 border-emerald-300 rounded-2xl bg-emerald-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-900">Nomor WhatsApp Resmi Puskesmas:</span>
                <span className="text-sm font-black text-emerald-700 font-mono">082311366261</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs space-y-2 font-mono text-slate-800">
                <p className="text-slate-500 font-sans font-bold text-[11px]">Format Pesan WA:</p>
                <p className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                  DAFTAR#NIK#NAMA_PASIEN#POLI_TUJUAN#JENIS_PASIEN(BPJS/UMUM)#TANGGAL
                </p>
                <p className="text-[11px] text-slate-500 font-sans">
                  Contoh: <code className="text-emerald-700 font-bold">DAFTAR#3674011204850001#Siti Rahmah#Poli Umum#BPJS#2026-08-07</code>
                </p>
              </div>

              <a
                href="https://wa.me/6282311366261?text=Halo%20Admin%20Puskesmas%20Pondok%20Benda,%20saya%20ingin%20mendaftar%20antrean%20berobat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>KIRIM PESAN WA SEKARANG (082311366261)</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
