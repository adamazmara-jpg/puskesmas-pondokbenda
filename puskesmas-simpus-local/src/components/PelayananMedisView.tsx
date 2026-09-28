import React, { useState, useEffect, useMemo } from 'react';
import {
  Stethoscope,
  Users,
  Volume2,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Pill,
  FileText,
  AlertCircle,
  Activity,
  HeartPulse,
  Send,
  Sparkles,
  Search,
  UserCheck,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Filter,
  User,
  ShieldAlert,
  ArrowRight,
  BadgeCheck,
  RefreshCw,
  Lock,
  ArrowRightLeft
} from 'lucide-react';
import { PoliService, QueueTicket, DoctorSchedule, VitalSigns, PrescriptionItem, Gender, PatientType } from '../types';
import { INITIAL_DOCTORS } from '../data/mockData';
import { addPrescription } from '../data/prescriptionDatabase';
import { addOrUpdateRmeRecord } from '../data/rmeDatabase';
import { PatientFlowPipelineBar } from './PatientFlowPipelineBar';

interface PelayananMedisViewProps {
  polis: PoliService[];
  tickets: QueueTicket[];
  doctors?: DoctorSchedule[];
  onUpdateTicketStatus: (ticketId: string, status: any) => void;
  onRefresh?: () => void;
  onNavigateFlow?: (stage: 'loket' | 'dokter' | 'farmasi') => void;
}

// 5 Klasifikasi Klaster Integrasi Layanan Primer (ILP) Puskesmas Pondok Benda
export interface KlasterMeta {
  number: number;
  name: string;
  shortName: string;
  category: string;
  badge: string;
  tagline: string;
  description: string;
  color: 'blue' | 'pink' | 'emerald' | 'amber' | 'purple';
  bgBadge: string;
  borderBadge: string;
  bgGradient: string;
  activeBorder: string;
  lightBg: string;
  avatarBg: string;
  avatarIconColor: string;
  commonDiagnoses: { code: string; name: string }[];
  commonMedicines: { medicineName: string; dosage: string; quantity: number; notes: string }[];
}

