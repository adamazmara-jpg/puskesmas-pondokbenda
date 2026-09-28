import * as XLSX from 'xlsx';
import { QueueTicket, MedicalRecord } from '../types';
import { calculateAge } from '../data/patientDatabase';

export interface ExcelExportFilter {
  year: number;
  startMonth: number; // 1 to 12
  endMonth: number;   // 1 to 12
  poliId?: string;    // 'all' or specific poli id
  patientType?: string; // 'all' | 'BPJS' | 'Umum'
  status?: string;    // 'all' | 'Waiting' | 'Called' | 'Completed' | 'Verified' | 'Cancelled'
}

export const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function exportPatientVisitsToExcel(
  tickets: QueueTicket[],
  rmeRecords: MedicalRecord[],
  filters: ExcelExportFilter
) {
  // 1. Filter tickets based on criteria
  const filteredTickets = tickets.filter(t => {
    // Determine date from ticket appointmentDate or createdAt
    const dateStr = t.appointmentDate || t.createdAt.split('T')[0];
    const [tYearStr, tMonthStr] = dateStr.split('-');
    const tYear = parseInt(tYearStr, 10);
    const tMonth = parseInt(tMonthStr, 10);

    if (tYear !== filters.year) return false;
    if (tMonth < filters.startMonth || tMonth > filters.endMonth) return false;

    if (filters.poliId && filters.poliId !== 'all' && t.poliId !== filters.poliId) {
      return false;
    }

    if (filters.patientType && filters.patientType !== 'all' && t.patientType !== filters.patientType) {
      return false;
    }

    if (filters.status && filters.status !== 'all' && t.status !== filters.status) {
      return false;
    }

    return true;
  });

  // 2. Map tickets with associated RME diagnosis and details
  const rmeMapByNik = new Map<string, MedicalRecord>();
  rmeRecords.forEach(r => {
    const cleanNik = r.patientNik.replace(/\D/g, '');
    if (cleanNik && !rmeMapByNik.has(cleanNik)) {
      rmeMapByNik.set(cleanNik, r);
    }
  });

  // 3. Construct Data Rows for Sheet 1: "Laporan Kunjungan Pasien"
  const visitRows = filteredTickets.map((t, idx) => {
    const cleanNik = t.nik ? t.nik.replace(/\D/g, '') : '';
    const rme = cleanNik ? rmeMapByNik.get(cleanNik) : undefined;
    const age = t.birthDate ? calculateAge(t.birthDate) : '-';

    const statusLabel = 
      t.status === 'Completed' ? 'Selesai Dilayani' :
      t.status === 'Called' ? 'Sedang Diperiksa' :
      t.status === 'Verified' ? 'Terverifikasi' :
      t.status === 'Waiting' ? 'Menunggu Antrean' :
      t.status === 'Cancelled' ? 'Dibatalkan' : t.status;

    const prescriptionSummary = rme && rme.prescriptions && rme.prescriptions.length > 0
      ? rme.prescriptions.map(p => `${p.medicineName} (${p.dosage})`).join('; ')
      : '-';

    return {
      'No': idx + 1,
      'No. Antrean': t.queueNumber,
      'Tanggal Kunjungan': t.appointmentDate || t.createdAt.split('T')[0],
      'Sesi Waktu': t.timeSlot || '08:00 - 11:00 WIB',
      'NIK KTP Pasien': t.nik,
      'No. BPJS': t.bpjsNumber || '-',
      'Nama Pasien': t.fullName,
      'Jenis Kelamin': t.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      'Usia': `${age} Tahun`,
      'Tanggal Lahir': t.birthDate || '-',
      'No. Telepon / WA': t.phone || '-',
      'Alamat Domisili': t.address,
      'Poliklinik Tujuan': t.poliName,
      'Dokter Penanggung Jawab': rme?.doctorName || 'dr. Jaga Poliklinik',
      'Keluhan Utama': t.chiefComplaint || rme?.chiefComplaint || 'Pemeriksaan Kesehatan',
      'Diagnosa Medis (ICD-10)': rme ? `${rme.diagnosisCode} - ${rme.diagnosisName}` : 'Dalam Observasi / Pemeriksaan',
      'Tindakan & Terapi': rme?.treatmentPlan || '-',
      'Resep Obat RME': prescriptionSummary,
      'Jenis Pasien': t.patientType,
      'Status Pelayanan': statusLabel,
      'Waktu Daftar': t.createdAt ? new Date(t.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : '-'
    };
  });

  // 4. Construct Data Rows for Sheet 2: "Rekapitulasi & Statistik"
  const totalVisits = filteredTickets.length;
  const bpjsCount = filteredTickets.filter(t => t.patientType === 'BPJS').length;
  const umumCount = filteredTickets.filter(t => t.patientType === 'Umum').length;
  const completedCount = filteredTickets.filter(t => t.status === 'Completed').length;
  const calledCount = filteredTickets.filter(t => t.status === 'Called').length;
  const waitingCount = filteredTickets.filter(t => t.status === 'Waiting').length;

  // Breakdown by Poli
  const poliCounts: { [poliName: string]: number } = {};
  filteredTickets.forEach(t => {
    poliCounts[t.poliName] = (poliCounts[t.poliName] || 0) + 1;
  });

  const periodLabel = filters.startMonth === filters.endMonth
    ? `${MONTH_NAMES_ID[filters.startMonth - 1]} ${filters.year}`
    : `${MONTH_NAMES_ID[filters.startMonth - 1]} s/d ${MONTH_NAMES_ID[filters.endMonth - 1]} ${filters.year}`;

  const summaryMetaRows = [
    { 'Kategori': 'Nama Fasilitas Kesehatan', 'Nilai': 'UPTD Puskesmas Pondok Benda' },
    { 'Kategori': 'Kota / Wilayah', 'Nilai': 'Kota Tangerang Selatan, Banten' },
    { 'Kategori': 'Periode Laporan', 'Nilai': periodLabel },
    { 'Kategori': 'Tanggal Export Laporan', 'Nilai': new Date().toLocaleString('id-ID') },
    { 'Kategori': 'Total Pasien Terdaftar', 'Nilai': `${totalVisits} Orang` },
    { 'Kategori': 'Pasien BPJS Kesehatan', 'Nilai': `${bpjsCount} Orang (${totalVisits > 0 ? ((bpjsCount/totalVisits)*100).toFixed(1) : 0}%)` },
    { 'Kategori': 'Pasien Umum / Non-BPJS', 'Nilai': `${umumCount} Orang (${totalVisits > 0 ? ((umumCount/totalVisits)*100).toFixed(1) : 0}%)` },
    { 'Kategori': 'Status: Selesai Dilayani', 'Nilai': `${completedCount} Orang` },
    { 'Kategori': 'Status: Sedang Diperiksa', 'Nilai': `${calledCount} Orang` },
    { 'Kategori': 'Status: Menunggu Antrean', 'Nilai': `${waitingCount} Orang` },
  ];

  const poliBreakdownRows = Object.entries(poliCounts).map(([poli, count]) => ({
    'Nama Poliklinik': poli,
    'Jumlah Kunjungan Pasien': count,
    'Persentase': `${totalVisits > 0 ? ((count / totalVisits) * 100).toFixed(1) : 0}%`
  }));

  // 5. Create Workbook and Sheets
  const workbook = XLSX.utils.book_new();

  // Sheet 0: Exact Google Sheet format matching Puskesmas system
  const exactGoogleSheetRows = filteredTickets.map(t => {
    const d = t.createdAt ? new Date(t.createdAt) : new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const dateStr = t.timestamp || `${day}/${month}/${year}`;
    const timeStr = t.timestampLoket || `${day}/${month}/${year} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    
    return {
      'Timestamp': dateStr,
      'Pilih_Poli': t.poliName,
      'NIK': t.nik,
      'Nomor_BPJS': t.bpjsNumber || (t.patientType === 'BPJS' ? t.nik.slice(0, 8) : '-'),
      'Nama_Pasien': t.fullName,
      'Tanggal_Lahir': t.birthDate || '-',
      'Alamat': t.address,
      'Hadir': t.hadir !== false ? 'TRUE' : 'FALSE',
      'Timestamp_Loket': timeStr,
      'Timestamp_BPU': t.timestampBPU || (t.status === 'Called' || t.status === 'Completed' ? timeStr : ''),
      'Timestamp_Apotek': t.timestampApotek || (t.status === 'Completed' ? timeStr : ''),
      'Status BPU': t.statusBPU || (t.status === 'Completed' ? 'Selesai' : t.status === 'Called' ? 'Sedang Dilayani' : 'Menunggu'),
      'Timestamp_Lab': t.timestampLab || ''
    };
  });

  const simpusSheet = XLSX.utils.json_to_sheet(exactGoogleSheetRows.length > 0 ? exactGoogleSheetRows : [
    { 'Timestamp': '-', 'Pilih_Poli': '-', 'NIK': '-', 'Nomor_BPJS': '-', 'Nama_Pasien': 'Tidak ada data', 'Tanggal_Lahir': '-', 'Alamat': '-', 'Hadir': 'FALSE', 'Timestamp_Loket': '-', 'Timestamp_BPU': '-', 'Timestamp_Apotek': '-', 'Status BPU': '-', 'Timestamp_Lab': '-' }
  ]);
  simpusSheet['!cols'] = [
    { wch: 14 }, { wch: 36 }, { wch: 20 }, { wch: 16 }, { wch: 26 }, { wch: 14 }, { wch: 34 }, { wch: 10 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 22 }
  ];
  XLSX.utils.book_append_sheet(workbook, simpusSheet, 'Sheet Rekap Pasien');

  // Sheet 1: Main data
  const mainSheet = XLSX.utils.json_to_sheet(visitRows.length > 0 ? visitRows : [
    { 'Keterangan': 'Tidak ada data kunjungan pasien untuk filter periode yang dipilih.' }
  ]);

  // Set column widths for Sheet 1
  const colWidths = [
    { wch: 6 },  // No
    { wch: 14 }, // No Antrean
    { wch: 18 }, // Tanggal
    { wch: 18 }, // Sesi
    { wch: 20 }, // NIK
    { wch: 16 }, // BPJS
    { wch: 26 }, // Nama
    { wch: 14 }, // Gender
    { wch: 10 }, // Usia
    { wch: 14 }, // Tgl Lahir
    { wch: 16 }, // Phone
    { wch: 32 }, // Alamat
    { wch: 24 }, // Poli
    { wch: 26 }, // Dokter
    { wch: 30 }, // Keluhan
    { wch: 36 }, // Diagnosa
    { wch: 36 }, // Tindakan
    { wch: 40 }, // Resep
    { wch: 14 }, // Jenis Pasien
    { wch: 18 }, // Status
    { wch: 14 }, // Waktu Daftar
  ];
  mainSheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, mainSheet, 'Laporan Kunjungan');

  // Sheet 2: Summary / Rekapitulasi
  const summarySheet = XLSX.utils.json_to_sheet(summaryMetaRows);
  summarySheet['!cols'] = [{ wch: 30 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan Statistik');

  // Sheet 3: Poli Breakdown
  if (poliBreakdownRows.length > 0) {
    const poliSheet = XLSX.utils.json_to_sheet(poliBreakdownRows);
    poliSheet['!cols'] = [{ wch: 30 }, { wch: 24 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(workbook, poliSheet, 'Kunjungan per Poli');
  }

  // 6. Generate filename and trigger download
  const cleanPeriod = filters.startMonth === filters.endMonth
    ? `${MONTH_NAMES_ID[filters.startMonth - 1]}_${filters.year}`
    : `${MONTH_NAMES_ID[filters.startMonth - 1]}-${MONTH_NAMES_ID[filters.endMonth - 1]}_${filters.year}`;
  
  const fileName = `Laporan_Kunjungan_Puskesmas_Pondok_Benda_${cleanPeriod}.xlsx`;

  XLSX.writeFile(workbook, fileName);
  return { success: true, count: filteredTickets.length, fileName };
}
