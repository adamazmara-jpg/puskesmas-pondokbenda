import React, { useState, useEffect } from 'react';
import {
  Volume2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Activity,
  Users,
  BellRing,
  AlertCircle,
  Play,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { PoliService, QueueTicket } from '../types';

interface AntreanRealtimeProps {
  polis: PoliService[];
  tickets: QueueTicket[];
  onRefresh: () => void;
  searchFilterQuery?: string;
}

export const AntreanRealtime: React.FC<AntreanRealtimeProps> = ({
  polis,
  tickets,
  onRefresh,
  searchFilterQuery = '',
}) => {
  const [selectedPoliId, setSelectedPoliId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(searchFilterQuery);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastCalled, setLastCalled] = useState<QueueTicket | null>(null);

  const [sortBy, setSortBy] = useState<'queue_asc' | 'created_desc' | 'status'>('queue_asc');
  const [statusTab, setStatusTab] = useState<'active' | 'completed' | 'all'>('all');

  useEffect(() => {
    if (searchFilterQuery) {
      setSearchQuery(searchFilterQuery);
    }
  }, [searchFilterQuery]);

  // Speech synthesis chime helper
  const speakQueueNumber = (ticket: QueueTicket) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const text = `Panggilan antrean. Nomor antrean ${ticket.queueNumber.replace('-', ' ')}, atas nama Bapak atau Ibu ${ticket.fullName}, silakan menuju ke ${ticket.poliName}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log('Speech synthesis error:', e);
    }
  };

  const getQueueNumVal = (qNum: string): number => {
    const parts = qNum.split('-');
    if (parts.length === 2) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num)) return num;
    }
    return 0;
  };

  const formatJamDaftar = (dateStr?: string): string => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    } catch {
      return dateStr;
    }
  };

  // Base filter by Poli and Search Query
  const baseFiltered = tickets.filter((t) => {
    const matchPoli = selectedPoliId === 'all' || t.poliId === selectedPoliId;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      t.queueNumber.toLowerCase().includes(q) ||
      t.nik.includes(q) ||
      t.fullName.toLowerCase().includes(q) ||
      t.phone.includes(q);

    return matchPoli && matchSearch;
  });

  const activeTicketsCount = baseFiltered.filter(t => t.status === 'Waiting' || t.status === 'Called').length;
  const completedTicketsCount = baseFiltered.filter(t => t.status === 'Completed' || t.status === 'Cancelled').length;

  const displayTickets = baseFiltered
    .filter((t) => {
      if (statusTab === 'active') return t.status === 'Waiting' || t.status === 'Called';
      if (statusTab === 'completed') return t.status === 'Completed' || t.status === 'Cancelled';
      return true; // 'all'
    })
    .sort((a, b) => {
      if (sortBy === 'queue_asc') {
        const numA = getQueueNumVal(a.queueNumber);
        const numB = getQueueNumVal(b.queueNumber);
        if (numA !== numB) return numA - numB;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'created_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const statusOrder: Record<string, number> = { Called: 1, Waiting: 2, Completed: 3, Cancelled: 4 };
        return (statusOrder[a.status] || 9) - (statusOrder[b.status] || 9);
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Monitor Antrean Real-Time Puskesmas Pondok Benda</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Status Antrean Poliklinik Hari Ini
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Pantau pergerakan panggilan nomor antrean secara langsung dari HP Anda tanpa perlu berdesakan di ruang tunggu.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>Suara Panggilan: {soundEnabled ? 'Aktif' : 'Mati'}</span>
          </button>

          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Perbarui Data</span>
          </button>
        </div>
      </div>

      {/* Grid Status Per Poli Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {polis.map((p) => {
          // find active ticket for this poli
          const activeTicket = tickets.find(
            (t) => t.poliId === p.id && t.status === 'Called'
          );

          const waitingCount = tickets.filter(
            (t) => t.poliId === p.id && t.status === 'Waiting'
          ).length;

          return (
            <div
              key={p.id}
              onClick={() => setSelectedPoliId(p.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                selectedPoliId === p.id
                  ? 'bg-emerald-700 text-white border-emerald-600 shadow-md'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-400 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedPoliId === p.id
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  Poli {p.code}
                </span>

                <div className={`flex items-center gap-1 text-[11px] font-medium ${selectedPoliId === p.id ? 'text-emerald-100' : 'text-slate-500'}`}>
                  <Users className="w-3.5 h-3.5" />
                  <span>{waitingCount} sisa</span>
                </div>
              </div>

              <h3 className="font-bold text-sm truncate">{p.name}</h3>
              <p
                className={`text-[11px] truncate mt-0.5 ${
                  selectedPoliId === p.id ? 'text-emerald-100' : 'text-slate-500'
                }`}
              >
                {p.doctorName}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/30 flex items-baseline justify-between">
                <div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider block ${
                      selectedPoliId === p.id ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    Nomor Dipanggil
                  </span>
                  <div
                    className={`text-3xl font-extrabold font-mono tracking-tight ${
                      selectedPoliId === p.id ? 'text-white' : 'text-emerald-700'
                    }`}
                  >
                    {activeTicket ? activeTicket.queueNumber : p.activeQueueNumber || '-'}
                  </div>
                </div>

                {activeTicket && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakQueueNumber(activeTicket);
                    }}
                    title="Panggil ulang suara antrean"
                    className="p-2 bg-white text-emerald-800 rounded-lg hover:bg-emerald-50 transition shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Poli Dropdown Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedPoliId}
              onChange={(e) => setSelectedPoliId(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Poliklinik (8 Poli)</option>
              {polis.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.code}] {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-64 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="queue_asc">Urutan Nomor Antrean (A-001 → A-002 → A-003)</option>
              <option value="created_desc">Pendaftaran Terbaru (Paling Atas)</option>
              <option value="status">Status (Dipanggil → Menunggu → Selesai)</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari NIK, Nama, atau No. Tiket..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Reset
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Dynamic Queue Shift Info Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-950 shadow-2xs">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-emerald-900 text-sm">
            Pergerakan Antrean Otomatis & Terstruktur Hari Ini
          </p>
          <p className="text-emerald-800 leading-relaxed">
            Pasien yang telah <strong>Selesai dilayani</strong> otomatis dipindahkan ke tab "Selesai Dilayani".
            Dengan demikian, urutan antrean aktif (misalnya nomor 11) akan <strong>otomatis naik ke nomor 10</strong>, nomor 12 naik ke nomor 11, dan seterusnya secara berurutan real-time.
          </p>
        </div>
      </div>

      {/* Live Patient Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        
        {/* Table Header & View Tabs */}
        <div className="bg-emerald-900 p-4 text-white space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <BellRing className="w-4 h-4 text-emerald-200" />
              <span>Daftar Pasien Terdaftar Hari Ini ({displayTickets.length} Pasien Ditampilkan)</span>
            </div>

            <span className="text-[11px] text-emerald-100 font-medium bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-700/60">
              Pengurutan: {sortBy === 'queue_asc' ? 'Nomor Antrean (A-001, A-002, dst)' : sortBy === 'created_desc' ? 'Pendaftaran Terbaru' : 'Berdasarkan Status'}
            </span>
          </div>

          {/* Status View Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-800/80">
            <button
              type="button"
              onClick={() => setStatusTab('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                statusTab === 'active'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Antrean Aktif (Dipanggil & Menunggu)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${statusTab === 'active' ? 'bg-slate-950 text-amber-400' : 'bg-emerald-950 text-emerald-200'}`}>
                {activeTicketsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                statusTab === 'completed'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Selesai Dilayani / Riwayat</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${statusTab === 'completed' ? 'bg-slate-950 text-amber-400' : 'bg-emerald-950 text-emerald-200'}`}>
                {completedTicketsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                statusTab === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Semua Pendaftaran Hari Ini</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${statusTab === 'all' ? 'bg-slate-950 text-amber-400' : 'bg-emerald-950 text-emerald-200'}`}>
                {baseFiltered.length}
              </span>
            </button>
          </div>
        </div>

        {displayTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3 bg-slate-50/50">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">
                {statusTab === 'active'
                  ? 'Tidak Ada Antrean Aktif Saat Ini'
                  : statusTab === 'completed'
                  ? 'Belum Ada Pasien Selesai Dilayani'
                  : 'Belum Ada Antrean Terdaftar Hari Ini'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {statusTab === 'active'
                  ? 'Semua pasien terdaftar telah selesai dilayani atau belum ada pendaftaran baru.'
                  : 'Nomor antrean akan muncul secara otomatis di sini setelah pendaftaran pasien.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-4 text-center w-20">Urutan</th>
                  <th className="p-4">No. Antrean</th>
                  <th className="p-4">Jam Didaftarkan</th>
                  <th className="p-4">Nama Pasien & NIK</th>
                  <th className="p-4">Poli Tujuan</th>
                  <th className="p-4">Jenis Pasien</th>
                  <th className="p-4">Sesi Waktu</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {displayTickets.map((t, idx) => {
                  const isCalled = t.status === 'Called';
                  const isWaiting = t.status === 'Waiting';
                  const isCompleted = t.status === 'Completed';
                  
                  const qNumVal = getQueueNumVal(t.queueNumber);
                  const posIndex = qNumVal > 0 ? qNumVal : (idx + 1);

                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isCalled ? 'bg-amber-50/80 font-bold' : ''
                      }`}
                    >
                      {/* Urutan Posisi dalam Daftar */}
                      <td className="p-4 text-center font-extrabold text-slate-800">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-mono text-xs font-black shadow-2xs ${
                          posIndex === 1
                            ? 'bg-amber-400 text-slate-950 border border-amber-500 ring-2 ring-amber-200'
                            : posIndex <= 3
                            ? 'bg-emerald-600 text-white border border-emerald-700'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          No. {posIndex}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-sm font-black font-mono ${
                            isCalled
                              ? 'bg-amber-400 text-slate-950 border border-amber-500 animate-pulse'
                              : isWaiting
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {t.queueNumber}
                        </span>
                      </td>

                      <td className="p-4 text-xs font-semibold text-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{formatJamDaftar(t.createdAt)}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">{t.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          NIK: {t.nik.length >= 16 ? `${t.nik.substring(0, 6)}******${t.nik.substring(12)}` : t.nik}
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-700">{t.poliName}</td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.patientType === 'BPJS'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {t.patientType}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600 text-xs">{t.timeSlot}</td>

                      <td className="p-4">
                        {isCalled && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black animate-pulse">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Sedang Dipanggil!</span>
                          </span>
                        )}
                        {isWaiting && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Menunggu</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Selesai</span>
                          </span>
                        )}
                        {t.status === 'Cancelled' && (
                          <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full text-xs font-medium">
                            Dibatalkan
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => speakQueueNumber(t)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
                        >
                          🔊 Tes Suara
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
