import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_POLIS, INITIAL_DOCTORS, INITIAL_ARTICLES, INITIAL_ANNOUNCEMENTS, INITIAL_TICKETS } from './src/data/mockData.js';
import { QueueTicket, PoliService, SurveySubmission, SurveyStats } from './src/types.js';
import { initDbConnection, isDbConnected, queryDb, getDbConfig } from './src/db.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// In-Memory Data Stores (used as active cache and seamless fallback)
let polisStore: PoliService[] = [...INITIAL_POLIS];
let doctorsStore = [...INITIAL_DOCTORS];
let articlesStore = [...INITIAL_ARTICLES];
let announcementsStore = [...INITIAL_ANNOUNCEMENTS];
let ticketsStore: QueueTicket[] = [...INITIAL_TICKETS];
let surveysStore: SurveySubmission[] = [];

// Helper to sync from MySQL database if connected
async function syncFromDbIfAvailable() {
  if (!isDbConnected()) return;
  try {
    const dbTickets = await queryDb<any>('SELECT * FROM queue_tickets ORDER BY created_at DESC');
    if (dbTickets && dbTickets.length > 0) {
      ticketsStore = dbTickets.map(row => ({
        id: row.id,
        queueNumber: row.queue_number,
        patientType: row.patient_type || 'BPJS',
        nik: row.nik,
        bpjsNumber: row.bpjs_number || '',
        fullName: row.full_name,
        birthDate: row.birth_date ? String(row.birth_date).slice(0, 10) : '1990-01-01',
        gender: row.gender || 'L',
        phone: row.phone,
        address: row.address || '',
        poliId: row.poli_id,
        poliName: row.poli_name,
        klasterNumber: 3,
        klasterName: row.klaster_name || 'UMUM DEWASA',
        doctorName: '',
        registrationNumber: row.registration_number || '',
        familyHead: 'KEPALA KELUARGA',
        medicalRecordNo: row.medical_record_no || `03${row.nik?.slice(-6)}`,
        oldMedicalRecordNo: '',
        documentRmNo: '',
        ageFormatted: '',
        fee: row.patient_type === 'BPJS' ? 'Gratis (BPJS)' : 'Rp. 10,000',
        appointmentDate: row.appointment_date ? String(row.appointment_date).slice(0, 10) : new Date().toISOString().split('T')[0],
        timeSlot: row.time_slot || '08:00 - 11:30 WIB',
        chiefComplaint: row.chief_complaint || 'Pemeriksaan Kesehatan',
        status: row.status || 'Waiting',
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
        estimatedTime: row.estimated_time || '',
        timestamp: '',
        timestampLoket: '',
        hadir: true,
        timestampBPU: '',
        timestampApotek: '',
        statusBPU: 'Menunggu',
        timestampLab: ''
      }));
      console.log(`[Database] Sinkronisasi ${ticketsStore.length} antrean dari MySQL berhasil.`);
    }
  } catch (err: any) {
    console.error('[Database] Gagal membaca tabel MySQL:', err.message);
  }
}

// Helper: Calculate Queue Prefix and next number
function generateNextQueueNumber(poliId: string): string {
  const poli = polisStore.find(p => p.id === poliId);
  const prefix = poli ? poli.queuePrefix : 'A';
  
  // Find all tickets for today for this poli
  const today = new Date().toISOString().split('T')[0];
  const poliTickets = ticketsStore.filter(
    t => t.poliId === poliId && t.appointmentDate === today
  );

  let maxNum = 0;
  poliTickets.forEach(t => {
    const parts = t.queueNumber.split('-');
    if (parts.length === 2) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });

  const nextNum = maxNum + 1;
  const formattedNum = nextNum < 10 ? `00${nextNum}` : nextNum < 100 ? `0${nextNum}` : `${nextNum}`;
  return `${prefix}-${formattedNum}`;
}

// REST API ROUTES

// 1. Get All Poliklinik & Queue Summary
app.get('/api/polis', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Update waiting count dynamically
  const updatedPolis = polisStore.map(p => {
    const waitingCount = ticketsStore.filter(
      t => t.poliId === p.id && t.appointmentDate === today && t.status === 'Waiting'
    ).length;
    return {
      ...p,
      totalWaiting: waitingCount
    };
  });
  
  res.json({ success: true, data: updatedPolis });
});

