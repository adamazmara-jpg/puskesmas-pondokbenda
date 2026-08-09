import { PoliService, DoctorSchedule, HealthArticle, Announcement, QueueTicket } from '../types';

export const INITIAL_POLIS: PoliService[] = [
  {
    id: 'poli-umum',
    code: 'A',
    name: 'Poli Umum',
    iconName: 'Stethoscope',
    description: 'Pelayanan pemeriksaan kesehatan umum, konsultasi medis dasar, serta pengobatan untuk pasien dewasa dan anak.',
    room: 'Lantai 1 - Ruang 101',
    queuePrefix: 'A',
    activeQueueNumber: '-',
    totalWaiting: 0,
    doctorName: 'dr. H. Bambang Suherman',
    operatingHours: 'Senin - Sabtu (08:00 - 14:00 WIB)',
    requirements: ['KTP / NIK Tangsel', 'Kartu BPJS Kesehatan (Aktif)', 'Kartu Berobat Puskesmas (bila ada)'],
    feeGeneral: 'Gratis (BPJS) / Rp 10.000 (Umum Perda Tangsel)'
  },
  {
    id: 'poli-gigi',
    code: 'B',
    name: 'Poli Gigi & Mulut',
    iconName: 'Smile',
    description: 'Pemeriksaan kesehatan gigi, pencabutan gigi, penambalan, pembersihan karang gigi (scaling), dan konsultasi oral.',
    room: 'Lantai 1 - Ruang 104',
    queuePrefix: 'B',
    activeQueueNumber: '-',
    totalWaiting: 0,
    doctorName: 'drg. Maya Rosdiana',
    operatingHours: 'Senin - Jumat (08:00 - 13:00 WIB)',
    requirements: ['KTP Pasien', 'Kartu BPJS Kesehatan Tangsel'],
    feeGeneral: 'Gratis (BPJS) / Rp 15.000 - Rp 30.000 (Umum)'
  },
  {
    id: 'poli-kia-kb',
    code: 'C',
    name: 'Poli KIA & KB',
    iconName: 'HeartPulse',
    description: 'Pemeriksaan kehamilan (ANC), pelayanan KB (IUD, Implan, Suntik, Pil), imunisasi TT ibu hamil, dan nifas.',
    room: 'Lantai 1 - Ruang 102',
    queuePrefix: 'C',
    activeQueueNumber: '-',
    totalWaiting: 0,
    doctorName: 'Bidan Nining Kurnia, S.ST',
    operatingHours: 'Senin - Sabtu (08:00 - 13:00 WIB)',
    requirements: ['Buku KIA (Pink)', 'KTP & KK Pasien', 'Kartu BPJS'],
    feeGeneral: 'Gratis (BPJS) / Rp 15.000 (Umum)'
  },
  {
    id: 'poli-anak-imunisasi',
    code: 'D',
    name: 'Poli Anak & Imunisasi',
    iconName: 'Baby',
    description: 'Pemeriksaan kesehatan bayi/balita, pemantauan tumbuh kembang, penimbangan, serta imunisasi rutin wajib.',
    room: 'Lantai 1 - Ruang 103',
    queuePrefix: 'D',
    activeQueueNumber: '-',
    totalWaiting: 0,
    doctorName: 'dr. Siska Rahmawati, Sp.A',
    operatingHours: 'Selasa & Kamis (08:00 - 12:00 WIB)',
    requirements: ['Buku KMS / Buku Pink', 'KTP Orang Tua', 'Kartu BPJS'],
    feeGeneral: 'Gratis Imunisasi Program Pemerintah'
  },
  {
    id: 'poli-lansia-ptm',
    code: 'E',
    name: 'Poli Lansia & PTM',
    iconName: 'UserCheck',
    description: 'Layanan kesehatan prioritas usia lanjut (≥60 tahun) dan pencegahan penyakit tidak menular (Hipertensi, Diabetes).',
    room: 'Lantai 1 - Ruang 105 (Akses Ramah Lansia)',
    queuePrefix: 'E',
    activeQueueNumber: '-',
    totalWaiting: 0,
    doctorName: 'dr. Ahmad Fauzi',
    operatingHours: 'Senin - Jumat (08:00 - 13:00 WIB)',
    requirements: ['KTP Pasien Lansia', 'Kartu BPJS Kesehatan'],
    feeGeneral: 'Gratis (Pemeriksaan Gula & Tensi Rutin)'
  },
  {
    id: 'poli-tb-ispa',
    code: 'F',
    name: 'Poli Batuk & TB Paru',
    iconName: 'Activity',
    description: 'Pemeriksaan dahak Sputum/TCM, pengobatan TB Paru terpadu, pencegahan dan penanganan ISPA.',
    room: 'Lantai 2 - Ruang Khusus TB 201',
    queuePrefix: 'F',
    activeQueueNumber: '-',
    totalWaiting: 0,
    doctorName: 'dr. Rian Hidayat',
    operatingHours: 'Senin, Rabu, Jumat (08:30 - 12:00 WIB)',
    requirements: ['Rujukan internal / Kartu Berobat TB', 'KTP Pasien'],
    feeGeneral: 'Gratis (Program TB Nasional Kemenkes)'
  },
  {
    id: 'laboratorium',
    code: 'L',
    name: 'Laboratorium Kesehatan',
    iconName: 'TestTube',
    description: 'Pemeriksaan Darah Lengkap, Gula Darah, Kolesterol, Asam Urat, Urine, Tes Kehamilan, Malaria, BTA, HIV, & HBsAg.',
    room: 'Lantai 1 - Ruang Lab 106',
    queuePrefix: 'L',
    activeQueueNumber: '-',
    totalWaiting: 0,
    doctorName: 'Analis Medis Dewi Astuti, A.Md.AK',
    operatingHours: 'Senin - Sabtu (08:00 - 12:00 WIB)',
    requirements: ['Formulir Pengantar Dokter Puskesmas', 'KTP & BPJS'],
    feeGeneral: 'Gratis dengan rujukan dokter BPJS / Perda Tangsel'
  },
  {
    id: 'farmasi-apotek',
    code: 'P',
    name: 'Farmasi & Apotek Obat',
    iconName: 'Pills',
    description: 'Penyerahan obat resep dokter, edukasi cara minum obat, serta informasi efek samping obat pasien.',
    room: 'Lantai 1 - Loket Apotek 107',
    queuePrefix: 'P',
    activeQueueNumber: '-',
    totalWaiting: 0,
    doctorName: 'Apt. Farida Nurjanah, S.Farm',
    operatingHours: 'Senin - Sabtu (08:00 - 14:30 WIB)',
    requirements: ['Resep Resmi Dokter Puskesmas Pondok Benda'],
    feeGeneral: 'Gratis Paket Resep Puskesmas'
  }
];

