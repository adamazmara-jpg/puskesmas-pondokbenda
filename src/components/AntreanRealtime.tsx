import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Activity,
  Users,
  AlertCircle,
  Sparkles,
  BellRing,
  Bell,
  Volume2,
  VolumeX,
  Megaphone,
  CheckCircle2,
  ArrowRight,
  Hourglass,
  ShieldCheck,
  X,
  FileText,
  ChevronRight,
  UserCheck,
  Play,
  Volume1,
  HelpCircle,
  Flame,
  Radio
} from 'lucide-react';
import { PoliService, QueueTicket } from '../types';
import {
  playCallChime,
  playSpeechCall,
  requestNotificationPermission,
  isNotificationSupportedAndGranted,
  sendBrowserNotification
} from '../utils/soundAndNotification';

interface AntreanRealtimeProps {
  polis: PoliService[];
  tickets: QueueTicket[];
  onRefresh: () => void;
  searchFilterQuery?: string;
  onOpenTicketModal?: (ticket: QueueTicket) => void;
}

export const AntreanRealtime: React.FC<AntreanRealtimeProps> = ({
  polis,
  tickets,
  onRefresh,
  searchFilterQuery = '',
  onOpenTicketModal,
}) => {
  const [selectedPoliId, setSelectedPoliId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(searchFilterQuery);
  const [sortBy, setSortBy] = useState<'queue_asc' | 'created_desc' | 'status'>('queue_asc');
  const [statusTab, setStatusTab] = useState<'active' | 'completed' | 'all'>('all');

  // Notification and Sound Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(false);
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false);

  // Tracked Ticket State (For Live Countdown & Target Alert)
  const [trackedInput, setTrackedInput] = useState<string>('');
  const [trackedTicketNumber, setTrackedTicketNumber] = useState<string>(() => {
    if (searchFilterQuery) return searchFilterQuery;
    try {
      const saved = localStorage.getItem('puskesmas_my_tracked_ticket_num');
      return saved || '';
    } catch {
      return '';
    }
  });

  // Countdown timer state in seconds for tracked ticket
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);

  // Popup Alert Modal for called ticket
  const [calledAlertTicket, setCalledAlertTicket] = useState<QueueTicket | null>(null);

  // Top Toast Banner for recent broadcast call
  const [recentBroadcastCall, setRecentBroadcastCall] = useState<{
    queueNumber: string;
    poliName: string;
    doctorName?: string;
    fullName: string;
  } | null>(null);

  // Track previous status map to detect when tickets become 'Called'
  const prevTicketStatusesRef = useRef<Record<string, string>>({});
  const isFirstMountRef = useRef<boolean>(true);

  // Check notification permission on mount
  useEffect(() => {
    setHasNotificationPermission(isNotificationSupportedAndGranted());
  }, []);

  // Sync searchFilterQuery when prop changes
  useEffect(() => {
    if (searchFilterQuery) {
      setSearchQuery(searchFilterQuery);
      setTrackedTicketNumber(searchFilterQuery);
    }
  }, [searchFilterQuery]);

  // Persist tracked ticket number
  useEffect(() => {
    if (trackedTicketNumber) {
      try {
        localStorage.setItem('puskesmas_my_tracked_ticket_num', trackedTicketNumber);
      } catch (e) {}
    }
  }, [trackedTicketNumber]);

  // Helper to extract numeric queue value (e.g. "A-003" -> 3)
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

  // Find the tracked ticket
  const trackedTicket = tickets.find((t) => {
    if (!trackedTicketNumber) return false;
    const target = trackedTicketNumber.toLowerCase().trim();
    return (
      t.queueNumber.toLowerCase() === target ||
      t.nik.toLowerCase() === target ||
      t.fullName.toLowerCase() === target ||
      t.phone.toLowerCase() === target
    );
  }) || (tickets.length > 0 && trackedTicketNumber === '' ? tickets.find(t => t.status === 'Waiting' || t.status === 'Called') || tickets[0] : null);

  // Calculate queue position and estimated wait time for any ticket
  const getQueuePositionStats = (targetTicket: QueueTicket) => {
    const poliTickets = tickets.filter((t) => t.poliId === targetTicket.poliId);
    const isTargetCalled = targetTicket.status === 'Called';
    const isTargetWaiting = targetTicket.status === 'Waiting';

    if (isTargetCalled) {
      return {
        aheadCount: 0,
        statusText: 'Sedang Dipanggil',
        estimatedMinutes: 0,
        estimatedSeconds: 0,
        isCalled: true,
        isNext: false,
        positionInActive: 1,
        totalActiveInPoli: poliTickets.filter((t) => t.status === 'Waiting' || t.status === 'Called').length,
      };
    }

    if (!isTargetWaiting) {
      return {
        aheadCount: 0,
        statusText: targetTicket.status === 'Completed' ? 'Selesai' : 'Dibatalkan',
        estimatedMinutes: 0,
        estimatedSeconds: 0,
        isCalled: false,
        isNext: false,
        positionInActive: 0,
        totalActiveInPoli: 0,
      };
    }

    // Active ticket currently being examined
    const calledTicket = poliTickets.find((t) => t.status === 'Called');
    const calledBonus = calledTicket ? 1 : 0;

    // Waiting tickets ahead of targetTicket (sorted by queue number/creation)
    const waitingTickets = poliTickets
      .filter((t) => t.status === 'Waiting')
      .sort((a, b) => {
        const numA = getQueueNumVal(a.queueNumber);
        const numB = getQueueNumVal(b.queueNumber);
        if (numA !== numB) return numA - numB;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    const targetWaitingIndex = waitingTickets.findIndex((t) => t.id === targetTicket.id);
    const waitingAheadCount = targetWaitingIndex >= 0 ? targetWaitingIndex : 0;
    const totalAhead = calledBonus + waitingAheadCount;
    const isNext = totalAhead === 0;

    // Standard average consultation time is ~7 minutes (420 seconds) per patient ahead
    const estimatedMinutes = isNext ? 2 : Math.max(3, totalAhead * 7);
    const estimatedSeconds = isNext ? 120 : totalAhead * 7 * 60;

    return {
      aheadCount: totalAhead,
      statusText: isNext ? 'Giliran Berikutnya (< 2 Menit)' : `${totalAhead} Pasien di Depan`,
      estimatedMinutes,
      estimatedSeconds,
      isCalled: false,
      isNext,
      positionInActive: totalAhead + 1,
      totalActiveInPoli: (calledTicket ? 1 : 0) + waitingTickets.length,
    };
  };

  // Sync Countdown Timer whenever trackedTicket or ticket status changes
  useEffect(() => {
    if (!trackedTicket) {
      setCountdownSeconds(0);
      return;
    }

    const stats = getQueuePositionStats(trackedTicket);
    if (stats.isCalled) {
      setCountdownSeconds(0);
    } else {
      setCountdownSeconds(stats.estimatedSeconds);
    }
  }, [trackedTicket?.status, trackedTicket?.id, tickets]);

  // Live 1-second interval ticker for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Detect status change to 'Called' across all tickets
  useEffect(() => {
    if (isFirstMountRef.current) {
      // Initialize map on first mount without triggering alerts
      const initialMap: Record<string, string> = {};
      tickets.forEach((t) => {
        initialMap[t.id] = t.status;
      });
      prevTicketStatusesRef.current = initialMap;
      isFirstMountRef.current = false;
      return;
    }

    // Check for tickets whose status newly became 'Called'
    tickets.forEach((t) => {
      const prevStatus = prevTicketStatusesRef.current[t.id];
      if (prevStatus && prevStatus !== 'Called' && t.status === 'Called') {
        // A ticket was newly CALLED!
        const isMyTicket =
          trackedTicket &&
          (t.id === trackedTicket.id ||
            t.queueNumber.toLowerCase() === trackedTicket.queueNumber.toLowerCase() ||
            (trackedTicketNumber && t.queueNumber.toLowerCase() === trackedTicketNumber.toLowerCase()));

        // 1. Play chime audio if enabled
        if (soundEnabled) {
          playCallChime();
          playSpeechCall(t.queueNumber, t.poliName, t.doctorName);
        }

        // 2. Set broadcast toast banner
        setRecentBroadcastCall({
          queueNumber: t.queueNumber,
          poliName: t.poliName,
          doctorName: t.doctorName,
          fullName: t.fullName,
        });

        // 3. Send Browser Native Notification
        sendBrowserNotification(`📢 Panggilan Poli: ${t.queueNumber} (${t.fullName})`, {
          body: `Nomor antrean ${t.queueNumber} dipanggil ke ${t.poliName}! Silakan segera menuju ruangan pemeriksaan.`,
        });

        // 4. If this is the user's tracked ticket, launch the high-visibility alert modal!
        if (isMyTicket) {
          setCalledAlertTicket(t);
        }
      }
    });

    // Update reference map
    const updatedMap: Record<string, string> = {};
    tickets.forEach((t) => {
      updatedMap[t.id] = t.status;
    });
    prevTicketStatusesRef.current = updatedMap;
  }, [tickets, soundEnabled, trackedTicket, trackedTicketNumber]);

  // Request Notification Permission
  const handleEnableNotification = async () => {
    setPermissionRequested(true);
    const granted = await requestNotificationPermission();
    setHasNotificationPermission(granted);
    if (granted && soundEnabled) {
      playCallChime();
      sendBrowserNotification('🔔 Notifikasi Antrean Aktif', {
        body: 'Anda akan menerima notifikasi browser saat nomor antrean Anda dipanggil oleh dokter.',
      });
    }
  };

  // Format countdown string
  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
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

  const activeTicketsCount = baseFiltered.filter((t) => t.status === 'Waiting' || t.status === 'Called').length;
  const completedTicketsCount = baseFiltered.filter((t) => t.status === 'Completed' || t.status === 'Cancelled').length;

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

  const trackedStats = trackedTicket ? getQueuePositionStats(trackedTicket) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Broadcast Toast Banner when any ticket is called */}
      {recentBroadcastCall && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-amber-400 text-slate-950 p-4 rounded-2xl shadow-xl border-2 border-amber-500 animate-bounce flex items-start gap-3">
          <Megaphone className="w-6 h-6 text-slate-950 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded">
                Panggilan Terkini
              </span>
              <button
                onClick={() => setRecentBroadcastCall(null)}
                className="text-slate-900 hover:text-black p-1 rounded-lg hover:bg-amber-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="font-extrabold text-sm leading-snug">
              Nomor <span className="font-mono text-base font-black bg-slate-900 text-white px-2 py-0.5 rounded">{recentBroadcastCall.queueNumber}</span> dipanggil!
            </p>
            <p className="text-xs font-semibold text-slate-900">
              Pasien: {recentBroadcastCall.fullName} • {recentBroadcastCall.poliName}
            </p>
          </div>
        </div>
      )}

      {/* Page Header with Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Monitor Antrean Real-Time • Puskesmas Pondok Benda</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Status Antrean Poliklinik & Estimasi Waktu Tunggu
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Pantau hitung mundur estimasi waktu panggilan nomor antrean Anda secara langsung dengan notifikasi suara dan browser.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playCallChime();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
            title="Aktifkan/Nonaktifkan Suara Panggilan"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{soundEnabled ? 'Suara Aktif' : 'Mute'}</span>
          </button>

          {/* Test Sound Button */}
          <button
            onClick={() => {
              playCallChime();
              if (trackedTicket) {
                playSpeechCall(trackedTicket.queueNumber, trackedTicket.poliName, trackedTicket.doctorName);
              } else {
                playSpeechCall('A-001', 'Poli Pemeriksaan Umum');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200"
            title="Tes Nada Panggilan Suara"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tes Panggilan</span>
          </button>

          {/* Browser Notification Button */}
          {!hasNotificationPermission ? (
            <button
              onClick={handleEnableNotification}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black transition shadow-xs"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Izinkan Notifikasi Pop-up</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Notifikasi Aktif</span>
            </span>
          )}

          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          FEATURE 1: INTERACTIVE PATIENT TRACKER & LIVE COUNTDOWN TIMER CARD
          ========================================================================= */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
        {/* Decorative Background Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 space-y-6">
          {/* Header of Tracker */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-emerald-700/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Lacak Antrean & Hitung Mundur Estimasi Panggilan</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                {trackedTicket ? `Pelacak Tiket: ${trackedTicket.queueNumber} • ${trackedTicket.fullName}` : 'Cari & Lacak Tiket Antrean Anda'}
              </h3>
            </div>

            {/* Quick Ticket Search & Selector */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={trackedInput}
                  onChange={(e) => setTrackedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && trackedInput) {
                      setTrackedTicketNumber(trackedInput.trim());
                    }
                  }}
                  placeholder="Masukkan No. Tiket / NIK / Nama..."
                  className="w-full pl-9 pr-3 py-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-xs font-semibold text-white placeholder:text-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                onClick={() => {
                  if (trackedInput.trim()) {
                    setTrackedTicketNumber(trackedInput.trim());
                  }
                }}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition shrink-0 shadow-xs"
              >
                Lacak
              </button>
            </div>
          </div>

          {/* If Ticket Found: Display Countdown & Detailed Live Tracker */}
          {trackedTicket && trackedStats ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Big Ticket Number & Status */}
              <div className="lg:col-span-4 bg-emerald-950/60 p-6 rounded-2xl border border-emerald-700/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                    Nomor Antrean Anda
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    trackedTicket.status === 'Called'
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : trackedTicket.status === 'Waiting'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {trackedTicket.status === 'Called' ? '📢 Sedang Dipanggil' : trackedTicket.status === 'Waiting' ? '⏳ Menunggu' : 'Selesai'}
                  </span>
                </div>

                <div className="text-center py-2 bg-emerald-900/40 rounded-xl border border-emerald-600/30">
                  <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-amber-300">
                    {trackedTicket.queueNumber}
                  </div>
                  <p className="text-xs font-bold text-emerald-200 mt-1">{trackedTicket.poliName}</p>
                </div>

                <div className="text-xs space-y-1.5 text-emerald-100/90 pt-1">
                  <div className="flex justify-between">
                    <span className="text-emerald-300/80">Nama Pasien:</span>
                    <span className="font-bold text-white">{trackedTicket.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-300/80">Dokter:</span>
                    <span className="font-semibold text-white">{trackedTicket.doctorName || 'dr. Jaga Poli'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-300/80">Jam Daftar:</span>
                    <span className="font-semibold text-white">{formatJamDaftar(trackedTicket.createdAt)}</span>
                  </div>
                </div>

                {onOpenTicketModal && (
                  <button
                    onClick={() => onOpenTicketModal(trackedTicket)}
                    className="w-full py-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-emerald-600/50"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Buka E-Tiket & Barcode</span>
                  </button>
                )}
              </div>

              {/* Middle & Right Column: LIVE COUNTDOWN & ESTIMATION METRICS */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* Countdown Timer Display */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Digital Clock Box */}
                  <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-700/60 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Hitung Mundur</span>
                      </span>
                      {trackedTicket.status === 'Waiting' && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                      )}
                    </div>
                    <div className="my-2">
                      {trackedStats.isCalled ? (
                        <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight leading-none">
                          00:00
                        </div>
                      ) : (
                        <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight leading-none">
                          {formatCountdown(countdownSeconds)}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-300/80">
                      {trackedStats.isCalled
                        ? 'Giliran Anda Sedang Berlangsung'
                        : countdownSeconds > 0
                        ? 'Estimasi waktu hitung mundur'
                        : 'Harap Bersiap di Depan Poli'}
                    </span>
                  </div>

                  {/* Sisa Antrean di Depan Box */}
                  <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-700/60 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>Antrean di Depan</span>
                      </span>
                    </div>
                    <div className="my-2">
                      <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight leading-none">
                        {trackedStats.aheadCount} <span className="text-base font-bold text-emerald-200">Pasien</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-300/80">
                      {trackedStats.isCalled
                        ? 'Tidak ada antrean di depan'
                        : trackedStats.aheadCount === 0
                        ? '🔥 Anda urutan berikutnya!'
                        : `Posisi ke-${trackedStats.positionInActive} dalam antrean aktif`}
                    </span>
                  </div>

                  {/* Estimasi Jam Dipanggil Box */}
                  <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-700/60 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Hourglass className="w-4 h-4 text-teal-300" />
                        <span>Perkiraan Dipanggil</span>
                      </span>
                    </div>
                    <div className="my-2">
                      <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight leading-none">
                        {trackedStats.isCalled
                          ? 'SEKARANG'
                          : `± ${trackedStats.estimatedMinutes} Menit`}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-300/80">
                      Rata-rata 7 mnt / pasien
                    </span>
                  </div>
                </div>

                {/* Visual Step Progress Bar */}
                <div className="p-4 bg-emerald-950/50 rounded-2xl border border-emerald-700/40 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-200">
                    <span>Tahapan Alur Pelayanan Antrean:</span>
                    <span className="font-bold text-amber-300">
                      {trackedTicket.status === 'Called'
                        ? 'Langkah 3: Panggilan Dokter'
                        : trackedTicket.status === 'Waiting'
                        ? 'Langkah 2: Menunggu Giliran'
                        : 'Langkah 4: Selesai Pelayanan'}
                    </span>
                  </div>

                  {/* 4-Step Progress Line */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-[11px]">
                    {/* Step 1 */}
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-emerald-400"></div>
                      <span className="font-bold text-emerald-300 block truncate">1. Terdaftar</span>
                    </div>
                    {/* Step 2 */}
                    <div className="space-y-1.5">
                      <div className={`h-2 rounded-full ${trackedTicket.status === 'Waiting' || trackedTicket.status === 'Called' || trackedTicket.status === 'Completed' ? 'bg-emerald-400' : 'bg-emerald-900'}`}></div>
                      <span className={`font-bold block truncate ${trackedTicket.status === 'Waiting' ? 'text-amber-300 animate-pulse' : 'text-emerald-300'}`}>
                        2. Menunggu ({trackedStats.aheadCount})
                      </span>
                    </div>
                    {/* Step 3 */}
                    <div className="space-y-1.5">
                      <div className={`h-2 rounded-full ${trackedTicket.status === 'Called' ? 'bg-amber-400 animate-pulse' : trackedTicket.status === 'Completed' ? 'bg-emerald-400' : 'bg-emerald-900'}`}></div>
                      <span className={`font-bold block truncate ${trackedTicket.status === 'Called' ? 'text-amber-300 font-black' : 'text-emerald-300/60'}`}>
                        3. Dipanggil
                      </span>
                    </div>
                    {/* Step 4 */}
                    <div className="space-y-1.5">
                      <div className={`h-2 rounded-full ${trackedTicket.status === 'Completed' ? 'bg-emerald-400' : 'bg-emerald-900'}`}></div>
                      <span className={`font-bold block truncate ${trackedTicket.status === 'Completed' ? 'text-emerald-300' : 'text-emerald-300/60'}`}>
                        4. Selesai
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call Status Action Banner */}
                {trackedStats.isCalled ? (
                  <div className="p-4 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-between gap-4 font-black shadow-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <Megaphone className="w-6 h-6 shrink-0" />
                      <div>
                        <div className="text-sm uppercase tracking-wider">NOMOR ANDA SEDANG DIPANGGIL!</div>
                        <div className="text-xs font-semibold">Silakan segera masuk ke ruang pemeriksaan {trackedTicket.poliName}.</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setCalledAlertTicket(trackedTicket)}
                      className="px-4 py-2 bg-slate-950 text-amber-300 rounded-xl text-xs font-black shrink-0 hover:bg-slate-900 transition"
                    >
                      Buka Panggilan
                    </button>
                  </div>
                ) : trackedStats.isNext ? (
                  <div className="p-3.5 bg-emerald-500/30 border border-emerald-400/60 rounded-xl flex items-center gap-3 text-xs text-emerald-100">
                    <Flame className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                    <div>
                      <span className="font-bold text-white">Giliran Anda Berikutnya!</span> Harap berada di dekat pintu ruang {trackedTicket.poliName} agar segera masuk saat nomor dipanggil.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-700/30 flex items-center justify-between text-xs text-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Notifikasi aktif: Anda akan otomatis diberitahu saat nomor dipanggil.</span>
                    </span>
                    <button
                      onClick={() => playCallChime()}
                      className="text-amber-300 hover:text-amber-200 font-bold underline text-[11px]"
                    >
                      Tes Suara
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-emerald-950/40 rounded-2xl border border-emerald-700/40 space-y-3">
              <Search className="w-10 h-10 text-emerald-400/80 mx-auto" />
              <div className="space-y-1">
                <p className="font-extrabold text-base text-white">
                  Belum Ada Tiket yang Dipilih untuk Dilacak
                </p>
                <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
                  Ketik nomor tiket antrean (misal: <strong>A-003</strong>) atau NIK Anda pada kolom pencarian di atas, atau klik salah satu baris antrean pada tabel di bawah.
                </p>
              </div>
              {tickets.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs text-emerald-300 font-medium">Contoh Tiket Aktif:</span>
                  {tickets.slice(0, 4).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTrackedTicketNumber(t.queueNumber)}
                      className="px-2.5 py-1 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 rounded-lg text-xs font-mono font-bold transition border border-emerald-600/50"
                    >
                      {t.queueNumber} ({t.fullName.split(' ')[0]})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          FEATURE 2: POLIKLINIK OVERVIEW CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {polis.map((p) => {
          const activeTicket = tickets.find((t) => t.poliId === p.id && t.status === 'Called');
          const waitingCount = tickets.filter((t) => t.poliId === p.id && t.status === 'Waiting').length;

          return (
            <div
              key={p.id}
              onClick={() => setSelectedPoliId(p.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                selectedPoliId === p.id
                  ? 'bg-emerald-700 text-white border-emerald-600 shadow-md'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-400 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                    selectedPoliId === p.id
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  Poli {p.code}
                </span>

                <div
                  className={`flex items-center gap-1 text-[11px] font-medium ${
                    selectedPoliId === p.id ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          FEATURE 3: PATIENT TABLE WITH ESTIMATED WAIT TIME PER ROW
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        
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
                  <th className="p-4 text-center w-16">Urutan</th>
                  <th className="p-4">No. Antrean</th>
                  <th className="p-4">Estimasi Tunggu & Posisi</th>
                  <th className="p-4">Jam Didaftarkan</th>
                  <th className="p-4">Nama Pasien & NIK</th>
                  <th className="p-4">Poli Tujuan</th>
                  <th className="p-4">Jenis Pasien</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {displayTickets.map((t, idx) => {
                  const isCalled = t.status === 'Called';
                  const isWaiting = t.status === 'Waiting';
                  const isCompleted = t.status === 'Completed';

                  const qNumVal = getQueueNumVal(t.queueNumber);
                  const posIndex = qNumVal > 0 ? qNumVal : idx + 1;
                  const rowStats = getQueuePositionStats(t);
                  const isThisTracked = trackedTicket && trackedTicket.id === t.id;

                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50/90 transition ${
                        isCalled
                          ? 'bg-amber-50/90 font-bold border-l-4 border-amber-500'
                          : isThisTracked
                          ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                          : ''
                      }`}
                    >
                      {/* Urutan Posisi dalam Daftar */}
                      <td className="p-4 text-center font-extrabold text-slate-800">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-mono text-xs font-black shadow-2xs ${
                            posIndex === 1
                              ? 'bg-amber-400 text-slate-950 border border-amber-500 ring-2 ring-amber-200'
                              : posIndex <= 3
                              ? 'bg-emerald-600 text-white border border-emerald-700'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          No. {posIndex}
                        </span>
                      </td>

                      {/* No. Antrean Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-sm font-black font-mono ${
                            isCalled
                              ? 'bg-amber-400 text-slate-950 border border-amber-500 animate-pulse'
                              : isWaiting
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {t.queueNumber}
                        </span>
                      </td>

                      {/* Estimasi Waktu Tunggu & Posisi Live Column */}
                      <td className="p-4">
                        {isCalled ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 text-slate-950 rounded-lg text-xs font-black animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Sedang Diperiksa</span>
                          </span>
                        ) : isWaiting ? (
                          <div className="space-y-0.5">
                            {rowStats.isNext ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-black border border-amber-300">
                                <Flame className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                                <span>Giliran Berikutnya (&lt; 2 mnt)</span>
                              </span>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                <span>± {rowStats.estimatedMinutes} Menit ({rowStats.aheadCount} di depan)</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs font-medium">Selesai / Terlayani</span>
                        )}
                      </td>

                      {/* Jam Didaftarkan */}
                      <td className="p-4 text-xs font-semibold text-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{formatJamDaftar(t.createdAt)}</span>
                        </div>
                      </td>

                      {/* Pasien & NIK */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{t.fullName}</span>
                          {isThisTracked && (
                            <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-black rounded">
                              Terkait Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          NIK: {t.nik.length >= 16 ? `${t.nik.substring(0, 6)}******${t.nik.substring(12)}` : t.nik}
                        </div>
                      </td>

                      {/* Poli Tujuan */}
                      <td className="p-4 font-semibold text-slate-700">{t.poliName}</td>

                      {/* Jenis Pasien */}
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

                      {/* Status */}
                      <td className="p-4 text-center">
                        {isCalled && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black animate-pulse">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Dipanggil</span>
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

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setTrackedTicketNumber(t.queueNumber);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 rounded-lg text-xs font-bold transition border border-slate-200"
                            title="Lacak Hitung Mundur Tiket Ini"
                          >
                            Lacak
                          </button>
                          {onOpenTicketModal && (
                            <button
                              onClick={() => onOpenTicketModal(t)}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition"
                              title="Buka E-Tiket"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          FEATURE 4: POPUP ALERT MODAL WHEN TICKET IS CALLED
          ========================================================================= */}
      {calledAlertTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-amber-400 animate-in zoom-in-95 duration-200 text-slate-900">
            {/* Urgent Header */}
            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 p-6 text-slate-950 text-center space-y-2 relative">
              <button
                onClick={() => setCalledAlertTicket(null)}
                className="absolute top-4 right-4 text-slate-900 hover:text-black p-1.5 rounded-full hover:bg-amber-300/80 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-slate-950 text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <Megaphone className="w-8 h-8" />
              </div>

              <div className="inline-block px-3 py-1 bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider rounded-full">
                Panggilan Pasien Poliklinik
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                NOMOR ANTREAN DIPANGGIL!
              </h3>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              {/* Big Queue Badge */}
              <div className="text-center p-6 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300 space-y-1">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Silakan Segera Masuk Menuju Ruangan
                </span>
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-950">
                  {calledAlertTicket.queueNumber}
                </div>
                <div className="text-sm font-extrabold text-emerald-800">
                  {calledAlertTicket.poliName}
                </div>
              </div>

              {/* Patient and Room Details */}
              <div className="space-y-2.5 text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Nama Pasien:</span>
                  <span className="font-extrabold text-slate-900">{calledAlertTicket.fullName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Dokter Penanggung Jawab:</span>
                  <span className="font-bold text-slate-900">{calledAlertTicket.doctorName || 'dr. Jaga Poli'}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Jenis Pasien:</span>
                  <span className="font-bold text-emerald-700">{calledAlertTicket.patientType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status Panggilan:</span>
                  <span className="font-black text-amber-600 uppercase">Sedang Menunggu di Ruang Dokter</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Bawa kartu identitas (KTP/BPJS) dan E-Tiket Anda. Petugas medis siap melakukan pemeriksaan.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      playCallChime();
                      playSpeechCall(calledAlertTicket.queueNumber, calledAlertTicket.poliName, calledAlertTicket.doctorName);
                    }}
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-300"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>Dengar Suara</span>
                  </button>

                  {onOpenTicketModal && (
                    <button
                      onClick={() => {
                        setCalledAlertTicket(null);
                        onOpenTicketModal(calledAlertTicket);
                      }}
                      className="py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-emerald-300"
                    >
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span>Buka E-Tiket</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setCalledAlertTicket(null)}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black transition shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saya Mengerti / Menuju Ruangan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
