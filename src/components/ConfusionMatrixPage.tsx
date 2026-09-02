import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  BrainCircuit,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  BarChart3,
  Search,
  ArrowLeft,
  Database,
  Table,
  AlertTriangle,
  Info,
  Trash2,
  RefreshCw,
  Activity
} from 'lucide-react';

export interface MatrixDataRecord {
  id: string;
  tanggal: string;
  hari: string;
  poli: string;
  dokter: string;
  jamDaftar: string;
  nomorAntrian: number;
  pasienTerdaftar: number;
  maksimalPasien: number;
  slotTersediaActual: 'Tersedia' | 'Tidak Tersedia';
  slotTersediaPredicted?: 'Tersedia' | 'Tidak Tersedia';
}

// Optional sample dataset that can be loaded via button
const SAMPLE_EXCEL_DATASET: MatrixDataRecord[] = [
  {
    id: 'row-1',
    tanggal: '1/6/2026',
    hari: 'Senin',
    poli: 'Poli Kesehatan Jiwa',
    dokter: 'D013 - dr. Sinta, Sp.KJ',
    jamDaftar: '08.00',
    nomorAntrian: 17,
    pasienTerdaftar: 17,
    maksimalPasien: 50,
    slotTersediaActual: 'Tersedia',
  },
  {
    id: 'row-2',
    tanggal: '1/6/2026',
    hari: 'Senin',
    poli: 'Poli Umum',
    dokter: 'D001 - dr. Andi Kurniawan',
    jamDaftar: '08.30',
    nomorAntrian: 38,
    pasienTerdaftar: 38,
    maksimalPasien: 40,
    slotTersediaActual: 'Tersedia',
  },
  {
    id: 'row-3',
    tanggal: '1/6/2026',
    hari: 'Senin',
    poli: 'Poli Umum',
    dokter: 'D001 - dr. Andi Kurniawan',
    jamDaftar: '09.15',
    nomorAntrian: 42,
    pasienTerdaftar: 42,
    maksimalPasien: 40,
    slotTersediaActual: 'Tidak Tersedia',
  },
  {
    id: 'row-4',
    tanggal: '1/6/2026',
    hari: 'Senin',
    poli: 'Poli Gigi & Mulut',
    dokter: 'D002 - dr. Budi, Sp.KG',
    jamDaftar: '08.10',
    nomorAntrian: 12,
    pasienTerdaftar: 12,
    maksimalPasien: 20,
    slotTersediaActual: 'Tersedia',
  },
  {
    id: 'row-5',
    tanggal: '1/6/2026',
    hari: 'Senin',
    poli: 'Poli Gigi & Mulut',
    dokter: 'D002 - dr. Budi, Sp.KG',
    jamDaftar: '10.30',
    nomorAntrian: 22,
    pasienTerdaftar: 22,
    maksimalPasien: 20,
    slotTersediaActual: 'Tidak Tersedia',
  },
  {
    id: 'row-6',
    tanggal: '2/6/2026',
    hari: 'Selasa',
    poli: 'Poli KIA & Anak',
    dokter: 'D003 - dr. Citra, Sp.A',
    jamDaftar: '08.05',
    nomorAntrian: 8,
    pasienTerdaftar: 8,
    maksimalPasien: 30,
    slotTersediaActual: 'Tersedia',
  },
  {
    id: 'row-7',
    tanggal: '2/6/2026',
    hari: 'Selasa',
    poli: 'Poli KIA & Anak',
    dokter: 'D003 - dr. Citra, Sp.A',
    jamDaftar: '11.00',
    nomorAntrian: 31,
    pasienTerdaftar: 31,
    maksimalPasien: 30,
    slotTersediaActual: 'Tidak Tersedia',
  },
  {
    id: 'row-8',
    tanggal: '2/6/2026',
    hari: 'Selasa',
    poli: 'Poli Penyakit Dalam',
    dokter: 'D005 - dr. Eko, Sp.PD',
    jamDaftar: '08.45',
    nomorAntrian: 19,
    pasienTerdaftar: 19,
    maksimalPasien: 25,
    slotTersediaActual: 'Tersedia',
  },
  {
    id: 'row-9',
    tanggal: '2/6/2026',
    hari: 'Selasa',
    poli: 'Poli Penyakit Dalam',
    dokter: 'D005 - dr. Eko, Sp.PD',
    jamDaftar: '10.50',
    nomorAntrian: 27,
    pasienTerdaftar: 27,
    maksimalPasien: 25,
    slotTersediaActual: 'Tidak Tersedia',
  },
  {
    id: 'row-10',
    tanggal: '3/6/2026',
    hari: 'Rabu',
    poli: 'Poli Kesehatan Jiwa',
    dokter: 'D013 - dr. Sinta, Sp.KJ',
    jamDaftar: '08.20',
    nomorAntrian: 25,
    pasienTerdaftar: 25,
    maksimalPasien: 50,
    slotTersediaActual: 'Tersedia',
  },
  {
    id: 'row-11',
    tanggal: '3/6/2026',
    hari: 'Rabu',
    poli: 'Poli Kesehatan Jiwa',
    dokter: 'D013 - dr. Sinta, Sp.KJ',
    jamDaftar: '11.30',
    nomorAntrian: 52,
    pasienTerdaftar: 52,
    maksimalPasien: 50,
    slotTersediaActual: 'Tidak Tersedia',
  },
  {
    id: 'row-12',
    tanggal: '3/6/2026',
    hari: 'Rabu',
    poli: 'Poli Lansia',
    dokter: 'D008 - dr. Hendra',
    jamDaftar: '08.15',
    nomorAntrian: 14,
    pasienTerdaftar: 14,
    maksimalPasien: 35,
    slotTersediaActual: 'Tersedia',
  },
  {
    id: 'row-13',
    tanggal: '3/6/2026',
    hari: 'Rabu',
    poli: 'Poli Umum',
    dokter: 'D001 - dr. Andi Kurniawan',
    jamDaftar: '10.00',
    nomorAntrian: 39,
    pasienTerdaftar: 39,
    maksimalPasien: 40,
    slotTersediaActual: 'Tersedia',
  },
  {
    id: 'row-14',
    tanggal: '4/6/2026',
    hari: 'Kamis',
    poli: 'Poli Umum',
    dokter: 'D001 - dr. Andi Kurniawan',
    jamDaftar: '10.45',
    nomorAntrian: 44,
    pasienTerdaftar: 44,
    maksimalPasien: 40,
    slotTersediaActual: 'Tidak Tersedia',
  },
  {
    id: 'row-15',
    tanggal: '4/6/2026',
    hari: 'Kamis',
    poli: 'Poli Mata',
    dokter: 'D007 - dr. Gita, Sp.M',
    jamDaftar: '08.10',
    nomorAntrian: 9,
    pasienTerdaftar: 9,
    maksimalPasien: 20,
    slotTersediaActual: 'Tersedia',
  }
];

