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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const daysList = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchDay = selectedDay === 'Semua' || doc.days.includes(selectedDay);
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      doc.doctorName.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.poliName.toLowerCase().includes(q);

    return matchDay && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tenaga Medis & Dokter Bertugas Puskesmas Pondok Benda</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Jadwal Praktik Dokter & Bidan
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
          Lihat jadwal operasional praktik dokter umum, dokter gigi, bidan KIA/KB, spesialis anak, dan analis medis di Puskesmas Pondok Benda Tangerang Selatan.
        </p>
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
              placeholder="Cari nama dokter atau poli..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Doctors Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                {doc.photoUrl ? (
                  <img
                    src={doc.photoUrl}
                    alt={doc.doctorName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shrink-0 bg-slate-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shrink-0 flex items-center justify-center text-emerald-700 shadow-2xs">
                    <User className="w-8 h-8 text-emerald-600" />
                  </div>
                )}

                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                    {doc.poliName}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    {doc.doctorName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{doc.specialty}</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hari Praktik:</span>
                  </span>
                  <span className="font-bold text-slate-900">{doc.days.join(', ')}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Jam Sesi:</span>
                  </span>
                  <span className="font-bold text-slate-900">{doc.hours}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kuota Pasien / Hari:</span>
                  </span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {doc.quotaPerDay} Pasien
                  </span>
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
        ))}
      </div>
    </div>
  );
};
