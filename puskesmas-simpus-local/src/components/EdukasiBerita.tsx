import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  User,
  Clock,
  Sparkles,
  Search,
  Award,
  ShieldCheck,
  ArrowRight,
  X,
  Share2,
  Play,
  Video,
  Youtube
} from 'lucide-react';
import { HealthArticle, Announcement } from '../types';

interface EdukasiBeritaProps {
  articles: HealthArticle[];
  announcements: Announcement[];
  initialCategory?: string;
}

export const EdukasiBerita: React.FC<EdukasiBeritaProps> = ({
  articles,
  announcements,
  initialCategory = 'Semua',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeArticle, setActiveArticle] = useState<HealthArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Sync initialCategory if changed externally
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    'Semua',
    'Tips Kesehatan',
    'Pengumuman',
    'Info Penyakit',
    'Video Edukasi',
    'Posyandu',
    'Edukasi',
    'Vaksinasi',
    'Tips Sehat'
  ];

  const filteredArticles = articles.filter((art) => {
    let matchCat = selectedCategory === 'Semua';
    if (!matchCat) {
      if (selectedCategory === 'Tips Kesehatan' || selectedCategory === 'Tips Sehat') {
        matchCat =
          art.category === 'Tips Kesehatan' ||
          art.category === 'Tips Sehat' ||
          art.title.toLowerCase().includes('tips') ||
          art.snippet.toLowerCase().includes('tips') ||
          art.content.toLowerCase().includes('tips');
      } else if (selectedCategory === 'Pengumuman') {
        matchCat =
          art.category === 'Pengumuman' ||
          art.title.toLowerCase().includes('pengumuman') ||
          art.title.toLowerCase().includes('jadwal') ||
          art.title.toLowerCase().includes('himbauan');
      } else if (selectedCategory === 'Info Penyakit') {
        matchCat =
          art.category === 'Info Penyakit' ||
          art.title.toLowerCase().includes('penyakit') ||
          art.title.toLowerCase().includes('influenza') ||
          art.title.toLowerCase().includes('gejala') ||
          art.title.toLowerCase().includes('dbd') ||
          art.title.toLowerCase().includes('hipertensi') ||
          art.snippet.toLowerCase().includes('penyakit');
      } else {
        matchCat = art.category === selectedCategory;
      }
    }

    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.snippet.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q);

    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pusat Edukasi Kesehatan & Informasi Masyarakat</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Berita & Edukasi Kesehatan Tangsel
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
          Dapatkan tips kesehatan terpercaya, pengumuman jadwal kegiatan Posyandu, program vaksinasi, dan imbauan kesehatan dari Dinas Kesehatan Kota Tangerang Selatan.
        </p>
      </div>

      {/* Mutu & Pelayanan Publik PermenPAN-RB & Akreditasi Section */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-5 sm:p-6 rounded-2xl border border-emerald-700/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/70 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block">
                Puskesmas Pondok Benda
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold text-white">
                Standar Penilaian Mutu & Pelayanan Publik (PermenPAN-RB)
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl border border-emerald-300/40 shadow-md shrink-0 w-fit">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Terakreditasi Utama (Kemenkes RI)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-800/70 space-y-2 hover:border-emerald-400/60 transition"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 bg-emerald-900 text-emerald-200 font-bold border border-emerald-700/80 rounded">
                  {ann.category}
                </span>
                <span className="text-emerald-300/80 font-medium text-[10px]">{ann.date}</span>
              </div>
              <h4 className="font-extrabold text-xs text-white leading-snug">{ann.title}</h4>
              <p className="text-[11px] text-emerald-100/90 leading-relaxed">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Articles Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel kesehatan..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.map((art) => {
          const isPlayingThisVideo = playingVideoId === art.id;

          return (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Media Thumbnail or Video Embed */}
                <div className="relative h-52 overflow-hidden bg-slate-900 group">
                  {art.isVideo && isPlayingThisVideo && art.videoUrl ? (
                    <div className="relative w-full h-full">
                      <iframe
                        src={`${art.videoUrl}?autoplay=1`}
                        title={art.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideoId(null);
                        }}
                        className="absolute top-2 right-2 bg-slate-900/90 hover:bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 flex items-center gap-1 shadow-md border border-slate-700"
                      >
                        <X className="w-3 h-3" />
                        <span>Tutup Video</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      className="w-full h-full relative cursor-pointer"
                      onClick={() => {
                        if (art.isVideo && art.videoUrl) {
                          setPlayingVideoId(art.id);
                        } else {
                          setActiveArticle(art);
                        }
                      }}
                    >
                      <img
                        src={art.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600'}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Video Overlay Play Button if isVideo */}
                      {art.isVideo && (
                        <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/30 transition flex flex-col items-center justify-center gap-2">
                          <div className="w-14 h-14 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition border-2 border-white/80">
                            <Play className="w-7 h-7 fill-white ml-0.5" />
                          </div>
                          <span className="text-[11px] font-extrabold text-white bg-slate-900/80 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-white/20">
                            Klik Untuk Memutar Video
                          </span>
                        </div>
                      )}

                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold rounded-md shadow-sm border ${
                          art.badgeColor || 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {art.category}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className="p-5 space-y-2 cursor-pointer"
                  onClick={() => setActiveArticle(art)}
                >
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      {art.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {art.snippet}
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveArticle(art)}
                className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 hover:bg-emerald-50/60 transition"
              >
                <span>{art.isVideo ? 'Lihat Rincian & Video' : 'Baca Selengkapnya'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Article / Video Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col">
            
            {/* Modal Media Frame */}
            <div className="relative h-64 bg-slate-950 shrink-0">
              {activeArticle.isVideo && activeArticle.videoUrl ? (
                <iframe
                  src={`${activeArticle.videoUrl}?autoplay=1`}
                  title={activeArticle.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover opacity-80"
                />
              )}

              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 bg-slate-900/90 hover:bg-slate-950 text-white p-2 rounded-full backdrop-blur-xs transition z-20 border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              {!activeArticle.isVideo && (
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded">
                    {activeArticle.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1 leading-tight">
                    {activeArticle.title}
                  </h3>
                </div>
              )}
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium border-b border-slate-100 pb-3">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  {activeArticle.author}
                </span>
                <span>{activeArticle.date}</span>
              </div>

              {activeArticle.isVideo && (
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {activeArticle.title}
                </h3>
              )}

              <p className="font-semibold text-slate-900 leading-relaxed">
                {activeArticle.snippet}
              </p>

              <p>{activeArticle.content}</p>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1">
                <div className="font-bold">Informasi Lebih Lanjut:</div>
                <p>
                  Silakan datang langsung ke Puskesmas Pondok Benda di Jl. Benda Barat XIV A, Pd. Benda, Kec. Pamulang, Kota Tangerang Selatan, Banten 15416 atau hubungi Customer Service kami via Hotline WA 082311366261.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
