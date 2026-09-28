import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PendaftaranOnline } from './components/PendaftaranOnline';
import { TiketAntreanModal } from './components/TiketAntreanModal';
import { AntreanRealtime } from './components/AntreanRealtime';
import { JadwalDokter } from './components/JadwalDokter';
import { LayananPoli } from './components/LayananPoli';
import { EdukasiBerita } from './components/EdukasiBerita';
import { InformasiView } from './components/InformasiView';
import { SurveiIKM } from './components/SurveiIKM';
import { KontakLokasi } from './components/KontakLokasi';
import { PetugasDashboard } from './components/PetugasDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AiAssistant } from './components/AiAssistant';
import { Footer } from './components/Footer';

import { PoliService, QueueTicket, DoctorSchedule, HealthArticle, Announcement, QueueStatus } from './types';
import { INITIAL_POLIS, INITIAL_DOCTORS, INITIAL_ARTICLES, INITIAL_ANNOUNCEMENTS, INITIAL_TICKETS } from './data/mockData';
import { createRmeForRegisteredPatient } from './data/rmeDatabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [infoSubSection, setInfoSubSection] = useState<string>('standar-pelayanan');
  const [beritaCategory, setBeritaCategory] = useState<string>('Semua');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const [polis, setPolis] = useState<PoliService[]>(() => {
    try {
      const saved = localStorage.getItem('puskesmas_polis_data');
      return saved ? JSON.parse(saved) : INITIAL_POLIS;
    } catch {
      return INITIAL_POLIS;
    }
  });
  const [tickets, setTickets] = useState<QueueTicket[]>(INITIAL_TICKETS);
  const [doctors, setDoctors] = useState<DoctorSchedule[]>(() => {
    try {
      const saved = localStorage.getItem('puskesmas_doctors_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((d: DoctorSchedule) => ({ ...d, photoUrl: '' }));
      }
      return INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });
  const [articles, setArticles] = useState<HealthArticle[]>(() => {
    try {
      const saved = localStorage.getItem('puskesmas_articles_data');
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('puskesmas_announcements_data');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('puskesmas_doctors_data', JSON.stringify(doctors));
    } catch {}
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem('puskesmas_polis_data', JSON.stringify(polis));
    } catch {}
  }, [polis]);

  useEffect(() => {
    try {
      localStorage.setItem('puskesmas_articles_data', JSON.stringify(articles));
    } catch {}
  }, [articles]);

  const [activeTicketModal, setActiveTicketModal] = useState<QueueTicket | null>(null);
  const [searchFilterQuery, setSearchFilterQuery] = useState<string>('');

  // Fetch initial data from Express backend
  const fetchBackendData = async () => {
    try {
      const [resPolis, resTickets, resDoctors, resArticles, resAnn] = await Promise.all([
        fetch('/api/polis').then((r) => r.json()),
        fetch('/api/antrean').then((r) => r.json()),
        fetch('/api/jadwal-dokter').then((r) => r.json()),
        fetch('/api/artikels').then((r) => r.json()),
        fetch('/api/pengumuman').then((r) => r.json()),
      ]);

      if (resPolis?.success && resPolis.data) setPolis(resPolis.data);
      if (resTickets?.success && resTickets.data) setTickets(resTickets.data);
      if (resDoctors?.success && resDoctors.data) setDoctors(resDoctors.data);
      if (resArticles?.success && resArticles.data) setArticles(resArticles.data);
      if (resAnn?.success && resAnn.data) setAnnouncements(resAnn.data);
    } catch (e) {
      console.log('Using local fallback state:', e);
    }
  };

  useEffect(() => {
    fetchBackendData();
    // Poll every 10 seconds for real-time queue sync
    const interval = setInterval(fetchBackendData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update queue status from Admin or User action
  const handleUpdateTicketStatus = async (ticketId: string, newStatus: QueueStatus) => {
    try {
      const res = await fetch(`/api/antrean/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBackendData();
      }
    } catch (e) {
      // Local optimistic update
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    }
  };

  const handleTicketCreated = (newTicket: QueueTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setSearchFilterQuery(newTicket.queueNumber);
    try {
      localStorage.setItem('puskesmas_my_tracked_ticket_num', newTicket.queueNumber);
    } catch (e) {}

    // Sinkronisasi data Rekam Medis (RME) & Antrean e-Resep Penyiapan Obat saat pasien mendaftar
    try {
      createRmeForRegisteredPatient({
        id: newTicket.id,
        queueNumber: newTicket.queueNumber,
        patientNik: newTicket.nik,
        bpjsNumber: newTicket.bpjsNumber,
        fullName: newTicket.fullName,
        birthDate: newTicket.birthDate,
        gender: newTicket.gender,
        address: newTicket.address,
        phone: newTicket.phone,
        poliId: newTicket.poliId,
        poliName: newTicket.poliName,
        doctorName: newTicket.doctorName,
        patientType: newTicket.patientType,
        chiefComplaint: newTicket.chiefComplaint,
        registrationNumber: newTicket.registrationNumber
      });
    } catch (err) {
      console.warn('Gagal sinkronisasi data awal rekam medis:', err);
    }

    setActiveTicketModal(newTicket);
    setActiveTab('antrean');
  };

  const handleSearchTicketFromHero = (query: string) => {
    setSearchFilterQuery(query);
    setActiveTab('antrean');
  };

  if (isAdminMode || activeTab === 'petugas' || activeTab === 'admin') {
    return (
      <AdminDashboard
        polis={polis}
        tickets={tickets}
        doctors={doctors}
        articles={articles}
        onUpdateStatus={handleUpdateTicketStatus}
        onRefresh={fetchBackendData}
        onCloseAdmin={() => {
          setIsAdminMode(false);
          setActiveTab('beranda');
        }}
        setArticles={setArticles}
        setDoctors={setDoctors}
        setPolis={setPolis}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        polis={polis}
        doctors={doctors}
        articles={articles}
        onSelectInfoSubsection={(sub) => {
          setInfoSubSection(sub);
          setActiveTab('informasi');
        }}
        onSelectBeritaCategory={(cat) => {
          setBeritaCategory(cat);
          setActiveTab('berita');
        }}
        onOpenQuickTicket={() => {
          if (tickets.length > 0) setActiveTicketModal(tickets[0]);
          else setActiveTab('pendaftaran');
        }}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <div className="space-y-12 pb-12">
            <Hero
              polis={polis}
              setActiveTab={setActiveTab}
              onSearchTicket={handleSearchTicketFromHero}
            />

            <div className="max-w-7xl mx-auto px-4 space-y-12">
              <AntreanRealtime
                polis={polis}
                tickets={tickets}
                onRefresh={fetchBackendData}
                searchFilterQuery={searchFilterQuery}
                onOpenTicketModal={(t) => setActiveTicketModal(t)}
              />

              <LayananPoli
                polis={polis}
                setActiveTab={setActiveTab}
              />

              <JadwalDokter
                doctors={doctors}
                setActiveTab={setActiveTab}
              />

              <EdukasiBerita
                articles={articles}
                announcements={announcements}
              />

              <SurveiIKM />

              <KontakLokasi />
            </div>
          </div>
        )}

        {activeTab === 'pendaftaran' && (
          <PendaftaranOnline
            polis={polis}
            onTicketCreated={handleTicketCreated}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'antrean' && (
          <AntreanRealtime
            polis={polis}
            tickets={tickets}
            onRefresh={fetchBackendData}
            searchFilterQuery={searchFilterQuery}
            onOpenTicketModal={(t) => setActiveTicketModal(t)}
          />
        )}

        {activeTab === 'layanan' && (
          <LayananPoli
            polis={polis}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'jadwal' && (
          <JadwalDokter
            doctors={doctors}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'berita' && (
          <EdukasiBerita
            articles={articles}
            announcements={announcements}
            initialCategory={beritaCategory}
          />
        )}

        {activeTab === 'informasi' && (
          <InformasiView
            initialSubSection={infoSubSection}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'survei' && <SurveiIKM />}

        {activeTab === 'kontak' && <KontakLokasi />}
      </main>

      {/* AI Health Assistant Floating Widget */}
      <AiAssistant />

      {/* E-Ticket Modal Dialog */}
      {activeTicketModal && (
        <TiketAntreanModal
          ticket={activeTicketModal}
          onClose={() => setActiveTicketModal(null)}
          onGoToAntrean={() => setActiveTab('antrean')}
          onRegisterAnother={() => setActiveTab('pendaftaran')}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
