import React, { useState, useEffect } from 'react';
import {
  Star,
  Send,
  CheckCircle2,
  Award,
  MessageSquare,
  ShieldCheck,
  FileText,
  Building2,
  Check
} from 'lucide-react';
import { SurveyStats, SurveySubmission } from '../types';

export const SurveiIKM: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState(5);
  const [servicePoli, setServicePoli] = useState('Poli Umum');
  const [serviceQuality, setServiceQuality] = useState(5);
  const [waitingTimeRating, setWaitingTimeRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [recentReviews, setRecentReviews] = useState<SurveySubmission[]>([]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/survei/stats');
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
        if (data.recent) setRecentReviews(data.recent);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/survei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          rating,
          servicePoli,
          serviceQuality,
          waitingTimeRating,
          cleanlinessRating,
          feedback,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFeedback('');
        setPatientName('');
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1:
        return 'Sangat Kurang';
      case 2:
        return 'Kurang Memuaskan';
      case 3:
        return 'Cukup Memuaskan';
      case 4:
        return 'Puas & baik';
      case 5:
        return 'Sangat Memuaskan';
      default:
        return 'Puas';
    }
  };

  const accreditationCriteria = [
    { title: 'Persyaratan Pelayanan', desc: 'Kemudahan & kejelasan informasi berkas KTP/BPJS' },
    { title: 'Sistem & Prosedur', desc: 'Alur pendaftaran digital & layanan poli terintegrasi' },
    { title: 'Waktu Pelayanan', desc: 'Kecepatan respon panggil antrean & penanganan medis' },
    { title: 'Biaya / Tarif', desc: 'Bebas Pungli & Gratis bagi Pasien BPJS / Warga Tangsel' },
    { title: 'Kompetensi Pelaksana', desc: 'Dokter, Bidan & Perawat tersertifikasi & berpengalaman' },
    { title: 'Perilaku & Kesopanan', desc: 'Pelayanan ramah, komunikatif, dan responsif' },
    { title: 'Sarana & Prasarana', desc: 'Fasilitas bersih, ber-AC, dan ramah disabilitas/lansia' },
    { title: 'Pengaduan & Aspirasi', desc: 'Penanganan keluhan cepat melalui Posko Pengaduan' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      
      {/* Official Accreditation Header & Banner */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5 shadow-xs">
                <Award className="w-4 h-4" />
                <span>Terakreditasi PARIPURNA</span>
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-md text-xs font-semibold border border-slate-700">
                Kementerian Kesehatan Republik Indonesia
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Survei Kepuasan Masyarakat & Evaluasi Mutu
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
              Penilaian ini diselenggarakan sesuai dengan standar **Permenpan RB No. 14 Tahun 2017** guna mengukur Indeks Kepuasan Masyarakat (IKM) secara berkala dan menjaga standar mutu layanan **Akreditasi Utama** Puskesmas Pondok Benda Tangerang Selatan.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>FKTP Terakreditasi Utama</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Dinas Kesehatan Kota Tangerang Selatan</span>
              </span>
            </div>
          </div>

          {/* Accreditation Seal Box */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-xl text-center space-y-3">
            <div className="w-14 h-14 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                MUTU PELAYANAN UTAMA
              </div>
              <div className="text-2xl font-black text-white font-mono mt-0.5">
                MUTU A (SANGAT BAIK)
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Sertifikat Penjaminan Mutu Faskes Tingkat Pertama
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 9 Standard Accreditation Criteria Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Standar Penilaian Mutu Pelayanan Publik (Permenpan-RB)</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">8 Indikator Evaluasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {accreditationCriteria.map((c, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{c.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Executive KPI Stats Summary */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xs border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Main Score Index */}
          <div className="md:col-span-4 space-y-1 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Skor Indeks Kepuasan (IKM)
            </span>
            <div className="flex items-baseline justify-center md:justify-start gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono">
                {stats && stats.totalResponses > 0 ? `${stats.satisfactionPercentage}%` : '100%'}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                {stats && stats.totalResponses > 0 ? (stats.averageRating >= 4 ? 'Sangat Memuaskan' : 'Baik') : 'Sangat Memuaskan'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Akumulasi masukan dari {stats ? stats.totalResponses : 0} responden warga
            </p>
          </div>

          {/* Average Rating */}
          <div className="md:col-span-4 border-y md:border-y-0 md:border-x border-slate-800 py-4 md:py-0 text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Nilai Rata-rata Pelayanan
            </span>
            <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-extrabold text-white">
              <span>{stats && stats.totalResponses > 0 ? stats.averageRating.toFixed(1) : '5.0'}</span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      (stats && stats.totalResponses > 0 ? stats.averageRating : 5) >= s
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400">Skala 1.0 sampai 5.0 Bintang</p>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="md:col-span-4 space-y-1.5 text-xs">
            <span className="font-semibold text-slate-300 block mb-2">Sebaran Penilaian Pasien:</span>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats && stats.ratingBreakdown ? stats.ratingBreakdown[star] || 0 : 0;
              const total = stats ? stats.totalResponses : 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : (star === 5 ? 100 : 0);

              return (
                <div key={star} className="flex items-center gap-2.5">
                  <span className="w-6 font-mono font-bold text-slate-400 text-right">{star}★</span>
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-slate-400">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Assessment Form & Feedback Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Block */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h3>Formulir Evaluasi Kepuasan Pasien</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Isi formulir ini setelah selesai mendapatkan pelayanan di Puskesmas.
            </p>
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">Penilaian Berhasil Terkirim!</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Terima kasih atas masukan berharga Anda. Penilaian ini langsung masuk ke dalam Laporan Evaluasi Pelayanan Puskesmas Pondok Benda.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition"
              >
                Kirim Evaluasi Lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Patient Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pasien <span className="text-slate-400 font-normal">(Opsional / Boleh Anonim)</span>
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Contoh: Ibu Rahma / Bapak Asep"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Poliklinik / Unit Layanan
                  </label>
                  <select
                    value={servicePoli}
                    onChange={(e) => setServicePoli(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Poli Umum">Poli Umum</option>
                    <option value="Poli Gigi & Mulut">Poli Gigi & Mulut</option>
                    <option value="Poli KIA & KB">Poli KIA & KB</option>
                    <option value="Poli Anak & Imunisasi">Poli Anak & Imunisasi</option>
                    <option value="Poli Lansia & PTM">Poli Lansia & PTM</option>
                    <option value="Poli Batuk & TB Paru">Poli Batuk & TB Paru</option>
                    <option value="Laboratorium Kesehatan">Laboratorium Kesehatan</option>
                    <option value="Farmasi & Apotek Obat">Farmasi & Apotek Obat</option>
                  </select>
                </div>
              </div>

              {/* Main Star Rating Selector */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900">
                    1. Rating Kepuasan Keseluruhan
                  </label>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {rating} / 5 ({getRatingLabel(rating)})
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`flex-1 py-3 px-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition ${
                        rating >= star
                          ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-xs'
                          : 'bg-white text-slate-400 border-slate-300 hover:border-amber-300'
                      }`}
                    >
                      <Star className={`w-6 h-6 ${rating >= star ? 'fill-slate-950' : ''}`} />
                      <span className="text-[10px] hidden sm:inline">{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Rating Aspect Selectors */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 block">
                  2. Evaluasi Karakteristik Pelayanan
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">
                      Keramahan Petugas
                    </label>
                    <select
                      value={serviceQuality}
                      onChange={(e) => setServiceQuality(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-800"
                    >
                      <option value={5}>5 - Sangat Ramah</option>
                      <option value={4}>4 - Ramah</option>
                      <option value={3}>3 - Cukup</option>
                      <option value={2}>2 - Kurang Ramah</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">
                      Kecepatan Antrean
                    </label>
                    <select
                      value={waitingTimeRating}
                      onChange={(e) => setWaitingTimeRating(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-800"
                    >
                      <option value={5}>5 - Sangat Cepat</option>
                      <option value={4}>4 - Cepat</option>
                      <option value={3}>3 - Cukup</option>
                      <option value={2}>2 - Lambat</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700 block">
                      Kebersihan Fasilitas
                    </label>
                    <select
                      value={cleanlinessRating}
                      onChange={(e) => setCleanlinessRating(Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium text-slate-800"
                    >
                      <option value={5}>5 - Sangat Bersih</option>
                      <option value={4}>4 - Bersih</option>
                      <option value={3}>3 - Cukup</option>
                      <option value={2}>2 - Kurang Bersih</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Feedback */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Saran & Aspirasi Pasien
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tuliskan ulasan, kritik, atau saran untuk kemajuan Puskesmas Pondok Benda..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>{isSubmitting ? 'Mengirim Penilaian...' : 'Kirim Penilaian Kepuasan'}</span>
              </button>

            </form>
          )}

        </div>

        {/* Right Block: Live Verified Patient Feedback List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>Ulasan Warga Terdaftar</span>
              </div>
              <span className="text-xs text-slate-500 font-medium font-mono">
                {recentReviews.length} Ulasan
              </span>
            </div>

            {recentReviews.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-slate-50 rounded-lg border border-dashed border-slate-300 p-6">
                <div className="w-12 h-12 bg-slate-200/60 text-slate-500 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">Belum Ada Ulasan Terdaftar</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Jadilah warga pertama yang memberikan penilaian kepuasan untuk pelayanan Puskesmas Pondok Benda!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {recentReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                          {rev.patientName ? rev.patientName.charAt(0) : 'W'}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block leading-tight">
                            {rev.patientName || 'Warga Tangsel'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded border border-emerald-200">
                        {rev.servicePoli}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            rev.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="text-slate-600 font-mono text-[11px] font-bold ml-1">
                        {rev.rating}.0
                      </span>
                    </div>

                    {rev.feedback ? (
                      <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-2.5 rounded border border-slate-100">
                        "{rev.feedback}"
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        (Pasien memberikan rating tanpa ulasan tertulis)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
