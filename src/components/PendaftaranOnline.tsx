import React, { useState } from 'react';
import {
  Calendar,
  User,
  CreditCard,
  Phone,
  MapPin,
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Search,
  Check,
  ArrowLeft,
  UserCheck,
  BrainCircuit,
  Activity,
  Layers,
  HelpCircle,
  UserPlus,
  Zap,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { PoliService, QueueTicket, PatientType, Gender } from '../types';
import {
  searchPatientByNikOrBpjs,
  calculateAge,
  formatBirthDateToInput,
  PatientRecord
} from '../data/patientDatabase';
import {
  RandomForestWidget
} from './RandomForestWidget';
import { DOCTOR_MASTER_DATABASE } from '../utils/randomForestPredictor';

interface PendaftaranOnlineProps {
  polis: PoliService[];
  onTicketCreated: (ticket: QueueTicket) => void;
  setActiveTab: (tab: string) => void;
}

export const PendaftaranOnline: React.FC<PendaftaranOnlineProps> = ({
  polis,
  onTicketCreated,
  setActiveTab,
}) => {
  // Step State (1: Pencarian NIK, 2: Verifikasi Data Pasien, 3: Pilih Poli & ML Random Forest)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Search Input State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSource, setSearchSource] = useState<'NIK' | 'BPJS'>('NIK');
  const [searchHasRun, setSearchHasRun] = useState(false);
  const [foundPatient, setFoundPatient] = useState<PatientRecord | null>(null);

  // Form Field State
  const [patientType, setPatientType] = useState<PatientType>('BPJS');
  const [nik, setNik] = useState('');
  const [bpjsNumber, setBpjsNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('1992-06-15');
  const [gender, setGender] = useState<Gender>('L');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Pondok Benda, Pamulang, Tangerang Selatan');
  const [poliId, setPoliId] = useState(polis[0]?.id || 'poli-umum');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('08:00 - 10:00 WIB');
  const [chiefComplaint, setChiefComplaint] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResetForm = () => {
    setCurrentStep(1);
    setSearchQuery('');
    setSearchHasRun(false);
    setFoundPatient(null);
    setPatientType('BPJS');
    setNik('');
    setBpjsNumber('');
    setFullName('');
    setBirthDate('1992-06-15');
    setGender('L');
    setPhone('');
    setAddress('Pondok Benda, Pamulang, Tangerang Selatan');
    setPoliId(polis[0]?.id || 'poli-umum');
    setAppointmentDate(new Date().toISOString().split('T')[0]);
    setTimeSlot('08:00 - 10:00 WIB');
    setChiefComplaint('');
    setErrorMsg('');
  };

  // 1. TAHAP 1: PENCARIAN DIREK PASIEN BERDASARKAN NIK / BPJS
  const handleSearchPatient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSearchHasRun(true);

    const cleanQuery = searchQuery.trim().replace(/\D/g, '');
    if (!cleanQuery || cleanQuery.length < 5) {
      setErrorMsg('Ketik minimal 5 digit NIK KTP atau Nomor BPJS untuk melakukan pencarian');
      return;
    }

    const matched = searchPatientByNikOrBpjs(cleanQuery);
    if (matched) {
      setFoundPatient(matched);
      setNik(matched.nik);
      if (matched.bpjsNumber) {
        setBpjsNumber(matched.bpjsNumber);
        setPatientType('BPJS');
      } else {
        setBpjsNumber('');
        setPatientType('Umum');
      }
      setFullName(matched.fullName);
      if (matched.birthDate) setBirthDate(formatBirthDateToInput(matched.birthDate));
      if (matched.address) setAddress(matched.address);
      if (matched.gender) setGender(matched.gender);
      if (matched.phone) setPhone(matched.phone);
    } else {
      setFoundPatient(null);
      if (cleanQuery.length === 16) {
        setNik(cleanQuery);
      }
    }
  };

  // Navigasi Tahap 1 -> Tahap 2
  const handleProceedToStep2 = () => {
    setErrorMsg('');
    if (!searchHasRun && !nik) {
      setErrorMsg('Silakan masukkan NIK KTP atau Nomor BPJS dan tekan tombol Cari Data terlebih dahulu.');
      return;
    }
    setCurrentStep(2);
  };

  // Navigasi Tahap 2 -> Tahap 3
  const handleProceedToStep3 = () => {
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg('Nama Lengkap Pasien wajib diisi');
      return;
    }
    if (!nik || nik.length < 16) {
      setErrorMsg('Nomor NIK KTP harus 16 digit angka');
      return;
    }
    if (patientType === 'BPJS' && !bpjsNumber) {
      setErrorMsg('Nomor BPJS Kesehatan wajib diisi untuk pasien BPJS');
      return;
    }
    if (!phone) {
      setErrorMsg('Nomor HP / WhatsApp wajib diisi');
      return;
    }
    setCurrentStep(3);
  };

  // Submit Final Form
  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Check date range limit (max 1 month)
    const todayStr = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    if (appointmentDate < todayStr || appointmentDate > maxDateStr) {
      setErrorMsg('Tanggal pendaftaran hanya diperbolehkan dari hari ini sampai maksimal 1 bulan ke depan.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientType,
          nik,
          bpjsNumber,
          fullName,
          birthDate,
          gender,
          phone,
          address,
          poliId,
          appointmentDate,
          timeSlot,
          chiefComplaint,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.data) {
        onTicketCreated(data.data);
      } else {
        setErrorMsg(data.message || 'Gagal menerbitkan tiket pendaftaran.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Terjadi kesalahan jaringan. Silakan periksa koneksi internet Anda.');
    }
  };

  const selectedPoli = polis.find((p) => p.id === poliId) || polis[0];
  const patientAge = calculateAge(birthDate);
  const assignedDoctor = DOCTOR_MASTER_DATABASE.find(d => d.poliId === poliId) || DOCTOR_MASTER_DATABASE[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Title Section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full border border-emerald-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sistem Pendaftaran 3 Tahap & Evaluasi Random Forest ML</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Pendaftaran Berobat Pasien Mandiri
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
          Proses pendaftaran terintegrasi dalam 3 Tahap: Pencarian NIK KTP, Verifikasi Data Pasien, serta Pemilihan Poliklinik dengan Evaluasi Slot Tersedia & Waktu Tunggu Berbasis Random Forest.
        </p>
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={handleResetForm}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center gap-1.5 shadow-2xs"
            title="Bersihkan formulir untuk mendaftarkan pasien/NIK berbeda"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Form Pasien Baru / Daftar NIK Lain</span>
          </button>
        </div>
      </div>

      {/* 3-STAGE NAVBAR (Navigation Bar Berbeda per Tahap) */}
      <div className="bg-slate-900 text-white rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-3 gap-2">
          
          {/* Stage Navbar 1 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-xl transition text-left flex items-center gap-3 relative overflow-hidden ${
              currentStep === 1
                ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/30'
                : currentStep > 1
                ? 'bg-slate-800 text-emerald-400 hover:bg-slate-750'
                : 'bg-slate-950/60 text-slate-500 hover:bg-slate-800/50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
              currentStep === 1
                ? 'bg-white text-emerald-700'
                : currentStep > 1
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {currentStep > 1 ? <Check className="w-5 h-5 stroke-[3]" /> : '1'}
            </div>
            <div className="hidden sm:block overflow-hidden">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200/80">
                Tahap Pertama
              </div>
              <div className="text-xs font-bold truncate">Pencarian NIK / BPJS</div>
            </div>
          </button>

          {/* Stage Navbar 2 */}
          <button
            type="button"
            onClick={() => {
              if (searchHasRun || nik) setCurrentStep(2);
            }}
            disabled={!searchHasRun && !nik}
            className={`p-3 rounded-xl transition text-left flex items-center gap-3 relative overflow-hidden ${
              currentStep === 2
                ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/30'
                : currentStep > 2
                ? 'bg-slate-800 text-emerald-400 hover:bg-slate-750'
                : 'bg-slate-950/60 text-slate-500 hover:bg-slate-800/50 disabled:opacity-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
              currentStep === 2
                ? 'bg-white text-emerald-700'
                : currentStep > 2
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {currentStep > 2 ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
            </div>
            <div className="hidden sm:block overflow-hidden">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200/80">
                Tahap Kedua
              </div>
              <div className="text-xs font-bold truncate">Verifikasi Profil Pasien</div>
            </div>
          </button>

          {/* Stage Navbar 3 */}
          <button
            type="button"
            onClick={() => {
              if (fullName) setCurrentStep(3);
            }}
            disabled={!fullName}
            className={`p-3 rounded-xl transition text-left flex items-center gap-3 relative overflow-hidden ${
              currentStep === 3
                ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/30'
                : 'bg-slate-950/60 text-slate-500 hover:bg-slate-800/50 disabled:opacity-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
              currentStep === 3
                ? 'bg-white text-emerald-700'
                : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </div>
            <div className="hidden sm:block overflow-hidden">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200/80">
                Tahap Ketiga
              </div>
              <div className="text-xs font-bold truncate">Poliklinik & ML Prediction</div>
            </div>
          </button>

        </div>
      </div>

      {/* Main Stage Content Container Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAHAP 1: PENCARIAN DIREK NIK / BPJS */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                  Tahap 1 dari 3: Pencarian
                </span>
                <h3 className="text-xl font-black text-slate-900">Masukkan NIK KTP atau Nomor BPJS</h3>
                <p className="text-xs text-slate-500">
                  Sistem akan secara otomatis mencari identitas Anda di Database Rekam Medis Puskesmas Pondok Benda.
                </p>
              </div>

              <div className="w-12 h-12 bg-emerald-100 rounded-2xl text-emerald-700 flex items-center justify-center font-bold">
                <Search className="w-6 h-6" />
              </div>
            </div>

            {/* Direct Search Form */}
            <form onSubmit={handleSearchPatient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Metode Pencarian
                  </label>
                  <select
                    value={searchSource}
                    onChange={(e) => setSearchSource(e.target.value as 'NIK' | 'BPJS')}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="NIK">Nomor NIK KTP (16 Digit)</option>
                    <option value="BPJS">Nomor Kartu BPJS Kesehatan</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ketik {searchSource === 'NIK' ? '16 Digit NIK KTP' : 'Nomor BPJS'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        maxLength={16}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Ketik ${searchSource === 'NIK' ? 'NIK KTP' : 'No. BPJS'}...`}
                        className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0"
                    >
                      <Search className="w-4 h-4" />
                      <span>Cari Data</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Direct Search Result Notification */}
            {searchHasRun && (
              <div className="pt-2">
                {foundPatient ? (
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-500/60 rounded-2xl space-y-3 animate-fadeIn shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>DATA PASIEN TERDAFTAR DITEMUKAN!</span>
                      </div>
                      <span className="bg-emerald-200 text-emerald-950 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300">
                        Puskesmas Verified ✓
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/90 p-4 rounded-xl border border-emerald-200 text-xs text-slate-800">
                      <div>
                        <span className="text-slate-500">Nama Lengkap Pasien:</span>
                        <div className="font-extrabold text-slate-900 text-base">{foundPatient.fullName}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Umur Pasien Saat Ini:</span>
                        <div className="font-bold text-slate-900">{calculateAge(foundPatient.birthDate)} Tahun ({foundPatient.birthDate})</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Nomor NIK KTP / BPJS:</span>
                        <div className="font-semibold text-slate-900">{foundPatient.nik} {foundPatient.bpjsNumber ? `(BPJS: ${foundPatient.bpjsNumber})` : ''}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Alamat Rumah:</span>
                        <div className="font-semibold text-slate-900">{foundPatient.address}</div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={handleProceedToStep2}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
                      >
                        <span>Gunakan Data Ini & Lanjut Tahap 2</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                      <UserPlus className="w-5 h-5 text-amber-600" />
                      <span>Data NIK / BPJS Belum Terdaftar</span>
                    </div>
                    <p className="text-xs text-amber-800">
                      Nomor <strong className="font-bold">{searchQuery}</strong> belum ditemukan di database lokal. Anda dapat mendaftar sebagai <strong className="font-bold">Pasien Baru</strong> dengan melengkapi profil di Tahap 2.
                    </p>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleProceedToStep2}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow transition flex items-center gap-1.5"
                      >
                        <span>Daftar Pasien Baru & Lanjut Tahap 2</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 1 Footer Action */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
              >
                <span>Lanjut ke Tahap 2: Verifikasi Data</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAHAP 2: VERIFIKASI & PROFIL KELENGKAPAN PASIEN */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                  Tahap 2 dari 3: Verifikasi Profil
                </span>
                <h3 className="text-xl font-black text-slate-900">Verifikasi & Profil Pasien</h3>
                <p className="text-xs text-slate-500">
                  Periksa kebenaran Nama Lengkap, Umur, Jenis Kelamin, Alamat, dan Jenis Pembayaran (BPJS/Umum).
                </p>
              </div>

              <div className="w-12 h-12 bg-emerald-100 rounded-2xl text-emerald-700 flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Payment Category Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Kategori Jaminan Berobat Pasien
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPatientType('BPJS')}
                  className={`p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between ${
                    patientType === 'BPJS'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-700 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold">BPJS Kesehatan (Gratis)</span>
                  </div>
                  {patientType === 'BPJS' && <Check className="w-4 h-4 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPatientType('Umum')}
                  className={`p-3.5 rounded-xl border-2 text-left transition flex items-center justify-between ${
                    patientType === 'Umum'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 text-slate-700 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold">Pasien Umum / Non-BPJS</span>
                  </div>
                  {patientType === 'Umum' && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>
            </div>

            {/* Patient Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* NIK Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor NIK KTP Pasien <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* BPJS Number Field */}
              {patientType === 'BPJS' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor BPJS Kesehatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={13}
                    value={bpjsNumber}
                    onChange={(e) => setBpjsNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pasien <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Birthdate & Calculated Age */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Tanggal Lahir Pasien
                  </label>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Umur Pasien: {patientAge} Tahun
                  </span>
                </div>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kelamin
                </label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'L'}
                      onChange={() => setGender('L')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Laki-laki (L)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'P'}
                      onChange={() => setGender('P')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Perempuan (P)</span>
                  </label>
                </div>
              </div>

              {/* Phone / WA */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Rumah / Tempat Tinggal
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Step 2 Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali Tahap 1</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToStep3}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
              >
                <span>Lanjut ke Tahap 3: Pilih Poli & ML</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAHAP 3: PEMILIHAN POLIKLINIK & EVALUASI RANDOM FOREST ML */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmitFinal} className="p-6 sm:p-8 space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                  Tahap 3 dari 3: Poliklinik & Model ML
                </span>
                <h3 className="text-xl font-black text-slate-900">Poliklinik Tujuan & Evaluasi Random Forest ML</h3>
                <p className="text-xs text-slate-500">
                  Model Random Forest Classifier memprediksi <strong className="text-slate-900">Slot Tersedia (Ya/Tidak)</strong>, <strong className="text-slate-900">Status Pendaftaran</strong>, dan <strong className="text-slate-900">Estimasi Waktu Tunggu</strong>.
                </p>
              </div>

              <div className="w-12 h-12 bg-emerald-100 rounded-2xl text-emerald-700 flex items-center justify-center font-bold">
                <BrainCircuit className="w-6 h-6" />
              </div>
            </div>

            {/* Patient Summary Bar */}
            <div className="p-4 bg-slate-900 text-white rounded-xl text-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-slate-400 font-medium">Profil Pasien Terverifikasi:</div>
                <div className="text-sm font-black text-emerald-400">{fullName} ({patientAge} Tahun)</div>
                <div className="text-[11px] text-slate-300">NIK: {nik} • {patientType} {bpjsNumber ? `(BPJS: ${bpjsNumber})` : ''}</div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs border border-slate-700 transition"
              >
                Ubah Profil Pasien
              </button>
            </div>

            {/* Poliklinik & Schedule Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Poliklinik Tujuan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Stethoscope className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <select
                    value={poliId}
                    onChange={(e) => setPoliId(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {polis.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.code}] {p.name} ({p.room}) - Antrean: {p.totalWaiting || 0} Pasien
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Kunjungan Berobat <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={appointmentDate}
                    min={new Date().toISOString().split('T')[0]}
                    max={(() => {
                      const d = new Date();
                      d.setMonth(d.getMonth() + 1);
                      return d.toISOString().split('T')[0];
                    })()}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  *Maksimal pendaftaran 1 bulan ke depan dari hari ini.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sesi Jam Datang
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="08:00 - 10:00 WIB">Sesi Pagi (08:00 - 10:00 WIB)</option>
                    <option value="10:00 - 12:00 WIB">Sesi Siang Awal (10:00 - 12:00 WIB)</option>
                    <option value="12:00 - 14:00 WIB">Sesi Siang Akhir (12:00 - 14:00 WIB)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keluhan Utama / Catatan Periksa
                </label>
                <input
                  type="text"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Flu batuk, pusing, demam, periksa hamil, cabut gigi..."
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Random Forest ML Prediction Engine Card */}
            <div className="pt-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Hasil Prediksi Machine Learning (Slot Tersedia & Waktu Tunggu)
              </label>

              <RandomForestWidget
                poliId={selectedPoli.id}
                poliName={selectedPoli.name}
                waitingCount={selectedPoli.totalWaiting || 3}
                timeSlot={timeSlot}
                patientAge={patientAge}
                gender={gender}
                patientType={patientType}
              />
            </div>

            {/* Final Form Navigation & Submit */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali Tahap 2</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menerbitkan E-Tiket...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Terbitkan E-Tiket Antrean Online (Selesai)</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
