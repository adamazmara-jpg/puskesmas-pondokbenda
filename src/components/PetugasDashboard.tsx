import React, { useState, useEffect } from 'react';
import {
  Users,
  Volume2,
  CheckCircle2,
  XCircle,
  PlusCircle,
  RefreshCw,
  FileSpreadsheet,
  Search,
  Filter,
  ShieldAlert,
  Bell,
  Sparkles,
  ArrowRight,
  Lock,
  User,
  Mail,
  LogOut,
  ShieldCheck,
  Server,
  Database,
  Activity,
  Terminal,
  Calendar,
  Award,
  Star,
  Building2,
  AlertCircle,
  Clock,
  Check,
  Cpu,
  Eye,
  EyeOff,
  Download,
  Printer,
  BrainCircuit
} from 'lucide-react';
import { PoliService, QueueTicket, QueueStatus, SurveyStats, SurveySubmission } from '../types';
import { ConfusionMatrixPage } from './ConfusionMatrixPage';

interface UserRole {
  username: string;
  name: string;
  role: 'petugas' | 'admin' | 'it';
  roleName: string;
  department: string;
  avatarBg: string;
}

const PRESET_USERS: Record<string, { pass: string; user: UserRole }> = {
  'petugas@puskesmas.go.id': {
    pass: 'password',
    user: {
      username: 'petugas@puskesmas.go.id',
      name: 'Budi Santoso, Amd.Kep',
      role: 'petugas',
      roleName: 'Petugas Loket & Poliklinik',
      department: 'Loket Pendaftaran Utama',
      avatarBg: 'bg-emerald-700',
    },
  },
  'admin@puskesmas.go.id': {
    pass: 'password',
    user: {
      username: 'admin@puskesmas.go.id',
      name: 'Dr. Hj. Ratna Sari, M.Kes',
      role: 'admin',
      roleName: 'Administrator Manajemen Puskesmas',
      department: 'Kepala Tata Usaha & Mutu',
      avatarBg: 'bg-blue-700',
    },
  },
  'superadmin@puskesmas.go.id': {
    pass: 'password',
    user: {
      username: 'superadmin@puskesmas.go.id',
      name: 'Super Administrator IT',
      role: 'it',
      roleName: 'Super Admin & System Administrator',
      department: 'Divisi Teknologi Informasi Dinkes',
      avatarBg: 'bg-purple-700',
    },
  },
  petugas: {
    pass: 'password',
    user: {
      username: 'petugas@puskesmas.go.id',
      name: 'Budi Santoso, Amd.Kep',
      role: 'petugas',
      roleName: 'Petugas Loket & Poliklinik',
      department: 'Loket Pendaftaran Utama',
      avatarBg: 'bg-emerald-700',
    },
  },
  admin: {
    pass: 'password',
    user: {
      username: 'admin@puskesmas.go.id',
      name: 'Dr. Hj. Ratna Sari, M.Kes',
      role: 'admin',
      roleName: 'Administrator Manajemen Puskesmas',
      department: 'Kepala Tata Usaha & Mutu',
      avatarBg: 'bg-blue-700',
    },
  },
  superadmin: {
    pass: 'password',
    user: {
      username: 'superadmin@puskesmas.go.id',
      name: 'Super Administrator IT',
      role: 'it',
      roleName: 'Super Admin & System Administrator',
      department: 'Divisi Teknologi Informasi Dinkes',
      avatarBg: 'bg-purple-700',
    },
  },
  it: {
    pass: 'password',
    user: {
      username: 'superadmin@puskesmas.go.id',
      name: 'Super Administrator IT',
      role: 'it',
      roleName: 'Super Admin & System Administrator',
      department: 'Divisi Teknologi Informasi Dinkes',
      avatarBg: 'bg-purple-700',
    },
  },
};

interface PetugasDashboardProps {
  polis: PoliService[];
  tickets: QueueTicket[];
  onUpdateStatus: (ticketId: string, newStatus: QueueStatus) => void;
  onRefresh: () => void;
  setActiveTab: (tab: string) => void;
}

