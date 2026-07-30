import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  RefreshCw, 
  FileSpreadsheet, 
  UserCheck, 
  PlusCircle, 
  History,
  Sparkles,
  Layers
} from 'lucide-react';
import { UserRole, KategoriGiat } from '../types';

interface HeaderProps {
  activeCategoryTab: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect';
  setActiveCategoryTab: (tab: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect') => void;
  userRole: UserRole;
  onOpenLoginModal: () => void;
  onOpenGoogleFormModal: () => void;
  onOpenExcelModal: () => void;
  onOpenSyncLogModal: () => void;
  onTriggerAutoSync: () => void;
  isSyncing: boolean;
  lastSyncTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategoryTab,
  setActiveCategoryTab,
  userRole,
  onOpenLoginModal,
  onOpenGoogleFormModal,
  onOpenExcelModal,
  onOpenSyncLogModal,
  onTriggerAutoSync,
  isSyncing,
  lastSyncTime,
}) => {
  return (
    <header className="bg-white border-b-3 border-slate-900 mb-6 neo-shadow">
      {/* Top Notice / Status Bar */}
      <div className="bg-[#1E293B] text-slate-100 px-4 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-900">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border border-slate-900" />
          <span className="font-bold tracking-wide text-amber-300">
            GOOGLE SPREADSHEET AUTO-SYNC ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-300">| Terakhir sinkron: {lastSyncTime}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSyncLogModal}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors font-sans text-xs underline cursor-pointer text-slate-200"
          >
            <History className="w-3.5 h-3.5" />
            <span>Log Sync</span>
          </button>

          <span className="text-slate-500">|</span>

          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-1.5 bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-bold hover:bg-amber-300 border border-slate-900 cursor-pointer text-xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Role: {userRole === 'admin' ? 'Staff / Admin' : 'Pimpinan (View)'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-blue-600 text-white border-2 border-slate-900 neo-shadow flex items-center justify-center font-black text-2xl shrink-0 rounded-sm">
              <Building2 className="w-7 h-7 text-amber-300" />
            </div>

            <div>
              <div className="bg-slate-900 text-white px-3 py-1 w-fit text-xs font-bold uppercase tracking-widest mb-1 neo-shadow-sm flex items-center gap-2 rounded-xs">
                <span>DASHBOARD 2</span>
                <span className="text-amber-300">• SENAYAN NATIONAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none text-slate-900 mt-1">
                Monitoring Giat Nasional <span className="text-blue-700">(Senayan)</span>
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ x: -2, y: -2 }}
              whileTap={{ x: 0, y: 0 }}
              onClick={onTriggerAutoSync}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-slate-100 text-slate-900 px-3.5 py-2 text-xs font-bold border-2 border-slate-900 neo-shadow hover:bg-slate-200 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isSyncing ? 'Proses Sync...' : 'Sync Sheet Now'}</span>
            </motion.button>

            <motion.button
              whileHover={{ x: -2, y: -2 }}
              whileTap={{ x: 0, y: 0 }}
              onClick={onOpenGoogleFormModal}
              className="flex items-center gap-2 bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold border-2 border-slate-900 neo-shadow hover:bg-emerald-800 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Simulasi Google Form</span>
            </motion.button>

            {userRole === 'admin' && (
              <motion.button
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 0, y: 0 }}
                onClick={onOpenExcelModal}
                className="flex items-center gap-2 bg-blue-700 text-white px-3.5 py-2 text-xs font-bold border-2 border-slate-900 neo-shadow hover:bg-blue-800 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-200" />
                <span>Upload Excel</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Category Mode Switcher Tabs */}
        <div className="mt-5 pt-3.5 border-t-2 border-slate-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-black uppercase text-slate-600 mr-1 flex items-center gap-1 shrink-0">
              <Layers className="w-4 h-4 text-slate-700" /> Mode Giat:
            </span>

            {/* TAB ALL / MPR & DPR SUMMARY */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => setActiveCategoryTab('ALL')}
              className={`px-4 py-2 font-black text-xs border-2 border-slate-900 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeCategoryTab === 'ALL'
                  ? 'bg-amber-400 text-slate-900 neo-shadow -translate-y-0.5'
                  : 'bg-white text-slate-700 hover:bg-amber-50 neo-shadow-sm'
              }`}
            >
              <span>Semua Giat (MPR & DPR)</span>
              {activeCategoryTab === 'ALL' && (
                <span className="bg-slate-900 text-amber-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  AKTIF
                </span>
              )}
            </motion.button>

            {/* TAB MPR */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => setActiveCategoryTab('MPR')}
              className={`px-4 py-2 font-black text-xs border-2 border-slate-900 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeCategoryTab === 'MPR'
                  ? 'bg-blue-600 text-white neo-shadow -translate-y-0.5'
                  : 'bg-white text-slate-700 hover:bg-blue-50 neo-shadow-sm'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900 inline-block" />
              <span>Kategori MPR RI</span>
            </motion.button>

            {/* TAB DPR */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => setActiveCategoryTab('DPR')}
              className={`px-4 py-2 font-black text-xs border-2 border-slate-900 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeCategoryTab === 'DPR'
                  ? 'bg-rose-600 text-white neo-shadow -translate-y-0.5'
                  : 'bg-white text-slate-700 hover:bg-rose-50 neo-shadow-sm'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-slate-900 inline-block" />
              <span>Kategori DPR RI</span>
            </motion.button>

            {/* TAB EBY CONNECT */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => setActiveCategoryTab('EBY Connect')}
              className={`px-4 py-2 font-black text-xs border-2 border-slate-900 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeCategoryTab === 'EBY Connect'
                  ? 'bg-emerald-600 text-white neo-shadow -translate-y-0.5'
                  : 'bg-emerald-100 text-slate-900 hover:bg-emerald-200 neo-shadow-sm'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>EBY Connect (Program Non-Dapil)</span>
            </motion.button>
          </div>

          <div className="text-right text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 border border-slate-800 neo-shadow-sm hidden md:block">
            Mode Tampilan: <strong className="text-slate-900 uppercase">{activeCategoryTab}</strong>
          </div>
        </div>
      </div>
    </header>
  );
};