// 2. Get All Tickets / Search Tickets
app.get('/api/antrean', (req, res) => {
  const { date, poliId, status, query } = req.query;
  let result = [...ticketsStore];

  if (date) {
    result = result.filter(t => t.appointmentDate === date);
  }
  if (poliId) {
    result = result.filter(t => t.poliId === poliId);
  }
  if (status) {
    result = result.filter(t => t.status === status);
  }
  if (query && typeof query === 'string') {
    const q = query.toLowerCase();
    result = result.filter(
      t => t.queueNumber.toLowerCase().includes(q) ||
           t.nik.includes(q) ||
           t.fullName.toLowerCase().includes(q) ||
           t.phone.includes(q)
    );
  }

  // Sort: Called first, then Waiting, then Completed/Cancelled
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, data: result });
});

// 3. Lookup Specific Ticket by NIK or Queue Number or ID
app.get('/api/antrean/lookup', (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    res.status(400).json({ success: false, message: 'Parameter query dibutuhkan' });
    return;
  }

  const q = query.trim().toLowerCase();
  const found = ticketsStore.filter(
    t => t.queueNumber.toLowerCase() === q ||
         t.nik === q ||
         (t.bpjsNumber && t.bpjsNumber === q) ||
         t.phone === q ||
         t.id === q
  );

  res.json({ success: true, data: found });
});

