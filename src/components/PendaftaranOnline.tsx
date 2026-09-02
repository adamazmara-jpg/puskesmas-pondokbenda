import React, { useState } from 'react';
import {
  Calendar,
  User,
  CreditCard,
  Phone,
  MapPin,
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Search,
  Check,
  ArrowLeft,
  UserCheck,
  BrainCircuit,
  Activity,
  Layers,
  HelpCircle,
  UserPlus,
  Zap,
  Printer,
  HeartPulse,
  Baby,
  Users,
  ShieldAlert,
  Send
} from 'lucide-react';
import { PoliService, QueueTicket, PatientType, Gender } from '../types';
import {
  searchPatientByNikOrBpjs,
  calculateAge,
  calculateDetailedAge,
  formatBirthDateToInput,
  PatientRecord
} from '../data/patientDatabase';
import { INITIAL_DOCTORS } from '../data/mockData';

interface PendaftaranOnlineProps {
  polis: PoliService[];
  onTicketCreated: (ticket: QueueTicket) => void;
  setActiveTab: (tab: string) => void;
}

// 4 Klaster ILP (Integrasi Pelayanan Primer) Data
interface KlasterInfo {
  number: number;
  name: string;
  badge: string;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  icon: any;
  tagline: string;
  description: string;
  services: { id: string; name: string; desc: string; defaultPoliId: string }[];
  defaultDoctor: string;
}

const KLASTER_LIST: KlasterInfo[] = [
  {
    number: 1,
    name: 'Klaster 1: Manajemen & Tata Kelola',
    badge: 'Administrasi & Rujukan',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    bgColor: 'from-blue-50/70 to-indigo-50/40',
    borderColor: 'border-blue-300 hover:border-blue-500',
    accentColor: 'text-blue-700',
    icon: ShieldCheck,
    tagline: 'Administrasi Umum, Surat Keterangan & Rujukan',
    description: 'Melayani pengurusan surat keterangan sehat/bebas narkoba, konsultasi administrasi BPJS, surat rujukan, pengaduan masyarakat, serta layanan informasi terpadu.',
    services: [
      { id: 'srv-1-1', name: 'Surat Keterangan Sehat / Bebas Narkoba', desc: 'Pemeriksaan fisik umum untuk keperluan kerja/sekolah', defaultPoliId: 'poli-umum' },
      { id: 'srv-1-2', name: 'Konsultasi Rujukan & Administrasi BPJS', desc: 'Pelayanan rujukan berjenjang FKTP ke Rumah Sakit', defaultPoliId: 'poli-umum' },
      { id: 'srv-1-3', name: 'Layanan Informasi & Mutu Pelayanan', desc: 'Informasi alur dan pengaduan masyarakat', defaultPoliId: 'poli-umum' }
    ],
    defaultDoctor: 'dr. H. Bambang Suherman'
  },
  {
    number: 2,
    name: 'Klaster 2: Ibu, Anak, dan Remaja',
    badge: 'KIA, KB & Imunisasi',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    bgColor: 'from-pink-50/70 to-rose-50/40',
    borderColor: 'border-pink-300 hover:border-pink-500',
    accentColor: 'text-pink-700',
    icon: Baby,
    tagline: 'Kesehatan Ibu Hamil, Bayi/Balita, KB & Remaja',
    description: 'Melayani pemeriksaan ibu hamil (ANC/PNC), program KB, imunisasi rutin lengkap bayi dan balita, pemeriksaan balita sakit (MTBS), pemantauan stunting, serta kesehatan reproduksi remaja & calon pengantin.',
    services: [
      { id: 'srv-2-1', name: 'Poli KIA & Keluarga Berencana (KB)', desc: 'Pemeriksaan kehamilan, nifas, USG dasar, KB suntik/IUD', defaultPoliId: 'poli-kia-kb' },
      { id: 'srv-2-2', name: 'Poli Anak & Imunisasi Lengkap', desc: 'Imunisasi dasar lengkap, MTBS, tumbuh kembang balita', defaultPoliId: 'poli-anak-imunisasi' },
      { id: 'srv-2-3', name: 'Poli Remaja & Calon Pengantin (Catin)', desc: 'Skrining anemia remaja, konseling pranikah, kespro', defaultPoliId: 'poli-kia-kb' }
    ],
    defaultDoctor: 'Bidan Nining Kurnia, S.ST'
  },
  {
    number: 3,
    name: 'Klaster 3: Usia Dewasa dan Lanjut Usia',
    badge: 'Umum Dewasa & Lansia',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgColor: 'from-emerald-50/70 to-teal-50/40',
    borderColor: 'border-emerald-300 hover:border-emerald-500',
    accentColor: 'text-emerald-700',
    icon: Users,
    tagline: 'Pemeriksaan Umum Dewasa, Skrining PTM & Geriatri',
    description: 'Melayani pengobatan umum usia dewasa, skrining Penyakit Tidak Menular (Hipertensi, Diabetes Melitus, Asam Urat, Kolesterol), pelayanan kesehatan Lansia/Geriatri, kesehatan jiwa, dan deteksi dini kanker.',
    services: [
      { id: 'srv-3-1', name: 'Poli Umum Dewasa (Klaster 3)', desc: 'Pemeriksaan umum penyakit akut/kronis usia 18-59 tahun', defaultPoliId: 'poli-umum' },
      { id: 'srv-3-2', name: 'Poli Lansia & Pengendalian PTM', desc: 'Pelayanan geriatri (>60 tahun), kontrol rutin tensi & gula darah', defaultPoliId: 'poli-umum' },
      { id: 'srv-3-3', name: 'Skrining Kesehatan & Konseling Jiwa', desc: 'Deteksi dini faktor risiko penyakit tidak menular & kesehatan mental', defaultPoliId: 'poli-umum' }
    ],
    defaultDoctor: 'dr. Ananto Adi Swasono'
  },
  {
    number: 4,
    name: 'Klaster 4: Penanggulangan Penyakit Menular',
    badge: 'P2P & Lintas Klaster',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    bgColor: 'from-amber-50/70 to-orange-50/40',
    borderColor: 'border-amber-300 hover:border-amber-500',
    accentColor: 'text-amber-700',
    icon: ShieldAlert,
    tagline: 'TB Paru/ISPA, Gigi & Mulut, Lab & Farmasi',
    description: 'Melayani penanganan TB Paru (TCM), batuk kronis, ISPA, HIV/IMS, Kusta, DBD, infeksi menular lainnya, serta unit lintas klaster seperti Poli Gigi & Mulut, Laboratorium, Farmasi Obat, dan Tindakan Darurat.',
    services: [
      { id: 'srv-4-1', name: 'Poli Batuk & TB Paru / ISPA', desc: 'Skrining dahak TCM, rontgen TB, terapi OAT, ISPA', defaultPoliId: 'poli-tb-ispa' },
      { id: 'srv-4-2', name: 'Poli Gigi & Mulut', desc: 'Pembersihan karang gigi, penambalan, pencabutan, perawatan gusi', defaultPoliId: 'poli-gigi' },
      { id: 'srv-4-3', name: 'Laboratorium Medis & Farmasi Obat', desc: 'Pemeriksaan darah, urine, sputum, dan pengambilan resep obat', defaultPoliId: 'poli-umum' }
    ],
    defaultDoctor: 'drg. Maya Rosdiana'
  }
];

