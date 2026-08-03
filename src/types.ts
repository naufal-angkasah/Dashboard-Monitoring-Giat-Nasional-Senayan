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
  kabupaten?: string;
  kecamatan?: string;
  desa?: string;
  tanggal: string;
  status: 'Terlaksana' | 'Sedang Berjalan' | 'Terjadwal';
  source: 'Google Form' | 'Excel Upload' | 'Manual' | 'Google Sheet Auto-Sync';
  catatan?: string;
  fotoDokumentasi?: string[];
  notulensi?: string;
  notulensiFile?: { name: string; url: string; size?: string };
}

export interface EbyConnectProgram {
  id: string;
  tahun: string;
  jenisProgram: string;
  namaProgram: string;
  penerima: string;
  jumlahPenerima: number;
  wilayah: string;
  kabupaten?: string;
  kecamatan?: string;
  status: 'Penyaluran Selesai' | 'Proses Penyaluran' | 'Verifikasi Data';
  instansiMitra: string;
  tanggal: string;
  kontak: string;
}

export interface AttendanceRecord {
  id: string;
  activityId: string;
  namaPeserta: string;
  nik?: string;
  kontak?: string;
  instansi: string;
  jabatan?: string;
  waktuHadir: string;
  fotoSelfie?: string;
  statusKehadiran?: 'Hadir' | 'Izin' | 'Sakit';
  catatan?: string;
  tahun?: string;
  kategoriGiat?: KategoriGiat;
  jenisGiat?: string;
  temaGiat?: string;
  namaGiat?: string;
  segmentasiPeserta?: string;
}

export interface FilterState {
  tahun: string;
  kategoriGiat: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect';
  jenisGiat: string;
  temaGiat: string;
  segmentasiPeserta: string;
  instansi: string;
  searchQuery: string;
  kabupaten?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  source: 'Google Form' | 'Excel Upload' | 'Google Sheet Auto-Sync' | 'Manual Add';
  status: 'Success' | 'Syncing' | 'Failed';
  recordsCount: number;
  description: string;
}

export type UserRole = 'public' | 'pimpinan' | 'admin';

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

export interface GoogleSheetConfig {
  senayanSheetUrl: string;
  ebySheetUrl: string;
  lastSyncedAt?: string;
}
