import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Users, 
  Building, 
  Tag, 
  BookOpen, 
  PieChart as PieIcon,
  Award,
  HeartHandshake,
  TrendingUp
} from 'lucide-react';
import { ExecutiveSummaryStats } from '../types';

interface ExecutiveSummaryCardsProps {
  stats: ExecutiveSummaryStats;
  activeCategoryTab: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect';
  totalEbyPrograms?: number;
  totalEbyPenerima?: number;
}

export const ExecutiveSummaryCards: React.FC<ExecutiveSummaryCardsProps> = ({
  stats,
  activeCategoryTab,
  totalEbyPrograms = 7,
  totalEbyPenerima = 8920,
}) => {
  // Mode EBY Connect Simple Layout
  if (activeCategoryTab === 'EBY Connect') {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#10B981] border border-black neo-shadow-sm" />
            <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
              Executive Summary: EBY Connect (Program Non-Dapil)
            </h2>
          </div>
          <span className="text-xs font-mono bg-[#A7F3D0] border border-black px-2 py-0.5 font-bold">
            Tampilan Sederhana Mode Non-Dapil
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Program */}
          <motion.div
            whileHover={{ y: -3, boxShadow: '6px 6px 0px 0px #000' }}
            className="bg-[#10B981] text-white p-4 neo-border neo-shadow flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                  Total Program EBY
                </p>
                <h3 className="text-3xl font-black mt-1 text-white">
                  {totalEbyPrograms} <span className="text-sm font-normal">Program</span>
                </h3>
              </div>
              <div className="p-2.5 bg-black text-emerald-400 border border-white neo-shadow-sm">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] font-mono text-emerald-100 mt-3 border-t border-emerald-400/50 pt-2">
              KIPK, LPDP, Bus Mudik, Beasiswa Santri
            </p>
          </motion.div>

          {/* Card 2: Total Penerima */}
          <motion.div
            whileHover={{ y: -3, boxShadow: '6px 6px 0px 0px #000' }}
            className="bg-[#FACC15] text-black p-4 neo-border neo-shadow flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Total Penerima Manfaat
                </p>
                <h3 className="text-3xl font-black mt-1 text-black">
                  {totalEbyPenerima.toLocaleString('id-ID')}{' '}
                  <span className="text-sm font-normal">Orang</span>
                </h3>
              </div>
              <div className="p-2.5 bg-black text-yellow-400 border border-black neo-shadow-sm">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] font-mono text-slate-900 mt-3 border-t border-black/20 pt-2">
              Penerima manfaat langsung & keluarga
            </p>
          </motion.div>

          {/* Card 3: Rata-rata Penerima */}
          <motion.div
            whileHover={{ y: -3, boxShadow: '6px 6px 0px 0px #000' }}
            className="bg-white text-black p-4 neo-border neo-shadow flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Rata-Rata Penerima
                </p>
                <h3 className="text-3xl font-black mt-1 text-slate-900">
                  {Math.round(totalEbyPenerima / (totalEbyPrograms || 1)).toLocaleString('id-ID')}{' '}
                  <span className="text-sm font-normal">/ Prog</span>
                </h3>
              </div>
              <div className="p-2.5 bg-[#3B82F6] text-white border border-black neo-shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] font-mono text-slate-600 mt-3 border-t border-slate-200 pt-2">
              Rata-rata jangkauan per program
            </p>
          </motion.div>

          {/* Card 4: Mitra & Penyaluran */}
          <motion.div
            whileHover={{ y: -3, boxShadow: '6px 6px 0px 0px #000' }}
            className="bg-[#A7F3D0] text-black p-4 neo-border neo-shadow flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Mitra Strategis
                </p>
                <h3 className="text-3xl font-black mt-1 text-black">
                  12 <span className="text-sm font-normal">Kementerian/PT</span>
                </h3>
              </div>
              <div className="p-2.5 bg-black text-white border border-black neo-shadow-sm">
                <HeartHandshake className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <p className="text-[11px] font-mono text-slate-800 mt-3 border-t border-black/20 pt-2">
              Kemendikbud, Kemenhub, Kemenag, LPDP
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Standard Mode (ALL, MPR, DPR)
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#FACC15] border border-black neo-shadow-sm" />
          <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
            Executive Summary: Executive KPI Giat Nasional
          </h2>
        </div>
        <span className="text-xs font-mono bg-white border border-black px-2.5 py-1 neo-shadow-sm font-bold hidden sm:inline-block">
          Data Real-Time Ter-filter
        </span>
      </div>

      {/* Grid KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Giat (Soft Amber) */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#FEF3C7] border-2 border-slate-900 p-4 text-slate-900 neo-shadow flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Total Giat
              </p>
              <h3 className="text-4xl font-black mt-1 text-amber-950">
                {stats.totalGiat}
              </h3>
            </div>
            <div className="p-2 bg-slate-900 text-amber-300 border border-slate-900 neo-shadow-sm rounded-xs">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold bg-white/80 w-fit px-2.5 py-0.5 border border-slate-900 text-slate-900 rounded-xs">
            MPR {stats.percentMPR}% • DPR {stats.percentDPR}%
          </div>
        </motion.div>

        {/* Card 2: Total Peserta (Soft Slate Blue) */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#DBEAFE] border-2 border-slate-900 p-4 text-slate-900 neo-shadow flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Total Peserta
              </p>
              <h3 className="text-4xl font-black mt-1 text-blue-950">
                {stats.totalPeserta > 1000 ? `${(stats.totalPeserta/1000).toFixed(1)}K` : stats.totalPeserta}
              </h3>
            </div>
            <div className="p-2 bg-slate-900 text-blue-300 border border-slate-900 neo-shadow-sm rounded-xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold bg-white/80 w-fit px-2.5 py-0.5 border border-slate-900 text-blue-950 rounded-xs">
            Terverifikasi Live
          </div>
        </motion.div>

        {/* Card 3: Total Instansi (Soft Emerald) */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#D1FAE5] border-2 border-slate-900 p-4 text-slate-900 neo-shadow flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Total Instansi
              </p>
              <h3 className="text-4xl font-black mt-1 text-emerald-950">
                {stats.totalInstansi}
              </h3>
            </div>
            <div className="p-2 bg-slate-900 text-emerald-300 border border-slate-900 neo-shadow-sm rounded-xs">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold bg-white/80 w-fit px-2.5 py-0.5 border border-slate-900 text-emerald-950 rounded-xs">
            Nasional & Daerah
          </div>
        </motion.div>

        {/* Card 4: Segmentasi (Soft Rose) */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-[#FEE2E2] border-2 border-slate-900 p-4 text-slate-900 neo-shadow flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-900">
                Segmentasi
              </p>
              <h3 className="text-4xl font-black mt-1 text-rose-950">
                {stats.totalSegmentasi}
              </h3>
            </div>
            <div className="p-2 bg-slate-900 text-rose-300 border border-slate-900 neo-shadow-sm rounded-xs">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-bold bg-white/80 w-fit px-2.5 py-0.5 border border-slate-900 text-rose-950 rounded-xs">
            Kelompok Prioritas
          </div>
        </motion.div>

      </div>

      {/* Komparasi MPR vs DPR Visual Composition Bar */}
      <div className="mt-4 bg-white p-3.5 border-2 border-slate-900 neo-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <PieIcon className="w-5 h-5 text-slate-900" />
          <span className="font-black text-xs uppercase tracking-wide text-slate-900">
            Komposisi Komparasi MPR vs DPR:
          </span>
        </div>

        <div className="flex-1 max-w-xl flex flex-col gap-1">
          <div className="h-6 w-full border-2 border-slate-900 flex overflow-hidden neo-shadow-sm rounded-xs">
            <div 
              style={{ width: `${stats.percentMPR}%` }}
              className="bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] transition-all duration-500 overflow-hidden px-1"
              title={`MPR RI: ${stats.giatMPR} Giat (${stats.percentMPR}%)`}
            >
              {stats.percentMPR > 10 ? `MPR ${stats.percentMPR}%` : ''}
            </div>
            <div 
              style={{ width: `${stats.percentDPR}%` }}
              className="bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] transition-all duration-500 overflow-hidden px-1"
              title={`DPR RI: ${stats.giatDPR} Giat (${stats.percentDPR}%)`}
            >
              {stats.percentDPR > 10 ? `DPR ${stats.percentDPR}%` : ''}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold shrink-0 text-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-blue-600 border border-slate-900 inline-block" />
            MPR: {stats.giatMPR} ({stats.percentMPR}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-rose-600 border border-slate-900 inline-block" />
            DPR: {stats.giatDPR} ({stats.percentDPR}%)
          </span>
        </div>
      </div>
    </div>
  );
};
