import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  Users,
  ShieldCheck,
  Table
} from 'lucide-react';
import { QueueTicket, PoliService } from '../types';
import { getAllRmeRecords } from '../data/rmeDatabase';
import { exportPatientVisitsToExcel, MONTH_NAMES_ID } from '../utils/excelExporter';
import { exportExactGoogleSheetToExcel } from '../utils/sheetDataHelper';

interface ExportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: QueueTicket[];
  polis: PoliService[];
}

export const ExportExcelModal: React.FC<ExportExcelModalProps> = ({
  isOpen,
  onClose,
  tickets,
  polis
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [exportFormat, setExportFormat] = useState<'sheet' | 'rme'>('sheet');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [startMonth, setStartMonth] = useState<number>(1);
  const [endMonth, setEndMonth] = useState<number>(currentMonth);
  const [selectedPoliId, setSelectedPoliId] = useState<string>('all');
  const [patientType, setPatientType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate preview count
  const matchingTickets = tickets.filter(t => {
    const dateStr = t.appointmentDate || t.createdAt.split('T')[0];
    const [yStr, mStr] = dateStr.split('-');
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);

    if (y !== selectedYear) return false;
    if (m < startMonth || m > endMonth) return false;
    if (selectedPoliId !== 'all' && t.poliId !== selectedPoliId) return false;
    if (patientType !== 'all' && t.patientType !== patientType) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;

    return true;
  });

  const handleExport = () => {
    setIsExporting(true);
    setExportSuccess(null);

    try {
      if (exportFormat === 'sheet') {
        const result = exportExactGoogleSheetToExcel(
          matchingTickets.length > 0 ? matchingTickets : tickets,
          `Sheet_Pendaftaran_Pasien_${new Date().toISOString().split('T')[0]}.xlsx`
        );
        setExportSuccess(`Berhasil mengekspor ${result.count} data pasien ke format Google Sheet Puskesmas "${result.fileName}"`);
      } else {
        const rmeRecords = getAllRmeRecords();
        const result = exportPatientVisitsToExcel(tickets, rmeRecords, {
          year: selectedYear,
          startMonth,
          endMonth,
          poliId: selectedPoliId,
          patientType,
          status: statusFilter
        });
        setExportSuccess(`Berhasil mengekspor ${result.count} data kunjungan ke file "${result.fileName}"`);
      }

      setTimeout(() => {
        setIsExporting(false);
      }, 800);
    } catch (err: any) {
      alert('Gagal mengekspor laporan: ' + err.message);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-700/80 rounded-2xl flex items-center justify-center border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                EXPORT DATA EXCEL (.XLSX)
              </span>
              <h3 className="text-base font-black text-white">Laporan & Rekap Pendaftaran Pasien</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white bg-emerald-950/40 rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Format Selection Tabs */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Pilih Format File Excel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExportFormat('sheet')}
                className={`p-3 rounded-xl border text-left transition ${
                  exportFormat === 'sheet'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="font-black text-xs flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Format Google Sheet</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Persis format: Timestamp, NIK, BPJS, Nama, Hadir, Timestamp_Loket, BPU, Apotek.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('rme')}
                className={`p-3 rounded-xl border text-left transition ${
                  exportFormat === 'rme'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="font-black text-xs flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Format Rekap RME</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Mencakup Diagnosa ICD-10, E-Resep, Tindakan Medis, dan Statistik Poli.
                </p>
              </button>
            </div>
          </div>

          {/* Year and Month Range Filters */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Pilih Tahun Laporan
              </label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value={2026}>Tahun 2026</option>
                <option value={2025}>Tahun 2025</option>
                <option value={2024}>Tahun 2024</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Dari Bulan
                </label>
                <select
                  value={startMonth}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setStartMonth(val);
                    if (val > endMonth) setEndMonth(val);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {MONTH_NAMES_ID.map((name, idx) => (
                    <option key={idx} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sampai Bulan
                </label>
                <select
                  value={endMonth}
                  onChange={e => setEndMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {MONTH_NAMES_ID.map((name, idx) => (
                    <option key={idx} value={idx + 1} disabled={idx + 1 < startMonth}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Poliklinik Filter */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Filter Poliklinik
            </label>
            <select
              value={selectedPoliId}
              onChange={e => setSelectedPoliId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Semua Poliklinik</option>
              {polis.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Patient Type & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tipe Jaminan
              </label>
              <select
                value={patientType}
                onChange={e => setPatientType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
              >
                <option value="all">Semua (BPJS & Umum)</option>
                <option value="BPJS">Hanya BPJS</option>
                <option value="Umum">Hanya Umum</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Status Kunjungan
              </label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800"
              >
                <option value="all">Semua Status</option>
                <option value="Completed">Selesai Dilayani</option>
                <option value="Waiting">Menunggu</option>
                <option value="Called">Sedang Dipanggil</option>
              </select>
            </div>
          </div>

          {/* Real-time Preview Counter */}
          <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between border border-slate-200">
            <span className="font-bold text-slate-700">Data Pasien Siap Diekspor:</span>
            <span className="px-2.5 py-0.5 bg-emerald-700 text-white rounded-lg font-black text-xs">
              {matchingTickets.length} Pasien
            </span>
          </div>

          {exportSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{exportSuccess}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Membuat File...' : 'Download Excel (.xlsx)'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