const TIME_SLOTS = [
  { id: 'slot-1', time: '08:00:00 - 11:30:00', label: 'Sesi Pagi (08:00 - 11:30 WIB)', quota: 'Sisa Kuota: 24 Pasien', available: true },
  { id: 'slot-2', time: '11:30:00 - 13:00:00', label: 'Sesi Siang Awal (11:30 - 13:00 WIB)', quota: 'Sisa Kuota: 18 Pasien', available: true },
  { id: 'slot-3', time: '13:00:00 - 14:30:00', label: 'Sesi Siang Akhir (13:00 - 14:30 WIB)', quota: 'Sisa Kuota: 12 Pasien', available: true }
];

const QUICK_COMPLAINTS = [
  'Demam, flu, dan batuk berdahak sudah 3 hari',
  'Pusing berputar, sakit kepala, dan badan lemas',
  'Kontrol tensi darah tinggi & pemeriksaan rutin',
  'Nyeri ulu hati, mual, dan asam lambung naik',
  'Sakit gigi berdenyut dan gusi bengkak',
  'Pemeriksaan kehamilan rutin (ANC) trimester 2',
  'Imunisasi dasar lengkap balita (DPT/Polio)',
  'Batuk lama lebih dari 2 minggu & sesak napas ringan'
];

export const PendaftaranOnline: React.FC<PendaftaranOnlineProps> = ({
  polis,
  onTicketCreated,
  setActiveTab,
}) => {
  // 5 Guided Steps:
  // Step 1: Input NIK / No BPJS & Data Pasien
  // Step 2: Pilih Klaster (1, 2, 3, 4) & Layanan
  // Step 3: Pilih Dokter & Jam Kunjungan
  // Step 4: Masukkan Keluhan Pasien
  // Step 5: Konfirmasi & Cetak Tiket Kunjungan
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Search & Identification
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSource, setSearchSource] = useState<'NIK' | 'BPJS'>('NIK');
  const [searchHasRun, setSearchHasRun] = useState(false);
  const [foundPatient, setFoundPatient] = useState<PatientRecord | null>(null);

  // Patient Identity Form (Default empty before NIK / BPJS is entered)
  const [patientType, setPatientType] = useState<PatientType>('BPJS');
  const [nik, setNik] = useState('');
  const [bpjsNumber, setBpjsNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [familyHead, setFamilyHead] = useState('');
  const [gender, setGender] = useState<Gender>('L');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [medicalRecordNo, setMedicalRecordNo] = useState('');
  const [oldMedicalRecordNo, setOldMedicalRecordNo] = useState('');
  const [documentRmNo, setDocumentRmNo] = useState('');

  // Klaster & Service Selection
  const [selectedKlasterNumber, setSelectedKlasterNumber] = useState<number>(3); // Default Klaster 3
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-3-1');
  const [selectedPoliId, setSelectedPoliId] = useState<string>('poli-umum');
  const [selectedPoliName, setSelectedPoliName] = useState<string>('UMUM DEWASA');

  // Doctor & Time Slot Selection
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>('dr. Ananto Adi Swasono');
  const [appointmentDate, setAppointmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('08:00:00 - 11:30:00');

  // Complaint
  const [chiefComplaint, setChiefComplaint] = useState<string>('');

  // Processing & Error
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Search by NIK or BPJS
  const handleSearchPatient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMessage('Silakan masukkan NIK (16 digit) atau Nomor BPJS');
      return;
    }

    setErrorMessage('');
    const patient = searchPatientByNikOrBpjs(searchQuery.trim());
    setSearchHasRun(true);

    if (patient) {
      setFoundPatient(patient);
      setNik(patient.nik);
      setBpjsNumber(patient.bpjsNumber || '');
      setFullName(patient.fullName);
      setBirthDate(formatBirthDateToInput(patient.birthDate));
      setFamilyHead(patient.familyHead || '');
      setGender(patient.gender || 'L');
      setPhone(patient.phone || '');
      setAddress(patient.address);
      setMedicalRecordNo(patient.medicalRecordNo || `03${patient.nik.slice(-6)}`);
      setOldMedicalRecordNo(patient.oldMedicalRecordNo || `P${patient.nik.slice(0, 8)}101319`);
      setDocumentRmNo(patient.documentRmNo || `P08-10-${new Date().getFullYear()}`);
    } else {
      setFoundPatient(null);
      if (searchSource === 'NIK') {
        setNik(searchQuery.trim());
        setBpjsNumber('');
      } else {
        setBpjsNumber(searchQuery.trim());
        setNik('');
      }
      setFullName('');
      setBirthDate('');
      setFamilyHead('');
      setPhone('');
      setAddress('');
      setMedicalRecordNo('');
      setOldMedicalRecordNo('');
      setDocumentRmNo('');
    }
  };

  // Select Klaster
  const handleSelectKlaster = (klaster: KlasterInfo) => {
    setSelectedKlasterNumber(klaster.number);
    const firstService = klaster.services[0];
    setSelectedServiceId(firstService.id);
    setSelectedPoliId(firstService.defaultPoliId);
    
    if (klaster.number === 1) setSelectedPoliName('MANAJEMEN & TATA KELOLA');
    else if (klaster.number === 2) setSelectedPoliName('IBU, ANAK & REMAJA');
    else if (klaster.number === 3) setSelectedPoliName('UMUM DEWASA');
    else if (klaster.number === 4) setSelectedPoliName('PENYAKIT MENULAR & GIGI');

    setSelectedDoctorName(klaster.defaultDoctor);
  };

  // Select Service within Klaster
  const handleSelectService = (srv: { id: string; name: string; defaultPoliId: string }) => {
    setSelectedServiceId(srv.id);
    setSelectedPoliId(srv.defaultPoliId);
    setSelectedPoliName(srv.name.toUpperCase());
  };

  // Doctors available for current klaster
  const filteredDoctors = INITIAL_DOCTORS.filter(doc => {
    if (selectedKlasterNumber === 3) return doc.doctorName.includes('Ananto') || doc.doctorName.includes('Bambang') || doc.doctorName.includes('Fauzi');
    if (selectedKlasterNumber === 2) return doc.doctorName.includes('Nining') || doc.doctorName.includes('Siska');
    if (selectedKlasterNumber === 4) return doc.doctorName.includes('Maya') || doc.doctorName.includes('Rian');
    return true;
  });

  // Calculate detailed age
  const calculatedDetailedAgeStr = birthDate ? calculateDetailedAge(birthDate) : '-';

  // Generate Queue Number prefix
  const getQueuePrefix = () => {
    if (selectedKlasterNumber === 3) return 'AC';
    if (selectedKlasterNumber === 2) return 'B';
    if (selectedKlasterNumber === 1) return 'A';
    return 'C';
  };

  // Submit and create ticket
  const handleSubmitRegistration = async () => {
    if (!nik || !fullName || !phone) {
      setErrorMessage('Mohon lengkapi NIK, Nama Lengkap, dan Nomor HP Pasien.');
      setCurrentStep(1);
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const randomSeq = Math.floor(Math.random() * 80) + 10;
    const generatedQueueNumber = `${getQueuePrefix()}-${String(randomSeq).padStart(4, '0')}`;
    const generatedRegNumber = String(Math.floor(Math.random() * 900) + 50).padStart(4, '0');
    const feeText = patientType === 'BPJS' ? 'Rp. 0 (BPJS Kesehatan)' : 'Rp. 10,000';

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const formattedDateTime = `${day}/${month}/${year} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const payload = {
      patientType,
      nik,
      bpjsNumber,
      fullName: fullName.toUpperCase(),
      birthDate,
      gender,
      phone,
      address,
      poliId: selectedPoliId,
      appointmentDate,
      timeSlot: selectedTimeSlot,
      chiefComplaint: chiefComplaint || 'Pemeriksaan Kesehatan',
      klasterNumber: selectedKlasterNumber,
      klasterName: selectedKlasterNumber === 3 ? 'KLASTER 3' : `KLASTER ${selectedKlasterNumber}`,
      doctorName: selectedDoctorName,
      queueNumber: generatedQueueNumber,
      registrationNumber: generatedRegNumber,
      familyHead: familyHead ? familyHead.toUpperCase() : '',
      medicalRecordNo: medicalRecordNo || (nik ? `03${nik.slice(-6)}` : `03${Math.floor(100000 + Math.random() * 900000)}`),
      oldMedicalRecordNo: oldMedicalRecordNo || '',
      documentRmNo: documentRmNo || '',
      ageFormatted: calculatedDetailedAgeStr !== '-' ? calculatedDetailedAgeStr : '',
      fee: feeText,
      timestamp: formattedDate,
      timestampLoket: formattedDateTime,
      hadir: true
    };

    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        onTicketCreated(data.data);
      } else {
        // Fallback local ticket if server returns error
        const localTicket: QueueTicket = {
          id: `tkt-${Date.now()}`,
          queueNumber: generatedQueueNumber,
          patientType,
          nik,
          bpjsNumber,
          fullName: fullName.toUpperCase(),
          birthDate,
          gender,
          phone,
          address,
          poliId: selectedPoliId,
          poliName: selectedPoliName,
          klasterNumber: selectedKlasterNumber,
          klasterName: `KLASTER ${selectedKlasterNumber}`,
          doctorName: selectedDoctorName,
          registrationNumber: generatedRegNumber,
          familyHead: familyHead ? familyHead.toUpperCase() : '',
          medicalRecordNo: medicalRecordNo || (nik ? `03${nik.slice(-6)}` : `03${Math.floor(100000 + Math.random() * 900000)}`),
          oldMedicalRecordNo: oldMedicalRecordNo || '',
          documentRmNo: documentRmNo || '',
          ageFormatted: calculatedDetailedAgeStr !== '-' ? calculatedDetailedAgeStr : '',
          fee: feeText,
          appointmentDate,
          timeSlot: selectedTimeSlot,
          chiefComplaint: chiefComplaint || 'Pemeriksaan Kesehatan',
          status: 'Waiting',
          createdAt: now.toISOString(),
          estimatedTime: '~ 15 menit setelah loket dibuka',
          timestamp: formattedDate,
          timestampLoket: formattedDateTime,
          hadir: true,
          timestampBPU: '',
          timestampApotek: '',
          statusBPU: 'Menunggu',
          timestampLab: ''
        };
        onTicketCreated(localTicket);
      }
    } catch (err: any) {
      // Offline fallback
      const localTicket: QueueTicket = {
        id: `tkt-${Date.now()}`,
        queueNumber: generatedQueueNumber,
        patientType,
        nik,
        bpjsNumber,
        fullName: fullName.toUpperCase(),
        birthDate,
        gender,
        phone,
        address,
        poliId: selectedPoliId,
        poliName: selectedPoliName,
        klasterNumber: selectedKlasterNumber,
        klasterName: `KLASTER ${selectedKlasterNumber}`,
        doctorName: selectedDoctorName,
        registrationNumber: generatedRegNumber,
        familyHead: familyHead ? familyHead.toUpperCase() : '',
        medicalRecordNo: medicalRecordNo || (nik ? `03${nik.slice(-6)}` : `03${Math.floor(100000 + Math.random() * 900000)}`),
        oldMedicalRecordNo: oldMedicalRecordNo || '',
        documentRmNo: documentRmNo || '',
        ageFormatted: calculatedDetailedAgeStr !== '-' ? calculatedDetailedAgeStr : '',
        fee: feeText,
        appointmentDate,
        timeSlot: selectedTimeSlot,
        chiefComplaint: chiefComplaint || 'Pemeriksaan Kesehatan',
        status: 'Waiting',
        createdAt: now.toISOString(),
        estimatedTime: '~ 15 menit setelah loket dibuka',
        timestamp: formattedDate,
        timestampLoket: formattedDateTime,
        hadir: true,
        timestampBPU: '',
        timestampApotek: '',
        statusBPU: 'Menunggu',
        timestampLab: ''
      };
      onTicketCreated(localTicket);
    } finally {
      setSubmitting(false);
    }
  };

  const currentKlasterObj = KLASTER_LIST.find(k => k.number === selectedKlasterNumber) || KLASTER_LIST[2];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Integrasi Layanan Primer (ILP) • Kemenkes RI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pendaftaran Antrean Online & Klaster Pelayanan
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Alur pendaftaran mandiri cepat: Masukkan NIK / No BPJS, pilih Klaster 1-4 sesuai kebutuhan, tentukan Dokter & Jam, isi Keluhan, lalu terbitkan e-Tiket Kunjungan untuk dicetak.
          </p>
        </div>
      </div>

      {/* 5-Step Visual Progression Wizard Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center text-xs">
          
          {/* Step 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`p-2.5 rounded-xl transition flex flex-col items-center gap-1.5 ${
              currentStep === 1
                ? 'bg-emerald-600 text-white font-black shadow-md'
                : currentStep > 1
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                : 'bg-slate-50 text-slate-400 font-medium'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 1 ? 'bg-white text-emerald-700' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <span className="hidden sm:inline text-[11px] truncate">1. NIK / BPJS</span>
            <span className="sm:hidden text-[10px]">Identitas</span>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => setCurrentStep(2)}
            className={`p-2.5 rounded-xl transition flex flex-col items-center gap-1.5 ${
              currentStep === 2
                ? 'bg-emerald-600 text-white font-black shadow-md'
                : currentStep > 2
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                : 'bg-slate-50 text-slate-400 font-medium'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 2 ? 'bg-white text-emerald-700' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <span className="hidden sm:inline text-[11px] truncate">2. Pilih Klaster</span>
            <span className="sm:hidden text-[10px]">Klaster</span>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => setCurrentStep(3)}
            className={`p-2.5 rounded-xl transition flex flex-col items-center gap-1.5 ${
              currentStep === 3
                ? 'bg-emerald-600 text-white font-black shadow-md'
                : currentStep > 3
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                : 'bg-slate-50 text-slate-400 font-medium'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 3 ? 'bg-white text-emerald-700' : currentStep > 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
            </div>
            <span className="hidden sm:inline text-[11px] truncate">3. Dokter & Jam</span>
            <span className="sm:hidden text-[10px]">Dokter</span>
          </button>

          {/* Step 4 */}
          <button
            onClick={() => setCurrentStep(4)}
            className={`p-2.5 rounded-xl transition flex flex-col items-center gap-1.5 ${
              currentStep === 4
                ? 'bg-emerald-600 text-white font-black shadow-md'
                : currentStep > 4
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                : 'bg-slate-50 text-slate-400 font-medium'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 4 ? 'bg-white text-emerald-700' : currentStep > 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStep > 4 ? <Check className="w-3.5 h-3.5" /> : '4'}
            </div>
            <span className="hidden sm:inline text-[11px] truncate">4. Keluhan</span>
            <span className="sm:hidden text-[10px]">Keluhan</span>
          </button>

          {/* Step 5 */}
          <button
            onClick={() => setCurrentStep(5)}
            className={`p-2.5 rounded-xl transition flex flex-col items-center gap-1.5 ${
              currentStep === 5
                ? 'bg-emerald-600 text-white font-black shadow-md'
                : 'bg-slate-50 text-slate-400 font-medium'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 5 ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-500'
            }`}>
              5
            </div>
            <span className="hidden sm:inline text-[11px] truncate">5. Cetak Tiket</span>
            <span className="sm:hidden text-[10px]">Cetak</span>
          </button>

        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: MASUKKAN NIK / NO BPJS & DATA PASIEN */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Search Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-600" />
                  <span>Pencarian Cepat Berdasarkan NIK / BPJS</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ketik NIK KTP (16 Digit) atau Nomor Kartu BPJS untuk mengisi otomatis data rekam medis.
                </p>
              </div>

              {/* Sample patient quick filler */}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('3671042306040003');
                  setSearchSource('NIK');
                  handleSearchPatient();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 transition"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contoh Pasien: ADAM AZRA</span>
              </button>
            </div>

            {/* Radio Source */}
            <div className="flex items-center gap-4 text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchSource"
                  checked={searchSource === 'NIK'}
                  onChange={() => setSearchSource('NIK')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Gunakan NIK KTP (16 Digit)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchSource"
                  checked={searchSource === 'BPJS'}
                  onChange={() => setSearchSource('BPJS')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Gunakan No. Kartu BPJS</span>
              </label>
            </div>

            {/* Search Input Group */}
            <form onSubmit={handleSearchPatient} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchSource === 'NIK'
                      ? 'Masukkan 16 digit NIK KTP (contoh: 3671042306040003)...'
                      : 'Masukkan nomor kartu BPJS Kesehatan...'
                  }
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl text-sm font-mono font-bold text-slate-900 transition outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Cari Data</span>
              </button>
            </form>

            {searchHasRun && (
              <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
                foundPatient ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center gap-2.5">
                  {foundPatient ? <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" /> : <UserPlus className="w-5 h-5 text-amber-600 shrink-0" />}
                  <div>
                    <span className="font-bold block text-sm">
                      {foundPatient ? `Pasien Ditemukan: ${foundPatient.fullName}` : 'Data Pasien Belum Terdaftar (Pasien Baru)'}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {foundPatient
                        ? `No. RM: ${foundPatient.medicalRecordNo || '03304104'} • Tanggal Lahir: ${foundPatient.birthDate} • Umur: ${calculateDetailedAge(foundPatient.birthDate)}`
                        : 'Silakan lengkapi formulir identitas di bawah untuk membuat e-tiket antrean.'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Patient Identity Form */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>Kelengkapan Data Pasien</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Data ini akan tercetak secara akurat pada struk fisik Tiket Kunjungan.
                </p>
              </div>

              {/* Patient Type (BPJS / Umum) */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPatientType('BPJS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    patientType === 'BPJS' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  BPJS (Gratis)
                </button>
                <button
                  type="button"
                  onClick={() => setPatientType('Umum')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    patientType === 'Umum' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Umum (Rp 10.000)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* NIK */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">NIK KTP Pasien (16 Digit) *</label>
                <input
                  type="text"
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Masukkan 16 digit NIK..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none placeholder:font-sans placeholder:font-normal"
                />
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Lengkap Pasien *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap pasien sesuai KTP/KK..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase text-slate-900 focus:bg-white focus:border-emerald-600 outline-none placeholder:font-normal placeholder:capitalize"
                />
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tanggal Lahir *</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Jenis Kelamin</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              {/* No. HP / WhatsApp */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">No. HP / WhatsApp *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nomor HP/WA (cth: 08123456789)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none placeholder:font-normal"
                />
              </div>

              {/* No RM */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">No. Rekam Medis (No RM)</label>
                <input
                  type="text"
                  value={medicalRecordNo}
                  onChange={(e) => setMedicalRecordNo(e.target.value)}
                  placeholder="Nomor RM (otomatis/opsional)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:border-emerald-600 outline-none placeholder:font-sans placeholder:font-normal"
                />
              </div>

              {/* RM Lama */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">RM. Lama</label>
                <input
                  type="text"
                  value={oldMedicalRecordNo}
                  onChange={(e) => setOldMedicalRecordNo(e.target.value)}
                  placeholder="Nomor RM lama (opsional)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:border-emerald-600 outline-none placeholder:font-sans placeholder:font-normal"
                />
              </div>

              {/* No. Dokumen RM */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">No. Dokumen RM</label>
                <input
                  type="text"
                  value={documentRmNo}
                  onChange={(e) => setDocumentRmNo(e.target.value)}
                  placeholder="Nomor dokumen RM (opsional)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:border-emerald-600 outline-none placeholder:font-sans placeholder:font-normal"
                />
              </div>

              {/* Alamat Lengkap */}
              <div className="sm:col-span-2 lg:col-span-3 space-y-1">
                <label className="font-bold text-slate-700">Alamat Lengkap KTP / Domisili *</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat lengkap domisili / KTP (jalan, RT/RW, kelurahan, kecamatan, kota)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 uppercase focus:bg-white focus:border-emerald-600 outline-none placeholder:font-normal placeholder:capitalize"
                />
              </div>

            </div>

            {/* Calculated Age Preview Badge */}
            <div className="bg-slate-100 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Umur Terhitung Otomatis:</span>
              <span className="font-mono font-bold text-emerald-800 bg-white px-3 py-1 rounded-xl border border-slate-300">
                {calculatedDetailedAgeStr}
              </span>
            </div>

            {/* Navigation Next Step */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!nik || !fullName) {
                    setErrorMessage('Silakan isi NIK dan Nama Lengkap Pasien terlebih dahulu.');
                    return;
                  }
                  setErrorMessage('');
                  setCurrentStep(2);
                }}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2"
              >
                <span>Lanjut: Pilih Klaster (1-4)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PILIH KLASTER 1, 2, 3, 4 */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-2 border border-emerald-200">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standar Integrasi Pelayanan Primer (ILP)</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Pilih Klaster Pelayanan Pasien (Klaster 1, 2, 3, 4)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Sesuaikan klaster dengan kategori usia dan kebutuhan medis pasien:
              </p>
            </div>

            {/* 4 Klaster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KLASTER_LIST.map((klaster) => {
                const IconComponent = klaster.icon;
                const isSelected = selectedKlasterNumber === klaster.number;

                return (
                  <div
                    key={klaster.number}
                    onClick={() => handleSelectKlaster(klaster)}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br ${klaster.bgColor} ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-400/40 shadow-lg scale-[1.01]'
                        : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
                    }`}
                  >
                    {/* Top Tag & Selection Badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${klaster.badgeColor}`}>
                            {klaster.badge}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900 block mt-0.5">
                            Klaster {klaster.number}
                          </h4>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Tagline & Description */}
                    <div className="space-y-1.5 mb-4">
                      <p className="text-xs font-bold text-slate-800">
                        {klaster.tagline}
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {klaster.description}
                      </p>
                    </div>

                    {/* Sub-services pills */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Layanan Terkait:
                      </span>
                      <div className="space-y-1">
                        {klaster.services.map((srv) => (
                          <div
                            key={srv.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectKlaster(klaster);
                              handleSelectService(srv);
                            }}
                            className={`p-2 rounded-xl text-xs transition flex items-center justify-between ${
                              selectedServiceId === srv.id && isSelected
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-200'
                            }`}
                          >
                            <span className="truncate">{srv.name}</span>
                            {selectedServiceId === srv.id && isSelected && (
                              <Check className="w-3 h-3 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Klaster Selection Confirmation Card */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-emerald-800 font-medium block">Klaster & Layanan Terpilih:</span>
                <span className="text-slate-900 font-extrabold text-sm">
                  KLASTER {selectedKlasterNumber} • {selectedPoliName}
                </span>
              </div>
              <span className="text-emerald-700 font-bold bg-white px-3 py-1 rounded-xl border border-emerald-300">
                Poli: {selectedPoliId}
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Identitas</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2"
              >
                <span>Lanjut: Pilih Dokter & Jam</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: PILIH DOKTER & JAM / SESI LAYANAN */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                <span>Pilih Dokter & Jam Sesi Layanan</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Tentukan dokter penanggung jawab klaster dan jam kedatangan yang diinginkan.
              </p>
            </div>

            {/* Doctor Selection Grid */}
            <div className="space-y-3">
              <label className="font-extrabold text-slate-800 text-xs sm:text-sm block">
                1. Dokter Bertugas di Klaster {selectedKlasterNumber} ({selectedPoliName}):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredDoctors.map((doc) => {
                  const isDocSelected = selectedDoctorName === doc.doctorName;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorName(doc.doctorName)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                        isDocSelected
                          ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-400/30 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="font-black text-slate-900 block text-xs sm:text-sm">
                          {doc.doctorName}
                        </span>
                        <span className="text-[11px] text-slate-600 block">
                          {doc.specialty}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-block">
                          Status: {doc.status}
                        </span>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        isDocSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isDocSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date and Time Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              
              {/* Appointment Date */}
              <div className="space-y-2">
                <label className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>2. Tanggal Kunjungan:</span>
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  Dapat memesan hingga 1 bulan ke depan.
                </p>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>3. Jam Sesi Layanan:</span>
                </label>
                
                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSlotSelected = selectedTimeSlot === slot.time;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                          isSlotSelected
                            ? 'bg-emerald-600 text-white font-bold shadow-xs border-emerald-600'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div>
                          <span className="block font-mono">{slot.time}</span>
                          <span className={`text-[10px] ${isSlotSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                            {slot.quota}
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          isSlotSelected ? 'bg-white text-emerald-700' : 'border-slate-300'
                        }`}>
                          {isSlotSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Klaster</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2"
              >
                <span>Lanjut: Masukkan Keluhan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: MASUKKAN KELUHAN PASIEN */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Keluhan Utama / Alasan Berobat</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Deskripsikan gejala atau tujuan pemeriksaan pasien agar dokter dapat mempersiapkan rekam medis.
              </p>
            </div>

            {/* Quick Complaint Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Pilih Keluhan Cepat (Opsional):</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_COMPLAINTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setChiefComplaint(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition border text-left ${
                      chiefComplaint === item
                        ? 'bg-emerald-600 text-white font-bold border-emerald-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Catatan Keluhan / Gejala Medis Pasien:
              </label>
              <textarea
                rows={4}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Contoh: Demam tinggi sejak 2 hari yang lalu disertai batuk berdahak dan tenggorokan sakit..."
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl font-medium text-slate-900 focus:bg-white focus:border-emerald-600 outline-none text-sm"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Dokter & Jam</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2"
              >
                <span>Lanjut: Konfirmasi & Cetak Tiket</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: KONFIRMASI & CETAK TIKET KUNJUNGAN */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Langkah Terakhir: Terbitkan & Cetak Tiket</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Konfirmasi Tiket Kunjungan Pasien
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Periksa kembali data di bawah. Klik tombol <strong>"Terbitkan & Cetak Tiket Kunjungan"</strong> untuk menghasilkan struk fisik antrean.
              </p>
            </div>

            {/* Thermal Receipt Preview Box */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-300 max-w-lg mx-auto shadow-inner">
              <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm font-mono text-xs space-y-3">
                <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-slate-300">
                  <h4 className="text-sm font-black uppercase text-slate-900">TIKET KUNJUNGAN</h4>
                  <div className="font-bold text-slate-800">KLASTER {selectedKlasterNumber}</div>
                  <div className="font-bold text-slate-800">{selectedPoliName}</div>
                </div>

                <div className="text-center py-1 space-y-0.5">
                  <span className="text-[11px] text-slate-500">No. Antrean Estimasi:</span>
                  <div className="text-3xl font-black text-emerald-700 tracking-tight">
                    {getQueuePrefix()}-0013
                  </div>
                  <div className="text-[11px] text-slate-700 font-semibold">
                    Dokter: {selectedDoctorName}
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Jam: {selectedTimeSlot}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-dashed border-slate-300 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">NIK:</span>
                    <span className="font-bold">{nik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama:</span>
                    <span className="font-bold uppercase">{fullName}</span>
                  </div>
                  {familyHead ? (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ayah/KK:</span>
                      <span className="uppercase">{familyHead}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Umur:</span>
                    <span>{calculatedDetailedAgeStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Asuransi:</span>
                    <span className="font-bold">{patientType === 'BPJS' ? 'BPJS Kesehatan' : 'Pasien Umum'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Biaya:</span>
                    <span className="font-bold">{patientType === 'BPJS' ? 'Rp. 0 (BPJS)' : 'Rp. 10,000'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ubah Keluhan</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitRegistration}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl transition shadow-xl flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menerbitkan E-Tiket...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-5 h-5" />
                    <span>Terbitkan & Cetak Tiket Kunjungan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