export const KLASTER_CONFIGS: KlasterMeta[] = [
  {
    number: 1,
    name: 'Klaster 1: Manajemen & Tata Kelola',
    shortName: 'Klaster 1 (Manajemen)',
    category: 'Manajemen & Rujukan',
    badge: 'Klaster 1',
    tagline: 'Ketatausahaan, Manajemen Mutu, Rujukan & Rekam Medis',
    description: 'Pelayanan administrasi kesehatan, rujukan antar fasilitas faskes, serta manajemen tata kelola mutu pelayanan Puskesmas.',
    color: 'blue',
    bgBadge: 'bg-blue-100 text-blue-900 border-blue-300',
    borderBadge: 'border-blue-300',
    bgGradient: 'from-blue-700 to-indigo-800',
    activeBorder: 'border-blue-600 ring-2 ring-blue-500/20',
    lightBg: 'bg-blue-50/70 border-blue-200',
    avatarBg: 'bg-blue-50 border-blue-200 text-blue-700',
    avatarIconColor: 'text-blue-600',
    commonDiagnoses: [
      { code: 'Z00.0', name: 'Pemeriksaan Kesehatan Umum / Medical Check Up' },
      { code: 'Z02.1', name: 'Pemeriksaan Kesehatan untuk Persyaratan Kerja / Sekolah' },
      { code: 'Z01.0', name: 'Pemeriksaan Kelayakan Rujukan Faskes Lanjutan' },
      { code: 'Z76.0', name: 'Penerbitan Surat Keterangan Dokter / Konsultasi Sehat' }
    ],
    commonMedicines: [
      { medicineName: 'Multivitamin B Kompleks', dosage: '1 x 1 tablet sesudah makan', quantity: 15, notes: 'Meningkatkan stamina' },
      { medicineName: 'Vitamin C 500 mg Tablet', dosage: '1 x 1 tablet sesudah makan', quantity: 15, notes: 'Daya tahan tubuh' },
      { medicineName: 'Paracetamol 500 mg Tablet', dosage: '3 x 1 tablet (bila demam/pusing)', quantity: 10, notes: 'Sesudah makan' }
    ]
  },
  {
    number: 2,
    name: 'Klaster 2: Ibu, Anak, dan Remaja',
    shortName: 'Klaster 2 (Ibu & Anak)',
    category: 'KIA, KB & Anak',
    badge: 'Klaster 2',
    tagline: 'Pelayanan Ibu Hamil (ANC), Nifas, Balita, MTBS, Imunisasi & KB',
    description: 'Pelayanan terpadu kesehatan ibu hamil, tumbuh kembang bayi dan balita, pemeriksaan MTBS anak sakit, serta program KB & imunisasi.',
    color: 'pink',
    bgBadge: 'bg-pink-100 text-pink-900 border-pink-300',
    borderBadge: 'border-pink-300',
    bgGradient: 'from-pink-700 to-rose-800',
    activeBorder: 'border-pink-600 ring-2 ring-pink-500/20',
    lightBg: 'bg-pink-50/70 border-pink-200',
    avatarBg: 'bg-pink-50 border-pink-200 text-pink-700',
    avatarIconColor: 'text-pink-600',
    commonDiagnoses: [
      { code: 'Z34.9', name: 'Pemeriksaan Kehamilan Normal (ANC Terpadu)' },
      { code: 'J06.9', name: 'MTBS / Infeksi Saluran Pernapasan Akut pada Anak' },
      { code: 'A09', name: 'Gastroenteritis / Diare Akut pada Balita' },
      { code: 'Z30.9', name: 'Konsultasi & Pelayanan KB (Suntik / Pil / IUD)' },
      { code: 'Z23', name: 'Imunisasi Dasar Lengkap (BCG / DPT-Hb-Hib / Polio / Campak)' },
      { code: 'Z00.1', name: 'Pemeriksaan Tumbuh Kembang & Skrining Stunting Balita' }
    ],
    commonMedicines: [
      { medicineName: 'Tablet Tambah Darah (Fe + Asam Folat)', dosage: '1 x 1 tablet malam sebelum tidur', quantity: 30, notes: 'Diminum dengan air putih hangat' },
      { medicineName: 'Kalsium Laktat (Kalk) 500 mg', dosage: '1 x 1 tablet sesudah makan pagi', quantity: 30, notes: 'Suplemen tulang ibu hamil' },
      { medicineName: 'Paracetamol Sirup 120 mg/5ml', dosage: '3 x 1 sendok takar (5ml) bila demam', quantity: 1, notes: 'Kocok dahulu sebelum diminum' },
      { medicineName: 'Oralit Sachet 200 ml', dosage: '1 sachet dilarutkan dalam 200ml air tiap BAB cair', quantity: 6, notes: 'Cegah dehidrasi' },
      { medicineName: 'Zinc Sirup 20 mg/5ml', dosage: '1 x 1 sendok takar (5ml) selama 10 hari', quantity: 1, notes: 'Diberikan habis selama 10 hari' }
    ]
  },
  {
    number: 3,
    name: 'Klaster 3: Usia Dewasa dan Lanjut Usia',
    shortName: 'Klaster 3 (Dewasa & Lansia)',
    category: 'Dewasa & Lansia',
    badge: 'Klaster 3',
    tagline: 'Pemeriksaan Umum (BPU), Pengendalian PTM, Hipertensi, DM & Geriatri',
    description: 'Pusat skrining dan tata laksana penyakit tidak menular (hipertensi, diabetes melitus, dislipidemia), pemeriksaan dewasa rutin, dan poli khusus lansia.',
    color: 'emerald',
    bgBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    borderBadge: 'border-emerald-300',
    bgGradient: 'from-emerald-700 to-teal-800',
    activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/20',
    lightBg: 'bg-emerald-50/70 border-emerald-200',
    avatarBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    avatarIconColor: 'text-emerald-600',
    commonDiagnoses: [
      { code: 'I10', name: 'Hipertensi Esensial (Tekanan Darah Tinggi Primer)' },
      { code: 'E11.9', name: 'Diabetes Melitus Tipe 2 Tanpa Komplikasi' },
      { code: 'K29.7', name: 'Gastritis / Dispepsia (Sakit Maag)' },
      { code: 'M79.1', name: 'Mialgia / Pegal Linu / Nyeri Otot' },
      { code: 'E78.5', name: 'Hiperlipidemia / Kolesterol Tinggi' },
      { code: 'J00', name: 'Nasofaringitis Akut (Common Cold / Batuk Pilek)' },
      { code: 'M13.9', name: 'Artritis / Nyeri Sendi pada Lansia' }
    ],
    commonMedicines: [
      { medicineName: 'Amlodipine 5 mg Tablet', dosage: '1 x 1 tablet malam hari secara teratur', quantity: 30, notes: 'Kontrol hipertensi' },
      { medicineName: 'Metformin 500 mg Tablet', dosage: '2 x 1 tablet bersama / sesudah makan', quantity: 30, notes: 'Kontrol gula darah' },
      { medicineName: 'Antasida DOEN Kunyah', dosage: '3 x 1 tablet dikunyah 1 jam sebelum makan', quantity: 20, notes: 'Meredakan perih lambung' },
      { medicineName: 'Paracetamol 500 mg Tablet', dosage: '3 x 1 tablet sesudah makan bila nyeri/demam', quantity: 15, notes: 'Sesudah makan' },
      { medicineName: 'Vitamin B Kompleks Tablet', dosage: '1 x 1 tablet pagi hari', quantity: 30, notes: 'Untuk kesehatan saraf' },
      { medicineName: 'Simvastatin 10 mg Tablet', dosage: '1 x 1 tablet malam sebelum tidur', quantity: 30, notes: 'Penurun kolesterol' }
    ]
  },
  {
    number: 4,
    name: 'Klaster 4: Penanggulangan Penyakit Menular',
    shortName: 'Klaster 4 (P2M & TB)',
    category: 'P2M & TB-DOTS',
    badge: 'Klaster 4',
    tagline: 'Pengendalian TB Paru (DOTS), ISPA Berat, Kusta & Penyakit Infeksi',
    description: 'Pelayanan khusus diagnosis, pemantauan pengobatan OAT (Obat Anti Tuberkulosis), infeksi saluran pernapasan akut, dan pengendalian penularan.',
    color: 'amber',
    bgBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    borderBadge: 'border-amber-300',
    bgGradient: 'from-amber-700 to-orange-800',
    activeBorder: 'border-amber-600 ring-2 ring-amber-500/20',
    lightBg: 'bg-amber-50/70 border-amber-200',
    avatarBg: 'bg-amber-50 border-amber-200 text-amber-700',
    avatarIconColor: 'text-amber-600',
    commonDiagnoses: [
      { code: 'A15.0', name: 'Tuberkulosis Paru Terkonfirmasi Bakteriologis (BTA+)' },
      { code: 'A16.2', name: 'Tuberkulosis Paru Klinis (Rontgen Positif)' },
      { code: 'J06.9', name: 'Infeksi Saluran Pernapasan Akut (ISPA Akut)' },
      { code: 'J20.9', name: 'Bronkitis Akut / Batuk Berdahak Produktif' },
      { code: 'R05', name: 'Batuk Kronis Tersangka TB (Skrining Tes Cepat Molekuler)' }
    ],
    commonMedicines: [
      { medicineName: 'Paket OAT Kategori 1 (FDC Dewasa)', dosage: '1 x 4 tablet pagi hari saat perut kosong', quantity: 28, notes: 'Habiskan, jangan putus obat' },
      { medicineName: 'Ambroxol 30 mg Tablet', dosage: '3 x 1 tablet sesudah makan', quantity: 15, notes: 'Pengencer dahak' },
      { medicineName: 'Cetirizine 10 mg Tablet', dosage: '1 x 1 tablet malam hari', quantity: 10, notes: 'Meredakan alergi & gatal' },
      { medicineName: 'Vitamin C 500 mg Tablet', dosage: '1 x 1 tablet sehari sesudah makan', quantity: 20, notes: 'Daya tahan tubuh' },
      { medicineName: 'Paracetamol 500 mg Tablet', dosage: '3 x 1 tablet bila demam', quantity: 10, notes: 'Sesudah makan' }
    ]
  },
  {
    number: 5,
    name: 'Lintas Klaster: Gigi, UGD & Penunjang',
    shortName: 'Lintas Klaster (Gigi/UGD)',
    category: 'Gigi, UGD & Tindakan',
    badge: 'Lintas Klaster',
    tagline: 'Pelayanan Kesehatan Gigi & Mulut, UGD 24 Jam Siaga, Farmasi & Laboratorium',
    description: 'Pelayanan komprehensif kesehatan gigi, tindakan kegawatdaruratan 24 jam medis umum, serta penunjang laboratorium patologi.',
    color: 'purple',
    bgBadge: 'bg-purple-100 text-purple-900 border-purple-300',
    borderBadge: 'border-purple-300',
    bgGradient: 'from-purple-700 to-indigo-800',
    activeBorder: 'border-purple-600 ring-2 ring-purple-500/20',
    lightBg: 'bg-purple-50/70 border-purple-200',
    avatarBg: 'bg-purple-50 border-purple-200 text-purple-700',
    avatarIconColor: 'text-purple-600',
    commonDiagnoses: [
      { code: 'K04.0', name: 'Pulpitis Akut (Radang Pulpa / Sakit Gigi Berdenyut)' },
      { code: 'K02.9', name: 'Karies Gigi (Gigi Berlubang)' },
      { code: 'K05.3', name: 'Periodontitis Kronis / Karang Gigi & Gusi Berdarah' },
      { code: 'K04.7', name: 'Abses Periapikal / Pembengkakan Gusi' },
      { code: 'T14.0', name: 'Vulnus Laceratum / Luka Robek (Tindakan Hecting UGD)' },
      { code: 'R50.9', name: 'Febris Akut / Demam Tinggi Gawat Darurat' }
    ],
    commonMedicines: [
      { medicineName: 'Amoxicillin 500 mg Kaplet', dosage: '3 x 1 kaplet (habiskan selama 5 hari)', quantity: 15, notes: 'Antibiotik, diminum sesudah makan' },
      { medicineName: 'Asam Mefenamat 500 mg Kaplet', dosage: '3 x 1 kaplet sesudah makan bila nyeri', quantity: 10, notes: 'Pereda sakit gigi berdenyut' },
      { medicineName: 'Obat Kumur Povidone Iodine 1%', dosage: '2 x sehari untuk kumur selama 30 detik', quantity: 1, notes: 'Antiseptik rongga mulut' },
      { medicineName: 'Ciprofloksasin 500 mg Tablet', dosage: '2 x 1 tablet sesudah makan (habiskan)', quantity: 10, notes: 'Antibiotik pilihan infeksi berat' },
      { medicineName: 'Kassa Steril & Salep Bacitracin', dosage: 'Oleskan 2 x sehari setelah luka dibersihkan', quantity: 1, notes: 'Perawatan luka luar' }
    ]
  }
];

