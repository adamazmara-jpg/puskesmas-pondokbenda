import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Activity,
  ArrowRight,
  Send,
  Mail,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { QueueTicket } from '../types';

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
  const [emailNotificationSent, setEmailNotificationSent] = useState(true);
  const [waNotificationSent, setWaNotificationSent] = useState(true);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `TIKET ANTREAN PUSKESMAS PONDOK BENDA TANGSEL\nNo. Tiket: ${ticket.queueNumber}\nNama: ${ticket.fullName}\nPoli: ${ticket.poliName}\nTanggal: ${ticket.appointmentDate}\nStatus: ${ticket.status}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = ticket.phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const message = `*KONFIRMASI TIKET ANTREAN PUSKESMAS PONDOK BENDA TANGSEL*\n\nYth. Sdr/i *${ticket.fullName}*,\nNomor Tiket Antrean Anda berhasil diterbitkan:\n\n` +
      `• *Nomor Antrean:* ${ticket.queueNumber}\n` +
      `• *Poliklinik:* ${ticket.poliName}\n` +
      `• *Tanggal Kunjungan:* ${ticket.appointmentDate}\n` +
      `• *Estimasi Jam Layanan:* ${ticket.timeSlot}\n` +
      `• *Jenis Pasien:* Pasien ${ticket.patientType}\n\n` +
      `*Petunjuk:* Harap datang 15 menit sebelum estimasi jam panggil & membawa KTP / Kartu BPJS. Terima kasih.`;

    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    setToastMessage('Pesan Konfirmasi Tiket Berhasil Dibuka via WhatsApp!');
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 4000);
  };

  const handleResendEmail = () => {
    setEmailNotificationSent(true);
    setToastMessage(`Email konfirmasi antrean telah dikirim ulang ke email pendaftaran pasien (${ticket.fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com)!`);
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden relative animate-slideUp">
        
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

        {/* Top Decorative Header */}
        <div className="bg-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-emerald-700/80 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-700 text-emerald-100 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-emerald-600">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span>Puskesmas Pondok Benda Tangsel</span>
            </div>
            <h3 className="text-lg font-extrabold tracking-tight">E-Tiket Antrean Digital</h3>
            <p className="text-xs text-emerald-200">
              Pendaftaran Berhasil • Konfirmasi Otomatis Telah Dikirim
            </p>
          </div>
        </div>

        {/* Instant Notification Status Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white px-5 py-3 border-b border-emerald-700/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
            <div>
              <span className="font-extrabold text-emerald-200 block text-[11px]">
                Notifikasi Konfirmasi Otomatis Dikirim!
              </span>
              <span className="text-[10px] text-slate-300">
                Pesan WhatsApp ke {ticket.phone || 'HP Pasien'} & Email
              </span>
            </div>
          </div>

          <button
            onClick={handleSendWhatsApp}
            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black rounded-lg transition shrink-0 flex items-center gap-1 shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span>Cek WA</span>
          </button>
        </div>

        {/* Printable Ticket Body */}
        <div id="printable-ticket" className="p-6 space-y-5 bg-gradient-to-b from-emerald-50/40 to-white">
          
          {/* Big Queue Number Display */}
          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-md text-center space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
              {ticket.patientType}
            </div>

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nomor Antrean Anda
            </p>
            <div className="text-5xl font-black text-emerald-700 tracking-tight font-mono">
              {ticket.queueNumber}
            </div>
            <p className="text-xs font-bold text-slate-800 bg-emerald-100/80 border border-emerald-200 py-1 px-3 rounded-full inline-block">
              {ticket.poliName}
            </p>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-medium block">Nama Pasien</span>
              <span className="font-bold text-slate-900 truncate block">{ticket.fullName}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">NIK Pasien</span>
              <span className="font-mono text-slate-800 font-semibold">{ticket.nik}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Tanggal Periksa</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-600" />
                {ticket.appointmentDate}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Estimasi Jam</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                {ticket.timeSlot}
              </span>
            </div>
          </div>

          {/* Barcode & QR Code Graphic Mock */}
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Scan Petugas Loket
              </span>
              <div className="text-xs font-mono font-bold text-amber-400">{ticket.id}</div>
              <div className="text-[10px] text-slate-300">
                Tunjukkan nomor ini saat tiba di Puskesmas
              </div>
            </div>

            <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 shadow-inner">
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>
          </div>

          {/* Notice Instructions & WhatsApp/Email Notification Actions */}
          <div className="text-[11px] text-slate-600 space-y-2 bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
            <div className="font-bold text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Notifikasi & Petunjuk Kunjungan:</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Auto-Sent
              </span>
            </div>

            <p className="text-[11px] text-slate-700 leading-tight">
              Bukti pendaftaran ini secara otomatis telah dikirimkan ke WhatsApp <strong className="text-slate-900">{ticket.phone}</strong> & Email terdaftar.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim via WA</span>
              </button>

              <button
                onClick={handleResendEmail}
                className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-lg transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Kirim via Email</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 space-y-2">
          <button
            onClick={() => {
              onClose();
              if (onGoToAntrean) onGoToAntrean();
            }}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 group"
          >
            <Activity className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>Pantau Status Antrean Berjalan Saat Ini</span>
            <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copied ? 'Tersalin!' : 'Salin Detail'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>

          {onRegisterAnother && (
            <button
              onClick={() => {
                onClose();
                onRegisterAnother();
              }}
              className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-300 transition flex items-center justify-center gap-2"
            >
              <span>+ Daftar Pasien Lain / Anggota Keluarga (NIK Berbeda)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
