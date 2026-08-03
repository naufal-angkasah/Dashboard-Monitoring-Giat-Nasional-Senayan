import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  QrCode, 
  Search, 
  Building2, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  Download, 
  FileSpreadsheet,
  Clock,
  ShieldAlert,
  Users,
  Building
} from 'lucide-react';
import { AttendanceRecord, ActivityItem, UserRole } from '../types';

interface DaftarHadirViewProps {
  attendanceRecords: AttendanceRecord[];
  activities: ActivityItem[];
  userRole: UserRole;
  onOpenAbsenGenerator: () => void;
}

export const DaftarHadirView: React.FC<DaftarHadirViewProps> = ({
  attendanceRecords,
  activities,
  userRole,
  onOpenAbsenGenerator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('ALL');

  // Map activity titles for lookup
  const activityMap = useMemo(() => {
    const map = new Map<string, ActivityItem>();
    activities.forEach(a => map.set(a.id, a));
    return map;
  }, [activities]);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      if (selectedActivityId !== 'ALL' && record.activityId !== selectedActivityId) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = record.namaLengkap.toLowerCase().includes(q);
        const matchInst = record.instansiUtusan.toLowerCase().includes(q);
        const matchPhone = record.nomorHp.includes(q);
        const matchNik = record.nik.includes(q);
        const act = activityMap.get(record.activityId);
        const matchAct = act ? act.namaGiat.toLowerCase().includes(q) : false;

        if (!matchName && !matchInst && !matchPhone && !matchNik && !matchAct) return false;
      }
      return true;
    });
  }, [attendanceRecords, selectedActivityId, searchQuery, activityMap]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 font-sans"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider w-fit mb-2 flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            REKAPITULASI HADIR & ABSENSI DIGITAL SENAYAN
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Daftar Hadir & Audit Presensi Konstituen
          </h2>
          <p className="text-blue-100 text-xs mt-1 leading-relaxed">
            Data terverifikasi daftar kehadiran peserta kegiatan MPR RI, DPR RI, serta penerima program EBY Connect skala nasional.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAbsenGenerator}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>+ Buat QR / Form Absen</span>
          </motion.button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Total Hadir Terverifikasi</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{attendanceRecords.length} <span className="text-xs text-slate-500 font-normal">Orang</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Kegiatan Terdaftar</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">{activities.length} <span className="text-xs text-slate-500 font-normal">Giat</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Status Presensi</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">Real-time <span className="text-xs text-slate-500 font-normal">Firestore</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
          <select
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Semua Kegiatan ({activities.length})</option>
            {activities.map(a => (
              <option key={a.id} value={a.id}>{a.namaGiat} ({a.kategoriGiat})</option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIK, telepon, instansi..."
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Tabel Presensi Peserta</h3>
            <p className="text-[11px] text-slate-500">Menampilkan {filteredRecords.length} dari {attendanceRecords.length} total peserta hadir</p>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 text-sm">Belum Ada Presensi Tercatat</h4>
            <p className="text-xs text-slate-500 mt-1">Gunakan tombol "+ Buat QR / Form Absen" untuk menerbitkan QR absen baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Waktu Absen</th>
                  <th className="px-4 py-3">Nama Peserta</th>
                  <th className="px-4 py-3">NIK / HP</th>
                  <th className="px-4 py-3">Instansi / Utusan</th>
                  <th className="px-4 py-3">Kegiatan Terkait</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredRecords.map((record, index) => {
                  const act = activityMap.get(record.activityId);

                  return (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-bold">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-semibold text-[11px]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          <span>{record.waktuAbsen}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{record.namaLengkap}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-bold text-slate-700">{record.nomorHp}</p>
                        <p className="text-[10px] text-slate-400 font-mono">NIK: {record.nik || '-'}</p>
                      </td>
                      <td className="px-4 py-3">{record.instansiUtusan || '-'}</td>
                      <td className="px-4 py-3 max-w-xs truncate">
                        <span className="font-bold text-slate-900 block truncate">
                          {act?.namaGiat || record.activityId}
                        </span>
                        <span className="text-[10px] text-blue-600 font-semibold uppercase">
                          {act?.kategoriGiat || 'Senayan'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                          <CheckCircle2 className="w-3 h-3" />
                          Hadir
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};
