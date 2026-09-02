import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Users,
  Volume2,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Pill,
  FileText,
  AlertCircle,
  Activity,
  HeartPulse,
  Send,
  Sparkles,
  Search,
  UserCheck,
  Building2,
  Calendar,
  Check
} from 'lucide-react';
import { PoliService, QueueTicket, DoctorSchedule, VitalSigns, PrescriptionItem, Gender, PatientType } from '../types';
import { addPrescription } from '../data/prescriptionDatabase';
import { addOrUpdateRmeRecord } from '../data/rmeDatabase';
import { PatientFlowPipelineBar } from './PatientFlowPipelineBar';

interface PelayananMedisViewProps {
  polis: PoliService[];
  tickets: QueueTicket[];
  doctors: DoctorSchedule[];
  onUpdateTicketStatus: (ticketId: string, status: any) => void;
  onRefresh?: () => void;
  onNavigateFlow?: (stage: 'loket' | 'dokter' | 'farmasi') => void;
}

const DOSAGE_PRESETS = [
  '3 x 1 tablet sesudah makan (3x sehari)',
  '2 x 1 tablet sesudah makan (2x sehari)',
  '1 x 1 tablet sesudah makan pagi (1x sehari)',
  '1 x 1 tablet malam hari (1x sehari)',
  '3 x 1 tablet 1 jam sebelum makan (3x sehari)',
  '3 x 1 sendok teh (5ml) sesudah makan (3x sehari)',
  '3 x 1 kaplet sesudah makan bila nyeri',
  '3 x 1 kapsul sesudah makan (habiskan)',
  '1 x 1 tablet sebelum tidur',
  'Teteskan 2 tetes 3x sehari'
];

