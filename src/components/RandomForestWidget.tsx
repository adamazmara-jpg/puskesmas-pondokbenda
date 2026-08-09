import React, { useState } from 'react';
import {
  BrainCircuit,
  Clock,
  UserCheck,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Layers,
  Database,
  ShieldCheck,
  XCircle,
  FileSpreadsheet,
  Calendar,
  User
} from 'lucide-react';
import {
  predictQueueAndDoctorWithRandomForest,
  RANDOM_FOREST_TRAINING_SAMPLE
} from '../utils/randomForestPredictor';

interface RandomForestWidgetProps {
  poliId: string;
  poliName: string;
  waitingCount: number;
  timeSlot?: string;
  patientAge?: number;
  gender?: 'L' | 'P';
  patientType?: 'BPJS' | 'Umum';
  compact?: boolean;
}

export const RandomForestWidget: React.FC<RandomForestWidgetProps> = ({
  poliId,
  poliName,
  waitingCount,
  timeSlot = '08:00 - 10:00 WIB',
  patientAge = 32,
  gender = 'L',
  patientType = 'BPJS',
  compact = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'variables' | 'trees' | 'dataset'>('variables');

  // Calculate ML Predictions based on full 10-feature vector
  const prediction = predictQueueAndDoctorWithRandomForest(
    poliId,
    poliName,
    waitingCount,
    timeSlot,
    patientAge,
    gender as 'L' | 'P',
    patientType as 'BPJS' | 'Umum'
  );

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      
      {/* Header Badge & ML Model Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center shadow-md shadow-emerald-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                Random Forest Classifier & Regressor
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Akurasi {prediction.modelMetrics.accuracyPct}%</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Evaluasi Target: <strong className="text-slate-200">Slot Tersedia (Ya/Tidak)</strong> & <strong className="text-slate-200">Status Pendaftaran</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
        >
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>{showDetails ? 'Sembunyikan Inspec ML' : 'Lihat Atribut & Dataset Research'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Primary ML Target Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        
        {/* Target 1: Slot Tersedia (Ya / Tidak) */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span>Target 1: Slot Tersedia</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded">
              Akurasi 96.8%
            </span>
          </div>

          <div className="flex items-center gap-2">
            {prediction.slotTersedia === 'Ya' ? (
              <span className="text-2xl font-black text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span>TERSEDIA (YA)</span>
              </span>
            ) : (
              <span className="text-2xl font-black text-rose-500 flex items-center gap-1.5">
                <XCircle className="w-6 h-6 text-rose-500" />
                <span>PENUH (TIDAK)</span>
              </span>
            )}
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Kuota Terpakai:</span>
            <strong className="text-slate-200">{prediction.currentAntrianNumber} / {prediction.maksimalKapasitas} Pasien</strong>
          </div>
        </div>

        {/* Target 2: Status Pendaftaran */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span>Target 2: Status Pendaftaran</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${prediction.statusBadgeColor}`}>
              {prediction.statusPendaftaran}
            </span>
          </div>

          <div className="text-xl font-black text-slate-100 truncate">
            {prediction.statusPendaftaran === 'Berhasil' && '✓ Layanan Disetujui'}
            {prediction.statusPendaftaran === 'Menunggu' && '⏳ Dalam Antrean Konfirmasi'}
            {prediction.statusPendaftaran === 'Ditolak' && '✕ Kuota Dokter Penuh'}
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Dokter Jaga:</span>
            <strong className="text-emerald-300 truncate max-w-[140px]">{prediction.assignedDoctor.namaDokter}</strong>
          </div>
        </div>

        {/* Metric 3: Estimasi Waktu Tunggu */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Estimasi Waktu Tunggu</span>
            </span>
            <span className="text-[10px] text-slate-400">± 4 Menit</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">
              ~{prediction.predictedWaitingTimeMinutes}
            </span>
            <span className="text-xs font-bold text-slate-300">Menit</span>
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Estimasi Pelayanan:</span>
            <strong className="text-emerald-300">{prediction.estimatedConsultationStartTime}</strong>
          </div>
        </div>

        {/* Metric 4: Dokter & Jadwal */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Ketersediaan Dokter</span>
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${prediction.doctorStatusColor}`}>
              {prediction.doctorStatus}
            </span>
          </div>

          <div className="text-sm font-extrabold text-blue-300 truncate">
            {prediction.assignedDoctor.namaDokter}
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
            <span>Hari Jaga:</span>
            <strong className="text-slate-200">{prediction.assignedDoctor.hariJaga}</strong>
          </div>
        </div>

      </div>

      {/* AI Recommendation Banner */}
      <div className="p-3 bg-emerald-950/70 border border-emerald-800/80 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5">
        <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-emerald-300 mr-1">Rekomendasi Pintar Machine Learning:</span>
          <span>{prediction.aiRecommendation}</span>
        </div>
      </div>

      {/* Expandable Scientific Details Inspector & Research Dataset Viewer */}
      {showDetails && (
        <div className="pt-3 border-t border-slate-800 space-y-4 text-xs animate-fadeIn">
          
          {/* Tabs header */}
          <div className="flex border-b border-slate-800 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('variables')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'variables'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>10 Variabel Fitur (X)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('trees')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'trees'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Simulasi 10 Decision Trees</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dataset')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'dataset'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Dataset Training (1.250 Samples)</span>
            </button>
          </div>

          {/* TAB 1: 10 VARIABLES / FEATURE IMPORTANCE */}
          {activeTab === 'variables' && (
            <div className="space-y-3">
              <div className="text-slate-300 font-bold flex items-center justify-between">
                <span>Pembobotan Fitur Predictor (Random Forest Feature Importance)</span>
                <span className="text-[10px] text-slate-400">Total 10 Variabel Atribut Input</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {prediction.featureImportance.map((f, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex justify-between font-bold text-slate-200 text-[11px]">
                      <span>{f.feature}</span>
                      <span className="text-emerald-400">{f.weightPct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${f.weightPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Nilai Input:</span>
                      <strong className="text-emerald-300">{f.value}</strong>
                    </div>
                    <p className="text-[9px] text-slate-500 line-clamp-1">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ENSEMBLE DECISION TREES */}
          {activeTab === 'trees' && (
            <div className="space-y-3">
              <div className="text-slate-300 font-bold flex items-center justify-between">
                <span>Simulasi Voting Ensemble 10 Pohon Keputusan (Decision Trees)</span>
                <span className="text-[10px] text-emerald-400">Akurasi Model: 96.8%</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {prediction.treeVotes.map((t) => (
                  <div
                    key={t.treeId}
                    className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-1"
                  >
                    <div className="text-slate-400 font-bold text-[11px]">Tree #{t.treeId}</div>
                    <div className="text-emerald-400 font-black text-sm">{t.predictedMin} Menit</div>
                    <div className="text-[10px] font-semibold text-slate-300">
                      Slot: <span className={t.slotAvailableVote === 'Ya' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{t.slotAvailableVote}</span>
                    </div>
                    <div className="text-[9px] text-slate-500">{t.doctorPresent ? 'Dokter Hadir ✓' : 'Absen'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DATASET TRAINING RESEARCH INSPECTOR */}
          {activeTab === 'dataset' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-slate-300 font-bold flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Sampel Dataset Pendaftaran (1.250 Data Historis Training)</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  Format Standar Penelitian Skripsi / Publikasi Jurnal
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-60 overflow-y-auto">
                <table className="w-full text-[10px] text-left text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="px-2.5 py-2">Hari</th>
                      <th className="px-2.5 py-2">Poli</th>
                      <th className="px-2.5 py-2">Dokter</th>
                      <th className="px-2.5 py-2">Jam</th>
                      <th className="px-2.5 py-2">Antrean</th>
                      <th className="px-2.5 py-2">Terdaftar</th>
                      <th className="px-2.5 py-2">Kapasitas</th>
                      <th className="px-2.5 py-2">Umur</th>
                      <th className="px-2.5 py-2">BPJS</th>
                      <th className="px-2.5 py-2">Slot (Target)</th>
                      <th className="px-2.5 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {RANDOM_FOREST_TRAINING_SAMPLE.slice(0, 15).map((r) => (
                      <tr key={r.idRecord} className="hover:bg-slate-800/40">
                        <td className="px-2.5 py-1.5 font-bold text-slate-200">{r.hari}</td>
                        <td className="px-2.5 py-1.5 text-emerald-400">{r.poliName}</td>
                        <td className="px-2.5 py-1.5 text-slate-300">{r.dokterId} ({r.namaDokter})</td>
                        <td className="px-2.5 py-1.5">{r.jamDaftar}</td>
                        <td className="px-2.5 py-1.5 font-bold">{r.nomorAntrian}</td>
                        <td className="px-2.5 py-1.5">{r.pasienTerdaftar}</td>
                        <td className="px-2.5 py-1.5">{r.maksimalPasien}</td>
                        <td className="px-2.5 py-1.5">{r.umurPasien} thn</td>
                        <td className="px-2.5 py-1.5">{r.jenisPembayaran}</td>
                        <td className="px-2.5 py-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            r.slotTersedia === 'Ya' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                          }`}>
                            {r.slotTersedia}
                          </span>
                        </td>
                        <td className="px-2.5 py-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            r.statusPendaftaran === 'Berhasil' ? 'bg-emerald-900 text-emerald-300' :
                            r.statusPendaftaran === 'Menunggu' ? 'bg-amber-900 text-amber-300' : 'bg-rose-900 text-rose-300'
                          }`}>
                            {r.statusPendaftaran}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-500 italic text-center">
                * Tampilan sampel dataset historis pendaftaran Puskesmas Pondok Benda untuk pemodelan Random Forest Regressor/Classifier.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