const DOSAGE_PRESETS = [
  '3 x 1 tablet sesudah makan (3x sehari)',
  '2 x 1 tablet sesudah makan (2x sehari)',
  '1 x 1 tablet sesudah makan pagi (1x sehari)',
  '1 x 1 tablet malam hari sebelum tidur (1x sehari)',
  '3 x 1 tablet 1 jam sebelum makan (3x sehari)',
  '3 x 1 sendok takar (5ml) sesudah makan (3x sehari)',
  '3 x 1 kaplet sesudah makan bila nyeri berdenyut',
  '3 x 1 kaplet/kapsul sesudah makan (wajib dihabiskan)',
  '1 x 1 tablet pagi hari secara rutin',
  'Teteskan 2 tetes 3x sehari pada area yang sakit',
  'Kumur 15ml selama 30 detik 2x sehari'
];

/**
 * Mendeteksi nomor klaster tiket pasien secara akurat
 */
export function getTicketKlasterNumber(ticket: QueueTicket): number {
  if (ticket.klasterNumber && ticket.klasterNumber >= 1 && ticket.klasterNumber <= 5) {
    return ticket.klasterNumber;
  }
  const poli = (ticket.poliId || '').toLowerCase();
  const poliName = (ticket.poliName || '').toLowerCase();
  const docName = (ticket.doctorName || '').toLowerCase();

  if (poli.includes('gigi') || poliName.includes('gigi') || poliName.includes('ugd') || docName.includes('maya rosdiana') || docName.includes('farhan') || docName.includes('dimas')) {
    return 5;
  }
  if (poli.includes('tb') || poli.includes('ispa') || poliName.includes('tb') || poliName.includes('batuk') || docName.includes('rian') || docName.includes('hendra')) {
    return 4;
  }
  if (poli.includes('kia') || poli.includes('anak') || poliName.includes('kia') || poliName.includes('anak') || poliName.includes('imunisasi') || docName.includes('nining') || docName.includes('siska')) {
    return 2;
  }
  if (docName.includes('bambang') && poliName.includes('manajemen') || docName.includes('rina handayani')) {
    return 1;
  }
  // Default to Klaster 3 Dewasa & Lansia
  return 3;
}

/**
 * Mendeteksi nomor klaster dokter secara akurat
 */
export function getDoctorKlasterNumber(doc: DoctorSchedule): number {
  if (doc.klasterNumber && doc.klasterNumber >= 1 && doc.klasterNumber <= 5) {
    return doc.klasterNumber;
  }
  const poli = (doc.poliId || '').toLowerCase();
  const poliName = (doc.poliName || '').toLowerCase();
  const docName = (doc.doctorName || '').toLowerCase();

  if (poli.includes('gigi') || poliName.includes('gigi') || poliName.includes('ugd') || docName.includes('maya rosdiana') || docName.includes('farhan') || docName.includes('dimas')) {
    return 5;
  }
  if (poli.includes('tb') || poli.includes('ispa') || poliName.includes('tb') || poliName.includes('batuk') || docName.includes('rian') || docName.includes('hendra')) {
    return 4;
  }
  if (poli.includes('kia') || poli.includes('anak') || poliName.includes('kia') || poliName.includes('anak') || docName.includes('nining') || docName.includes('siska')) {
    return 2;
  }
  if (docName.includes('rina handayani') || docName.includes('tata kelola') || (docName.includes('bambang') && poliName.includes('manajemen'))) {
    return 1;
  }
  return 3;
}

/**
 * Memastikan apakah tiket antrean pasien ditujukan secara spesifik untuk dokter tertentu.
 * Jika pasien memilih dokter saat pendaftaran, pencocokan ketat berdasarkan nama dokter.
 */
export function isTicketAssignedToDoctor(ticket: QueueTicket, doc: DoctorSchedule): boolean {
  if (ticket.doctorName && ticket.doctorName.trim() !== '') {
    const clean = (name: string) =>
      name
        .toLowerCase()
        .replace(/drg?\.|\,?\s*m\.kes|\,?\s*sp\.[a-z]+|\,?\s*s\.st|\,?\s*s\.farm|\,?\s*a\.md\.ak/gi, '')
        .replace(/[^a-z0-9]/g, ' ')
        .trim();

    const tDoc = clean(ticket.doctorName);
    const dDoc = clean(doc.doctorName);

    // 1. Pencocokan langsung atau substring nama dokter (misal: "Siti Rahmawati" vs "dr. Siti Rahmawati, M.Kes")
    if (tDoc === dDoc || tDoc.includes(dDoc) || dDoc.includes(tDoc)) {
      return true;
    }

    // 2. Pencocokan kata nama inti
    const tWords = tDoc.split(/\s+/).filter(w => w.length >= 3);
    const dWords = dDoc.split(/\s+/).filter(w => w.length >= 3);
    const common = tWords.filter(w => dWords.includes(w));
    if (common.length >= 2 || (tWords.length === 1 && common.length === 1)) {
      return true;
    }

    // Karena tiket ini memiliki nama dokter yang spesifik dan TIDAK cocok dengan dokter ini,
    // JANGAN PERNAH dimasukkan ke antrean dokter lain meskipun di poli/klaster yang sama!
    return false;
  }

  // Hanya jika tiket sama sekali tidak memiliki nama dokter yang dipilih (walk-in tanpa dokter spesifik):
  return !!(ticket.poliId && doc.poliId && ticket.poliId === doc.poliId);
}

