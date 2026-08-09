export type PatientType = 'BPJS' | 'Umum';
export type Gender = 'L' | 'P';
export type QueueStatus = 'Waiting' | 'Called' | 'Completed' | 'Cancelled';

export interface QueueTicket {
  id: string;
  queueNumber: string; // e.g. A-012, B-005
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
  appointmentDate: string;
  timeSlot: string;
  chiefComplaint: string;
  status: QueueStatus;
  createdAt: string;
  estimatedTime: string;
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
  days: string[];
  hours: string;
  quotaPerDay: number;
  status: 'Hadir' | 'Cuti' | 'Pengganti';
  photoUrl?: string;
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
