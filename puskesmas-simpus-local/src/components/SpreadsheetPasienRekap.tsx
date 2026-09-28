import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  RefreshCw,
  Check,
  Copy,
  Table,
  CheckSquare,
  Square,
  Clock,
  ExternalLink,
  Users,
  Sparkles,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import { QueueTicket, QueueStatus } from '../types';
import {
  convertTicketToSheetRow,
  exportExactGoogleSheetToExcel,
  SheetRowItem
} from '../utils/sheetDataHelper';

interface SpreadsheetPasienRekapProps {
  tickets: QueueTicket[];
  onRefresh?: () => void;
  onUpdateStatus?: (ticketId: string, newStatus: QueueStatus) => void;
  onUpdateTicketField?: (ticketId: string, updates: Partial<QueueTicket>) => void;
}

export const SpreadsheetPasienRekap: React.FC<SpreadsheetPasienRekapProps> = ({
  tickets,
  onRefresh,
  onUpdateStatus,
  onUpdateTicketField
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoli, setSelectedPoli] = useState('all');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [presenceOverrides, setPresenceOverrides] = useState<{ [ticketId: string]: boolean }>({});

  // Convert all tickets into exact Sheet Row objects
  const allSheetRows: SheetRowItem[] = useMemo(() => {
    return tickets.map(t => {
      const row = convertTicketToSheetRow(t);
      if (t.id && presenceOverrides[t.id] !== undefined) {
        row.hadir = presenceOverrides[t.id];
      }
      return row;
    });
  }, [tickets, presenceOverrides]);

  // Unique polis for filter
  const uniquePolis = useMemo(() => {
    const set = new Set<string>();
    allSheetRows.forEach(r => {
      if (r.pilihPoli) set.add(r.pilihPoli);
    });
    return Array.from(set);
  }, [allSheetRows]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return allSheetRows.filter(r => {
      if (selectedPoli !== 'all' && r.pilihPoli !== selectedPoli) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.namaPasien.toLowerCase().includes(q) ||
          r.nik.includes(q) ||
          r.nomorBpjs.includes(q) ||
          r.pilihPoli.toLowerCase().includes(q) ||
          r.alamat.toLowerCase().includes(q) ||
          (r.queueNumber && r.queueNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allSheetRows, selectedPoli, searchQuery]);

  const toggleHadir = (row: SheetRowItem) => {
    if (!row.id) return;
    const newHadir = !row.hadir;
    setPresenceOverrides(prev => ({ ...prev, [row.id!]: newHadir }));
    if (onUpdateTicketField) {
      onUpdateTicketField(row.id, { hadir: newHadir });
    }
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const ticketsToExport = selectedPoli === 'all' && !searchQuery.trim()
        ? tickets
        : tickets.filter(t => filteredRows.some(r => r.id === t.id));

      exportExactGoogleSheetToExcel(
        ticketsToExport.length > 0 ? ticketsToExport : tickets,
        `Sheet_Pendaftaran_Pasien_${new Date().toISOString().split('T')[0]}.xlsx`
      );
    } catch (e) {
      console.error('Export excel error:', e);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handleCopyTSV = () => {
    const headers = [
      'Timestamp',
      'Pilih_Poli',
      'NIK',
      'Nomor_BPJS',
      'Nama_Pasien',
      'Tanggal_Lahir',
      'Alamat',
      'Hadir',
      'Timestamp_Loket',
      'Timestamp_BPU',
      'Timestamp_Apotek',
      'Status BPU',
      'Timestamp_Lab'
    ];

    const lines = [
      headers.join('\t'),
      ...filteredRows.map(r => [
        r.timestamp,
        r.pilihPoli,
        r.nik,
        r.nomorBpjs,
        r.namaPasien,
        r.tanggalLahir,
        r.alamat,
        r.hadir ? 'TRUE' : 'FALSE',
        r.timestampLoket,
        r.timestampBpu,
        r.timestampApotek,
        r.statusBpu,
        r.timestampLab
      ].join('\t'))
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                Live Google Sheets / Excel Pendaftaran Pasien
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                  Real-Time Auto Sinkron
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Data pasien baru yang mendaftar otomatis terisi dengan Timestamp Loket sesuai jam kartu cetak pasien.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              title="Perbarui Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleCopyTSV}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            title="Salin tabel untuk di-paste langsung ke Google Sheet"
          >
            {copiedNotification ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedNotification ? 'Tersalin ke Clipboard!' : 'Salin ke Google Sheets'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Membuat File...' : 'Download Excel (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan NIK, No. BPJS, Nama Pasien, atau Alamat..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedPoli}
            onChange={(e) => setSelectedPoli(e.target.value)}
            className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-semibold text-slate-700"
          >
            <option value="all">Semua Poliklinik ({allSheetRows.length})</option>
            {uniquePolis.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Exact Google Sheets / Excel Table Interface */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
        
        {/* Spreadsheet Tab & Grid Bar */}
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 flex items-center justify-between text-[11px] font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sheet 1: Rekap_Pendaftaran_Pasien</span>
            <span className="text-slate-400 font-normal">| Total: {filteredRows.length} baris data</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Kolom Kuning: Loket Pendaftaran • Kolom Pink: Alur BPU/Apotek/Lab
          </div>
        </div>

        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              {/* EXACT GOOGLE SHEETS HEADER MATCHING USER IMAGE */}
              <tr className="border-b border-slate-400 select-none text-[11px] font-extrabold sticky top-0 z-10">
                {/* Row Number Column */}
                <th className="bg-slate-200 text-slate-600 px-3 py-2 text-center border-r border-slate-300 w-12 shrink-0">
                  #
                </th>

                {/* Yellow Header Group (Loket Pendaftaran) */}
                <th className="bg-[#FFFF00] text-black px-3 py-2.5 border-r border-slate-300 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Timestamp</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#FFFF00] text-black px-3 py-2.5 border-r border-slate-300 whitespace-nowrap min-w-[200px]">
                  <div className="flex items-center gap-1">
                    <span>Pilih_Poli</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#FFFF00] text-black px-3 py-2.5 border-r border-slate-300 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>NIK</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#FFFF00] text-black px-3 py-2.5 border-r border-slate-300 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Nomor_BPJS</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#FFFF00] text-black px-3 py-2.5 border-r border-slate-300 whitespace-nowrap min-w-[160px]">
                  <div className="flex items-center gap-1">
                    <span>Nama_Pasien</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#FFFF00] text-black px-3 py-2.5 border-r border-slate-300 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Tanggal_Lahir</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#FFFF00] text-[#FF00FF] font-black px-3 py-2.5 border-r border-slate-300 whitespace-nowrap min-w-[220px]">
                  <div className="flex items-center gap-1">
                    <span>Alamat</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#FFFF00] text-black px-3 py-2.5 border-r border-slate-300 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <span>Hadir</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#FFFF00] text-black px-3 py-2.5 border-r border-slate-400 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Timestamp_Loket</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>

                {/* Pink / Purple Header Group (BPU / Apotek / Lab) */}
                <th className="bg-[#E6D4E2] text-slate-900 px-3 py-2.5 border-r border-slate-300 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Timestamp_BPU</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#E6D4E2] text-slate-900 px-3 py-2.5 border-r border-slate-300 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Timestamp_Apotek</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#E6D4E2] text-slate-900 px-3 py-2.5 border-r border-slate-300 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Status BPU</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
                <th className="bg-[#E6D4E2] text-slate-900 px-3 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Timestamp_Lab</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-700 opacity-60" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 font-normal text-slate-900">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={14} className="p-8 text-center text-slate-400 bg-slate-50">
                    <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600">Belum ada data pendaftaran pasien</p>
                    <p className="text-xs">Pasien yang mendaftar online atau di loket akan langsung muncul di baris tabel ini.</p>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  const rowNum = 222 + idx; // Simulated spreadsheet row number
                  return (
                    <tr
                      key={row.id || idx}
                      className={`hover:bg-blue-50/50 transition border-b border-slate-200 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {/* Row Index */}
                      <td className="bg-slate-100 text-slate-500 font-mono text-[10px] text-center border-r border-slate-300 py-1.5 px-2">
                        {rowNum}
                      </td>

                      {/* Timestamp (Blue Link Text as in image) */}
                      <td className="px-3 py-2 text-blue-700 font-medium whitespace-nowrap border-r border-slate-200">
                        {row.timestamp}
                      </td>

                      {/* Pilih_Poli (Blue Link Text as in image) */}
                      <td className="px-3 py-2 text-blue-700 font-medium whitespace-nowrap border-r border-slate-200">
                        {row.pilihPoli}
                      </td>

                      {/* NIK (Blue Link Text) */}
                      <td className="px-3 py-2 text-blue-700 font-mono whitespace-nowrap border-r border-slate-200">
                        {row.nik}
                      </td>

                      {/* Nomor_BPJS (Blue Link Text) */}
                      <td className="px-3 py-2 text-blue-700 font-mono whitespace-nowrap border-r border-slate-200">
                        {row.nomorBpjs}
                      </td>

                      {/* Nama_Pasien (Blue Link Text) */}
                      <td className="px-3 py-2 text-blue-700 font-medium whitespace-nowrap border-r border-slate-200">
                        {row.namaPasien}
                      </td>

                      {/* Tanggal_Lahir (Blue Link Text) */}
                      <td className="px-3 py-2 text-blue-700 font-medium whitespace-nowrap border-r border-slate-200">
                        {row.tanggalLahir}
                      </td>

                      {/* Alamat (Blue Link Text) */}
                      <td className="px-3 py-2 text-blue-700 font-medium whitespace-nowrap border-r border-slate-200">
                        {row.alamat}
                      </td>

                      {/* Hadir (Interactive Checkbox) */}
                      <td className="px-3 py-2 text-center border-r border-slate-200">
                        <button
                          type="button"
                          onClick={() => toggleHadir(row)}
                          className="inline-flex items-center justify-center p-0.5 hover:scale-110 transition"
                          title="Klik untuk mengubah status kehadiran pasien"
                        >
                          {row.hadir ? (
                            <div className="w-4 h-4 bg-blue-700 rounded text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 border-2 border-slate-400 rounded bg-white" />
                          )}
                        </button>
                      </td>

                      {/* Timestamp_Loket (Blue Link Text - format e.g. 02/09/2026 7:57:02) */}
                      <td className="px-3 py-2 text-blue-700 font-mono font-medium whitespace-nowrap border-r border-slate-300">
                        {row.timestampLoket}
                      </td>

                      {/* Timestamp_BPU */}
                      <td className="px-3 py-2 text-slate-700 font-mono text-xs whitespace-nowrap border-r border-slate-200">
                        {row.timestampBpu || '-'}
                      </td>

                      {/* Timestamp_Apotek */}
                      <td className="px-3 py-2 text-slate-700 font-mono text-xs whitespace-nowrap border-r border-slate-200">
                        {row.timestampApotek || '-'}
                      </td>

                      {/* Status BPU */}
                      <td className="px-3 py-2 text-slate-800 text-xs whitespace-nowrap border-r border-slate-200">
                        {row.statusBpu || '-'}
                      </td>

                      {/* Timestamp_Lab */}
                      <td className="px-3 py-2 text-slate-700 font-mono text-xs whitespace-nowrap">
                        {row.timestampLab || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-800">
              Total Hadir: {filteredRows.filter(r => r.hadir).length} / {filteredRows.length} Pasien
            </span>
            <span className="text-slate-400">•</span>
            <span>
              Di BPU / Dokter: {filteredRows.filter(r => r.timestampBpu).length} Pasien
            </span>
            <span className="text-slate-400">•</span>
            <span>
              Di Apotek: {filteredRows.filter(r => r.timestampApotek).length} Pasien
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Format sesuai standar Google Sheets / Excel SIMPUS Puskesmas
          </div>
        </div>

      </div>
    </div>
  );
};
