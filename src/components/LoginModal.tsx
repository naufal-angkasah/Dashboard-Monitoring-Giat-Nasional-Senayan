import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Lock, User, KeyRound, Sparkles, LogIn, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onLoginSuccess: (role: UserRole, username: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onLoginSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'pimpinan'>(
    currentRole === 'admin' ? 'admin' : 'pimpinan'
  );
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'admin') {
      if (password && password !== 'admin123' && password !== 'admin') {
        setErrorMsg('PIN Admin salah! Gunakan: admin123');
        return;
      }
    }

    const finalUsername = username.trim() || (selectedRole === 'admin' ? 'Operator Tim Teknis' : 'Dr. H. Anggota DPR');
    onLoginSuccess(selectedRole, finalUsername);
    onClose();
  };

  const handleInstantLogin = (role: 'admin' | 'pimpinan') => {
    const defaultName = role === 'admin' ? 'Operator Tim Teknis' : 'Dr. H. Anggota DPR';
    onLoginSuccess(role, defaultName);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight leading-snug">
                  AUTENTIKASI & KELOLA AKUN
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Sistem Autentikasi Giat Senayan & EBY Connect
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4 text-xs">
            {/* Role Switcher Tabs */}
            <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-2 gap-1 font-semibold">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin / Operator</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('pimpinan');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'pimpinan'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Pimpinan / User</span>
              </button>
            </div>

            {/* Info Box Card */}
            <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3.5 text-sky-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-slate-900">
                  {selectedRole === 'pimpinan' ? 'Hak Akses Pimpinan / Executive:' : 'Hak Akses Admin Operator:'}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedRole === 'pimpinan'
                    ? 'Tampilan khusus Pimpinan: Fokus pada program Terealisasi (Selesai 100%), Ringkasan KPI Eksekutif, Peta Persebaran & Laporan Realisasi.'
                    : 'Kelola Master Data (Tambah, Edit, Hapus), Upload Excel, Atur Status Program (Perencanaan/Berjalan/Selesai), & Sync Spreadsheets.'}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Username Input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Pengguna / Identitas
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={selectedRole === 'pimpinan' ? 'Contoh: Dr. H. Anggota DPR' : 'Contoh: Operator Tim Teknis'}
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                  />
                </div>
              </div>

              {/* Password Input (Admin Only) */}
              {selectedRole === 'admin' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 block">
                      Kata Sandi Admin
                    </label>
                    <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      PIN: admin123
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan PIN Admin (admin123)..."
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all text-xs mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk sebagai {selectedRole === 'pimpinan' ? 'Pimpinan' : 'Admin'}</span>
              </button>
            </form>

            {/* Instant Login Section */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  MASUK INSTAN (TANPA KETIK)
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => handleInstantLogin('admin')}
                  className="bg-slate-50 hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 py-2.5 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Login Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInstantLogin('pimpinan')}
                  className="bg-slate-50 hover:bg-sky-50 text-sky-700 border border-slate-200 hover:border-sky-300 py-2.5 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Login Pimpinan</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