export const INITIAL_DOCTORS: DoctorSchedule[] = [
  {
    id: 'doc-1',
    doctorName: 'dr. H. Bambang Suherman',
    specialty: 'Dokter Umum / Kepala Puskesmas',
    poliId: 'poli-umum',
    poliName: 'Poli Umum',
    days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    hours: '08:00 - 12:00 WIB',
    quotaPerDay: 40,
    status: 'Hadir',
    photoUrl: ''
  },
  {
    id: 'doc-2',
    doctorName: 'dr. Ahmad Fauzi',
    specialty: 'Dokter Umum & Penyakit Tidak Menular',
    poliId: 'poli-umum',
    poliName: 'Poli Umum & Poli Lansia',
    days: ['Senin', 'Rabu', 'Kamis', 'Sabtu'],
    hours: '08:00 - 13:30 WIB',
    quotaPerDay: 35,
    status: 'Hadir',
    photoUrl: ''
  },
  {
    id: 'doc-3',
    doctorName: 'drg. Maya Rosdiana',
    specialty: 'Dokter Gigi & Mulut',
    poliId: 'poli-gigi',
    poliName: 'Poli Gigi & Mulut',
    days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    hours: '08:00 - 12:30 WIB',
    quotaPerDay: 15,
    status: 'Hadir',
    photoUrl: ''
  },
  {
    id: 'doc-4',
    doctorName: 'Bidan Nining Kurnia, S.ST',
    specialty: 'Bidan Koordinator KIA / KB',
    poliId: 'poli-kia-kb',
    poliName: 'Poli KIA & KB',
    days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    hours: '08:00 - 13:00 WIB',
    quotaPerDay: 25,
    status: 'Hadir',
    photoUrl: ''
  },
  {
    id: 'doc-5',
    doctorName: 'dr. Siska Rahmawati, Sp.A',
    specialty: 'Spesialis Kesehatan Anak',
    poliId: 'poli-anak-imunisasi',
    poliName: 'Poli Anak & Imunisasi',
    days: ['Selasa', 'Kamis'],
    hours: '08:30 - 12:00 WIB',
    quotaPerDay: 20,
    status: 'Hadir',
    photoUrl: ''
  },
  {
    id: 'doc-6',
    doctorName: 'dr. Rian Hidayat',
    specialty: 'Dokter Penanggung Jawab TB Paru',
    poliId: 'poli-tb-ispa',
    poliName: 'Poli Batuk & TB Paru',
    days: ['Senin', 'Rabu', 'Jumat'],
    hours: '09:00 - 12:00 WIB',
    quotaPerDay: 15,
    status: 'Hadir',
    photoUrl: ''
  }
];

