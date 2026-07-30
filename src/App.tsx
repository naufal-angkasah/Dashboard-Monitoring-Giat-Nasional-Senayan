import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { ExecutiveSummaryCards } from './components/ExecutiveSummaryCards';
import { FilterSection } from './components/FilterSection';
import { ChartsSection } from './components/ChartsSection';
import { DataTable } from './components/DataTable';
import { EbyConnectView } from './components/EbyConnectView';
import { DetailModal } from './components/DetailModal';
import { GoogleFormModal } from './components/GoogleFormModal';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { SyncLogModal } from './components/SyncLogModal';
import { LoginModal } from './components/LoginModal';

import { 
  ActivityItem, 
  EbyConnectProgram, 
  FilterState, 
  SyncLog, 
  UserRole, 
  ExecutiveSummaryStats 
} from './types';

import { 
  INITIAL_ACTIVITIES, 
  INITIAL_EBY_PROGRAMS, 
  INITIAL_SYNC_LOGS 
} from './data/mockData';

export default function App() {
  // Primary Datasets State
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [ebyPrograms, setEbyPrograms] = useState<EbyConnectProgram[]>(INITIAL_EBY_PROGRAMS);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(INITIAL_SYNC_LOGS);

  // Active Mode & Role
  const [activeCategoryTab, setActiveCategoryTab] = useState<'ALL' | 'MPR' | 'DPR' | 'EBY Connect'>('ALL');
  const [userRole, setUserRole] = useState<UserRole>('pimpinan');

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    tahun: 'ALL',
    kategoriGiat: 'ALL',
    jenisGiat: 'ALL',
    temaGiat: 'ALL',
    segmentasiPeserta: 'ALL',
    instansi: 'ALL',
    searchQuery: '',
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

  // Sync Tab Switcher with Filter State
  const handleTabChange = (tab: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect') => {
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

  // Dynamic Available Filter Options
  const availableYears = useMemo(() => {
    return Array.from(new Set(activities.map(a => a.tahun))).sort().reverse();
  }, [activities]);

  const availableJenisGiat = useMemo(() => {
    return Array.from(new Set(activities.map(a => a.jenisGiat))).sort();
  }, [activities]);

  const availableTemaGiat = useMemo(() => {
    return Array.from(new Set(activities.map(a => a.temaGiat))).sort();
  }, [activities]);

  const availableSegmentasi = useMemo(() => {
    return Array.from(new Set(activities.map(a => a.segmentasiPeserta))).sort();
  }, [activities]);

  const availableInstansi = useMemo(() => {
    return Array.from(new Set(activities.map(a => a.asalInstansi))).sort();
  }, [activities]);

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
        const query = filter.searchQuery.toLowerCase();
        const matchTitle = activity.namaGiat.toLowerCase().includes(query);
        const matchInst = activity.asalInstansi.toLowerCase().includes(query);
        const matchTema = activity.temaGiat.toLowerCase().includes(query);
        const matchPeserta = activity.namaPeserta.toLowerCase().includes(query);
        const matchJenis = activity.jenisGiat.toLowerCase().includes(query);

        if (!matchTitle && !matchInst && !matchTema && !matchPeserta && !matchJenis) {
          return false;
        }
      }

      return true;
    });
  }, [activities, filter, activeCategoryTab]);

  // Executive Summary Statistics
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

  // Count active filters
  const activeCount = useMemo(() => {
    let count = 0;
    if (filter.tahun !== 'ALL') count++;
    if (filter.kategoriGiat !== 'ALL') count++;
    if (filter.jenisGiat !== 'ALL') count++;
    if (filter.temaGiat !== 'ALL') count++;
    if (filter.segmentasiPeserta !== 'ALL') count++;
    if (filter.instansi !== 'ALL') count++;
    if (filter.searchQuery !== '') count++;
    return count;
  }, [filter]);

  // Reset Filter Handler
  const handleResetFilter = () => {
    setFilter({
      tahun: 'ALL',
      kategoriGiat: activeCategoryTab === 'ALL' ? 'ALL' : activeCategoryTab,
      jenisGiat: 'ALL',
      temaGiat: 'ALL',
      segmentasiPeserta: 'ALL',
      instansi: 'ALL',
      searchQuery: '',
    });
  };

  // Auto-Sync Trigger Handler
  const handleTriggerAutoSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(nowTime);
      setIsSyncing(false);

      const newLog: SyncLog = {
        id: `LOG-${Date.now()}`,
        timestamp: `${new Date().toISOString().slice(0, 10)} ${nowTime}`,
        source: 'Google Sheet Auto-Sync',
        status: 'Success',
        recordsCount: activities.length,
        description: 'Auto-sync database dengan Cloud Spreadsheet Master Senayan'
      };

      setSyncLogs(prev => [newLog, ...prev]);
    }, 1200);
  };

  // Submit New Activity From Google Form Modal
  const handleSubmitNewActivity = (newActivity: ActivityItem) => {
    setActivities(prev => [newActivity, ...prev]);

    // Add Sync Log
    const newLog: SyncLog = {
      id: `LOG-${Date.now()}`,
      timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString('id-ID')}`,
      source: 'Google Form',
      status: 'Success',
      recordsCount: 1,
      description: `Pendaftaran Baru: ${newActivity.namaGiat}`
    };

    setSyncLogs(prev => [newLog, ...prev]);
    setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
  };

  // Import Excel Activities Handler
  const handleImportExcelActivities = (imported: ActivityItem[]) => {
    setActivities(prev => [...imported, ...prev]);

    const newLog: SyncLog = {
      id: `LOG-${Date.now()}`,
      timestamp: `${new Date().toISOString().slice(0, 10)} ${new Date().toLocaleTimeString('id-ID')}`,
      source: 'Excel Upload',
      status: 'Success',
      recordsCount: imported.length,
      description: `Import ${imported.length} data kegiatan via file Excel/CSV`
    };

    setSyncLogs(prev => [newLog, ...prev]);
    setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-12 font-sans selection:bg-amber-200 selection:text-slate-900 border-[3px] sm:border-[4px] border-slate-900">
      
      {/* HEADER COMPONENT */}
      <Header
        activeCategoryTab={activeCategoryTab}
        setActiveCategoryTab={handleTabChange}
        userRole={userRole}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenGoogleFormModal={() => setIsGoogleFormModalOpen(true)}
        onOpenExcelModal={() => setIsExcelModalOpen(true)}
        onOpenSyncLogModal={() => setIsSyncLogModalOpen(true)}
        onTriggerAutoSync={handleTriggerAutoSync}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ANIMATED MODE TRANSITION WITH AnimatePresence */}
        <AnimatePresence mode="wait">
          
          {/* EBY CONNECT VIEW (PROGRAM NON-DAPIL SIMPLIFIED VIEW) */}
          {activeCategoryTab === 'EBY Connect' ? (
            <motion.div
              key="eby-connect-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              {/* Executive Summary Cards in Simplified EBY Mode */}
              <ExecutiveSummaryCards
                stats={stats}
                activeCategoryTab={activeCategoryTab}
                totalEbyPrograms={ebyPrograms.length}
                totalEbyPenerima={ebyPrograms.reduce((a, b) => a + b.jumlahPenerima, 0)}
              />

              {/* Dedicated EBY Connect View */}
              <EbyConnectView
                programs={ebyPrograms}
                onOpenDetailProgram={(p) => {
                  // Map EBY Program to ActivityItem format for detail view
                  setSelectedActivity({
                    id: p.id,
                    tahun: p.tahun,
                    kategoriGiat: 'EBY Connect',
                    jenisGiat: p.jenisProgram,
                    temaGiat: 'Program Non-Dapil',
                    namaGiat: p.namaProgram,
                    namaPeserta: p.penerima,
                    asalInstansi: p.instansiMitra,
                    segmentasiPeserta: 'Penerima Beasiswa & Bantuan',
                    kontak: p.kontak,
                    jumlahPeserta: p.jumlahPenerima,
                    lokasi: p.wilayah,
                    tanggal: p.tanggal,
                    status: 'Terlaksana',
                    source: 'Google Form',
                    catatan: `Status Penyaluran: ${p.status}`
                  });
                }}
              />
            </motion.div>
          ) : (
            
            /* STANDARD VIEW (MPR & DPR EXECUTIVE SUMMARY + ANALYTICS + FILTER + TABLE) */
            <motion.div
              key="standard-mpr-dpr-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              {/* EXECUTIVE SUMMARY KPI CARDS */}
              <ExecutiveSummaryCards
                stats={stats}
                activeCategoryTab={activeCategoryTab}
              />

              {/* FILTER SECTION */}
              <FilterSection
                filter={filter}
                setFilter={setFilter}
                availableYears={availableYears}
                availableJenisGiat={availableJenisGiat}
                availableTemaGiat={availableTemaGiat}
                availableSegmentasi={availableSegmentasi}
                availableInstansi={availableInstansi}
                onResetFilter={handleResetFilter}
                activeCount={activeCount}
              />

              {/* CHARTS & RECHARTS SECTION */}
              <ChartsSection filteredActivities={filteredActivities} />

              {/* DATA TABLE & EXPORT REPORT */}
              <DataTable
                activities={filteredActivities}
                onSelectActivity={(act) => setSelectedActivity(act)}
                userRole={userRole}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer className="mt-12 py-6 bg-[#18181B] text-white border-t-4 border-black font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-yellow-300">
              DASHBOARD 2: MONITORING GIAT NASIONAL (SENAYAN)
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Sistem Pelaporan MPR RI, DPR RI, & EBY Connect • Terhubung Cloud Spreadsheet & Google Form
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="bg-zinc-800 text-yellow-300 px-2 py-1 border border-zinc-700">
              Neo-Brutalism UI
            </span>
            <span className="bg-zinc-800 text-emerald-400 px-2 py-1 border border-zinc-700">
              Recharts & Motion
            </span>
          </div>
        </div>
      </footer>

      {/* MODAL DIALOGS */}
      <DetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />

      <GoogleFormModal
        isOpen={isGoogleFormModalOpen}
        onClose={() => setIsGoogleFormModalOpen(false)}
        onSubmitNewActivity={handleSubmitNewActivity}
      />

      <ExcelUploadModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImportActivities={handleImportExcelActivities}
      />

      <SyncLogModal
        isOpen={isSyncLogModalOpen}
        onClose={() => setIsSyncLogModalOpen(false)}
        syncLogs={syncLogs}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={userRole}
        onSwitchRole={(role) => setUserRole(role)}
      />

    </div>
  );
}
