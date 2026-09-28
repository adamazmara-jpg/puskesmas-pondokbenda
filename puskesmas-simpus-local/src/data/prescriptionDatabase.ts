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

// Initial prescriptions start completely empty until doctor examines patient and finishes e-Prescription
export const INITIAL_PRESCRIPTIONS: PharmacyPrescription[] = [];

const LOCAL_STORAGE_KEY = 'puskesmas_pharmacy_prescriptions_data_v3';

export const getAllPrescriptions = (): PharmacyPrescription[] => {
  try {
    // Clean up deprecated v1/v2 keys with boilerplate dummy prescriptions
    if (localStorage.getItem('puskesmas_pharmacy_prescriptions_data_v2')) {
      localStorage.removeItem('puskesmas_pharmacy_prescriptions_data_v2');
    }
    if (localStorage.getItem('puskesmas_pharmacy_prescriptions_data')) {
      localStorage.removeItem('puskesmas_pharmacy_prescriptions_data');
    }

    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed: PharmacyPrescription[] = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return INITIAL_PRESCRIPTIONS;
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

export const clearAllPrescriptions = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem('puskesmas_pharmacy_prescriptions_data_v2');
    localStorage.removeItem('puskesmas_pharmacy_prescriptions_data');
  } catch (err) {
    console.warn('Failed to clear prescriptions', err);
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
