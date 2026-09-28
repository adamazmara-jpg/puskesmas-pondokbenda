import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Activity,
  ArrowRight,
  Send,
  CheckCircle2,
  FileText,
  MapPin,
  Info,
  Loader2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { QueueTicket } from '../types';
import { calculateDetailedAge } from '../data/patientDatabase';

interface TiketAntreanModalProps {
  ticket: QueueTicket;
  onClose: () => void;
  onGoToAntrean?: () => void;
  onRegisterAnother?: () => void;
}

export const TiketAntreanModal: React.FC<TiketAntreanModalProps> = ({
  ticket,
  onClose,
  onGoToAntrean,
  onRegisterAnother,
}) => {
  const [copied, setCopied] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Format date and time for receipt (e.g. 28-08-2026 09:14:24)
  const formatReceiptDate = (isoStr?: string) => {
    const d = isoStr ? new Date(isoStr) : new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${mins}:${secs}`;
  };

  // Format birthDate to DD-MM-YYYY
  const formatBirthDateDisplay = (bDate?: string) => {
    if (!bDate) return '-';
    if (bDate.includes('-')) {
      const parts = bDate.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
        return bDate;
      }
    }
    return bDate;
  };

  const receiptDateStr = formatReceiptDate(ticket.createdAt);
  const birthDateFormatted = formatBirthDateDisplay(ticket.birthDate);
  const detailedAgeStr = ticket.ageFormatted || (ticket.birthDate ? calculateDetailedAge(ticket.birthDate) : '-');
  const doctorDisplayName = ticket.doctorName || 'dr. Ananto Adi Swasono';
  const klasterTitle = ticket.klasterName || (ticket.klasterNumber ? `KLASTER ${ticket.klasterNumber}` : 'KLASTER 3');
  const klasterSub = ticket.poliName?.toUpperCase() || 'UMUM DEWASA';
  const regNumber = ticket.registrationNumber || '0064';
  const familyHeadName = ticket.familyHead || '';
  const noRmStr = ticket.medicalRecordNo || (ticket.nik ? `03${ticket.nik.slice(-6)}` : '-');
  const oldRmStr = ticket.oldMedicalRecordNo || '-';
  const docRmStr = ticket.documentRmNo || '-';
  const genderLabel = ticket.gender === 'P' ? 'Perempuan' : 'Laki-laki';
  const insuranceLabel = ticket.patientType === 'BPJS' ? 'BPJS Kesehatan' : 'Pasien Umum';
  const feeLabel = ticket.fee || (ticket.patientType === 'BPJS' ? 'Rp. 0 (BPJS Kesehatan)' : 'Rp. 10,000');

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `TIKET KUNJUNGAN PUSKESMAS JURUMUDI BARU\n${klasterTitle} - ${klasterSub}\nNo. Antrean: ${ticket.queueNumber}\nTanggal: ${receiptDateStr}\nNo Pendaftaran: ${regNumber}\nNIK: ${ticket.nik}\nNama: ${ticket.fullName}\nKeluhan: ${ticket.chiefComplaint || 'Pemeriksaan Kesehatan'}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const element = document.getElementById('thermal-receipt-printable');
      if (!element) {
        throw new Error('Element struk tidak ditemukan');
      }

      // Convert DOM element to high-res PNG using html-to-image (supports Tailwind v4 oklch colors & SVG icons)
      const imgData = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      // Load image to determine exact aspect ratio
      const img = new Image();
      img.src = imgData;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
      });

      // Standard thermal receipt width: 80mm
      const imgWidthMm = 80;
      const imgHeightMm = (img.height * imgWidthMm) / img.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [imgWidthMm, imgHeightMm + 6],
      });

      pdf.addImage(imgData, 'PNG', 0, 3, imgWidthMm, imgHeightMm);

      const cleanName = (ticket.fullName || 'Pasien').replace(/[^a-zA-Z0-9]/g, '_');
      const cleanQueue = (ticket.queueNumber || 'Antrean').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Tiket_${cleanQueue}_${cleanName}.pdf`;

      pdf.save(filename);

      setToastMessage(`Struk PDF berhasil diunduh: ${filename}`);
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 4000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setToastMessage('Gagal membuat file PDF. Silakan gunakan tombol Cetak Struk.');
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 4000);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = (ticket.phone || '').replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const message = `*TIKET KUNJUNGAN PUSKESMAS JURUMUDI BARU*\n` +
      `*${klasterTitle} - ${klasterSub}*\n\n` +
      `*No. Antrean : ${ticket.queueNumber}*\n` +
      `Tanggal : ${receiptDateStr}\n\n` +
      `No Pendaftaran : ${regNumber}\n` +
      `NIK : ${ticket.nik}\n` +
      `Nama Pasien : ${ticket.fullName}\n` +
      `Tanggal Lahir : ${birthDateFormatted}\n` +
      (familyHeadName ? `Ayah/KK : ${familyHeadName}\n` : '') +
      `Umur : ${detailedAgeStr}\n` +
      `Keluhan : ${ticket.chiefComplaint || 'Pemeriksaan Kesehatan'}\n` +
      `Alamat : ${ticket.address}\n` +
      `Asuransi : ${insuranceLabel}\n` +
      `Biaya : ${feeLabel}\n\n` +
      `*Petunjuk Datang Langsung:*\n` +
      `1. Tiba di Puskesmas dan tunggu panggilan nomor antrean di loket.\n` +
      `2. Bawa KTP asli / Kartu BPJS.\n` +
      `3. Tunjukkan struk fisik / PDF / pesan WA ini ke Petugas Loket Pendaftaran.`;

    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    setToastMessage('Pesan Struk Tiket Berhasil Dibuka via WhatsApp!');
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      
      {/* Print Specific CSS for Thermal Receipt Printers */}
      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden !important;
          }
          #thermal-receipt-printable, #thermal-receipt-printable * {
            visibility: visible !important;
          }
          #thermal-receipt-printable {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 76mm !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            padding: 3mm 2mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: 'Courier New', Courier, monospace !important;
            font-size: 11px !important;
            line-height: 1.35 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          #thermal-receipt-printable .border-dashed {
            border-color: #000000 !important;
            border-style: dashed !important;
          }
          #thermal-receipt-printable .border-dotted {
            border-color: #000000 !important;
            border-style: dotted !important;
          }
          #thermal-receipt-printable * {
            color: #000000 !important;
            text-shadow: none !important;
          }
          .no-print, button, nav, header, footer, .modal-backdrop {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative my-auto animate-slideUp">
        
        {/* Toast Alert */}
        {showNotificationToast && (
          <div className="absolute top-3 left-3 right-3 z-50 bg-emerald-900 text-white p-3 rounded-2xl shadow-xl border border-emerald-400 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="font-semibold">{toastMessage}</span>
            </div>
            <button onClick={() => setShowNotificationToast(false)} className="text-emerald-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">Tiket Kunjungan Pasien</h3>
              <p className="text-[11px] text-slate-400">Puskesmas Jurumudi Baru • Format Siap Datang Langsung</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instant WhatsApp Quick Bar */}
        <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-200 flex items-center justify-between text-xs">
          <span className="text-emerald-900 font-bold text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Tiket terdaftar di sistem antrean loket
          </span>
          <button
            onClick={handleSendWhatsApp}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shadow-2xs"
          >
            <Send className="w-3 h-3" />
            <span>Kirim WA</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* THERMAL RECEIPT PRINTABLE CONTAINER (FORMAT STRUK RESMI PUSKESMAS) */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 bg-slate-100/80 overflow-y-auto max-h-[64vh] space-y-3">
          
          <div
            id="thermal-receipt-printable"
            className="bg-white text-black p-5 sm:p-6 rounded-2xl shadow-md border border-slate-300 font-mono text-[12px] leading-relaxed mx-auto max-w-[340px] space-y-2.5 relative"
            style={{ fontFamily: '"Courier New", Courier, monospace, sans-serif' }}
          >
            {/* Top Puskesmas Header */}
            <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-black">
              <div className="text-[10px] font-bold tracking-wider uppercase text-black">
                PEMERINTAH KOTA TANGERANG
              </div>
              <h4 className="text-sm font-black tracking-wide uppercase text-black">
                PUSKESMAS JURUMUDI BARU
              </h4>
              <p className="text-[9px] text-black">
                Jl. Halim Perdana Kusuma No. 8 • Telp: (021) 55798821
              </p>
            </div>

            {/* Service Title */}
            <div className="text-center py-1 space-y-0.5">
              <div className="text-[11px] font-black tracking-widest uppercase text-black">
                TIKET KUNJUNGAN
              </div>
              <div className="text-xs font-black tracking-wide uppercase text-black">
                {klasterTitle}
              </div>
              <div className="text-xs font-bold tracking-wide uppercase text-black">
                {klasterSub}
              </div>
            </div>

            {/* No. Antrean & Large Number */}
            <div className="text-center space-y-0.5 py-1.5 border-y-2 border-dashed border-black">
              <div className="text-[10px] font-bold uppercase tracking-wider text-black">
                NOMOR ANTREAN
              </div>
              <div className="text-3xl sm:text-4xl font-black text-black tracking-tight my-1">
                {ticket.queueNumber}
              </div>
              <div className="text-[11px] font-bold text-black">
                Tanggal: {receiptDateStr}
              </div>
            </div>

            {/* Aligned Key-Value Details */}
            <div className="space-y-1 py-1.5 text-[11px] text-black font-semibold border-b border-dashed border-black">
              <div className="flex">
                <span className="w-28 shrink-0">No Pendaftaran</span>
                <span className="shrink-0 mr-1">:</span>
                <span className="font-bold">{regNumber}</span>
              </div>

              <div className="flex">
                <span className="w-28 shrink-0">NIK</span>
                <span className="shrink-0 mr-1">:</span>
                <span className="font-mono font-bold">{ticket.nik}</span>
              </div>

              <div className="flex items-start">
                <span className="w-28 shrink-0">Nama</span>
                <span className="shrink-0 mr-1">:</span>
                <span className="font-bold uppercase break-words">{ticket.fullName}</span>
              </div>

              <div className="flex">
                <span className="w-28 shrink-0">Tanggal Lahir</span>
                <span className="shrink-0 mr-1">:</span>
                <span>{birthDateFormatted}</span>
              </div>

              {familyHeadName ? (
                <div className="flex">
                  <span className="w-28 shrink-0">Ayah/KK</span>
                  <span className="shrink-0 mr-1">:</span>
                  <span className="uppercase">{familyHeadName}</span>
                </div>
              ) : null}

              <div className="flex">
                <span className="w-28 shrink-0">Umur</span>
                <span className="shrink-0 mr-1">:</span>
                <span>{detailedAgeStr}</span>
              </div>

              <div className="flex items-start">
                <span className="w-28 shrink-0">Keluhan</span>
                <span className="shrink-0 mr-1">:</span>
                <span className="break-words font-bold">{ticket.chiefComplaint || 'Pemeriksaan Kesehatan'}</span>
              </div>

              <div className="flex">
                <span className="w-28 shrink-0">No. HP</span>
                <span className="shrink-0 mr-1">:</span>
                <span>{ticket.phone}</span>
              </div>

              <div className="flex">
                <span className="w-28 shrink-0">Jenis Kelamin</span>
                <span className="shrink-0 mr-1">:</span>
                <span>{genderLabel}</span>
              </div>

              <div className="flex items-start">
                <span className="w-28 shrink-0">Alamat</span>
                <span className="shrink-0 mr-1">:</span>
                <span className="break-words uppercase text-[10px] leading-tight">
                  {ticket.address}
                </span>
              </div>

              <div className="flex">
                <span className="w-28 shrink-0">Jenis Pasien</span>
                <span className="shrink-0 mr-1">:</span>
                <span className="font-bold">{insuranceLabel}</span>
              </div>
            </div>

            {/* Bottom Fee */}
            <div className="pt-2 pb-1 text-center border-b border-dashed border-black">
              <div className="text-[10px] uppercase text-black font-semibold">Tarif Retribusi:</div>
              <div className="text-sm font-black text-black tracking-wide">
                {feeLabel}
              </div>
            </div>

            {/* Petunjuk Pas Datang Langsung */}
            <div className="pt-1.5 text-[9px] text-black space-y-0.5 text-center leading-snug">
              <div className="font-black uppercase tracking-wider">*** SIMPAN STRUK TIKET INI ***</div>
              <div>Harap segera menuju loket saat nomor antrean dipanggil.</div>
              <div>Bawa KTP asli / Kartu BPJS untuk verifikasi berkas.</div>
              <div className="pt-1 text-[8px] font-mono text-black">
                SIMPUS ILP • {ticket.timestampLoket || receiptDateStr}
              </div>
            </div>

          </div>

          {/* Info Card Untuk Pasien */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Persiapan Datang Langsung ke Puskesmas</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Cetak struk fisik via tombol <strong>Print Ticket</strong> atau simpan file PDF / WhatsApp. Saat tiba di loket Puskesmas Jurumudi Baru, cukup tunjukkan struk cetak atau e-tiket beserta KTP/BPJS asli Anda.
            </p>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2">
          {/* Main Print Ticket & Download PDF Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-3 px-3 bg-slate-900 hover:bg-black active:scale-[0.98] text-white font-black text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg border border-slate-800"
              title="Cetak struk antrean ke thermal printer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Ticket</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="py-3 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] disabled:bg-emerald-400 text-white font-black text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloadingPdf ? 'Membuat PDF...' : 'Unduh PDF Tiket'}</span>
            </button>
          </div>

          {/* Quick WA & Monitor Antrean */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs rounded-xl border border-teal-300 transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-teal-700" />
              <span>Kirim via WA</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onGoToAntrean) onGoToAntrean();
            }}
            className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition flex items-center justify-center gap-2 group"
          >
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Pantau Status Antrean Berjalan Saat Ini</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </button>

          {onRegisterAnother && (
            <button
              onClick={() => {
                onClose();
                onRegisterAnother();
              }}
              className="w-full py-2 px-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs rounded-lg transition"
            >
              + Daftarkan Pasien Lainnya
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
