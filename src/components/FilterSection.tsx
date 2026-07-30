import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  X, 
  Check, 
  SlidersHorizontal,
  Calendar,
  Layers,
  Tag,
  Building,
  UserCheck
} from 'lucide-react';
import { FilterState } from '../types';

interface FilterSectionProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  availableYears: string[];
  availableJenisGiat: string[];
  availableTemaGiat: string[];
  availableSegmentasi: string[];
  availableInstansi: string[];
  onResetFilter: () => void;
  activeCount: number;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filter,
  setFilter,
  availableYears,
  availableJenisGiat,
  availableTemaGiat,
  availableSegmentasi,
  availableInstansi,
  onResetFilter,
  activeCount,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  return (
    <div className="bg-white border-2 border-slate-900 neo-shadow p-4 mb-6 rounded-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b-2 border-slate-900">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-900 text-amber-300 neo-shadow-sm rounded-xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase text-slate-900 tracking-wide">
              Filter Data Monitoring Giat
            </h3>
            <p className="text-[11px] font-mono text-slate-600">
              Parameter tahun, instansi, tema, dan jenis kegiatan
            </p>
          </div>
        </div>

        {/* Search Input & Reset */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari kegiatan, instansi, tema..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-white border-2 border-slate-900 neo-shadow-sm focus:outline-none focus:bg-amber-50 text-slate-900"
            />
            {filter.searchQuery && (
              <button
                onClick={() => setFilter(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onResetFilter}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 text-xs font-bold border-2 border-slate-900 neo-shadow-sm cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Mobile Drawer Trigger Button */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden flex items-center gap-1.5 bg-amber-400 text-slate-900 px-3 py-1.5 text-xs font-bold border-2 border-slate-900 neo-shadow-sm cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter ({activeCount})</span>
          </button>
        </div>
      </div>

      {/* Desktop Filter Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-6 gap-3">
        
        {/* Filter 1: Tahun */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-900" /> Tahun:
          </label>
          <select
            value={filter.tahun}
            onChange={(e) => setFilter(prev => ({ ...prev, tahun: e.target.value }))}
            className="w-full bg-white border-2 border-slate-900 text-xs font-bold p-1.5 neo-shadow-sm focus:outline-none focus:bg-amber-50 text-slate-900"
          >
            <option value="ALL">Semua Tahun</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Filter 2: Kategori Giat */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-900" /> Kategori:
          </label>
          <select
            value={filter.kategoriGiat}
            onChange={(e) => setFilter(prev => ({ ...prev, kategoriGiat: e.target.value as any }))}
            className="w-full bg-white border-2 border-slate-900 text-xs font-bold p-1.5 neo-shadow-sm focus:outline-none focus:bg-amber-50 text-slate-900"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="MPR">MPR RI</option>
            <option value="DPR">DPR RI</option>
            <option value="EBY Connect">EBY Connect</option>
          </select>
        </div>

        {/* Filter 3: Jenis Giat */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-900" /> Jenis Giat:
          </label>
          <select
            value={filter.jenisGiat}
            onChange={(e) => setFilter(prev => ({ ...prev, jenisGiat: e.target.value }))}
            className="w-full bg-white border-2 border-slate-900 text-xs font-bold p-1.5 neo-shadow-sm focus:outline-none focus:bg-amber-50 text-slate-900"
          >
            <option value="ALL">Semua Jenis</option>
            {availableJenisGiat.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Filter 4: Tema Giat */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-900" /> Tema Giat:
          </label>
          <select
            value={filter.temaGiat}
            onChange={(e) => setFilter(prev => ({ ...prev, temaGiat: e.target.value }))}
            className="w-full bg-white border-2 border-slate-900 text-xs font-bold p-1.5 neo-shadow-sm focus:outline-none focus:bg-amber-50 text-slate-900"
          >
            <option value="ALL">Semua Tema</option>
            {availableTemaGiat.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Filter 5: Segmentasi Peserta */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-900" /> Segmentasi:
          </label>
          <select
            value={filter.segmentasiPeserta}
            onChange={(e) => setFilter(prev => ({ ...prev, segmentasiPeserta: e.target.value }))}
            className="w-full bg-white border-2 border-slate-900 text-xs font-bold p-1.5 neo-shadow-sm focus:outline-none focus:bg-amber-50 text-slate-900"
          >
            <option value="ALL">Semua Segmentasi</option>
            {availableSegmentasi.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Filter 6: Instansi */}
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-slate-900" /> Instansi:
          </label>
          <select
            value={filter.instansi}
            onChange={(e) => setFilter(prev => ({ ...prev, instansi: e.target.value }))}
            className="w-full bg-white border-2 border-slate-900 text-xs font-bold p-1.5 neo-shadow-sm focus:outline-none focus:bg-amber-50 text-slate-900"
          >
            <option value="ALL">Semua Instansi</option>
            {availableInstansi.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-200 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-[11px] text-slate-500 uppercase font-mono">Filter Aktif:</span>
          {filter.tahun !== 'ALL' && (
            <span className="bg-yellow-300 text-black px-2 py-0.5 border border-black font-mono font-bold text-[11px] flex items-center gap-1">
              Tahun: {filter.tahun}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(p => ({ ...p, tahun: 'ALL' }))} />
            </span>
          )}
          {filter.kategoriGiat !== 'ALL' && (
            <span className="bg-blue-200 text-black px-2 py-0.5 border border-black font-mono font-bold text-[11px] flex items-center gap-1">
              Kat: {filter.kategoriGiat}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(p => ({ ...p, kategoriGiat: 'ALL' }))} />
            </span>
          )}
          {filter.jenisGiat !== 'ALL' && (
            <span className="bg-emerald-200 text-black px-2 py-0.5 border border-black font-mono font-bold text-[11px] flex items-center gap-1">
              Jenis: {filter.jenisGiat}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(p => ({ ...p, jenisGiat: 'ALL' }))} />
            </span>
          )}
          {filter.temaGiat !== 'ALL' && (
            <span className="bg-pink-200 text-black px-2 py-0.5 border border-black font-mono font-bold text-[11px] flex items-center gap-1">
              Tema: {filter.temaGiat}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(p => ({ ...p, temaGiat: 'ALL' }))} />
            </span>
          )}
          {filter.segmentasiPeserta !== 'ALL' && (
            <span className="bg-purple-200 text-black px-2 py-0.5 border border-black font-mono font-bold text-[11px] flex items-center gap-1">
              Seg: {filter.segmentasiPeserta}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(p => ({ ...p, segmentasiPeserta: 'ALL' }))} />
            </span>
          )}
          {filter.instansi !== 'ALL' && (
            <span className="bg-orange-200 text-black px-2 py-0.5 border border-black font-mono font-bold text-[11px] flex items-center gap-1">
              Instansi: {filter.instansi}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(p => ({ ...p, instansi: 'ALL' }))} />
            </span>
          )}
        </div>
      )}

      {/* MOBILE BOTTOM SHEET DRAWER */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 md:hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full bg-[#FFFDF9] border-t-4 border-x-4 border-black neo-shadow-xl p-5 max-h-[85vh] overflow-y-auto rounded-t-2xl"
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-black" />
                  <h3 className="font-black text-base uppercase text-black">
                    Filter Monitoring Mobile
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 bg-black text-white border border-black cursor-pointer neo-shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Tahun */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Tahun Kegiatan:
                  </label>
                  <select
                    value={filter.tahun}
                    onChange={(e) => setFilter(prev => ({ ...prev, tahun: e.target.value }))}
                    className="w-full bg-white border-2 border-black text-sm font-bold p-2 neo-shadow-sm"
                  >
                    <option value="ALL">Semua Tahun</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Kategori Giat */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Kategori Giat:
                  </label>
                  <select
                    value={filter.kategoriGiat}
                    onChange={(e) => setFilter(prev => ({ ...prev, kategoriGiat: e.target.value as any }))}
                    className="w-full bg-white border-2 border-black text-sm font-bold p-2 neo-shadow-sm"
                  >
                    <option value="ALL">Semua Kategori</option>
                    <option value="MPR">MPR RI</option>
                    <option value="DPR">DPR RI</option>
                    <option value="EBY Connect">EBY Connect</option>
                  </select>
                </div>

                {/* Jenis Giat */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Jenis Kegiatan:
                  </label>
                  <select
                    value={filter.jenisGiat}
                    onChange={(e) => setFilter(prev => ({ ...prev, jenisGiat: e.target.value }))}
                    className="w-full bg-white border-2 border-black text-sm font-bold p-2 neo-shadow-sm"
                  >
                    <option value="ALL">Semua Jenis</option>
                    {availableJenisGiat.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {/* Tema Giat */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Tema Kegiatan:
                  </label>
                  <select
                    value={filter.temaGiat}
                    onChange={(e) => setFilter(prev => ({ ...prev, temaGiat: e.target.value }))}
                    className="w-full bg-white border-2 border-black text-sm font-bold p-2 neo-shadow-sm"
                  >
                    <option value="ALL">Semua Tema</option>
                    {availableTemaGiat.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {/* Segmentasi */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Segmentasi Peserta:
                  </label>
                  <select
                    value={filter.segmentasiPeserta}
                    onChange={(e) => setFilter(prev => ({ ...prev, segmentasiPeserta: e.target.value }))}
                    className="w-full bg-white border-2 border-black text-sm font-bold p-2 neo-shadow-sm"
                  >
                    <option value="ALL">Semua Segmentasi</option>
                    {availableSegmentasi.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {/* Instansi */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Asal Instansi:
                  </label>
                  <select
                    value={filter.instansi}
                    onChange={(e) => setFilter(prev => ({ ...prev, instansi: e.target.value }))}
                    className="w-full bg-white border-2 border-black text-sm font-bold p-2 neo-shadow-sm"
                  >
                    <option value="ALL">Semua Instansi</option>
                    {availableInstansi.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    onClick={onResetFilter}
                    className="flex-1 bg-slate-200 text-black py-2.5 font-bold border-2 border-black neo-shadow-sm text-xs"
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex-1 bg-[#FACC15] text-black py-2.5 font-bold border-2 border-black neo-shadow text-xs"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
