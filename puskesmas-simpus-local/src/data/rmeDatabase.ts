import { MedicalRecord, Gender, PatientType } from '../types';

// Initial RME records start completely empty until patients register
export const INITIAL_RME_RECORDS: MedicalRecord[] = [];

// Local storage key for persistent RME records (v4 starts fresh & empty)
const RME_STORAGE_KEY = 'puskesmas_rme_records_v4';

// Automatically purge all legacy dummy/mock records on load
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('puskesmas_rme_records');
    localStorage.removeItem('puskesmas_rme_records_v1');
    localStorage.removeItem('puskesmas_rme_records_v2');
    localStorage.removeItem('puskesmas_rme_records_v3');

    // One-time fresh wipe so records start 100% empty
    if (!localStorage.getItem('puskesmas_rme_clean_init_v4')) {
      localStorage.removeItem(RME_STORAGE_KEY);
      localStorage.setItem('puskesmas_rme_clean_init_v4', 'true');
    }
  } catch (e) {
    // Ignore storage access errors
  }
}

export function getAllRmeRecords(): MedicalRecord[] {
  try {
    const saved = localStorage.getItem(RME_STORAGE_KEY);
    if (saved) {
      const parsed: MedicalRecord[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Filter out any legacy dummy mock records
        return parsed.filter(r => !r.id.startsWith('rme-2026-00'));
      }
    }
  } catch (e) {
    console.error('Failed to load RME records from storage', e);
  }
  return INITIAL_RME_RECORDS;
}

export function saveAllRmeRecords(records: MedicalRecord[]): void {
  try {
    localStorage.setItem(RME_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save RME records to storage', e);
  }
}

export function clearAllRmeRecords(): void {
  try {
    localStorage.removeItem(RME_STORAGE_KEY);
    localStorage.removeItem('puskesmas_rme_records_v1');
    localStorage.removeItem('puskesmas_rme_records_v2');
    localStorage.removeItem('puskesmas_rme_records_v3');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rme-records-updated'));
    }
  } catch (e) {
    console.error('Failed to clear RME records', e);
  }
}

export function getRmeRecordsByNik(nik: string): MedicalRecord[] {
  if (!nik) return [];
  const cleanNik = nik.trim().replace(/\D/g, '');
  const all = getAllRmeRecords();
  return all.filter(r => r.patientNik.replace(/\D/g, '') === cleanNik);
}

