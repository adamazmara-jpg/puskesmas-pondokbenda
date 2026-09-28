import React, { useState } from 'react';
import {
  Stethoscope,
  Smile,
  HeartPulse,
  Baby,
  UserCheck,
  Activity,
  TestTube,
  Pill,
  Clock,
  MapPin,
  FileCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { PoliService } from '../types';

interface LayananPoliProps {
  polis: PoliService[];
  setActiveTab: (tab: string) => void;
}

export const LayananPoli: React.FC<LayananPoliProps> = ({
  polis,
  setActiveTab,
}) => {
  const [expandedPoliId, setExpandedPoliId] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-emerald-600" />;
      case 'Smile': return <Smile className="w-6 h-6 text-teal-600" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'Baby': return <Baby className="w-6 h-6 text-amber-600" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-sky-600" />;
      case 'Activity': return <Activity className="w-6 h-6 text-indigo-600" />;
      case 'TestTube': return <TestTube className="w-6 h-6 text-purple-600" />;
      case 'Pills':
      case 'Pill': return <Pill className="w-6 h-6 text-emerald-600" />;
      default: return <Stethoscope className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Fasilitas Pelayanan Kesehatan Lengkap</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Poliklinik & Layanan Kesehatan Pasien
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
          Puskesmas Pondok Benda menyediakan berbagai unit pelayanan kesehatan komprehensif mulai dari promotor, preventif, kuratif hingga rehabilitatif.
        </p>
      </div>

      {/* Grid of Polis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polis.map((p) => {
          const isExpanded = expandedPoliId === p.id;

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    {getIcon(p.iconName)}
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-900 text-emerald-100 font-extrabold text-xs rounded-lg font-mono">
                    Kode Poli [{p.code}]
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Ruangan: {p.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{p.operatingHours}</span>
                  </div>
                </div>

                {/* Expandable Extra Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 text-xs animate-fadeIn">
                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block">Dokter / PJP:</span>
                      <span className="text-slate-600">{p.doctorName}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 block">Persyaratan Dokumen:</span>
                      <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                        {p.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 font-medium">
                      <span className="font-bold">Biaya / Retribusi: </span>
                      <span>{p.feeGeneral}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setExpandedPoliId(isExpanded ? null : p.id)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <span>{isExpanded ? 'Sembunyikan Rincian' : 'Rincian Persyaratan'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setActiveTab('pendaftaran')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition"
                >
                  Ambil Antrean
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
