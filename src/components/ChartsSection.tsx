import React from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { ActivityItem } from '../types';
import { BarChart3, PieChart as PieIcon, TrendingUp, Building, Users } from 'lucide-react';

interface ChartsSectionProps {
  filteredActivities: ActivityItem[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ filteredActivities }) => {
  // 1. Komparasi MPR vs DPR
  const mprCount = filteredActivities.filter(a => a.kategoriGiat === 'MPR').length;
  const dprCount = filteredActivities.filter(a => a.kategoriGiat === 'DPR').length;
  const ebyCount = filteredActivities.filter(a => a.kategoriGiat === 'EBY Connect').length;

  const pieData = [
    { name: 'MPR RI', value: mprCount, color: '#2563EB' },
    { name: 'DPR RI', value: dprCount, color: '#DC2626' },
    { name: 'EBY Connect', value: ebyCount, color: '#10B981' },
  ].filter(d => d.value > 0);

  // 2. Top 5 Instansi dengan Peserta Terbanyak
  const instansiMap: Record<string, { totalPeserta: number; totalGiat: number }> = {};
  filteredActivities.forEach(a => {
    const inst = a.asalInstansi || 'Lainnya';
    if (!instansiMap[inst]) {
      instansiMap[inst] = { totalPeserta: 0, totalGiat: 0 };
    }
    instansiMap[inst].totalPeserta += a.jumlahPeserta;
    instansiMap[inst].totalGiat += 1;
  });

  const topInstansiData = Object.keys(instansiMap)
    .map(name => ({
      name: name.length > 20 ? name.substring(0, 18) + '...' : name,
      fullName: name,
      totalPeserta: instansiMap[name].totalPeserta,
      totalGiat: instansiMap[name].totalGiat,
    }))
    .sort((a, b) => b.totalPeserta - a.totalPeserta)
    .slice(0, 5);

  // 3. Top 5 Segmentasi Peserta
  const segmentMap: Record<string, number> = {};
  filteredActivities.forEach(a => {
    const seg = a.segmentasiPeserta || 'Umum';
    segmentMap[seg] = (segmentMap[seg] || 0) + a.jumlahPeserta;
  });

  const topSegmentData = Object.keys(segmentMap)
    .map(name => ({
      name: name.length > 18 ? name.substring(0, 16) + '...' : name,
      fullName: name,
      totalPeserta: segmentMap[name],
    }))
    .sort((a, b) => b.totalPeserta - a.totalPeserta)
    .slice(0, 5);

  // 4. Jumlah Giat per Tahun
  const yearMap: Record<string, { MPR: number; DPR: number; EBY: number; Total: number }> = {
    '2023': { MPR: 0, DPR: 0, EBY: 0, Total: 0 },
    '2024': { MPR: 0, DPR: 0, EBY: 0, Total: 0 },
    '2025': { MPR: 0, DPR: 0, EBY: 0, Total: 0 },
    '2026': { MPR: 0, DPR: 0, EBY: 0, Total: 0 },
  };

  filteredActivities.forEach(a => {
    if (!yearMap[a.tahun]) {
      yearMap[a.tahun] = { MPR: 0, DPR: 0, EBY: 0, Total: 0 };
    }
    if (a.kategoriGiat === 'MPR') yearMap[a.tahun].MPR += 1;
    else if (a.kategoriGiat === 'DPR') yearMap[a.tahun].DPR += 1;
    else if (a.kategoriGiat === 'EBY Connect') yearMap[a.tahun].EBY += 1;
    yearMap[a.tahun].Total += 1;
  });

  const giatPerTahunData = Object.keys(yearMap).map(year => ({
    tahun: year,
    MPR: yearMap[year].MPR,
    DPR: yearMap[year].DPR,
    EBY: yearMap[year].EBY,
    Total: yearMap[year].Total,
  }));

  // 5. Jumlah Giat Berdasarkan Jenis Giat
  const jenisMap: Record<string, number> = {};
  filteredActivities.forEach(a => {
    const jenis = a.jenisGiat || 'Lainnya';
    jenisMap[jenis] = (jenisMap[jenis] || 0) + 1;
  });

  const giatPerJenisData = Object.keys(jenisMap)
    .map(name => ({
      name,
      jumlahGiat: jenisMap[name],
    }))
    .sort((a, b) => b.jumlahGiat - a.jumlahGiat)
    .slice(0, 6);

  // Custom Eye-Friendly Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-slate-100 p-2.5 border-2 border-slate-700 neo-shadow font-mono text-xs z-50 rounded-xs">
          <p className="font-bold text-amber-300 uppercase mb-1">{label || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color || entry.fill }} />
              <span>{entry.name}: <strong>{entry.value.toLocaleString('id-ID')}</strong></span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* SECTION TITLE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-700 text-white neo-shadow-sm border border-slate-900 rounded-xs">
            <BarChart3 className="w-5 h-5 text-amber-300" />
          </div>
          <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight">
            Statistik & Visualisasi Analytics Kegiatan
          </h2>
        </div>
        <span className="text-xs font-mono font-bold bg-amber-200 border border-slate-900 px-2.5 py-1 neo-shadow-sm hidden sm:inline-block text-slate-900">
          Grafik Recharts Interaktif
        </span>
      </div>

      {/* CHART GRID ROW 1: Donut MPR vs DPR & Top Instansi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DONUT CHART: Komparasi MPR vs DPR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-4 bg-white p-4 border-2 border-slate-900 neo-shadow flex flex-col justify-between rounded-xs"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-slate-900">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-700" />
              <h3 className="font-black text-xs uppercase text-slate-900">
                Komparasi Giat MPR vs DPR
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 border border-slate-800 px-1.5 py-0.5 text-slate-800 font-bold">
              Persentase
            </span>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1200}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={1.5} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-bold font-mono text-slate-800">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-center text-slate-600">
            Total kegiatan dikomparasi: <strong>{filteredActivities.length}</strong> Giat
          </div>
        </motion.div>

        {/* BAR CHART: Top 5 Instansi Peserta Terbanyak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-8 bg-white p-4 border-2 border-slate-900 neo-shadow flex flex-col justify-between rounded-xs"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-slate-900">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-rose-700" />
              <h3 className="font-black text-xs uppercase text-slate-900">
                Top 5 Instansi dengan Partisipasi Peserta Terbanyak
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-rose-100 text-rose-950 border border-rose-900 px-1.5 py-0.5 font-bold">
              Total Peserta
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topInstansiData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#0f172a' }} 
                  interval={0}
                />
                <YAxis tick={{ fontSize: 10, fill: '#0f172a' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="totalPeserta" 
                  name="Jumlah Peserta" 
                  fill="#E11D48" 
                  stroke="#0f172a" 
                  strokeWidth={1.5}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-600 flex justify-between">
            <span>Instansi Teratas: <strong>{topInstansiData[0]?.fullName || '-'}</strong></span>
            <span>{topInstansiData[0]?.totalPeserta.toLocaleString('id-ID') || 0} Peserta</span>
          </div>
        </motion.div>

      </div>

      {/* CHART GRID ROW 2: Tren per Tahun & Top Segmentasi & Jenis Giat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* BAR CHART: Jumlah Giat per Tahun */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-4 border-2 border-slate-900 neo-shadow flex flex-col justify-between rounded-xs"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-slate-900">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <h3 className="font-black text-xs uppercase text-slate-900">
                Tren Giat per Tahun (2023-2026)
              </h3>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={giatPerTahunData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="tahun" tick={{ fontSize: 11, fontWeight: 700, fill: '#0f172a' }} />
                <YAxis tick={{ fontSize: 10, fill: '#0f172a' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="MPR" name="MPR" stackId="a" fill="#2563EB" stroke="#0f172a" strokeWidth={1} />
                <Bar dataKey="DPR" name="DPR" stackId="a" fill="#E11D48" stroke="#0f172a" strokeWidth={1} />
                <Bar dataKey="EBY" name="EBY" stackId="a" fill="#059669" stroke="#0f172a" strokeWidth={1} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* BAR CHART: Top 5 Segmentasi Peserta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white p-4 border-2 border-slate-900 neo-shadow flex flex-col justify-between rounded-xs"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-slate-900">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-700" />
              <h3 className="font-black text-xs uppercase text-slate-900">
                Top 5 Segmentasi Peserta
              </h3>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSegmentData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#0f172a' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontWeight: 700, fill: '#0f172a' }} width={85} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalPeserta" name="Peserta" fill="#F59E0B" stroke="#0f172a" strokeWidth={1.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* BAR CHART: Jenis Kegiatan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white p-4 border-2 border-slate-900 neo-shadow flex flex-col justify-between rounded-xs"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-slate-900">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-700" />
              <h3 className="font-black text-xs uppercase text-slate-900">
                Distribusi Jenis Kegiatan
              </h3>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={giatPerJenisData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#0f172a' }} interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#0f172a' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="jumlahGiat" name="Total Giat" fill="#7C3AED" stroke="#0f172a" strokeWidth={1.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
