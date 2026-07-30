export type KategoriGiat = 'MPR' | 'DPR' | 'EBY Connect';

export interface ActivityItem {
  id: string;
  tahun: string;
  kategoriGiat: KategoriGiat;
  jenisGiat: string;
  temaGiat: string;
  namaGiat: string;
  namaPeserta: string;
  asalInstansi: string;
  segmentasiPeserta: string;
  kontak: string;
  jumlahPeserta: number;
  lokasi: string;
  tanggal: string;
  status: 'Terlaksana' | 'Sedang Berjalan' | 'Terjadwal';
  source: 'Google Form' | 'Excel Upload' | 'Manual';
  catatan?: string;
}

export interface EbyConnectProgram {
  id: string;
  tahun: string;
  jenisProgram: string;
  namaProgram: string;
  penerima: string;
  jumlahPenerima: number;
  wilayah: string;
  status: 'Penyaluran Selesai' | 'Proses Penyaluran' | 'Verifikasi Data';
  instansiMitra: string;
  tanggal: string;
  kontak: string;
}

export interface FilterState {
  tahun: string;
  kategoriGiat: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect';
  jenisGiat: string;
  temaGiat: string;
  segmentasiPeserta: string;
  instansi: string;
  searchQuery: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  source: 'Google Form' | 'Excel Upload' | 'Google Sheet Auto-Sync' | 'Manual Add';
  status: 'Success' | 'Syncing' | 'Failed';
  recordsCount: number;
  description: string;
}

export type UserRole = 'admin' | 'pimpinan';

export interface ExecutiveSummaryStats {
  totalGiat: number;
  totalPeserta: number;
  totalInstansi: number;
  totalSegmentasi: number;
  totalTema: number;
  giatMPR: number;
  giatDPR: number;
  giatEBY: number;
  percentMPR: number;
  percentDPR: number;
}
