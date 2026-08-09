import React from 'react';
import {
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Building2,
  Instagram,
  Youtube,
  ExternalLink
} from 'lucide-react';
import { PuskesmasLogo } from './PuskesmasLogo';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-white text-slate-800 border-t border-slate-200 pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Branding & Address */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <PuskesmasLogo className="w-10 h-10 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                  Dinas Kesehatan Kota Tangerang Selatan
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                  PUSKESMAS PONDOK BENDA
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md font-normal">
              Fasilitas Kesehatan Tingkat Pertama (FKTP) melayani masyarakat Kelurahan Pondok Benda dan sekitarnya dengan pelayanan kesehatan yang ramah, profesional, dan transparan terakreditasi Utama.
            </p>

            <div className="space-y-2 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Jl. Benda Barat XIV A, Pd. Benda, Kec. Pamulang, Kota Tangerang Selatan, Banten 15416</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Hotline / Call Center (WA): 082311366261</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Email: pengaduanpkmpondokbenda@yahoo.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Menu Utama Portal</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button onClick={() => setActiveTab('beranda')} className="hover:text-emerald-700 hover:underline text-left transition">
                  Beranda Utama
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pendaftaran')} className="hover:text-emerald-700 hover:underline text-left transition">
                  Pendaftaran Online
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('antrean')} className="hover:text-emerald-700 hover:underline text-left transition">
                  Status Antrean Real-time
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('layanan')} className="hover:text-emerald-700 hover:underline text-left transition">
                  Daftar Poli & Layanan
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('jadwal')} className="hover:text-emerald-700 hover:underline text-left transition">
                  Jadwal Dokter
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('survei')} className="hover:text-emerald-700 hover:underline text-left transition">
                  Survei Kepuasan (IKM)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('petugas')} className="hover:text-emerald-700 hover:underline text-left font-medium text-slate-500 transition">
                  🔒 Login Internal Staff & Petugas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Tautan Terkait & Social Media (Matching image design) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Tautan Terkait */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-slate-900 tracking-tight">
                  Tautan Terkait
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-teal-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-xs shrink-0"></span>
                    <a href="https://tangerangselatankota.go.id/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-teal-700">
                      Pemerintah Kota Tangerang Selatan
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-xs shrink-0"></span>
                    <a href="https://dinkes.tangerangselatankota.go.id/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-teal-700">
                      Dinas Kesehatan Kota Tangerang Selatan
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-xs shrink-0"></span>
                    <a href="https://dinkes.bantenprov.go.id/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-teal-700">
                      Dinas Kesehatan Provinsi Banten
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-xs shrink-0"></span>
                    <a href="https://kemkes.go.id/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-teal-700">
                      Kementrian Kesehatan RI
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-slate-900 tracking-tight">
                  Social Media
                </h4>
                <div className="flex items-center gap-3">
                  {/* Instagram Button */}
                  <a
                    href="https://www.instagram.com/puskesmaspondokbenda?igsh=bXhmcmNhcDF0eXhp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition shadow-sm hover:scale-105"
                    title="Instagram Puskesmas Pondok Benda"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>

                  {/* Youtube Button */}
                  <a
                    href="https://www.youtube.com/@pkmpondokbenda6219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition shadow-sm hover:scale-105"
                    title="YouTube Puskesmas Pondok Benda"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                </div>
              </div>

            </div>

            {/* Hours Box */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Jam Operasional Pelayanan</span>
              </h4>

              <div className="space-y-1 text-xs text-slate-700 font-medium">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Senin - Kamis</span>
                  <span className="font-bold text-slate-900">08:00 - 14:00 WIB</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Jumat</span>
                  <span className="font-bold text-slate-900">08:00 - 11:30 WIB</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span>Sabtu</span>
                  <span className="font-bold text-slate-900">08:00 - 12:30 WIB</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>© 2026 Puskesmas Pondok Benda - Dinas Kesehatan Kota Tangerang Selatan</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 text-xs font-semibold">
            <span>Terakreditasi UTAMA</span>
            <span>•</span>
            <span>Permenpan-RB No. 14/2017</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
