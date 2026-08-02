import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  RefreshCw, 
  FileSpreadsheet, 
  UserCheck, 
  QrCode, 
  History,
  Sparkles,
  Layers,
  Rocket,
  Link2,
  LogOut,
  LogIn,
  Users,
  Search,
  Shield,
  User,
  Eye,
  Database
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  activeCategoryTab: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect';
  setActiveCategoryTab: (tab: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect') => void;
  userRole: UserRole;
  userName?: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenGoogleFormModal: () => void;
  onOpenExcelModal: () => void;
  onOpenSyncLogModal: () => void;
  onOpenAbsenGeneratorModal: () => void;
  onOpenSheetConfigModal: () => void;
  onOpenDeploymentGuideModal: () => void;
  onTriggerAutoSync: () => void;
  isSyncing: boolean;
  lastSyncTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategoryTab,
  setActiveCategoryTab,
  userRole,
  userName,
  searchQuery,
  onSearchQueryChange,
  onOpenLoginModal,
  onLogout,
  onOpenGoogleFormModal,
  onOpenExcelModal,
  onOpenSyncLogModal,
  onOpenAbsenGeneratorModal,
  onOpenSheetConfigModal,
  onOpenDeploymentGuideModal,
  onTriggerAutoSync,
  isSyncing,
  lastSyncTime,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 mb-4 sm:mb-6 sm:sticky top-0 z-40 shadow-xs backdrop-blur-md bg-white/95">
      {/* Top Status Bar & Role Controls */}
      <div className="bg-slate-50 text-slate-700 px-3 sm:px-8 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold tracking-tight text-slate-900 flex items-center gap-1 text-[11px] sm:text-xs">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                FIRESTORE & SHEET LIVE SYNC
              </span>
            </div>
            <span className="text-slate-500 text-[10px] sm:text-xs font-normal">Sync: {lastSyncTime}</span>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenDeploymentGuideModal}
                className="flex items-center gap-1 hover:text-blue-700 text-blue-600 transition-colors text-[10px] sm:text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                <Rocket className="w-3 h-3" />
                <span>Panduan</span>
              </button>

              <span className="text-slate-300">|</span>

              <button
                onClick={onOpenSyncLogModal}
                className="flex items-center gap-1 hover:text-slate-900 transition-colors text-[10px] sm:text-xs cursor-pointer text-slate-600 font-medium whitespace-nowrap"
              >
                <History className="w-3 h-3 text-slate-500" />
                <span>Log</span>
              </button>
            </div>

            <span className="text-slate-300 shrink-0">|</span>

            {/* Authentication Control Pill */}
            {userRole === 'public' ? (
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-full text-xs text-slate-700 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mode Publik</span>
                </div>

                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs cursor-pointer transition-all whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk Sistem</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-200 px-2.5 py-0.5 rounded-xl shadow-2xs">
                  <div className={`w-7 h-7 rounded-lg font-extrabold text-[10px] flex items-center justify-center text-white shrink-0 ${
                    userRole === 'admin' ? 'bg-blue-600' : 'bg-cyan-600'
                  }`}>
                    {userRole === 'admin' ? 'ADM' : 'PMP'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-bold text-slate-900 text-[11px] leading-tight">
                      {userName || (userRole === 'admin' ? 'Operator Tim Teknis' : 'Dr. H. Anggota DPR')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {userRole === 'admin' ? 'Super Admin' : 'Pimpinan'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Keluar / Logout"
                  className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-4">
          
          {/* Brand & Search */}
          <div className="flex items-center justify-between md:justify-start gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-2 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white shadow-md shadow-blue-500/20 flex items-center justify-center rounded-xl shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  MONITORING
                </span>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-lg sm:rounded-xl tracking-wide uppercase">
                  GIAT NASIONAL SENAYAN
                </span>
              </div>
            </div>

            {/* Quick Search Bar */}
            <div className="hidden lg:flex items-center relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Cari cepat..."
                className="w-full bg-slate-100/80 border border-slate-200/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Action Buttons horizontally scrollable on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full md:w-auto shrink-0">
            
            {/* Live Google Sheet Status / Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onTriggerAutoSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl cursor-pointer transition-all disabled:opacity-50 shrink-0 whitespace-nowrap"
            >
              <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Google Sheet</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </motion.button>

            {/* Admin only: Upload Excel */}
            {userRole === 'admin' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenExcelModal}
                className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl cursor-pointer transition-all shrink-0 whitespace-nowrap"
              >
                <FileSpreadsheet className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                <span>Upload Excel</span>
              </motion.button>
            )}

            {/* Admin or Pimpinan: Form Absen Digital & QR */}
            {(userRole === 'admin' || userRole === 'pimpinan') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenAbsenGeneratorModal}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all shrink-0 whitespace-nowrap"
              >
                <QrCode className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>+ QR Absen</span>
              </motion.button>
            )}

            {/* Admin only: Setting Sheet URL & Input Form */}
            {userRole === 'admin' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenSheetConfigModal}
                  className="flex items-center gap-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl cursor-pointer transition-all shrink-0 whitespace-nowrap"
                >
                  <Link2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                  <span>Config Sheet</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenGoogleFormModal}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all shrink-0 whitespace-nowrap"
                >
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  <span>+ Input Giat</span>
                </motion.button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            
            {/* Tab 1: Semua Giat Senayan */}
            <button
              onClick={() => setActiveCategoryTab('ALL')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 font-semibold text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 sm:gap-2 rounded-xl shrink-0 ${
                activeCategoryTab === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Semua Giat Senayan (MPR, DPR, EBY)</span>
            </button>

            {/* Tab 2: Kunjungan & Aspirasi MPR */}
            <button
              onClick={() => setActiveCategoryTab('MPR')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 font-semibold text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 sm:gap-2 rounded-xl shrink-0 ${
                activeCategoryTab === 'MPR'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Giat MPR RI</span>
            </button>

            {/* Tab 3: Kunjungan & Aspirasi DPR */}
            <button
              onClick={() => setActiveCategoryTab('DPR')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 font-semibold text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 sm:gap-2 rounded-xl shrink-0 ${
                activeCategoryTab === 'DPR'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
              <span>Giat DPR RI</span>
            </button>

            {/* Tab 4: EBY Connect */}
            <button
              onClick={() => setActiveCategoryTab('EBY Connect')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 font-semibold text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 sm:gap-2 rounded-xl shrink-0 ${
                activeCategoryTab === 'EBY Connect'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-500 fill-emerald-500" />
              <span>EBY Connect (Bantuan Direct)</span>
            </button>
          </div>

          <div className="text-right text-[11px] text-slate-500 bg-slate-50 px-3 py-1 border border-slate-200/60 rounded-xl hidden md:block shrink-0">
            Hak Akses: <strong className="text-slate-800 uppercase font-semibold">{userRole}</strong>
          </div>
        </div>
      </div>
    </header>
  );
};

