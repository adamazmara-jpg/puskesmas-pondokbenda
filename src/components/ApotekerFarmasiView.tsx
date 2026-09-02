import React, { useState, useEffect, useRef } from 'react';
import {
  Pill,
  Search,
  CheckCircle2,
  Clock,
  Volume2,
  Printer,
  FileText,
  UserCheck,
  AlertCircle,
  Stethoscope,
  Sparkles,
  Filter,
  Check,
  ChevronRight,
  Package,
  Activity,
  Calendar,
  X,
  Download,
  FileDown,
  QrCode,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import {
  PharmacyPrescription,
  getAllPrescriptions,
  updatePrescriptionStatus
} from '../data/prescriptionDatabase';
import { QueueTicket } from '../types';
import { PatientFlowPipelineBar } from './PatientFlowPipelineBar';

interface ApotekerFarmasiViewProps {
  tickets?: QueueTicket[];
  onNavigateFlow?: (stage: 'loket' | 'dokter' | 'farmasi') => void;
}

export const ApotekerFarmasiView: React.FC<ApotekerFarmasiViewProps> = ({ tickets = [], onNavigateFlow }) => {
  const [prescriptions, setPrescriptions] = useState<PharmacyPrescription[]>(() => getAllPrescriptions());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Waiting' | 'Preparing' | 'Ready' | 'Completed'>('all');
  const [selectedRxForPrint, setSelectedRxForPrint] = useState<PharmacyPrescription | null>(null);
  const [pharmacistName, setPharmacistName] = useState('Apt. Siti Fadilah, S.Farm');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadingRxId, setDownloadingRxId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hiddenPrintRef = useRef<HTMLDivElement>(null);
  const [tempRxForHiddenDownload, setTempRxForHiddenDownload] = useState<PharmacyPrescription | null>(null);

  // Refresh prescriptions periodically from local storage
  useEffect(() => {
    const interval = setInterval(() => {
      setPrescriptions(getAllPrescriptions());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateStatus = (id: string, status: PharmacyPrescription['status']) => {
    const updated = updatePrescriptionStatus(id, status, pharmacistName);
    setPrescriptions(updated);

    if (status === 'Ready') {
      const rx = updated.find(r => r.id === id);
      if (rx) {
        speakPharmacyCall(rx);
      }
    }
  };

  const speakPharmacyCall = (rx: PharmacyPrescription) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Panggilan penyerahan obat apotek. Nomor antrean ${rx.queueNumber.replace('-', ' ')}, atas nama Bapak atau Ibu ${rx.patientName}, silakan menuju ke Loket Farmasi dan Apotek untuk pengambilan obat.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper: Download Etiket as PDF
  const downloadEtiketPdf = async (rx: PharmacyPrescription, elementId: string = 'printable-etiket') => {
    setIsDownloadingPdf(true);
    setDownloadingRxId(rx.id);

    try {
      let targetElement = document.getElementById(elementId);
      
      // If modal is not open, use hidden element
      if (!targetElement) {
        setTempRxForHiddenDownload(rx);
        await new Promise(r => setTimeout(r, 150));
        targetElement = document.getElementById('hidden-etiket-container');
      }

      if (!targetElement) {
        throw new Error('Elemen etiket tidak ditemukan');
      }

      const imgData = await toPng(targetElement, {
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      const img = new Image();
      img.src = imgData;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
      });

      const imgWidthMm = 100;
      const imgHeightMm = (img.height * imgWidthMm) / img.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [imgWidthMm, imgHeightMm + 8],
      });

      pdf.addImage(imgData, 'PNG', 0, 4, imgWidthMm, imgHeightMm);

      const cleanName = (rx.patientName || 'Pasien').replace(/[^a-zA-Z0-9]/g, '_');
      const cleanQueue = (rx.queueNumber || 'Farmasi').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Etiket_Obat_${cleanQueue}_${cleanName}.pdf`;

      pdf.save(filename);
      showToast(`E-Tiket Obat berhasil diunduh: ${filename}`);
    } catch (err) {
      console.error('Gagal membuat PDF Etiket:', err);
      showToast('Gagal mengunduh PDF etiket obat. Silakan coba lagi.');
    } finally {
      setIsDownloadingPdf(false);
      setDownloadingRxId(null);
      setTempRxForHiddenDownload(null);
    }
  };

  // Filtered prescriptions
  const filtered = prescriptions.filter((rx) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      rx.patientName.toLowerCase().includes(q) ||
      rx.queueNumber.toLowerCase().includes(q) ||
      rx.patientNik.includes(q) ||
      rx.poliName.toLowerCase().includes(q) ||
      rx.items.some(it => it.medicineName.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'all' || rx.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Summary counts
  const totalCount = prescriptions.length;
  const waitingCount = prescriptions.filter(r => r.status === 'Waiting').length;
  const preparingCount = prescriptions.filter(r => r.status === 'Preparing').length;
  const readyCount = prescriptions.filter(r => r.status === 'Ready').length;
  const completedCount = prescriptions.filter(r => r.status === 'Completed').length;

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 3-STEP PATIENT FLOW PIPELINE BAR */}
      <PatientFlowPipelineBar
        currentStage="farmasi"
        onSelectStage={onNavigateFlow}
        tickets={tickets}
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
            <Pill className="w-4 h-4 text-teal-700" />
            <span>Instalasi Farmasi & Apoteker</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Antrean e-Resep & Penyiapan Obat Pasien
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menerima resep elektronik secara langsung dari dokter, peracikan obat, dan pemanggilan penyerahan obat ke pasien.
          </p>
        </div>

        {/* Pharmacist Active Staff Indicator */}
        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <div className="text-left">
            <span className="text-[9px] font-extrabold uppercase text-slate-400 block">Apoteker Jaga</span>
            <input
              type="text"
              value={pharmacistName}
              onChange={(e) => setPharmacistName(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none border-b border-transparent focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Waiting */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Waiting' ? 'all' : 'Waiting')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Waiting'
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Waiting' ? 'text-amber-100' : 'text-slate-500'}`}>
              Resep Masuk
            </span>
            <Clock className={`w-4 h-4 ${statusFilter === 'Waiting' ? 'text-white' : 'text-amber-500'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{waitingCount}</div>
          <span className={`text-[10px] font-semibold ${statusFilter === 'Waiting' ? 'text-amber-100' : 'text-slate-400'}`}>
            Perlu disiapkan
          </span>
        </button>

        {/* Preparing */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Preparing' ? 'all' : 'Preparing')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Preparing'
              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Preparing' ? 'text-blue-100' : 'text-slate-500'}`}>
              Sedang Diracik
            </span>
            <Package className={`w-4 h-4 ${statusFilter === 'Preparing' ? 'text-white' : 'text-blue-500'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{preparingCount}</div>
          <span className={`text-[10px] font-semibold ${statusFilter === 'Preparing' ? 'text-blue-100' : 'text-slate-400'}`}>
            Proses peracikan
          </span>
        </button>

        {/* Ready */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Ready' ? 'all' : 'Ready')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Ready'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Ready' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Obat Siap
            </span>
            <Volume2 className={`w-4 h-4 ${statusFilter === 'Ready' ? 'text-white' : 'text-emerald-500'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{readyCount}</div>
          <span className={`text-[10px] font-semibold ${statusFilter === 'Ready' ? 'text-emerald-100' : 'text-slate-400'}`}>
            Panggil pasien
          </span>
        </button>

        {/* Completed */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Completed' ? 'all' : 'Completed')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Completed'
              ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Completed' ? 'text-slate-300' : 'text-slate-500'}`}>
              Selesai Diserahkan
            </span>
            <CheckCircle2 className={`w-4 h-4 ${statusFilter === 'Completed' ? 'text-white' : 'text-slate-600'}`} />
          </div>
          <div className="text-2xl font-black mt-1">{completedCount}</div>
          <span className={`text-[10px] font-semibold ${statusFilter === 'Completed' ? 'text-slate-300' : 'text-slate-400'}`}>
            Obat telah diterima
          </span>
        </button>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pasien, no antrean, NIK, obat..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('Waiting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'Waiting'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Resep Masuk ({waitingCount})
          </button>
          <button
            onClick={() => setStatusFilter('Preparing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'Preparing'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            Diracik ({preparingCount})
          </button>
          <button
            onClick={() => setStatusFilter('Ready')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'Ready'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Siap ({readyCount})
          </button>
        </div>
      </div>

      {/* Prescriptions List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
          <Pill className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Tidak ada resep obat ditemukan</h3>
          <p className="text-xs text-slate-400">Resep elektronik dari dokter poliklinik akan otomatis masuk ke daftar ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((rx) => {
            const isWaiting = rx.status === 'Waiting';
            const isPreparing = rx.status === 'Preparing';
            const isReady = rx.status === 'Ready';
            const isCompleted = rx.status === 'Completed';

            return (
              <div
                key={rx.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs space-y-4 flex flex-col justify-between ${
                  isReady ? 'border-emerald-400 ring-2 ring-emerald-500/20' :
                  isPreparing ? 'border-blue-300' :
                  isWaiting ? 'border-amber-300' :
                  'border-slate-200 opacity-80'
                }`}
              >
                {/* Card Top: Patient Info & Status */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900">{rx.queueNumber}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                          rx.patientType === 'BPJS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rx.patientType}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {rx.poliName}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-900 mt-0.5">
                        {rx.patientName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        NIK: {rx.patientNik} • Dokter: <strong>{rx.doctorName}</strong>
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isWaiting && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Resep Masuk
                        </span>
                      )}
                      {isPreparing && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold rounded-lg flex items-center gap-1 animate-pulse">
                          <Package className="w-3 h-3" /> Sedang Diracik
                        </span>
                      )}
                      {isReady && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <Volume2 className="w-3 h-3" /> Obat Siap
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <Check className="w-3 h-3" /> Selesai
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Diagnosis Chip */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Diagnosa Dokter:</span>
                    <span className="font-bold text-slate-800">
                      {rx.diagnosisName || 'Pemeriksaan Klinis Dokter'}
                    </span>
                    {rx.allergies && rx.allergies.length > 0 && (
                      <div className="mt-1 text-[11px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Alergi: {rx.allergies.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Medicine Items Breakdown */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                      Rincian Obat ({rx.items.length} Item):
                    </span>
                    <div className="space-y-1 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      {rx.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-2 text-xs py-1 border-b border-slate-100 last:border-b-0"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{idx + 1}. {item.medicineName}</span>
                            <span className="block text-[11px] text-teal-700 font-semibold">{item.dosage}</span>
                            {item.notes && <span className="text-[10px] text-slate-400 italic">Catatan: {item.notes}</span>}
                          </div>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-bold text-[11px] rounded shrink-0">
                            {item.quantity} unit
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedRxForPrint(rx)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                        title="Lihat dan cetak label etiket obat"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>Cetak Etiket</span>
                      </button>

                      <button
                        onClick={() => downloadEtiketPdf(rx)}
                        disabled={isDownloadingPdf && downloadingRxId === rx.id}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
                        title="Unduh E-Tiket Obat dalam format PDF"
                      >
                        {isDownloadingPdf && downloadingRxId === rx.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
                            <span>Mengunduh...</span>
                          </>
                        ) : (
                          <>
                            <FileDown className="w-3.5 h-3.5 text-teal-700" />
                            <span>Unduh PDF</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Step Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      {isWaiting && (
                        <button
                          onClick={() => handleUpdateStatus(rx.id, 'Preparing')}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Mulai Racik</span>
                        </button>
                      )}

                      {isPreparing && (
                        <button
                          onClick={() => handleUpdateStatus(rx.id, 'Ready')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Obat Siap & Panggil</span>
                        </button>
                      )}

                      {isReady && (
                        <>
                          <button
                            onClick={() => speakPharmacyCall(rx)}
                            className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition flex items-center gap-1"
                            title="Panggil ulang suara penyerahan obat"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Panggil</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(rx.id, 'Completed')}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Serahkan Obat</span>
                          </button>
                        </>
                      )}

                      {isCompleted && (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Obat Diserahkan
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Print & Unduh PDF Etiket Obat Pasien */}
      {selectedRxForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">E-Tiket & Label Obat Farmasi</h3>
                  <p className="text-[11px] text-slate-500">Pratinjau label etiket resmi, aturan pakai, dan unduh PDF</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRxForPrint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Etiket Document Container */}
            <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 overflow-hidden">
              <div
                id="printable-etiket"
                className="bg-white p-5 rounded-2xl border-2 border-slate-300 shadow-sm space-y-4 text-slate-900 max-w-md mx-auto"
              >
                {/* Official Kop Puskesmas */}
                <div className="text-center pb-3 border-b-2 border-slate-800 space-y-0.5">
                  <div className="flex items-center justify-center gap-2 text-teal-800 font-extrabold text-[11px] uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>PEMERINTAH KOTA TANGERANG SELATAN</span>
                  </div>
                  <h4 className="font-black text-sm uppercase text-slate-900 tracking-tight">
                    UPTD PUSKESMAS PONDOK BENDA
                  </h4>
                  <div className="text-[11px] font-bold text-teal-900 uppercase">
                    INSTALASI FARMASI & PELAYANAN OBAT
                  </div>
                  <p className="text-[9px] text-slate-500">
                    Jl. Benda Raya No. 12 Pamulang II, Pamulang, Tangerang Selatan • Telp: (021) 7471-2345
                  </p>
                  <p className="text-[9px] text-slate-500">
                    SIA: 446.4/018/Farmasi-Dinkes/2024 • SIPA: 19880512/SIPA_3674/2023/2001
                  </p>
                </div>

                {/* Prescription Meta */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>No. Resep: <span className="font-extrabold text-teal-800">{selectedRxForPrint.id}</span></span>
                    <span>No. Antrean: <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">{selectedRxForPrint.queueNumber}</span></span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tgl Resep: <strong>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
                    <span>Jenis: <strong>{selectedRxForPrint.patientType}</strong></span>
                  </div>
                  <div className="pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Nama Pasien: </span>
                    <strong className="text-slate-900 text-xs uppercase">{selectedRxForPrint.patientName}</strong>
                    <span className="text-slate-500 ml-2">(NIK: {selectedRxForPrint.patientNik})</span>
                  </div>
                  <div className="text-slate-600">
                    <span>Poli / Klaster: <strong>{selectedRxForPrint.poliName}</strong></span> • <span>Dokter: <strong>{selectedRxForPrint.doctorName}</strong></span>
                  </div>
                </div>

                {/* Individual Medicine Etiket Stickers */}
                <div className="space-y-3 pt-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5 text-teal-600" />
                    <span>Label Etiket Obat ({selectedRxForPrint.items.length} Macam Obat):</span>
                  </div>

                  {selectedRxForPrint.items.map((item, idx) => {
                    const isObatLuar = item.medicineName.toLowerCase().includes('salep') ||
                                       item.medicineName.toLowerCase().includes('tetes') ||
                                       item.medicineName.toLowerCase().includes('krim') ||
                                       item.medicineName.toLowerCase().includes('lotion');

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border-2 space-y-2 text-xs transition ${
                          isObatLuar
                            ? 'bg-blue-50/70 border-blue-600'
                            : 'bg-white border-teal-600 shadow-2xs'
                        }`}
                      >
                        {/* Etiket Badge Header */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            isObatLuar
                              ? 'bg-blue-600 text-white'
                              : 'bg-teal-700 text-white'
                          }`}>
                            {isObatLuar ? 'OBAT LUAR (TIDAK DITELAN)' : 'OBAT DALAM (DIMINUM)'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600">
                            Etiket #{idx + 1}
                          </span>
                        </div>

                        {/* Medicine Name & Strength */}
                        <div className="text-center py-1">
                          <h5 className="font-extrabold text-sm text-slate-900 leading-tight">
                            {item.medicineName}
                          </h5>
                          <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 inline-block mt-1">
                            Jumlah: {item.quantity} Tablet/Kapsul/Botol
                          </span>
                        </div>

                        {/* Signa & Aturan Pakai */}
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                            Aturan Pakai (Signa):
                          </span>
                          <div className="font-black text-sm text-slate-900 text-teal-900 tracking-wide">
                            {item.dosage}
                          </div>

                          {/* Time checklist indicator */}
                          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-700 pt-1">
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Pagi</span>
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Siang</span>
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Malam</span>
                          </div>
                        </div>

                        {/* Special Instructions / Notes */}
                        {item.notes && (
                          <div className="text-[10px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 font-semibold text-center italic">
                            ⚠️ Perhatian: {item.notes}
                          </div>
                        )}

                        {/* Etiket Footer */}
                        <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>ED / BUD: 6 Bulan sejak penyerahan</span>
                          <span>Simpan &lt; 30°C Sejuk Kering</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Validation & Pharmacist Signature */}
                <div className="pt-3 border-t-2 border-slate-200 text-[10px] text-slate-600 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[9px]">
                      <QrCode className="w-8 h-8 text-teal-800 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-700 block">Verifikasi e-Resep</span>
                        <span>Sistem Farmasi Terpadu</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block">Petugas Farmasi / Apoteker:</span>
                      <strong className="text-slate-900 font-bold text-[11px] underline block mt-0.5">
                        {pharmacistName}
                      </strong>
                      <span className="text-[8px] text-slate-400">UPTD Puskesmas Pondok Benda</span>
                    </div>
                  </div>

                  <p className="text-[8px] text-slate-400 text-center pt-1 border-t border-slate-100 italic">
                    Semoga Lekas Sembuh. Jauhkan obat dari jangkauan anak-anak. Bila timbul efek samping, segera hubungi dokter.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions: Print & Download PDF */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Pilih format output yang diinginkan:
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRxForPrint(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Tutup
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Langsung</span>
                </button>

                <button
                  onClick={() => downloadEtiketPdf(selectedRxForPrint, 'printable-etiket')}
                  disabled={isDownloadingPdf}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-xs disabled:opacity-50"
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Membuat PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>Unduh PDF E-Tiket</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hidden Offscreen Container for Direct Download from Card */}
      {tempRxForHiddenDownload && (
        <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
          <div
            id="hidden-etiket-container"
            className="bg-white p-5 rounded-2xl border-2 border-slate-300 space-y-4 text-slate-900 w-[380px]"
          >
            {/* Kop */}
            <div className="text-center pb-3 border-b-2 border-slate-800 space-y-0.5">
              <div className="text-teal-800 font-extrabold text-[10px] uppercase">
                PEMERINTAH KOTA TANGERANG SELATAN
              </div>
              <h4 className="font-black text-sm uppercase text-slate-900">
                UPTD PUSKESMAS PONDOK BENDA
              </h4>
              <div className="text-[10px] font-bold text-teal-900 uppercase">
                INSTALASI FARMASI & PELAYANAN OBAT
              </div>
              <p className="text-[8px] text-slate-500">
                Jl. Benda Raya No. 12 Pamulang II, Tangerang Selatan
              </p>
            </div>

            {/* Meta */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] space-y-1">
              <div className="flex justify-between font-bold">
                <span>No. Resep: {tempRxForHiddenDownload.id}</span>
                <span>No. Antrean: {tempRxForHiddenDownload.queueNumber}</span>
              </div>
              <div>
                <span>Nama Pasien: </span>
                <strong className="text-slate-900 uppercase">{tempRxForHiddenDownload.patientName}</strong>
              </div>
              <div className="text-slate-600">
                <span>Poli: {tempRxForHiddenDownload.poliName}</span> • <span>Dokter: {tempRxForHiddenDownload.doctorName}</span>
              </div>
            </div>

            {/* Medicines */}
            <div className="space-y-2">
              {tempRxForHiddenDownload.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-white border-2 border-teal-600 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-[9px] font-black text-teal-800">
                    <span>OBAT DALAM</span>
                    <span>#{idx + 1}</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900 text-center">
                    {item.medicineName} ({item.quantity} Tab/Btl)
                  </div>
                  <div className="text-center font-black text-teal-900 bg-teal-50 p-1.5 rounded border border-teal-200">
                    {item.dosage}
                  </div>
                  {item.notes && <div className="text-[9px] text-slate-500 italic text-center">* {item.notes}</div>}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-200 text-[9px] flex justify-between">
              <span>Tgl: {new Date().toLocaleDateString('id-ID')}</span>
              <span>Apoteker: <strong>{pharmacistName}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
