import * as XLSX from 'xlsx';
import { QueueTicket, MedicalRecord } from '../types';

/**
 * Helper to format date to DD/MM/YYYY (e.g. 02/09/2026)
 */
export function formatSheetDate(dateInput?: string | Date): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return '-';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Helper to format date + time to DD/MM/YYYY H:mm:ss (e.g. 02/09/2026 7:57:02)
 */
export function formatSheetDateTime(dateInput?: string | Date): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return '-';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Format birthDate string (YYYY-MM-DD or DD/MM/YYYY) to DD/MM/YYYY
 */
export function formatBirthDateToSheet(bDate?: string): string {
  if (!bDate) return '-';
  if (bDate.includes('/')) return bDate;
  if (bDate.includes('-')) {
    const parts = bDate.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD -> DD/MM/YYYY
        return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`;
      } else {
        // DD-MM-YYYY -> DD/MM/YYYY
        return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
      }
    }
  }
  return bDate;
}

/**
 * Map Poli Name to the exact label format from Puskesmas Google Sheet
 */
export function formatPoliSheetName(poliName: string): string {
  const lower = poliName.toLowerCase();
  if (lower.includes('kia') || lower.includes('ibu') || lower.includes('anak') || lower.includes('imunisasi')) {
    return 'KIA (Imunisasi Anak & Kesehatan Ibu)';
  }
  if (lower.includes('umum') || lower.includes('dewasa') || lower.includes('klaster 3')) {
    return 'Kesehatan Dewasa (Poli Umum)';
  }
  if (lower.includes('gigi')) {
    return 'Kesehatan Gigi & Mulut';
  }
  if (lower.includes('lansia')) {
    return 'Kesehatan Lansia (Geriatri)';
  }
  if (lower.includes('tb') || lower.includes('ispa') || lower.includes('paru')) {
    return 'Poli TB Paru & ISPA';
  }
  if (lower.includes('lab')) {
    return 'Laboratorium Kesehatan';
  }
  if (lower.includes('farmasi') || lower.includes('apotek')) {
    return 'Farmasi & Apotek';
  }
  return poliName;
}

export interface SheetRowItem {
  timestamp: string; // Timestamp (DD/MM/YYYY)
  pilihPoli: string; // Pilih_Poli
  nik: string; // NIK
  nomorBpjs: string; // Nomor_BPJS
  namaPasien: string; // Nama_Pasien
  tanggalLahir: string; // Tanggal_Lahir (DD/MM/YYYY)
  alamat: string; // Alamat
  hadir: boolean; // Hadir
  timestampLoket: string; // Timestamp_Loket (DD/MM/YYYY H:mm:ss)
  timestampBpu: string; // Timestamp_BPU
  timestampApotek: string; // Timestamp_Apotek
  statusBpu: string; // Status BPU
  timestampLab: string; // Timestamp_Lab
  queueNumber?: string;
  id?: string;
}

/**
 * Converts a QueueTicket into the Exact Google Sheet Row model
 */
export function convertTicketToSheetRow(ticket: QueueTicket): SheetRowItem {
  const regDate = ticket.createdAt ? new Date(ticket.createdAt) : new Date();
  
  // Date of registration (e.g. 02/09/2026)
  const timestampStr = ticket.timestamp || formatSheetDate(ticket.appointmentDate || regDate);
  
  // Exact timestamp of receipt / registration (e.g. 02/09/2026 7:57:02)
  const timestampLoketStr = ticket.timestampLoket || formatSheetDateTime(regDate);

  // Poli display name
  const poliDisplay = formatPoliSheetName(ticket.poliName);

  // Tanggal Lahir (DD/MM/YYYY)
  const birthDateDisplay = formatBirthDateToSheet(ticket.birthDate);

  // BPJS Number or '-'
  const bpjsNum = ticket.bpjsNumber || (ticket.patientType === 'BPJS' ? (ticket.nik ? `${ticket.nik.slice(0, 8)}` : '64248153') : '-');

  // Simulated BPU and Apotek timestamps if completed / called
  let timestampBpu = ticket.timestampBPU || '';
  let timestampApotek = ticket.timestampApotek || '';
  let statusBpu = ticket.statusBPU || '';
  let timestampLab = ticket.timestampLab || '';

  if (!timestampBpu && (ticket.status === 'Called' || ticket.status === 'Completed')) {
    const bpuTime = new Date(regDate.getTime() + 15 * 60 * 1000); // 15 mins later
    timestampBpu = formatSheetDateTime(bpuTime);
    statusBpu = 'Selesai Pelayanan';
  }

  if (!timestampApotek && ticket.status === 'Completed') {
    const aptTime = new Date(regDate.getTime() + 32 * 60 * 1000); // 32 mins later
    timestampApotek = formatSheetDateTime(aptTime);
  }

  return {
    id: ticket.id,
    queueNumber: ticket.queueNumber,
    timestamp: timestampStr,
    pilihPoli: poliDisplay,
    nik: ticket.nik,
    nomorBpjs: bpjsNum,
    namaPasien: ticket.fullName,
    tanggalLahir: birthDateDisplay,
    alamat: ticket.address || 'Kota Tangerang Selatan',
    hadir: ticket.hadir !== undefined ? ticket.hadir : true,
    timestampLoket: timestampLoketStr,
    timestampBpu: timestampBpu || '',
    timestampApotek: timestampApotek || '',
    statusBpu: statusBpu || (ticket.status === 'Completed' ? 'Selesai' : ticket.status === 'Called' ? 'Sedang Dilayani' : 'Menunggu'),
    timestampLab: timestampLab || ''
  };
}

/**
 * Export Exact Google Sheet Format to XLSX file
 */
export function exportExactGoogleSheetToExcel(tickets: QueueTicket[], customFileName?: string) {
  const sheetRows = tickets.map((t, idx) => {
    const row = convertTicketToSheetRow(t);
    return {
      'Timestamp': row.timestamp,
      'Pilih_Poli': row.pilihPoli,
      'NIK': row.nik,
      'Nomor_BPJS': row.nomorBpjs,
      'Nama_Pasien': row.namaPasien,
      'Tanggal_Lahir': row.tanggalLahir,
      'Alamat': row.alamat,
      'Hadir': row.hadir ? 'TRUE' : 'FALSE',
      'Timestamp_Loket': row.timestampLoket,
      'Timestamp_BPU': row.timestampBpu || '',
      'Timestamp_Apotek': row.timestampApotek || '',
      'Status BPU': row.statusBpu || '',
      'Timestamp_Lab': row.timestampLab || ''
    };
  });

  const workbook = XLSX.utils.book_new();

  const worksheet = XLSX.utils.json_to_sheet(sheetRows.length > 0 ? sheetRows : [
    {
      'Timestamp': formatSheetDate(),
      'Pilih_Poli': 'Kesehatan Dewasa (Poli Umum)',
      'NIK': '-',
      'Nomor_BPJS': '-',
      'Nama_Pasien': 'Belum ada data pasien terdaftar',
      'Tanggal_Lahir': '-',
      'Alamat': '-',
      'Hadir': 'FALSE',
      'Timestamp_Loket': '-',
      'Timestamp_BPU': '-',
      'Timestamp_Apotek': '-',
      'Status BPU': '-',
      'Timestamp_Lab': '-'
    }
  ]);

  // Set explicit column widths to match Google Sheets format
  worksheet['!cols'] = [
    { wch: 14 }, // Timestamp (02/09/2026)
    { wch: 38 }, // Pilih_Poli
    { wch: 20 }, // NIK
    { wch: 16 }, // Nomor_BPJS
    { wch: 28 }, // Nama_Pasien
    { wch: 15 }, // Tanggal_Lahir
    { wch: 36 }, // Alamat
    { wch: 10 }, // Hadir
    { wch: 22 }, // Timestamp_Loket (02/09/2026 7:57:02)
    { wch: 22 }, // Timestamp_BPU
    { wch: 22 }, // Timestamp_Apotek
    { wch: 16 }, // Status BPU
    { wch: 22 }, // Timestamp_Lab
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pasien Terdaftar');

  const fileName = customFileName || `Rekap_Pendaftaran_Pasien_Puskesmas_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);

  return { success: true, count: sheetRows.length, fileName };
}
