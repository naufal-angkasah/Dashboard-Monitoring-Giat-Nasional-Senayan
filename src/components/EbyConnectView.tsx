import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Award, 
  Users, 
  Calendar, 
  Search, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Building2,
  Phone,
  Eye
} from 'lucide-react';
import { EbyConnectProgram } from '../types';
import * as XLSX from 'xlsx';

interface EbyConnectViewProps {
  programs: EbyConnectProgram[];
  onOpenDetailProgram?: (program: EbyConnectProgram) => void;
}

export const EbyConnectView: React.FC<EbyConnectViewProps> = ({ 
  programs,
  onOpenDetailProgram
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedJenisProgram, setSelectedJenisProgram] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique filter options
  const availableYears = Array.from(new Set(programs.map(p => p.tahun))).sort().reverse();
  const availableJenis = Array.from(new Set(programs.map(p => p.jenisProgram))).sort();

  // Filter programs
  const filteredPrograms = programs.filter(p => {
    const matchYear = selectedYear === 'ALL' || p.tahun === selectedYear;
    const matchJenis = selectedJenisProgram === 'ALL' || p.jenisProgram === selectedJenisProgram;
    const matchSearch = searchQuery === '' || 
      p.namaProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.penerima.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.instansiMitra.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.wilayah.toLowerCase().includes(searchQuery.toLowerCase());

    return matchYear && matchJenis && matchSearch;
  });

  // Totals
  const totalPrograms = filteredPrograms.length;
  const totalPenerima = filteredPrograms.reduce((acc, p) => acc + p.jumlahPenerima, 0);

  // Export Excel
  const handleExportExcel = () => {
    const exportData = filteredPrograms.map((p, index) => ({
      'No': index + 1,
      'ID Program': p.id,
      'Tahun': p.tahun,
      'Jenis Program': p.jenisProgram,
      'Nama Program': p.namaProgram,
      'Sasaran Penerima': p.penerima,
      'Jumlah Penerima': p.jumlahPenerima,
      'Wilayah Penyaluran': p.wilayah,
      'Status Penyaluran': p.status,
      'Instansi Mitra': p.instansiMitra,
      'Tanggal Pelaksanaan': p.tanggal,
      'Kontak Penanggung Jawab': p.kontak
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan EBY Connect');
    XLSX.writeFile(workbook, `Laporan_EBY_Connect_${selectedYear}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER FOR MODE EBY CONNECT */}
      <div className="bg-emerald-800 text-white p-6 border-2 border-slate-900 neo-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-300 text-slate-900 border-2 border-slate-900 neo-shadow-sm flex items-center justify-center shrink-0 font-black text-2xl rounded-xs">
            <Sparkles className="w-8 h-8 text-slate-900 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-amber-300 text-[10px] font-bold uppercase px-2 py-0.5 border border-slate-700 font-mono rounded-xs">
                MODE SEDERHANA NON-DAPIL
              </span>
              <span className="bg-white text-emerald-950 text-[10px] font-bold uppercase px-2 py-0.5 border border-slate-900 font-mono rounded-xs">
                EBY CONNECT
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Dashboard Program EBY Connect (Non-Dapil)
            </h2>
            <p className="text-xs font-mono text-emerald-100 mt-0.5">
              Monitoring penyaluran Beasiswa KIP-K, LPDP, Bus Mudik, Bantuan UMKM, & Beasiswa Santri
            </p>
          </div>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-amber-400 text-slate-900 px-4 py-2 text-xs font-bold border-2 border-slate-900 neo-shadow hover:bg-amber-300 cursor-pointer shrink-0 rounded-xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-900" />
          <span>Export Excel EBY</span>
        </button>
      </div>

      {/* FILTER SIMPLE SECTION */}
      <div className="bg-white p-4 border-2 border-slate-900 neo-shadow rounded-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Filter 1: Jenis Program */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-slate-900" /> Filter Jenis Program:
            </label>
            <select
              value={selectedJenisProgram}
              onChange={(e) => setSelectedJenisProgram(e.target.value)}
              className="w-full bg-emerald-50 border-2 border-slate-900 text-xs font-bold p-2 neo-shadow-sm focus:outline-none focus:bg-emerald-100 text-slate-900"
            >
              <option value="ALL">Semua Jenis Program</option>
              {availableJenis.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* Filter 2: Tahun */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-900" /> Filter Tahun:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 text-xs font-bold p-2 neo-shadow-sm focus:outline-none focus:bg-amber-50 text-slate-900"
            >
              <option value="ALL">Semua Tahun</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-slate-900" /> Pencarian Program:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari program, mitra, wilayah..."
                className="w-full pl-8 pr-3 py-1.5 text-xs font-bold bg-white border-2 border-slate-900 neo-shadow-sm focus:outline-none focus:bg-amber-50 text-slate-900"
              />
            </div>
          </div>

        </div>
      </div>

      {/* KPI SUMMARY SIMPLE (Total Program & Total Penerima) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Total Program */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-emerald-800 text-white p-5 border-2 border-slate-900 neo-shadow flex items-center justify-between rounded-xs"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 font-mono">
              Total Program Terdata
            </span>
            <h3 className="text-4xl font-black text-white mt-1">
              {totalPrograms} <span className="text-lg font-normal text-emerald-100">Program</span>
            </h3>
            <p className="text-xs font-mono text-emerald-100 mt-2">
              Program bantuan pendidikan & kemasyarakatan
            </p>
          </div>
          <div className="w-14 h-14 bg-slate-900 text-emerald-400 border-2 border-slate-700 neo-shadow-sm flex items-center justify-center rounded-xs">
            <Award className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Total Penerima */}
        <motion.div 
          whileHover={{ y: -3 }}
          className="bg-amber-400 text-slate-900 p-5 border-2 border-slate-900 neo-shadow flex items-center justify-between rounded-xs"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
              Total Penerima Manfaat
            </span>
            <h3 className="text-4xl font-black text-slate-900 mt-1">
              {totalPenerima.toLocaleString('id-ID')}{' '}
              <span className="text-lg font-normal text-slate-800">Orang / KK</span>
            </h3>
            <p className="text-xs font-mono text-slate-800 mt-2">
              Terverifikasi oleh kementerian mitra
            </p>
          </div>
          <div className="w-14 h-14 bg-slate-900 text-amber-300 border-2 border-slate-900 neo-shadow-sm flex items-center justify-center rounded-xs">
            <Users className="w-8 h-8" />
          </div>
        </motion.div>

      </div>

      {/* TABEL DETAIL EBY CONNECT */}
      <div className="bg-white border-2 border-slate-900 neo-shadow p-4 rounded-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-emerald-600 border border-slate-900 neo-shadow-sm rounded-xs" />
            <h3 className="font-black text-sm uppercase text-slate-900">
              Tabel Detail Program EBY Connect
            </h3>
          </div>
          <span className="text-xs font-mono bg-slate-100 border border-slate-800 px-2 py-0.5 text-slate-800 font-bold">
            Menampilkan {filteredPrograms.length} data
          </span>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto relative border-2 border-slate-900 neo-shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1E293B] text-slate-100 font-bold uppercase text-[11px] font-mono border-b-2 border-slate-900">
                <th className="p-3 border-r border-slate-700 w-12 text-center">No</th>
                <th className="p-3 border-r border-slate-700 min-w-[200px] sticky left-0 bg-[#1E293B] z-10">
                  Nama Program
                </th>
                <th className="p-3 border-r border-slate-700 min-w-[140px]">Jenis Program</th>
                <th className="p-3 border-r border-slate-700 min-w-[80px] text-center">Tahun</th>
                <th className="p-3 border-r border-slate-700 min-w-[160px]">Sasaran Penerima</th>
                <th className="p-3 border-r border-slate-700 min-w-[120px] text-right">Jumlah Penerima</th>
                <th className="p-3 border-r border-slate-700 min-w-[140px]">Status Penyaluran</th>
                <th className="p-3 border-r border-slate-700 min-w-[180px]">Instansi Mitra</th>
                <th className="p-3 min-w-[100px] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 font-mono text-xs">
                    Tidak ada program EBY Connect yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program, index) => (
                  <tr 
                    key={program.id}
                    className="hover:bg-slate-100/90 transition-colors border-b border-slate-200"
                  >
                    <td className="p-3 font-mono font-bold text-center border-r border-slate-200 text-slate-600">
                      {index + 1}
                    </td>
                    
                    {/* Sticky Column for Mobile */}
                    <td className="p-3 font-bold text-slate-900 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                      <div>
                        {program.namaProgram}
                        <span className="block text-[11px] font-mono font-normal text-slate-500 mt-0.5">
                          ID: {program.id} • {program.tanggal}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 font-semibold border-r border-slate-200">
                      <span className="bg-emerald-100 text-emerald-950 font-mono text-[10px] font-bold px-2 py-0.5 border border-emerald-400 rounded-xs">
                        {program.jenisProgram}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-bold text-center border-r border-slate-200 text-slate-800">
                      {program.tahun}
                    </td>

                    <td className="p-3 text-slate-800 border-r border-slate-200 font-medium">
                      {program.penerima}
                    </td>

                    <td className="p-3 font-bold text-slate-900 text-right border-r border-slate-200 font-mono text-sm">
                      {program.jumlahPenerima.toLocaleString('id-ID')} Orang
                    </td>

                    <td className="p-3 border-r border-slate-200">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 border border-slate-900 rounded-xs ${
                        program.status === 'Penyaluran Selesai' 
                          ? 'bg-emerald-200 text-emerald-950'
                          : program.status === 'Proses Penyaluran'
                          ? 'bg-amber-300 text-amber-950'
                          : 'bg-blue-200 text-blue-950'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {program.status}
                      </span>
                    </td>

                    <td className="p-3 text-slate-700 border-r border-slate-200 font-mono text-[11px]">
                      {program.instansiMitra}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => onOpenDetailProgram && onOpenDetailProgram(program)}
                        className="bg-slate-900 text-white hover:bg-amber-400 hover:text-slate-900 p-1.5 border border-slate-900 neo-shadow-sm cursor-pointer transition-colors rounded-xs"
                        title="Lihat Detail Program"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
