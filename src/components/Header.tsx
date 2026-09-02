import React, { useState, useRef, useEffect } from 'react';
import {
  PhoneCall,
  Lock,
  Clock,
  Search,
  X,
  Stethoscope,
  UserCheck,
  FileText,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Menu,
  Award,
  Info,
  Newspaper,
  ListOrdered
} from 'lucide-react';
import { PuskesmasLogo } from './PuskesmasLogo';
import { PoliService, DoctorSchedule, HealthArticle } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  onOpenQuickTicket: () => void;
  polis?: PoliService[];
  doctors?: DoctorSchedule[];
  articles?: HealthArticle[];
  onSelectInfoSubsection?: (subsectionId: string) => void;
  onSelectBeritaCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
  onOpenQuickTicket,
  polis = [],
  doctors = [],
  articles = [],
  onSelectInfoSubsection,
  onSelectBeritaCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isBeritaOpen, setIsBeritaOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const beritaRef = useRef<HTMLDivElement>(null);

  const INFORMASI_DROPDOWN_ITEMS = [
    { id: 'standar-pelayanan', label: 'Standar Pelayanan Publik', tab: 'informasi' },
    { id: 'antrian-live', label: 'Informasi Antrian Live', tab: 'antrean' },
    { id: 'persyaratan-poli', label: 'Persyaratan Daftar Poliklinik', tab: 'informasi' },
    { id: 'pendaftaran-perjanjian', label: 'Pendaftaran Melalui Perjanjian', tab: 'informasi' },
    { id: 'pendaftaran-online', label: 'Pendaftaran Online', tab: 'pendaftaran' },
    { id: 'cara-daftar-website', label: 'Cara Daftar Online Via Website', tab: 'informasi' },
    { id: 'alur-pendaftaran', label: 'Alur Pendaftaran Online', tab: 'informasi' },
    { id: 'cara-daftar-wa', label: 'Cara Daftar Via Whatsapp', tab: 'informasi' },
    { id: 'survei-ikm', label: 'Survei Kepuasan Masyarakat (IKM)', tab: 'survei' },
  ];

  const BERITA_DROPDOWN_ITEMS = [
    { id: 'berita-utama', label: 'Berita Puskesmas Pondok Benda', category: 'Semua', tab: 'berita' },
    { id: 'artikel-kesehatan', label: 'Artikel & Tips Kesehatan', category: 'Tips Kesehatan', tab: 'berita' },
    { id: 'video-simulasi', label: 'Video Edukasi & Simulasi', category: 'Video Edukasi', tab: 'berita' },
    { id: 'pengumuman-resmi', label: 'Pengumuman Resmi', category: 'Pengumuman', tab: 'berita' },
  ];

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setIsInfoOpen(false);
      }
      if (beritaRef.current && !beritaRef.current.contains(e.target as Node)) {
        setIsBeritaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search filtering
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const matchedPolis = trimmedQuery.length > 0
    ? polis.filter(p => p.name.toLowerCase().includes(trimmedQuery) || p.description.toLowerCase().includes(trimmedQuery))
    : [];

  const matchedDoctors = trimmedQuery.length > 0
    ? doctors.filter(d => d.doctorName.toLowerCase().includes(trimmedQuery) || d.poliName.toLowerCase().includes(trimmedQuery) || d.specialty.toLowerCase().includes(trimmedQuery))
    : [];

  const matchedArticles = trimmedQuery.length > 0
    ? articles.filter(a => a.title.toLowerCase().includes(trimmedQuery) || a.snippet.toLowerCase().includes(trimmedQuery) || a.category.toLowerCase().includes(trimmedQuery))
    : [];

  const totalMatches = matchedPolis.length + matchedDoctors.length + matchedArticles.length;

  const handleInfoItemClick = (item: typeof INFORMASI_DROPDOWN_ITEMS[0]) => {
    setIsInfoOpen(false);
    setIsMobileMenuOpen(false);
    if (item.id === 'survei-ikm') {
      setActiveTab('survei');
    } else if (item.id === 'pendaftaran-online') {
      setActiveTab('pendaftaran');
    } else if (item.id === 'antrian-live') {
      setActiveTab('antrean');
    } else {
      if (onSelectInfoSubsection) {
        onSelectInfoSubsection(item.id);
      } else {
        setActiveTab('informasi');
      }
    }
  };

  const handleBeritaItemClick = (item: typeof BERITA_DROPDOWN_ITEMS[0]) => {
    setIsBeritaOpen(false);
    setIsMobileMenuOpen(false);
    if (onSelectBeritaCategory) {
      onSelectBeritaCategory(item.category);
    } else {
      setActiveTab('berita');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Info Bar */}
      <div className="bg-emerald-900 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium truncate">
            <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="truncate">Puskesmas Pondok Benda Tangsel | Jam Pelayanan: 08.00 - 14.00 WIB</span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            <a
              href="tel:082311366261"
              className="hidden sm:flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-950 text-emerald-100 px-3 py-0.5 rounded-md font-semibold transition"
            >
              <PhoneCall className="w-3 h-3 text-emerald-300" />
              <span>Call Center / WA: 082311366261</span>
            </a>

            {/* Discreet Staff & Admin Login Trigger */}
            <button
              onClick={() => {
                setIsAdminMode(true);
                setActiveTab('petugas');
              }}
              className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 hover:text-white rounded-md text-[11px] font-bold transition border border-emerald-800/80"
              title="Portal Khusus Login Internal Staff / Petugas Loket"
            >
              <Lock className="w-3 h-3 text-amber-300" />
              <span>Login Staff / Petugas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand */}
          <div
            onClick={() => {
              setActiveTab('beranda');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <PuskesmasLogo className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 transition-transform group-hover:scale-105 drop-shadow-xs" />

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Dinas Kesehatan Kota Tangerang Selatan
              </span>
              <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 leading-tight">
                PUSKESMAS PONDOK BENDA
              </h1>
            </div>
          </div>

          {/* GLOBAL SEARCH BAR - Desktop */}
          <div className="hidden md:block relative flex-1 max-w-md w-full" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Cari artikel kesehatan, layanan poli, atau jadwal dokter..."
                className="w-full pl-10 pr-9 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Desktop Search Overlay */}
            {isSearchOpen && trimmedQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
                {totalMatches === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Tidak ditemukan hasil untuk "{searchQuery}"
                  </div>
                ) : (
                  <div className="p-3 space-y-3">
                    {matchedPolis.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider mb-1.5 px-1 flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" /> Poliklinik & Layanan ({matchedPolis.length})
                        </div>
                        <div className="space-y-1">
                          {matchedPolis.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setActiveTab('layanan');
                                setIsSearchOpen(false);
                              }}
                              className="w-full text-left p-2 hover:bg-emerald-50 rounded-lg transition text-xs font-semibold text-slate-800 flex items-center justify-between"
                            >
                              <span>{p.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchedDoctors.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold uppercase text-amber-700 tracking-wider mb-1.5 px-1 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> Dokter & Tenaga Medis ({matchedDoctors.length})
                        </div>
                        <div className="space-y-1">
                          {matchedDoctors.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => {
                                setActiveTab('jadwal');
                                setIsSearchOpen(false);
                              }}
                              className="w-full text-left p-2 hover:bg-amber-50 rounded-lg transition text-xs font-semibold text-slate-800 flex items-center justify-between"
                            >
                              <div>
                                <span className="block font-bold">{d.doctorName}</span>
                                <span className="text-[10px] text-slate-500">{d.poliName} • {d.specialty}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchedArticles.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold uppercase text-blue-700 tracking-wider mb-1.5 px-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Artikel & Edukasi ({matchedArticles.length})
                        </div>
                        <div className="space-y-1">
                          {matchedArticles.map((a) => (
                            <button
                              key={a.id}
                              onClick={() => {
                                setActiveTab('berita');
                                setIsSearchOpen(false);
                              }}
                              className="w-full text-left p-2 hover:bg-blue-50 rounded-lg transition text-xs font-semibold text-slate-800 flex items-center justify-between"
                            >
                              <span className="truncate pr-2">{a.title}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pendaftaran')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition shadow-xs flex items-center gap-1.5"
            >
              <span>Daftar Online</span>
            </button>
          </div>

          {/* Hamburger Menu Toggle Button - Mobile Only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-slate-200 transition flex items-center justify-center shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-emerald-800" />
            ) : (
              <Menu className="w-6 h-6 text-slate-800" />
            )}
          </button>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex mt-3 pt-2.5 border-t border-slate-100 items-center gap-1.5">
          
          {/* Beranda */}
          <button
            onClick={() => setActiveTab('beranda')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'beranda'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>

          {/* Jadwal Dokter */}
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'jadwal'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Jadwal Dokter
          </button>

          {/* Berita & Artikel ▾ Dropdown */}
          <div className="relative" ref={beritaRef}>
            <button
              onClick={() => {
                setIsBeritaOpen(!isBeritaOpen);
                setIsInfoOpen(false);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === 'berita'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Berita & Artikel</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isBeritaOpen ? 'rotate-180' : ''}`} />
            </button>

            {isBeritaOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Newspaper className="w-3 h-3 text-emerald-600" />
                  <span>Kategori Berita & Edukasi</span>
                </div>
                {BERITA_DROPDOWN_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleBeritaItemClick(item)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-semibold text-slate-700 transition flex items-center justify-between border-b border-slate-100 last:border-b-0"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informasi ▾ Dropdown (Matching Screenshot Design) */}
          <div className="relative" ref={infoRef}>
            <button
              onClick={() => {
                setIsInfoOpen(!isInfoOpen);
                setIsBeritaOpen(false);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === 'informasi'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Informasi</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isInfoOpen ? 'rotate-180' : ''}`} />
            </button>

            {isInfoOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn max-h-[75vh] overflow-y-auto">
                <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Info className="w-3 h-3 text-emerald-600" />
                  <span>Informasi Pelayanan Publik</span>
                </div>
                {INFORMASI_DROPDOWN_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleInfoItemClick(item)}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-teal-700 text-xs font-semibold text-slate-700 transition flex items-center justify-between border-b border-slate-100 last:border-b-0"
                  >
                    <span className={item.id === 'survei-ikm' ? 'text-emerald-700 font-bold' : ''}>
                      {item.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Poli & Layanan */}
          <button
            onClick={() => setActiveTab('layanan')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'layanan'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Poli dan Layanan
          </button>

          {/* Kontak & Lokasi */}
          <button
            onClick={() => setActiveTab('kontak')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === 'kontak'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Kontak dan Lokasi
          </button>

        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 space-y-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
            
            {/* Mobile Search Bar */}
            <div className="relative" ref={searchRef}>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  placeholder="Cari artikel, layanan poli, dokter..."
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Nav Links */}
            <div className="grid grid-cols-1 gap-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider px-2 py-1">
                Menu Utama Portal
              </span>
              
              <button
                onClick={() => { setActiveTab('beranda'); setIsMobileMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between text-slate-700 hover:bg-slate-200"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('jadwal'); setIsMobileMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between text-slate-700 hover:bg-slate-200"
              >
                <span>Jadwal Dokter</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('berita'); setIsMobileMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between text-slate-700 hover:bg-slate-200"
              >
                <span>Berita & Artikel</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('informasi'); setIsMobileMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between text-slate-700 hover:bg-slate-200"
              >
                <span>Informasi</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('layanan'); setIsMobileMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between text-slate-700 hover:bg-slate-200"
              >
                <span>Poli dan Layanan</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab('kontak'); setIsMobileMenuOpen(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between text-slate-700 hover:bg-slate-200"
              >
                <span>Kontak dan Lokasi</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Mobile Information Sub-items List */}
            <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider block px-1">
                Sub-Menu Informasi
              </span>
              {INFORMASI_DROPDOWN_ITEMS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleInfoItemClick(sub)}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:text-emerald-800 transition flex items-center justify-between"
                >
                  <span>• {sub.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              ))}
            </div>

            {/* Mobile Quick Actions */}
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab('pendaftaran');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl text-center shadow-xs"
              >
                Pendaftaran Antrean Online
              </button>

              <button
                onClick={() => {
                  onOpenQuickTicket();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-extrabold rounded-xl text-center"
              >
                Cek / Cetak Tiket Saya
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
