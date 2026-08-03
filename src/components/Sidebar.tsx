import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Sparkles, 
  Landmark, 
  Building, 
  X,
  Shield,
  Activity,
  CheckCircle2,
  ChevronRight,
  User,
  SlidersHorizontal,
  FolderKanban,
  UserCheck
} from 'lucide-react';
import { UserRole, ExecutiveSummaryStats } from '../types';

interface SidebarProps {
  activeCategoryTab: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect' | 'daftar_hadir';
  setActiveCategoryTab: (tab: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect' | 'daftar_hadir') => void;
  userRole: UserRole;
  userName?: string;
  stats?: ExecutiveSummaryStats;
  totalEbyPrograms?: number;
  totalAttendanceRecords?: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategoryTab,
  setActiveCategoryTab,
  userRole,
  userName,
  stats,
  totalEbyPrograms = 7,
  totalAttendanceRecords = 0,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const menuItems = [
    {
      id: 'ALL' as const,
      title: 'Overview',
      subtitle: 'MPR, DPR & EBY Connect',
      icon: Building2,
      count: stats?.totalGiat || 0,
      dotColor: 'bg-blue-500',
      activeBg: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
      activeText: 'text-white',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'MPR' as const,
      title: 'Giat MPR RI',
      subtitle: '4 Pilar & Aspirasi Konstituen',
      icon: Landmark,
      count: stats?.giatMPR || 0,
      dotColor: 'bg-amber-400',
      activeBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/20',
      activeText: 'text-white',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      id: 'DPR' as const,
      title: 'Giat DPR RI',
      subtitle: 'Kunker, RDP & Pengawasan',
      icon: Building,
      count: stats?.giatDPR || 0,
      dotColor: 'bg-indigo-400',
      activeBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20',
      activeText: 'text-white',
      badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    },
    {
      id: 'EBY Connect' as const,
      title: 'EBY Connect',
      subtitle: 'Bantuan Direct & Beasiswa',
      icon: Sparkles,
      count: totalEbyPrograms,
      dotColor: 'bg-emerald-400',
      activeBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20',
      activeText: 'text-white',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    },
    {
      id: 'daftar_hadir' as const,
      title: 'Daftar Hadir',
      subtitle: 'Presensi & Absensi Digital',
      icon: UserCheck,
      count: totalAttendanceRecords,
      dotColor: 'bg-purple-400',
      activeBg: 'bg-purple-600 text-white shadow-md shadow-purple-500/20',
      activeText: 'text-white',
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-200',
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4 space-y-6 font-sans">
      <div className="space-y-6">
        {/* Top Header Branding Badge inside Sidebar */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl border border-slate-700/80 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight leading-none">
                MONITORING SENAYAN
              </h2>
              <p className="text-[10px] text-blue-200 font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Giat MPR, DPR & EBY
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Hak Akses:</span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-md font-bold uppercase text-[10px]">
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation Category Menu */}
        <div>
          <div className="px-1 mb-2.5 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Kategori & Scope Monitoring
            </span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeCategoryTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveCategoryTab(item.id);
                    setIsOpenMobile(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? item.activeBg
                      : 'bg-white hover:bg-slate-100/90 text-slate-700 border border-slate-200/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-white'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold text-xs leading-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {item.title}
                      </p>
                      <p className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive ? 'bg-white/20 text-white border-white/30' : item.badgeClass
                    }`}>
                      {item.count}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
                    }`} />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Executive Status Widget inside Sidebar */}
        <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-2xs space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
              <Activity className="w-3.5 h-3.5 text-blue-600" /> Real-time Metrics
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full font-bold">
              Aktif
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-[11px]">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase">MPR RI</p>
              <p className="font-extrabold text-slate-900 text-sm">{stats?.giatMPR || 0}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase">DPR RI</p>
              <p className="font-extrabold text-slate-900 text-sm">{stats?.giatDPR || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Footer inside Sidebar */}
      <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60">
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
          {userRole === 'admin' ? 'AD' : 'EX'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-xs text-slate-900 truncate">{userName || 'Pengguna'}</p>
          <p className="text-[10px] text-slate-500 font-medium capitalize truncate">Peran: {userRole}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left Sticky Column) */}
      <aside className="hidden md:block w-64 xl:w-72 shrink-0 border-r border-slate-200/80 bg-slate-50/60 min-h-[calc(100vh-64px)]">
        <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto scrollbar-none">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenMobile(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Slide-out Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] bg-slate-50 h-full shadow-2xl z-10 overflow-y-auto"
            >
              <button
                onClick={() => setIsOpenMobile(false)}
                className="absolute top-3 right-3 p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