export const PelayananMedisView: React.FC<PelayananMedisViewProps> = ({
  polis,
  tickets,
  doctors,
  onUpdateTicketStatus,
  onRefresh,
  onNavigateFlow
}) => {
  const [selectedPoliId, setSelectedPoliId] = useState<string>(polis[0]?.id || 'poli-umum');
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>('dr. Siti Rahmawati, M.Kes');
  const [activePatient, setActivePatient] = useState<QueueTicket | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Vital Signs State
  const [vitals, setVitals] = useState<VitalSigns>({
    bloodPressure: '120/80 mmHg',
    temperature: 36.5,
    heartRate: 80,
    respiratoryRate: 18,
    weightKg: 60,
    heightCm: 165,
    bloodOxygen: 99
  });

  // Clinical Diagnosis & Therapy
  const [diagnosisCode, setDiagnosisCode] = useState('MED-01');
  const [diagnosisName, setDiagnosisName] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');

  // Prescription Items (Doctor types medicine names directly based on patient's specific need)
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { medicineName: '', dosage: '3 x 1 tablet sesudah makan', quantity: 10, notes: '' }
  ]);

  // Selected Poli Object
  const currentPoli = polis.find(p => p.id === selectedPoliId) || polis[0] || {
    id: 'poli-umum',
    name: 'Poli Umum',
    code: 'A',
    room: 'Ruang Pemeriksaan 1'
  };

  // Doctors in selected Poli
  const poliDoctors = doctors.filter(d => d.poliId === selectedPoliId || d.poliName.toLowerCase().includes(currentPoli.name.toLowerCase()));

  useEffect(() => {
    if (poliDoctors.length > 0) {
      setSelectedDoctorName(poliDoctors[0].doctorName);
    } else {
      setSelectedDoctorName('dr. Jaga Poliklinik Puskesmas');
    }
  }, [selectedPoliId]);

  // Tickets for current poli that are ready for doctor examination
  const poliTickets = tickets.filter(t => t.poliId === selectedPoliId);
  const waitingForDoctor = poliTickets.filter(t => t.status === 'Waiting' || t.status === 'Called' || t.status === 'Verified');
  const completedToday = poliTickets.filter(t => t.status === 'Completed');

  // Text to Speech
  const speakDoctorCall = (ticket: QueueTicket) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Panggilan pemeriksaan dokter. Nomor antrean ${ticket.queueNumber.replace('-', ' ')}, atas nama Bapak atau Ibu ${ticket.fullName}, silakan masuk ke Ruang Pemeriksaan ${currentPoli.name}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCallPatient = (ticket: QueueTicket) => {
    setActivePatient(ticket);
    setChiefComplaint(ticket.chiefComplaint || 'Pemeriksaan rutin kesehatan');
    speakDoctorCall(ticket);
    onUpdateTicketStatus(ticket.id, 'Called');
    setNotification({
      type: 'info',
      message: `Memanggil pasien ${ticket.fullName} (${ticket.queueNumber}) ke Ruang ${currentPoli.name}...`
    });
  };

  const handleAddPrescriptionRow = () => {
    setPrescriptions(prev => [
      ...prev,
      { medicineName: '', dosage: '3 x 1 tablet sesudah makan', quantity: 10, notes: '' }
    ]);
  };

  const handleRemovePrescriptionRow = (index: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (index: number, field: keyof PrescriptionItem, val: any) => {
    setPrescriptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  // Submit Doctor Examination -> Send e-Resep to Pharmacy & Save RME
  const handleFinishExaminationAndSendPrescription = () => {
    if (!activePatient) {
      alert('Pilih pasien terlebih dahulu dari daftar antrean.');
      return;
    }

    // 1. Save to RME Database
    const newRme = addOrUpdateRmeRecord({
      patientNik: activePatient.nik,
      patientBpjs: activePatient.bpjsNumber,
      patientName: activePatient.fullName,
      birthDate: activePatient.birthDate || '1990-01-01',
      gender: activePatient.gender,
      address: activePatient.address,
      phone: activePatient.phone,
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      poliId: currentPoli.id,
      poliName: currentPoli.name,
      doctorName: selectedDoctorName,
      patientType: activePatient.patientType,
      chiefComplaint: chiefComplaint || activePatient.chiefComplaint,
      vitalSigns: vitals,
      allergies: [],
      diagnosisCode,
      diagnosisName,
      treatmentPlan,
      prescriptions: prescriptions.filter(p => p.medicineName.trim().length > 0),
      status: 'Final',
      notes: clinicalNotes
    });

    // 2. Transmit e-Prescription to Pharmacy / Apoteker Queue
    const validMedicines = prescriptions.filter(p => p.medicineName.trim().length > 0);
    if (validMedicines.length > 0) {
      addPrescription({
        ticketId: activePatient.id,
        queueNumber: activePatient.queueNumber,
        patientNik: activePatient.nik,
        patientName: activePatient.fullName,
        patientType: activePatient.patientType,
        bpjsNumber: activePatient.bpjsNumber,
        birthDate: activePatient.birthDate,
        gender: activePatient.gender,
        phone: activePatient.phone,
        poliId: currentPoli.id,
        poliName: currentPoli.name,
        doctorName: selectedDoctorName,
        diagnosisCode,
        diagnosisName,
        allergies: [],
        items: validMedicines,
        instructions: treatmentPlan,
        status: 'Waiting',
        totalItemsCount: validMedicines.length
      });
    }

    // 3. Update Queue Ticket Status to Completed in Doctor (forwarded to pharmacy)
    onUpdateTicketStatus(activePatient.id, 'Completed');

    setNotification({
      type: 'success',
      message: `Pemeriksaan selesai! Rekam Medis (RME #${newRme.id}) tersimpan & ${validMedicines.length} resep obat berhasil diteruskan ke Instalasi Farmasi/Apotek.`
    });

    // Reset active patient
    setActivePatient(null);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 3-STEP PATIENT FLOW PIPELINE BAR */}
      <PatientFlowPipelineBar
        currentStage="dokter"
        onSelectStage={onNavigateFlow}
        tickets={tickets}
      />

      {/* Top Header & Poli Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4 text-emerald-700" />
            <span>Portal Pelayanan & Medis Dokter</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pemeriksaan Pasien & Pembuatan e-Resep Dokter
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Panggil pasien setelah diverifikasi di loket, input diagnosa ICD-10, dan teruskan resep obat ke Farmasi / Apoteker.
          </p>
        </div>

        {/* Poli and Doctor Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            <select
              value={selectedPoliId}
              onChange={(e) => setSelectedPoliId(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
            >
              {polis.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <select
              value={selectedDoctorName}
              onChange={(e) => setSelectedDoctorName(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {poliDoctors.length > 0 ? (
                poliDoctors.map(d => (
                  <option key={d.id} value={d.doctorName}>
                    {d.doctorName}
                  </option>
                ))
              ) : (
                <option value="dr. Siti Rahmawati, M.Kes">dr. Siti Rahmawati, M.Kes</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
          notification.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-300' :
          'bg-blue-50 text-blue-900 border-blue-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* Main Grid: Queue on Left, Medical Exam & Prescription on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Waiting Patient Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Antrean Pasien Poli</h3>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                {waitingForDoctor.length} Menunggu
              </span>
            </div>

            {waitingForDoctor.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Tidak ada antrean menunggu di poli ini.</p>
                <p className="text-[10px] text-slate-400">Pasien yang selesai diverifikasi di loket akan muncul di sini.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {waitingForDoctor.map((tkt) => {
                  const isCurrent = activePatient?.id === tkt.id;
                  return (
                    <div
                      key={tkt.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-emerald-800 tracking-tight">
                              {tkt.queueNumber}
                            </span>
                            <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded ${
                              tkt.patientType === 'BPJS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tkt.patientType}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 mt-0.5 line-clamp-1">
                            {tkt.fullName}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            Keluhan: {tkt.chiefComplaint || 'Pemeriksaan Kesehatan'}
                          </p>
                        </div>

                        <button
                          onClick={() => handleCallPatient(tkt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                            isCurrent
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isCurrent ? 'Panggil Ulang' : 'Panggil'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Examination & e-Prescription Sheet */}
        <div className="lg:col-span-8 space-y-6">
          
          {activePatient ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-6">
              
              {/* Patient Banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase">
                    <span>Sedang Diperiksa di {currentPoli.name}</span>
                    <span>•</span>
                    <span>{activePatient.patientType}</span>
                  </div>
                  <h3 className="text-xl font-black mt-0.5 flex items-center gap-2">
                    <span>{activePatient.fullName}</span>
                    <span className="px-2 py-0.5 bg-white/20 rounded-md text-sm font-mono">{activePatient.queueNumber}</span>
                  </h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    NIK: {activePatient.nik} | Usia: ~{activePatient.birthDate ? 'Dewasa' : '-'} | Alamat: {activePatient.address}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakDoctorCall(activePatient)}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Bunyikan Panggilan</span>
                  </button>
                </div>
              </div>

              {/* Section 1: Vital Signs (TTV) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>1. Tanda-Tanda Vital Pasien (TTV)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Tekanan Darah</label>
                    <input
                      type="text"
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      placeholder="120/80 mmHg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Suhu (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 36.5 })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      placeholder="36.5"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Nadi (bpm)</label>
                    <input
                      type="number"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: parseInt(e.target.value) || 80 })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      placeholder="80"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Berat (kg)</label>
                    <input
                      type="number"
                      value={vitals.weightKg}
                      onChange={(e) => setVitals({ ...vitals, weightKg: parseFloat(e.target.value) || 60 })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Anamnesa & Diagnosa Medis */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>2. Anamnesa & Diagnosa Medis Pasien</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Keluhan Pasien / Hasil Pemeriksaan Fisik:</label>
                    <textarea
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      rows={2}
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="Tuliskan keluhan utama, riwayat penyakit, dan temuan pemeriksaan fisik..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Nama Diagnosa Medis (Diagnosa Dokter):</label>
                    <input
                      type="text"
                      value={diagnosisName}
                      onChange={(e) => setDiagnosisName(e.target.value)}
                      placeholder="Ketik diagnosa penyakit pasien (cth: ISPA Akut, Hipertensi Grade 1, Gastritis, Mialgia, Demam Febris, dll)..."
                      className="w-full mt-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Kebutuhan Obat-obatan (e-Resep) */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span>3. Kebutuhan Obat-Obatan Pasien (e-Resep Dokter)</span>
                  </div>

                  <button
                    onClick={handleAddPrescriptionRow}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Baris Obat</span>
                  </button>
                </div>

                {/* Prescription List Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Nama Obat & Sediaan (Ketik Kebutuhan Pasien)</th>
                        <th className="p-2.5">Aturan Pakai / Berapa Kali Makan & Minum</th>
                        <th className="p-2.5 w-24 text-center">Jumlah</th>
                        <th className="p-2.5">Catatan Dokter</th>
                        <th className="p-2.5 w-12 text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {prescriptions.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.medicineName}
                              onChange={(e) => handlePrescriptionChange(idx, 'medicineName', e.target.value)}
                              placeholder="Ketik nama obat & dosis (cth: Paracetamol 500mg, Amoxicillin 500mg, Ambroxol sirup, dll)"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-xs text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              list={`dosage-list-${idx}`}
                              value={item.dosage}
                              onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                              placeholder="cth: 3 x 1 tablet sesudah makan"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <datalist id={`dosage-list-${idx}`}>
                              {DOSAGE_PRESETS.map((dp, i) => (
                                <option key={i} value={dp} />
                              ))}
                            </datalist>
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handlePrescriptionChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-bold text-xs text-center text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.notes || ''}
                              onChange={(e) => handlePrescriptionChange(idx, 'notes', e.target.value)}
                              placeholder="cth: Habiskan / Bila demam / Sebelum tidur"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemovePrescriptionRow(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Hapus baris obat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Button: Finish & Transmit to Pharmacy */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-semibold">
                  Dokter Pemeriksa: <strong className="text-slate-800">{selectedDoctorName}</strong>
                </span>

                <button
                  onClick={handleFinishExaminationAndSendPrescription}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Selesaikan & Kirim e-Resep ke Apoteker</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Belum Ada Pasien Yang Dipanggil</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Silakan klik tombol <strong>"Panggil"</strong> pada daftar antrean pasien di sebelah kiri untuk memulai pemeriksaan medis dan pembuatan e-resep obat.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
