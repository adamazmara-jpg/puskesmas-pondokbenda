export type PatientType = 'BPJS' | 'Umum';
export type Gender = 'L' | 'P';
export type QueueStatus = 'Waiting' | 'Verified' | 'Called' | 'Completed' | 'Cancelled';

export interface QueueTicket {
  id: string;
  queueNumber: string; // e.g. AC-0013, A-012, B-005
  patientType: PatientType;
  nik: string;
  bpjsNumber?: string;
  fullName: string;
  birthDate: string;
  gender: Gender;
  phone: string;
  address: string;
  poliId: string;
  poliName: string;
  klasterNumber?: number; // 1, 2, 3, 4
  klasterName?: string; // e.g. "KLASTER 3", "UMUM DEWASA"
  doctorName?: string; // e.g. "dr. Ananto Adi Swasono"
  registrationNumber?: string; // e.g. "0064"
  familyHead?: string; // Ayah/KK: e.g. "JURIANTO"
  medicalRecordNo?: string; // No RM: e.g. "03304104"
  oldMedicalRecordNo?: string; // RM. Lama: e.g. "P367106014101319"
  documentRmNo?: string; // No. Dokumen RM: e.g. "P08-10-2017"
  ageFormatted?: string; // e.g. "22 Thn 2 Bln 5 Hr"
  fee?: string; // e.g. "Rp. 10,000"
  appointmentDate: string;
  timeSlot: string;
  chiefComplaint: string;
  status: QueueStatus;
  createdAt: string;
  estimatedTime: string;
  // Exact Google Sheet / Excel tracking columns
  timestamp?: string; // Format DD/MM/YYYY e.g. "02/09/2026"
  timestampLoket?: string; // Format DD/MM/YYYY H:mm:ss e.g. "02/09/2026 7:57:02"
  timestampBPU?: string; // Timestamp dokter BPU
  timestampApotek?: string; // Timestamp apotek
  statusBPU?: string; // Status pelayanan BPU
  timestampLab?: string; // Timestamp laboratorium
  hadir?: boolean; // Status kehadiran
}

export interface PoliService {
  id: string;
  code: string; // A, B, C, D...
  name: string;
  iconName: string;
  description: string;
  room: string;
  queuePrefix: string;
  activeQueueNumber: string;
  totalWaiting: number;
  doctorName: string;
  operatingHours: string;
  requirements: string[];
  feeGeneral: string;
  maxQuota?: number;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  reply?: string;
  repliedAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  rating: number; // 1 to 5
  servicePoli: string;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface DoctorSchedule {
  id: string;
  doctorName: string;
  specialty: string;
  poliId: string;
  poliName: string;
  klasterNumber?: number; // 1: Manajemen, 2: Ibu & Anak, 3: Dewasa & Lansia, 4: Penyakit Menular, 5: Lintas Klaster
  klasterName?: string;
  days: string[];
  hours: string;
  quotaPerDay: number;
  status: 'Hadir' | 'Cuti' | 'Pengganti';
  photoUrl?: string;
  sipNumber?: string;
  room?: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  category: 'Edukasi' | 'Pengumuman' | 'Vaksinasi' | 'Posyandu' | 'Tips Sehat' | 'Video Edukasi';
  snippet: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  badgeColor?: string;
  imageUrl?: string;
  videoUrl?: string;
  isVideo?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  isUrgent?: boolean;
}

export interface SurveySubmission {
  id?: string;
  patientName?: string;
  rating: number; // 1 to 5
  servicePoli: string;
  serviceQuality: number; // 1 to 5
  waitingTimeRating: number; // 1 to 5
  cleanlinessRating: number; // 1 to 5
  feedback?: string;
  createdAt?: string;
}

export interface SurveyStats {
  totalResponses: number;
  averageRating: number;
  satisfactionPercentage: number;
  ratingBreakdown: { [key: number]: number };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// ==========================================
// REKAM MEDIS ELEKTRONIK (RME) TYPES
// ==========================================
export interface VitalSigns {
  bloodPressure: string; // e.g. "120/80 mmHg"
  temperature: number; // e.g. 36.5 °C
  heartRate: number; // e.g. 80 bpm
  respiratoryRate?: number; // e.g. 18 x/mnt
  weightKg: number; // e.g. 62 kg
  heightCm: number; // e.g. 165 cm
  bmi?: number; // Body Mass Index
  bloodOxygen?: number; // e.g. 98 %
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string; // e.g. "3x1 tablet sesudah makan"
  quantity: number;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientNik: string;
  patientBpjs?: string;
  patientName: string;
  birthDate: string;
  gender: Gender;
  address: string;
  phone?: string;
  visitDate: string; // YYYY-MM-DD
  visitTime?: string; // e.g. "08:45 WIB"
  poliId: string;
  poliName: string;
  doctorName: string;
  patientType: PatientType;
  chiefComplaint: string; // Keluhan Utama / Anamnesa
  historyOfPresentIllness?: string; // Riwayat Penyakit Sekarang
  vitalSigns: VitalSigns;
  allergies?: string[];
  diagnosisCode: string; // ICD-10 Code, e.g. "J00", "I10", "K29.7"
  diagnosisName: string; // e.g. "Akut Nasofaringitis (Common Cold)"
  diagnosisCategory?: string;
  secondaryDiagnosis?: string;
  treatmentPlan: string; // Tindakan / Edukasi / Terapi
  prescriptions: PrescriptionItem[];
  status: 'Final' | 'Draft' | 'Dirujuk';
  referralNote?: string;
  notes?: string;
  createdAt: string;
}