/**
 * Mencari dokter dari daftar jadwal dokter yang cocok dengan tiket antrean
 */
export function findDoctorForTicket<T extends DoctorSchedule>(ticket: QueueTicket, allDoctorsList: T[]): T | undefined {
  if (!ticket.doctorName || ticket.doctorName.trim() === '') return undefined;
  return allDoctorsList.find(doc => isTicketAssignedToDoctor(ticket, doc));
}

export const PelayananMedisView: React.FC<PelayananMedisViewProps> = ({
  polis,
  tickets,
  doctors = INITIAL_DOCTORS,
  onUpdateTicketStatus,
  onRefresh,
  onNavigateFlow
}) => {
  // Klaster & Doctor selection
  const [selectedKlasterNumber, setSelectedKlasterNumber] = useState<number | 'all'>(3); // Default to Klaster 3 (Dewasa & Lansia)
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-0'); // Default dr. Ananto Adi Swasono
  const [queueFilterStatus, setQueueFilterStatus] = useState<'all' | 'Waiting' | 'Called' | 'Completed'>('all');
  // Default true: agar dokter yang dipilih langsung melihat antrean miliknya saja, tanpa membuat dokter lain bingung
  const [onlyMyPatients, setOnlyMyPatients] = useState<boolean>(true);
  const [searchPatientQuery, setSearchPatientQuery] = useState<string>('');

  // Active Patient for examination
  const [activePatient, setActivePatient] = useState<QueueTicket | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Vital Signs State
  const [vitals, setVitals] = useState<VitalSigns>({
    bloodPressure: '120/80 mmHg',
    temperature: 36.5,
    heartRate: 80,
    respiratoryRate: 18,
    weightKg: 60,
    heightCm: 165,
    bloodOxygen: 99
  });

  // Clinical Diagnosis & Therapy
  const [diagnosisCode, setDiagnosisCode] = useState('I10');
  const [diagnosisName, setDiagnosisName] = useState('Hipertensi Esensial (Tekanan Darah Tinggi Primer)');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');

  // Prescription Items
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { medicineName: '', dosage: '3 x 1 tablet sesudah makan', quantity: 10, notes: '' }
  ]);

  // Current active Klaster config
  const activeKlasterConfig = useMemo(() => {
    if (selectedKlasterNumber === 'all') return null;
    return KLASTER_CONFIGS.find(k => k.number === selectedKlasterNumber) || KLASTER_CONFIGS[2];
  }, [selectedKlasterNumber]);

  // All doctors with klaster assignments
  const allDoctors = useMemo(() => {
    return doctors.map(d => ({
      ...d,
      computedKlaster: getDoctorKlasterNumber(d)
    }));
  }, [doctors]);

  // Doctors in the selected klaster
  const klasterDoctors = useMemo(() => {
    if (selectedKlasterNumber === 'all') return allDoctors;
    return allDoctors.filter(d => d.computedKlaster === selectedKlasterNumber);
  }, [allDoctors, selectedKlasterNumber]);

  // Active Doctor Object
  const activeDoctor = useMemo(() => {
    const found = allDoctors.find(d => d.id === selectedDoctorId);
    if (found) return found;
    return klasterDoctors[0] || allDoctors[0];
  }, [allDoctors, selectedDoctorId, klasterDoctors]);

  // If selected klaster changes and active doctor isn't in it, pick the first doctor in that klaster
  useEffect(() => {
    if (selectedKlasterNumber !== 'all') {
      const match = klasterDoctors.find(d => d.id === selectedDoctorId);
      if (!match && klasterDoctors.length > 0) {
        setSelectedDoctorId(klasterDoctors[0].id);
      }
    }
  }, [selectedKlasterNumber, klasterDoctors]);

  // Patient tickets with enriched klaster number
  const enrichedTickets = useMemo(() => {
    return tickets.map(t => ({
      ...t,
      computedKlaster: getTicketKlasterNumber(t)
    }));
  }, [tickets]);

  // Klaster counts map for pills
  const klasterCounts = useMemo(() => {
    const counts: Record<string, { total: number; waiting: number }> = {
      all: { total: enrichedTickets.length, waiting: enrichedTickets.filter(t => t.status === 'Waiting' || t.status === 'Called').length },
      1: { total: 0, waiting: 0 },
      2: { total: 0, waiting: 0 },
      3: { total: 0, waiting: 0 },
      4: { total: 0, waiting: 0 },
      5: { total: 0, waiting: 0 }
    };

    enrichedTickets.forEach(t => {
      const k = t.computedKlaster;
      if (counts[k]) {
        counts[k].total++;
        if (t.status === 'Waiting' || t.status === 'Called') {
          counts[k].waiting++;
        }
      }
    });

    return counts;
  }, [enrichedTickets]);

  // Filtered tickets based on klaster, doctor, search, and status
  const filteredTickets = useMemo(() => {
    return enrichedTickets.filter(t => {
      // Klaster filter
      const matchKlaster = selectedKlasterNumber === 'all' || t.computedKlaster === selectedKlasterNumber;

      // Doctor filter if "onlyMyPatients" is toggled: strictly match assigned doctor
      const matchDoctor = !onlyMyPatients || (activeDoctor && isTicketAssignedToDoctor(t, activeDoctor));

      // Status filter
      const matchStatus =
        queueFilterStatus === 'all'
          ? true
          : queueFilterStatus === 'Waiting'
          ? (t.status === 'Waiting' || t.status === 'Verified')
          : t.status === queueFilterStatus;

      // Search query
      const q = searchPatientQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.fullName.toLowerCase().includes(q) ||
        t.queueNumber.toLowerCase().includes(q) ||
        t.nik.toLowerCase().includes(q) ||
        (t.chiefComplaint && t.chiefComplaint.toLowerCase().includes(q)) ||
        (t.doctorName && t.doctorName.toLowerCase().includes(q));

      return matchKlaster && matchDoctor && matchStatus && matchSearch;
    });
  }, [enrichedTickets, selectedKlasterNumber, onlyMyPatients, activeDoctor, queueFilterStatus, searchPatientQuery]);

  // Metrics for active view
  const waitingCount = filteredTickets.filter(t => t.status === 'Waiting' || t.status === 'Verified').length;
  const calledCount = filteredTickets.filter(t => t.status === 'Called').length;
  const completedCount = filteredTickets.filter(t => t.status === 'Completed').length;

  // Text to Speech
  const speakDoctorCall = (ticket: QueueTicket, docObj?: DoctorSchedule) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const currentDoc = docObj || (ticket.doctorName ? findDoctorForTicket(ticket, allDoctors) : activeDoctor);
      const text = `Panggilan pemeriksaan dokter. Nomor antrean ${ticket.queueNumber.replace('-', ' ')}, atas nama Bapak atau Ibu ${ticket.fullName}, silakan masuk ke Ruang Pemeriksaan ${ticket.poliName || (currentDoc ? currentDoc.room : 'Dokter')}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCallPatient = (ticket: QueueTicket, overrideDoctor?: DoctorSchedule) => {
    // Pastikan pemeriksaan dilakukan atas nama dokter yang dipilih pasien
    const assignedDoc = overrideDoctor || findDoctorForTicket(ticket, allDoctors);
    if (assignedDoc && activeDoctor && assignedDoc.id !== activeDoctor.id) {
      setSelectedDoctorId(assignedDoc.id);
      const klasterNum = getDoctorKlasterNumber(assignedDoc);
      setSelectedKlasterNumber(klasterNum);
    }

    const docToUse = assignedDoc || activeDoctor;

    setActivePatient(ticket);
    setChiefComplaint(ticket.chiefComplaint || 'Pemeriksaan rutin kesehatan');

    // Reset diagnosis and prescriptions so doctor fills them manually according to patient's clinical needs
    setDiagnosisCode('');
    setDiagnosisName('');
    setPrescriptions([
      {
        id: `rx-${Date.now()}`,
        medicineName: '',
        dosage: '3 x 1 tablet sesudah makan',
        quantity: 10,
        notes: ''
      }
    ]);

    speakDoctorCall(ticket, docToUse);
    onUpdateTicketStatus(ticket.id, 'Called');
    setNotification({
      type: 'info',
      message: `Memanggil pasien ${ticket.fullName} (${ticket.queueNumber}) ke ruang pemeriksaan ${docToUse?.doctorName || 'Dokter'}...`
    });
  };

  const handleAddPrescriptionRow = () => {
    setPrescriptions(prev => [
      ...prev,
      { id: `rx-${Date.now()}-${prev.length}`, medicineName: '', dosage: '3 x 1 tablet sesudah makan', quantity: 10, notes: '' }
    ]);
  };

  const handleRemovePrescriptionRow = (index: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (index: number, field: keyof PrescriptionItem, val: any) => {
    setPrescriptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  // Submit Doctor Examination -> Send e-Resep to Pharmacy & Save RME
  const handleFinishExaminationAndSendPrescription = () => {
    if (!activePatient) {
      alert('Pilih pasien terlebih dahulu dari daftar antrean.');
      return;
    }

    const patientKlasterNum = getTicketKlasterNumber(activePatient);
    const klasterConfig = KLASTER_CONFIGS.find(k => k.number === patientKlasterNum);
    // Pastikan nama dokter di RME & e-Resep persis sesuai dokter yang dipilih pasien
    const examiningDoctorName = activePatient.doctorName || activeDoctor?.doctorName || 'dr. Pemeriksa Puskesmas';

    // 1. Save to RME Database
    const newRme = addOrUpdateRmeRecord({
      patientNik: activePatient.nik,
      patientBpjs: activePatient.bpjsNumber || '',
      patientName: activePatient.fullName,
      birthDate: activePatient.birthDate || '1990-01-01',
      gender: (activePatient.gender === 'P' ? 'P' : 'L') as Gender,
      address: activePatient.address || 'Kecamatan Pamulang, Tangerang Selatan',
      phone: activePatient.phone || '',
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      poliId: activePatient.poliId || 'poli-umum',
      poliName: activePatient.poliName || (klasterConfig?.name || 'Poli Pelayanan'),
      doctorName: examiningDoctorName,
      patientType: (activePatient.patientType === 'Umum' ? 'Umum' : 'BPJS') as PatientType,
      chiefComplaint: chiefComplaint || activePatient.chiefComplaint || 'Pemeriksaan Rutin',
      historyOfPresentIllness: clinicalNotes || `Pemeriksaan klinis komprehensif di ${klasterConfig?.name || 'Puskesmas Pondok Benda'}. Keluhan utama: ${chiefComplaint}.`,
      vitalSigns: vitals,
      allergies: [],
      diagnosisCode: diagnosisCode || 'Z00.0',
      diagnosisName: diagnosisName || 'Pemeriksaan Kesehatan',
      diagnosisCategory: klasterConfig?.category || 'Pelayanan Rawat Jalan',
      treatmentPlan: treatmentPlan || 'Edukasi pola hidup sehat, istirahat cukup, dan konsumsi obat sesuai aturan pakai apoteker.',
      prescriptions: prescriptions.filter(p => p.medicineName.trim() !== ''),
      status: 'Final',
      notes: `Pemeriksaan selesai oleh ${examiningDoctorName}. Resep elektronik diteruskan ke Instalasi Farmasi Apotek. Rekam Medis tersinkronisasi ke SIMPUS ILP Kemenkes.`
    });

    // 2. Transmit e-Prescription to Pharmacy Queue
    const validMedicines = prescriptions.filter(p => p.medicineName.trim() !== '');
    if (validMedicines.length > 0) {
      addPrescription({
        ticketId: activePatient.id,
        queueNumber: activePatient.queueNumber,
        patientNik: activePatient.nik,
        patientName: activePatient.fullName,
        patientType: (activePatient.patientType === 'Umum' ? 'Umum' : 'BPJS') as PatientType,
        bpjsNumber: activePatient.bpjsNumber,
        birthDate: activePatient.birthDate,
        gender: (activePatient.gender === 'P' ? 'P' : 'L') as ('L' | 'P'),
        phone: activePatient.phone,
        poliId: activePatient.poliId || 'poli-umum',
        poliName: activePatient.poliName || (klasterConfig?.name || 'Poli Pelayanan'),
        doctorName: examiningDoctorName,
        diagnosisCode: diagnosisCode || 'Z00.0',
        diagnosisName: diagnosisName || 'Pemeriksaan Kesehatan',
        allergies: [],
        items: validMedicines,
        instructions: treatmentPlan || 'Minum obat teratur sesudah makan.',
        status: 'Waiting',
        totalItemsCount: validMedicines.length
      });
    }

    // 3. Update Queue Ticket Status to Completed in Doctor (forwarded to pharmacy)
    onUpdateTicketStatus(activePatient.id, 'Completed');

    setNotification({
      type: 'success',
      message: `Pemeriksaan selesai! Rekam Medis (RME #${newRme.id}) tersimpan & ${validMedicines.length} resep obat berhasil diteruskan ke Instalasi Farmasi/Apotek.`
    });

    // Reset active patient
    setActivePatient(null);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* 3-STEP PATIENT FLOW PIPELINE BAR */}
      <PatientFlowPipelineBar
        currentStage="dokter"
        onSelectStage={onNavigateFlow}
        tickets={tickets}
      />

      {/* Top Header with ILP Branding & Quick Action */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-300">
              <Stethoscope className="w-4 h-4 text-emerald-700" />
              <span>Integrasi Layanan Primer (ILP) • Portal Pelayanan & Pemeriksaan Dokter</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pemeriksaan Dokter Sesuai Klaster & Tim Medis
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
              Masing-masing dokter dapat memilih klasternya (Klaster 1 s/d Klaster 4 & Lintas Klaster) atau profil dokter aktif untuk memfilter pasien yang berkunjung secara akurat, melakukan pemeriksaan klinis SOAP, dan menerbitkan e-resep ke farmasi.
            </p>
          </div>

          {/* Active Doctor Quick Badge */}
          {activeDoctor && (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Dokter Aktif Bertugas</span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1">{activeDoctor.doctorName}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{activeDoctor.room || activeDoctor.poliName}</p>
              </div>
            </div>
          )}
        </div>

        {/* KLASTER FILTER PILLS (Matched with Jadwal & Tim Dokter) */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pilih Klaster Pelayanan Pasien:</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Menampilkan {filteredTickets.length} kunjungan pasien
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* All Klasters */}
            <button
              onClick={() => setSelectedKlasterNumber('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 border ${
                selectedKlasterNumber === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>Semua Klaster</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                selectedKlasterNumber === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {klasterCounts.all.total} Pasien
              </span>
            </button>

            {/* Klaster 1 - 5 */}
            {KLASTER_CONFIGS.map((k) => {
              const isSelected = selectedKlasterNumber === k.number;
              const countObj = klasterCounts[k.number] || { total: 0, waiting: 0 };
              return (
                <button
                  key={k.number}
                  onClick={() => setSelectedKlasterNumber(k.number)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 border ${
                    isSelected
                      ? `${k.bgBadge} ${k.activeBorder} shadow-xs`
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    k.color === 'blue' ? 'bg-blue-600' :
                    k.color === 'pink' ? 'bg-pink-600' :
                    k.color === 'emerald' ? 'bg-emerald-600' :
                    k.color === 'amber' ? 'bg-amber-600' :
                    'bg-purple-600'
                  }`} />
                  <span>{k.shortName}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-black/10 text-slate-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {countObj.total}
                  </span>
                  {countObj.waiting > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title={`${countObj.waiting} pasien menunggu`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {notification && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
          notification.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-300' :
          'bg-blue-50 text-blue-900 border-blue-300'
        }`}>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* TIM DOKTER BERTUGAS SESUAI KLASTER (MATCHED WITH JADWAL DOKTER DESIGN) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <h3 className="font-black text-sm text-slate-900">
              Tim Dokter Bertugas di {selectedKlasterNumber === 'all' ? 'Seluruh Klaster' : (activeKlasterConfig?.name || 'Klaster Terpilih')}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Klik kartu dokter untuk beralih mode dokter pemeriksa
          </span>
        </div>

        {/* Doctors Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {klasterDoctors.map((doc) => {
            const isDoctorActive = selectedDoctorId === doc.id;
            const docKlasterNum = doc.computedKlaster || 3;
            const klasterMeta = KLASTER_CONFIGS.find(k => k.number === docKlasterNum) || KLASTER_CONFIGS[2];

            // Count patients specifically assigned to this doctor
            const docPatients = enrichedTickets.filter(t => isTicketAssignedToDoctor(t, doc));
            const docWaiting = docPatients.filter(t => t.status === 'Waiting' || t.status === 'Called').length;
            const docCompleted = docPatients.filter(t => t.status === 'Completed').length;

            return (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoctorId(doc.id);
                  if (doc.klasterNumber) {
                    setSelectedKlasterNumber(doc.klasterNumber);
                  }
                  // Fokuskan antrean ke pasien dokter ini
                  setOnlyMyPatients(true);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isDoctorActive
                    ? `${klasterMeta.lightBg} border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm`
                    : 'bg-white hover:bg-slate-50/90 border-slate-200'
                }`}
              >
                {/* Active Tag */}
                {isDoctorActive && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                    <Check className="w-3 h-3" />
                    <span>Aktif</span>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${klasterMeta.avatarBg}`}>
                    <User className={`w-6 h-6 ${klasterMeta.avatarIconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${klasterMeta.bgBadge}`}>
                        {klasterMeta.badge}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 truncate">
                        {doc.status}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1 truncate">
                      {doc.doctorName}
                    </h4>

                    <p className="text-[11px] font-semibold text-slate-600 truncate mt-0.5">
                      {doc.specialty}
                    </p>

                    <div className="mt-2 text-[10px] text-slate-500 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.room || doc.poliName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.hours}</span>
                      </div>
                    </div>

                    {/* Patient Badges for this doctor - accurately matches assigned patients */}
                    <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px]">
                      <span className={`font-bold px-2 py-0.5 rounded-md border transition ${
                        docWaiting > 0
                          ? 'text-amber-800 bg-amber-50 border-amber-300 font-extrabold shadow-2xs'
                          : 'text-slate-400 bg-slate-50/80 border-slate-200'
                      }`}>
                        ⏳ {docWaiting} Menunggu
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded-md border transition ${
                        docCompleted > 0
                          ? 'text-emerald-800 bg-emerald-50 border-emerald-300 font-extrabold'
                          : 'text-slate-400 bg-slate-50/80 border-slate-200'
                      }`}>
                        ✅ {docCompleted} Selesai
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Patient Queue on Left, Medical Exam & Prescription on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Waiting Patient Queue by Klaster & Doctor */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            
            {/* Header & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Kunjungan Pasien {selectedKlasterNumber === 'all' ? 'Semua Klaster' : (activeKlasterConfig?.shortName || '')}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {onlyMyPatients
                    ? `Antrean khusus untuk ${activeDoctor?.doctorName || 'dokter aktif'}`
                    : `Semua antrean pasien di ${selectedKlasterNumber === 'all' ? 'semua klaster' : activeKlasterConfig?.name || 'klaster ini'}`}
                </p>
              </div>

              {/* Toggle "Hanya Pasien Saya" */}
              <button
                onClick={() => setOnlyMyPatients(!onlyMyPatients)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 border shrink-0 ${
                  onlyMyPatients
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title={onlyMyPatients ? 'Klik untuk melihat seluruh antrean di klaster' : 'Klik untuk memfilter khusus pasien dokter ini'}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{onlyMyPatients ? 'Pasien Dokter Ini Saja' : 'Semua Pasien Klaster'}</span>
              </button>
            </div>

            {/* Search Input & Status Tabs */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchPatientQuery || ''}
                  onChange={(e) => setSearchPatientQuery(e.target.value)}
                  placeholder="Cari nama pasien, NIK, no antrean, keluhan..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { key: 'all' as const, label: 'Semua' },
                  { key: 'Waiting' as const, label: `Menunggu (${waitingCount})` },
                  { key: 'Called' as const, label: `Sedang Diperiksa (${calledCount})` },
                  { key: 'Completed' as const, label: `Selesai (${completedCount})` }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setQueueFilterStatus(st.key)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold whitespace-nowrap transition border ${
                      queueFilterStatus === st.key
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Cards List */}
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2 bg-slate-50/50 rounded-xl border border-slate-200/60 p-4">
                <Clock className="w-9 h-9 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">Tidak ada antrean pasien yang sesuai</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  {enrichedTickets.length === 0
                    ? 'Belum ada pasien yang mendaftar. Pasien yang mendaftar di loket antrean online akan otomatis muncul di klaster ini.'
                    : onlyMyPatients
                    ? `Tidak ada antrean pasien untuk ${activeDoctor?.doctorName || 'dokter ini'}. Klik tombol "Semua Pasien Klaster" untuk melihat antrean pasien lainnya di klaster ini.`
                    : 'Tidak ada pasien dengan filter / pencarian saat ini. Ubah filter klaster atau status di atas.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {filteredTickets.map((tkt) => {
                  const isCurrent = activePatient?.id === tkt.id;
                  const ticketKlasterNum = tkt.computedKlaster;
                  const ticketKlasterMeta = KLASTER_CONFIGS.find(k => k.number === ticketKlasterNum) || KLASTER_CONFIGS[2];

                  // Pengecekan dokter yang dipilih pasien
                  const assignedDoctor = findDoctorForTicket(tkt, allDoctors);
                  const isAssignedToActiveDoctor = isTicketAssignedToDoctor(tkt, activeDoctor);
                  const hasSpecificDoctor = Boolean(tkt.doctorName && tkt.doctorName.trim() !== '');

                  return (
                    <div
                      key={tkt.id}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                          : tkt.status === 'Completed'
                          ? 'bg-slate-50/50 border-slate-200 opacity-80'
                          : !isAssignedToActiveDoctor && hasSpecificDoctor
                          ? 'bg-amber-50/40 border-amber-200/90 hover:bg-amber-50/60'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-black text-slate-900 tracking-tight">
                              {tkt.queueNumber}
                            </span>
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border ${ticketKlasterMeta.bgBadge}`}>
                              {ticketKlasterMeta.badge}
                            </span>
                            <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded ${
                              tkt.patientType === 'BPJS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tkt.patientType}
                            </span>
                            {hasSpecificDoctor && (
                              isAssignedToActiveDoctor ? (
                                <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5 text-emerald-700" />
                                  Pasien Anda
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-[9px] font-black rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5 text-amber-700" />
                                  Khusus {assignedDoctor ? assignedDoctor.doctorName.replace('dr. ', '').split(',')[0] : tkt.doctorName}
                                </span>
                              )
                            )}
                          </div>

                          <h4 className="font-black text-xs sm:text-sm text-slate-900 line-clamp-1">
                            {tkt.fullName}
                          </h4>

                          <p className="text-[11px] text-slate-500">
                            NIK: {tkt.nik} • {tkt.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
                          </p>

                          <div className="bg-slate-100/80 p-2 rounded-xl text-[11px] text-slate-700">
                            <span className="font-bold text-slate-500">Keluhan: </span>
                            <span>{tkt.chiefComplaint || 'Pemeriksaan Kesehatan Rutin'}</span>
                          </div>

                          {/* Info Dokter Terpilih */}
                          <div className="text-[11px] pt-0.5">
                            {tkt.doctorName ? (
                              <div className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold ${
                                isAssignedToActiveDoctor
                                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200'
                              }`}>
                                {isAssignedToActiveDoctor ? (
                                  <>
                                    <span className="text-emerald-700">🩺</span>
                                    <span>Pilihan Pasien: <strong>{tkt.doctorName}</strong> (Pasien Anda)</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3 text-amber-700 shrink-0" />
                                    <span>Pilihan Pasien: <strong>{tkt.doctorName}</strong></span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-400">
                                <span>Tujuan: <strong>{tkt.poliName}</strong> (Dokter Jaga Umum)</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                          {tkt.status !== 'Completed' ? (
                            isAssignedToActiveDoctor || !hasSpecificDoctor ? (
                              <button
                                onClick={() => handleCallPatient(tkt, activeDoctor)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                                  isCurrent
                                    ? 'bg-emerald-800 text-white'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{isCurrent ? 'Panggil Ulang' : 'Panggil & Periksa'}</span>
                              </button>
                            ) : (
                              <div className="flex flex-col items-end gap-1.5">
                                <span
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 border border-slate-300 flex items-center gap-1.5 cursor-not-allowed shadow-2xs"
                                  title={`Terkunci: Pasien memilih ${tkt.doctorName}. Hanya ${tkt.doctorName} yang berhak memeriksa.`}
                                >
                                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Terkunci untuk Dokter Lain</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (assignedDoctor) {
                                      setSelectedDoctorId(assignedDoctor.id);
                                      const klasterNum = getDoctorKlasterNumber(assignedDoctor);
                                      setSelectedKlasterNumber(klasterNum);
                                      setOnlyMyPatients(true);
                                      handleCallPatient(tkt, assignedDoctor);
                                    } else {
                                      handleCallPatient(tkt);
                                    }
                                  }}
                                  className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold hover:underline flex items-center gap-1"
                                  title={`Klik jika Anda adalah ${assignedDoctor ? assignedDoctor.doctorName : tkt.doctorName} untuk membuka sesi pemeriksaan`}
                                >
                                  <ArrowRightLeft className="w-3 h-3 shrink-0" />
                                  <span>Masuk Sesi {assignedDoctor ? assignedDoctor.doctorName.replace('dr. ', '').split(',')[0] : tkt.doctorName}</span>
                                </button>
                              </div>
                            )
                          ) : (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-lg flex items-center gap-1 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Selesai</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Examination Form & e-Prescription Sheet */}
        <div className="lg:col-span-7 space-y-6">
          
          {activePatient ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-6">
              
              {/* Patient Banner with Klaster Details */}
              {(() => {
                const patKlasterNum = getTicketKlasterNumber(activePatient);
                const patKlasterMeta = KLASTER_CONFIGS.find(k => k.number === patKlasterNum) || KLASTER_CONFIGS[2];
                return (
                  <div className={`p-4 sm:p-5 bg-gradient-to-r ${patKlasterMeta.bgGradient} text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md`}>
                    <div>
                      <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold uppercase tracking-wider">
                        <span>Sedang Diperiksa di {patKlasterMeta.shortName}</span>
                        <span>•</span>
                        <span>{activePatient.patientType}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black mt-1 flex items-center gap-2.5">
                        <span>{activePatient.fullName}</span>
                        <span className="px-2.5 py-0.5 bg-white/25 rounded-lg text-sm font-mono tracking-wider font-bold">
                          {activePatient.queueNumber}
                        </span>
                      </h3>
                      <p className="text-xs text-white/85 mt-1">
                        NIK: {activePatient.nik} | Usia: ~{activePatient.birthDate ? 'Dewasa' : '-'} | Alamat: {activePatient.address}
                      </p>
                      <div className="text-[11px] text-white/90 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Dokter Pemeriksa:</span>
                        <strong className="bg-black/25 px-2 py-0.5 rounded-md border border-white/20">
                          {activePatient.doctorName || activeDoctor?.doctorName}
                        </strong>
                        <span>({(activePatient.doctorName ? findDoctorForTicket(activePatient, allDoctors)?.room : activeDoctor?.room) || activePatient.poliName})</span>
                        {activePatient.doctorName && (
                          <span className="text-[10px] bg-emerald-950/60 text-emerald-200 border border-emerald-300/40 px-1.5 py-0.5 rounded font-bold">
                            ✓ Pilihan Pasien
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakDoctorCall(activePatient)}
                        className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Bunyikan Suara Panggilan</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Section 1: Vital Signs (TTV) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>1. Tanda-Tanda Vital Pasien (TTV)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase">Tekanan Darah</label>
                    <input
                      type="text"
                      value={vitals.bloodPressure || ''}
                      onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      placeholder="120/80 mmHg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase">Suhu (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature ?? ''}
                      onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 36.5 })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      placeholder="36.5"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase">Nadi (bpm)</label>
                    <input
                      type="number"
                      value={vitals.heartRate ?? ''}
                      onChange={(e) => setVitals({ ...vitals, heartRate: parseInt(e.target.value) || 80 })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      placeholder="80"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase">Berat (kg)</label>
                    <input
                      type="number"
                      value={vitals.weightKg ?? ''}
                      onChange={(e) => setVitals({ ...vitals, weightKg: parseFloat(e.target.value) || 60 })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                      placeholder="60"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Anamnesa & Diagnosa Medis (Dengan Rekomendasi ICD-10 Sesuai Klaster) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>2. Anamnesa & Diagnosa Medis Pasien</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Keluhan Pasien / Hasil Pemeriksaan Fisik:</label>
                    <textarea
                      value={chiefComplaint || ''}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      rows={2}
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="Tuliskan keluhan utama, riwayat penyakit, dan temuan pemeriksaan fisik..."
                    />
                  </div>

                  {/* Diagnosa Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-1">
                      <label className="text-[11px] font-bold text-slate-700">Kode ICD-10:</label>
                      <input
                        type="text"
                        value={diagnosisCode || ''}
                        onChange={(e) => setDiagnosisCode(e.target.value)}
                        placeholder="cth: I10"
                        className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-bold text-slate-700">Nama Diagnosa Klinis:</label>
                      <input
                        type="text"
                        value={diagnosisName || ''}
                        onChange={(e) => setDiagnosisName(e.target.value)}
                        placeholder="Ketik diagnosa penyakit pasien..."
                        className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Kebutuhan Obat-obatan (e-Resep Dokter) */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    <span>3. Kebutuhan Obat-Obatan Pasien (e-Resep Dokter)</span>
                  </div>

                  <button
                    onClick={handleAddPrescriptionRow}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Baris Obat</span>
                  </button>
                </div>

                {/* Prescription List Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Nama Obat & Sediaan (Ketik Kebutuhan Pasien)</th>
                        <th className="p-2.5">Aturan Pakai</th>
                        <th className="p-2.5 w-20 text-center">Jumlah</th>
                        <th className="p-2.5">Catatan</th>
                        <th className="p-2.5 w-12 text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {prescriptions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400 text-xs bg-slate-50/50">
                            Belum ada obat yang ditambahkan. Klik <strong className="text-emerald-700">+ Tambah Obat</strong> jika pasien memerlukan resep obat, atau lanjutkan tanpa resep.
                          </td>
                        </tr>
                      )}
                      {prescriptions.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.medicineName || ''}
                              onChange={(e) => handlePrescriptionChange(idx, 'medicineName', e.target.value)}
                              placeholder="Ketik nama obat & dosis..."
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-xs text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              list={`dosage-list-${idx}`}
                              value={item.dosage || ''}
                              onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                              placeholder="cth: 3 x 1 tablet sesudah makan"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <datalist id={`dosage-list-${idx}`}>
                              {DOSAGE_PRESETS.map((dp, i) => (
                                <option key={i} value={dp} />
                              ))}
                            </datalist>
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity ?? 1}
                              onChange={(e) => handlePrescriptionChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-bold text-xs text-center text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.notes || ''}
                              onChange={(e) => handlePrescriptionChange(idx, 'notes', e.target.value)}
                              placeholder="cth: Habiskan / Bila demam"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemovePrescriptionRow(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Hapus baris obat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Button: Finish & Transmit to Pharmacy */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-semibold">
                  Dokter Penanggung Jawab: <strong className="text-slate-900">{activeDoctor?.doctorName}</strong>
                </span>

                <button
                  onClick={handleFinishExaminationAndSendPrescription}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Selesaikan & Kirim e-Resep ke Apoteker Farmasi</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Belum Ada Pasien Yang Dipanggil</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Pilih klaster atau dokter Anda di atas, lalu klik tombol <strong>"Panggil & Periksa"</strong> pada daftar antrean pasien sebelah kiri untuk memulai pemeriksaan klinis dan penerbitan e-resep farmasi.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
