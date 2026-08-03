import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ExecutiveSummaryCards } from './components/ExecutiveSummaryCards';
import { FilterSection } from './components/FilterSection';
import { ChartsSection } from './components/ChartsSection';
import { DataTable } from './components/DataTable';
import { EbyConnectView } from './components/EbyConnectView';
import { DaftarHadirView } from './components/DaftarHadirView';
import { FormInputGiatModal } from './components/FormInputGiatModal';
import { DetailModal } from './components/DetailModal';
import { GoogleFormModal } from './components/GoogleFormModal';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { SyncLogModal } from './components/SyncLogModal';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { AbsenGeneratorModal } from './components/AbsenGeneratorModal';
import { PublicAbsenView } from './components/PublicAbsenView';
import { GoogleSheetConfigModal } from './components/GoogleSheetConfigModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';

import { 
  ActivityItem, 
  EbyConnectProgram, 
  FilterState, 
  SyncLog, 
  UserRole, 
  ExecutiveSummaryStats,
  AttendanceRecord,
  GoogleSheetConfig
} from './types';

import { 
  INITIAL_ACTIVITIES, 
  INITIAL_EBY_PROGRAMS, 
  INITIAL_SYNC_LOGS,
  INITIAL_ATTENDANCE_RECORDS 
} from './data/mockData';

import { db, collection, onSnapshot, setDoc, doc, addDoc } from './lib/firebase';