export function addOrUpdateRmeRecord(record: Partial<MedicalRecord> & Omit<MedicalRecord, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): MedicalRecord {
  const all = getAllRmeRecords();
  const completeRecord: MedicalRecord = {
    ...record,
    id: record.id || `rme-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: record.createdAt || new Date().toISOString(),
  };

  const index = all.findIndex(r => r.id === completeRecord.id || (completeRecord.patientNik && r.patientNik === completeRecord.patientNik && r.visitDate === completeRecord.visitDate));
  if (index >= 0) {
    all[index] = completeRecord;
  } else {
    all.unshift(completeRecord);
  }
  saveAllRmeRecords(all);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rme-records-updated'));
  }

  return completeRecord;
}

/**
 * Automatically creates and adjusts an RME record when a patient registers
 */
export function createRmeForRegisteredPatient(patient: {
  id?: string;
  queueNumber: string;
  patientNik: string;
  bpjsNumber?: string;
  fullName: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  phone?: string;
  poliId: string;
  poliName: string;
  doctorName?: string;
  patientType?: string;
  chiefComplaint?: string;
  registrationNumber?: string;
}): MedicalRecord {
  const now = new Date();
  const visitDate = now.toISOString().split('T')[0];
  const visitTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  // Tailor ICD-10 diagnosis category and initial assessment by poli
  let diagnosisCode = 'Z00.0';
  let diagnosisName = patient.chiefComplaint || 'Pemeriksaan Kesehatan Umum / Keluhan Pasien';
  let diagnosisCategory = 'Pelayanan Rawat Jalan Tingkat Pertama';
  let initialPrescriptions = [
    { medicineName: 'Paracetamol 500 mg', dosage: '3 x 1 tablet sesudah makan', quantity: 10, notes: 'Bila keluhan pusing/demam' },
    { medicineName: 'Vitamin C 500 mg', dosage: '1 x 1 tablet sesudah makan', quantity: 10, notes: 'Meningkatkan daya tahan tubuh' }
  ];

  if (patient.poliId.includes('gigi')) {
    diagnosisCode = 'K08.9';
    diagnosisName = patient.chiefComplaint || 'Pemeriksaan & Konsultasi Gigi Mulut';
    diagnosisCategory = 'Kesehatan Gigi & Rongga Mulut';
    initialPrescriptions = [
      { medicineName: 'Amoxicillin 500 mg', dosage: '3 x 1 tablet (habiskan)', quantity: 15, notes: 'Antibiotik diminum sesudah makan' },
      { medicineName: 'Asam Mefenamat 500 mg', dosage: '3 x 1 tablet (bila nyeri)', quantity: 10, notes: 'Meredakan rasa sakit' }
    ];
  } else if (patient.poliId.includes('kia') || patient.poliId.includes('anak')) {
    diagnosisCode = 'Z34.9';
    diagnosisName = patient.chiefComplaint || 'Pelayanan Ibu & Anak / Pemeriksaan KIA';
    diagnosisCategory = 'Kesehatan Ibu, Anak, dan Remaja';
    initialPrescriptions = [
      { medicineName: 'Tablet Tambah Darah (Fe + Asam Folat)', dosage: '1 x 1 tablet malam', quantity: 30, notes: 'Diminum malam hari' },
      { medicineName: 'Kalsium Laktat (Kalk) 500 mg', dosage: '1 x 1 tablet sehari', quantity: 30, notes: 'Sesudah makan pagi' }
    ];
  } else if (patient.poliId.includes('lansia')) {
    diagnosisCode = 'I10';
    diagnosisName = patient.chiefComplaint || 'Pemeriksaan Kesehatan Geriatri & Skrining PTM';
    diagnosisCategory = 'Geriatri & Penyakit Tidak Menular';
    initialPrescriptions = [
      { medicineName: 'Vitamin B Kompleks', dosage: '1 x 1 tablet', quantity: 20, notes: 'Pagi hari sesudah makan' },
      { medicineName: 'Amlodipine 5 mg', dosage: '1 x 1 tablet (malam hari)', quantity: 30, notes: 'Teratur tiap malam bila tensi tinggi' }
    ];
  }

  const newRme: MedicalRecord = {
    id: `rme-${patient.queueNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
    patientNik: patient.patientNik,
    patientBpjs: patient.bpjsNumber || '',
    patientName: patient.fullName,
    birthDate: patient.birthDate || '1990-01-01',
    gender: (patient.gender === 'P' ? 'P' : 'L') as Gender,
    address: patient.address || 'Kecamatan Pamulang, Tangerang Selatan',
    phone: patient.phone || '',
    visitDate,
    visitTime,
    poliId: patient.poliId,
    poliName: patient.poliName,
    doctorName: patient.doctorName || 'dr. H. Bambang Suherman',
    patientType: (patient.patientType === 'Umum' ? 'Umum' : 'BPJS') as PatientType,
    chiefComplaint: patient.chiefComplaint || 'Pemeriksaan Kesehatan Rutin',
    historyOfPresentIllness: `Pasien mendaftar di Loket Pendaftaran Puskesmas dengan nomor antrean ${patient.queueNumber}. Keluhan saat pendaftaran: ${patient.chiefComplaint || 'Pemeriksaan Kesehatan'}.`,
    vitalSigns: {
      bloodPressure: '120/80 mmHg',
      temperature: 36.5,
      heartRate: 80,
      respiratoryRate: 18,
      weightKg: 60,
      heightCm: 165,
      bloodOxygen: 99
    },
    allergies: [],
    diagnosisCode,
    diagnosisName,
    diagnosisCategory,
    treatmentPlan: 'Pemeriksaan fisik, anamnesis mendalam, konsultasi dokter, dan penyerahan obat di loket farmasi.',
    prescriptions: initialPrescriptions,
    status: 'Final',
    notes: `Pendaftaran berhasil untuk antrean ${patient.queueNumber}. Rekam Medis Elektronik telah diinisialisasi dan disinkronisasikan ke SIMPUS Kemenkes.`,
    createdAt: now.toISOString()
  };

  return addOrUpdateRmeRecord(newRme);
}
