import { PrescriptionItem, PatientType } from '../types';

export interface PharmacyPrescription {
  id: string;
  ticketId?: string;
  queueNumber: string; // e.g. "A-001"
  patientNik: string;
  patientName: string;
  patientType: PatientType;
  bpjsNumber?: string;
  birthDate?: string;
  gender?: 'L' | 'P';
  phone?: string;
  poliId: string;
  poliName: string;
  doctorName: string;
  diagnosisCode: string; // e.g. "J00", "I10"
  diagnosisName: string; // e.g. "Akut Nasofaringitis"
  allergies?: string[];
  items: PrescriptionItem[];
  instructions?: string;
  status: 'Waiting' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  orderedAt: string; // ISO string or time format
  preparedAt?: string;
  completedAt?: string;
  pharmacistName?: string;
  totalItemsCount: number;
}

export const INITIAL_PRESCRIPTIONS: PharmacyPrescription[] = [
  {
    id: 'rx-2026-001',
    ticketId: 'tkt-001',
    queueNumber: 'A-001',
    patientNik: '3674065810690004',
    patientName: 'Yuda Hidayati',
    patientType: 'BPJS',
    bpjsNumber: '0001790635882',
    birthDate: '1969-10-18',
    gender: 'P',
    phone: '081298451201',
    poliId: 'poli-umum',
    poliName: 'Poli Umum',
    doctorName: 'dr. H. Bambang Suherman',
    diagnosisCode: 'I10',
    diagnosisName: 'Hipertensi Primer / Esensial (Grade 1)',
    allergies: ['Amoksisilin'],
    items: [
      { medicineName: 'Amlodipine 5 mg Tablet', dosage: '1 x 1 tablet (malam hari)', quantity: 30, notes: 'Minum teratur tiap malam sebelum tidur' },
      { medicineName: 'Paracetamol 500 mg Tablet', dosage: '3 x 1 tablet (bila sakit kepala/pusing)', quantity: 10, notes: 'Diminum sesudah makan' },
      { medicineName: 'Vitamin B Kompleks Tablet', dosage: '1 x 1 tablet (pagi)', quantity: 10, notes: 'Sesudah makan pagi' }
    ],
    instructions: 'Hindari makanan tinggi garam, kontrol tensi berkala ke Puskesmas.',
    status: 'Ready',
    orderedAt: '2026-08-26T08:15:00.000Z',
    preparedAt: '2026-08-26T08:25:00.000Z',
    pharmacistName: 'Apt. Siti Fadilah, S.Farm',
    totalItemsCount: 3
  },
  {
    id: 'rx-2026-002',
    ticketId: 'tkt-002',
    queueNumber: 'A-002',
    patientNik: '3674054509040005',
    patientName: 'Annisa Rahma Aulia',
    patientType: 'BPJS',
    bpjsNumber: '0004947282910',
    birthDate: '2004-09-05',
    gender: 'P',
    phone: '085712349811',
    poliId: 'poli-umum',
    poliName: 'Poli Umum',
    doctorName: 'dr. Siti Rahmawati, M.Kes',
    diagnosisCode: 'J00',
    diagnosisName: 'Akut Nasofaringitis / ISPA (Common Cold)',
    allergies: [],
    items: [
      { medicineName: 'Paracetamol 500 mg Tablet', dosage: '3 x 1 tablet (saat demam)', quantity: 10, notes: 'Sesudah makan' },
      { medicineName: 'Ambroxol 30 mg Tablet', dosage: '3 x 1 tablet', quantity: 10, notes: 'Sesudah makan untuk pengencer dahak' },
      { medicineName: 'Cetirizine 10 mg Tablet', dosage: '1 x 1 tablet (malam hari)', quantity: 5, notes: 'Bila bersin-bersin / alergi' },
      { medicineName: 'Vitamin C 500 mg Tablet', dosage: '1 x 1 tablet', quantity: 10, notes: 'Pagi hari sesudah makan' }
    ],
    instructions: 'Banyak minum air hangat, istirahat cukup, hindari makanan berminyak.',
    status: 'Preparing',
    orderedAt: '2026-08-26T08:40:00.000Z',
    pharmacistName: 'Apt. Siti Fadilah, S.Farm',
    totalItemsCount: 4
  },
  {
    id: 'rx-2026-003',
    ticketId: 'tkt-003',
    queueNumber: 'B-001',
    patientNik: '3674011504900001',
    patientName: 'Budi Setiawan',
    patientType: 'Umum',
    birthDate: '1990-04-15',
    gender: 'L',
    phone: '081234567890',
    poliId: 'poli-gigi',
    poliName: 'Poli Gigi & Mulut',
    doctorName: 'drg. Anita Putri, Sp.KG',
    diagnosisCode: 'K04.0',
    diagnosisName: 'Pulpitis Akut & Gingivitis',
    allergies: ['Penisilin'],
    items: [
      { medicineName: 'Asam Mefenamat 500 mg', dosage: '3 x 1 kaplet (bila nyeri gigi)', quantity: 10, notes: 'Sesudah makan' },
      { medicineName: 'Clindamycin 300 mg Kapsul', dosage: '3 x 1 kapsul (habiskan)', quantity: 10, notes: 'Antibiotik, wajib dihabiskan' },
      { medicineName: 'Obat Kumur Povidone Iodine 1%', dosage: '3 x sehari kumur-kumur', quantity: 1, notes: 'Kumur 30 detik setelah sikat gigi' }
    ],
    instructions: 'Hindari makanan terlalu panas/dingin dan manis.',
    status: 'Waiting',
    orderedAt: '2026-08-26T09:05:00.000Z',
    totalItemsCount: 3
  }
];

const LOCAL_STORAGE_KEY = 'puskesmas_pharmacy_prescriptions_data';

export const getAllPrescriptions = (): PharmacyPrescription[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_PRESCRIPTIONS;
  } catch {
    return INITIAL_PRESCRIPTIONS;
  }
};

export const savePrescriptions = (list: PharmacyPrescription[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save prescriptions to localStorage', err);
  }
};

export const addPrescription = (prescription: Omit<PharmacyPrescription, 'id' | 'orderedAt'>): PharmacyPrescription => {
  const current = getAllPrescriptions();
  const newRx: PharmacyPrescription = {
    ...prescription,
    id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    orderedAt: new Date().toISOString()
  };
  const updated = [newRx, ...current];
  savePrescriptions(updated);
  return newRx;
};

export const updatePrescriptionStatus = (
  id: string,
  status: PharmacyPrescription['status'],
  pharmacistName?: string
): PharmacyPrescription[] => {
  const current = getAllPrescriptions();
  const updated = current.map(rx => {
    if (rx.id === id) {
      const now = new Date().toISOString();
      return {
        ...rx,
        status,
        pharmacistName: pharmacistName || rx.pharmacistName || 'Apt. Siti Fadilah, S.Farm',
        preparedAt: status === 'Preparing' || status === 'Ready' ? (rx.preparedAt || now) : rx.preparedAt,
        completedAt: status === 'Completed' ? now : rx.completedAt
      };
    }
    return rx;
  });
  savePrescriptions(updated);
  return updated;
};
