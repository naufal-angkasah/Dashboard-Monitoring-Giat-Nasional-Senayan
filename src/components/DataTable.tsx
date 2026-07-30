import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileSpreadsheet, 
  Printer, 
  Eye, 
  Search, 
  ArrowUpDown, 
  Sparkles, 
  CheckCircle,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { ActivityItem } from '../types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DataTableProps {
  activities: ActivityItem[];
  onSelectActivity: (activity: ActivityItem) => void;
  userRole: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  activities,
  onSelectActivity,
  userRole,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof ActivityItem>('tanggal');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sorting
  const sortedActivities = [...activities].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return sortOrder === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // Pagination
  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = sortedActivities.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof ActivityItem) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Export Excel (.xlsx)
  const handleExportExcel = () => {
    const exportData = sortedActivities.map((item, index) => ({
      'No': index + 1,
      'ID Kegiatan': item.id,
      'Tahun': item.tahun,
      'Kategori Giat': item.kategoriGiat,
      'Jenis Giat': item.jenisGiat,
      'Tema Giat': item.temaGiat,
      'Nama Kegiatan': item.namaGiat,
      'Penanggung Jawab / Peserta': item.namaPeserta,
      'Asal Instansi': item.asalInstansi,
      'Segmentasi Peserta': item.segmentasiPeserta,
      'Jumlah Peserta': item.jumlahPeserta,
      'Lokasi': item.lokasi,
      'Tanggal': item.tanggal,
      'Status': item.status,
      'Sumber Data': item.source,
      'Kontak': item.kontak
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan_Giat_Senayan');
    XLSX.writeFile(
      workbook, 
      `Laporan_Giat_Senayan_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    
    // Header Title
    doc.setFontSize(16);
    doc.text('LAPORAN MONITORING GIAT NASIONAL SENAYAN (MPR / DPR RI)', 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')} | Total Data: ${sortedActivities.length} Kegiatan`, 14, 22);

    const tableColumn = [
      'No', 'ID', 'Tahun', 'Kategori', 'Jenis Giat', 'Nama Kegiatan', 'Instansi', 'Segmentasi', 'Peserta', 'Tanggal'
    ];

    const tableRows = sortedActivities.map((item, idx) => [
      idx + 1,
      item.id,
      item.tahun,
      item.kategoriGiat,
      item.jenisGiat,
      item.namaGiat.length > 28 ? item.namaGiat.substring(0, 26) + '...' : item.namaGiat,
      item.asalInstansi.length > 20 ? item.asalInstansi.substring(0, 18) + '...' : item.asalInstansi,
      item.segmentasiPeserta,
      item.jumlahPeserta.toLocaleString('id-ID'),
      item.tanggal
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [24, 24, 27], textColor: [255, 255, 255], fontStyle: 'bold' }
    });

    doc.save(`Laporan_Giat_Senayan_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="bg-white border-2 border-slate-900 neo-shadow p-4 mb-8 rounded-xs">
      
      {/* HEADER TABLE & EXPORT ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-amber-400 text-slate-900 border border-slate-900 neo-shadow-sm rounded-xs">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-black text-base uppercase text-slate-900 tracking-tight">
              Detail Data Monitoring Kegiatan Nasional
            </h3>
          </div>
          <p className="text-[11px] font-mono text-slate-600 mt-0.5">
            Daftar kegiatan ter-sinkronisasi dengan Google Form & Spreadsheet
          </p>
        </div>

        {/* EXPORT BUTTONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold border-2 border-slate-900 neo-shadow-sm hover:bg-emerald-800 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-200" />
            <span>Export Excel</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 bg-rose-700 text-white px-3.5 py-1.5 text-xs font-bold border-2 border-slate-900 neo-shadow-sm hover:bg-rose-800 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-200" />
            <span>Cetak PDF</span>
          </motion.button>
        </div>
      </div>

      {/* TABLE CONTAINER WITH STICKY COLUMN FOR MOBILE */}
      <div className="overflow-x-auto relative border-2 border-slate-900 neo-shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#1E293B] text-slate-100 font-bold uppercase text-[11px] font-mono border-b-2 border-slate-900">
              <th className="p-3 border-r border-slate-700 w-10 text-center">No</th>
              
              {/* STICKY COLUMN FOR NAMA KEGIATAN ON MOBILE */}
              <th 
                onClick={() => handleSort('namaGiat')}
                className="p-3 border-r border-slate-700 min-w-[220px] sticky left-0 bg-[#1E293B] z-10 cursor-pointer hover:text-amber-300"
              >
                <div className="flex items-center justify-between">
                  <span>Nama Kegiatan</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('tahun')}
                className="p-3 border-r border-slate-700 min-w-[70px] text-center cursor-pointer hover:text-amber-300"
              >
                Tahun
              </th>

              <th 
                onClick={() => handleSort('kategoriGiat')}
                className="p-3 border-r border-slate-700 min-w-[90px] text-center cursor-pointer hover:text-amber-300"
              >
                Kategori
              </th>

              <th className="p-3 border-r border-slate-700 min-w-[140px]">Jenis Giat</th>
              <th className="p-3 border-r border-slate-700 min-w-[140px]">Tema Giat</th>
              <th className="p-3 border-r border-slate-700 min-w-[160px]">Asal Instansi</th>
              <th className="p-3 border-r border-slate-700 min-w-[140px]">Segmentasi</th>
              
              <th 
                onClick={() => handleSort('jumlahPeserta')}
                className="p-3 border-r border-slate-700 min-w-[110px] text-right cursor-pointer hover:text-amber-300"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Peserta</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th className="p-3 border-r border-slate-700 min-w-[110px] text-center">Sumber</th>
              <th className="p-3 min-w-[90px] text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 font-sans">
            {paginatedActivities.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-500 font-mono text-xs">
                  Tidak ada kegiatan yang ditemukan. Silakan sesuaikan filter pencarian Anda.
                </td>
              </tr>
            ) : (
              paginatedActivities.map((activity, index) => (
                <tr 
                  key={activity.id}
                  className="hover:bg-slate-100/90 transition-colors border-b border-slate-200"
                >
                  <td className="p-3 font-mono font-bold text-center border-r border-slate-200 text-slate-600">
                    {startIndex + index + 1}
                  </td>

                  {/* STICKY COLUMN FOR NAMA KEGIATAN */}
                  <td className="p-3 font-bold text-slate-900 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    <div>
                      <span className="hover:underline cursor-pointer hover:text-blue-700" onClick={() => onSelectActivity(activity)}>
                        {activity.namaGiat}
                      </span>
                      <span className="block text-[11px] font-mono font-normal text-slate-500 mt-0.5">
                        {activity.lokasi} • {activity.tanggal}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 font-mono font-bold text-center border-r border-slate-200 text-slate-800">
                    {activity.tahun}
                  </td>

                  <td className="p-3 text-center border-r border-slate-200">
                    <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 border border-slate-900 rounded-xs ${
                      activity.kategoriGiat === 'MPR'
                        ? 'bg-blue-600 text-white'
                        : activity.kategoriGiat === 'DPR'
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {activity.kategoriGiat}
                    </span>
                  </td>

                  <td className="p-3 font-semibold text-slate-800 border-r border-slate-200 text-[11px]">
                    {activity.jenisGiat}
                  </td>

                  <td className="p-3 text-slate-700 border-r border-slate-200 text-[11px]">
                    {activity.temaGiat}
                  </td>

                  <td className="p-3 font-medium text-slate-900 border-r border-slate-200 text-[11px]">
                    {activity.asalInstansi}
                  </td>

                  <td className="p-3 border-r border-slate-200">
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 border border-slate-300 rounded-xs">
                      {activity.segmentasiPeserta}
                    </span>
                  </td>

                  <td className="p-3 font-bold text-slate-900 text-right border-r border-slate-200 font-mono text-sm">
                    {activity.jumlahPeserta.toLocaleString('id-ID')}
                  </td>

                  <td className="p-3 text-center border-r border-slate-200">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-emerald-50 text-emerald-900 px-2 py-0.5 border border-emerald-300 rounded-xs">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                      {activity.source}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => onSelectActivity(activity)}
                      className="bg-slate-900 text-white hover:bg-amber-400 hover:text-slate-900 p-1.5 border border-slate-900 neo-shadow-sm cursor-pointer transition-colors rounded-xs"
                      title="Lihat Rincian Kegiatan"
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

      {/* PAGINATION FOOTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t-2 border-slate-900 font-mono text-xs">
        <div className="text-slate-600">
          Menampilkan <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + itemsPerPage, sortedActivities.length)}</strong> dari <strong>{sortedActivities.length}</strong> Kegiatan
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 text-[11px]">Baris:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-800 p-1 font-bold text-xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1 bg-white border border-slate-800 disabled:opacity-30 cursor-pointer hover:bg-amber-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-1 bg-white border border-slate-800 disabled:opacity-30 cursor-pointer hover:bg-amber-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