export const INITIAL_ARTICLES: HealthArticle[] = [
  {
    id: 'art-b3',
    title: 'Simulasi Tumpahan B3 (Bahan Berbahaya dan Beracun) di UPTD Puskesmas Pondok Benda',
    category: 'Video Edukasi',
    snippet: 'Video kali ini merupakan Simulasi Tumpahan B3 (Bahan Berbahaya dan Beracun) di UPTD Puskesmas Pondok Benda.',
    content: 'UPTD Puskesmas Pondok Benda secara berkala menyelenggarakan Simulasi Penanganan Tumpahan B3 (Bahan Berbahaya dan Beracun) sebagai wujud komitmen dalam menjaga keselamatan pasien, staf, serta kelestarian lingkungan. Kegiatan ini melatih kesiapsiagaan tanggap darurat petugas medis dalam mengisolasi area, menggunakan Alat Pelindung Diri (APD) dan Spill Kit sesuai standar SOP/PPI, hingga mengelola limbah infeksius maupun bahan kimia secara aman dan cepat.',
    date: '05 Agustus 2026',
    author: 'Tim Promkes Puskesmas',
    readTime: 'Video Edukasi',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    imageUrl: 'https://img.youtube.com/vi/dYSmq6aBd7k/hqdefault.jpg',
    isVideo: true,
    videoUrl: 'https://www.youtube.com/embed/dYSmq6aBd7k'
  },
  {
    id: 'art-gempa',
    title: 'Simulasi Gempa Bumi di UPTD Puskesmas Pondok Benda',
    category: 'Video Edukasi',
    snippet: 'Tujuan dari kegiatan simulasi gempa bumi adalah untuk melatih kesiapsiagaan para pegawai tentang bagaimana mengambil sikap dan tindakan ketika menghadapi bencana gempa bumi. Dengan diadakannnya simulasi evakuasi bencana gempa bumi, para pegawai diharapkan tidak panik saat terjadi bencana alam, seperti gempa bumi dan lainnya. Dengan adanya simulasi gempa bumi, dapat meminimalkan adanya korban jiwa yang terenggut dalam suatu kejadian bencana alam. Pegawai menjadi lebih paham tentang apa yang harus dan tidak boleh dilakukan saat terjadinya bencana alam.',
    content: 'Sebagai langkah mitigasi bencana dan komitmen dalam menjamin keselamatan pasien serta staf medis, UPTD Puskesmas Pondok Benda menyelenggarakan Simulasi Gempa Bumi secara berkala. Kegiatan ini melatih kesiapsiagaan seluruh personel dalam merespons guncangan secara cepat dan tepat—mulai dari melakukan teknik berlindung (Drop, Cover, Hold On), memandu proses evakuasi yang tertib menuju titik kumpul (Assembly Point), hingga memberikan penanganan medis darurat pasca-bencana sesuai dengan standar Keselamatan dan Kesehatan Kerja (K3) Fasilitas Pelayanan Kesehatan.',
    date: '04 Agustus 2026',
    author: 'Tim Promkes Puskesmas',
    readTime: 'Video Edukasi',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    imageUrl: 'https://img.youtube.com/vi/1XENj4XlTZ0/hqdefault.jpg',
    isVideo: true,
    videoUrl: 'https://www.youtube.com/embed/1XENj4XlTZ0'
  },
  {
    id: 'art-codered',
    title: 'Simulasi Code Red di UPTD Puskesmas Pondok Benda',
    category: 'Video Edukasi',
    snippet: 'Code Red adalah kode emergensi untuk kondisi kebakaran yang membutuhkan kesiapan dan kesigapan petugas untuk memadamkan api, mengevakuasi pasien, alat kesehatan, dokumen dll. Code Red atau kode merah adalah kode yang mengumumkan adanya ancaman kebakaran di lingkungan fasilitas kesehatan (api maupun asap), sekaligus mengaktifkan tim siaga bencana instansi kesehatan untuk kasus kebakaran. Dimana tim ini terdiridari seluruh personel instansi kesehatan, yang masing-masing memiliki peran spesifik yang harus dikerjakan sesuai dengan panduan kebakaran/tanggap darurat bencana/Disaster Plan. Misalnya; petugas teknisi/IPRS segera mematikan listrik di tempat area kebakaran, petugas/ perawat segera memobilisasi pasien ke titik-titik kumpul melalui jalaur evakuasi, dan sebagainya.',
    content: 'Dalam upaya meningkatkan kesiapsiagaan tanggap darurat kebakaran dan perlindungan terhadap keselamatan pasien serta staf, UPTD Puskesmas Pondok Benda menyelenggarakan Simulasi Code Red secara berkala. Kegiatan ini melatih keandalan seluruh tim penanggulangan kebakaran mulai dari Tim Merah (pemadam api dengan APAR), Tim Biru (evakuasi pasien), Tim Hijau (penyelamat dokumen medis), hingga Tim Kuning (penyelamat aset dan peralatan medis) agar dapat merespons pembunyian alarm kebakaran dengan cepat, terkoordinasi, dan sesuai SOP Keselamatan dan Kesehatan Kerja (K3) Fasilitas Pelayanan Kesehatan.',
    date: '03 Agustus 2026',
    author: 'Tim Promkes Puskesmas',
    readTime: 'Video Edukasi',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    imageUrl: 'https://img.youtube.com/vi/BpRcZYbcMnw/hqdefault.jpg',
    isVideo: true,
    videoUrl: 'https://www.youtube.com/embed/BpRcZYbcMnw'
  },
  {
    id: 'art-codeblue',
    title: 'Simulasi Code Blue di UPTD Puskesmas Pondok Benda',
    category: 'Video Edukasi',
    snippet: 'Code Blue ada sebuah kode sistem aktivasi untuk kondisi gawat darurat untuk pasien yang membutuhkan pertolongan dan penanganan medis sesegera mungkin, seperti pada kasus pasien mengalami henti jantung. Code blue adalah kode warna yang terdapat di puskesmas atau instansi kesehatan lainnya yang digunakan untuk memberitahu tim respon cepat mengenai adanya kondisi gawat darurat dan lokasi terjadinya. Petugas yang berkerja di instansi kesehatan wajib mengetahui arti dari kode yang digunakan karena merupakan tanda dari kondisi kegawatdaruratan yang perlu dilakukan tindakan segera. Kode warna dibuat agar dapat menyampaikan informasi yang segera secara ringkas dan tepat ke personil rumah sakit untuk menangani keadaan emergensi tersebut tanpa membuat rumah sakit menjadi dalam keadaan panik.',
    content: 'Guna menjamin keselamatan dan kecepatan penanganan pasien yang mengalami kondisi gawat darurat medis, UPTD Puskesmas Pondok Benda menyelenggarakan Simulasi Code Blue secara berkala. Kegiatan ini melatih kesiapsiagaan seluruh tenaga kesehatan dan Tim Resusitasi dalam merespons insiden henti jantung atau henti napas secara cepat, tepat, dan terkoordinasi—mulai dari aktivasi sinyal Code Blue, pelaksanaan Bantuan Hidup Dasar (BHD) dan resusitasi jantung paru (RJP), penggunaan instrumen medis darurat, hingga proses stabilisasi dan rujukan pasien sesuai standar keselamatan pasien (patient safety).',
    date: '02 Agustus 2026',
    author: 'Tim Promkes Puskesmas',
    readTime: 'Video Edukasi',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    imageUrl: 'https://img.youtube.com/vi/eAlBrKaqpdc/hqdefault.jpg',
    isVideo: true,
    videoUrl: 'https://www.youtube.com/embed/eAlBrKaqpdc'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Standar Pelayanan Publik (PermenPAN-RB No. 15/2014)',
    category: 'PermenPAN-RB',
    content: 'Penerapan 14 komponen standar pelayanan mencakup kepastian persyaratan, kejelasan prosedur, jam layanan, biaya transparan, serta maklumat pelayanan publik.',
    date: 'Mutu Pelayanan',
    isUrgent: false
  },
  {
    id: 'ann-2',
    title: 'Terakreditasi Utama - Kemenkes RI',
    category: 'Akreditasi Utama',
    content: 'Puskesmas Pondok Benda meraih predikat Akreditasi Utama dalam pemenuhan standar fasilitas kesehatan, keselamatan pasien, dan tata kelola mutu.',
    date: 'Resmi Kemenkes',
    isUrgent: true
  },
  {
    id: 'ann-3',
    title: 'Evaluasi IKM & Penanganan Pengaduan Mampu Usut',
    category: 'Penilaian Mutu',
    content: 'Tingkat kepuasan masyarakat diukur secara berkala melalui Indeks Kepuasan Masyarakat (IKM) serta saluran pengaduan cepat via Hotline WA 082311366261.',
    date: 'Terintegrasi',
    isUrgent: false
  }
];

export const INITIAL_TICKETS: QueueTicket[] = [];