export default function App() {
  // Primary Datasets State
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [ebyPrograms, setEbyPrograms] = useState<EbyConnectProgram[]>(INITIAL_EBY_PROGRAMS);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(INITIAL_SYNC_LOGS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);

  // 30-minute session expiry helper
  const THIRTY_MIN_MS = 30 * 60 * 1000;

  // Active Mode & Role
  const [activeCategoryTab, setActiveCategoryTab] = useState<'ALL' | 'MPR' | 'DPR' | 'EBY Connect' | 'daftar_hadir'>('ALL');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const isLogged = sessionStorage.getItem('isLoggedIn_senayan') === 'true';
    const lastActive = sessionStorage.getItem('senayan_auth_time');
    if (!isLogged || !lastActive) {
      sessionStorage.clear();
      return false;
    }
    if (Date.now() - Number(lastActive) > THIRTY_MIN_MS) {
      sessionStorage.clear();
      return false;
    }
    sessionStorage.setItem('senayan_auth_time', String(Date.now()));
    return true;
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = sessionStorage.getItem('userRole');
    return (saved as UserRole) || 'pimpinan';
  });
  const [userName, setUserName] = useState<string>(() => {
    const saved = sessionStorage.getItem('userName');
    return saved || 'Dr. H. Anggota DPR';
  });

  const handleLoginSuccess = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsLoggedIn(true);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('isLoggedIn_senayan', 'true');
    sessionStorage.setItem('senayan_auth_time', String(Date.now()));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('isLoggedIn_senayan');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserRole('pimpinan');
    setUserName('Dr. H. Anggota DPR');
  };

  // Activity & 30-minute Inactivity Session Listener
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleUserActivity = () => {
      const lastActive = sessionStorage.getItem('senayan_auth_time');
      if (lastActive && Date.now() - Number(lastActive) > THIRTY_MIN_MS) {
        handleLogout();
      } else {
        sessionStorage.setItem('senayan_auth_time', String(Date.now()));
      }
    };

    const interval = setInterval(handleUserActivity, 60000);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [isLoggedIn]);

  // URL Parameter Check for Public Absen Mode (e.g. ?absen=G-2026-001)
  const [publicAbsenActivityId, setPublicAbsenActivityId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const absenId = urlParams.get('absen');
    if (absenId) {
      setPublicAbsenActivityId(absenId);
    }
  }, []);

  // Google Sheet Configuration
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>({
    senayanSheetUrl: 'https://docs.google.com/spreadsheets/d/19pm_prz5Pu5F5uxXXo4pk0i_915SGqKO/edit',
    ebySheetUrl: 'https://docs.google.com/spreadsheets/d/1ymkvImybklzu36t08M60LiR3FlLx9YSR/edit',
    lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  });

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    tahun: 'ALL',
    kategoriGiat: 'ALL',
    jenisGiat: 'ALL',
    temaGiat: 'ALL',
    segmentasiPeserta: 'ALL',
    instansi: 'ALL',
    searchQuery: '',
    kabupaten: 'ALL',
  });

  // Syncing & Timestamps State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  );

  // Modal States
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [isGoogleFormModalOpen, setIsGoogleFormModalOpen] = useState<boolean>(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState<boolean>(false);
  const [isSyncLogModalOpen, setIsSyncLogModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAbsenGeneratorOpen, setIsAbsenGeneratorOpen] = useState<boolean>(false);
  const [selectedActivityForAbsen, setSelectedActivityForAbsen] = useState<ActivityItem | null>(null);
  const [isSheetConfigOpen, setIsSheetConfigOpen] = useState<boolean>(false);
  const [isDeploymentGuideOpen, setIsDeploymentGuideOpen] = useState<boolean>(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);
  const [isFormInputGiatOpen, setIsFormInputGiatOpen] = useState<boolean>(false);

  // Firestore Real-Time Listener for Activities
  useEffect(() => {
    let unsubscribe: () => void;
    try {
      const actRef = collection(db, 'activities');
      unsubscribe = onSnapshot(actRef, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: ActivityItem[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as ActivityItem);
          });
          setActivities(prev => {
            const map = new Map<string, ActivityItem>();
            prev.forEach(a => map.set(a.id, a));
            loaded.forEach(a => map.set(a.id, a));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn('Firestore offline or snapshot error, fallback to local state:', err);
      });
    } catch (e) {
      console.warn('Firestore init error:', e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Firestore Real-Time Listener for Attendance
  useEffect(() => {
    let unsubscribe: () => void;
    try {
      const attRef = collection(db, 'attendance');
      unsubscribe = onSnapshot(attRef, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: AttendanceRecord[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as AttendanceRecord);
          });
          setAttendanceRecords(prev => {
            const map = new Map<string, AttendanceRecord>();
            prev.forEach(r => map.set(r.id, r));
            loaded.forEach(r => map.set(r.id, r));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn('Firestore attendance offline or snapshot error:', err);
      });
    } catch (e) {
      console.warn('Firestore attendance init error:', e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Sync Tab Switcher with Filter State
  const handleTabChange = (tab: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect' | 'daftar_hadir') => {
    setActiveCategoryTab(tab);
    if (tab === 'MPR') {
      setFilter(prev => ({ ...prev, kategoriGiat: 'MPR' }));
    } else if (tab === 'DPR') {
      setFilter(prev => ({ ...prev, kategoriGiat: 'DPR' }));
    } else if (tab === 'EBY Connect') {
      setFilter(prev => ({ ...prev, kategoriGiat: 'EBY Connect' }));
    } else {
      setFilter(prev => ({ ...prev, kategoriGiat: 'ALL' }));
    }
  };

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Category mode filter
      if (activeCategoryTab === 'MPR' && activity.kategoriGiat !== 'MPR') return false;
      if (activeCategoryTab === 'DPR' && activity.kategoriGiat !== 'DPR') return false;
      if (activeCategoryTab === 'EBY Connect' && activity.kategoriGiat !== 'EBY Connect') return false;

      // Filter state dropdowns
      if (filter.tahun !== 'ALL' && activity.tahun !== filter.tahun) return false;
      if (filter.kategoriGiat !== 'ALL' && activity.kategoriGiat !== filter.kategoriGiat) return false;
      if (filter.jenisGiat !== 'ALL' && activity.jenisGiat !== filter.jenisGiat) return false;
      if (filter.temaGiat !== 'ALL' && activity.temaGiat !== filter.temaGiat) return false;
      if (filter.segmentasiPeserta !== 'ALL' && activity.segmentasiPeserta !== filter.segmentasiPeserta) return false;
      if (filter.instansi !== 'ALL' && activity.asalInstansi !== filter.instansi) return false;

      // Search Query
      if (filter.searchQuery.trim() !== '') {
        const queryStr = filter.searchQuery.toLowerCase();
        const matchTitle = activity.namaGiat.toLowerCase().includes(queryStr);
        const matchInst = activity.asalInstansi.toLowerCase().includes(queryStr);
        const matchTema = activity.temaGiat.toLowerCase().includes(queryStr);
        const matchPeserta = activity.namaPeserta.toLowerCase().includes(queryStr);
        const matchJenis = activity.jenisGiat.toLowerCase().includes(queryStr);

        if (!matchTitle && !matchInst && !matchTema && !matchPeserta && !matchJenis) {
          return false;
        }
      }

      return true;
    });
  }, [activities, filter, activeCategoryTab]);

  // Executive Summary Statistics (reflects current tab + filter selection — used for content cards)
  const stats: ExecutiveSummaryStats = useMemo(() => {
    const totalGiat = filteredActivities.length;
    const totalPeserta = filteredActivities.reduce((sum, a) => sum + a.jumlahPeserta, 0);
    const totalInstansi = new Set(filteredActivities.map(a => a.asalInstansi)).size;
    const totalSegmentasi = new Set(filteredActivities.map(a => a.segmentasiPeserta)).size;
    const totalTema = new Set(filteredActivities.map(a => a.temaGiat)).size;

    const giatMPR = filteredActivities.filter(a => a.kategoriGiat === 'MPR').length;
    const giatDPR = filteredActivities.filter(a => a.kategoriGiat === 'DPR').length;
    const giatEBY = filteredActivities.filter(a => a.kategoriGiat === 'EBY Connect').length;

    const denominator = giatMPR + giatDPR || 1;
    const percentMPR = Math.round((giatMPR / denominator) * 100);
    const percentDPR = Math.round((giatDPR / denominator) * 100);

    return {
      totalGiat,
      totalPeserta,
      totalInstansi,
      totalSegmentasi,
      totalTema,
      giatMPR,
      giatDPR,
      giatEBY,
      percentMPR,
      percentDPR,
    };
  }, [filteredActivities]);

  // Global Stats — always from ALL activities regardless of active tab.
  // Used exclusively for sidebar badge counts so they never change when switching tabs.
  const globalStats: ExecutiveSummaryStats = useMemo(() => {
    const giatMPR = activities.filter(a => a.kategoriGiat === 'MPR').length;
    const giatDPR = activities.filter(a => a.kategoriGiat === 'DPR').length;
    const giatEBY = activities.filter(a => a.kategoriGiat === 'EBY Connect').length;
    const totalGiat = activities.length;
    const totalPeserta = activities.reduce((sum, a) => sum + a.jumlahPeserta, 0);
    const totalInstansi = new Set(activities.map(a => a.asalInstansi)).size;
    const totalSegmentasi = new Set(activities.map(a => a.segmentasiPeserta)).size;
    const totalTema = new Set(activities.map(a => a.temaGiat)).size;
    const denominator = giatMPR + giatDPR || 1;
    const percentMPR = Math.round((giatMPR / denominator) * 100);
    const percentDPR = Math.round((giatDPR / denominator) * 100);
    return { totalGiat, totalPeserta, totalInstansi, totalSegmentasi, totalTema, giatMPR, giatDPR, giatEBY, percentMPR, percentDPR };
  }, [activities]);

  // Handlers for Add, Update & Sync
  const handleAddNewActivity = async (newAct: ActivityItem) => {
    setActivities(prev => [newAct, ...prev]);

    // Automatically create attendance record matching Google Sheets format
    const newAttendance: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      activityId: newAct.id,
      tahun: newAct.tahun || '2026',
      kategoriGiat: newAct.kategoriGiat,
      jenisGiat: newAct.jenisGiat,
      temaGiat: newAct.temaGiat,
      namaGiat: newAct.namaGiat,
      namaPeserta: newAct.namaPeserta || 'Peserta Giat',
      instansi: newAct.asalInstansi || '—',
      segmentasiPeserta: newAct.segmentasiPeserta || 'Umum',
      kontak: newAct.kontak || '—',
      waktuHadir: new Date().toISOString().replace('T', ' ').slice(0, 16),
      statusKehadiran: 'Hadir',
    };
    setAttendanceRecords(prev => [newAttendance, ...prev]);

    // Save both to Firestore
    try {
      await setDoc(doc(db, 'activities', newAct.id), newAct);
      await setDoc(doc(db, 'attendance', newAttendance.id), newAttendance);
    } catch (e) {
      console.warn('Firestore write error:', e);
    }

    const log: SyncLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      source: 'Google Form',
      status: 'Success',
      recordsCount: 1,
      description: `Input kegiatan baru: "${newAct.namaGiat}"`
    };
    setSyncLogs(prev => [log, ...prev]);
  };

  const handleUpdateActivity = async (updated: ActivityItem) => {
    setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
    if (selectedActivity && selectedActivity.id === updated.id) {
      setSelectedActivity(updated);
    }
    try {
      await setDoc(doc(db, 'activities', updated.id), updated);
    } catch (e) {
      console.warn('Firestore update error:', e);
    }
  };

  const handleExcelImportSuccess = async (importedActivities: ActivityItem[]) => {
    setActivities(prev => [...importedActivities, ...prev]);

    // Save imported activities to Firestore
    for (const act of importedActivities) {
      try {
        await setDoc(doc(db, 'activities', act.id), act);
      } catch (e) {
        console.warn('Firestore write error:', e);
      }
    }

    const log: SyncLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      source: 'Excel Upload',
      status: 'Success',
      recordsCount: importedActivities.length,
      description: `Import Excel berhasil menyorot ${importedActivities.length} data kegiatan.`
    };
    setSyncLogs(prev => [log, ...prev]);
  };

  const handleTriggerAutoSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1200));

    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setLastSyncTime(timestamp);
    setIsSyncing(false);

    const log: SyncLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      source: 'Google Sheet Auto-Sync',
      status: 'Success',
      recordsCount: activities.length,
      description: 'Auto-sync dengan Cloud Spreadsheet & Firestore berhasil dilaksanakan.'
    };
    setSyncLogs(prev => [log, ...prev]);
  };

  const handleSubmitAttendance = async (record: Omit<AttendanceRecord, 'id'>) => {
    const matchedActivity = activities.find(a => a.id === record.activityId);
    const fullRecord: AttendanceRecord = {
      ...record,
      id: `ATT-${Date.now()}`,
      tahun: record.tahun || matchedActivity?.tahun || '2026',
      kategoriGiat: record.kategoriGiat || matchedActivity?.kategoriGiat || 'MPR',
      jenisGiat: record.jenisGiat || matchedActivity?.jenisGiat || 'FDA',
      temaGiat: record.temaGiat || matchedActivity?.temaGiat || 'Umum',
      namaGiat: record.namaGiat || matchedActivity?.namaGiat || 'Kegiatan Senayan',
      segmentasiPeserta: record.segmentasiPeserta || matchedActivity?.segmentasiPeserta || 'Umum',
    };
    setAttendanceRecords(prev => [fullRecord, ...prev]);

    // Save attendance to Firestore
    try {
      await setDoc(doc(db, 'attendance', fullRecord.id), fullRecord);
    } catch (e) {
      console.warn('Firestore attendance save error:', e);
    }

    // Increment activity participant count in state & Firestore
    if (matchedActivity) {
      const updatedAct = { ...matchedActivity, jumlahPeserta: matchedActivity.jumlahPeserta + 1 };
      setActivities(prev => prev.map(a => a.id === matchedActivity.id ? updatedAct : a));
      try {
        await setDoc(doc(db, 'activities', matchedActivity.id), updatedAct);
      } catch (e) {
        console.warn('Firestore activity update error:', e);
      }
    }
  };

  // Render Public Absen Page if URL query param exists
  if (publicAbsenActivityId) {
    const matchedActivity = activities.find(a => a.id === publicAbsenActivityId) || activities[0];
    return (
      <PublicAbsenView
        activity={matchedActivity}
        onBackToDashboard={() => {
          // Remove query string from URL without full reload
          window.history.pushState({}, document.title, window.location.pathname);
          setPublicAbsenActivityId(null);
        }}
        onSubmitAttendance={handleSubmitAttendance}
      />
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between antialiased">
      {/* Header Bar */}
      <Header
        activeCategoryTab={activeCategoryTab}
        setActiveCategoryTab={handleTabChange}
        userRole={userRole}
        userName={userName}
        searchQuery={filter.searchQuery}
        onSearchQueryChange={(q) => setFilter(prev => ({...prev, searchQuery: q}))}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenGoogleFormModal={() => setIsGoogleFormModalOpen(true)}
        onOpenExcelModal={() => setIsExcelModalOpen(true)}
        onOpenSyncLogModal={() => setIsSyncLogModalOpen(true)}
        onOpenAbsenGeneratorModal={() => setIsAbsenGeneratorOpen(true)}
        onOpenSheetConfigModal={() => setIsSheetConfigOpen(true)}
        onOpenDeploymentGuideModal={() => setIsDeploymentGuideOpen(true)}
        onTriggerAutoSync={handleTriggerAutoSync}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        onToggleMobileSidebar={() => setIsSidebarMobileOpen(true)}
      />

      {/* Main Body Container with Left Sidebar & Right Content */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row gap-0">
        {/* Left Sidebar Menu */}
        <Sidebar
          activeCategoryTab={activeCategoryTab}
          setActiveCategoryTab={handleTabChange}
          userRole={userRole}
          userName={userName}
          stats={globalStats}
          totalEbyPrograms={ebyPrograms.length}
          totalAttendanceRecords={attendanceRecords.length}
          isOpenMobile={isSidebarMobileOpen}
          setIsOpenMobile={setIsSidebarMobileOpen}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 py-3.5 sm:py-4 min-w-0">
          
          {/* Filter Section */}
          {activeCategoryTab !== 'EBY Connect' && activeCategoryTab !== 'daftar_hadir' && (
            <FilterSection
              filter={filter}
              setFilter={setFilter}
              activities={activities}
            />
          )}

          {/* Executive Summary Cards */}
          {activeCategoryTab !== 'daftar_hadir' && (
            <ExecutiveSummaryCards
              stats={stats}
              activeCategoryTab={activeCategoryTab}
              totalEbyPrograms={ebyPrograms.length}
              totalEbyPenerima={ebyPrograms.reduce((sum, p) => sum + p.jumlahPenerima, 0)}
            />
          )}

          {/* View Switcher: EBY Connect View vs Daftar Hadir View vs Giat Senayan View */}
          {activeCategoryTab === 'daftar_hadir' ? (
            <DaftarHadirView
              attendanceRecords={attendanceRecords}
              activities={activities}
              userRole={userRole}
              onOpenAbsenGenerator={() => setIsAbsenGeneratorOpen(true)}
              onOpenFormInputGiat={() => setIsFormInputGiatOpen(true)}
            />
          ) : activeCategoryTab === 'EBY Connect' ? (
            <EbyConnectView
              programs={ebyPrograms}
              onUpdatePrograms={setEbyPrograms}
              globalSearchQuery={filter.searchQuery}
              onGlobalSearchChange={(q) => setFilter(prev => ({...prev, searchQuery: q}))}
              userRole={userRole}
            />
          ) : (
            <>
              {/* Analytics & Charts */}
              <ChartsSection
                filteredActivities={filteredActivities}
                activities={filteredActivities}
                activeCategoryTab={activeCategoryTab}
              />

              {/* Data Table */}
              <DataTable
                activities={filteredActivities}
                onSelectActivity={setSelectedActivity}
                onGenerateAbsenForActivity={(act) => {
                  setSelectedActivityForAbsen(act);
                  setIsAbsenGeneratorOpen(true);
                }}
                userRole={userRole}
              />
            </>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-5 border-t border-slate-800 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="text-slate-300 font-medium">
            <strong className="text-white font-bold">Dashboard Monitoring Giat Senayan & EBY Connect</strong> • Giat MPR, DPR & EBY Connect Skala Nasional &copy; 2026
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSheetConfigOpen(true)}
              className="text-blue-400 hover:text-blue-300 hover:underline font-semibold cursor-pointer transition-colors"
            >
              Spreadsheet Config
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* Detail & Notulensi Modal */}
      <DetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onUpdateActivity={handleUpdateActivity}
      />

      {/* Absen & QR Link Generator Modal */}
      <AbsenGeneratorModal
        isOpen={isAbsenGeneratorOpen}
        onClose={() => setIsAbsenGeneratorOpen(false)}
        activities={activities}
        selectedActivityForAbsen={selectedActivityForAbsen}
        onSelectActivityForAbsen={setSelectedActivityForAbsen}
        onOpenPublicAbsen={(id) => setPublicAbsenActivityId(id)}
      />

      {/* Google Spreadsheet Config Modal */}
      <GoogleSheetConfigModal
        isOpen={isSheetConfigOpen}
        onClose={() => setIsSheetConfigOpen(false)}
        config={sheetConfig}
        onSaveConfig={setSheetConfig}
        onTriggerSync={handleTriggerAutoSync}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncTime}
      />

      {/* Deployment Guide Modal */}
      <DeploymentGuideModal
        isOpen={isDeploymentGuideOpen}
        onClose={() => setIsDeploymentGuideOpen(false)}
      />

      {/* Form Input Giat Senayan Modal (Firebase Integrated) */}
      <FormInputGiatModal
        isOpen={isFormInputGiatOpen}
        onClose={() => setIsFormInputGiatOpen(false)}
        onSave={handleAddNewActivity}
        userRole={userRole}
        userName={userName}
      />

      {/* Input Form Simulation Modal */}
      <GoogleFormModal
        isOpen={isGoogleFormModalOpen}
        onClose={() => setIsGoogleFormModalOpen(false)}
        onAddActivity={handleAddNewActivity}
      />

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImportSuccess={handleExcelImportSuccess}
      />

      {/* Sync Log Modal */}
      <SyncLogModal
        isOpen={isSyncLogModalOpen}
        onClose={() => setIsSyncLogModalOpen(false)}
        logs={syncLogs}
      />

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={userRole}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
