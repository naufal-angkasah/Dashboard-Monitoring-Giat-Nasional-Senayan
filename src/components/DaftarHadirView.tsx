import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  QrCode, 
  Search, 
  Building2, 
  CheckCircle2, 
  Clock,
  Users,
  Plus,
  ClipboardList,
  Filter,
  ChevronDown,
  Info,
  RefreshCw,
  X
} from 'lucide-react';
import { AttendanceRecord, ActivityItem, UserRole } from '../types';

interface DaftarHadirViewProps {
  attendanceRecords: AttendanceRecord[];
  activities: ActivityItem[];
  userRole: UserRole;
  onOpenAbsenGenerator: () => void;
  onOpenFormInputGiat: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  Hadir: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Izin: 'bg-amber-50 text-amber-700 border-amber-200',
  Sakit: 'bg-red-50 text-red-700 border-red-200',
};

const KATEGORI_COLOR: Record<string, string> = {
  MPR: 'text-amber-600 bg-amber-50 border-amber-200',
  DPR: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  'EBY Connect': 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export const DaftarHadirView: React.FC<DaftarHadirViewProps> = ({
  attendanceRecords,
  activities,
  userRole,
  onOpenAbsenGenerator,
  onOpenFormInputGiat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Map activity titles for lookup
  const activityMap = useMemo(() => {
    const map = new Map<string, ActivityItem>();
    activities.forEach(a => map.set(a.id, a));
    return map;
  }, [activities]);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      if (selectedActivityId !== 'ALL' && record.activityId !== selectedActivityId) return false;
      if (filterStatus !== 'ALL' && record.statusKehadiran !== filterStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = record.namaPeserta?.toLowerCase().includes(q) ?? false;
        const matchInst = record.instansi?.toLowerCase().includes(q) ?? false;
        const matchJabatan = record.jabatan?.toLowerCase().includes(q) ?? false;
        const act = activityMap.get(record.activityId);
        const matchAct = act ? act.namaGiat.toLowerCase().includes(q) : false;
        if (!matchName && !matchInst && !matchJabatan && !matchAct) return false;
      }
      return true;
    });
  }, [attendanceRecords, selectedActivityId, filterStatus, searchQuery, activityMap]);

  // Stats
  const hadirCount = attendanceRecords.filter(r => r.statusKehadiran === 'Hadir' || !r.statusKehadiran).length;
  const izinCount = attendanceRecords.filter(r => r.statusKehadiran === 'Izin').length;
  const sakitCount = attendanceRecords.filter(r => r.statusKehadiran === 'Sakit').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 font-sans"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Decoration circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-24 pointer-events-none" />

        <div className="relative z-10">
          <div className="bg-white/15 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-2 flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            REKAPITULASI DAFTAR HADIR · SENAYAN NASIONAL
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Daftar Hadir & Presensi Digital
          </h2>
          <p className="text-blue-100 text-xs mt-1 leading-relaxed max-w-lg">
            Presensi terverifikasi peserta kegiatan MPR RI, DPR RI & EBY Connect. Data tersimpan real-time di Firebase Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 shrink-0">
          {(userRole === 'admin' || userRole === 'pimpinan') && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenFormInputGiat}
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Input Giat Baru</span>
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAbsenGenerator}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>QR / Form Absen</span>
          </motion.button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Presensi', val: attendanceRecords.length, unit: 'Orang', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', valColor: 'text-slate-900' },
          { label: 'Hadir Terverifikasi', val: hadirCount, unit: 'Orang', icon: CheckCircle2, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', valColor: 'text-emerald-600' },
          { label: 'Kegiatan Terdaftar', val: activities.length, unit: 'Giat', icon: ClipboardList, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', valColor: 'text-indigo-600' },
          { label: 'Izin / Sakit', val: izinCount + sakitCount, unit: 'Orang', icon: Info, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', valColor: 'text-amber-600' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-2"
          >
            <div>
              <p className="text-[10px] font-extrabold uppercase text-slate-400 leading-tight">{kpi.label}</p>
              <p className={`text-2xl font-extrabold ${kpi.valColor} mt-0.5`}>
                {kpi.val} <span className="text-xs text-slate-400 font-normal">{kpi.unit}</span>
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${kpi.iconBg} ${kpi.iconColor} flex items-center justify-center shrink-0`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter by Activity */}
        <div className="relative w-full sm:flex-1 max-w-xs">
          <ClipboardList className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
          >
            <option value="ALL">Semua Kegiatan ({activities.length})</option>
            {activities.map(a => (
              <option key={a.id} value={a.id}>{a.namaGiat} ({a.kategoriGiat})</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter by Status */}
        <div className="relative w-full sm:w-40">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, instansi, jabatan..."
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Tabel Presensi Peserta</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Menampilkan <strong>{filteredRecords.length}</strong> dari {attendanceRecords.length} total peserta hadir
            </p>
          </div>
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="text-slate-400 hover:text-blue-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>

        {filteredRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 text-center"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">Belum Ada Presensi Tercatat</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Gunakan tombol "<strong>QR / Form Absen</strong>" untuk menerbitkan link absen baru bagi peserta kegiatan.
            </p>
            <button
              onClick={onOpenAbsenGenerator}
              className="mt-4 bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Buat QR Absen Sekarang
            </button>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Waktu Hadir</th>
                  <th className="px-4 py-3">Nama Peserta</th>
                  <th className="px-4 py-3">Instansi / Jabatan</th>
                  <th className="px-4 py-3">Kegiatan Terkait</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-slate-100 font-medium text-slate-800"
              >
                {filteredRecords.map((record, index) => {
                  const act = activityMap.get(record.activityId);
                  const status = record.statusKehadiran || 'Hadir';
                  const statusClass = STATUS_COLOR[status] || STATUS_COLOR.Hadir;
                  const kategoriClass = act ? (KATEGORI_COLOR[act.kategoriGiat] || '') : '';

                  return (
                    <motion.tr
                      key={record.id}
                      variants={rowVariants}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-400 font-bold">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-semibold text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                          <span>{record.waktuHadir}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{record.namaPeserta || '—'}</p>
                        {record.jabatan && (
                          <p className="text-[10px] text-slate-400 mt-0.5">{record.jabatan}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-700">{record.instansi || '—'}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-bold text-slate-900 truncate max-w-[180px]">
                          {act?.namaGiat || record.activityId}
                        </p>
                        {act && (
                          <span className={`inline-flex items-center mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border ${kategoriClass}`}>
                            {act.kategoriGiat}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusClass}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};
