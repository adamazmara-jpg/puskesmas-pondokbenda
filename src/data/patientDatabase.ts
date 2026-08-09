export interface PatientRecord {
  nik: string;
  bpjsNumber?: string;
  fullName: string;
  birthDate: string; // YYYY-MM-DD or DD/MM/YYYY
  address: string;
  gender?: 'L' | 'P';
  lastPoli?: string;
  phone?: string;
}

// Calculate age from birthDate string (handles both YYYY-MM-DD and DD/MM/YYYY)
export function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  
  let birthDate: Date;
  if (birthDateStr.includes('/')) {
    const parts = birthDateStr.split('/');
    if (parts.length === 3) {
      // DD/MM/YYYY
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      birthDate = new Date(year, month, day);
    } else {
      birthDate = new Date(birthDateStr);
    }
  } else {
    birthDate = new Date(birthDateStr);
  }

  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 0 ? 0 : age;
}

// Format birthdate to standard YYYY-MM-DD for HTML input[type="date"]
export function formatBirthDateToInput(birthDateStr: string): string {
  if (!birthDateStr) return '1990-01-01';
  if (birthDateStr.includes('/')) {
    const parts = birthDateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }
  return birthDateStr;
}

// Extracted Patient Dataset from Puskesmas Pondok Benda File / PDF Records
export const PATIENT_DATABASE: PatientRecord[] = [
  {
    nik: '3674065810690004',
    bpjsNumber: '1790635882',
    fullName: 'Yuda hidayati',
    birthDate: '1969-10-18',
    address: 'Jln benda barat 4 b 12 no 4 pamulang 2',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081298451201'
  },
  {
    nik: '3674054509040005',
    bpjsNumber: '49472829',
    fullName: 'Annisa Rahma Aulia',
    birthDate: '2004-09-05',
    address: 'Griya Laksana Pinasti Blok C6, Kel. Pondok Benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085712349811'
  },
  {
    nik: '3674061406940002',
    bpjsNumber: '2225611686',
    fullName: 'Sandy Dharmawan',
    birthDate: '1994-06-14',
    address: 'Kp. Cogreg RT 02/03 NO. 21, COGREG, PARUNG',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388123901'
  },
  {
    nik: '3211035204950001',
    bpjsNumber: '',
    fullName: 'Fitria anggraeni',
    birthDate: '1996-05-26',
    address: 'Jl.lebak indah parakan, rt01 rw08',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081233445566'
  },
  {
    nik: '3674064803260002',
    bpjsNumber: '3954533758',
    fullName: 'XAVIERA HAMEEDA RAYYANA',
    birthDate: '2026-03-08',
    address: 'JALAN BENDA TIMUR 13A Blok E31 no.8',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081299887766'
  },
  {
    nik: '3674041802260002',
    bpjsNumber: '3952639844',
    fullName: 'Muhammad Aydan Atthallah',
    birthDate: '2026-02-18',
    address: 'Perumahan Taman Fasco D6 No.6',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '085611223344'
  },
  {
    nik: '3171016807180001',
    bpjsNumber: '2491124883',
    fullName: 'Bening Kamila Zukhrufia',
    birthDate: '2018-07-28',
    address: 'Jl. TPU Parakan No. 245 rt 002 rw 009 kel. Pondok benda kec. Pamulang',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081288776655'
  },
  {
    nik: '3674066207940001',
    bpjsNumber: '3575512179',
    fullName: 'Elzan Rayyan Ahmad',
    birthDate: '1994-07-22',
    address: 'Pondok benda RT 01/ RW 09',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081900112233'
  },
  {
    nik: '3674065310020003',
    bpjsNumber: '3952018293',
    fullName: 'bayi nyonya keysha aulia',
    birthDate: '2002-10-13',
    address: 'benda barat 13 b',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081233221100'
  },
  {
    nik: '3171011204200001',
    bpjsNumber: '2930331914',
    fullName: 'Kayyis buana bagja',
    birthDate: '2020-04-12',
    address: 'Jl. Tpu parakan no 247 002/009 pondok benda pamulang',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081399887711'
  },
  {
    nik: '3674062811880009',
    bpjsNumber: '1283776762',
    fullName: 'Deviko',
    birthDate: '1988-11-28',
    address: 'Rt 6 Rw 13 Pondok Benda',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081244556677'
  },
  {
    nik: '3174102306230008',
    bpjsNumber: '3053912106',
    fullName: 'Mikha Sabandar',
    birthDate: '2023-06-23',
    address: 'Cendana Residence i8 29',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085700112233'
  },
  {
    nik: '3674064207220004',
    bpjsNumber: '',
    fullName: 'Julaiha saputri',
    birthDate: '2022-07-02',
    address: 'Jl.kesadaran rt 002 rw 002',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081299001122'
  },
  {
    nik: '1603072203250001',
    bpjsNumber: '3755095266',
    fullName: 'Aqmar Faiz Arrasyid',
    birthDate: '2025-03-22',
    address: 'Cendana Residence Blok G6 No 3',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081388776655'
  },
  {
    nik: '3174052307770007',
    bpjsNumber: '',
    fullName: 'Pipit Purnama',
    birthDate: '1977-07-23',
    address: 'Griya Ashri 2 no 9 Komplek Bukit Indah Blok D',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081266554433'
  },
  {
    nik: '3674060905060007',
    bpjsNumber: '1648723893',
    fullName: 'Hilal Iman Fadilah',
    birthDate: '2008-05-09',
    address: 'Jl. Benda Barat XIIA Blok D40/9',
    gender: 'L',
    lastPoli: 'Surat Keterangan Sehat',
    phone: '085699887766'
  },
  {
    nik: '3174010212720007',
    bpjsNumber: '1308709427',
    fullName: 'Trisula Indramarta',
    birthDate: '1972-12-02',
    address: 'Perum Cendana residence blok E7 no 30',
    gender: 'L',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081211223344'
  },
  {
    nik: '3671132706770003',
    bpjsNumber: '2377542745',
    fullName: 'Mugiono',
    birthDate: '1977-06-27',
    address: 'Taman pondok benda blok f18',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081377889900'
  },
  {
    nik: '3674061211870007',
    bpjsNumber: '2361218152',
    fullName: 'Muhamad sabrulloh',
    birthDate: '1987-11-12',
    address: '02/01 pondok benda',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081255443322'
  },
  {
    nik: '3671134501730001',
    bpjsNumber: '1292238459',
    fullName: 'Yanuar Kartiwi',
    birthDate: '1973-01-05',
    address: 'Jl Kav PDK 12 Blok C 6 RT 10/09',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085711223344'
  },
  {
    nik: '1603184411040004',
    bpjsNumber: '990273723',
    fullName: 'Nava urbach',
    birthDate: '2004-11-04',
    address: 'jl.swadaya rt 02/rw 05 ,pondok benda , pamulang',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081299881122'
  },
  {
    nik: '3174055412060002',
    bpjsNumber: '1212789508',
    fullName: 'Khansa',
    birthDate: '2006-12-14',
    address: 'Jl swadaya parakan no.103',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388771122'
  },
  {
    nik: '3674063101000003',
    bpjsNumber: '2359934651',
    fullName: 'Rendi nuradi',
    birthDate: '2000-01-31',
    address: 'Jl swadaya rt 002 rw 005',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085600112244'
  },
  {
    nik: '3671134910110003',
    bpjsNumber: '1292239067',
    fullName: 'Aura Azkia Basitha',
    birthDate: '2011-10-09',
    address: 'Jln kav PDK 12 Blok C6',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081233441122'
  },
  {
    nik: '3604300805750002',
    bpjsNumber: '',
    fullName: 'Aliudin kurniawan',
    birthDate: '1975-05-08',
    address: 'Jln swadaya3 rt006/005 pondok benda pamulang tangsel',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081299334411'
  },
  {
    nik: '3674061808240083',
    bpjsNumber: '3618888401',
    fullName: 'Kaivandra abhiseka athariz',
    birthDate: '2024-08-18',
    address: 'Pamulang permai II blok D 18/21',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081377881122'
  },
  {
    nik: '3213034607970011',
    bpjsNumber: '1848449755',
    fullName: 'Rizka Yulianti Ajizah',
    birthDate: '1997-07-06',
    address: 'Jl Salak Raya No 3 RT 001 / RW 022 Pondok Benda Pamulang',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081299887766'
  },
  {
    nik: '3674065703740003',
    bpjsNumber: '1654654105',
    fullName: 'Mia aisa',
    birthDate: '1974-03-17',
    address: 'Cendana residence',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '085711223399'
  },
  {
    nik: '3674065707040009',
    bpjsNumber: '2361832299',
    fullName: 'iven nabila fauziah',
    birthDate: '2004-07-17',
    address: 'jl swadaya parakan pondok benda pamulang kota tangsel',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081288990011'
  },
  {
    nik: '3674065906790014',
    bpjsNumber: '1318445098',
    fullName: 'Anik indarsih',
    birthDate: '1979-06-19',
    address: 'Jl.salak 9 no.2 Rt005/004 pondok benda9',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081311223355'
  },
  {
    nik: '3674061502770004',
    bpjsNumber: '1725115318',
    fullName: 'Mustopa kamal',
    birthDate: '1977-02-15',
    address: 'Pondok benda RT 01/01',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085633221100'
  },
  {
    nik: '3674066710130003',
    bpjsNumber: '1844041779',
    fullName: "Anindya Rofiqotul A'la",
    birthDate: '2013-10-27',
    address: 'griya Pamulang 2 blok RT 01/020 Pd.Benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081277889911'
  },
  {
    nik: '3674062602080008',
    bpjsNumber: '2361122381',
    fullName: 'rudiansyah',
    birthDate: '2008-02-26',
    address: 'jl swadaya rt 004 rw 008 kel pondok benda kec pamulang tangerang selatan',
    gender: 'L',
    lastPoli: 'Gigi & Mulut',
    phone: '081399001122'
  },
  {
    nik: '3674066009250006',
    bpjsNumber: '3781671603',
    fullName: 'Aliza Nauraalpnsa',
    birthDate: '2025-09-20',
    address: 'Pondok petir Rt06,rw05, pondok benda, Pamulang',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '085711335577'
  },
  {
    nik: '3674065003590009',
    bpjsNumber: '1728941141',
    fullName: 'Marnis',
    birthDate: '1959-03-10',
    address: 'Jalan benda timur 13 blok e32 no 11',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081288334411'
  },
  {
    nik: '3674064510910012',
    bpjsNumber: '',
    fullName: 'Eka mirnawati',
    birthDate: '1991-10-05',
    address: 'Jl. Tpu parakan gg tongsin sidan rt 02/09',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081399221100'
  },
  {
    nik: '3171076402710006',
    bpjsNumber: '1128813939',
    fullName: 'Nurhudayani',
    birthDate: '1971-02-24',
    address: 'Jln. Benda barat 10 blok D19 no. 17',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081277112233'
  },
  {
    nik: '3674016205041001',
    bpjsNumber: '',
    fullName: 'Putri Abillah Riyani',
    birthDate: '2004-05-22',
    address: '002/004 Buaran Serpong',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085699001122'
  },
  {
    nik: '3673016309830002',
    bpjsNumber: '3546593526',
    fullName: 'Akmal latif khalifah',
    birthDate: '2024-08-30',
    address: 'Jalan kesadaran pondok benda',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081211335577'
  },
  {
    nik: '3674064704250004',
    bpjsNumber: '3754847272',
    fullName: 'Fazeela ghalisa farhanilnibad',
    birthDate: '2025-04-07',
    address: 'Jalan Siliwangi rt001/003',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081388112233'
  },
  {
    nik: '3674066002260004',
    bpjsNumber: '3952763728',
    fullName: 'Khalisa Aqilla Putri Jabar',
    birthDate: '2026-02-20',
    address: 'Jl. TPU Parakan RT 001/009',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '085799001122'
  },
  {
    nik: '3674064304030001',
    bpjsNumber: '1628315177',
    fullName: 'Alfira Fitria Anjani',
    birthDate: '2003-04-03',
    address: 'Jl. Arjuna III Blok DE 2/19, Pondok Benda, Pamulang, Tangerang Selatan',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081299331122'
  },
  {
    nik: '3674062903260002',
    bpjsNumber: '',
    fullName: 'Keano Andriansyah',
    birthDate: '2026-03-29',
    address: 'Jl.anggrek RT 003/RW 018 no 17 .pondok benda Pamulang',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081322110099'
  },
  {
    nik: '3674070206190001',
    bpjsNumber: '',
    fullName: 'Riza Khalif Khairul Azzam',
    birthDate: '2019-06-02',
    address: 'Pesona Serpong Residence Blok Populis 2 nomor 39 Bakti Jaya',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611335577'
  },
  {
    nik: '3674062202260001',
    bpjsNumber: '3953634333',
    fullName: 'Ezmir behzad gumas',
    birthDate: '2026-02-22',
    address: 'Jl.benda barat 14 c 30 no.11',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081288991122'
  },
  {
    nik: '3328144905870001',
    bpjsNumber: '',
    fullName: 'Hesti Pratiwi',
    birthDate: '1987-05-09',
    address: 'Pesona Serpong Residence Blok Populis 2 nomor 39 Bakti Jaya',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081399001133'
  },
  {
    nik: '3674062009240004',
    bpjsNumber: '3623935825',
    fullName: 'Pratama shaki afandi',
    birthDate: '2024-09-20',
    address: 'Jl. Lurah rt 005/03',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '085711223344'
  },
  {
    nik: '3674066604020011',
    bpjsNumber: '',
    fullName: 'Dhea aprilia',
    birthDate: '2002-04-26',
    address: 'jl pondok salak rt005/rw022 pondok benda pamulang',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081277334411'
  },
  {
    nik: '3674045203260002',
    bpjsNumber: '',
    fullName: 'Kaluna Arabella Anindyaswari',
    birthDate: '2026-03-12',
    address: 'Jl. Suka Mulya rt.002/007 Pondok Benda',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081388991100'
  },
  {
    nik: '3674062605140002',
    bpjsNumber: '',
    fullName: 'Brian Drajat Suryawiguna',
    birthDate: '2014-05-26',
    address: '003/021 Pd.Benda Pamulang',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085600113322'
  },
  {
    nik: '3301085901960002',
    bpjsNumber: '',
    fullName: 'Sulastri',
    birthDate: '1996-01-19',
    address: 'Rt004/009 Pd.Benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211223399'
  },
  {
    nik: '3674061607240002',
    bpjsNumber: '3610677723',
    fullName: 'Muhammad putra Ismail',
    birthDate: '2024-07-16',
    address: 'Jl.arjuna Parakan',
    gender: 'L',
    lastPoli: 'MTBS (anak usia 0-5 th)',
    phone: '081399882211'
  },
  {
    nik: '3674065804260001',
    bpjsNumber: '3959326629',
    fullName: 'Azalea zhaveesa nurhadi',
    birthDate: '2026-04-18',
    address: 'Jl swadaya Pondok Benda',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '085788990011'
  },
  {
    nik: '3674060505580007',
    bpjsNumber: '3633708216',
    fullName: 'Ahmad',
    birthDate: '1958-05-05',
    address: 'Jalan salak 8 rt/rw 001/003',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081277112299'
  },
  {
    nik: '3674076109240002',
    bpjsNumber: '3645082585',
    fullName: 'Agnes Lestari Anella',
    birthDate: '2024-09-21',
    address: 'Cluster Voyage blok P5 no 2',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081399112233'
  },
  {
    nik: '3674064810030003',
    bpjsNumber: '2223048486',
    fullName: 'Syahra Lulu Annisa',
    birthDate: '2003-10-08',
    address: 'kp parakan rt006/009',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '085611224455'
  },
  {
    nik: '3171061911830001',
    bpjsNumber: '1207680039',
    fullName: 'Faisal h',
    birthDate: '1983-11-19',
    address: 'Pamulang 2 jln benda barat 11 rt 4/9no 13c',
    gender: 'L',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081299445566'
  },
  {
    nik: '3674066308240006',
    bpjsNumber: '3619800538',
    fullName: 'Alkhaleena Rania syaqueena',
    birthDate: '2024-08-23',
    address: 'Jl kesadaran RT/RW 003/002',
    gender: 'P',
    lastPoli: 'MTBS (anak usia 0-5 th)',
    phone: '081388992211'
  },
  {
    nik: '3674060908990014',
    bpjsNumber: '1271583033',
    fullName: 'Muhamad dafa',
    birthDate: '1999-08-09',
    address: 'Jl. Benda timur 12 blok E18 no.16 rt 05 rw 11',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085711334455'
  },
  {
    nik: '3674060506520002',
    bpjsNumber: '1819847114',
    fullName: 'MUCHSIN',
    birthDate: '1952-06-05',
    address: 'Jl Benda Timur 9B',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081288112233'
  },
  {
    nik: '3674064404710015',
    bpjsNumber: '',
    fullName: 'Suryani',
    birthDate: '1971-04-04',
    address: 'Rt001/020 griya pamulang',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081399332211'
  },
  {
    nik: '3674065307070001',
    bpjsNumber: '1963006986',
    fullName: 'Fachra Julyanti Anwar',
    birthDate: '2007-07-13',
    address: 'Pamulang permai II E. 19/30 A. 005/011',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '085622113344'
  },
  {
    nik: '3321132510080003',
    bpjsNumber: '1626413319',
    fullName: 'Obed Bagas Kristian Simatupang',
    birthDate: '2008-10-25',
    address: 'jalan saman lidjan',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081299554433'
  },
  {
    nik: '3674064606950002',
    bpjsNumber: '',
    fullName: 'khairunisa',
    birthDate: '1995-06-06',
    address: 'kp pondok petir RT 04 RW 05',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388443322'
  },
  {
    nik: '3674060402910009',
    bpjsNumber: '1460741207',
    fullName: 'Citra',
    birthDate: '1991-02-04',
    address: 'Jalan bratasena IV blok BC 1/16',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085711002233'
  },
  {
    nik: '3674014102110001',
    bpjsNumber: '2080325373',
    fullName: 'Chiquita Mumtaz Khairunnisa',
    birthDate: '2011-02-01',
    address: 'Bumi Serpong Residence blok i /21',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081233887766'
  },
  {
    nik: '3674064601180003',
    bpjsNumber: '2492760543',
    fullName: 'Aunatullah uzhma',
    birthDate: '2018-01-06',
    address: 'Pondok Benda Pamulang',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081399443322'
  },
  {
    nik: '3674045006780018',
    bpjsNumber: '1393412668',
    fullName: 'Caroline',
    birthDate: '1978-06-10',
    address: 'Bukit indah',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611229988'
  },
  {
    nik: '3674011008250003',
    bpjsNumber: '3774703825',
    fullName: 'Risyad zahir khalid',
    birthDate: '2025-08-10',
    address: 'Cluster mulya residence no .A3 Jl. H jamat gg rais',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081299883322'
  },
  {
    nik: '3674017105810001',
    bpjsNumber: '1434569433',
    fullName: 'Titik Istiqomah',
    birthDate: '1981-05-31',
    address: 'Cendana Residence RT001/RW023 Pondok Benda Pamulang',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081388773322'
  },
  {
    nik: '3302141902010001',
    bpjsNumber: '527059192',
    fullName: 'Candra Eka Febriyanto',
    birthDate: '2001-02-19',
    address: 'jl.satria no 55 RT 003 RW 009',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722114433'
  },
  {
    nik: '3674062805170007',
    bpjsNumber: '',
    fullName: 'merfin adrian fidelis',
    birthDate: '2017-05-28',
    address: 'jl satria no 55 rt 003 rw 009',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081299002211'
  },
  {
    nik: '3674066803230001',
    bpjsNumber: '3515357632',
    fullName: 'Raqilla Shreya Maheswari',
    birthDate: '2023-03-28',
    address: 'Jl. Benda Barat 13 Blok C29/40 RT 001 RW 013 Pamulang Permai 2',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081388994455'
  },
  {
    nik: '3674062105250008',
    bpjsNumber: '3761674885',
    fullName: 'Muhammad shalih Musa ali',
    birthDate: '2025-05-21',
    address: 'Rt 001/022, pondok benda, Pamulang Tangerang Selatan',
    gender: 'L',
    lastPoli: 'MTBS (anak usia 0-5 th)',
    phone: '085711225566'
  },
  {
    nik: '3207085309940001',
    bpjsNumber: '',
    fullName: 'Riska Nopita',
    birthDate: '1994-09-13',
    address: 'Dsn cukangpadung rt10/rw05 desa panjalu, kecamatan panjalu ciamis jabar',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081233224455'
  },
  {
    nik: '3674060410720016',
    bpjsNumber: '',
    fullName: 'Arther manueke',
    birthDate: '1972-10-04',
    address: 'Pondok Benda Pamulang',
    gender: 'L',
    lastPoli: 'Surat Keterangan Sehat',
    phone: '081399113344'
  },
  {
    nik: '3674065511700003',
    bpjsNumber: '2478759513',
    fullName: 'Novita m.syarif',
    birthDate: '1970-11-15',
    address: 'Rt005/014 benda baru',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722334455'
  },
  {
    nik: '1802164712250001',
    bpjsNumber: '3944206236',
    fullName: 'HAFSHAH ZAYNATU QOLBI',
    birthDate: '2025-12-07',
    address: 'Jl. Masjid Al-Amin No.15a, RT.001/RW.09, Pd. Benda, Pamulang, Tangsel',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081299881133'
  },
  {
    nik: '3674061107250001',
    bpjsNumber: '3770150635',
    fullName: 'Darmian Omar Tsaqib',
    birthDate: '2025-07-11',
    address: 'Reni Jaya Jl.Bratasena XV Blok U1 No.11',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081388771144'
  },
  {
    nik: '3674061510020009',
    bpjsNumber: '2926262496',
    fullName: 'Alfath Dzikri Syahada',
    birthDate: '2002-10-15',
    address: 'Pamulang Permai 2 Benda Timur 8b Blok E06 No 17',
    gender: 'L',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '085711224466'
  },
  {
    nik: '3674066201940002',
    bpjsNumber: '818946279',
    fullName: 'Santi marsela',
    birthDate: '1994-01-22',
    address: 'Jl.salak no.9 Rt003/004 pondok benda',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081211334455'
  },
  {
    nik: '3603232709950001',
    bpjsNumber: '1741343681',
    fullName: 'Rian septian',
    birthDate: '1995-09-27',
    address: 'Gang kenanga 4 no 35 rt 5 rw 3 benda baru pamulang',
    gender: 'L',
    lastPoli: 'Gigi & Mulut',
    phone: '081399112255'
  },
  {
    nik: '3674066503940011',
    bpjsNumber: '',
    fullName: 'Ranty inneke putri',
    birthDate: '1994-03-25',
    address: 'Jl kp parakan pamulang 2',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722113344'
  },
  {
    nik: '3173054509880006',
    bpjsNumber: '2336581642',
    fullName: 'Dwi supriyanti',
    birthDate: '1988-09-05',
    address: 'Jl. Tpu parakan rt. 009 rw. 013 no. 129',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081299884433'
  },
  {
    nik: '3674065108750011',
    bpjsNumber: '1454852968',
    fullName: 'NINA AGUS PRASETYOWATI',
    birthDate: '1975-08-11',
    address: 'Reni Jaya Jl. Maluku 1 Blok Q2 No. 16 Rt007 Rw006',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388993322'
  },
  {
    nik: '3674065804161006',
    bpjsNumber: '2053061166',
    fullName: 'alisha kaliluna putri',
    birthDate: '2016-04-18',
    address: 'griya pamulang 2 jl.mangga raya blok c 5no 11',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085711226677'
  },
  {
    nik: '3671116003800014',
    bpjsNumber: '',
    fullName: 'Wahyuningsih',
    birthDate: '1980-03-20',
    address: 'jl. tpu parakan Pondok Benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211335566'
  },
  {
    nik: '3674045906730002',
    bpjsNumber: '',
    fullName: 'Yeanette paulina',
    birthDate: '1973-06-19',
    address: 'Serua RT 003/018',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081399224455'
  },
  {
    nik: '3674061202710003',
    bpjsNumber: '1646017266',
    fullName: 'Edy pamuji',
    birthDate: '1971-02-12',
    address: 'Parakan rt04/09 Benda Baru',
    gender: 'L',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '085722001122'
  },
  {
    nik: '3674064101830063',
    bpjsNumber: '',
    fullName: 'Hasnah',
    birthDate: '1983-01-01',
    address: 'Pondok benda',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081299113322'
  },
  {
    nik: '3671084312940003',
    bpjsNumber: '2485309623',
    fullName: 'Prahaesti molek lestari',
    birthDate: '1994-12-03',
    address: 'Ciledug barat',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388224455'
  },
  {
    nik: '3175035010660015',
    bpjsNumber: '',
    fullName: 'Sri rahayu',
    birthDate: '1966-10-10',
    address: 'Jl. Arjuna parakan rt002/008 pondok benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085711445566'
  },
  {
    nik: '3674041711110003',
    bpjsNumber: '1867120751',
    fullName: 'SYAFID RIZQI BRAMDO',
    birthDate: '2011-11-17',
    address: 'CENDANA RESIDENCE BLOK C-1 NO 20 003/004 SERUA, CIPUTAT',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081299003344'
  },
  {
    nik: '3674065207720015',
    bpjsNumber: '',
    fullName: 'Nitawati ekariana,se',
    birthDate: '1972-07-12',
    address: 'Jl.kapling PDK Rt002/009 pondok benda',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081388114422'
  },
  {
    nik: '3674061212750023',
    bpjsNumber: '',
    fullName: 'Dedy Waluyo Wibowo',
    birthDate: '1975-12-12',
    address: '007/015 Pd.Benda',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722331100'
  },
  {
    nik: '3674061608860013',
    bpjsNumber: '1737569799',
    fullName: 'Tatar talarikala',
    birthDate: '1986-08-16',
    address: 'Kp Parakan RT 03 RW 09 no.10',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081211445566'
  },
  {
    nik: '3674061607800007',
    bpjsNumber: '',
    fullName: 'Mahendra wijaksono',
    birthDate: '1980-07-16',
    address: 'Jln,PARIKESIT Blokw-3/20',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081399003322'
  },
  {
    nik: '3174031701670007',
    bpjsNumber: '',
    fullName: 'EKO SAPUTRO',
    birthDate: '1967-01-17',
    address: 'JL. SWADAYA IV NO.2 RT.007 / RW.005, PONDOK BENDA, PAMULANG',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611223388'
  },
  {
    nik: '3674062101210001',
    bpjsNumber: '3091324959',
    fullName: 'Afnan Niki Syaddaad',
    birthDate: '2021-01-21',
    address: 'Pondok benda indah jl bumi 1 blok E1 no 08',
    gender: 'L',
    lastPoli: 'MTBS (anak usia 0-5 th)',
    phone: '081299882233'
  },
  {
    nik: '3674060405720012',
    bpjsNumber: '2362903018',
    fullName: 'Sunarso',
    birthDate: '1972-05-04',
    address: 'Jl Siliwangi Raya Gang Lurah Pondok Benda Tangerang Selatan',
    gender: 'L',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081388775566'
  },
  {
    nik: '3674061609188001',
    bpjsNumber: '',
    fullName: 'Muhamad attar faeyza',
    birthDate: '2018-09-16',
    address: 'Jalan salak 5',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722115544'
  },
  {
    nik: '3203110610950002',
    bpjsNumber: '3255670765',
    fullName: 'TAJUDIN',
    birthDate: '1995-10-06',
    address: 'Pamulang permai 2 kelurahan pondok benda',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211002233'
  },
  {
    nik: '3674065110961002',
    bpjsNumber: '2475433989',
    fullName: 'Oky suwartomo',
    birthDate: '1996-10-11',
    address: 'Jalan salak 5',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081399334455'
  },
  {
    nik: '3674066802210001',
    bpjsNumber: '3690918753',
    fullName: 'Kireina azzahra alfathunissa',
    birthDate: '2021-02-28',
    address: 'Parakan rt 01 rw 08',
    gender: 'P',
    lastPoli: 'MTBS (anak usia 0-5 th)',
    phone: '085611332211'
  },
  {
    nik: '3215225111050004',
    bpjsNumber: '488623094',
    fullName: 'Siti patimah',
    birthDate: '2005-11-11',
    address: 'Serua indah,Ciputat kota tangerang selatan,banten',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081299881155'
  },
  {
    nik: '3674064808980009',
    bpjsNumber: '2364076293',
    fullName: 'Ernawati Latif',
    birthDate: '1998-08-08',
    address: 'Jl Arjun parakan',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388772211'
  },
  {
    nik: '3603285102840005',
    bpjsNumber: '',
    fullName: 'Arlina audia',
    birthDate: '1984-02-11',
    address: 'Jl.perintis RT 006 RW009',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722003344'
  },
  {
    nik: '3173055711991001',
    bpjsNumber: '3047144747',
    fullName: 'Minati novittasari',
    birthDate: '1999-11-17',
    address: 'Jl. Swadya no102 rt. 03/05 pondok benda pamulang',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081211332200'
  },
  {
    nik: '3674065312030002',
    bpjsNumber: '2090008034',
    fullName: 'Faria Azzahra',
    birthDate: '2003-12-13',
    address: 'jl benda barat XI parakan rt.06 rw.09',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081399114433'
  },
  {
    nik: '3674071103670001',
    bpjsNumber: '',
    fullName: 'achmad sayuti',
    birthDate: '1967-03-11',
    address: 'pondok petir rt 04 rw 05',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611330022'
  },
  {
    nik: '3674061102880003',
    bpjsNumber: '2234712442',
    fullName: 'Hendra febrian rakiman',
    birthDate: '1988-02-11',
    address: 'Jl.benda barat 14 B 16/2 RT008 RW010',
    gender: 'L',
    lastPoli: 'Gigi & Mulut',
    phone: '081299882211'
  },
  {
    nik: '3674010509970002',
    bpjsNumber: '1769939381',
    fullName: 'Ibnu Sofiyan',
    birthDate: '1997-09-05',
    address: 'Kp. Pondok Benda Gang Rais No. 18 Buaran Serpong',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388221100'
  },
  {
    nik: '3674062705680001',
    bpjsNumber: '',
    fullName: 'Bino susilo',
    birthDate: '1968-05-27',
    address: '03/19 pondok benda',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722110033'
  },
  {
    nik: '3674065210860002',
    bpjsNumber: '2144863484',
    fullName: 'Sri Rahayu',
    birthDate: '1986-10-12',
    address: 'Kp.parakan RT 03 RW 09',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211003344'
  },
  {
    nik: '3173060509950003',
    bpjsNumber: '2335600157',
    fullName: 'Adi Wibowo',
    birthDate: '1995-09-05',
    address: 'Madrasah 2',
    gender: 'L',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081399221133'
  },
  {
    nik: '3674066501080002',
    bpjsNumber: '',
    fullName: 'Hany claudia christi br.s',
    birthDate: '2008-01-25',
    address: 'JL.ASTANA RAGA PARAKAN, RT001/RW009, PONDOK BENDA, PAMULANG',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611443322'
  },
  {
    nik: '1808106711030001',
    bpjsNumber: '',
    fullName: 'Dera putri anjani',
    birthDate: '2003-11-27',
    address: 'Jl pondok salak, rt 01 / rw 02, pondok benda, pamulang',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081299885544'
  },
  {
    nik: '3171035502030004',
    bpjsNumber: '1336850583',
    fullName: 'Shabrina salma',
    birthDate: '2003-02-15',
    address: 'Pondok benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388771122'
  },
  {
    nik: '3674066812210007',
    bpjsNumber: '3715921394',
    fullName: 'Harum Jinan Pamungkas',
    birthDate: '2021-12-28',
    address: 'Pamulang permai 2 C23/17',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '085722001144'
  },
  {
    nik: '3674065212820015',
    bpjsNumber: '1744701671',
    fullName: 'Tri Kusuma wardani',
    birthDate: '1982-12-12',
    address: 'Jl.Benda Barat 11A',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211004455'
  },
  {
    nik: '3674065209180008',
    bpjsNumber: '2481081737',
    fullName: 'Ayudia Sosro Maheswari',
    birthDate: '2018-09-12',
    address: 'Pondok benda Rt002/004',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081399112233'
  },
  {
    nik: '3674060407680007',
    bpjsNumber: '2778091784',
    fullName: 'Marubut rumapea',
    birthDate: '1968-07-04',
    address: 'Pondok benda',
    gender: 'L',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '085611332244'
  },
  {
    nik: '3674065006700018',
    bpjsNumber: '1642895932',
    fullName: 'Yuniasih',
    birthDate: '1970-06-10',
    address: 'Pondok benda RT 009/010',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081299883344'
  },
  {
    nik: '3603252403690001',
    bpjsNumber: '1054571218',
    fullName: 'Sudarminto',
    birthDate: '1969-03-24',
    address: '05/14 pondok benda',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388774433'
  },
  {
    nik: '3174054902960007',
    bpjsNumber: '1967115969',
    fullName: 'Puspa Lena Sari',
    birthDate: '1996-02-09',
    address: 'Warung Thariun, Jl. Srikandi RT 002 RW 004, Pondok Benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722110022'
  },
  {
    nik: '3603255402710001',
    bpjsNumber: '1054571229',
    fullName: 'Suprapti',
    birthDate: '1971-02-14',
    address: 'Perum.reni jaya Rt014/005',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211225544'
  },
  {
    nik: '3674065901260001',
    bpjsNumber: '2012789687',
    fullName: 'AzZahra caLLista',
    birthDate: '2026-01-19',
    address: 'Parakanan',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081399332211'
  },
  {
    nik: '3674044208160003',
    bpjsNumber: '2075100243',
    fullName: 'Fadeela nur nazeefah',
    birthDate: '2016-08-02',
    address: 'Gg satria parakan no.83 benda baru pamulang',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611220033'
  },
  {
    nik: '3674066106980003',
    bpjsNumber: '2752695584',
    fullName: 'ferro risky yuniar',
    birthDate: '1998-06-21',
    address: 'Jl swadaya Gg. Kembang Rt 02 Rw 05',
    gender: 'L',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081299881144'
  },
  {
    nik: '3302167006990002',
    bpjsNumber: '',
    fullName: 'Rizma Auliatuzzahroh',
    birthDate: '1999-06-30',
    address: 'Jalan satria rt 003 RW 009',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388772244'
  },
  {
    nik: '3674060703670005',
    bpjsNumber: '',
    fullName: 'SUGITO',
    birthDate: '1967-03-07',
    address: 'Rt001/009',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722113322'
  },
  {
    nik: '3674060811920001',
    bpjsNumber: '42779496',
    fullName: 'David Milanov',
    birthDate: '1992-11-08',
    address: 'Jl benda barat 10b blok d 22/14',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211330011'
  },
  {
    nik: '3604036308990329',
    bpjsNumber: '',
    fullName: 'Shifa Aulia putri',
    birthDate: '1999-08-23',
    address: 'Jl pondok Benda c18 no 5',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081399441122'
  },
  {
    nik: '3674064101100001',
    bpjsNumber: '',
    fullName: 'nayla hendriana putri',
    birthDate: '2010-01-01',
    address: 'jl.anggrek rt 03 rw 018 pondok benda pamulang tangsel',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611223300'
  },
  {
    nik: '3327124506860012',
    bpjsNumber: '2275249162',
    fullName: 'Fitroturrisqiyah',
    birthDate: '1986-06-05',
    address: 'Jl.tanah merah .RT/RW : 06/04',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081299882244'
  },
  {
    nik: '3674065710890008',
    bpjsNumber: '',
    fullName: 'ERNIH',
    birthDate: '1989-10-17',
    address: 'Jl.arjuna Parakan Pamulang',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081388771133'
  },
  {
    nik: '3674010912830006',
    bpjsNumber: '1464550918',
    fullName: 'Lukma hakim',
    birthDate: '1983-12-09',
    address: 'Kp pondok benda rt o1 05 buaran serpong',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722114455'
  },
  {
    nik: '3173022801810003',
    bpjsNumber: '2362386756',
    fullName: 'Supriyono',
    birthDate: '1981-01-28',
    address: 'Jalan H. Siman, 110, RT 04/RW 05, Pondok Benda, Pamulang',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211003322'
  },
  {
    nik: '3674066309070002',
    bpjsNumber: '',
    fullName: 'Mieke laurance rahmawati',
    birthDate: '2007-09-23',
    address: 'Jl salak 3',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081399223344'
  },
  {
    nik: '3174104305090002',
    bpjsNumber: '',
    fullName: 'Dizzie Amaris salima',
    birthDate: '2009-05-03',
    address: 'Pondok benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611332211'
  },
  {
    nik: '3674062603010007',
    bpjsNumber: '',
    fullName: 'Mochamad anshori',
    birthDate: '2001-03-26',
    address: 'Rt001/009',
    gender: 'L',
    lastPoli: 'Pengurusan BPJS (PBI/KIS)',
    phone: '081299883311'
  },
  {
    nik: '3604204309070001',
    bpjsNumber: '2519687643',
    fullName: 'Septiyani',
    birthDate: '2007-09-03',
    address: '006/004 Serua',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388771155'
  },
  {
    nik: '3207154510960002',
    bpjsNumber: '2363657747',
    fullName: 'Lia warliani',
    birthDate: '1996-10-05',
    address: 'Kp maruga',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722001133'
  },
  {
    nik: '3174055503670003',
    bpjsNumber: '1463237109',
    fullName: 'Ernawati',
    birthDate: '1967-03-15',
    address: '006/011 Pd.Pucung',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211334422'
  },
  {
    nik: '3203225707050002',
    bpjsNumber: '',
    fullName: 'Elisa',
    birthDate: '2005-07-17',
    address: 'Kp. Buniherang 003/004',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081399002233'
  },
  {
    nik: '3603126407950005',
    bpjsNumber: '3505469567',
    fullName: 'Nabila safitri',
    birthDate: '2000-01-24',
    address: 'Jln.Arjuna gg rambutan Rt.001/009 Parakan.',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '085611224433'
  },
  {
    nik: '3204141906200004',
    bpjsNumber: '',
    fullName: 'Muhammad Arslan al-fatih',
    birthDate: '2020-06-19',
    address: 'Jl alip gede no 44',
    gender: 'L',
    lastPoli: 'Gigi & Mulut',
    phone: '081299885522'
  },
  {
    nik: '3174074108710003',
    bpjsNumber: '1165311108',
    fullName: 'Tri Astuti',
    birthDate: '1971-08-01',
    address: 'Pondok benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388771166'
  },
  {
    nik: '3674065106920007',
    bpjsNumber: '',
    fullName: 'Rini nopitasari',
    birthDate: '1992-06-11',
    address: 'Kp. Parakan rt002 rw009',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '085722110044'
  },
  {
    nik: '3674064601780008',
    bpjsNumber: '2361001667',
    fullName: 'Deviana Januarita',
    birthDate: '1978-01-05',
    address: 'Kp Srikandi buaran RT 002 RW 004',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211003355'
  },
  {
    nik: '3329145012820007',
    bpjsNumber: '1083537966',
    fullName: 'Sri wahyuni',
    birthDate: '1982-12-10',
    address: 'Benda baru rt.001/009 kel.benda baru kec.pamulang',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081399221144'
  },
  {
    nik: '3674066712930018',
    bpjsNumber: '818818784',
    fullName: 'Irmalia',
    birthDate: '1993-12-27',
    address: 'Pamulang permai 2, jl benda barat 12 blok C 18 no 7a',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611332255'
  },
  {
    nik: '3174061602960001',
    bpjsNumber: '',
    fullName: 'Zaki Ramadhani',
    birthDate: '1996-02-16',
    address: '02/08 pondok benda',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081299881166'
  },
  {
    nik: '3206015610690002',
    bpjsNumber: '',
    fullName: 'Yati Suryati',
    birthDate: '1969-10-16',
    address: '05/00 Tirtonirmolo',
    gender: 'P',
    lastPoli: 'Gigi & Mulut',
    phone: '081388772255'
  },
  {
    nik: '3674016009800002',
    bpjsNumber: '',
    fullName: 'Nurhasanah',
    birthDate: '1980-09-20',
    address: '01/04 Lengkong gudang',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '085722001155'
  },
  {
    nik: '3329085206020005',
    bpjsNumber: '2801904333',
    fullName: 'Leni ayu wulandari',
    birthDate: '2002-06-12',
    address: 'Villa pamulang pondok benda rt 10/rw 17',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081211330022'
  },
  {
    nik: '3174054312740005',
    bpjsNumber: '1649321086',
    fullName: 'Sumiyati',
    birthDate: '1974-12-03',
    address: 'Jl.Praja Dalam G rt003/005',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081399003344'
  },
  {
    nik: '3174095205000006',
    bpjsNumber: '2338949924',
    fullName: 'Chika anggia widyadari',
    birthDate: '2000-05-12',
    address: 'Puri garden jalan ceri blok a2 benda baru, pamulang',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611223399'
  },
  {
    nik: '3674060307151012',
    bpjsNumber: '2364039314',
    fullName: 'Zidan alhafizd',
    birthDate: '2015-07-03',
    address: 'Jln siliwangi',
    gender: 'L',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081299881177'
  },
  {
    nik: '3674065409030003',
    bpjsNumber: '210199397',
    fullName: 'Sekar Nurazizah',
    birthDate: '2003-09-14',
    address: '004/003 Pd.Benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081388773344'
  },
  {
    nik: '3674064404050007',
    bpjsNumber: '',
    fullName: 'Frisilia margareta boru hutagalung',
    birthDate: '2005-04-04',
    address: 'Jl benda barat 6 pamulang ll pintu elok',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085722110055'
  },
  {
    nik: '3174016008670001',
    bpjsNumber: '1336404284',
    fullName: 'Ida kusmalawati',
    birthDate: '1967-08-20',
    address: 'Pondok benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211004466'
  },
  {
    nik: '3674066311980001',
    bpjsNumber: '',
    fullName: 'RAINIDA HIDAYATI',
    birthDate: '1998-11-23',
    address: 'reni jaya pamulang',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '081399331100'
  },
  {
    nik: '3674066204660005',
    bpjsNumber: '42908602',
    fullName: 'Suparni',
    birthDate: '1966-04-22',
    address: '002/009 Pd.Benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '085611220044'
  },
  {
    nik: '3674060407210001',
    bpjsNumber: '3094778171',
    fullName: 'Muhammad Haikal Alirsyam',
    birthDate: '2021-07-04',
    address: '002/009, Pondok Benda',
    gender: 'L',
    lastPoli: 'MTBS (anak usia 0-5 th)',
    phone: '081299882244'
  },
  {
    nik: '3329064601860002',
    bpjsNumber: '3004284857',
    fullName: 'UMI KULSUM',
    birthDate: '1986-01-06',
    address: 'TONJONG RAJAWETAN RT01 RW01',
    gender: 'P',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081388773355'
  },
  {
    nik: '3674065007960013',
    bpjsNumber: '1902559904',
    fullName: 'Martini',
    birthDate: '1996-07-10',
    address: 'Jl anggrek pondok benda rt 1 rw 18 no 6',
    gender: 'P',
    lastPoli: 'KIA (Imunisasi Anak & Kesehatan Ibu)',
    phone: '085722110066'
  },
  {
    nik: '3174105804790017',
    bpjsNumber: '2248161489',
    fullName: 'Crysant caysara',
    birthDate: '1979-04-18',
    address: '005/010 Pd.Benda',
    gender: 'P',
    lastPoli: 'Kesehatan Dewasa (Poli Umum)',
    phone: '081211005577'
  },
  {
    nik: '3674041401080005',
    bpjsNumber: '',
    fullName: 'Adli Arya Winata',
    birthDate: '2008-01-14',
    address: 'Kp Maruga rt/rw 05/04',
    gender: 'L',
    lastPoli: 'Surat Rujukan BPJS',
    phone: '081399004433'
  }
];

// Helper search function
export function searchPatientByNikOrBpjs(query: string): PatientRecord | undefined {
  if (!query) return undefined;
  const cleanQuery = query.trim().replace(/\D/g, '');
  if (!cleanQuery) return undefined;

  return PATIENT_DATABASE.find((p) => {
    const cleanNik = p.nik.replace(/\D/g, '');
    const cleanBpjs = (p.bpjsNumber || '').replace(/\D/g, '');
    
    return cleanNik === cleanQuery || (cleanBpjs && cleanBpjs === cleanQuery);
  });
}
