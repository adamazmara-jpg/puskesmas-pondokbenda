import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Tv,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { HealthArticle } from '../types';

export interface EduVideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  youtubeId: string;
  description: string;
}

export const DEFAULT_EDU_VIDEOS: EduVideoItem[] = [
  {
    id: 'vid-b3',
    title: 'Simulasi Penanganan Tumpahan B3 di UPTD Puskesmas Pondok Benda',
    category: 'Keselamatan & K3',
    duration: '04:12',
    youtubeId: 'dYSmq6aBd7k',
    description: 'Prosedur tanggap darurat penggunaan APD dan Spill Kit saat terjadi insiden tumpahan bahan berbahaya di lingkungan Puskesmas.'
  },
  {
    id: 'vid-gempa',
    title: 'Simulasi Evakuasi Gempa Bumi di UPTD Puskesmas Pondok Benda',
    category: 'Mitigasi Bencana',
    duration: '03:45',
    youtubeId: '1XENj4XlTZ0',
    description: 'Panduan keselamatan Drop, Cover, Hold On dan jalur evakuasi menuju Titik Kumpul (Assembly Point).'
  },
  {
    id: 'vid-codered',
    title: 'Simulasi Code Red (Tanggap Darurat Kebakaran) di Puskesmas Pondok Benda',
    category: 'Simulasi Darurat',
    duration: '03:20',
    youtubeId: 'BpRcZYbcMnw',
    description: 'Kesiapsiagaan pemadaman api menggunakan APAR, evakuasi pasien, dan penyelamatan dokumen rekam medis.'
  },
  {
    id: 'vid-codeblue',
    title: 'Simulasi Code Blue (Emergency Medis & Henti Jantung) di Puskesmas Pondok Benda',
    category: 'Resusitasi & Medis',
    duration: '04:05',
    youtubeId: 'eAlBrKaqpdc',
    description: 'Sistem aktivasi respon cepat kegawatdaruratan medis, Bantuan Hidup Dasar (BHD), dan resusitasi pasien gawat darurat.'
  },
  {
    id: 'vid-germas',
    title: 'Edukasi GERMAS & 6 Langkah Cuci Tangan Bersih Kemenkes RI',
    category: 'Promosi Kesehatan',
    duration: '02:50',
    youtubeId: '7L_q1J3i0eI',
    description: 'Edukasi pola hidup bersih dan sehat, etika batuk yang benar, serta 6 langkah cuci tangan dengan sabun.'
  }
];

export function extractEduVideos(articles?: HealthArticle[]): EduVideoItem[] {
  const customVideos: EduVideoItem[] = [];
  if (Array.isArray(articles)) {
    articles.forEach((art) => {
      if (art.isVideo && art.videoUrl) {
        let yId = '';
        if (art.videoUrl.includes('youtube.com/embed/')) {
          yId = art.videoUrl.split('youtube.com/embed/')[1]?.split('?')[0] || '';
        } else if (art.videoUrl.includes('watch?v=')) {
          yId = art.videoUrl.split('watch?v=')[1]?.split('&')[0] || '';
        } else if (art.videoUrl.includes('youtu.be/')) {
          yId = art.videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
        }
        if (yId && !DEFAULT_EDU_VIDEOS.some((v) => v.youtubeId === yId)) {
          customVideos.push({
            id: art.id,
            title: art.title,
            category: art.category || 'Video Edukasi',
            duration: art.readTime || 'Video',
            youtubeId: yId,
            description: art.snippet || (art.content ? art.content.slice(0, 100) + '...' : 'Video edukasi kesehatan')
          });
        }
      }
    });
  }
  return [...DEFAULT_EDU_VIDEOS, ...customVideos];
}

interface EducationalTvPlayerProps {
  videos?: EduVideoItem[];
  activeVideoId?: string;
  onSelectVideo?: (id: string) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  pauseOnScrollOut?: boolean;
  autoPlayNext?: boolean;
  showPlaylistSelector?: boolean;
  compactMode?: boolean;
  titlePrefix?: string;
  className?: string;
}

