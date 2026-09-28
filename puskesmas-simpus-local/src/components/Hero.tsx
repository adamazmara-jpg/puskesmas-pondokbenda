import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Search,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  ClipboardList,
  Activity,
  Users
} from 'lucide-react';
import { PoliService } from '../types';

interface HeroProps {
  polis: PoliService[];
  setActiveTab: (tab: string) => void;
  onSearchTicket: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  polis,
  setActiveTab,
  onSearchTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchTicket(searchQuery.trim());
      setActiveTab('antrean');
    }
  };

  return (
    <section className="bg-gradient-to-b from-emerald-50/40 via-white to-white border-b border-slate-100 pt-8 sm:pt-12 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Hero Layout: Left Content & Right Floating Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Badges, CTAs, Address */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* Status Pill Badge */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Jam Pelayanan: Senin–Kamis 08.00–14.00 WIB · Jumat 08.00–11.30 WIB · Sabtu 08.00–12.30 WIB</span>
              </div>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Kesehatan Anda,<br />
              <span className="text-emerald-600">Prioritas Kami</span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Pelayanan kesehatan yang cepat, ramah, dan profesional untuk seluruh keluarga Pondok Benda.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('pendaftaran')}
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-sm sm:text-base transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                <span>Daftar Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('layanan')}
                className="px-7 py-3.5 bg-slate-100/90 hover:bg-slate-200/90 text-slate-800 font-medium rounded-full text-sm sm:text-base border border-slate-200/80 transition"
              >
                Lihat Layanan
              </button>
            </div>

            {/* Location Line */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium pt-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Jl. Benda Barat XIV A, Pd. Benda, Kec. Pamulang, Kota Tangerang Selatan, Banten 15416</span>
            </div>

          </div>

          {/* Right Column: Floating "Cek Antrean Anda" Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-5">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Cek Antrean Anda
                  </h3>
                  <p className="text-xs text-slate-500">Masukkan NIK atau nomor antrean</p>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="NIK / No. Antrean"
                    className="w-full px-4 py-2.5 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 sm:w-11 sm:h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shrink-0 transition shadow-sm"
                    title="Cari Status Antrean"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('antrean')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition inline-flex items-center gap-1"
                >
                  <span>Cek antrean lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

