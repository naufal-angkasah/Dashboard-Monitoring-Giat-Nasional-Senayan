import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Building2, 
  Calendar, 
  MapPin, 
  Users, 
  UserCheck, 
  Phone, 
  FileText, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Tag
} from 'lucide-react';
import { ActivityItem } from '../types';
import jsPDF from 'jspdf';

interface DetailModalProps {
  activity: ActivityItem | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ activity, onClose }) => {
  if (!activity) return null;

  const handlePrintSinglePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('BERITA ACARA & LEMBAR DETAIL KEGIATAN SENAYAN', 14, 20);
    
    doc.setFontSize(11);
    doc.text(`ID Kegiatan: ${activity.id}`, 14, 30);
    doc.text(`Nama Kegiatan: ${activity.namaGiat}`, 14, 38);
    doc.text(`Kategori Giat: ${activity.kategoriGiat} RI`, 14, 46);
    doc.text(`Jenis / Tema: ${activity.jenisGiat} | ${activity.temaGiat}`, 14, 54);
    doc.text(`Tahun / Tanggal: ${activity.tahun} | ${activity.tanggal}`, 14, 62);
    doc.text(`Asal Instansi: ${activity.asalInstansi}`, 14, 70);
    doc.text(`Segmentasi Peserta: ${activity.segmentasiPeserta}`, 14, 78);
    doc.text(`Jumlah Peserta: ${activity.jumlahPeserta.toLocaleString('id-ID')} Orang`, 14, 86);
    doc.text(`Penanggung Jawab: ${activity.namaPeserta} (${activity.kontak})`, 14, 94);
    doc.text(`Lokasi Pelaksanaan: ${activity.lokasi}`, 14, 102);
    doc.text(`Status Sync: Google Form Auto-Synced (${activity.source})`, 14, 110);
    if (activity.catatan) {
      doc.text(`Catatan Evaluasi: ${activity.catatan}`, 14, 118);
    }

    doc.save(`Detail_Giat_${activity.id}.pdf`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#FFFDF9] border-4 border-black neo-shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="bg-[#18181B] text-white p-4 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-xs font-mono font-black border border-white ${
                activity.kategoriGiat === 'MPR' ? 'bg-[#2563EB]' : activity.kategoriGiat === 'DPR' ? 'bg-[#DC2626]' : 'bg-[#10B981]'
              }`}>
                {activity.kategoriGiat}
              </span>
              <h3 className="font-black text-sm uppercase font-mono text-yellow-300">
                Detail Lembar Monitoring Giat #{activity.id}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-white text-black hover:bg-yellow-300 border border-black cursor-pointer neo-shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                Judul Official Kegiatan:
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5 leading-snug">
                {activity.namaGiat}
              </h2>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50/80 p-4 border-2 border-black neo-shadow-sm font-mono text-xs">
              
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-black shrink-0" />
                  <span>Tahun / Tanggal: <strong>{activity.tahun} ({activity.tanggal})</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-black shrink-0" />
                  <span>Jenis Giat: <strong>{activity.jenisGiat}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-black shrink-0" />
                  <span>Tema Giat: <strong>{activity.temaGiat}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-black shrink-0" />
                  <span>Lokasi: <strong>{activity.lokasi}</strong></span>
                </p>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-black shrink-0" />
                  <span>Instansi: <strong>{activity.asalInstansi}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-black shrink-0" />
                  <span>Segmentasi: <strong>{activity.segmentasiPeserta}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-black shrink-0" />
                  <span>Total Peserta: <strong className="text-blue-700">{activity.jumlahPeserta.toLocaleString('id-ID')} Orang</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-black shrink-0" />
                  <span>PJ / Kontak: <strong>{activity.namaPeserta} ({activity.kontak})</strong></span>
                </p>
              </div>

            </div>

            {/* Google Form Status */}
            <div className="bg-emerald-50 border-2 border-emerald-800 p-3 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="font-bold text-emerald-900 block">Status Data Cloud Spreadsheet</span>
                  <span className="text-[11px] text-emerald-800">Tersinkronisasi via Google Form Integration & Auto-Sync</span>
                </div>
              </div>
              <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 border border-emerald-800 text-[10px]">
                {activity.source}
              </span>
            </div>

            {/* Notes */}
            {activity.catatan && (
              <div className="border-2 border-black p-3 bg-white neo-shadow-sm text-xs font-sans">
                <span className="font-black text-slate-800 block uppercase font-mono text-[10px] mb-1">
                  Catatan Evaluasi / Rekomendasi Pimpinan:
                </span>
                <p className="text-slate-700">{activity.catatan}</p>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-black">
              <button
                onClick={handlePrintSinglePDF}
                className="flex items-center gap-1.5 bg-[#DC2626] text-white px-4 py-2 font-bold text-xs border-2 border-black neo-shadow hover:bg-red-700 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Download PDF Detail</span>
              </button>

              <button
                onClick={onClose}
                className="bg-slate-200 text-black px-4 py-2 font-bold text-xs border-2 border-black neo-shadow cursor-pointer hover:bg-slate-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