export const EducationalTvPlayer: React.FC<EducationalTvPlayerProps> = React.memo(
  function EducationalTvPlayer({
    videos = DEFAULT_EDU_VIDEOS,
    activeVideoId,
    onSelectVideo,
    isMuted: propIsMuted,
    onToggleMute: propOnToggleMute,
    pauseOnScrollOut = false,
    autoPlayNext = true,
    showPlaylistSelector = true,
    compactMode = false,
    titlePrefix = 'TV Edukasi Siaga Puskesmas',
    className = ''
  }) {
    const videoList = videos.length > 0 ? videos : DEFAULT_EDU_VIDEOS;

    const [internalIndex, setInternalIndex] = useState<number>(0);
    const [internalMuted, setInternalMuted] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isPausedByScroll, setIsPausedByScroll] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    const isMuted = typeof propIsMuted === 'boolean' ? propIsMuted : internalMuted;
    const toggleMute = propOnToggleMute || (() => setInternalMuted((prev) => !prev));

    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const currentIndex = useMemo(() => {
      if (activeVideoId) {
        const found = videoList.findIndex((v) => v.id === activeVideoId);
        if (found !== -1) return found;
      }
      return internalIndex >= 0 && internalIndex < videoList.length ? internalIndex : 0;
    }, [activeVideoId, internalIndex, videoList]);

    const currentVideo = videoList[currentIndex] || videoList[0];

    const handleSelectIndex = useCallback(
      (idx: number) => {
        const targetIdx = (idx + videoList.length) % videoList.length;
        setInternalIndex(targetIdx);
        if (onSelectVideo) {
          onSelectVideo(videoList[targetIdx].id);
        }
      },
      [videoList, onSelectVideo]
    );

    const handleNextVideo = useCallback(() => {
      handleSelectIndex(currentIndex + 1);
    }, [currentIndex, handleSelectIndex]);

    const handlePrevVideo = useCallback(() => {
      handleSelectIndex(currentIndex - 1);
    }, [currentIndex, handleSelectIndex]);

    const sendIframeCommand = useCallback((func: string, args: any[] = []) => {
      if (!iframeRef.current?.contentWindow) return;
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args
          }),
          '*'
        );
      } catch (e) {}
    }, []);

    const toggleFullscreen = () => {
      if (!containerRef.current) return;
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    };

    useEffect(() => {
      const handleFsChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFsChange);
      return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, []);

    // 1. SEQUENTIAL AUTO-ADVANCE: Video 1 selesai otomatis lanjut Video 2 dst
    useEffect(() => {
      if (!autoPlayNext) return;

      const handleYouTubeMessage = (event: MessageEvent) => {
        try {
          let data = event.data;
          if (typeof data === 'string') {
            data = JSON.parse(data);
          }
          if (data && (data.event === 'onStateChange' || data.info !== undefined)) {
            if (data.info === 0 || data.info?.playerState === 0) {
              handleNextVideo();
            }
          }
        } catch (e) {}
      };

      window.addEventListener('message', handleYouTubeMessage);
      return () => window.removeEventListener('message', handleYouTubeMessage);
    }, [autoPlayNext, handleNextVideo]);

    // 2. SCROLL-OUT AUTO-PAUSE: Video mati otomatis saat scroll ke bawah
    useEffect(() => {
      if (!pauseOnScrollOut) return;

      const el = containerRef.current;
      if (!el || typeof IntersectionObserver === 'undefined') return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            setIsPausedByScroll(true);
            setIsPlaying(false);
            sendIframeCommand('pauseVideo');
          } else {
            setIsPausedByScroll(false);
            setIsPlaying(true);
            sendIframeCommand('playVideo');
          }
        },
        { threshold: 0.15 }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [pauseOnScrollOut, sendIframeCommand]);

    const togglePlayPause = () => {
      if (isPlaying) {
        sendIframeCommand('pauseVideo');
        setIsPlaying(false);
      } else {
        sendIframeCommand('playVideo');
        setIsPlaying(true);
        setIsPausedByScroll(false);
      }
    };

    const embedUrl = `https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?autoplay=1&mute=${
      isMuted ? 1 : 0
    }&enablejsapi=1&playsinline=1&rel=0&modestbranding=1`;

    return (
      <div
        ref={containerRef}
        className={`bg-white rounded-2xl sm:rounded-3xl border-2 border-emerald-300 overflow-hidden shadow-xl flex flex-col ${
          isFullscreen ? 'p-4 justify-between h-full bg-slate-900 text-white' : ''
        } ${className}`}
      >
        {/* Top Header of TV Player (Putih & Hijau Muda Theme) */}
        <div className="px-3 sm:px-4 py-2.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white border-b border-emerald-500/40 flex items-center justify-between gap-2 text-xs shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-400"></span>
            </span>
            <div className="flex items-center gap-1.5 min-w-0 font-black tracking-tight text-white uppercase text-[10px] sm:text-xs">
              <Tv className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              <span className="truncate">{titlePrefix}</span>
            </div>
            {autoPlayNext && (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>Auto-Lanjut ({currentIndex + 1}/{videoList.length})</span>
              </span>
            )}
          </div>

          {/* Controls: Prev, Next, Mute, Play/Pause, Fullscreen */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Prev Video Button */}
            <button
              type="button"
              onClick={handlePrevVideo}
              className="p-1 sm:p-1.5 bg-emerald-800/80 hover:bg-emerald-900 text-white rounded-xl transition border border-emerald-600/60 shadow-2xs cursor-pointer"
              title="Video Sebelumnya"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlayPause}
              className="p-1 sm:p-1.5 bg-emerald-800/80 hover:bg-emerald-900 text-white rounded-xl transition border border-emerald-600/60 shadow-2xs cursor-pointer"
              title={isPlaying ? 'Jeda Video' : 'Putar Video'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-300" /> : <Play className="w-3.5 h-3.5 text-emerald-200" />}
            </button>

            {/* Next Video Button */}
            <button
              type="button"
              onClick={handleNextVideo}
              className="p-1 sm:p-1.5 bg-emerald-800/80 hover:bg-emerald-900 text-white rounded-xl transition border border-emerald-600/60 shadow-2xs cursor-pointer"
              title="Video Berikutnya"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Audio Mute/Unmute */}
            <button
              type="button"
              onClick={toggleMute}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
                isMuted
                  ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700 hover:bg-emerald-950'
                  : 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-amber-400/20'
              }`}
              title={isMuted ? 'Nyalakan Audio Video' : 'Mute Audio Video'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-slate-950" />}
              <span className="hidden xs:inline">{isMuted ? 'Mute' : 'Audio On'}</span>
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1 sm:p-1.5 bg-emerald-800/80 hover:bg-emerald-900 text-white rounded-xl transition border border-emerald-600/60 shadow-2xs cursor-pointer"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh TV'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Video Screen (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <iframe
            ref={iframeRef}
            key={`${currentVideo.youtubeId}-${isMuted ? 'muted' : 'unmuted'}`}
            src={embedUrl}
            title={currentVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Auto-Pause Scroll Indicator Overlay */}
          {isPausedByScroll && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-2 animate-in fade-in duration-200 border border-emerald-200">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-full border border-amber-300 shadow-sm">
                <Pause className="w-6 h-6 text-amber-600 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  Video Dijeda Otomatis
                </h5>
                <p className="text-[11px] text-slate-600 max-w-xs leading-relaxed">
                  Video edukasi dijeda saat Anda melihat antrean di bawah. Gulir kembali ke sini atau klik tombol di bawah untuk melanjutkan.
                </p>
              </div>
              <button
                type="button"
                onClick={togglePlayPause}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Lanjutkan Putar Video</span>
              </button>
            </div>
          )}
        </div>

        {/* Video Info & Playlist Selector Bar (Tema Putih & Hijau Muda) */}
        {!compactMode && (
          <div className="p-3.5 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border-t border-emerald-200 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {currentVideo.category}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono font-bold">
                    ⏱️ {currentVideo.duration}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                    Playlist {currentIndex + 1} dari {videoList.length}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1" title={currentVideo.title}>
                  {currentVideo.title}
                </h4>
              </div>

              {/* Quick Switch Dropdown */}
              {showPlaylistSelector && (
                <div className="shrink-0 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-600 font-bold hidden sm:inline">Pilih Video:</span>
                  <select
                    value={currentVideo.id}
                    onChange={(e) => {
                      const idx = videoList.findIndex((v) => v.id === e.target.value);
                      if (idx !== -1) handleSelectIndex(idx);
                    }}
                    className="bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer max-w-[220px] truncate shadow-2xs"
                  >
                    {videoList.map((vid, i) => (
                      <option key={vid.id} value={vid.id}>
                        {i + 1}. {vid.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
              {currentVideo.description}
            </p>
          </div>
        )}
      </div>
    );
  }
);
