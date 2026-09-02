import { MedicalRecord } from '../types';

export const INITIAL_RME_RECORDS: MedicalRecord[] = [
  {
    id: 'rme-2026-001',
    patientNik: '3674065810690004',
    patientBpjs: '1790635882',
    patientName: 'Yuda hidayati',
    birthDate: '1969-10-18',
    gender: 'P',
    address: 'Jln benda barat 4 b 12 no 4 pamulang 2',
    phone: '081298451201',
    visitDate: '2026-08-20',
    visitTime: '08:45 WIB',
    poliId: 'poli-umum',
    poliName: 'Poli Umum',
    doctorName: 'dr. H. Bambang Suherman',
    patientType: 'BPJS',
    chiefComplaint: 'Pusing berputar, tengkuk terasa berat sejak 3 hari yang lalu',
    historyOfPresentIllness: 'Pasien mengeluh pusing cekot-cekot sejak 3 hari lalu, riwayat hipertensi tidak rutin minum obat. Tidak ada keluhan mual muntah.',
    vitalSigns: {
      bloodPressure: '150/95 mmHg',
      temperature: 36.6,
      heartRate: 84,
      respiratoryRate: 19,
      weightKg: 64,
      heightCm: 156,
      bmi: 26.3,
      bloodOxygen: 98
    },
    allergies: ['Amoksisilin'],
    diagnosisCode: 'I10',
    diagnosisName: 'Hipertensi Primer / Esensial (Grade 1)',
    diagnosisCategory: 'Penyakit Kardiovaskular',
    secondaryDiagnosis: 'Cephalgia Tension',
    treatmentPlan: 'Edukasi diet rendah garam (< 1 sdt/hari), manajemen stres, istirahat cukup, kontrol tensi ulang 1 minggu.',
    prescriptions: [
      { medicineName: 'Amlodipine 5 mg', dosage: '1 x 1 tablet (malam hari)', quantity: 30, notes: 'Minum teratur tiap malam' },
      { medicineName: 'Paracetamol 500 mg', dosage: '3 x 1 tablet (bila pusing)', quantity: 10, notes: 'Sesudah makan' },
      { medicineName: 'Vitamin B Kompleks', dosage: '1 x 1 tablet', quantity: 10, notes: 'Pagi hari sesudah makan' }
    ],
    status: 'Final',
    notes: 'Kondisi stabil, disarankan rutin kontrol di Prolanis Puskesmas Pondok Benda.',
    createdAt: '2026-08-20T09:10:00.000Z'
  },
  {
    id: 'rme-2026-002',
    patientNik: '3674054509040005',
    patientBpjs: '49472829',
    patientName: 'Annisa Rahma Aulia',
    birthDate: '2004-09-05',
    gender: 'P',
    address: 'Griya Laksana Pinasti Blok C6, Kel. Pondok Benda',
    phone: '085712349811',
    visitDate: '2026-08-22',
    visitTime: '09:20 WIB',
    poliId: 'poli-umum',
    poliName: 'Poli Umum',
    doctorName: 'dr. H. Bambang Suherman',
    patientType: 'BPJS',
    chiefComplaint: 'Demam 2 hari, batuk berdahak encer, hidung tersumbat, dan nyeri menelan',
    historyOfPresentIllness: 'Demam mendadak sejak 2 hari yang lalu terutama sore hari. Batuk berdahak putih, pilek, badan pegal-pegal.',
    vitalSigns: {
      bloodPressure: '115/75 mmHg',
      temperature: 38.2,
      heartRate: 88,
      respiratoryRate: 20,
      weightKg: 50,
      heightCm: 158,
      bmi: 20.0,
      bloodOxygen: 99
    },
    allergies: [],
    diagnosisCode: 'J00',
    diagnosisName: 'Akut Nasofaringitis / ISPA (Common Cold)',
    diagnosisCategory: 'Penyakit Saluran Pernapasan',
    treatmentPlan: 'Banyak minum air hangat (minimal 2 liter/hari), istirahat cukup, hindari makanan gorengan dan minuman dingin.',
    prescriptions: [
      { medicineName: 'Paracetamol 500 mg', dosage: '3 x 1 tablet (saat demam)', quantity: 12, notes: 'Sesudah makan' },
      { medicineName: 'Ambroxol 30 mg', dosage: '3 x 1 tablet', quantity: 10, notes: 'Sesudah makan' },
      { medicineName: 'Cetirizine 10 mg', dosage: '1 x 1 tablet (malam)', quantity: 5, notes: 'Bila pilek/gatal' },
      { medicineName: 'Vitamin C 500 mg', dosage: '1 x 1 tablet', quantity: 10, notes: 'Pagi sesudah makan' }
    ],
    status: 'Final',
    notes: 'Bila demam tidak turun dalam 3 hari, disarankan cek laboratorium Darah Lengkap.',
    createdAt: '2026-08-22T09:40:00.000Z'
  },
  {
    id: 'rme-2026-003',
    patientNik: '3674061406940002',
    patientBpjs: '2225611686',
    patientName: 'Sandy Dharmawan',
    birthDate: '1994-06-14',
    gender: 'L',
    address: 'Kp. Cogreg RT 02/03 NO. 21, COGREG, PARUNG',
    phone: '081388123901',
    visitDate: '2026-08-18',
    visitTime: '10:15 WIB',
    poliId: 'poli-umum',
    poliName: 'Poli Umum',
    doctorName: 'dr. H. Bambang Suherman',
    patientType: 'BPJS',
    chiefComplaint: 'Nyeri ulu hati terasa perih terbakar dan kembung mual',
    historyOfPresentIllness: 'Nyeri ulu hati kambuh-kambuhan setelah telat makan dan minum kopi berlebihan. Mual (+), muntah (-).',
    vitalSigns: {
      bloodPressure: '120/80 mmHg',
      temperature: 36.5,
      heartRate: 78,
      respiratoryRate: 18,
      weightKg: 68,
      heightCm: 170,
      bmi: 23.5,
      bloodOxygen: 99
    },
    allergies: [],
    diagnosisCode: 'K29.7',
    diagnosisName: 'Gastritis Akut / Dispepsia Sindrom',
    diagnosisCategory: 'Penyakit Saluran Pencernaan',
    treatmentPlan: 'Pola makan teratur (porsi kecil tapi sering), hindari makanan pedas, asam, santan kental, kopi, dan rokok.',
    prescriptions: [
      { medicineName: 'Omeprazole 20 mg', dosage: '2 x 1 kapsul (30 menit sebelum makan)', quantity: 14, notes: 'Sebelum sarapan & makan malam' },
      { medicineName: 'Antasida Doen Tablet', dosage: '3 x 1 tablet kunyah (1 jam sebelum makan)', quantity: 15, notes: 'Dikunyah halus' },
      { medicineName: 'Domperidone 10 mg', dosage: '3 x 1 tablet (sebelum makan)', quantity: 10, notes: 'Meredakan mual' }
    ],
    status: 'Final',
    notes: 'Terapi 7 hari, kontrol ulang jika keluhan menetap.',
    createdAt: '2026-08-18T10:35:00.000Z'
  },
  {
    id: 'rme-2026-004',
    patientNik: '3211035204950001',
    patientBpjs: '',
    patientName: 'Fitria anggraeni',
    birthDate: '1996-05-26',
    gender: 'P',
    address: 'Jl.lebak indah parakan, rt01 rw08',
    phone: '081233445566',
    visitDate: '2026-08-19',
    visitTime: '09:00 WIB',
    poliId: 'poli-gigi',
    poliName: 'Poli Gigi & Mulut',
    doctorName: 'drg. Maya Rosdiana',
    patientType: 'Umum',
    chiefComplaint: 'Gigi geraham bawah kanan berlubang dan ngilu bila minum dingin',
    historyOfPresentIllness: 'Gigi 46 karies profunda, sondasi (+), perkusi (-), palpasi (-), belum ada pembengkakan gusi.',
    vitalSigns: {
      bloodPressure: '110/70 mmHg',
      temperature: 36.4,
      heartRate: 76,
      respiratoryRate: 16,
      weightKg: 52,
      heightCm: 160,
      bmi: 20.3,
      bloodOxygen: 99
    },
    allergies: [],
    diagnosisCode: 'K02.1',
    diagnosisName: 'Karies Dentin (Pulpitis Reversibel Gigi 46)',
    diagnosisCategory: 'Kesehatan Gigi & Mulut',
    treatmentPlan: 'Ekskavasi jaringan karies, aplikasi cavity liner (CaOH), tumpatan sementara untuk observasi pulpitis sebelum penambalan permanen Glass Ionomer Cement (GIC).',
    prescriptions: [
      { medicineName: 'Asam Mefenamat 500 mg', dosage: '3 x 1 tablet (bila nyeri)', quantity: 10, notes: 'Sesudah makan' }
    ],
    status: 'Final',
    notes: 'Jadwal kontrol penambalan tetap 1 minggu kemudian (26 Agustus 2026).',
    createdAt: '2026-08-19T09:30:00.000Z'
  },
  {
    id: 'rme-2026-005',
    patientNik: '3674064803260002',
    patientBpjs: '3954533758',
    patientName: 'XAVIERA HAMEEDA RAYYANA',
    birthDate: '2026-03-08',
    gender: 'P',
    address: 'JALAN BENDA TIMUR 13A Blok E31 no.8',
    phone: '081299887766',
    visitDate: '2026-08-15',
    visitTime: '08:30 WIB',
    poliId: 'poli-anak-imunisasi',
    poliName: 'Poli Anak & Imunisasi',
    doctorName: 'dr. Siska Rahmawati, Sp.A',
    patientType: 'BPJS',
    chiefComplaint: 'Imunisasi rutin bayi usia 5 bulan (DPT-HB-Hib 3 & Polio)',
    historyOfPresentIllness: 'Bayi sehat, aktif, minum ASI baik, tidak ada demam atau batuk pilek.',
    vitalSigns: {
      bloodPressure: '-',
      temperature: 36.7,
      heartRate: 110,
      respiratoryRate: 28,
      weightKg: 7.2,
      heightCm: 65,
      bmi: 17.0,
      bloodOxygen: 100
    },
    allergies: [],
    diagnosisCode: 'Z23',
    diagnosisName: 'Pemeriksaan Imunisasi Rutin Bayi Sehat',
    diagnosisCategory: 'Pelayanan Imunisasi & Tumbuh Kembang',
    treatmentPlan: 'Pemberian vaksin Pentavalent (DPT-HB-Hib 3) 0.5 ml IM di paha anterolateral kiri + Polio Tetes (OPV 3) 2 tetes oral. Edukasi kompres air hangat bila terjadi kemerahan/bengkak bekas suntikan.',
    prescriptions: [
      { medicineName: 'Paracetamol Drop 100 mg/ml', dosage: '3 x 0.6 ml (hanya bila demam > 38°C)', quantity: 1, notes: 'Gunakan pipet takar' }
    ],
    status: 'Final',
    notes: 'Tumbuh kembang sesuai kurva WHO. Jadwal berikutnya: Vaksin Campak-Rubella (MR) usia 9 bulan.',
    createdAt: '2026-08-15T08:50:00.000Z'
  },
  {
    id: 'rme-2026-006',
    patientNik: '3674060505580007',
    patientBpjs: '3633708216',
    patientName: 'Ahmad',
    birthDate: '1958-05-05',
    gender: 'L',
    address: 'Jalan salak 8 rt/rw 001/003',
    phone: '081277112299',
    visitDate: '2026-08-21',
    visitTime: '08:15 WIB',
    poliId: 'poli-lansia-ptm',
    poliName: 'Poli Lansia & PTM',
    doctorName: 'dr. Ahmad Fauzi',
    patientType: 'BPJS',
    chiefComplaint: 'Kontrol rutin Diabetes Melitus dan Hipertensi bulanan, kaki sering kesemutan',
    historyOfPresentIllness: 'Pasien lansia dengan riwayat DM tipe 2 dan HT sejak 6 tahun lalu. Gula Darah Puasa: 135 mg/dL, Tensi 140/90 mmHg.',
    vitalSigns: {
      bloodPressure: '140/90 mmHg',
      temperature: 36.5,
      heartRate: 74,
      respiratoryRate: 18,
      weightKg: 62,
      heightCm: 162,
      bmi: 23.6,
      bloodOxygen: 98
    },
    allergies: [],
    diagnosisCode: 'E11.9',
    diagnosisName: 'Diabetes Mellitus Tipe 2 Tanpa Komplikasi Akut',
    diagnosisCategory: 'Penyakit Metabolik & Endokrin',
    secondaryDiagnosis: 'I10 - Hipertensi Esensial',
    treatmentPlan: 'Senam lansia rutin 3x seminggu, batasi konsumsi karbohidrat sederhana/gula, jaga kebersihan kaki (foot care DM).',
    prescriptions: [
      { medicineName: 'Metformin 500 mg', dosage: '2 x 1 tablet (bersama makan)', quantity: 60, notes: 'Pagi & malam saat makan' },
      { medicineName: 'Glimepiride 2 mg', dosage: '1 x 1 tablet (sebelum sarapan)', quantity: 30, notes: 'Pagi 15 menit sebelum makan' },
      { medicineName: 'Candesartan 8 mg', dosage: '1 x 1 tablet (pagi)', quantity: 30, notes: 'Minum teratur' },
      { medicineName: 'Mecobalamin 500 mcg', dosage: '2 x 1 kapsul', quantity: 30, notes: 'Untuk mengatasi neuropati kesemutan' }
    ],
    status: 'Final',
    notes: 'Gula darah terkontrol sedang. Kontrol kembali bulan depan atau bila ada luka di kaki.',
    createdAt: '2026-08-21T08:45:00.000Z'
  }
];

// Local storage key for persistent RME records
const RME_STORAGE_KEY = 'puskesmas_rme_records_v1';

export function getAllRmeRecords(): MedicalRecord[] {
  try {
    const saved = localStorage.getItem(RME_STORAGE_KEY);
    if (saved) {
      const parsed: MedicalRecord[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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

  const index = all.findIndex(r => r.id === completeRecord.id);
  if (index >= 0) {
    all[index] = completeRecord;
  } else {
    all.unshift(completeRecord);
  }
  saveAllRmeRecords(all);
  return completeRecord;
}
