import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCheck, Shield, KeyRound, Lock, User } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSwitchRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Quick simulated login validation
    if (selectedRole === 'admin') {
      if (password && password !== 'admin123' && password !== 'admin') {
        setErrorMsg('Password salah! Gunakan: admin123 atau kosongkan untuk demo.');
        return;
      }
    }

    onSwitchRole(selectedRole);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#FFFDF9] border-4 border-black neo-shadow-xl max-w-md w-full"
        >
          {/* Header */}
          <div className="bg-[#18181B] text-white p-4 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-300" />
              <h3 className="font-black text-sm uppercase font-mono text-white">
                Autentikasi Pengguna & Akses Role
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-white text-black hover:bg-yellow-300 border border-black cursor-pointer neo-shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 font-sans text-xs">
            <div className="text-center pb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                Pilih Hak Akses Pengguna:
              </span>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('pimpinan')}
                  className={`p-3 font-black text-xs border-2 border-black neo-shadow-sm flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    selectedRole === 'pimpinan'
                      ? 'bg-[#FACC15] text-black -translate-y-0.5'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Pimpinan / Executive</span>
                  <span className="text-[9px] font-mono font-normal">Viewer & Export Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3 font-black text-xs border-2 border-black neo-shadow-sm flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-[#2563EB] text-white -translate-y-0.5'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Staff / Admin</span>
                  <span className="text-[9px] font-mono font-normal">Full Sync & Edit Master</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-100 border border-red-600 text-red-800 p-2 font-mono text-[11px] font-bold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block font-black uppercase text-slate-700 mb-1">
                Username / NIP / ID Pengguna:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={selectedRole === 'admin' ? 'admin_senayan' : 'pimpinan_mpr_dpr'}
                className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
              />
            </div>

            <div>
              <label className="block font-black uppercase text-slate-700 mb-1">
                Password Akses:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="🔑 Biarkan kosong atau ketik sembarang"
                className="w-full bg-white border-2 border-black p-2 font-bold neo-shadow-sm"
              />
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                *Demo Mode: Anda dapat langsung berpindah role tanpa sandi.
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-200 text-black px-4 py-2 font-bold text-xs border-2 border-black neo-shadow cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                className="bg-black text-white px-5 py-2 font-black text-xs border-2 border-black neo-shadow hover:bg-yellow-400 hover:text-black cursor-pointer"
              >
                Masuk Sebagai {selectedRole === 'admin' ? 'Admin' : 'Pimpinan'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