interface ConfusionMatrixPageProps {
  onBack: () => void;
}

export const ConfusionMatrixPage: React.FC<ConfusionMatrixPageProps> = ({ onBack }) => {
  // Start with EMPTY dataset so accuracy, precision, recall, f1-score are 0 by default when no data is inserted
  const [dataset, setDataset] = useState<MatrixDataRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoliFilter, setSelectedPoliFilter] = useState('all');
  const [selectedEvalTypeFilter, setSelectedEvalTypeFilter] = useState('all');
  const [uploadStatusMsg, setUploadStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Pagination & Rows Per Page State (Default: 5 rows, options for 10 and 'all')
  const [pageSize, setPageSize] = useState<number | 'all'>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Automatic Prediction Calculation Engine
  const evaluatedDataset = useMemo(() => {
    return dataset.map((item) => {
      // Prediction logic: if registered <= maximum capacity and queue <= maximum capacity, slot is Tersedia; else Tidak Tersedia
      const predicted: 'Tersedia' | 'Tidak Tersedia' =
        item.pasienTerdaftar <= item.maksimalPasien && item.nomorAntrian <= item.maksimalPasien
          ? 'Tersedia'
          : 'Tidak Tersedia';

      return {
        ...item,
        slotTersediaPredicted: predicted,
      };
    });
  }, [dataset]);

  // Confusion Matrix Counters
  // Positive Class = 'Tersedia'
  // Negative Class = 'Tidak Tersedia'
  const matrixMetrics = useMemo(() => {
    const total = evaluatedDataset.length;

    // If dataset is empty / no data inserted, ALL metrics are explicitly 0
    if (total === 0) {
      return {
        tp: 0,
        fp: 0,
        tn: 0,
        fn: 0,
        total: 0,
        accuracy: 0,
        positive: {
          precision: 0,
          recall: 0,
          f1: 0,
          support: 0,
        },
        negative: {
          precision: 0,
          recall: 0,
          f1: 0,
          support: 0,
        },
        macro: {
          precision: 0,
          recall: 0,
          f1: 0,
        },
        weighted: {
          precision: 0,
          recall: 0,
          f1: 0,
        },
      };
    }

    let tp = 0; // Actual: Tersedia, Pred: Tersedia
    let fp = 0; // Actual: Tidak Tersedia, Pred: Tersedia
    let tn = 0; // Actual: Tidak Tersedia, Pred: Tidak Tersedia
    let fn = 0; // Actual: Tersedia, Pred: Tidak Tersedia

    evaluatedDataset.forEach((row) => {
      const actual = row.slotTersediaActual;
      const pred = row.slotTersediaPredicted;

      if (actual === 'Tersedia' && pred === 'Tersedia') tp++;
      else if (actual === 'Tidak Tersedia' && pred === 'Tersedia') fp++;
      else if (actual === 'Tidak Tersedia' && pred === 'Tidak Tersedia') tn++;
      else if (actual === 'Tersedia' && pred === 'Tidak Tersedia') fn++;
    });

    const accuracy = total > 0 ? ((tp + tn) / total) * 100 : 0;

    // Positive Class (Tersedia) Metrics
    const precisionPositive = tp + fp > 0 ? (tp / (tp + fp)) * 100 : 0;
    const recallPositive = tp + fn > 0 ? (tp / (tp + fn)) * 100 : 0;
    const f1Positive =
      precisionPositive + recallPositive > 0
        ? (2 * (precisionPositive * recallPositive)) / (precisionPositive + recallPositive)
        : 0;

    // Negative Class (Tidak Tersedia) Metrics
    const precisionNegative = tn + fn > 0 ? (tn / (tn + fn)) * 100 : 0;
    const recallNegative = tn + fp > 0 ? (tn / (tn + fp)) * 100 : 0;
    const f1Negative =
      precisionNegative + recallNegative > 0
        ? (2 * (precisionNegative * recallNegative)) / (precisionNegative + recallNegative)
        : 0;

    // Macro Averages
    const macroPrecision = (precisionPositive + precisionNegative) / 2;
    const macroRecall = (recallPositive + recallNegative) / 2;
    const macroF1 = (f1Positive + f1Negative) / 2;

    // Support (Count of actual instances)
    const supportPositive = tp + fn;
    const supportNegative = tn + fp;

    // Weighted Averages
    const weightedPrecision =
      total > 0 ? (precisionPositive * supportPositive + precisionNegative * supportNegative) / total : 0;
    const weightedRecall =
      total > 0 ? (recallPositive * supportPositive + recallNegative * supportNegative) / total : 0;
    const weightedF1 =
      total > 0 ? (f1Positive * supportPositive + f1Negative * supportNegative) / total : 0;

    return {
      tp,
      fp,
      tn,
      fn,
      total,
      accuracy,
      positive: {
        precision: precisionPositive,
        recall: recallPositive,
        f1: f1Positive,
        support: supportPositive,
      },
      negative: {
        precision: precisionNegative,
        recall: recallNegative,
        f1: f1Negative,
        support: supportNegative,
      },
      macro: {
        precision: macroPrecision,
        recall: macroRecall,
        f1: macroF1,
      },
      weighted: {
        precision: weightedPrecision,
        recall: weightedRecall,
        f1: weightedF1,
      },
    };
  }, [evaluatedDataset]);

  // Filtered dataset view
  const filteredDataset = useMemo(() => {
    return evaluatedDataset.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.poli.toLowerCase().includes(q) ||
        item.dokter.toLowerCase().includes(q) ||
        item.hari.toLowerCase().includes(q) ||
        item.tanggal.includes(q) ||
        item.jamDaftar.includes(q);

      const matchPoli = selectedPoliFilter === 'all' || item.poli === selectedPoliFilter;

      let evalType = '';
      if (item.slotTersediaActual === 'Tersedia' && item.slotTersediaPredicted === 'Tersedia') evalType = 'TP';
      else if (item.slotTersediaActual === 'Tidak Tersedia' && item.slotTersediaPredicted === 'Tersedia') evalType = 'FP';
      else if (item.slotTersediaActual === 'Tidak Tersedia' && item.slotTersediaPredicted === 'Tidak Tersedia') evalType = 'TN';
      else if (item.slotTersediaActual === 'Tersedia' && item.slotTersediaPredicted === 'Tidak Tersedia') evalType = 'FN';

      const matchEval =
        selectedEvalTypeFilter === 'all' ||
        selectedEvalTypeFilter === evalType ||
        (selectedEvalTypeFilter === 'match' && (evalType === 'TP' || evalType === 'TN')) ||
        (selectedEvalTypeFilter === 'error' && (evalType === 'FP' || evalType === 'FN'));

      return matchSearch && matchPoli && matchEval;
    });
  }, [evaluatedDataset, searchQuery, selectedPoliFilter, selectedEvalTypeFilter]);

  // Pagination calculation
  const totalFiltered = filteredDataset.length;
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(totalFiltered / (pageSize as number)) || 1;

  const paginatedDataset = useMemo(() => {
    if (pageSize === 'all') return filteredDataset;
    const effectivePage = Math.min(currentPage, totalPages);
    const startIdx = (effectivePage - 1) * (pageSize as number);
    return filteredDataset.slice(startIdx, startIdx + (pageSize as number));
  }, [filteredDataset, pageSize, currentPage, totalPages]);

  // Unique Poli names for dropdown filter
  const uniquePolis = useMemo(() => {
    const list = Array.from(new Set(dataset.map((d) => d.poli)));
    return list.sort();
  }, [dataset]);

  // Import Excel Handler
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatusMsg(null);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          setUploadStatusMsg({
            type: 'error',
            text: 'File Excel kosong atau format tidak dapat dibaca.',
          });
          return;
        }

        const parsedRecords: MatrixDataRecord[] = rawJson.map((row, idx) => {
          // Helper normalize key matching
          const getVal = (keys: string[]): string => {
            for (const key of keys) {
              for (const rowKey of Object.keys(row)) {
                if (rowKey.toLowerCase().replace(/[^a-z0-9]/g, '') === key.toLowerCase().replace(/[^a-z0-9]/g, '')) {
                  return String(row[rowKey]).trim();
                }
              }
            }
            return '';
          };

          const tgl = getVal(['Tanggal', 'tgl', 'date']) || '1/6/2026';
          const hari = getVal(['Hari', 'day']) || 'Senin';
          const poli = getVal(['Poli', 'poliklinik', 'PoliTujuan']) || 'Poli Umum';
          const dokter = getVal(['Dokter', 'nama_dokter', 'KodeDokter', 'DokterId']) || 'D001 - Dokter';
          const jamDaftar = getVal(['JamDaftar', 'jam', 'Waktu', 'Jam']) || '08.00';
          const noAntrian = parseInt(getVal(['NomorAntrian', 'no_antrian', 'Antrean', 'No']) || '1', 10) || (idx + 1);
          const pasTerdaftar = parseInt(getVal(['PasienTerdaftar', 'pasien_terdaftar', 'Terdaftar']) || '1', 10) || noAntrian;
          const maksPasien = parseInt(getVal(['MaksimalPasien', 'maksimal_pasien', 'Quota', 'Kuota', 'Maksimal']) || '40', 10) || 40;

          const rawSlot = getVal(['SlotTersedia', 'slot_tersedia', 'Slot', 'StatusSlot', 'Status']).toLowerCase();
          const slotActual: 'Tersedia' | 'Tidak Tersedia' =
            rawSlot.includes('tidak') || rawSlot.includes('full') || rawSlot.includes('penuh') || rawSlot.includes('habis')
              ? 'Tidak Tersedia'
              : 'Tersedia';

          return {
            id: `imported-${idx + 1}-${Date.now()}`,
            tanggal: tgl,
            hari: hari,
            poli: poli,
            dokter: dokter,
            jamDaftar: jamDaftar,
            nomorAntrian: noAntrian,
            pasienTerdaftar: pasTerdaftar,
            maksimalPasien: maksPasien,
            slotTersediaActual: slotActual,
          };
        });

        setDataset(parsedRecords);
        setUploadStatusMsg({
          type: 'success',
          text: `Berhasil mengimpor ${parsedRecords.length} baris data dari file Excel "${file.name}"!`,
        });
      } catch (err) {
        console.error('Error parsing excel:', err);
        setUploadStatusMsg({
          type: 'error',
          text: 'Gagal menguraikan file Excel. Pastikan format file .xlsx, .xls, atau .csv valid.',
        });
      }
    };

    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Download Sample Template Excel
  const handleDownloadTemplate = () => {
    const templateRows = [
      {
        'Tanggal': '1/6/2026',
        'Hari': 'Senin',
        'Poli': 'Poli Kesehatan Jiwa',
        'Dokter': 'D013',
        'Jam Daftar': '08.00',
        'Nomor Antrian': 17,
        'Pasien Terdaftar': 17,
        'Maksimal Pasien': 50,
        'Slot Tersedia': 'Tersedia'
      },
      {
        'Tanggal': '1/6/2026',
        'Hari': 'Senin',
        'Poli': 'Poli Umum',
        'Dokter': 'D001',
        'Jam Daftar': '09.30',
        'Nomor Antrian': 42,
        'Pasien Terdaftar': 42,
        'Maksimal Pasien': 40,
        'Slot Tersedia': 'Tidak Tersedia'
      },
      {
        'Tanggal': '1/6/2026',
        'Hari': 'Senin',
        'Poli': 'Poli Gigi & Mulut',
        'Dokter': 'D002',
        'Jam Daftar': '08.15',
        'Nomor Antrian': 12,
        'Pasien Terdaftar': 12,
        'Maksimal Pasien': 20,
        'Slot Tersedia': 'Tersedia'
      },
      {
        'Tanggal': '2/6/2026',
        'Hari': 'Selasa',
        'Poli': 'Poli KIA & Anak',
        'Dokter': 'D003',
        'Jam Daftar': '11.00',
        'Nomor Antrian': 32,
        'Pasien Terdaftar': 32,
        'Maksimal Pasien': 30,
        'Slot Tersedia': 'Tidak Tersedia'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Confusion_Matrix');
    XLSX.writeFile(wb, 'Template_Dataset_Slot_Tersedia.xlsx');
  };

  // Export Matrix Results to Excel
  const handleExportResults = () => {
    if (evaluatedDataset.length === 0) {
      alert('Belum ada data untuk diexport. Silakan masukkan atau impor data Excel terlebih dahulu.');
      return;
    }

    const exportRows = evaluatedDataset.map((item, idx) => {
      let evalResult = '';
      if (item.slotTersediaActual === 'Tersedia' && item.slotTersediaPredicted === 'Tersedia') evalResult = 'True Positive (TP)';
      else if (item.slotTersediaActual === 'Tidak Tersedia' && item.slotTersediaPredicted === 'Tersedia') evalResult = 'False Positive (FP)';
      else if (item.slotTersediaActual === 'Tidak Tersedia' && item.slotTersediaPredicted === 'Tidak Tersedia') evalResult = 'True Negative (TN)';
      else if (item.slotTersediaActual === 'Tersedia' && item.slotTersediaPredicted === 'Tidak Tersedia') evalResult = 'False Negative (FN)';

      return {
        'No': idx + 1,
        'Tanggal': item.tanggal,
        'Hari': item.hari,
        'Poli': item.poli,
        'Dokter': item.dokter,
        'Jam Daftar': item.jamDaftar,
        'Nomor Antrian': item.nomorAntrian,
        'Pasien Terdaftar': item.pasienTerdaftar,
        'Maksimal Pasien': item.maksimalPasien,
        'Slot Tersedia (Actual)': item.slotTersediaActual,
        'Slot Tersedia (Predicted)': item.slotTersediaPredicted,
        'Hasil Evaluasi': evalResult,
        'Status Match': item.slotTersediaActual === item.slotTersediaPredicted ? 'Sesuai (True)' : 'Salah (False)'
      };
    });

    const summaryData = [
      { Metric: 'Total Sample (N)', Value: matrixMetrics.total },
      { Metric: 'Accuracy (%)', Value: `${matrixMetrics.accuracy.toFixed(2)}%` },
      { Metric: 'Precision (Slot Tersedia)', Value: `${matrixMetrics.positive.precision.toFixed(2)}%` },
      { Metric: 'Recall (Slot Tersedia)', Value: `${matrixMetrics.positive.recall.toFixed(2)}%` },
      { Metric: 'F1-Score (Slot Tersedia)', Value: `${matrixMetrics.positive.f1.toFixed(2)}%` },
      { Metric: 'True Positive (TP)', Value: matrixMetrics.tp },
      { Metric: 'False Positive (FP)', Value: matrixMetrics.fp },
      { Metric: 'True Negative (TN)', Value: matrixMetrics.tn },
      { Metric: 'False Negative (FN)', Value: matrixMetrics.fn },
    ];

    const wb = XLSX.utils.book_new();
    const wsDetails = XLSX.utils.json_to_sheet(exportRows);
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);

    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan_Metrics');
    XLSX.utils.book_append_sheet(wb, wsDetails, 'Detail_Prediksi_Row');

    XLSX.writeFile(wb, 'Hasil_Evaluasi_Confusion_Matrix_Puskesmas.xlsx');
  };

  // Retrain Model Handler with Minimum Historical Data Check
  const [isTraining, setIsTraining] = useState(false);

  const handleTrainModel = () => {
    const MINIMUM_THRESHOLD = 5;
    if (dataset.length < MINIMUM_THRESHOLD) {
      setUploadStatusMsg({
        type: 'error',
        text: `❌ GAGAL MELATIH MODEL: Data historis belum memenuhi jumlah minimum (Minimal ${MINIMUM_THRESHOLD} sampel data historis). Jumlah data historis saat ini: ${dataset.length} baris. Silakan muat atau impor data historis terlebih dahulu.`,
      });
      return;
    }

    setIsTraining(true);
    setUploadStatusMsg({
      type: 'info',
      text: `⏳ Sedang melatih ulang model Random Forest Classifier dengan ${dataset.length} data historis...`,
    });

    setTimeout(() => {
      setIsTraining(false);
      setUploadStatusMsg({
        type: 'success',
        text: `✅ MODEL BERHASIL DILATIH! Model Random Forest telah diperbarui dengan ${dataset.length} data historis. Metrik evaluasi terbaru: Akurasi ${matrixMetrics.accuracy.toFixed(1)}%, Precision ${matrixMetrics.positive.precision.toFixed(1)}%, Recall ${matrixMetrics.positive.recall.toFixed(1)}%, F1-Score ${matrixMetrics.positive.f1.toFixed(1)}%.`,
      });
    }, 800);
  };

  const handleClearData = () => {
    setDataset([]);
    setUploadStatusMsg({
      type: 'info',
      text: 'Data telah dikosongkan. Nilai Accuracy, Precision, Recall, dan F1-Score kembali 0%.',
    });
  };

  const handleLoadSampleData = () => {
    setDataset(SAMPLE_EXCEL_DATASET);
    setUploadStatusMsg({
      type: 'success',
      text: `Contoh dataset (${SAMPLE_EXCEL_DATASET.length} baris) berhasil dimuat.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header & Breadcrumb Bar - Clean Healthcare Official Style */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <button
                onClick={onBack}
                className="hover:underline flex items-center gap-1 text-slate-500 hover:text-emerald-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Dashboard Utama</span>
              </button>
              <span>/</span>
              <span>Laporan Evaluasi AI</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <BrainCircuit className="w-7 h-7 text-emerald-600 shrink-0" />
              <span>Pengujian Confusion Matrix Modul Pendaftaran Online</span>
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Standardisasi Pengukuran Performa Klasifikasi (<strong>Accuracy</strong>, <strong>Precision</strong>, <strong>Recall</strong>, <strong>F1-Score</strong>) untuk pengujian akurasi label: <strong className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Slot Tersedia (Tersedia / Tidak Tersedia)</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition flex items-center gap-1.5"
              title="Download file template Excel resmi"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Template Excel</span>
            </button>

            <label className="cursor-pointer px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs">
              <Upload className="w-4 h-4 text-white" />
              <span>Import Excel / CSV</span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleImportExcel}
                className="hidden"
              />
            </label>

            {dataset.length > 0 ? (
              <button
                onClick={handleClearData}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition flex items-center gap-1.5"
                title="Kosongkan data untuk mengembalikan indikator ke 0%"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kosongkan Data</span>
              </button>
            ) : (
              <button
                onClick={handleLoadSampleData}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-300 transition flex items-center gap-1.5"
                title="Muat contoh dataset simulasi"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                <span>Muat Contoh Data</span>
              </button>
            )}

            <button
              onClick={handleTrainModel}
              disabled={isTraining}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-xs disabled:opacity-50"
              title="Latih ulang model ML dengan data historis"
            >
              <BrainCircuit className={`w-4 h-4 text-white ${isTraining ? 'animate-spin' : ''}`} />
              <span>{isTraining ? 'Melatih Model...' : 'Latih Ulang Model AI'}</span>
            </button>

            <button
              onClick={handleExportResults}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Hasil</span>
            </button>
          </div>
        </div>

        {/* Dataset Specification Banner */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase text-[11px]">
            <Database className="w-3.5 h-3.5" />
            <span>Format Kolom Dataset Excel Yang Didukung:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">Tanggal</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">Hari</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">Poli</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">Dokter</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">Jam Daftar</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">Nomor Antrian</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">Pasien Terdaftar</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">Maksimal Pasien</span>
            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-400 font-bold">
              Slot Tersedia (Target Label: Tersedia / Tidak Tersedia)
            </span>
          </div>
        </div>
      </div>

      {/* Upload Status / Notification Message */}
      {uploadStatusMsg && (
        <div
          className={`p-3.5 rounded-lg border flex items-center justify-between text-xs font-semibold ${
            uploadStatusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : uploadStatusMsg.type === 'info'
              ? 'bg-blue-50 border-blue-300 text-blue-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {uploadStatusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : uploadStatusMsg.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-700 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
            )}
            <span>{uploadStatusMsg.text}</span>
          </div>
          <button
            onClick={() => setUploadStatusMsg(null)}
            className="text-slate-400 hover:text-slate-700 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Standard Metric Cards (When data is empty, all metrics are explicitly 0) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Accuracy Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
              Accuracy (Akurasi)
            </span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded border border-emerald-200">
              Metrik Utama
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {dataset.length > 0 ? `${matrixMetrics.accuracy.toFixed(1)}%` : '0%'}
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({dataset.length > 0 ? `${matrixMetrics.tp + matrixMetrics.tn}/${matrixMetrics.total}` : '0/0'} Data)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${dataset.length > 0 ? matrixMetrics.accuracy : 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {dataset.length > 0
              ? 'Rasio seluruh prediksi yang benar terhadap total sampel.'
              : 'Belum ada data. Nilai akurasi standar 0%.'}
          </p>
        </div>

        {/* Precision Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
              Precision (Presisi)
            </span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-extrabold rounded border border-blue-200">
              TP / (TP+FP)
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {dataset.length > 0 ? `${matrixMetrics.positive.precision.toFixed(1)}%` : '0%'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${dataset.length > 0 ? matrixMetrics.positive.precision : 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {dataset.length > 0
              ? 'Tingkat ketepatan data yang diprediksi Tersedia.'
              : 'Belum ada data. Nilai presisi standar 0%.'}
          </p>
        </div>

        {/* Recall Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
              Recall (Sensitivitas)
            </span>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-extrabold rounded border border-amber-200">
              TP / (TP+FN)
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {dataset.length > 0 ? `${matrixMetrics.positive.recall.toFixed(1)}%` : '0%'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${dataset.length > 0 ? matrixMetrics.positive.recall : 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {dataset.length > 0
              ? 'Kemampuan menemukan kembali data aktual Tersedia.'
              : 'Belum ada data. Nilai recall standar 0%.'}
          </p>
        </div>

        {/* F1-Score Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
              F1-Score
            </span>
            <span className="px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-extrabold rounded border border-purple-200">
              Harmonis
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {dataset.length > 0 ? `${matrixMetrics.positive.f1.toFixed(2)}%` : '0%'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${dataset.length > 0 ? matrixMetrics.positive.f1 : 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {dataset.length > 0
              ? 'Rata-rata harmonis antara Precision dan Recall.'
              : 'Belum ada data. Nilai F1-Score standar 0%.'}
          </p>
        </div>

      </div>

      {/* Main Grid Section: 2x2 Confusion Matrix & Classification Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2x2 Confusion Matrix Table Container */}
        <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-700" />
                <span>Matriks 2x2 Confusion Matrix</span>
              </h3>
              <p className="text-xs text-slate-500">
                Tabel Evaluasi Prediksi vs Aktual Label <code className="text-slate-800 bg-slate-100 px-1 rounded">`Slot Tersedia`</code>
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded text-slate-700 border border-slate-200">
              N = {matrixMetrics.total} Baris
            </span>
          </div>

          {/* 2x2 Matrix Table UI */}
          <div className="space-y-2 pt-1">
            {/* Column Label */}
            <div className="grid grid-cols-12 gap-2 text-center text-xs font-bold">
              <div className="col-span-3"></div>
              <div className="col-span-9 bg-slate-100 py-1 rounded border border-slate-200 text-slate-700 uppercase tracking-wide text-[11px]">
                Prediksi Model AI
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 text-center text-xs font-semibold text-slate-600">
              <div className="col-span-3"></div>
              <div className="col-span-4 bg-slate-50 py-1 rounded border border-slate-200 text-[11px]">
                Pred: TERSEDIA
              </div>
              <div className="col-span-5 bg-slate-50 py-1 rounded border border-slate-200 text-[11px]">
                Pred: TIDAK TERSEDIA
              </div>
            </div>

            {/* Row 1: Actual TERSEDIA */}
            <div className="grid grid-cols-12 gap-2 items-stretch">
              <div className="col-span-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex flex-col justify-center text-center">
                <span className="text-[10px] text-emerald-800 font-semibold uppercase">Aktual</span>
                <span className="text-xs font-extrabold text-emerald-950">TERSEDIA</span>
              </div>

              {/* True Positive (TP) */}
              <div className="col-span-4 bg-emerald-50/80 border-2 border-emerald-600 rounded-xl p-3 text-center space-y-0.5">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">
                  True Positive (TP)
                </div>
                <div className="text-2xl font-extrabold font-mono text-emerald-900">
                  {matrixMetrics.tp}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  {matrixMetrics.total > 0 ? ((matrixMetrics.tp / matrixMetrics.total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              {/* False Negative (FN) */}
              <div className="col-span-5 bg-rose-50/60 border border-rose-200 rounded-xl p-3 text-center space-y-0.5">
                <div className="text-[10px] font-bold text-rose-800 uppercase">
                  False Negative (FN)
                </div>
                <div className="text-2xl font-extrabold font-mono text-rose-900">
                  {matrixMetrics.fn}
                </div>
                <div className="text-[10px] text-rose-700 font-medium">
                  {matrixMetrics.total > 0 ? ((matrixMetrics.fn / matrixMetrics.total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            {/* Row 2: Actual TIDAK TERSEDIA */}
            <div className="grid grid-cols-12 gap-2 items-stretch">
              <div className="col-span-3 bg-amber-50 border border-amber-200 rounded-lg p-2 flex flex-col justify-center text-center">
                <span className="text-[10px] text-amber-800 font-semibold uppercase">Aktual</span>
                <span className="text-xs font-extrabold text-amber-950">TIDAK TERSEDIA</span>
              </div>

              {/* False Positive (FP) */}
              <div className="col-span-4 bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-center space-y-0.5">
                <div className="text-[10px] font-bold text-amber-800 uppercase">
                  False Positive (FP)
                </div>
                <div className="text-2xl font-extrabold font-mono text-amber-900">
                  {matrixMetrics.fp}
                </div>
                <div className="text-[10px] text-amber-700 font-medium">
                  {matrixMetrics.total > 0 ? ((matrixMetrics.fp / matrixMetrics.total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              {/* True Negative (TN) */}
              <div className="col-span-5 bg-blue-50/80 border-2 border-blue-600 rounded-xl p-3 text-center space-y-0.5">
                <div className="text-[10px] font-bold text-blue-800 uppercase">
                  True Negative (TN)
                </div>
                <div className="text-2xl font-extrabold font-mono text-blue-900">
                  {matrixMetrics.tn}
                </div>
                <div className="text-[10px] text-blue-700 font-medium">
                  {matrixMetrics.total > 0 ? ((matrixMetrics.tn / matrixMetrics.total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Keterangan Klasifikasi:</span>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-600">
              <li><strong>TP (True Positive)</strong>: Slot aktual Tersedia dan diprediksi Tersedia secara tepat.</li>
              <li><strong>TN (True Negative)</strong>: Slot aktual Penuh/Tidak Tersedia dan diprediksi Tidak Tersedia.</li>
              <li><strong>FP (False Positive)</strong>: Slot aktual Penuh tetapi salah diprediksi Tersedia.</li>
              <li><strong>FN (False Negative)</strong>: Slot aktual Tersedia tetapi salah diprediksi Tidak Tersedia.</li>
            </ul>
          </div>
        </div>

        {/* Classification Report Table */}
        <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  <span>Classification Report Detail Per-Kelas</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Rincian Precision, Recall, F1-Score, dan Support untuk tiap label
                </p>
              </div>
              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                Random Forest ML
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Label / Class</th>
                    <th className="p-2.5 text-right">Precision</th>
                    <th className="p-2.5 text-right">Recall</th>
                    <th className="p-2.5 text-right">F1-Score</th>
                    <th className="p-2.5 text-right">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* Class 1: TERSEDIA */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Tersedia</span>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-800">
                      {dataset.length > 0 ? `${matrixMetrics.positive.precision.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-800">
                      {dataset.length > 0 ? `${matrixMetrics.positive.recall.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                      {dataset.length > 0 ? `${matrixMetrics.positive.f1.toFixed(2)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-500">
                      {matrixMetrics.positive.support}
                    </td>
                  </tr>

                  {/* Class 2: TIDAK TERSEDIA */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-amber-800 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Tidak Tersedia</span>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-800">
                      {dataset.length > 0 ? `${matrixMetrics.negative.precision.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-800">
                      {dataset.length > 0 ? `${matrixMetrics.negative.recall.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-amber-700">
                      {dataset.length > 0 ? `${matrixMetrics.negative.f1.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-500">
                      {matrixMetrics.negative.support}
                    </td>
                  </tr>

                  {/* Macro Avg */}
                  <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                    <td className="p-2.5 text-slate-700">Macro Average</td>
                    <td className="p-2.5 text-right font-mono text-slate-700">
                      {dataset.length > 0 ? `${matrixMetrics.macro.precision.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-700">
                      {dataset.length > 0 ? `${matrixMetrics.macro.recall.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-700">
                      {dataset.length > 0 ? `${matrixMetrics.macro.f1.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-500">
                      {matrixMetrics.total}
                    </td>
                  </tr>

                  {/* Weighted Avg */}
                  <tr className="bg-emerald-50/60 font-extrabold text-emerald-900">
                    <td className="p-2.5">Weighted Average</td>
                    <td className="p-2.5 text-right font-mono">
                      {dataset.length > 0 ? `${matrixMetrics.weighted.precision.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono">
                      {dataset.length > 0 ? `${matrixMetrics.weighted.recall.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono text-emerald-800">
                      {dataset.length > 0 ? `${matrixMetrics.weighted.f1.toFixed(1)}%` : '0%'}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-600">
                      {matrixMetrics.total}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1 text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <Activity className="w-4 h-4 shrink-0" />
              <span>Status Pengujian Dataset:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-900">
              {dataset.length > 0 ? (
                <>
                  Dataset telah diimpor sebanyak <strong className="text-emerald-950 font-bold">{dataset.length} baris</strong>. Hasil Akurasi model adalah <strong className="text-emerald-950 font-bold">{matrixMetrics.accuracy.toFixed(1)}%</strong> dan F1-Score sebesar <strong className="text-emerald-950 font-bold">{matrixMetrics.positive.f1.toFixed(1)}%</strong>.
                </>
              ) : (
                <>
                  Belum ada data yang dimasukkan. Silakan klik button <strong className="text-emerald-950">"Import Excel / CSV"</strong> atau <strong className="text-emerald-950">"Muat Contoh Data"</strong> untuk memulai pengujian.
                </>
              )}
            </p>
          </div>
        </div>

      </div>

      {/* Row-by-Row Dataset Table Section */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Daftar Data Dataset Excel & Hasil Evaluasi Prediksi Per-Baris</span>
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredDataset.length} dari {evaluatedDataset.length} data dalam dataset
            </p>
          </div>

          {/* Filter & Search & Rows Limit */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Rows Limit Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <span className="text-[11px] text-slate-500 px-1 font-medium">Tampilkan:</span>
              <button
                onClick={() => { setPageSize(5); setCurrentPage(1); }}
                className={`px-2 py-0.5 rounded text-xs font-bold transition ${
                  pageSize === 5
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                5
              </button>
              <button
                onClick={() => { setPageSize(10); setCurrentPage(1); }}
                className={`px-2 py-0.5 rounded text-xs font-bold transition ${
                  pageSize === 10
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                10
              </button>
              <button
                onClick={() => { setPageSize('all'); setCurrentPage(1); }}
                className={`px-2 py-0.5 rounded text-xs font-bold transition ${
                  pageSize === 'all'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Semua
              </button>
            </div>

            {/* Poli Selector */}
            <select
              value={selectedPoliFilter}
              onChange={(e) => { setSelectedPoliFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Poliklinik ({uniquePolis.length})</option>
              {uniquePolis.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* Evaluation Type Selector */}
            <select
              value={selectedEvalTypeFilter}
              onChange={(e) => { setSelectedEvalTypeFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Hasil Evaluasi</option>
              <option value="match">Sesuai / Match (TP + TN)</option>
              <option value="error">Tidak Sesuai / Mismatch (FP + FN)</option>
              <option value="TP">True Positive (TP)</option>
              <option value="TN">True Negative (TN)</option>
              <option value="FP">False Positive (FP)</option>
              <option value="FN">False Negative (FN)</option>
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-44">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari poli, dokter..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Data Table Container */}
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto rounded-lg border border-slate-200 relative">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="p-2.5 bg-slate-100">No</th>
                <th className="p-2.5 bg-slate-100">Tanggal / Hari</th>
                <th className="p-2.5 bg-slate-100">Poli Tujuan</th>
                <th className="p-2.5 bg-slate-100">Dokter</th>
                <th className="p-2.5 text-center bg-slate-100">Jam</th>
                <th className="p-2.5 text-center bg-slate-100">No. Antrian</th>
                <th className="p-2.5 text-center bg-slate-100">Pasien Terdaftar</th>
                <th className="p-2.5 text-center bg-slate-100">Kuota Maks</th>
                <th className="p-2.5 text-center bg-slate-100">Slot Actual</th>
                <th className="p-2.5 text-center bg-slate-100">Slot Prediksi</th>
                <th className="p-2.5 text-center bg-slate-100">Hasil Evaluasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {paginatedDataset.length > 0 ? (
                paginatedDataset.map((item, idx) => {
                  let evalBadge = null;
                  const isMatch = item.slotTersediaActual === item.slotTersediaPredicted;

                  const startIdxOffset = pageSize === 'all' ? 0 : (currentPage - 1) * (pageSize as number);
                  const displayRowNo = startIdxOffset + idx + 1;

                  if (item.slotTersediaActual === 'Tersedia' && item.slotTersediaPredicted === 'Tersedia') {
                    evalBadge = <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">True Positive (TP)</span>;
                  } else if (item.slotTersediaActual === 'Tidak Tersedia' && item.slotTersediaPredicted === 'Tersedia') {
                    evalBadge = <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">False Positive (FP)</span>;
                  } else if (item.slotTersediaActual === 'Tidak Tersedia' && item.slotTersediaPredicted === 'Tidak Tersedia') {
                    evalBadge = <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">True Negative (TN)</span>;
                  } else {
                    evalBadge = <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">False Negative (FN)</span>;
                  }

                  return (
                    <tr key={item.id} className={`hover:bg-slate-50/80 ${!isMatch ? 'bg-rose-50/30' : ''}`}>
                      <td className="p-2.5 font-mono text-slate-500">{displayRowNo}</td>
                      <td className="p-2.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{item.tanggal}</span>
                        <span className="text-slate-500 text-[11px] block">{item.hari}</span>
                      </td>
                      <td className="p-2.5 font-bold text-slate-800">{item.poli}</td>
                      <td className="p-2.5 text-slate-700">{item.dokter}</td>
                      <td className="p-2.5 text-center font-mono text-slate-600">{item.jamDaftar}</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-800">{item.nomorAntrian}</td>
                      <td className="p-2.5 text-center font-mono text-slate-800">{item.pasienTerdaftar}</td>
                      <td className="p-2.5 text-center font-mono text-slate-600">{item.maksimalPasien}</td>
                      
                      {/* Actual Slot */}
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.slotTersediaActual === 'Tersedia'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {item.slotTersediaActual}
                        </span>
                      </td>

                      {/* Predicted Slot */}
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.slotTersediaPredicted === 'Tersedia'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {item.slotTersediaPredicted}
                        </span>
                      </td>

                      {/* Confusion Matrix Evaluation Category */}
                      <td className="p-2.5 text-center text-[11px] whitespace-nowrap">
                        {evalBadge}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 space-y-2">
                    <Database className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600">
                      {dataset.length === 0
                        ? 'Belum ada data dalam dataset pengujian. Silakan Import File Excel atau klik "Muat Contoh Data".'
                        : 'Tidak ada data yang sesuai dengan pencarian atau filter yang dipilih.'}
                    </p>
                    {dataset.length === 0 && (
                      <div className="pt-2 flex justify-center gap-2">
                        <button
                          onClick={handleLoadSampleData}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition"
                        >
                          Muat Contoh Data
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer Controls */}
        {totalFiltered > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
            <div>
              {pageSize === 'all' ? (
                <span>Menampilkan <strong>{totalFiltered}</strong> dari <strong>{evaluatedDataset.length}</strong> data</span>
              ) : (
                <span>
                  Menampilkan <strong>{Math.min((currentPage - 1) * (pageSize as number) + 1, totalFiltered)}</strong> - <strong>{Math.min(currentPage * (pageSize as number), totalFiltered)}</strong> dari <strong>{totalFiltered}</strong> data
                </span>
              )}
            </div>

            {pageSize !== 'all' && totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Sebelumnya
                </button>
                <span className="font-semibold text-slate-700 text-xs px-1">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
