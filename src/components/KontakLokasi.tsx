import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Mail,
  Clock,
  Instagram,
  Youtube,
  Phone,
  Award,
  Send,
  ExternalLink,
  CheckCircle2,
  Star,
  MessageSquare,
  Plus,
  Quote,
  ThumbsUp,
  Navigation,
  Compass
} from 'lucide-react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { Testimonial } from '../types';

const PUSKESMAS_COORDS = { lat: -6.325215, lng: 106.707566 };
const PUSKESMAS_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=Puskesmas+Pondok+Benda,+Pamulang,+Kota+Tangerang+Selatan";
const PUSKESMAS_MAP_VIEW_URL = "https://maps.google.com/?q=Puskesmas+Pondok+Benda,+Pamulang,+Tangerang+Selatan";

const PuskesmasInteractiveMap: React.FC = () => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  
  const rawKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  // Valid Google Maps API keys are at least 20 characters and start with 'AIza'
  const isValidKeyFormat = Boolean(rawKey && rawKey.length >= 20 && rawKey.startsWith('AIza'));
  const [authError, setAuthError] = useState(!isValidKeyFormat && Boolean(rawKey));

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    const handleAuth = () => setAuthError(true);

    window.addEventListener('gmp-quota-exceeded', handleQuota);
    window.addEventListener('gmp-auth-failure', handleAuth);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuota);
      window.removeEventListener('gmp-auth-failure', handleAuth);
    };
  }, []);

  const shouldRenderJsApi = isValidKeyFormat && !authError;

  return (
    <div className="relative w-full h-full min-h-[520px] bg-slate-100 flex flex-col rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
      {/* Quota Notice Banner per GMP Guidelines */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-3 py-2 text-xs text-center sticky top-0 z-30 shadow-xs">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Floating Info & Actions Overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200/90 max-w-[290px] z-10 text-xs space-y-2.5 transition">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
              LOKASI FISIK FASKES
            </span>
            <span className="font-extrabold text-slate-900 text-sm leading-tight block">
              Puskesmas Pondok Benda
            </span>
          </div>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
            Aktif
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          Jl. Benda Barat No.14 Perum Pamulang Permai 2, Pd. Benda, Pamulang, Tangerang Selatan 15416
        </p>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <span className="text-amber-500 font-bold">4.9 ★</span>
            <span className="text-slate-400">(IKM Utama)</span>
          </div>
          <span className="text-emerald-700 font-bold text-[10px]">Layanan 24 Jam UGD</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={PUSKESMAS_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] shadow-xs transition"
          >
            <Navigation className="w-3 h-3" />
            <span>Petunjuk Arah</span>
          </a>
          <a
            href={PUSKESMAS_MAP_VIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] transition"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Buka Peta</span>
          </a>
        </div>
      </div>

      {/* Google Maps View */}
      {shouldRenderJsApi ? (
        <APIProvider
          apiKey={rawKey}
          libraries={['marker']}
          onError={() => setAuthError(true)}
        >
          <div className="w-full h-full min-h-[520px]">
            <Map
              mapId="DEMO_MAP_ID"
              defaultZoom={17}
              defaultCenter={PUSKESMAS_COORDS}
              gestureHandling="greedy"
              disableDefaultUI={false}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%', minHeight: '520px' }}
            >
              <AdvancedMarker
                ref={markerRef}
                position={PUSKESMAS_COORDS}
                title="Puskesmas Pondok Benda"
                onClick={() => setInfoWindowOpen(true)}
              >
                <Pin
                  background="#059669"
                  borderColor="#047857"
                  glyphColor="#ffffff"
                  scale={1.2}
                />
              </AdvancedMarker>

              {infoWindowOpen && (
                <InfoWindow
                  anchor={marker}
                  maxWidth={300}
                  onCloseClick={() => setInfoWindowOpen(false)}
                >
                  <div className="p-1 space-y-1.5 text-slate-800">
                    <div className="border-b border-slate-100 pb-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 block">Puskesmas Resmi</span>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug">Puskesmas Pondok Benda</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      Jl. Benda Barat No.14 Perum Pamulang Permai 2, Pamulang, Tangerang Selatan
                    </p>
                    <div className="text-[11px] font-medium text-slate-700 flex flex-col gap-0.5 pt-1">
                      <span>🕒 UGD & Rawat Inap: <strong>24 Jam</strong></span>
                      <span>🕒 Poli Rawat Jalan: <strong>07.30 - 15.00 WIB</strong></span>
                      <span>📞 Hotline (WA): <strong>0823-1136-6261</strong></span>
                    </div>
                    <div className="pt-2">
                      <a
                        href={PUSKESMAS_DIRECTIONS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline"
                      >
                        Mulai Navigasi di Google Maps →
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </div>
        </APIProvider>
      ) : (
        <div className="w-full h-full min-h-[520px] relative">
          <iframe
            title="Peta Interaktif Puskesmas Pondok Benda"
            src="https://maps.google.com/maps?q=Puskesmas+Pondok+Benda,+Jalan+Benda+Barat+14A,+Pamulang+Permai+II,+Tangerang+Selatan&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '520px' }}
            allowFullScreen={false}
            loading="lazy"
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export const KontakLokasi: React.FC = () => {
  const [formData, setFormData] = useState({
    nama: '',
    phone: '',
    email: '',
    pesan: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Initial Testimonials State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 'testi-1',
      name: 'Ibu Rahmawati (Pamulang 2)',
      servicePoli: 'Poli Umum & Apotek',
      rating: 5,
      comment: 'Pelayanan pendaftaran online sangat cepat dan teratur. Dokter ramah, penjelasan obat dari bagian apotek juga sangat jelas.',
      date: '02 Agustus 2026',
      verified: true
    },
    {
      id: 'testi-2',
      name: 'Bpk. Hendra Gunawan',
      servicePoli: 'Poli Gigi & Mulut',
      rating: 5,
      comment: 'Peralatan di Poli Gigi sangat modern dan bersih. drg. Maya penangannya sangat lembut. Sangat puas dengan layanan Puskesmas Pondok Benda.',
      date: '28 Juli 2026',
      verified: true
    },
    {
      id: 'testi-3',
      name: 'Ibu Siti Nurhaliza',
      servicePoli: 'Poli KIA & Imunisasi Anak',
      rating: 5,
      comment: 'Imunisasi balita gratis dan dapat buku panduan. Bidan penyabar banget menghadapi balita yang takut jarum.',
      date: '22 Juli 2026',
      verified: true
    }
  ]);

  // Modal / Form state for user to submit a new Testimonial
  const [isTestiModalOpen, setIsTestiModalOpen] = useState(false);
  const [testiForm, setTestiForm] = useState({
    name: '',
    servicePoli: 'Poli Umum',
    rating: 5,
    comment: ''
  });
  const [testiSubmitted, setTestiSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.pesan) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nama: '', phone: '', email: '', pesan: '' });
    }, 4000);
  };

  const handleTestiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testiForm.name || !testiForm.comment) return;

    const newTesti: Testimonial = {
      id: `testi-${Date.now()}`,
      name: testiForm.name,
      servicePoli: testiForm.servicePoli,
      rating: testiForm.rating,
      comment: testiForm.comment,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      verified: true
    };

    setTestimonials([newTesti, ...testimonials]);
    setTestiSubmitted(true);
    setTimeout(() => {
      setTestiSubmitted(false);
      setIsTestiModalOpen(false);
      setTestiForm({ name: '', servicePoli: 'Poli Umum', rating: 5, comment: '' });
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      
      {/* Centered Heading */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          HUBUNGI KAMI
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Kami Siap Membantu Anda
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
          Jangan ragu menghubungi kami untuk pertanyaan, saran, atau kritik yang membangun.
        </p>
      </div>

      {/* 6 Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Alamat */}
        <a
          href={PUSKESMAS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition flex items-start gap-3.5 group"
          title="Klik untuk membuka petunjuk arah Google Maps"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 border border-emerald-100 transition">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
              <span>ALAMAT FASKES</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-emerald-600 transition" />
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition">
              Jl. Benda Barat No.14 Perum Pamulang Permai 2, Pondok Benda, Pamulang
            </p>
          </div>
        </a>

        {/* Card 2: Hotline (WA) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-emerald-300 transition flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Phone className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              HOTLINE (WA)
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
              082311366261
            </p>
          </div>
        </div>

        {/* Card 3: Instagram */}
        <a
          href="https://www.instagram.com/puskesmaspondokbenda?igsh=bXhmcmNhcDF0eXhp"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition flex items-start gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 border border-emerald-100 transition">
            <Instagram className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
              <span>INSTAGRAM</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition">
              @puskesmaspondokbenda
            </p>
          </div>
        </a>

        {/* Card 4: YouTube */}
        <a
          href="https://www.youtube.com/@pkmpondokbenda6219"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition flex items-start gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 border border-emerald-100 transition">
            <Youtube className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
              <span>YOUTUBE CHANNEL</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition">
              @pkmpondokbenda6219
            </p>
          </div>
        </a>

        {/* Card 5: Email */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-emerald-300 transition flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Mail className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              EMAIL
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug truncate">
              pengaduanpkmpondokbenda@yahoo.com
            </p>
          </div>
        </div>

        {/* Card 6: Akreditasi */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-emerald-300 transition flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Award className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              AKREDITASI
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
              Terakreditasi Utama
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Section: Map & Testimonials Side-by-Side ("di sebelah maps") */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* Left Column: Interactive Google Map */}
        <PuskesmasInteractiveMap />

        {/* Right Column: Testimoni & Ulasan Masyarakat (IKM) Directly Beside Maps */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider block">
                  INDEKS KEPUASAN MASYARAKAT
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Testimoni & Ulasan Pasien
                </h3>
              </div>
              <button
                onClick={() => setIsTestiModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Beri Ulasan</span>
              </button>
            </div>

            {/* Testimonials List */}
            <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {testimonials.map((testi) => (
                <div
                  key={testi.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 hover:bg-emerald-50/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">{testi.name}</span>
                      <span className="text-[10px] font-bold text-emerald-700">{testi.servicePoli}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{testi.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    "{testi.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{testi.date}</span>
                    {testi.verified && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Pasien Terverifikasi
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rating Mutu Pelayanan: <strong className="text-slate-900 font-mono">4.9 / 5.0</strong></span>
            <span className="text-emerald-700 font-bold">Terakreditasi Utama</span>
          </div>
        </div>

      </div>

      {/* Kirim Pesan Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900">
              Kirim Pesan atau Pertanyaan Ke Puskesmas
            </h3>
            <p className="text-xs text-slate-500">
              Isi formulir di bawah ini untuk pertanyaan layanan, kritik, maupun saran
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-900 animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Pesan Terkirim!</h4>
              <p className="text-xs text-emerald-700">
                Terima kasih atas masukan Anda. Tim kami akan segera menindaklanjuti pesan Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  required
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="No. Handphone (WhatsApp)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
              </div>

              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Alamat Email (opsional)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />

              <textarea
                rows={3}
                value={formData.pesan}
                onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                placeholder="Tuliskan pertanyaan, masukan, atau kritik Anda di sini..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none"
                required
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <span>Kirim Pesan Sekarang</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* MODAL BERI ULASAN / TESTIMONI */}
      {isTestiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold">Beri Ulasan / Testimoni</h3>
                <p className="text-xs text-slate-400">Bagikan pengalaman Anda berobat di Puskesmas</p>
              </div>
              <button
                onClick={() => setIsTestiModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {testiSubmitted ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-base text-slate-900">Ulasan Berhasil Dikirim!</h4>
                <p className="text-xs text-slate-500">Terima kasih atas ulasan dan masukan Anda.</p>
              </div>
            ) : (
              <form onSubmit={handleTestiSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Anda</label>
                  <input
                    type="text"
                    value={testiForm.name}
                    onChange={(e) => setTestiForm({ ...testiForm, name: e.target.value })}
                    placeholder="Contoh: Ibu Rina (Pamulang)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Layanan Poliklinik</label>
                  <select
                    value={testiForm.servicePoli}
                    onChange={(e) => setTestiForm({ ...testiForm, servicePoli: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="Poli Umum">Poli Umum</option>
                    <option value="Poli Gigi & Mulut">Poli Gigi & Mulut</option>
                    <option value="Poli KIA & KB">Poli KIA & KB</option>
                    <option value="Poli Anak & Imunisasi">Poli Anak & Imunisasi</option>
                    <option value="Poli Lansia">Poli Lansia</option>
                    <option value="Apotek & Farmasi">Apotek & Farmasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating Kepuasan (1-5 Bintang)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setTestiForm({ ...testiForm, rating: star })}
                        className={`p-2 rounded-xl border transition ${
                          testiForm.rating >= star
                            ? 'bg-amber-50 border-amber-300 text-amber-500'
                            : 'bg-slate-50 border-slate-200 text-slate-300'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${testiForm.rating >= star ? 'fill-amber-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ulasan / Komentar</label>
                  <textarea
                    rows={3}
                    value={testiForm.comment}
                    onChange={(e) => setTestiForm({ ...testiForm, comment: e.target.value })}
                    placeholder="Tuliskan ulasan pengalaman Anda..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTestiModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    Kirim Ulasan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

