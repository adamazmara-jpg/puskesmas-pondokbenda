import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  User
} from 'lucide-react';
import { DoctorSchedule } from '../types';

interface JadwalDokterProps {
  doctors: DoctorSchedule[];
  setActiveTab: (tab: string) => void;
}

export const JadwalDokter: React.FC<JadwalDokterProps> = ({
  doctors,
  setActiveTab,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [selectedKlaster, setSelectedKlaster] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const daysList = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchDay = selectedDay === 'Semua' || doc.days.includes(selectedDay);
    const matchKlaster = selectedKlaster === 'all' || (doc.klasterNumber || 3) === selectedKlaster;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      doc.doctorName.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.poliName.toLowerCase().includes(q) ||
      (doc.klasterName && doc.klasterName.toLowerCase().includes(q));

    return matchDay && matchKlaster && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-200">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          <span>Integrasi Layanan Primer (ILP) • Puskesmas Pondok Benda</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Jadwal & Tim Dokter Berdasarkan Klaster
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
          Lihat jadwal operasional praktik tenaga medis Puskesmas Pondok Benda yang terbagi ke dalam 5 Klaster ILP (Klaster 1 Manajemen s/d Klaster 4 P2M & Lintas Klaster).
        </p>
      </div>

      {/* Klaster Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { key: 'all' as const, label: 'Semua Klaster' },
          { key: 1, label: 'Klaster 1 (Manajemen)' },
          { key: 2, label: 'Klaster 2 (Ibu & Anak)' },
          { key: 3, label: 'Klaster 3 (Dewasa & Lansia)' },
          { key: 4, label: 'Klaster 4 (P2M & TB)' },
          { key: 5, label: 'Lintas Klaster (Gigi/UGD)' },
        ].map((k) => {
          const isActive = selectedKlaster === k.key;
          return (
            <button
              key={k.key.toString()}
              onClick={() => setSelectedKlaster(k.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {k.label}
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Day Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full lg:w-auto pb-1 sm:pb-0">
            {daysList.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedDay === day
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dokter, poli, klaster..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Doctors Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => {
          const klasterNum = doc.klasterNumber || 3;
          const klasterBadgeStyle =
            klasterNum === 1 ? 'bg-blue-100 text-blue-900 border-blue-300' :
            klasterNum === 2 ? 'bg-pink-100 text-pink-900 border-pink-300' :
            klasterNum === 3 ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
            klasterNum === 4 ? 'bg-amber-100 text-amber-900 border-amber-300' :
            'bg-purple-100 text-purple-900 border-purple-300';

          const avatarBg =
            klasterNum === 1 ? 'bg-blue-50 border-blue-200 text-blue-700' :
            klasterNum === 2 ? 'bg-pink-50 border-pink-200 text-pink-700' :
            klasterNum === 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            klasterNum === 4 ? 'bg-amber-50 border-amber-200 text-amber-700' :
            'bg-purple-50 border-purple-200 text-purple-700';

          const avatarIconColor =
            klasterNum === 1 ? 'text-blue-600' :
            klasterNum === 2 ? 'text-pink-600' :
            klasterNum === 3 ? 'text-emerald-600' :
            klasterNum === 4 ? 'text-amber-600' :
            'text-purple-600';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between hover:border-emerald-400"
            >
              <div className="p-6 space-y-4">
                {/* Klaster Tag & Status */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${klasterBadgeStyle}`}>
                    {doc.klasterName ? doc.klasterName.split(':')[0] : `Klaster ${klasterNum}`}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    doc.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                    doc.status === 'Pengganti' ? 'bg-blue-100 text-blue-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  {doc.photoUrl ? (
                    <img
                      src={doc.photoUrl}
                      alt={doc.doctorName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shrink-0 bg-slate-100 shadow-2xs"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-2xl border-2 shrink-0 flex items-center justify-center shadow-2xs ${avatarBg}`}>
                      <User className={`w-8 h-8 ${avatarIconColor}`} />
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded">
                      {doc.poliName}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                      {doc.doctorName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{doc.specialty}</p>
                    {doc.room && (
                      <p className="text-[11px] text-teal-700 font-semibold">{doc.room}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hari Praktik:</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {Array.isArray(doc.days) ? doc.days.join(', ') : doc.days}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Jam Layanan:</span>
                    </span>
                    <span className="font-bold text-slate-900">{doc.hours}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kuota Pasien:</span>
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {doc.quotaPerDay} Pasien / Hari
                    </span>
                  </div>

                  {/* Status Ketersediaan Berdasarkan Daftar Hadir Dokter */}
                  <div className="mt-3 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Presensi Harian:</span>
                      </span>
                      {doc.status === 'Hadir' ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md border border-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          <span>HADIR & AKTIF</span>
                        </span>
                      ) : doc.status === 'Pengganti' ? (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded-md border border-blue-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          <span>DOKTER PENGGANTI</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-extrabold text-[10px] rounded-md border border-rose-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                          <span>SEDANG CUTI</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-600 leading-tight">
                      {doc.status === 'Hadir'
                        ? `Dokter terverifikasi HADIR di poli. Kuota ${doc.quotaPerDay} pasien per hari siap melayani pasien.`
                        : doc.status === 'Pengganti'
                        ? `Pelayanan poli tetap buka dan dilayani oleh dokter pengganti yang bertugas.`
                        : `Dokter sedang berhalangan/cuti. Silakan mendaftar pada hari praktik berikutnya.`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Status: {doc.status}</span>
                </span>

                <button
                  onClick={() => setActiveTab('pendaftaran')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
                >
                  Daftar Poli Ini
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
