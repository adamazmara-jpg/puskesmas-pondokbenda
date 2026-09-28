import React from 'react';
import {
  ListOrdered,
  Stethoscope,
  Pill,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';
import { QueueTicket } from '../types';
import { getAllPrescriptions } from '../data/prescriptionDatabase';

interface PatientFlowPipelineBarProps {
  currentStage: 'loket' | 'dokter' | 'farmasi';
  onSelectStage: (stage: 'loket' | 'dokter' | 'farmasi') => void;
  tickets?: QueueTicket[];
  className?: string;
}

export const PatientFlowPipelineBar: React.FC<PatientFlowPipelineBarProps> = ({
  currentStage,
  onSelectStage,
  tickets = [],
  className = ''
}) => {
  // Count stats across the 3 stages
  const waitingLoketCount = tickets.filter(t => t.status === 'Waiting' || t.status === 'Called').length;
  const waitingDoctorCount = tickets.filter(t => t.status === 'Verified' || t.status === 'Waiting').length;
  
  const allPrescriptions = getAllPrescriptions();
  const activePharmacyCount = allPrescriptions.filter(p => p.status === 'Waiting' || p.status === 'Preparing').length;
  const readyPharmacyCount = allPrescriptions.filter(p => p.status === 'Ready').length;
  const completedTotalCount = tickets.filter(t => t.status === 'Completed').length;

  const stages = [
    {
      id: 'loket' as const,
      step: 1,
      name: 'Loket Pendaftaran',
      sublabel: 'Panggilan & Verifikasi Berkas',
      icon: ListOrdered,
      badge: `${waitingLoketCount} Antre`,
      activeColor: 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300/60',
      inactiveColor: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
    },
    {
      id: 'dokter' as const,
      step: 2,
      name: 'Pemeriksaan Dokter',
      sublabel: 'Anamnesis, Diagnosa & e-Resep',
      icon: Stethoscope,
      badge: `${waitingDoctorCount} Siap Periksa`,
      activeColor: 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-300/60',
      inactiveColor: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
    },
    {
      id: 'farmasi' as const,
      step: 3,
      name: 'Farmasi & Apoteker',
      sublabel: 'Peracikan & Penyerahan Obat',
      icon: Pill,
      badge: `${activePharmacyCount + readyPharmacyCount} Resep`,
      activeColor: 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-300/60',
      inactiveColor: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
    }
  ];

  return (
    <div className={`bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white border border-slate-700 shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-700/80 mb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Alur Pelayanan Pasien Puskesmas (3 Tahap Terintegrasi)</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Navigasi Alur Terusan: Loket ➔ Dokter ➔ Apoteker Farmasi
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="hidden sm:inline text-[11px] text-slate-400">Klik tahap untuk beralih menu:</span>
          <span className="px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-[11px] font-bold text-emerald-300">
            ✓ {completedTotalCount} Pasien Selesai Total
          </span>
        </div>
      </div>

      {/* 3 Step Interactive Workflow Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        {stages.map((st, index) => {
          const Icon = st.icon;
          const isActive = currentStage === st.id;

          return (
            <div key={st.id} className="relative flex items-center">
              <button
                onClick={() => onSelectStage(st.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                  isActive
                    ? st.activeColor
                    : 'bg-slate-800/80 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {st.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-extrabold text-xs tracking-tight">{st.name}</span>
                    </div>
                    <p className={`text-[10px] mt-0.5 leading-tight ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                      {st.sublabel}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-slate-900 font-extrabold' : 'bg-slate-700 text-emerald-400'
                  }`}>
                    {st.badge}
                  </span>
                  {isActive && (
                    <span className="text-[9px] font-black uppercase text-emerald-200 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                      Aktif
                    </span>
                  )}
                </div>
              </button>

              {/* Arrow Connector on desktop between buttons */}
              {index < stages.length - 1 && (
                <div className="hidden md:flex absolute -right-2.5 z-10 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 items-center justify-center text-slate-400">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