// 4. Create New Online Registration (Pendaftaran Online)
app.post('/api/pendaftaran', (req, res) => {
  try {
    const {
      patientType,
      nik,
      bpjsNumber,
      fullName,
      birthDate,
      gender,
      phone,
      address,
      poliId,
      appointmentDate,
      timeSlot,
      chiefComplaint,
      klasterNumber,
      klasterName,
      doctorName,
      registrationNumber,
      familyHead,
      medicalRecordNo,
      oldMedicalRecordNo,
      documentRmNo,
      ageFormatted,
      fee
    } = req.body;

    if (!nik || !fullName || !phone) {
      res.status(400).json({ success: false, message: 'Data wajib belum lengkap (NIK, Nama, No HP)' });
      return;
    }

    const poli = polisStore.find(p => p.id === (poliId || 'poli-umum')) || polisStore[0];

    const queueNumber = req.body.queueNumber || generateNextQueueNumber(poli?.id || 'poli-umum');
    const apptDate = appointmentDate || new Date().toISOString().split('T')[0];

    const todayStr = new Date().toISOString().split('T')[0];
    const maxDateObj = new Date();
    maxDateObj.setMonth(maxDateObj.getMonth() + 1);
    const maxDateStr = maxDateObj.toISOString().split('T')[0];

    if (apptDate < todayStr || apptDate > maxDateStr) {
      res.status(400).json({ success: false, message: 'Tanggal pendaftaran hanya diperbolehkan dari hari ini sampai maksimal 1 bulan ke depan.' });
      return;
    }
    
    // Estimate call time
    const countWaiting = ticketsStore.filter(
      t => t.poliId === poli.id && t.appointmentDate === apptDate && (t.status === 'Waiting' || t.status === 'Called')
    ).length;
    
    const estMinutes = countWaiting * 10 + 15;
    const estTimeStr = `~ ${estMinutes} menit setelah poli buka`;

    const seqReg = registrationNumber || String(ticketsStore.length + 1).padStart(4, '0');
    const defaultRm = medicalRecordNo || `03${nik.slice(-6)}`;
    const defaultOldRm = oldMedicalRecordNo || `P${nik.slice(0, 8)}101319`;
    const defaultDocRm = documentRmNo || `P08-10-${new Date().getFullYear()}`;
    const calculatedFee = fee || (patientType === 'BPJS' ? 'Gratis (BPJS)' : 'Rp. 10,000');

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const formattedDateTime = `${day}/${month}/${year} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newTicket: QueueTicket = {
      id: `tkt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      queueNumber,
      patientType: patientType || 'BPJS',
      nik,
      bpjsNumber: bpjsNumber || '',
      fullName,
      birthDate: birthDate || '1990-01-01',
      gender: gender || 'L',
      phone,
      address: address || 'Kota Tangerang Selatan',
      poliId: poli.id,
      poliName: poli.name,
      klasterNumber: klasterNumber || 3,
      klasterName: klasterName || 'UMUM DEWASA',
      doctorName: doctorName || poli.doctorName || 'dr. Ananto Adi Swasono',
      registrationNumber: seqReg,
      familyHead: familyHead || 'KEPALA KELUARGA',
      medicalRecordNo: defaultRm,
      oldMedicalRecordNo: defaultOldRm,
      documentRmNo: defaultDocRm,
      ageFormatted: ageFormatted || '22 Thn 2 Bln 5 Hr',
      fee: calculatedFee,
      appointmentDate: apptDate,
      timeSlot: timeSlot || '08:00:00 - 11:30:00',
      chiefComplaint: chiefComplaint || 'Pemeriksaan Kesehatan',
      status: 'Waiting',
      createdAt: now.toISOString(),
      estimatedTime: estTimeStr,
      timestamp: req.body.timestamp || formattedDate,
      timestampLoket: req.body.timestampLoket || formattedDateTime,
      hadir: true,
      timestampBPU: '',
      timestampApotek: '',
      statusBPU: 'Menunggu',
      timestampLab: ''
    };

    ticketsStore.unshift(newTicket);

    // Save to MySQL database asynchronously if connected
    if (isDbConnected()) {
      queryDb(`
        INSERT INTO queue_tickets 
          (id, queue_number, patient_type, nik, bpjs_number, full_name, birth_date, gender, phone, address, poli_id, poli_name, appointment_date, time_slot, chief_complaint, status, estimated_time, registration_number, klaster_name, medical_record_no)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        newTicket.id,
        newTicket.queueNumber,
        newTicket.patientType,
        newTicket.nik,
        newTicket.bpjsNumber || null,
        newTicket.fullName,
        newTicket.birthDate || null,
        newTicket.gender,
        newTicket.phone,
        newTicket.address || null,
        newTicket.poliId,
        newTicket.poliName,
        newTicket.appointmentDate,
        newTicket.timeSlot || '08:00 - 11:30 WIB',
        newTicket.chiefComplaint || 'Pemeriksaan',
        newTicket.status,
        newTicket.estimatedTime || null,
        newTicket.registrationNumber || null,
        newTicket.klasterName || null,
        newTicket.medicalRecordNo || null
      ]).then(() => {
        console.log(`[Database] Tiket ${newTicket.queueNumber} tersimpan ke MySQL`);
      }).catch(err => {
        console.error('[Database] Gagal simpan ke MySQL:', err.message);
      });
    }

    res.json({
      success: true,
      message: 'Pendaftaran online berhasil! Silakan simpan dan cetak e-tiket antrean Anda.',
      data: newTicket
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Gagal memproses pendaftaran' });
  }
});

// 5. Update Ticket Status (Petugas Admin Actions)
app.put('/api/antrean/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Waiting', 'Verified', 'Called', 'Completed', 'Cancelled'].includes(status)) {
    res.status(400).json({ success: false, message: 'Status antrean tidak valid' });
    return;
  }

  const ticketIndex = ticketsStore.findIndex(t => t.id === id);
  if (ticketIndex === -1) {
    res.status(404).json({ success: false, message: 'Tiket tidak ditemukan' });
    return;
  }

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const formattedDateTime = `${day}/${month}/${year} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  ticketsStore[ticketIndex].status = status;
  if (req.body.hadir !== undefined) {
    ticketsStore[ticketIndex].hadir = req.body.hadir;
  }
  if (status === 'Called') {
    if (!ticketsStore[ticketIndex].timestampBPU) {
      ticketsStore[ticketIndex].timestampBPU = formattedDateTime;
    }
    ticketsStore[ticketIndex].statusBPU = 'Sedang Dilayani Dokter';
  } else if (status === 'Completed') {
    if (!ticketsStore[ticketIndex].timestampBPU) {
      ticketsStore[ticketIndex].timestampBPU = formattedDateTime;
    }
    if (!ticketsStore[ticketIndex].timestampApotek) {
      ticketsStore[ticketIndex].timestampApotek = formattedDateTime;
    }
    ticketsStore[ticketIndex].statusBPU = 'Selesai Pelayanan';
  }

  if (req.body.timestampBPU) ticketsStore[ticketIndex].timestampBPU = req.body.timestampBPU;
  if (req.body.timestampApotek) ticketsStore[ticketIndex].timestampApotek = req.body.timestampApotek;
  if (req.body.statusBPU) ticketsStore[ticketIndex].statusBPU = req.body.statusBPU;
  if (req.body.timestampLab) ticketsStore[ticketIndex].timestampLab = req.body.timestampLab;

  const updatedTicket = ticketsStore[ticketIndex];

  // If status changed to Called, update active queue number in poli
  if (status === 'Called') {
    const poliIndex = polisStore.findIndex(p => p.id === updatedTicket.poliId);
    if (poliIndex !== -1) {
      polisStore[poliIndex].activeQueueNumber = updatedTicket.queueNumber;
    }
  }

  res.json({ success: true, message: `Status antrean diubah menjadi ${status}`, data: updatedTicket });
});

// 6. Get & Manage Doctors
app.get('/api/jadwal-dokter', (req, res) => {
  res.json({ success: true, data: doctorsStore });
});

app.post('/api/jadwal-dokter', (req, res) => {
  const { doctorName, specialty, poliName, poliId, days, hours, quotaPerDay, status, photoUrl, klasterNumber, klasterName, sipNumber, room } = req.body;
  if (!doctorName || !poliName) {
    res.status(400).json({ success: false, message: 'Nama Dokter dan Poli wajib diisi' });
    return;
  }
  const daysArray = Array.isArray(days) ? days : typeof days === 'string' ? days.split(', ') : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const newDoctor = {
    id: `doc-${Date.now()}`,
    doctorName,
    specialty: specialty || 'Dokter Umum / Penanggung Jawab',
    poliName,
    poliId: poliId || 'poli-umum',
    klasterNumber: klasterNumber || 3,
    klasterName: klasterName || 'Klaster 3: Usia Dewasa dan Lanjut Usia',
    days: daysArray,
    hours: hours || '08:00 - 12:00 WIB',
    quotaPerDay: Number(quotaPerDay) || 30,
    status: status || 'Hadir',
    photoUrl: photoUrl || '',
    sipNumber: sipNumber || '',
    room: room || 'Ruang Pemeriksaan'
  };
  doctorsStore.unshift(newDoctor);
  res.json({ success: true, message: 'Dokter berhasil ditambahkan', data: newDoctor });
});

app.put('/api/jadwal-dokter/:id', (req, res) => {
  const { id } = req.params;
  const idx = doctorsStore.findIndex(d => d.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Dokter tidak ditemukan' });
    return;
  }
  doctorsStore[idx] = { ...doctorsStore[idx], ...req.body };
  res.json({ success: true, message: 'Data dokter berhasil diperbarui', data: doctorsStore[idx] });
});

app.delete('/api/jadwal-dokter/:id', (req, res) => {
  const { id } = req.params;
  doctorsStore = doctorsStore.filter(d => d.id !== id);
  res.json({ success: true, message: 'Dokter berhasil dihapus' });
});

// 7. Get & Manage Articles / News / Videos
app.get('/api/artikels', (req, res) => {
  res.json({ success: true, data: articlesStore });
});

app.post('/api/artikels', (req, res) => {
  const { title, category, snippet, content, author, readTime, badgeColor, imageUrl, isVideo, videoUrl } = req.body;
  if (!title || !content) {
    res.status(400).json({ success: false, message: 'Judul dan konten artikel wajib diisi' });
    return;
  }
  const todayStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  const newArticle = {
    id: `art-${Date.now()}`,
    title,
    category: category || 'Edukasi',
    snippet: snippet || content.substring(0, 120) + '...',
    content,
    date: todayStr,
    author: author || 'Tim Admin Puskesmas',
    readTime: readTime || (isVideo ? 'Video 3 min' : '3 min baca'),
    badgeColor: badgeColor || 'bg-emerald-100 text-emerald-800 border-emerald-200',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
    isVideo: !!isVideo,
    videoUrl: videoUrl || ''
  };
  articlesStore.unshift(newArticle);
  res.json({ success: true, message: 'Artikel/Berita berhasil ditambahkan', data: newArticle });
});

app.put('/api/artikels/:id', (req, res) => {
  const { id } = req.params;
  const idx = articlesStore.findIndex(a => a.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    return;
  }
  articlesStore[idx] = { ...articlesStore[idx], ...req.body };
  res.json({ success: true, message: 'Artikel berhasil diperbarui', data: articlesStore[idx] });
});

app.delete('/api/artikels/:id', (req, res) => {
  const { id } = req.params;
  articlesStore = articlesStore.filter(a => a.id !== id);
  res.json({ success: true, message: 'Artikel berhasil dihapus' });
});

// 8. Get Announcements
app.get('/api/pengumuman', (req, res) => {
  res.json({ success: true, data: announcementsStore });
});

// 8b. Backup & Restore Endpoints
app.get('/api/backup/export', (req, res) => {
  res.json({
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      appName: 'Puskesmas Pondok Benda Tangsel',
      version: '1.0',
      doctors: doctorsStore,
      articles: articlesStore,
      polis: polisStore
    }
  });
});

app.get('/api/backup/export-sql', (req, res) => {
  try {
    const esc = (val: any) => {
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return val;
      if (typeof val === 'boolean') return val ? 1 : 0;
      return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
    };

    let sql = `-- ============================================================\n`;
    sql += `-- DATABASE BACKUP EXPORT: PUSKESMAS PONDOK BENDA TANGSEL\n`;
    sql += `-- Generated on: ${new Date().toLocaleString('id-ID')}\n`;
    sql += `-- Target Engine: MySQL 5.7+ / 8.0+ / MariaDB / phpMyAdmin\n`;
    sql += `-- ============================================================\n\n`;
    sql += `CREATE DATABASE IF NOT EXISTS \`puskesmas_pondokbenda\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sql += `USE \`puskesmas_pondokbenda\`;\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n\n`;
    sql += `DROP TABLE IF EXISTS \`queue_tickets\`;\n`;
    sql += `DROP TABLE IF EXISTS \`doctors\`;\n`;
    sql += `DROP TABLE IF EXISTS \`articles\`;\n`;
    sql += `DROP TABLE IF EXISTS \`polis\`;\n\n`;

    // 1. Polis Table & Data
    sql += `-- 1. TABEL POLIS\n`;
    sql += `DROP TABLE IF EXISTS \`polis\`;\n`;
    sql += `CREATE TABLE \`polis\` (\n`;
    sql += `  \`id\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`code\` VARCHAR(10) NOT NULL,\n`;
    sql += `  \`name\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`icon_name\` VARCHAR(50) DEFAULT 'Stethoscope',\n`;
    sql += `  \`description\` TEXT,\n`;
    sql += `  \`room\` VARCHAR(100) DEFAULT NULL,\n`;
    sql += `  \`queue_prefix\` VARCHAR(10) NOT NULL,\n`;
    sql += `  \`active_queue_number\` VARCHAR(20) DEFAULT '-',\n`;
    sql += `  \`doctor_name\` VARCHAR(100) DEFAULT NULL,\n`;
    sql += `  \`operating_hours\` VARCHAR(100) DEFAULT NULL,\n`;
    sql += `  \`requirements\` TEXT DEFAULT NULL,\n`;
    sql += `  \`fee_general\` VARCHAR(150) DEFAULT NULL,\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (polisStore.length > 0) {
      sql += `INSERT INTO \`polis\` (\`id\`, \`code\`, \`name\`, \`icon_name\`, \`description\`, \`room\`, \`queue_prefix\`, \`active_queue_number\`, \`doctor_name\`, \`operating_hours\`, \`requirements\`, \`fee_general\`) VALUES\n`;
      const rows = polisStore.map(p => {
        const reqStr = Array.isArray(p.requirements) ? p.requirements.join(', ') : (p.requirements || '');
        return `(${esc(p.id)}, ${esc(p.code)}, ${esc(p.name)}, ${esc(p.iconName)}, ${esc(p.description)}, ${esc(p.room)}, ${esc(p.queuePrefix)}, ${esc(p.activeQueueNumber)}, ${esc(p.doctorName)}, ${esc(p.operatingHours)}, ${esc(reqStr)}, ${esc(p.feeGeneral)})`;
      });
      sql += rows.join(',\n') + ';\n\n';
    }

    // 2. Doctors Table & Data
    sql += `-- 2. TABEL DOCTORS\n`;
    sql += `DROP TABLE IF EXISTS \`doctors\`;\n`;
    sql += `CREATE TABLE \`doctors\` (\n`;
    sql += `  \`id\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`doctor_name\` VARCHAR(120) NOT NULL,\n`;
    sql += `  \`specialty\` VARCHAR(150) DEFAULT NULL,\n`;
    sql += `  \`poli_id\` VARCHAR(50) DEFAULT NULL,\n`;
    sql += `  \`poli_name\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`days\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`hours\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`quota_per_day\` INT DEFAULT 30,\n`;
    sql += `  \`status\` ENUM('Hadir', 'Cuti', 'Pengganti') DEFAULT 'Hadir',\n`;
    sql += `  \`photo_url\` TEXT DEFAULT NULL,\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (doctorsStore.length > 0) {
      sql += `INSERT INTO \`doctors\` (\`id\`, \`doctor_name\`, \`specialty\`, \`poli_id\`, \`poli_name\`, \`days\`, \`hours\`, \`quota_per_day\`, \`status\`, \`photo_url\`) VALUES\n`;
      const rows = doctorsStore.map(d => {
        const daysStr = Array.isArray(d.days) ? d.days.join(', ') : d.days;
        return `(${esc(d.id)}, ${esc(d.doctorName)}, ${esc(d.specialty)}, ${esc(d.poliId)}, ${esc(d.poliName)}, ${esc(daysStr)}, ${esc(d.hours)}, ${esc(d.quotaPerDay)}, ${esc(d.status)}, ${esc(d.photoUrl || '')})`;
      });
      sql += rows.join(',\n') + ';\n\n';
    }

    // 3. Articles Table & Data
    sql += `-- 3. TABEL ARTICLES & VIDEOS\n`;
    sql += `DROP TABLE IF EXISTS \`articles\`;\n`;
    sql += `CREATE TABLE \`articles\` (\n`;
    sql += `  \`id\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`category\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`snippet\` TEXT DEFAULT NULL,\n`;
    sql += `  \`content\` LONGTEXT NOT NULL,\n`;
    sql += `  \`date\` VARCHAR(50) DEFAULT NULL,\n`;
    sql += `  \`author\` VARCHAR(100) DEFAULT NULL,\n`;
    sql += `  \`read_time\` VARCHAR(50) DEFAULT NULL,\n`;
    sql += `  \`badge_color\` VARCHAR(100) DEFAULT NULL,\n`;
    sql += `  \`image_url\` TEXT DEFAULT NULL,\n`;
    sql += `  \`is_video\` TINYINT(1) DEFAULT 0,\n`;
    sql += `  \`video_url\` TEXT DEFAULT NULL,\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (articlesStore.length > 0) {
      sql += `INSERT INTO \`articles\` (\`id\`, \`title\`, \`category\`, \`snippet\`, \`content\`, \`date\`, \`author\`, \`read_time\`, \`badge_color\`, \`image_url\`, \`is_video\`, \`video_url\`) VALUES\n`;
      const rows = articlesStore.map(a => {
        return `(${esc(a.id)}, ${esc(a.title)}, ${esc(a.category)}, ${esc(a.snippet)}, ${esc(a.content)}, ${esc(a.date)}, ${esc(a.author)}, ${esc(a.readTime)}, ${esc(a.badgeColor)}, ${esc(a.imageUrl)}, ${a.isVideo ? 1 : 0}, ${esc(a.videoUrl || '')})`;
      });
      sql += rows.join(',\n') + ';\n\n';
    }

    // 4. Queue Tickets Table & Data
    sql += `-- 4. TABEL QUEUE TICKETS\n`;
    sql += `DROP TABLE IF EXISTS \`queue_tickets\`;\n`;
    sql += `CREATE TABLE \`queue_tickets\` (\n`;
    sql += `  \`id\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`queue_number\` VARCHAR(20) NOT NULL,\n`;
    sql += `  \`patient_type\` ENUM('BPJS','Umum') DEFAULT 'BPJS',\n`;
    sql += `  \`nik\` VARCHAR(20) NOT NULL,\n`;
    sql += `  \`bpjs_number\` VARCHAR(30) DEFAULT NULL,\n`;
    sql += `  \`full_name\` VARCHAR(150) NOT NULL,\n`;
    sql += `  \`birth_date\` DATE DEFAULT NULL,\n`;
    sql += `  \`gender\` ENUM('L','P') DEFAULT 'L',\n`;
    sql += `  \`phone\` VARCHAR(30) NOT NULL,\n`;
    sql += `  \`address\` TEXT DEFAULT NULL,\n`;
    sql += `  \`poli_id\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`poli_name\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`appointment_date\` DATE NOT NULL,\n`;
    sql += `  \`time_slot\` VARCHAR(50) DEFAULT NULL,\n`;
    sql += `  \`chief_complaint\` TEXT DEFAULT NULL,\n`;
    sql += `  \`status\` ENUM('Waiting','Called','Completed','Cancelled') DEFAULT 'Waiting',\n`;
    sql += `  \`estimated_time\` VARCHAR(100) DEFAULT NULL,\n`;
    sql += `  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    if (ticketsStore.length > 0) {
      sql += `INSERT INTO \`queue_tickets\` (\`id\`, \`queue_number\`, \`patient_type\`, \`nik\`, \`bpjs_number\`, \`full_name\`, \`birth_date\`, \`gender\`, \`phone\`, \`address\`, \`poli_id\`, \`poli_name\`, \`appointment_date\`, \`time_slot\`, \`chief_complaint\`, \`status\`, \`estimated_time\`, \`created_at\`) VALUES\n`;
      const rows = ticketsStore.map(t => {
        return `(${esc(t.id)}, ${esc(t.queueNumber)}, ${esc(t.patientType)}, ${esc(t.nik)}, ${esc(t.bpjsNumber)}, ${esc(t.fullName)}, ${esc(t.birthDate)}, ${esc(t.gender)}, ${esc(t.phone)}, ${esc(t.address)}, ${esc(t.poliId)}, ${esc(t.poliName)}, ${esc(t.appointmentDate)}, ${esc(t.timeSlot)}, ${esc(t.chiefComplaint)}, ${esc(t.status)}, ${esc(t.estimatedTime)}, ${esc(t.createdAt)})`;
      });
      sql += rows.join(',\n') + ';\n\n';
    }

    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="puskesmas_pondokbenda.sql"');
    res.send(sql);
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Gagal membuat file SQL: ' + err.message });
  }
});

