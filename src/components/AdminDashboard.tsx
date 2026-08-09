import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Radio,
  ListOrdered,
  UserCheck,
  FileText,
  Stethoscope,
  Mail,
  Star,
  ArrowLeft,
  Users,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  PlusCircle,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  Award,
  Video,
  Play,
  X,
  Building2,
  PhoneCall,
  Save,
  Check,
  AlertCircle,
  BarChart3,
  LogOut,
  Sparkles,
  ChevronRight,
  Send,
  User,
  Database,
  Download,
  Upload,
  RotateCcw,
  Tv,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { PuskesmasLogo } from './PuskesmasLogo';
import { PoliService, QueueTicket, DoctorSchedule, HealthArticle, QueueStatus, SurveySubmission } from '../types';
import { INITIAL_POLIS, INITIAL_DOCTORS, INITIAL_ARTICLES } from '../data/mockData';

interface AdminDashboardProps {
  polis: PoliService[];
  tickets: QueueTicket[];
  doctors: DoctorSchedule[];
  articles: HealthArticle[];
  onUpdateStatus: (ticketId: string, newStatus: QueueStatus) => void;
  onRefresh: () => void;
  onCloseAdmin: () => void;
  setArticles: React.Dispatch<React.SetStateAction<HealthArticle[]>>;
  setDoctors: React.Dispatch<React.SetStateAction<DoctorSchedule[]>>;
  setPolis: React.Dispatch<React.SetStateAction<PoliService[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  polis,
  tickets,
  doctors,
  articles,
  onUpdateStatus,
  onRefresh,
  onCloseAdmin,
  setArticles,
  setDoctors,
  setPolis
}) => {
  // Sidebar tab state
  const [activeMenu, setActiveMenu] = useState<
    'dashboard' | 'monitor' | 'antrean' | 'dokter' | 'artikel' | 'layanan' | 'pesan' | 'testimoni' | 'cadangan'
  >('dashboard');

  // TV Monitor View & Audio Call State
  const [isFullscreenTv, setIsFullscreenTv] = useState<boolean>(false);
  const [selectedMonitorPoli, setSelectedMonitorPoli] = useState<string>('all');
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  // Backup & Restore State
  const [backupSnapshots, setBackupSnapshots] = useState<Array<{
    id: string;
    name: string;
    date: string;
    doctorCount: number;
    articleCount: number;
    poliCount: number;
    data: { doctors: DoctorSchedule[]; articles: HealthArticle[]; polis: PoliService[] };
  }>>(() => {
    try {
      const saved = localStorage.getItem('puskesmas_backup_snapshots');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [snapshotNameInput, setSnapshotNameInput] = useState('');
  const [backupAlert, setBackupAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Helper: Text to speech voice call for queue
  const speakQueueCall = (queueNumber: string, patientName: string, poliName: string, room: string) => {
    if (!isAudioEnabled) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanQueue = queueNumber.replace('-', ' ');
      const speechText = `Nomor antrean ${cleanQueue}, atas nama ${patientName}, silakan menuju ${poliName}, ${room}.`;
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'id-ID';
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTestAudio = () => {
    speakQueueCall('A-001', 'Bapak Ahmad', 'Poli Umum', 'Lantai 1 Ruang 101');
  };

  // Login authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Show login screen first
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'it'>('admin');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Messages state with Reply capability
  const [messages, setMessages] = useState<Array<{ id: string; name: string; email: string; phone: string; subject: string; message: string; date: string; read: boolean; reply?: string; repliedAt?: string }>>([
    {
      id: 'msg-1',
      name: 'Rina Wijaya',
      email: 'rina.w@gmail.com',
      phone: '081298765432',
      subject: 'Pertanyaan Pendaftaran Vaksinasi Influenza',
      message: 'Apakah vaksin influenza untuk lansia tersedia setiap hari Jumat di Puskesmas Pondok Benda?',
      date: 'Hari ini, 09:15',
      read: true,
      reply: 'Halo Ibu Rina, vaksinasi influenza untuk lansia tersedia setiap hari Jumat pukul 08:00 - 11:30 WIB di Poli Lansia/Vaksinasi. Silakan mendaftar secara online terlebih dahulu via aplikasi ini.',
      repliedAt: 'Hari ini, 10:00'
    },
    {
      id: 'msg-2',
      name: 'Budi Kurniawan',
      email: 'budi.k@yahoo.com',
      phone: '085711223344',
      subject: 'Jadwal Dokter Spesialis / Poli Gigi',
      message: 'Apakah pendaftaran poli gigi hari Sabtu bisa lewat online mulai jam 6 pagi?',
      date: 'Kemarin, 14:30',
      read: false
    }
  ]);
  const [replyingMsgId, setReplyingMsgId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read' | 'unreplied'>('all');

  // Modal States for Add/Edit Article
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<HealthArticle | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Edukasi' as HealthArticle['category'],
    snippet: '',
    content: '',
    author: 'Tim Admin Puskesmas',
    imageUrl: '',
    isVideo: false,
    videoUrl: ''
  });

  // Modal States for Add/Edit Doctor
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorSchedule | null>(null);
  const [doctorForm, setDoctorForm] = useState({
    doctorName: '',
    specialty: 'Dokter Umum / Penanggung Jawab',
    poliName: 'Poli Umum',
    poliId: 'poli-umum',
    days: 'Senin, Selasa, Rabu, Kamis, Jumat',
    hours: '08:00 - 12:00 WIB',
    quotaPerDay: 30,
    status: 'Hadir' as DoctorSchedule['status'],
    photoUrl: ''
  });

  // Modal States for Add/Edit Poliklinik & Layanan
  const [isPoliModalOpen, setIsPoliModalOpen] = useState(false);
  const [editingPoli, setEditingPoli] = useState<PoliService | null>(null);
  const [poliForm, setPoliForm] = useState({
    name: '',
    code: '',
    room: 'Lantai 1 - Ruang 101',
    doctorName: 'dr. H. Bambang Suherman',
    operatingHours: 'Senin - Sabtu (08:00 - 14:00 WIB)',
    requirements: '1. KTP / NIK Tangsel\n2. Kartu BPJS Kesehatan (Aktif)\n3. Kartu Berobat Puskesmas',
    feeGeneral: 'Gratis (BPJS) / Rp 10.000 (Umum)',
    maxQuota: 40,
    description: 'Pelayanan kesehatan masyarakat terpadu.'
  });

  // Queue Caller State
  const [selectedPoliId, setSelectedPoliId] = useState<string>(polis[0]?.id || 'poli-umum');
  const [queueSearch, setQueueSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Stats calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTickets = tickets.filter(t => t.appointmentDate === todayStr || true); // total today
  const waitingCount = tickets.filter(t => t.status === 'Waiting').length;
  const activeDoctorsCount = doctors.filter(d => d.status === 'Ada' || d.status === 'Praktik').length;
  const totalArticlesCount = articles.length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  // Chart data calculation
  const poliStatsData = [
    { name: 'Kesehatan Dewasa (Poli Umum)', count: 28 },
    { name: 'Gigi & Mulut', count: 14 },
    { name: 'KIA (Imunisasi & Ibu)', count: 11 },
    { name: 'Surat Rujukan BPJS', count: 8 },
    { name: 'MTBS (Anak 0-5 Th)', count: 5 },
    { name: 'Calon Pengantin (Catin)', count: 2 },
    { name: 'Surat Keterangan Sehat', count: 1 }
  ];

  const weeklyVisitsData = [
    { day: 'Kam, 30', count: 4 },
    { day: 'Jum, 31', count: 1 },
    { day: 'Sab, 1', count: 0 },
    { day: 'Min, 2', count: 0 },
    { day: 'Sen, 3', count: 0 },
    { day: 'Sel, 4', count: 0 },
    { day: 'Rab, 5', count: 0 }
  ];

  // Article Handlers
  const handleOpenAddArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'Edukasi',
      snippet: '',
      content: '',
      author: 'Tim Admin Puskesmas',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
      isVideo: false,
      videoUrl: ''
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: HealthArticle) => {
    setEditingArticle(art);
    setArticleForm({
      title: art.title,
      category: art.category,
      snippet: art.snippet,
      content: art.content,
      author: art.author,
      imageUrl: art.imageUrl || '',
      isVideo: !!art.isVideo,
      videoUrl: art.videoUrl || ''
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.content) return;

    if (editingArticle) {
      // Update
      try {
        await fetch(`/api/artikels/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleForm)
        });
      } catch (err) {
        console.log(err);
      }
      setArticles(prev =>
        prev.map(a => (a.id === editingArticle.id ? { ...a, ...articleForm } : a))
      );
    } else {
      // Create
      try {
        const res = await fetch('/api/artikels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleForm)
        });
        const data = await res.json();
        if (data.success && data.data) {
          setArticles(prev => [data.data, ...prev]);
        } else {
          // Local fallback
          const newArt: HealthArticle = {
            id: `art-${Date.now()}`,
            ...articleForm,
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
            readTime: articleForm.isVideo ? 'Video 3 min' : '3 min baca'
          };
          setArticles(prev => [newArt, ...prev]);
        }
      } catch (err) {
        const newArt: HealthArticle = {
          id: `art-${Date.now()}`,
          ...articleForm,
          date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
          readTime: articleForm.isVideo ? 'Video 3 min' : '3 min baca'
        };
        setArticles(prev => [newArt, ...prev]);
      }
    }

    onRefresh();
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel/berita ini?')) {
      try {
        await fetch(`/api/artikels/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.log(err);
      }
      setArticles(prev => prev.filter(a => a.id !== id));
      onRefresh();
    }
  };

  // Doctor Handlers
  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDoctorForm({
      doctorName: '',
      specialty: 'Dokter Umum / Spesialis',
      poliName: polis[0]?.name || 'Poli Umum',
      poliId: polis[0]?.id || 'poli-umum',
      days: 'Senin - Jumat',
      hours: '08:00 - 12:00 WIB',
      quotaPerDay: 30,
      status: 'Hadir' as DoctorSchedule['status'],
      photoUrl: ''
    });
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: DoctorSchedule) => {
    setEditingDoctor(doc);
    setDoctorForm({
      doctorName: doc.doctorName,
      specialty: doc.specialty || 'Dokter Umum',
      poliName: doc.poliName,
      poliId: doc.poliId,
      days: Array.isArray(doc.days) ? doc.days.join(', ') : doc.days,
      hours: doc.hours || '08:00 - 12:00 WIB',
      quotaPerDay: doc.quotaPerDay || 30,
      status: doc.status || 'Hadir',
      photoUrl: doc.photoUrl || ''
    });
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorForm.doctorName) return;

    const daysArray = doctorForm.days.split(',').map(s => s.trim());

    if (editingDoctor) {
      try {
        await fetch(`/api/jadwal-dokter/${editingDoctor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...doctorForm, days: daysArray })
        });
      } catch (err) {
        console.log(err);
      }
      setDoctors(prev =>
        prev.map(d => (d.id === editingDoctor.id ? { ...d, ...doctorForm, days: daysArray } : d))
      );
    } else {
      try {
        const res = await fetch('/api/jadwal-dokter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...doctorForm, days: daysArray })
        });
        const data = await res.json();
        if (data.success && data.data) {
          setDoctors(prev => [data.data, ...prev]);
        } else {
          const newDoc: DoctorSchedule = {
            id: `doc-${Date.now()}`,
            ...doctorForm,
            days: daysArray
          };
          setDoctors(prev => [newDoc, ...prev]);
        }
      } catch (err) {
        const newDoc: DoctorSchedule = {
          id: `doc-${Date.now()}`,
          ...doctorForm,
          days: daysArray
        };
        setDoctors(prev => [newDoc, ...prev]);
      }
    }

    onRefresh();
    setIsDoctorModalOpen(false);
  };

  const handleDeleteDoctor = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal dokter ini?')) {
      try {
        await fetch(`/api/jadwal-dokter/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.log(err);
      }
      setDoctors(prev => prev.filter(d => d.id !== id));
      onRefresh();
    }
  };

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const emailInput = loginForm.email.toLowerCase().trim();
    const passwordInput = loginForm.password.trim();

    if (!emailInput || !emailInput.includes('@')) {
      setLoginError('Masukkan format alamat email yang valid.');
      return;
    }

    if (!passwordInput) {
      setLoginError('Masukkan password akses.');
      return;
    }

    // Determine role based on email or password, defaulting to admin
    if (emailInput.includes('it') || passwordInput === 'it123') {
      setCurrentUserRole('it');
    } else {
      setCurrentUserRole('admin');
    }
    setIsAuthenticated(true);
  };

  // Helper function to compress image file using canvas
  const compressImageFile = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          callback(dataUrl);
        } else {
          callback(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Doctor Photo Upload Handler
  const handleDoctorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImageFile(file, (base64) => {
        setDoctorForm(prev => ({ ...prev, photoUrl: base64 }));
      });
    }
  };

  // Article Photo Upload & Video Parsing Handler
  const handleArticlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImageFile(file, (base64) => {
        setArticleForm(prev => ({ ...prev, imageUrl: base64 }));
      });
    }
  };

  const handleParseVideoUrl = (url: string) => {
    setArticleForm(prev => ({ ...prev, videoUrl: url }));
    
    // Auto extract YouTube Video ID if available
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
    }

    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      setArticleForm(prev => ({
        ...prev,
        isVideo: true,
        category: 'Video Edukasi',
        imageUrl: thumbnailUrl,
        videoUrl: embedUrl
      }));
    }
  };

  // Poli / Layanan Handlers
  const handleOpenAddPoli = () => {
    setEditingPoli(null);
    setPoliForm({
      name: '',
      code: String.fromCharCode(65 + polis.length), // A, B, C...
      room: 'Lantai 1 - Ruang 108',
      doctorName: 'dr. H. Bambang Suherman',
      operatingHours: 'Senin - Sabtu (08:00 - 14:00 WIB)',
      requirements: '1. KTP / NIK Tangsel\n2. Kartu BPJS Kesehatan (Aktif)\n3. Kartu Berobat Puskesmas',
      feeGeneral: 'Gratis (BPJS) / Rp 15.000 (Umum)',
      maxQuota: 30,
      description: 'Layanan spesialis/spesifik kesehatan masyarakat.'
    });
    setIsPoliModalOpen(true);
  };

  const handleOpenEditPoli = (p: PoliService) => {
    setEditingPoli(p);
    setPoliForm({
      name: p.name,
      code: p.code,
      room: p.room,
      doctorName: p.doctorName || 'dr. H. Bambang Suherman',
      operatingHours: p.operatingHours || 'Senin - Sabtu (08:00 - 14:00 WIB)',
      requirements: Array.isArray(p.requirements) ? p.requirements.join('\n') : (p.requirements || ''),
      feeGeneral: p.feeGeneral || 'Gratis (BPJS) / Rp 10.000 (Umum)',
      maxQuota: p.maxQuota || 40,
      description: p.description
    });
    setIsPoliModalOpen(true);
  };

  const handleSavePoli = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poliForm.name) return;

    const reqArray = poliForm.requirements
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    if (editingPoli) {
      setPolis(prev =>
        prev.map(p =>
          p.id === editingPoli.id
            ? {
                ...p,
                name: poliForm.name,
                code: poliForm.code,
                room: poliForm.room,
                doctorName: poliForm.doctorName,
                operatingHours: poliForm.operatingHours,
                requirements: reqArray,
                feeGeneral: poliForm.feeGeneral,
                maxQuota: Number(poliForm.maxQuota),
                description: poliForm.description
              }
            : p
        )
      );
    } else {
      const newPoli: PoliService = {
        id: `poli-${Date.now()}`,
        code: poliForm.code || 'X',
        name: poliForm.name,
        iconName: 'Stethoscope',
        description: poliForm.description,
        room: poliForm.room,
        queuePrefix: poliForm.code || 'X',
        activeQueueNumber: '-',
        totalWaiting: 0,
        doctorName: poliForm.doctorName,
        operatingHours: poliForm.operatingHours,
        requirements: reqArray,
        feeGeneral: poliForm.feeGeneral,
        maxQuota: Number(poliForm.maxQuota)
      };
      setPolis(prev => [...prev, newPoli]);
    }
    setIsPoliModalOpen(false);
  };

  const handleDeletePoli = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus layanan Poliklinik ini?')) {
      setPolis(prev => prev.filter(p => p.id !== id));
    }
  };

  // Toggle Message Read Status
  const handleToggleRead = (msgId: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, read: !m.read } : m))
    );
  };

  // Send Message Reply Handler
  const handleSendReply = (msgId: string) => {
    if (!replyText.trim()) return;

    setMessages(prev =>
      prev.map(m =>
        m.id === msgId
          ? {
              ...m,
              read: true,
              reply: replyText,
              repliedAt: new Date().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          : m
      )
    );

    setReplyingMsgId(null);
    setReplyText('');
  };

  // Queue Caller Logic
  const currentPoli = polis.find(p => p.id === selectedPoliId) || polis[0] || { id: 'poli-umum', name: 'Poli Umum', code: 'A', room: 'Ruang 1' };
  const poliTickets = tickets.filter(t => t.poliId === selectedPoliId);
  const waitingTickets = poliTickets.filter(t => t.status === 'Waiting');
  const calledTicket = poliTickets.find(t => t.status === 'Called');

  const handleCallNext = () => {
    if (waitingTickets.length > 0) {
      const nextTicket = waitingTickets[waitingTickets.length - 1];
      onUpdateStatus(nextTicket.id, 'Called');
      speakText(
        `Panggilan antrean. Nomor antrean ${nextTicket.queueNumber.replace('-', ' ')}, atas nama Bapak atau Ibu ${nextTicket.fullName}, silakan menuju ke ${nextTicket.poliName}`
      );
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative z-10">
          
          {/* Header */}
          <div className="p-7 bg-slate-900 text-white space-y-3 relative">
            <button
              onClick={onCloseAdmin}
              className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              title="Kembali ke Beranda"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <PuskesmasLogo className="w-10 h-10 shrink-0" />
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider block">
                  SISTEM OTENTIKASI RESMI
                </span>
                <h2 className="text-xl font-black text-white">Login Admin & IT</h2>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Masukkan email dan password resmi petugas untuk mengakses Panel Manajemen Puskesmas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-7 space-y-4">
            
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="Masukkan alamat email resmi"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password Akses
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>MASUK PANEL ADMIN</span>
            </button>

            <div className="text-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onCloseAdmin}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition underline"
              >
                ← Kembali ke Halaman Utama Pasien
              </button>
            </div>

          </form>

        </div>
      </div>
    );
  }

  // TV Monitor Queue Calling Handlers
  const handleCallNextForPoli = (poliId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const waitingTickets = tickets.filter(
      t => t.poliId === poliId && t.status === 'Waiting' && (t.appointmentDate === today || true)
    );

    if (waitingTickets.length === 0) {
      setBackupAlert({
        type: 'error',
        text: 'Tidak ada antrean pasien yang menunggu di poli ini.'
      });
      setTimeout(() => setBackupAlert(null), 3000);
      return;
    }

    const sorted = [...waitingTickets].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const nextTicket = sorted[0];

    const poliObj = polis.find(p => p.id === poliId);
    const roomName = poliObj?.room || 'Ruang Pemeriksaan';
    const poliName = poliObj?.name || 'Poli';

    onUpdateStatus(nextTicket.id, 'Called');
    speakQueueCall(nextTicket.queueNumber, nextTicket.fullName, poliName, roomName);
  };

  const handleRecallForPoli = (poliId: string) => {
    const activeTicket = tickets.find(t => t.poliId === poliId && t.status === 'Called');
    if (!activeTicket) {
      setBackupAlert({
        type: 'error',
        text: 'Belum ada pasien yang sedang dipanggil di poli ini.'
      });
      setTimeout(() => setBackupAlert(null), 3000);
      return;
    }
    const poliObj = polis.find(p => p.id === poliId);
    speakQueueCall(
      activeTicket.queueNumber,
      activeTicket.fullName,
      poliObj?.name || 'Poli',
      poliObj?.room || 'Ruang Pemeriksaan'
    );
  };

  const handleCompleteForPoli = (poliId: string) => {
    const activeTicket = tickets.find(t => t.poliId === poliId && t.status === 'Called');
    if (!activeTicket) {
      return;
    }
    onUpdateStatus(activeTicket.id, 'Completed');
  };

  const handleSkipForPoli = (poliId: string) => {
    const activeTicket = tickets.find(t => t.poliId === poliId && t.status === 'Called');
    if (!activeTicket) {
      return;
    }
    if (confirm(`Batalkan / lewati nomor antrean ${activeTicket.queueNumber} (${activeTicket.fullName})?`)) {
      onUpdateStatus(activeTicket.id, 'Cancelled');
    }
  };

  // Backup & Recovery Handlers
  const handleDownloadBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleString('id-ID'),
      appName: 'Puskesmas Pondok Benda Tangerang Selatan',
      version: '1.0',
      counts: {
        doctorsCount: doctors.length,
        articlesCount: articles.length,
        polisCount: polis.length
      },
      doctors,
      articles,
      polis
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `backup_puskesmas_pondokbenda_${todayStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setBackupAlert({
      type: 'success',
      text: `File cadangan data berhasil diunduh (${doctors.length} Dokter, ${articles.length} Artikel, ${polis.length} Poli).`
    });
  };

  const handleRestoreFromFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.doctors && !parsed.articles && !parsed.polis) {
        setBackupAlert({
          type: 'error',
          text: 'Format file backup tidak valid. Pastikan file JSON berisi data dokter, artikel, atau polis.'
        });
        return;
      }

      let restoredDocsCount = 0;
      let restoredArtsCount = 0;
      let restoredPolisCount = 0;

      if (Array.isArray(parsed.doctors)) {
        setDoctors(parsed.doctors);
        restoredDocsCount = parsed.doctors.length;
      }
      if (Array.isArray(parsed.articles)) {
        setArticles(parsed.articles);
        restoredArtsCount = parsed.articles.length;
      }
      if (Array.isArray(parsed.polis)) {
        setPolis(parsed.polis);
        restoredPolisCount = parsed.polis.length;
      }

      try {
        await fetch('/api/backup/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctors: parsed.doctors || doctors,
            articles: parsed.articles || articles,
            polis: parsed.polis || polis
          })
        });
      } catch (err) {
        console.warn('Backend sync error:', err);
      }

      setBackupAlert({
        type: 'success',
        text: `Pemulihan data berhasil! Dipulihkan: ${restoredDocsCount} Dokter, ${restoredArtsCount} Artikel, ${restoredPolisCount} Poli.`
      });

      event.target.value = '';
    } catch (err: any) {
      setBackupAlert({
        type: 'error',
        text: 'Gagal membaca file JSON: ' + (err.message || 'Format tidak valid')
      });
    }
  };

  const handleFactoryReset = async () => {
    try {
      setDoctors([...INITIAL_DOCTORS]);
      setArticles([...INITIAL_ARTICLES]);
      setPolis([...INITIAL_POLIS]);

      await fetch('/api/backup/reset', { method: 'POST' });

      setBackupAlert({
        type: 'success',
        text: 'Data berhasil dikembalikan ke standar awal pabrik (Factory Reset).'
      });
      setIsResetConfirmOpen(false);
    } catch (err: any) {
      setBackupAlert({
        type: 'error',
        text: 'Gagal mereset data: ' + err.message
      });
    }
  };

  const handleCreateSnapshot = () => {
    const name = snapshotNameInput.trim() || `Snapshot ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    const newSnapshot = {
      id: `snap-${Date.now()}`,
      name,
      date: new Date().toLocaleString('id-ID'),
      doctorCount: doctors.length,
      articleCount: articles.length,
      poliCount: polis.length,
      data: {
        doctors: [...doctors],
        articles: [...articles],
        polis: [...polis]
      }
    };

    const updated = [newSnapshot, ...backupSnapshots];
    setBackupSnapshots(updated);
    try {
      localStorage.setItem('puskesmas_backup_snapshots', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setSnapshotNameInput('');
    setBackupAlert({
      type: 'success',
      text: `Snapshot "${name}" berhasil disimpan!`
    });
  };

  const handleRestoreSnapshot = async (snap: any) => {
    if (confirm(`Pulihkan data dari snapshot "${snap.name}" (${snap.date})?`)) {
      setDoctors(snap.data.doctors);
      setArticles(snap.data.articles);
      setPolis(snap.data.polis);

      try {
        await fetch('/api/backup/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctors: snap.data.doctors,
            articles: snap.data.articles,
            polis: snap.data.polis
          })
        });
      } catch (err) {
        console.warn(err);
      }

      setBackupAlert({
        type: 'success',
        text: `Data berhasil dipulihkan dari snapshot "${snap.name}".`
      });
    }
  };

  const handleDeleteSnapshot = (id: string) => {
    const updated = backupSnapshots.filter(s => s.id !== id);
    setBackupSnapshots(updated);
    try {
      localStorage.setItem('puskesmas_backup_snapshots', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* LEFT SIDEBAR (Identical to user's uploaded screenshot) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <PuskesmasLogo className="w-8 h-8 shrink-0" />
            <div>
              <h1 className="text-sm font-black text-slate-900 leading-tight">Puskesmas</h1>
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider block">
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Navigation Items Organized by Categories */}
          <nav className="p-3 space-y-4">
            
            {/* CATEGORY 1: UTAMA & ANTREAN */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block">
                Ringkasan & Antrean
              </span>

              <button
                onClick={() => setActiveMenu('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeMenu === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard Utama</span>
              </button>

              <button
                onClick={() => setActiveMenu('antrean')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeMenu === 'antrean'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ListOrdered className="w-4 h-4 shrink-0" />
                  <span>Daftar Pasien & Antrean</span>
                </div>
                {tickets.filter(t => t.status === 'Waiting').length > 0 && (
                  <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-extrabold rounded-full">
                    {tickets.filter(t => t.status === 'Waiting').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveMenu('monitor')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeMenu === 'monitor'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Radio className="w-4 h-4 shrink-0" />
                <span>Monitor Panggilan TV</span>
              </button>
            </div>

            {/* CATEGORY 2: PELAYANAN & MEDIS */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pt-2 block">
                Pelayanan & Medis
              </span>

              <button
                onClick={() => setActiveMenu('layanan')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeMenu === 'layanan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Stethoscope className="w-4 h-4 shrink-0" />
                <span>Layanan Poliklinik</span>
              </button>

              <button
                onClick={() => setActiveMenu('dokter')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeMenu === 'dokter'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>Jadwal & Tim Dokter</span>
              </button>
            </div>

            {/* CATEGORY 3: INFORMASI & INTERAKSI */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pt-2 block">
                Informasi & Komunikasi
              </span>

              <button
                onClick={() => setActiveMenu('artikel')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeMenu === 'artikel'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Manajemen Artikel</span>
              </button>

              <button
                onClick={() => setActiveMenu('pesan')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeMenu === 'pesan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Pesan & Balasan</span>
                </div>
                {unreadMessagesCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveMenu('testimoni')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeMenu === 'testimoni'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Star className="w-4 h-4 shrink-0" />
                <span>Testimoni Masyarakat</span>
              </button>
            </div>

            {/* CATEGORY 4: PENGATURAN & SISTEM */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pt-2 block">
                Sistem & Keamanan
              </span>

              <button
                onClick={() => setActiveMenu('cadangan')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeMenu === 'cadangan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Database className="w-4 h-4 shrink-0" />
                <span>Cadangan Data (Backup)</span>
              </button>
            </div>

          </nav>
        </div>

        {/* Sidebar Footer Link: Kembali ke Situs */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onCloseAdmin}
            className="w-full flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition py-2 px-3 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Situs</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl">
        
        {/* VIEW 1: DASHBOARD OVERVIEW (Matching User Screenshot) */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Header Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dashboard
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Ringkasan aktivitas Puskesmas Pondok Benda
              </p>
            </div>

            {/* 5 KPI Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Card 1: Pendaftaran Hari Ini */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                    {tickets.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Pendaftaran Hari Ini
                  </div>
                </div>
              </div>

              {/* Card 2: Antrean Menunggu */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                    {waitingCount}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Antrean Menunggu
                  </div>
                </div>
              </div>

              {/* Card 3: Dokter Aktif */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                    {doctors.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Dokter Aktif
                  </div>
                </div>
              </div>

              {/* Card 4: Artikel */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                    {totalArticlesCount}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Artikel
                  </div>
                </div>
              </div>

              {/* Card 5: Pesan Masuk */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                    {messages.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">
                    Pesan Masuk
                  </div>
                </div>
              </div>

            </div>

            {/* CHART 1: Kunjungan Pasien 7 Hari Terakhir */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3>Kunjungan Pasien 7 Hari Terakhir</h3>
              </div>

              {/* Bar Chart Graphics */}
              <div className="h-56 relative flex flex-col justify-between pt-4 pb-8 border-b border-slate-200">
                
                {/* Horizontal Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-[11px] text-slate-400">
                  <div className="border-b border-dashed border-slate-200 w-full flex items-center justify-between">
                    <span>4</span>
                  </div>
                  <div className="border-b border-dashed border-slate-200 w-full flex items-center justify-between">
                    <span>3</span>
                  </div>
                  <div className="border-b border-dashed border-slate-200 w-full flex items-center justify-between">
                    <span>2</span>
                  </div>
                  <div className="border-b border-dashed border-slate-200 w-full flex items-center justify-between">
                    <span>1</span>
                  </div>
                  <div className="border-b border-slate-300 w-full flex items-center justify-between">
                    <span>0</span>
                  </div>
                </div>

                {/* Bars Container */}
                <div className="h-full flex items-end justify-around relative z-10 px-8">
                  {weeklyVisitsData.map((item, idx) => {
                    const heightPct = item.count === 0 ? '4px' : `${(item.count / 4) * 100}%`;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                        <div
                          style={{ height: heightPct }}
                          className={`w-10 sm:w-12 rounded-t-lg transition-all duration-300 ${
                            item.count > 0 ? 'bg-emerald-600 group-hover:bg-emerald-500 shadow-xs' : 'bg-slate-200'
                          }`}
                        />
                        <span className="text-[11px] font-medium text-slate-600 absolute -bottom-6">
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CHART 2: Kunjungan per Poli (7 Hari Terakhir) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3>Kunjungan per Poli (7 Hari Terakhir)</h3>
              </div>

              <div className="space-y-4">
                {poliStatsData.map((item, idx) => {
                  const maxVal = 28;
                  const pct = Math.max(2, (item.count / maxVal) * 100);

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{item.name}</span>
                        <span className="font-mono font-bold text-slate-900">{item.count} Pasien</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: ARTIKEL & BERITA MANAGEMENT ("agar bisa menambahkan atau mengganti") */}
        {activeMenu === 'artikel' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Kelola Artikel, Berita & Video Edukasi
                </h2>
                <p className="text-xs text-slate-500">
                  Tambah, edit, atau hapus artikel kesehatan dan video edukasi untuk masyarakat
                </p>
              </div>

              <button
                onClick={handleOpenAddArticle}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Artikel / Video Baru</span>
              </button>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white font-bold uppercase">
                    <tr>
                      <th className="p-4">Media / Judul</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Penulis</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                              <img
                                src={art.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200'}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              {art.isVideo && (
                                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                                  <Play className="w-4 h-4 fill-white text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1">
                                {art.title}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {art.snippet}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-700">{art.author}</td>
                        <td className="p-4 text-slate-500">{art.date}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditArticle(art)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg transition border border-amber-200 text-xs inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition border border-rose-200 text-xs inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DOKTER MANAGEMENT ("agar bisa menambahkan atau mengganti") */}
        {activeMenu === 'dokter' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Kelola Jadwal & Status Dokter
                </h2>
                <p className="text-xs text-slate-500">
                  Atur daftar dokter bertugas, jadwal praktik, serta status kehadiran harian
                </p>
              </div>

              <button
                onClick={handleOpenAddDoctor}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Dokter Baru</span>
              </button>
            </div>

            {/* Doctor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 hover:border-emerald-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center text-slate-400">
                        {doc.photoUrl ? (
                          <img
                            src={doc.photoUrl}
                            alt={doc.doctorName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{doc.doctorName}</h3>
                        <span className="text-xs font-bold text-emerald-700 block mt-0.5">{doc.poliName}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        doc.status === 'Ada' || doc.status === 'Praktik'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                    <div className="flex items-center justify-between">
                      <span>Spesialisasi:</span>
                      <span className="font-bold text-slate-800">{doc.specialty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Hari Praktik:</span>
                      <span className="font-bold text-slate-800">
                        {Array.isArray(doc.days) ? doc.days.join(', ') : doc.days}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Jam Layanan:</span>
                      <span className="font-bold text-slate-800">{doc.hours}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Kuota Harian:</span>
                      <span className="font-bold text-emerald-700">{doc.quotaPerDay} Pasien</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditDoctor(doc)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-200 transition flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doc.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: ANTREAN MANAGEMENT */}
        {activeMenu === 'antrean' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Pemanggilan & Manajemen Antrean Loket
                </h2>
                <p className="text-xs text-slate-500">
                  Panggil antrean, update status pasien, dan cetak tiket walk-in
                </p>
              </div>
            </div>

            {/* Caller Header Card */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                    Loket Panggilan Antrean Poliklinik
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">Poli: {currentPoli.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedPoliId}
                    onChange={(e) => setSelectedPoliId(e.target.value)}
                    className="px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-bold"
                  >
                    {polis.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                    ))}
                  </select>

                  <button
                    onClick={handleCallNext}
                    disabled={waitingTickets.length === 0}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2"
                  >
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>PANGGIL SEKARANG</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Nomor Sedang Dipanggil:</span>
                  <span className="text-3xl font-mono font-extrabold text-emerald-400">
                    {calledTicket ? calledTicket.queueNumber : 'BELUM ADA'}
                  </span>
                </div>
                {calledTicket && (
                  <div className="text-right text-xs text-slate-300">
                    <div className="font-bold text-white">{calledTicket.fullName}</div>
                    <div>NIK: {calledTicket.nik}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-bold uppercase">
                  <tr>
                    <th className="p-3">No Tiket</th>
                    <th className="p-3">Nama Pasien</th>
                    <th className="p-3">Poli</th>
                    <th className="p-3">Tipe</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Ubah Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-extrabold text-slate-900">{t.queueNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{t.fullName}</div>
                        <div className="text-[10px] text-slate-400">NIK: {t.nik}</div>
                      </td>
                      <td className="p-3 text-slate-700">{t.poliName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[10px]">
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
                      <td className="p-3 text-right">
                        <select
                          value={t.status}
                          onChange={(e) => onUpdateStatus(t.id, e.target.value as QueueStatus)}
                          className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-[11px] font-bold"
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

        {/* VIEW 5: LAYANAN POLIKLINIK MANAGEMENT */}
        {activeMenu === 'layanan' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Daftar Layanan Poliklinik & Persyaratan
                </h2>
                <p className="text-xs text-slate-500">
                  Kelola nama poliklinik, persyaratan berkas, jam operasional, dan batas kuota harian
                </p>
              </div>

              <button
                onClick={handleOpenAddPoli}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Layanan Poli Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {polis.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-emerald-300 transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase rounded">
                        Poli {p.code}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{p.room}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.description}</p>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 font-medium text-slate-700 border border-slate-100">
                      <div className="flex justify-between">
                        <span>Dokter Penjawab:</span>
                        <span className="font-bold text-slate-900">{p.doctorName || 'dr. H. Bambang'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jam Operational:</span>
                        <span className="font-bold text-slate-900">{p.operationalHours || '08:00 - 14:00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Biaya Layanan:</span>
                        <span className="font-bold text-emerald-700">{p.feeGeneral || 'Gratis BPJS'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kuota Maksimal:</span>
                        <span className="font-bold text-emerald-700">{p.maxQuota || 40} Pasien / Hari</span>
                      </div>
                    </div>

                    {/* Requirements Display */}
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs space-y-1">
                      <span className="font-extrabold text-amber-900 text-[11px] block">Persyaratan Berkas:</span>
                      {Array.isArray(p.requirements) ? (
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                          {p.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-700 text-[11px]">{p.requirements || '1. KTP 2. Kartu BPJS 3. Kartu Berobat'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditPoli(p)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-200 transition flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Poli</span>
                    </button>
                    <button
                      onClick={() => handleDeletePoli(p.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: PESAN MASUK & BALASAN */}
        {activeMenu === 'pesan' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Pesan & Pertanyaan Masuk Dari Masyarakat
                </h2>
                <p className="text-xs text-slate-500">
                  Layanan komunikasi, pelacakan status 'Telah Dibaca', dan fitur kirim balasan oleh Admin / Petugas Puskesmas
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  Total {messages.length} Pesan
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  {messages.filter(m => m.read).length} Telah Dibaca
                </span>
                <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                  {messages.filter(m => !m.read).length} Belum Dibaca
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  {messages.filter(m => !m.reply).length} Belum Dibalas
                </span>
              </div>
            </div>

            {/* Message Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setMessageFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
                  messageFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Pesan ({messages.length})
              </button>

              <button
                onClick={() => setMessageFilter('unread')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
                  messageFilter === 'unread'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                • Belum Dibaca ({messages.filter(m => !m.read).length})
              </button>

              <button
                onClick={() => setMessageFilter('read')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
                  messageFilter === 'read'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                ✓ Telah Dibaca ({messages.filter(m => m.read).length})
              </button>

              <button
                onClick={() => setMessageFilter('unreplied')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
                  messageFilter === 'unreplied'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                ⏳ Belum Dibalas ({messages.filter(m => !m.reply).length})
              </button>
            </div>

            <div className="space-y-4">
              {messages
                .filter(m => {
                  if (messageFilter === 'unread') return !m.read;
                  if (messageFilter === 'read') return m.read;
                  if (messageFilter === 'unreplied') return !m.reply;
                  return true;
                })
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-white p-5 rounded-2xl border ${
                      !msg.read ? 'border-rose-300 ring-1 ring-rose-200/50 bg-rose-50/10' : 'border-slate-200'
                    } shadow-2xs space-y-3 hover:border-emerald-300 transition`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">{msg.name}</span>

                        {/* Status Telah Dibaca Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 ${
                            msg.read
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                          }`}
                        >
                          {msg.read ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                              <span>Telah Dibaca</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3 text-rose-600" />
                              <span>Belum Dibaca</span>
                            </>
                          )}
                        </span>

                        {/* Status Balasan Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            msg.reply
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {msg.reply ? '✓ Sudah Dibalas' : '• Belum Dibalas'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
                        <span className="text-slate-400 font-medium">{msg.date}</span>

                        {/* Action to Toggle Read State */}
                        <button
                          onClick={() => handleToggleRead(msg.id)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition ${
                            msg.read
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
                              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-2xs'
                          }`}
                        >
                          {msg.read ? 'Tandai Belum Dibaca' : 'Tandai Telah Dibaca'}
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-emerald-700">{msg.subject}</div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      "{msg.message}"
                    </p>

                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Email: <strong className="text-slate-700">{msg.email}</strong></span>
                      <span>•</span>
                      <span>No HP: <strong className="text-slate-700">{msg.phone}</strong></span>
                    </div>

                    {/* Display Admin Reply if Exists */}
                    {msg.reply && (
                      <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200/80 space-y-1 mt-2">
                        <div className="flex items-center justify-between text-[11px] text-emerald-900 font-bold">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Balasan Resmi Admin Puskesmas:</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 font-normal">{msg.repliedAt}</span>
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed pt-1">{msg.reply}</p>
                      </div>
                    )}

                    {/* Reply Action Form */}
                    {replyingMsgId === msg.id ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 mt-3 animate-fadeIn">
                        <label className="block text-xs font-bold text-slate-800">Tuliskan Pesan Balasan:</label>
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Tuliskan tanggapan resmi untuk Sdr/i ${msg.name}...`}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setReplyingMsgId(null)}
                            className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSendReply(msg.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Kirim Balasan & Tandai Dibaca</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setReplyingMsgId(msg.id);
                            setReplyText(msg.reply || '');
                            if (!msg.read) {
                              handleToggleRead(msg.id);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{msg.reply ? 'Edit Balasan' : 'Balas Pesan Ini'}</span>
                        </button>
                      </div>
                    )}

                  </div>
                ))}
            </div>
          </div>
        )}

        {/* VIEW 7: TESTIMONI & SURVEI IKM */}
        {activeMenu === 'testimoni' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Hasil Ulasan & Testimoni Masyarakat (IKM)
              </h2>
              <p className="text-xs text-slate-500">
                Evaluasi indeks kepuasan masyarakat terhadap mutu layanan Puskesmas
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
              <span className="text-xs font-bold uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Indeks Kepuasan Masyarakat (IKM) - Mutu Sangat Baik
              </span>
              <div className="text-4xl font-extrabold text-slate-900 font-mono">4.9 / 5.0</div>
              <p className="text-xs text-slate-500">Berdasarkan ulasan berkala pasien Puskesmas Pondok Benda</p>
            </div>
          </div>
        )}

        {/* VIEW 8: MONITOR ANTREAN & PANGGILAN TV (SEMUA POLI) */}
        {activeMenu === 'monitor' && (
          <div className="space-y-6">
            
            {/* Alert Notification */}
            {backupAlert && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border animate-fadeIn ${
                backupAlert.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{backupAlert.text}</span>
                </div>
                <button onClick={() => setBackupAlert(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* View Header & Action Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Monitor Panggilan TV & Antrean (Semua Poli)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tampilan display panggilan pasien otomatis dengan fitur panggilan suara (TTS) untuk seluruh Poliklinik Puskesmas
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {/* Audio Test Button */}
                <button
                  onClick={handleTestAudio}
                  className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-xs"
                  title="Uji Panggilan Suara Speaker"
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Uji Panggilan Suara</span>
                </button>

                {/* Audio Mute/Unmute Toggle */}
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className={`px-3 py-2.5 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border ${
                    isAudioEnabled
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                  title={isAudioEnabled ? 'Suara Aktif' : 'Suara Dimatikan'}
                >
                  {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{isAudioEnabled ? 'Suara Aktif' : 'Suara Muted'}</span>
                </button>

                {/* Fullscreen TV Mode Toggle */}
                <button
                  onClick={() => setIsFullscreenTv(!isFullscreenTv)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
                >
                  <Tv className="w-4 h-4" />
                  <span>{isFullscreenTv ? 'Keluar Mode TV' : 'Tampilan Fullscreen TV'}</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Poli</span>
                  <div className="text-xl font-black text-slate-900">{polis.length} Poliklinik</div>
                </div>
                <Building2 className="w-7 h-7 text-emerald-600/30" />
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">Sedang Dipanggil</span>
                  <div className="text-xl font-black text-amber-900">
                    {tickets.filter(t => t.status === 'Called').length} Pasien
                  </div>
                </div>
                <Radio className="w-7 h-7 text-amber-600/40 animate-pulse" />
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Antrean Menunggu</span>
                  <div className="text-xl font-black text-slate-900">
                    {tickets.filter(t => t.status === 'Waiting').length} Pasien
                  </div>
                </div>
                <Users className="w-7 h-7 text-emerald-600/30" />
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Selesai Hari Ini</span>
                  <div className="text-xl font-black text-emerald-900">
                    {tickets.filter(t => t.status === 'Completed').length} Pasien
                  </div>
                </div>
                <CheckCircle2 className="w-7 h-7 text-emerald-600/40" />
              </div>
            </div>

            {/* Poli Filter Dropdown */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Filter Poliklinik:</span>
              </div>
              <select
                value={selectedMonitorPoli}
                onChange={(e) => setSelectedMonitorPoli(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="all">Tampilkan Semua Poli ({polis.length} Poliklinik)</option>
                {polis.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.room})</option>
                ))}
              </select>
            </div>

            {/* MAIN TV MONITOR GRID: ALL POLI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {polis
                .filter(p => selectedMonitorPoli === 'all' || p.id === selectedMonitorPoli)
                .map((p) => {
                  const activeTkt = tickets.find(t => t.poliId === p.id && t.status === 'Called');
                  const waitingTkts = tickets.filter(t => t.poliId === p.id && t.status === 'Waiting');
                  const completedCount = tickets.filter(t => t.poliId === p.id && t.status === 'Completed').length;
                  const nextWaiting = waitingTkts.length > 0 ? waitingTkts[waitingTkts.length - 1] : null;

                  return (
                    <div
                      key={p.id}
                      className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-xs flex flex-col justify-between ${
                        activeTkt
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Poli Header */}
                      <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-600 text-white font-extrabold text-[10px] rounded-md">
                              KODE {p.queuePrefix}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{p.room}</span>
                          </div>
                          <h3 className="text-base font-black text-white mt-1 line-clamp-1">{p.name}</h3>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="line-clamp-1">{p.doctorName}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="px-2.5 py-1 bg-slate-800 text-emerald-400 border border-slate-700 rounded-lg text-[10px] font-extrabold">
                            {waitingTkts.length} Menunggu
                          </span>
                        </div>
                      </div>

                      {/* Active Called Queue Number Display */}
                      <div className="p-6 text-center space-y-4 bg-slate-950 text-white">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                          NOMOR DIPANGGIL SAAT INI
                        </span>

                        {activeTkt ? (
                          <div className="space-y-2 animate-pulse">
                            <div className="text-5xl font-black font-mono tracking-tight text-emerald-400">
                              {activeTkt.queueNumber}
                            </div>
                            <div className="text-xs font-bold text-white line-clamp-1">
                              {activeTkt.fullName} ({activeTkt.patientType})
                            </div>
                            <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold rounded-full">
                              ● SEDANG DIPANGGIL SUARA
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1 py-2">
                            <div className="text-4xl font-black font-mono text-slate-700">
                              {nextWaiting ? nextWaiting.queueNumber : '-'}
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {nextWaiting ? 'Siap Dipanggil Berikutnya' : 'Tidak Ada Antrean Menunggu'}
                            </p>
                          </div>
                        )}

                        {/* Next Waiting Pills */}
                        {waitingTkts.length > 0 && (
                          <div className="pt-2 border-t border-slate-800">
                            <span className="text-[10px] text-slate-400 block mb-1.5 font-semibold">Antrean Selanjutnya:</span>
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {waitingTkts.slice(-4).reverse().map((t) => (
                                <span key={t.id} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[10px] font-mono font-bold">
                                  {t.queueNumber}
                                </span>
                              ))}
                              {waitingTkts.length > 4 && (
                                <span className="text-[10px] text-slate-500 font-bold">
                                  +{waitingTkts.length - 4} lagi
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Call Controls for Doctors & Admin */}
                      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCallNextForPoli(p.id)}
                            disabled={waitingTkts.length === 0}
                            className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                              waitingTkts.length > 0
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>Panggil Pasien Berikutnya</span>
                          </button>

                          <button
                            onClick={() => handleRecallForPoli(p.id)}
                            disabled={!activeTkt}
                            className={`p-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center ${
                              activeTkt
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                            title="Panggil Ulang Suara"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <button
                            onClick={() => handleCompleteForPoli(p.id)}
                            disabled={!activeTkt}
                            className={`flex items-center gap-1 font-bold ${
                              activeTkt ? 'text-emerald-700 hover:text-emerald-900' : 'text-slate-300'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tandai Selesai</span>
                          </button>

                          <button
                            onClick={() => handleSkipForPoli(p.id)}
                            disabled={!activeTkt}
                            className={`flex items-center gap-1 font-bold ${
                              activeTkt ? 'text-rose-600 hover:text-rose-800' : 'text-slate-300'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Lewati / Batal</span>
                          </button>

                          <span className="text-[10px] text-slate-400 font-semibold">
                            {completedCount} Selesai
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
            </div>

            {/* FULLSCREEN TV DISPLAY OVERLAY */}
            {isFullscreenTv && (
              <div className="fixed inset-0 z-50 bg-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between overflow-y-auto animate-fadeIn">
                
                {/* Header TV Screen */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                  <div className="flex items-center gap-4">
                    <PuskesmasLogo className="w-12 h-12" />
                    <div>
                      <span className="text-xs font-bold uppercase text-emerald-400 tracking-widest block">
                        UPTD PUSKESMAS PONDOK BENDA KOTA TANGERANG SELATAN
                      </span>
                      <h1 className="text-3xl font-black text-white">DISPLAY MONITOR ANTREAN DIPANGGIL</h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-mono font-bold text-amber-400 block">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="text-xs text-slate-400">Jam Operasional: 07.30 - 14.00 WIB</span>
                    </div>

                    <button
                      onClick={() => setIsFullscreenTv(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold rounded-xl transition border border-slate-700 flex items-center gap-2"
                    >
                      <Minimize2 className="w-4 h-4" />
                      <span>Tutup Mode TV</span>
                    </button>
                  </div>
                </div>

                {/* Running Marquee Text */}
                <div className="my-4 p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl overflow-hidden flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-black text-[10px] rounded-lg shrink-0 uppercase tracking-wider">
                    PEMBERITAHUAN
                  </span>
                  <marquee className="text-xs font-bold text-emerald-200">
                    Selamat datang di Puskesmas Pondok Benda Tangsel. Mohon persiapkan KTP / Kartu BPJS Kesehatan saat nomor antrean Anda dipanggil. Bagi pasien lansia & disabilitas disediakan kuota diprioritaskan. Terima kasih atas ketertiban Anda.
                  </marquee>
                </div>

                {/* TV Grid: ALL POLI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4 flex-1">
                  {polis.map((p) => {
                    const activeTkt = tickets.find(t => t.poliId === p.id && t.status === 'Called');
                    const waitingCount = tickets.filter(t => t.poliId === p.id && t.status === 'Waiting').length;

                    return (
                      <div
                        key={p.id}
                        className={`bg-slate-900 rounded-3xl p-6 border flex flex-col justify-between text-center transition-all ${
                          activeTkt ? 'border-emerald-500 bg-slate-900/90 shadow-2xl ring-4 ring-emerald-500/20' : 'border-slate-800'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 bg-slate-800 text-amber-400 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                            Poli {p.name}
                          </span>
                          <p className="text-xs text-slate-400 font-semibold">{p.room}</p>
                        </div>

                        <div className="my-6 space-y-2">
                          <div className="text-6xl font-black font-mono text-emerald-400 tracking-tight">
                            {activeTkt ? activeTkt.queueNumber : '-'}
                          </div>
                          {activeTkt ? (
                            <div className="text-xs font-extrabold text-white line-clamp-1 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                              {activeTkt.fullName}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500">Antrean Menunggu: {waitingCount} Pasien</div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleCallNextForPoli(p.id)}
                            disabled={waitingCount === 0}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1 disabled:opacity-30"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Panggil</span>
                          </button>
                          {activeTkt && (
                            <button
                              onClick={() => handleRecallForPoli(p.id)}
                              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Ulang</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Footer TV */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Puskesmas Pondok Benda Tangsel - Pelayanan Kesehatan Terpadu Masyarakat</span>
                  <span>Call Center / WA: 0812-9876-5432</span>
                </div>

              </div>
            )}

          </div>
        )}

        {/* VIEW 9: SISTEM CADANGAN DATA (BACKUP & RECOVERY) */}
        {activeMenu === 'cadangan' && (
          <div className="space-y-6">

            {/* Alert Message Banner */}
            {backupAlert && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border animate-fadeIn ${
                backupAlert.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{backupAlert.text}</span>
                </div>
                <button onClick={() => setBackupAlert(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* View Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Database className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Sistem Cadangan & Pemulihan Data (Backup & Recovery)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Fasilitas keamanan data resmi untuk mencadangkan (backup) dan memulihkan (restore) data dokter, artikel berita, dan layanan poliklinik jika terjadi kesalahan input atau terhapus secara tidak sengaja.
              </p>
            </div>

            {/* Data Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Daftar Dokter</span>
                <div className="text-2xl font-black text-slate-900">{doctors.length} Dokter</div>
                <p className="text-[11px] text-slate-500">Terdaftar di Jadwal Praktik Puskesmas</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Artikel & Video</span>
                <div className="text-2xl font-black text-slate-900">{articles.length} Konten Artikel</div>
                <p className="text-[11px] text-slate-500">Termasuk Berita & Video Edukasi B3/Code Red</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Poliklinik & Layanan</span>
                <div className="text-2xl font-black text-slate-900">{polis.length} Poli Service</div>
                <p className="text-[11px] text-slate-500">Layanan kesehatan terpadu</p>
              </div>
            </div>

            {/* Main Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* ACTION CARD 1: EXPORT SQL DATABASE FOR MYSQL / PHPMYADMIN */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl border border-slate-700 space-y-4 shadow-md flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">Database MySQL / phpMyAdmin</h3>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30">.SQL</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unduh file <code className="text-emerald-400 font-mono">puskesmas_pondokbenda.sql</code> lengkap dengan skema tabel, relasi, dan data awal untuk diimpor ke MySQL atau phpMyAdmin (XAMPP / Laragon / cPanel).
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href="/database_mysql_phpmyadmin.zip"
                    download="database_mysql_phpmyadmin.zip"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>UNDUH DATABASE (.ZIP)</span>
                  </a>
                  <a
                    href="/api/backup/export-sql"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-extrabold text-[11px] rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Unduh File Raw .SQL</span>
                  </a>
                </div>
              </div>

              {/* ACTION CARD 2: EXPORT SOURCE CODE ZIP */}
              <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-800/60 space-y-4 shadow-md flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">Source Code Website</h3>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-500/30">.ZIP</span>
                  </div>
                  <p className="text-xs text-indigo-200/80 leading-relaxed">
                    Unduh seluruh source code aplikasi website Puskesmas (React, TypeScript, Express Server, Tailwind CSS, & komponen UI) lengkap dalam arsip ZIP.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href="/puskesmas_pondokbenda_app.zip"
                    download="puskesmas_pondokbenda_app.zip"
                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>UNDUH SOURCE CODE (.ZIP)</span>
                  </a>
                </div>
              </div>

              {/* ACTION CARD 3: EXPORT BACKUP JSON */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">3. Unduh Backup JSON</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Unduh berkas JSON berisi seluruh data dokter, artikel, berita, video edukasi, dan poliklinik saat ini. Simpan file ini di komputer Anda secara berkala.
                  </p>
                </div>

                <button
                  onClick={handleDownloadBackup}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>UNDUH BACKUP (JSON)</span>
                </button>
              </div>

              {/* ACTION CARD 4: IMPORT / RESTORE BACKUP FILE */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">3. Pulihkan Data dari JSON</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Unggah file backup JSON yang pernah diunduh sebelumnya untuk mengembalikan data dokter, artikel, atau poliklinik yang terhapus atau salah diedit.
                  </p>
                </div>

                <label className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>PILIH FILE BACKUP DARI KOMPUTER</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreFromFile}
                    className="hidden"
                  />
                </label>
              </div>

            </div>

            {/* SECTION 3: SNAPSHOT CADANGAN LOKAL */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6 shadow-2xs">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Save className="w-4 h-4 text-emerald-600" />
                  <span>3. Snapshot Cadangan Lokal (Memori Browser)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Buat titik pemulihan cepat secara langsung di browser tanpa perlu mengunduh file.
                </p>
              </div>

              {/* Create Snapshot Form */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={snapshotNameInput}
                  onChange={(e) => setSnapshotNameInput(e.target.value)}
                  placeholder="Nama Catatan Snapshot (Contoh: Sebelum Edit Jadwal Dokter)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  onClick={handleCreateSnapshot}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition shrink-0 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Buat Snapshot Baru</span>
                </button>
              </div>

              {/* Snapshots Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white font-bold uppercase">
                    <tr>
                      <th className="p-3.5">Nama Snapshot</th>
                      <th className="p-3.5">Waktu Dibuat</th>
                      <th className="p-3.5">Rincian Data</th>
                      <th className="p-3.5 text-right">Aksi Pemulihan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {backupSnapshots.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 text-xs">
                          Belum ada snapshot lokal tersimpan. Klik tombol "Buat Snapshot Baru" di atas untuk menyimpan titik pemulihan.
                        </td>
                      </tr>
                    ) : (
                      backupSnapshots.map((snap) => (
                        <tr key={snap.id} className="hover:bg-slate-50 transition">
                          <td className="p-3.5 font-bold text-slate-900">{snap.name}</td>
                          <td className="p-3.5 text-slate-500">{snap.date}</td>
                          <td className="p-3.5 text-slate-600">
                            {snap.doctorCount} Dokter • {snap.articleCount} Artikel • {snap.poliCount} Poli
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleRestoreSnapshot(snap)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-lg text-xs transition"
                            >
                              Pulihkan Snapshot
                            </button>
                            <button
                              onClick={() => handleDeleteSnapshot(snap.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                              title="Hapus Snapshot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 4: FACTORY RESET (STANDAR AWAL PABRIK) */}
            <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-rose-100 text-rose-800 rounded-2xl shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-rose-950">
                    4. Kembalikan Data ke Standar Awal Pabrik (Factory Reset)
                  </h3>
                  <p className="text-xs text-rose-800/80 leading-relaxed mt-1">
                    Fitur ini akan mereset seluruh daftar dokter, artikel (termasuk Video Simulasi B3 & Code Red), serta layanan poliklinik kembali ke standar awal saat pertama kali sistem dibuat. Gunakan jika data rusak parah.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESET SELURUH DATA KE STANDAR AWAL</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL: ADD / EDIT ARTICLE */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden relative">
            
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold">
                  {editingArticle ? 'Edit Artikel / Video Edukasi' : 'Tambah Artikel / Video Baru'}
                </h3>
                <p className="text-xs text-slate-400">Form pengisian berita & media edukasi kesehatan</p>
              </div>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Artikel / Video</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="Contoh: Panduan Cuci Tangan 6 Langkah"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="Video Edukasi">Video Edukasi</option>
                    <option value="Edukasi">Edukasi</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Posyandu">Posyandu</option>
                    <option value="Vaksinasi">Vaksinasi</option>
                    <option value="Tips Sehat">Tips Sehat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Penulis / Sumber</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Media Options: Upload Photo or Insert Link */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold text-slate-900 block">Pilihan Media & Gambar (Galeri / Link Video):</span>

                {/* Cover Image Preview & Gallery File Picker */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-xl overflow-hidden shrink-0 border border-slate-300 relative">
                    {articleForm.imageUrl ? (
                      <img src={articleForm.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">Belum ada</div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <label htmlFor="article-file-upload" className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2 cursor-pointer shadow-xs">
                      <PlusCircle className="w-4 h-4" />
                      <span>Pilih Foto dari Galeri / Device</span>
                    </label>
                    <input
                      id="article-file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleArticlePhotoUpload}
                      className="hidden"
                    />
                    <p className="text-[10px] text-slate-500">Mendukung format JPG, PNG, WEBP dari HP/Laptop</p>
                  </div>
                </div>

                {/* Auto YouTube / Instagram Link Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Atau Masukkan Link Video (YouTube / Instagram)
                  </label>
                  <input
                    type="text"
                    value={articleForm.videoUrl}
                    onChange={(e) => handleParseVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600"
                  />
                  <p className="text-[10px] text-emerald-700 mt-1 font-semibold">
                    *Link YouTube otomatis menarik thumbnail gambar dan mengaktifkan player video secara otomatis.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">URL Gambar Manual</label>
                  <input
                    type="text"
                    value={articleForm.imageUrl}
                    onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat (Snippet)</label>
                <input
                  type="text"
                  value={articleForm.snippet}
                  onChange={(e) => setArticleForm({ ...articleForm, snippet: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Isi Konten Lengkap</label>
                <textarea
                  rows={4}
                  required
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Tuliskan isi artikel / narasi edukasi di sini..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Simpan Artikel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT DOCTOR */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden relative">
            
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold">
                  {editingDoctor ? 'Edit Jadwal & Foto Dokter' : 'Tambah Dokter Baru'}
                </h3>
                <p className="text-xs text-slate-400">Pengaturan profil dan foto resmi dokter bertugas</p>
              </div>
              <button
                onClick={() => setIsDoctorModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Dokter & Gelar</label>
                <input
                  type="text"
                  required
                  value={doctorForm.doctorName}
                  onChange={(e) => setDoctorForm({ ...doctorForm, doctorName: e.target.value })}
                  placeholder="Contoh: dr. H. Ahmad Fauzi, Sp.PD"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              {/* Doctor Photo Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold text-slate-900 block">Foto Dokter (Galeri / Upload / Preset):</span>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-300 overflow-hidden shrink-0 shadow-2xs flex items-center justify-center text-slate-400">
                    {doctorForm.photoUrl ? (
                      <img
                        src={doctorForm.photoUrl}
                        alt="Preview Dokter"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label htmlFor="doctor-photo-upload" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2 cursor-pointer shadow-xs">
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Pilih Foto dari Galeri</span>
                      </label>
                      {doctorForm.photoUrl && (
                        <button
                          type="button"
                          onClick={() => setDoctorForm({ ...doctorForm, photoUrl: '' })}
                          className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl transition inline-flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Hapus Foto</span>
                        </button>
                      )}
                    </div>
                    <input
                      id="doctor-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleDoctorPhotoUpload}
                      className="hidden"
                    />
                    <p className="text-[10px] text-slate-500">Biarkan kosong jika tidak ingin menggunakan foto profil</p>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-600 block">Preset Foto Profesional:</span>
                  <div className="flex items-center gap-2">
                    {[
                      { name: 'Dokter Pria 1', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300' },
                      { name: 'Dokter Pria 2', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300' },
                      { name: 'Dokter Wanita 1', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300' },
                      { name: 'Dokter Wanita 2', url: 'https://images.unsplash.com/photo-1594824813566-788530791f4d?auto=format&fit=crop&q=80&w=300' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDoctorForm({ ...doctorForm, photoUrl: preset.url })}
                        className="w-9 h-9 rounded-xl border border-slate-300 overflow-hidden hover:scale-105 transition"
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={doctorForm.photoUrl}
                    onChange={(e) => setDoctorForm({ ...doctorForm, photoUrl: e.target.value })}
                    placeholder="Atau tempelkan URL Foto (https://...)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Poliklinik</label>
                  <select
                    value={doctorForm.poliId}
                    onChange={(e) => {
                      const p = polis.find(x => x.id === e.target.value);
                      setDoctorForm({
                        ...doctorForm,
                        poliId: e.target.value,
                        poliName: p ? p.name : 'Poli'
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    {polis.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kehadiran</label>
                  <select
                    value={doctorForm.status}
                    onChange={(e) => setDoctorForm({ ...doctorForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="Hadir">Hadir / Bertugas</option>
                    <option value="Pengganti">Dokter Pengganti</option>
                    <option value="Cuti">Cuti / Tidak Hadir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Spesialisasi / Gelar</label>
                <input
                  type="text"
                  value={doctorForm.specialty}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                  placeholder="Spesialis Penyakit Dalam / Dokter Umum"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hari Praktik (pisahkan koma)</label>
                  <input
                    type="text"
                    value={doctorForm.days}
                    onChange={(e) => setDoctorForm({ ...doctorForm, days: e.target.value })}
                    placeholder="Senin, Selasa, Rabu"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Layanan</label>
                  <input
                    type="text"
                    value={doctorForm.hours}
                    onChange={(e) => setDoctorForm({ ...doctorForm, hours: e.target.value })}
                    placeholder="08:00 - 12:00 WIB"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kuota Pasien Per Hari</label>
                <input
                  type="number"
                  value={doctorForm.quotaPerDay}
                  onChange={(e) => setDoctorForm({ ...doctorForm, quotaPerDay: Number(e.target.value) })}
                  placeholder="30"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Simpan Data Dokter
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT POLIKLINIK & LAYANAN */}
      {isPoliModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden relative">
            
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold">
                  {editingPoli ? 'Edit Layanan Poliklinik' : 'Tambah Poliklinik Baru'}
                </h3>
                <p className="text-xs text-slate-400">Pengaturan poli, jam operasional, dan syarat berkas</p>
              </div>
              <button
                onClick={() => setIsPoliModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePoli} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Poliklinik</label>
                  <input
                    type="text"
                    required
                    value={poliForm.name}
                    onChange={(e) => setPoliForm({ ...poliForm, name: e.target.value })}
                    placeholder="Contoh: Poli Mata / THT"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kode Poli</label>
                  <input
                    type="text"
                    required
                    value={poliForm.code}
                    onChange={(e) => setPoliForm({ ...poliForm, code: e.target.value.toUpperCase() })}
                    placeholder="G, H, I..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Ruangan</label>
                  <input
                    type="text"
                    value={poliForm.room}
                    onChange={(e) => setPoliForm({ ...poliForm, room: e.target.value })}
                    placeholder="Lantai 1 - Ruang 105"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dokter Penanggung Jawab</label>
                  <input
                    type="text"
                    value={poliForm.doctorName}
                    onChange={(e) => setPoliForm({ ...poliForm, doctorName: e.target.value })}
                    placeholder="dr. H. Ahmad Fauzi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Operational</label>
                  <input
                    type="text"
                    value={poliForm.operatingHours}
                    onChange={(e) => setPoliForm({ ...poliForm, operatingHours: e.target.value })}
                    placeholder="Senin - Sabtu (08:00 - 14:00)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kuota Harian Pasien</label>
                  <input
                    type="number"
                    value={poliForm.maxQuota}
                    onChange={(e) => setPoliForm({ ...poliForm, maxQuota: Number(e.target.value) })}
                    placeholder="40"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Biaya Layanan</label>
                <input
                  type="text"
                  value={poliForm.feeGeneral}
                  onChange={(e) => setPoliForm({ ...poliForm, feeGeneral: e.target.value })}
                  placeholder="Gratis (BPJS) / Rp 10.000 (Umum)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Persyaratan Layanan (Pisahkan per Baris)</label>
                <textarea
                  rows={3}
                  value={poliForm.requirements}
                  onChange={(e) => setPoliForm({ ...poliForm, requirements: e.target.value })}
                  placeholder="1. KTP / NIK Tangsel&#10;2. Kartu BPJS Kesehatan&#10;3. Kartu Berobat Puskesmas"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Layanan</label>
                <textarea
                  rows={2}
                  value={poliForm.description}
                  onChange={(e) => setPoliForm({ ...poliForm, description: e.target.value })}
                  placeholder="Deskripsi singkat mengenai jenis pemeriksaan..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPoliModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Simpan Layanan Poli
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: FACTORY RESET CONFIRMATION */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-rose-200 overflow-hidden relative p-6 space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Konfirmasi Reset Pabrik</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin mengembalikan seluruh data dokter, artikel (termasuk Video Simulasi B3, Code Red, Code Blue), dan layanan ke standar awal pabrik?
              </p>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl text-[11px] font-bold text-rose-800 text-left border border-rose-200">
              ⚠️ Perhatian: Seluruh data saat ini akan disinkronkan kembali dengan data awal pabrik.
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleFactoryReset}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
