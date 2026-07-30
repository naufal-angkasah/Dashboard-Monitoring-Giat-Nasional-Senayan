import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, CheckCircle2, Clock, Sparkles, FileSpreadsheet } from 'lucide-react';
import { SyncLog } from '../types';

interface SyncLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncLogs: SyncLog[];
}

export const SyncLogModal: React.FC<SyncLogModalProps> = ({ isOpen, onClose, syncLogs }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#FFFDF9] border-4 border-black neo-shadow-xl max-w-xl w-full max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-[#18181B] text-white p-4 border-b-4 border-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-yellow-300" />
              <h3 className="font-black text-sm uppercase font-mono text-white">
                Log Sinkronisasi Database Google Sheet
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-white text-black hover:bg-yellow-300 border border-black cursor-pointer neo-shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="bg-yellow-100 p-3 border-2 border-black text-xs font-mono font-bold flex items-center justify-between">
              <span>Status Auto-Sync: ACTIVE (Real-time)</span>
              <span className="bg-emerald-400 text-black px-2 py-0.5 border border-black text-[10px]">
                CLOUD ONLINE
              </span>
            </div>

            <div className="space-y-3">
              {syncLogs.map((log) => (
                <div 
                  key={log.id}
                  className="bg-white p-3.5 border-2 border-black neo-shadow-sm font-mono text-xs flex items-start gap-3"
                >
                  <div className="p-2 bg-emerald-100 text-emerald-900 border border-black shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-slate-900">{log.description}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 border border-slate-300">
                        {log.timestamp}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-600">
                      <span>Sumber: <strong className="text-black">{log.source}</strong></span>
                      <span>Jumlah: <strong className="text-blue-700">+{log.recordsCount} Record</strong></span>
                      <span className="text-emerald-700 font-bold">● {log.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={onClose}
                className="bg-black text-white px-4 py-2 font-bold text-xs border-2 border-black neo-shadow cursor-pointer"
              >
                Tutup Log
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