app.post('/api/backup/restore', (req, res) => {
  try {
    const { doctors, articles, polis } = req.body;
    if (Array.isArray(doctors)) {
      doctorsStore = [...doctors];
    }
    if (Array.isArray(articles)) {
      articlesStore = [...articles];
    }
    if (Array.isArray(polis)) {
      polisStore = [...polis];
    }
    res.json({
      success: true,
      message: 'Data berhasil dipulihkan dari cadangan!',
      data: {
        doctors: doctorsStore,
        articles: articlesStore,
        polis: polisStore
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Gagal memulihkan data: ' + err.message });
  }
});

app.post('/api/backup/reset', (req, res) => {
  try {
    doctorsStore = [...INITIAL_DOCTORS];
    articlesStore = [...INITIAL_ARTICLES];
    polisStore = [...INITIAL_POLIS];
    res.json({
      success: true,
      message: 'Data berhasil dikembalikan ke standar awal pabrik!',
      data: {
        doctors: doctorsStore,
        articles: articlesStore,
        polis: polisStore
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Gagal mereset data: ' + err.message });
  }
});

// 9. Submit IKM Survey
app.post('/api/survei', (req, res) => {
  const { patientName, rating, servicePoli, serviceQuality, waitingTimeRating, cleanlinessRating, feedback } = req.body;
  if (!rating || !servicePoli) {
    res.status(400).json({ success: false, message: 'Nilai survei dan Poli harus diisi' });
    return;
  }

  const newSurvey: SurveySubmission = {
    id: `srv-${Date.now()}`,
    patientName: patientName || 'Masyarakat Tangsel',
    rating: Number(rating),
    servicePoli,
    serviceQuality: Number(serviceQuality || rating),
    waitingTimeRating: Number(waitingTimeRating || rating),
    cleanlinessRating: Number(cleanlinessRating || rating),
    feedback: feedback || '',
    createdAt: new Date().toISOString()
  };

  surveysStore.unshift(newSurvey);
  res.json({ success: true, message: 'Terima kasih atas penilaian Anda untuk Puskesmas Pondok Benda!', data: newSurvey });
});

// 10. Get Survey Statistics
app.get('/api/survei/stats', (req, res) => {
  const totalResponses = surveysStore.length;
  if (totalResponses === 0) {
    res.json({
      success: true,
      data: {
        totalResponses: 0,
        averageRating: 5.0,
        satisfactionPercentage: 100,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    });
    return;
  }

  const ratingCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sumRating = 0;

  surveysStore.forEach(s => {
    const r = Math.min(5, Math.max(1, Math.round(s.rating)));
    ratingCounts[r] = (ratingCounts[r] || 0) + 1;
    sumRating += s.rating;
  });

  const avg = Number((sumRating / totalResponses).toFixed(1));
  const satisfactionPct = Math.round((avg / 5) * 100);

  const stats: SurveyStats = {
    totalResponses,
    averageRating: avg,
    satisfactionPercentage: satisfactionPct,
    ratingBreakdown: ratingCounts
  };

  res.json({ success: true, data: stats, recent: surveysStore.slice(0, 5) });
});

// 11. AI Health Assistant Endpoint (Gemini API Server-Side)
app.post('/api/chat-ai', async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      res.status(400).json({ success: false, message: 'Pesan pertanyaan tidak boleh kosong' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback friendly reply if key not set
      res.json({
        success: true,
        answer: 'Halo! Saya Asisten Kesehatan Puskesmas Pondok Benda. Puskesmas Pondok Benda berlokasi di Jl. Pajajaran No.1, Pondok Benda, Pamulang, Tangsel. Kami melayani Poli Umum, Gigi, KIA/KB, Anak/Imunisasi, Lansia, Laboratorium, dan Apotek. Silakan gunakan menu Pendaftaran Online untuk mendaftar antrean.'
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const systemInstruction = `Anda adalah "Asisten Medis Virtual Puskesmas Pondok Benda Kota Tangerang Selatan".
Tugas Anda adalah memberikan informasi pelayanan kesehatan, jadwal dokter, prosedur pendaftaran online, petunjuk BPJS, serta informasi edukasi kesehatan dasar dengan bahasa Indonesia yang ramah, empati, sopan, dan jelas.

FAKTA PUSKESMAS PONDOK BENDA TANGSEL:
- Alamat: Jl. Pajajaran No. 1, Kel. Pondok Benda, Kec. Pamulang, Kota Tangerang Selatan, Banten 15416.
- Jam Operasional Poli:
  • Senin - Kamis: 07.30 - 14.00 WIB
  • Jumat: 07.30 - 11.30 WIB
  • Sabtu: 07.30 - 12.30 WIB
  • UGD / IGD & Persalinan KIA: 24 Jam Non-Stop
- Layanan Poli: Poli Umum, Poli Gigi & Mulut, Poli KIA & KB, Poli Anak & Imunisasi, Poli Lansia & PTM, Poli Batuk/TB Paru, Laboratorium, dan Apotek.
- Pendaftaran Online: Bisa dilakukan langsung via portal website ini di menu "Pendaftaran Online", mendapat Tiket Antrean Digital gratis.
- Persyaratan Pasien BPJS: KTP / NIK Tangsel & Kartu BPJS Kesehatan Aktif.
- Persyaratan Pasien Umum: KTP / KK.

PENTING:
- Berikan respon yang ringkas, informatif, dan membantu.
- Jika pengguna menanyakan gejala penyakit serius, berikan saran pertolongan pertama dasar dan HINDARI memberikan diagnosa pasti; sarankan segera berobat langsung ke Poli Umum atau UGD 24 Jam Puskesmas Pondok Benda.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const answer = response.text || 'Mohon maaf, saya belum dapat memproses pertanyaan Anda saat ini. Silakan hubungi langsung Puskesmas Pondok Benda.';
    res.json({ success: true, answer });
  } catch (err: any) {
    const userPrompt = (req.body?.prompt || '').toLowerCase();
    
    // Smart local knowledge fallback for common Puskesmas inquiries
    let localAnswer = 'Halo! Saya Asisten Kesehatan Puskesmas Pondok Benda Kota Tangerang Selatan. Ada yang bisa kami bantu mengenai pelayanan kesehatan, pendaftaran online, atau jadwal poli?';

    if (userPrompt.includes('jam') || userPrompt.includes('buka') || userPrompt.includes('operasional') || userPrompt.includes('tutup')) {
      localAnswer = 'Jam Operasional Puskesmas Pondok Benda:\n• Senin - Kamis: 07.30 - 14.00 WIB\n• Jumat: 07.30 - 11.30 WIB\n• Sabtu: 07.30 - 12.30 WIB\n• UGD / IGD & Persalinan: 24 Jam Non-Stop.';
    } else if (userPrompt.includes('daftar') || userPrompt.includes('online') || userPrompt.includes('tiket') || userPrompt.includes('antrean')) {
      localAnswer = 'Untuk pendaftaran berobat secara online, Anda dapat memilih menu "Pendaftaran Online" pada portal ini. Setelah mengisi data pasien, Anda akan mendapatkan e-tiket dengan nomor antrean digital secara instant.';
    } else if (userPrompt.includes('alamat') || userPrompt.includes('lokasi') || userPrompt.includes('dimana') || userPrompt.includes('peta')) {
      localAnswer = 'Puskesmas Pondok Benda berlokasi di Jl. Pajajaran No. 1, Kelurahan Pondok Benda, Kecamatan Pamulang, Kota Tangerang Selatan, Banten 15416 (Dekat Kantor Kelurahan Pondok Benda).';
    } else if (userPrompt.includes('bpjs') || userPrompt.includes('syarat') || userPrompt.includes('berkas') || userPrompt.includes('ktp')) {
      localAnswer = 'Persyaratan Berobat:\n• Pasien BPJS: KTP/NIK Tangsel & Kartu BPJS Kesehatan aktif (Faskes Puskesmas Pondok Benda).\n• Pasien Umum: KTP / Kartu Keluarga (KK).';
    } else if (userPrompt.includes('poli') || userPrompt.includes('layanan') || userPrompt.includes('dokter')) {
      localAnswer = 'Layanan Poliklinik Puskesmas Pondok Benda meliputi: Poli Umum, Poli Gigi & Mulut, Poli KIA & KB, Poli Anak & Imunisasi, Poli Lansia & PTM, Poli Batuk/TB Paru, Laboratorium, dan Apotek.';
    }

    res.json({
      success: true,
      answer: localAnswer
    });
  }
});

// START SERVER & VITE MIDDLEWARE SETUP
async function startServer() {
  // Inisialisasi koneksi database MySQL jika env/service tersedia
  try {
    const dbOk = await initDbConnection();
    if (dbOk) {
      await syncFromDbIfAvailable();
    }
  } catch (err: any) {
    console.warn('[Database] Lanjut menggunakan fallback cache:', err.message);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Puskesmas Pondok Benda Tangsel App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
