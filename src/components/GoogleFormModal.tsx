import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Building2, 
  FileSpreadsheet,
  Link2
} from 'lucide-react';
import { ActivityItem, KategoriGiat } from '../types';

interface GoogleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNewActivity: (newActivity: ActivityItem) => void;
}

export const GoogleFormModal: React.FC<GoogleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitNewActivity,
}) => {
  const [kategoriGiat, setKategoriGiat] = useState<KategoriGiat>('MPR');
  const [tahun, setTahun] = useState<string>('2026');
  const [jenisGiat, setJenisGiat] = useState<string>('Sosialisasi 4 Pilar');
  const [temaGiat, setTemaGiat] = useState<string>('Kebangsaan & Pancasila');
  const [namaGiat, setNamaGiat] = useState<string>('');
  const [namaPeserta, setNamaPeserta] = useState<string>('');
  const [asalInstansi, setAsalInstansi] = useState<string>('');
  const [segmentasiPeserta, setSegmentasiPeserta] = useState<string>('Mahasiswa & Pelajar');
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(150);
  const [lokasi, setLokasi] = useState<string>('Gedung Nusantara Senayan');
  const [kontak, setKontak] = useState<string>('0812-3456-7890');
  const [catatan, setCatatan] = useState<string>('');
  const [isSuccessToast, setIsSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaGiat || !asalInstansi) return;

    const newEntry: ActivityItem = {
      id: `G-2026-${Math.floor(100 + Math.random() * 900)}`,
      tahun,
      kategoriGiat,
      jenisGiat,
      temaGiat,
      namaGiat,
      namaPeserta: namaPeserta || 'Perwakilan Peserta',
      asalInstansi,
      segmentasiPeserta,
      kontak,
      jumlahPeserta: Number(jumlahPeserta) || 100,
      lokasi,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Terlaksana',
      source: 'Google Form',
      catatan
    };

    onSubmitNewActivity(newEntry);
    setIsSuccessToast(true);

    setTimeout(() => {
      setIsSuccessToast(false);
      onClose();
      // Reset form
      setNamaGiat('');
      setAsalInstansi('');
      setNamaPeserta('');
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#FFFDF9] border-4 border-black neo-shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Form Header */}
          <div className="bg-[#673AB7] text-white p-4 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-yellow-300 text-black border border-black neo-shadow-sm">
                <Sparkles className="w-5 h-5 fill-yellow-300" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase font-mono text-white">
                  Form Absensi & Pendaftaran (Google Form Integration)
                </h3>
                <p className="text-[10px] text-purple-200 font-mono">
                  Input ini terhubung langsung ke Google Spreadsheet Cloud Master
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-white text-black hover:bg-yellow-300 border border-black cursor-pointer neo-shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Toast Overlay */}
          {isSuccessToast ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 bg-[#10B981] text-white border-2 border-black neo-shadow rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase">
                Data Berhasil Diterima Google Form!
              </h2>
              <p className="text-xs font-mono text-slate-600">
                Ter-sync otomatis ke Google Spreadsheet Cloud & Dashboard Monitoring Senayan.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-sans">
              
              <div className="bg-purple-50 p-3 border-2 border-purple-800 text-purple-900 font-mono flex items-center gap-2">
                <Link2 className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Simulasi pengisian Google Form Absensi Giat Senayan real-time.</span>
              </div>

              {/* Grid 1: Kategori & Tahun */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-slate-700 mb-1">
                    Kategori Giat:
                  </label>
                  <select
                    value={kategoriGiat}
                    onChange={(e) => setKategoriGiat(e.target.value as KategoriGiat)}
                    className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
                  >
                    <option value="MPR">MPR RI</option>
                    <option value="DPR">DPR RI</option>
                    <option value="EBY Connect">EBY Connect</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black uppercase text-slate-700 mb-1">
                    Tahun Kegiatan:
                  </label>
                  <select
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              {/* Nama Kegiatan */}
              <div>
                <label className="block font-black uppercase text-slate-700 mb-1">
                  Nama / Judul Kegiatan <span className="text-red-600">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={namaGiat}
                  onChange={(e) => setNamaGiat(e.target.value)}
                  placeholder="Contoh: Sosialisasi 4 Pilar MPR RI Bagi Pemuda BEM UI"
                  className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm focus:outline-none focus:bg-yellow-50"
                />
              </div>

              {/* Grid 2: Jenis & Tema */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-slate-700 mb-1">
                    Jenis Kegiatan:
                  </label>
                  <select
                    value={jenisGiat}
                    onChange={(e) => setJenisGiat(e.target.value)}
                    className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
                  >
                    <option value="Sosialisasi 4 Pilar">Sosialisasi 4 Pilar</option>
                    <option value="Serapan Aspirasi">Serapan Aspirasi</option>
                    <option value="Temu Tokoh Kebangsaan">Temu Tokoh Kebangsaan</option>
                    <option value="Kunjungan Kerja">Kunjungan Kerja</option>
                    <option value="Seminar Kebangsaan">Seminar Kebangsaan</option>
                    <option value="RDP">RDP / RDPU</option>
                    <option value="Workshop">Workshop & Bimtek</option>
                    <option value="Program EBY">Program EBY Connect</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black uppercase text-slate-700 mb-1">
                    Tema Utama:
                  </label>
                  <select
                    value={temaGiat}
                    onChange={(e) => setTemaGiat(e.target.value)}
                    className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
                  >
                    <option value="Kebangsaan & Pancasila">Kebangsaan & Pancasila</option>
                    <option value="Ekonomi & UMKM">Ekonomi & UMKM</option>
                    <option value="Pendidikan & Beasiswa">Pendidikan & Beasiswa</option>
                    <option value="Infrastruktur">Infrastruktur</option>
                    <option value="Hukum & HAM">Hukum & HAM</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                </div>
              </div>

              {/* Grid 3: Instansi & Segmentasi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-slate-700 mb-1">
                    Asal Instansi / Ormas <span className="text-red-600">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={asalInstansi}
                    onChange={(e) => setAsalInstansi(e.target.value)}
                    placeholder="Contoh: BEM Universitas Indonesia"
                    className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-slate-700 mb-1">
                    Segmentasi Peserta:
                  </label>
                  <select
                    value={segmentasiPeserta}
                    onChange={(e) => setSegmentasiPeserta(e.target.value)}
                    className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
                  >
                    <option value="Mahasiswa & Pelajar">Mahasiswa & Pelajar</option>
                    <option value="Tokoh Masyarakat & Agama">Tokoh Masyarakat & Agama</option>
                    <option value="Pelaku UMKM">Pelaku UMKM</option>
                    <option value="Pendidik & Guru">Pendidik & Guru</option>
                    <option value="Petani & Nelayan">Petani & Nelayan</option>
                    <option value="Pemuda & Komunitas">Pemuda & Komunitas</option>
                  </select>
                </div>
              </div>

              {/* Grid 4: Jumlah Peserta & Penanggung Jawab */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-slate-700 mb-1">
                    Jumlah Peserta (Orang):
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={jumlahPeserta}
                    onChange={(e) => setJumlahPeserta(Number(e.target.value))}
                    className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase text-slate-700 mb-1">
                    Penanggung Jawab / Kontak:
                  </label>
                  <input
                    type="text"
                    value={namaPeserta}
                    onChange={(e) => setNamaPeserta(e.target.value)}
                    placeholder="Nama Koordinator"
                    className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <label className="block font-black uppercase text-slate-700 mb-1">
                  Lokasi Pelaksanaan:
                </label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Gedung Nusantara Senayan"
                  className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="block font-black uppercase text-slate-700 mb-1">
                  Catatan Evaluasi Tambahan:
                </label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Harapan / rekomendasi tindak lanjut..."
                  className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm text-xs"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t-2 border-black flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-200 text-black px-4 py-2 font-bold text-xs border-2 border-black neo-shadow cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#673AB7] text-white px-5 py-2 font-black text-xs border-2 border-black neo-shadow hover:bg-purple-800 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Ke Google Sheet</span>
                </button>
              </div>

            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
