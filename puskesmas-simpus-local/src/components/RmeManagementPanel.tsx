import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  User,
  Activity,
  HeartPulse,
  Pill,
  Plus,
  Printer,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Filter,
  Save,
  X,
  Sparkles,
  ClipboardList,
  Trash2
} from 'lucide-react';
import { MedicalRecord, PoliService, Gender, PatientType } from '../types';
import { getAllRmeRecords, addOrUpdateRmeRecord, clearAllRmeRecords } from '../data/rmeDatabase';
import { PATIENT_DATABASE, calculateAge } from '../data/patientDatabase';

interface RmeManagementPanelProps {
  polis: PoliService[];
}

export const RmeManagementPanel: React.FC<RmeManagementPanelProps> = ({ polis }) => {
  const [rmeRecords, setRmeRecords] = useState<MedicalRecord[]>(() => getAllRmeRecords());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoliFilter, setSelectedPoliFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Auto-sync RME records when new patient registers via instant custom event or polling
  useEffect(() => {
    const handleSync = () => {
      const latest = getAllRmeRecords();
      setRmeRecords(latest);
      if (latest.length > 0) {
        setSelectedRecord(prev => {
          if (!prev) return latest[0];
          return latest.find(r => r.id === prev.id) || latest[0];
        });
      } else {
        setSelectedRecord(null);
      }
    };

    window.addEventListener('rme-records-updated', handleSync);
    const interval = setInterval(handleSync, 2000);
    return () => {
      window.removeEventListener('rme-records-updated', handleSync);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selectedRecord && rmeRecords.length > 0) {
      setSelectedRecord(rmeRecords[0]);
    } else if (rmeRecords.length === 0) {
      setSelectedRecord(null);
    }
  }, [rmeRecords, selectedRecord]);

  // Form state for creating a new RME record
  const [formData, setFormData] = useState({
    patientNik: '',
    patientBpjs: '',
    patientName: '',
    birthDate: '1990-01-01',
    gender: 'L' as Gender,
    address: '',
    phone: '',
    poliId: polis[0]?.id || 'poli-umum',
    doctorName: 'dr. H. Bambang Suherman',
    patientType: 'BPJS' as PatientType,
    chiefComplaint: '',
    historyOfPresentIllness: '',
    bloodPressure: '120/80 mmHg',
    temperature: 36.5,
    heartRate: 80,
    respiratoryRate: 18,
    weightKg: 60,
    heightCm: 165,
    bloodOxygen: 99,
    allergiesInput: '',
    diagnosisCode: 'J00',
    diagnosisName: 'Akut Nasofaringitis (Common Cold)',
    diagnosisCategory: 'Penyakit Saluran Pernapasan',
    treatmentPlan: '',
    prescriptionsText: 'Paracetamol 500mg (3x1 sesudah makan - 10 tab)\nAmbroxol 30mg (3x1 sesudah makan - 10 tab)',
    notes: ''
  });

  // Filtered RME list
  const filteredRecords = rmeRecords.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      r.patientName.toLowerCase().includes(q) ||
      r.patientNik.includes(q) ||
      (r.patientBpjs && r.patientBpjs.includes(q)) ||
      r.diagnosisName.toLowerCase().includes(q) ||
      r.diagnosisCode.toLowerCase().includes(q);

    const matchPoli = selectedPoliFilter === 'all' || r.poliId === selectedPoliFilter;
    return matchQuery && matchPoli;
  });

  // Autocomplete patient data from PATIENT_DATABASE when typing NIK/Name in form
  const handleNikSearchInForm = (nikVal: string) => {
    setFormData(prev => ({ ...prev, patientNik: nikVal }));
    const cleanNik = nikVal.replace(/\D/g, '');
    if (cleanNik.length >= 10) {
      const match = PATIENT_DATABASE.find(p => p.nik.replace(/\D/g, '') === cleanNik);
      if (match) {
        setFormData(prev => ({
          ...prev,
          patientName: match.fullName,
          patientBpjs: match.bpjsNumber || '',
          birthDate: match.birthDate,
          gender: (match.gender || 'L') as Gender,
          address: match.address,
          phone: match.phone || prev.phone
        }));
      }
    }
  };

  const handleSaveNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientNik || !formData.diagnosisName) {
      alert('Mohon lengkapi NIK, Nama Pasien, dan Diagnosa!');
      return;
    }

    const selectedPoliObj = polis.find(p => p.id === formData.poliId);

    // Parse prescriptions text
    const prescriptions = formData.prescriptionsText
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => {
        return {
          medicineName: line.trim(),
          dosage: 'Sesuai anjuran dokter',
          quantity: 10,
          notes: 'Minum teratur'
        };
      });

    // Calculate BMI
    const hMeter = (formData.heightCm || 165) / 100;
    const bmiVal = parseFloat(((formData.weightKg || 60) / (hMeter * hMeter)).toFixed(1));

    const newRecord: MedicalRecord = {
      id: `rme-${Date.now()}`,
      patientNik: formData.patientNik,
      patientBpjs: formData.patientBpjs,
      patientName: formData.patientName,
      birthDate: formData.birthDate,
      gender: formData.gender,
      address: formData.address || 'Kecamatan Pamulang, Tangerang Selatan',
      phone: formData.phone,
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      poliId: formData.poliId,
      poliName: selectedPoliObj?.name || 'Poli Umum',
      doctorName: selectedPoliObj?.doctorName || formData.doctorName,
      patientType: formData.patientType,
      chiefComplaint: formData.chiefComplaint || 'Pemeriksaan Kesehatan',
      historyOfPresentIllness: formData.historyOfPresentIllness,
      vitalSigns: {
        bloodPressure: formData.bloodPressure,
        temperature: Number(formData.temperature) || 36.5,
        heartRate: Number(formData.heartRate) || 80,
        respiratoryRate: Number(formData.respiratoryRate) || 18,
        weightKg: Number(formData.weightKg) || 60,
        heightCm: Number(formData.heightCm) || 165,
        bmi: bmiVal,
        bloodOxygen: Number(formData.bloodOxygen) || 99
      },
      allergies: formData.allergiesInput ? formData.allergiesInput.split(',').map(s => s.trim()) : [],
      diagnosisCode: formData.diagnosisCode,
      diagnosisName: formData.diagnosisName,
      diagnosisCategory: formData.diagnosisCategory,
      treatmentPlan: formData.treatmentPlan || 'Istirahat cukup dan minum obat secara teratur.',
      prescriptions,
      status: 'Final',
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    const saved = addOrUpdateRmeRecord(newRecord);
    setRmeRecords(getAllRmeRecords());
    setSelectedRecord(saved);
    setIsAddModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4 text-emerald-700" />
            <span>Sistem Informasi Rekam Medis Elektronik (RME)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Riwayat Kesehatan & Diagnosa Pasien Terstruktur
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan rekam medis digital berstandar SOAP, ICD-10, tanda-tanda vital, riwayat kunjungan, dan e-resep farmasi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {rmeRecords.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Kosongkan semua data Rekam Medis (RME)? Data yang baru mendaftar nanti akan langsung muncul sebagai data baru.')) {
                  clearAllRmeRecords();
                  setRmeRecords([]);
                  setSelectedRecord(null);
                }
              }}
              className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="Kosongkan seluruh data Rekam Medis"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Kosongkan RME</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catatan RME Baru</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left List, Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Search, Filter, and Patient RME List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari NIK, Nama Pasien, atau Diagnosa ICD-10..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Poli Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedPoliFilter}
                onChange={e => setSelectedPoliFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="all">Semua Poliklinik ({rmeRecords.length} RME)</option>
                {polis.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Records List Container */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredRecords.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">
                  {rmeRecords.length === 0
                    ? 'Belum ada data rekam medis'
                    : 'Tidak ada data rekam medis yang sesuai pencarian.'}
                </p>
                {rmeRecords.length === 0 && (
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Data rekam medis otomatis dibuat & disesuaikan begitu pasien mendaftar di loket antrean online.
                  </p>
                )}
              </div>
            ) : (
              filteredRecords.map(record => {
                const isSelected = selectedRecord?.id === record.id;
                const age = calculateAge(record.birthDate);

                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-slate-900">{record.patientName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            record.patientType === 'BPJS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {record.patientType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          NIK: {record.patientNik} • {record.gender === 'L' ? 'Laki-laki' : 'Perempuan'}, {age} th
                        </p>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-400 shrink-0 bg-slate-100 px-2 py-0.5 rounded-md">
                        {record.visitDate}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold text-[11px]">{record.poliName}</span>
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-900 bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-md">
                        {record.diagnosisCode}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium truncate mt-1">
                      {record.diagnosisName}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Patient Full RME Detail (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedRecord ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
              
              {/* Header Resume */}
              <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Rekam Medis Elektronik Terverifikasi (Kemenkes RME)</span>
                  </div>
                  <h3 className="text-xl font-black text-white">{selectedRecord.patientName}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100 mt-1">
                    <span>NIK: <strong className="font-mono text-white">{selectedRecord.patientNik}</strong></span>
                    {selectedRecord.patientBpjs && (
                      <span>BPJS: <strong className="font-mono text-white">{selectedRecord.patientBpjs}</strong></span>
                    )}
                    <span>Usia: <strong>{calculateAge(selectedRecord.birthDate)} Tahun</strong> ({selectedRecord.gender === 'L' ? 'L' : 'P'})</span>
                  </div>
                </div>

                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs border border-emerald-600 print:hidden"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Resume</span>
                </button>
              </div>

              {/* Patient Basic Info Card */}
              <div className="p-5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Tgl Kunjungan</span>
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedRecord.visitDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Poliklinik</span>
                  <span className="font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedRecord.poliName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Dokter Penanggung Jawab</span>
                  <span className="font-extrabold text-slate-800 mt-0.5 block truncate">
                    {selectedRecord.doctorName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Tipe Jaminan</span>
                  <span className="font-extrabold text-emerald-700 mt-0.5 block">
                    {selectedRecord.patientType} Kesehatan
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                
                {/* 1. Subjektif (Anamnesis & Keluhan) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-900 border-b border-slate-100 pb-1">
                    <span className="w-5 h-5 bg-emerald-700 text-white rounded-full flex items-center justify-center text-[10px]">S</span>
                    <span>Subjektif (Anamnesis & Keluhan Pasien)</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">Keluhan Utama:</span>
                      <p className="text-slate-800 font-semibold">{selectedRecord.chiefComplaint}</p>
                    </div>
                    {selectedRecord.historyOfPresentIllness && (
                      <div>
                        <span className="font-bold text-slate-700 block text-[11px]">Riwayat Penyakit Sekarang:</span>
                        <p className="text-slate-600">{selectedRecord.historyOfPresentIllness}</p>
                      </div>
                    )}
                    {selectedRecord.allergies && selectedRecord.allergies.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="font-bold text-rose-700 text-[11px]">Riwayat Alergi:</span>
                        {selectedRecord.allergies.map((al, idx) => (
                          <span key={idx} className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px] border border-rose-200">
                            {al}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Objektif (Tanda-Tanda Vital & Pemeriksaan Fisik) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-900 border-b border-slate-100 pb-1">
                    <span className="w-5 h-5 bg-blue-700 text-white rounded-full flex items-center justify-center text-[10px]">O</span>
                    <span>Objektif (Tanda-Tanda Vital & Pemeriksaan Fisik)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Tekanan Darah</span>
                      <span className="text-sm font-black text-slate-900">{selectedRecord.vitalSigns.bloodPressure}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Suhu Tubuh</span>
                      <span className="text-sm font-black text-slate-900">{selectedRecord.vitalSigns.temperature} °C</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Denyut Nadi</span>
                      <span className="text-sm font-black text-slate-900">{selectedRecord.vitalSigns.heartRate} x/mnt</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">SpO2 / Oksigen</span>
                      <span className="text-sm font-black text-slate-900">{selectedRecord.vitalSigns.bloodOxygen || 99} %</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Berat Badan</span>
                      <span className="text-sm font-black text-slate-900">{selectedRecord.vitalSigns.weightKg} kg</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Tinggi Badan</span>
                      <span className="text-sm font-black text-slate-900">{selectedRecord.vitalSigns.heightCm} cm</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Indeks Massa Tubuh (IMT)</span>
                      <span className="text-sm font-black text-slate-900">
                        {selectedRecord.vitalSigns.bmi || '-'} kg/m² 
                        <span className="text-[10px] font-normal text-slate-500 ml-1">
                          ({selectedRecord.vitalSigns.bmi && selectedRecord.vitalSigns.bmi >= 25 ? 'Kelebihan BB' : 'Normal'})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Asesmen / Diagnosa ICD-10 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-900 border-b border-slate-100 pb-1">
                    <span className="w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px]">A</span>
                    <span>Asesmen / Diagnosa Medis (ICD-10)</span>
                  </div>
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-amber-700 text-white rounded font-mono font-bold text-xs">
                        {selectedRecord.diagnosisCode}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {selectedRecord.diagnosisName}
                      </span>
                    </div>
                    {selectedRecord.diagnosisCategory && (
                      <p className="text-xs text-amber-900 font-medium">
                        Kategori: {selectedRecord.diagnosisCategory}
                      </p>
                    )}
                    {selectedRecord.secondaryDiagnosis && (
                      <p className="text-xs text-slate-700">
                        <strong>Diagnosa Sekunder:</strong> {selectedRecord.secondaryDiagnosis}
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Plan / Tata Laksana & Resep Obat */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-900 border-b border-slate-100 pb-1">
                    <span className="w-5 h-5 bg-purple-700 text-white rounded-full flex items-center justify-center text-[10px]">P</span>
                    <span>Plan / Tata Laksana & Resep Obat Farmasi</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Tindakan / Edukasi:</span>
                      <p className="text-slate-800">{selectedRecord.treatmentPlan}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-purple-600" />
                        <span>Rincian Resep Obat (E-Prescription):</span>
                      </span>
                      <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                        {selectedRecord.prescriptions.map((p, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-100 last:border-b-0 last:pb-0">
                            <div>
                              <span className="font-bold text-slate-900 block">{idx + 1}. {p.medicineName}</span>
                              <span className="text-[11px] text-slate-500">Aturan Pakai: {p.dosage}</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                              {p.quantity} Tab / Botol
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400 space-y-3 h-full flex flex-col items-center justify-center">
              <ClipboardList className="w-12 h-12 text-slate-300" />
              <div>
                <h4 className="text-sm font-bold text-slate-700">
                  {rmeRecords.length === 0 ? 'Data Rekam Medis (RME) Kosong' : 'Pilih Pasien dari Daftar'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  {rmeRecords.length === 0
                    ? 'Menunggu pasien mendaftar di loket antrean online. Begitu pasien mendaftar, data RME otomatis masuk dan disesuaikan.'
                    : 'Klik salah satu data rekam medis di sebelah kiri untuk melihat riwayat pemeriksaan SOAP lengkap, tanda vital, dan e-resep.'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal: Add New RME Record */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider block">
                  ENTRY REKAM MEDIS BARU
                </span>
                <h3 className="text-lg font-black text-white">Tambah Catatan RME Pasien</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewRecord} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Patient Lookup */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <span className="text-[11px] font-black text-emerald-900 block">
                  1. Identitas Pasien (Otomatis Sync dengan Database Pasien)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      NIK KTP Pasien *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.patientNik || ''}
                      onChange={e => handleNikSearchInForm(e.target.value)}
                      placeholder="Masukkan 16 digit NIK..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      No. BPJS (Bila Ada)
                    </label>
                    <input
                      type="text"
                      value={formData.patientBpjs || ''}
                      onChange={e => setFormData({ ...formData, patientBpjs: e.target.value })}
                      placeholder="Contoh: 1790635882"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Lengkap Pasien *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.patientName || ''}
                      onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="Nama pasien..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jenis Pasien
                    </label>
                    <select
                      value={formData.patientType || 'BPJS'}
                      onChange={e => setFormData({ ...formData, patientType: e.target.value as PatientType })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                    >
                      <option value="BPJS">BPJS Kesehatan</option>
                      <option value="Umum">Pasien Umum</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Poliklinik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Poliklinik Pemeriksa *
                  </label>
                  <select
                    value={formData.poliId || (polis[0]?.id || '')}
                    onChange={e => setFormData({ ...formData, poliId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    {polis.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Dokter Pemeriksa
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName || ''}
                    onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Subjektif */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Keluhan Utama (Anamnesis) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.chiefComplaint || ''}
                  onChange={e => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  placeholder="Keluhan utama pasien saat datang..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>

              {/* Tanda Vital */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[11px] font-black text-slate-800 block">
                  2. Tanda-Tanda Vital Pasien
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tensi (TD)</label>
                    <input
                      type="text"
                      value={formData.bloodPressure || ''}
                      onChange={e => setFormData({ ...formData, bloodPressure: e.target.value })}
                      placeholder="120/80 mmHg"
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Suhu (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.temperature ?? 36.5}
                      onChange={e => setFormData({ ...formData, temperature: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nadi (x/mnt)</label>
                    <input
                      type="number"
                      value={formData.heartRate ?? 80}
                      onChange={e => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">BB (kg)</label>
                    <input
                      type="number"
                      value={formData.weightKg ?? 60}
                      onChange={e => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosa ICD-10 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kode ICD-10 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.diagnosisCode || ''}
                    onChange={e => setFormData({ ...formData, diagnosisCode: e.target.value })}
                    placeholder="Contoh: J00, I10, K29"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Diagnosa ICD-10 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.diagnosisName || ''}
                    onChange={e => setFormData({ ...formData, diagnosisName: e.target.value })}
                    placeholder="Contoh: Akut Nasofaringitis / ISPA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Plan & Resep */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Resep Obat Farmasi (1 baris per obat)
                </label>
                <textarea
                  rows={3}
                  value={formData.prescriptionsText || ''}
                  onChange={e => setFormData({ ...formData, prescriptionsText: e.target.value })}
                  placeholder="Contoh:&#10;Paracetamol 500mg (3x1 sesudah makan)&#10;Ambroxol 30mg (3x1 sesudah makan)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Catatan RME</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