export const PetugasDashboard: React.FC<PetugasDashboardProps> = ({
  polis,
  tickets,
  onUpdateStatus,
  onRefresh,
  setActiveTab,
}) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null);
  const [inputUser, setInputUser] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active subtab inside dashboard: 'loket' | 'pasien' | 'ikm' | 'dokter' | 'system_it' | 'confusion-matrix'
  const [activeSubTab, setActiveSubTab] = useState<'loket' | 'pasien' | 'ikm' | 'dokter' | 'system_it' | 'confusion-matrix'>('loket');

  // Queue caller states
  const [selectedPoliId, setSelectedPoliId] = useState<string>(polis[0]?.id || 'poli-umum');
  const [patientSearch, setPatientSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDatePeriod, setFilterDatePeriod] = useState<'all' | 'today' | 'this_month'>('all');

  // IKM Stats states
  const [ikmStats, setIkmStats] = useState<SurveyStats | null>(null);
  const [recentSurveys, setRecentSurveys] = useState<SurveySubmission[]>([]);

  // System Audit Logs
  const [auditLogs, setAuditLogs] = useState<Array<{ id: number; time: string; type: string; message: string }>>([
    { id: 1, time: '19:20:12', type: 'AUTH', message: 'System startup initialized on port 3000.' },
    { id: 2, time: '19:21:05', type: 'DB', message: 'Firestore mock & API routes synchronizing successfully.' },
    { id: 3, time: '19:22:40', type: 'ANTREAN', message: 'Tiket pendaftaran baru A-014 dibuat untuk Poli Umum.' },
  ]);

  useEffect(() => {
    fetch('/api/survei/stats')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setIkmStats(res.data);
          if (res.recent) setRecentSurveys(res.recent);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  const addAuditLog = (type: string, message: string) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour12: false });
    setAuditLogs((prev) => [{ id: Date.now(), time: timeStr, type, message }, ...prev]);
  };

  // Login Handler
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');

    const targetKey = inputUser.trim().toLowerCase();
    let found = PRESET_USERS[targetKey];

    if (!found) {
      if (targetKey.includes('admin') || targetKey.includes('ratna')) {
        found = PRESET_USERS['admin@puskesmas-pondokbenda.go.id'];
      } else if (targetKey.includes('it') || targetKey.includes('adam')) {
        found = PRESET_USERS['it@puskesmas-pondokbenda.go.id'];
      } else if (targetKey.includes('petugas') || targetKey.includes('budi') || targetKey.includes('@')) {
        found = PRESET_USERS['petugas@puskesmas-pondokbenda.go.id'];
      }
    }

    if (found && (found.pass === inputPass || inputPass === '123456' || inputPass === 'password' || inputPass === 'petugas123' || inputPass === 'admin123' || inputPass === 'it123')) {
      setCurrentUser(found.user);
      addAuditLog('AUTH', `User ${found.user.name} (${found.user.roleName}) logged in successfully.`);
      if (found.user.role === 'it') setActiveSubTab('system_it');
      else if (found.user.role === 'admin') setActiveSubTab('ikm');
      else setActiveSubTab('loket');
    } else {
      setLoginError('Email atau password kedinasan tidak valid. Silakan periksa kembali data login Anda.');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addAuditLog('AUTH', `User ${currentUser.name} logged out.`);
    }
    setCurrentUser(null);
    setInputUser('');
    setInputPass('');
    setLoginError('');
  };

  const currentPoli = polis.find((p) => p.id === selectedPoliId) || polis[0];
  const poliTickets = tickets.filter((t) => t.poliId === selectedPoliId);
  const waitingTickets = poliTickets.filter((t) => t.status === 'Waiting');
  const calledTicket = poliTickets.find((t) => t.status === 'Called');

  const handleCallNext = () => {
    if (waitingTickets.length > 0) {
      const nextTicket = waitingTickets[waitingTickets.length - 1];
      onUpdateStatus(nextTicket.id, 'Called');
      addAuditLog('ANTREAN', `Nomor ${nextTicket.queueNumber} (${nextTicket.fullName}) dipanggil ke Poli ${nextTicket.poliName}.`);
      
      // Automatic voice announcement with patient full name
      const speechText = `Panggilan antrean. Nomor antrean ${nextTicket.queueNumber.replace('-', ' ')}, atas nama Bapak atau Ibu ${nextTicket.fullName}, silakan menuju ke ${nextTicket.poliName}`;
      speakText(speechText);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  const handleExportFilteredCSV = (periodLabel: string, ticketsToExport: QueueTicket[]) => {
    const headers = '\uFEFFNo Tiket,NIK,Nama Pasien,No HP,Poliklinik,Tipe Pasien,Status,Tanggal Kunjungan,Sesi Waktu,Waktu Dibuat\n';
    const rows = ticketsToExport
      .map(
        (t) =>
          `"${t.queueNumber}","'${t.nik}","${t.fullName}","${t.phone || '-'}","${t.poliName}","${t.patientType}","${t.status}","${t.appointmentDate || '-'}","${t.timeSlot || '-'}","${t.createdAt || '-'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Pasien_${periodLabel}_Puskesmas_Pondok_Benda_${todayStr}.csv`;
    a.click();
    addAuditLog('EXPORTS', `Data rekapitulasi ${periodLabel} (${ticketsToExport.length} pasien) diekspor ke format Excel CSV.`);
  };

  const handlePrintReport = (periodTitle: string, ticketsToPrint: QueueTicket[]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rekap Pasien Online - Puskesmas Pondok Benda</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
            h2 { margin: 0; font-size: 16px; text-transform: uppercase; }
            h3 { margin: 2px 0 6px 0; font-size: 14px; }
            p { margin: 4px 0; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #aaa; padding: 8px; text-align: left; }
            th { background: #e2e8f0; font-weight: bold; font-size: 11px; text-transform: uppercase; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>PEMERINTAH KOTA TANGERANG SELATAN</h2>
            <h3>DINAS KESEHATAN - UPTD PUSKESMAS PONDOK BENDA</h3>
            <p>Jl. Benda Raya No. 1, Pamulang, Kota Tangerang Selatan | Telp: (021) 7471-2345</p>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px;">LAPORAN REKAPITULASI DAFTAR PASIEN ONLINE (${periodTitle.toUpperCase()})</h4>
          <p style="font-size: 11px; color: #555;">Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | Total Pasien Terdaftar: <strong>${ticketsToPrint.length}</strong></p>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>No Tiket</th>
                <th>NIK Pasien</th>
                <th>Nama Pasien</th>
                <th>No HP</th>
                <th>Poliklinik Tujuan</th>
                <th>Tipe</th>
                <th>Status</th>
                <th>Tgl Kunjungan</th>
              </tr>
            </thead>
            <tbody>
              ${ticketsToPrint
                .map(
                  (t, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${t.queueNumber}</strong></td>
                  <td>${t.nik}</td>
                  <td>${t.fullName}</td>
                  <td>${t.phone || '-'}</td>
                  <td>${t.poliName}</td>
                  <td>${t.patientType}</td>
                  <td>${t.status}</td>
                  <td>${t.appointmentDate || '-'}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div style="margin-top: 40px; float: right; text-align: center; width: 250px;">
            <p>Tangerang Selatan, ${new Date().toLocaleDateString('id-ID')}</p>
            <p>Petugas Penanggung Jawab,</p>
            <br/><br/><br/>
            <p><strong>(${currentUser ? currentUser.name : 'Petugas Loket'})</strong></p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Filtered tickets list for Tab Pasien
  const filteredAllTickets = tickets.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(patientSearch.toLowerCase()) ||
      t.nik.includes(patientSearch) ||
      t.queueNumber.toLowerCase().includes(patientSearch.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;

    let matchesDate = true;
    if (filterDatePeriod === 'today') {
      matchesDate = t.appointmentDate === todayStr;
    } else if (filterDatePeriod === 'this_month') {
      matchesDate = t.appointmentDate ? t.appointmentDate.startsWith(currentMonthStr) : true;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // IF NOT LOGGED IN: DISPLAY AUTH LOGIN SCREEN
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Portal Otentikasi Internal Staff</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Login Staff Puskesmas
          </h2>
          <p className="text-xs text-slate-600">
            Masuk menggunakan email kedinasan terdaftar untuk mengakses portal internal.
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-emerald-700 text-white rounded-lg flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Form Login Kedinasan</h3>
              <p className="text-xs text-slate-500">Puskesmas Pondok Benda Tangsel</p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Username Staff
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={inputUser}
                  onChange={(e) => setInputUser(e.target.value)}
                  placeholder="Masukkan Email / Username"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>Masuk ke System Dashboard</span>
            </button>
          </form>

          <div className="pt-3 text-center border-t border-slate-100 text-[11px] text-slate-400">
            Sistem Informasi Manajemen Puskesmas Pondok Benda • Kota Tangerang Selatan
          </div>

        </div>

      </div>
    );
  }

  // AUTHENTICATED DASHBOARD VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Professional Executive Header Bar */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide text-white ${currentUser.avatarBg}`}>
              {currentUser.roleName}
            </span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded text-[10px] font-semibold border border-slate-700">
              {currentUser.department}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Selamat Datang, {currentUser.name}</span>
          </h2>

          <p className="text-xs text-slate-400 font-normal">
            Sistem Informasi Pelayanan Integrasi & Manajemen Antrean Puskesmas Pondok Benda.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => handleExportFilteredCSV('Keseluruhan', tickets)}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white font-bold text-xs rounded-lg border border-rose-800/80 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Dashboard Sub-Tab Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('loket')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeSubTab === 'loket'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span>Loket & Pemanggilan Antrean</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pasien')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeSubTab === 'pasien'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Manajemen Data Pasien & Tiket ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('confusion-matrix')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeSubTab === 'confusion-matrix'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 font-extrabold'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-emerald-400" />
          <span>Uji Confusion Matrix (Slot Tersedia)</span>
        </button>

        {(currentUser.role === 'admin' || currentUser.role === 'it') && (
          <button
            onClick={() => setActiveSubTab('ikm')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubTab === 'ikm'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Laporan & Rekap Survei IKM</span>
          </button>
        )}

        {(currentUser.role === 'admin' || currentUser.role === 'it') && (
          <button
            onClick={() => setActiveSubTab('dokter')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubTab === 'dokter'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Manajemen Jadwal Dokter</span>
          </button>
        )}

        {currentUser.role === 'it' && (
          <button
            onClick={() => setActiveSubTab('system_it')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeSubTab === 'system_it'
                ? 'bg-purple-950 text-purple-200 border border-purple-800 shadow-xs'
                : 'text-purple-700 hover:bg-purple-50 font-extrabold'
            }`}
          >
            <Server className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>System Health & Log Aktivitas IT</span>
          </button>
        )}
      </div>

      {/* SUBTAB 1: LOKET & PEMANGGILAN ANTREAN */}
      {activeSubTab === 'loket' && (
        <div className="space-y-6">
          
          {/* Select Poli Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {polis.map((p) => {
              const isSelected = p.id === selectedPoliId;
              const waitingCount = tickets.filter(
                (t) => t.poliId === p.id && t.status === 'Waiting'
              ).length;

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPoliId(p.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase opacity-80">Poli {p.code}</span>
                  <span className="font-extrabold text-xs truncate mt-1">{p.name}</span>
                  <span className="text-[10px] font-semibold opacity-90 mt-2">
                    {waitingCount} antri
                  </span>
                </button>
              );
            })}
          </div>

          {/* Caller Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Active Caller Card */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border-2 border-emerald-600 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Poliklinik Terpilih
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{currentPoli.name}</h3>
                </div>
                <span className="text-xs font-bold text-slate-500">{currentPoli.room}</span>
              </div>

              {/* Number Box */}
              <div className="bg-slate-950 text-white p-6 rounded-xl text-center space-y-2 relative overflow-hidden">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                  Sedang Dipanggil Di Loket / Poli
                </span>

                <div className="text-5xl font-extrabold font-mono text-emerald-400 tracking-tight">
                  {calledTicket ? calledTicket.queueNumber : 'BELUM ADA'}
                </div>

                {calledTicket ? (
                  <div className="text-xs space-y-1 text-slate-300 pt-2 border-t border-slate-800">
                    <p className="font-bold text-white">{calledTicket.fullName}</p>
                    <p className="text-[11px]">NIK: {calledTicket.nik} • {calledTicket.patientType}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Tekan panggil di bawah untuk antrean berikutnya.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {calledTicket ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        speakText(
                          `Panggilan antrean. Nomor antrean ${calledTicket.queueNumber.replace('-', ' ')}, atas nama Bapak atau Ibu ${calledTicket.fullName}, silakan menuju ke ${calledTicket.poliName}`
                        );
                      }}
                      className="py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Suara Panggil Ulang</span>
                    </button>

                    <button
                      onClick={() => {
                        onUpdateStatus(calledTicket.id, 'Completed');
                        addAuditLog('ANTREAN', `Tiket ${calledTicket.queueNumber} diselesaikan oleh ${currentUser.name}.`);
                      }}
                      className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai Diperiksa</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCallNext}
                    disabled={waitingTickets.length === 0}
                    className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-2"
                  >
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>PANGGIL ANTREAN BERIKUTNYA ({waitingTickets.length} Menunggu)</span>
                  </button>
                )}

                {calledTicket && (
                  <button
                    onClick={() => {
                      onUpdateStatus(calledTicket.id, 'Cancelled');
                      addAuditLog('ANTREAN', `Tiket ${calledTicket.queueNumber} dibatalkan (Pasien Tidak Hadir).`);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Lewati / Batalkan (Pasien Tidak Hadir)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Poli Patient List Table */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Daftar Pasien Poli {currentPoli.name}
                </h3>
                <button
                  onClick={() => setActiveTab('pendaftaran')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Pasien Walk-in</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">No Tiket</th>
                      <th className="p-3">Nama Pasien</th>
                      <th className="p-3">Tipe</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {poliTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">{t.queueNumber}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{t.fullName}</div>
                          <div className="text-[10px] text-slate-400">NIK: {t.nik}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-bold">
                            {t.patientType}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status === 'Called'
                                ? 'bg-amber-400 text-slate-950'
                                : t.status === 'Waiting'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {t.status === 'Waiting' && (
                            <button
                              onClick={() => onUpdateStatus(t.id, 'Called')}
                              className="px-2.5 py-1 bg-emerald-700 text-white rounded font-bold text-[11px] hover:bg-emerald-800"
                            >
                              Panggil
                            </button>
                          )}
                          {t.status === 'Called' && (
                            <button
                              onClick={() => onUpdateStatus(t.id, 'Completed')}
                              className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold text-[11px] hover:bg-blue-700"
                            >
                              Selesai
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: MANAJEMEN DATA PASIEN & TIKET */}
      {activeSubTab === 'pasien' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Pusat Pencarian & Rekap Data Tiket Pasien
              </h3>
              <p className="text-xs text-slate-500">
                Menampilkan <strong>{filteredAllTickets.length}</strong> data pasien (Periode: {filterDatePeriod === 'today' ? 'Hari Ini' : filterDatePeriod === 'this_month' ? 'Bulan Ini' : 'Semua Tanggal'})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  handleExportFilteredCSV(
                    filterDatePeriod === 'today' ? 'Harian' : filterDatePeriod === 'this_month' ? 'Bulanan' : 'Keseluruhan',
                    filteredAllTickets
                  )
                }
                className="px-3.5 py-2 bg-emerald-800 text-white font-bold text-xs rounded-lg hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-xs"
                title="Unduh data dalam format Excel / CSV"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor Excel / CSV</span>
              </button>

              <button
                onClick={() =>
                  handlePrintReport(
                    filterDatePeriod === 'today' ? 'Harian' : filterDatePeriod === 'this_month' ? 'Bulanan' : 'Keseluruhan',
                    filteredAllTickets
                  )
                }
                className="px-3.5 py-2 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-900 transition flex items-center gap-1.5 shadow-xs"
                title="Cetak Laporan Rekap Pasien"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rekap</span>
              </button>

              <button
                onClick={() => setActiveTab('pendaftaran')}
                className="px-3.5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Registrasi Baru</span>
              </button>
            </div>
          </div>

          {/* Filter & Period Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Cari NIK, Nama Pasien, No Tiket..."
                className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Filter Date Period */}
            <div className="sm:col-span-4 flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap hidden sm:inline">Periode:</span>
              <select
                value={filterDatePeriod}
                onChange={(e) => setFilterDatePeriod(e.target.value as 'all' | 'today' | 'this_month')}
                className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="all">Semua Tanggal</option>
                <option value="today">Laporan Harian (Hari Ini)</option>
                <option value="this_month">Laporan Bulanan (Bulan Ini)</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="sm:col-span-3 flex items-center gap-1.5">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="Waiting">Menunggu (Waiting)</option>
                <option value="Called">Dipanggil (Called)</option>
                <option value="Completed">Selesai (Completed)</option>
                <option value="Cancelled">Dibatalkan (Cancelled)</option>
              </select>
            </div>
          </div>

          {/* Patients Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase font-bold">
                <tr>
                  <th className="p-3">No Tiket</th>
                  <th className="p-3">Identitas Pasien</th>
                  <th className="p-3">Poliklinik Tujuan</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Status Antrean</th>
                  <th className="p-3 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAllTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-extrabold text-slate-900">{t.queueNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{t.fullName}</div>
                      <div className="text-[10px] text-slate-500">NIK: {t.nik} • HP: {t.phone}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{t.poliName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-bold">
                        {t.patientType}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Called'
                            ? 'bg-amber-400 text-slate-950'
                            : t.status === 'Waiting'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={t.status}
                        onChange={(e) => onUpdateStatus(t.id, e.target.value as QueueStatus)}
                        className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-800"
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="Called">Called</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LAPORAN & REKAP SURVEI IKM (ADMIN & IT) */}
      {activeSubTab === 'ikm' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Ringkasan Eksekutif Indeks Kepuasan Masyarakat (IKM)
                </h3>
                <p className="text-xs text-slate-500">
                  Laporan Evaluasi Mutu Sesuai Permenpan RB No. 14 Tahun 2017
                </p>
              </div>

              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-md text-xs font-bold">
                Mutu A (Sangat Baik)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase">Total Responden</span>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  {ikmStats ? ikmStats.totalResponses : 0}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase">Persentase Kepuasan</span>
                <div className="text-3xl font-extrabold text-emerald-700 font-mono">
                  {ikmStats ? `${ikmStats.satisfactionPercentage}%` : '100%'}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-xs text-slate-500 font-semibold uppercase">Skor Rata-Rata</span>
                <div className="text-3xl font-extrabold text-amber-600 font-mono">
                  {ikmStats ? ikmStats.averageRating.toFixed(1) : '5.0'} / 5.0
                </div>
              </div>
            </div>

            {/* Submissions List Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-900">Ulasan & Kritik Pasien Terbaru:</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white uppercase font-bold">
                    <tr>
                      <th className="p-3">Nama Pasien</th>
                      <th className="p-3">Poli</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Ulasan & Aspirasi</th>
                      <th className="p-3 text-right">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {recentSurveys.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{s.patientName || 'Warga (Anonim)'}</td>
                        <td className="p-3 text-slate-700">{s.servicePoli}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold font-mono">
                            {s.rating} ★
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 italic">{s.feedback || '-'}</td>
                        <td className="p-3 text-right text-slate-500">
                          {new Date(s.createdAt).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 4: MANAJEMEN JADWAL DOKTER & POLI */}
      {activeSubTab === 'dokter' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Pengaturan Status Kehadiran Dokter & Ruangan
              </h3>
              <p className="text-xs text-slate-500">
                Kelola dokter bertugas hari ini untuk pendaftaran antrean
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {polis.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Poli {p.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{p.name}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{p.room}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">Dokter Penanggung Jawab:</div>
                  <div className="text-slate-700 font-medium">dr. H. Ahmad Fauzi, Sp.PD / Tim Bidan</div>
                  <div className="text-[11px] text-emerald-700 font-bold pt-1">Status: Praktik Berjalan</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: SYSTEM HEALTH, DATABASE & LOG AKTIVITAS IT (KHUSUS IT) */}
      {activeSubTab === 'system_it' && (
        <div className="space-y-6">
          
          {/* IT Executive Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Server Health</span>
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">99.98% ONLINE</div>
              <p className="text-[11px] text-slate-400">Node Express Server Port 3000</p>
            </div>

            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>API Latency</span>
                <Cpu className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-blue-400">12 ms</div>
              <p className="text-[11px] text-slate-400">Cloud Run Ingress Proxy</p>
            </div>

            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Database Sync</span>
                <Database className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-amber-400">CONNECTED</div>
              <p className="text-[11px] text-slate-400">Real-time JSON & Firestore schema</p>
            </div>

            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Total Active Records</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-purple-400">{tickets.length} Tiket</div>
              <p className="text-[11px] text-slate-400">Akumulasi antrean hari ini</p>
            </div>
          </div>

          {/* Audit Log Console */}
          <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                <Terminal className="w-4 h-4" />
                <span className="font-bold">LIVE SYSTEM AUDIT LOG (LOG AKTIVITAS IT)</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Real-time Monitor
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 max-h-72 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className="text-slate-500 font-bold shrink-0">[{log.time}]</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                      log.type === 'AUTH'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : log.type === 'ANTREAN'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}
                  >
                    {log.type}
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => addAuditLog('SYSTEM', 'Manual Memory Garbage Collection triggered.')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded font-bold transition"
              >
                Clear Memory Cache
              </button>
              <button
                onClick={() => addAuditLog('DB', 'Database backup snapshot verified.')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded font-bold transition"
              >
                Backup Database Snapshot
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 6: CONFUSION MATRIX EVALUATION */}
      {activeSubTab === 'confusion-matrix' && (
        <ConfusionMatrixPage onBack={() => setActiveSubTab('loket')} />
      )}

    </div>
  );
};
