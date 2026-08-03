import React from 'react';

interface CustomTooltipProps {
  content: string;
  title?: string;
  badge?: string;
  category?: 'MPR' | 'DPR' | 'EBY Connect' | string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  MPR: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300',
  DPR: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/40 text-indigo-300',
  'EBY Connect': 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
};

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  content,
  title,
  badge,
  category = 'MPR',
  children,
  position = 'top',
}) => {
  const badgeClass = CATEGORY_GRADIENTS[category] || 'from-blue-500/20 to-indigo-500/10 border-blue-500/40 text-blue-300';

  const positionClasses = position === 'top'
    ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
    : 'top-full mt-2 left-1/2 -translate-x-1/2';

  const arrowClasses = position === 'top'
    ? 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent'
    : 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent';

  return (
    <div className="relative group/tooltip inline-block w-full">
      {children}

      {/* Floating Animated Tooltip Card */}
      <div 
        className={`fixed sm:absolute ${positionClasses} z-50 w-72 sm:w-80 pointer-events-none opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 ease-out`}
        style={{ filter: 'drop-shadow(0 20px 25px rgba(15, 23, 42, 0.45))' }}
      >
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3.5 text-white font-sans text-xs leading-relaxed">
          {/* Tooltip Header Badge */}
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-800">
            <span className={`bg-gradient-to-r ${badgeClass} border px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider`}>
              {category}
            </span>
            {badge && (
              <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[150px]">
                {badge}
              </span>
            )}
          </div>

          {/* Optional Title Header */}
          {title && (
            <p className="font-extrabold text-blue-300 text-xs mb-1">
              {title}
            </p>
          )}

          {/* Full Text Content */}
          <p className="font-bold text-slate-100 leading-normal text-xs break-words">
            "{content}"
          </p>

          <p className="text-[9px] text-slate-400 mt-2 italic font-mono flex items-center gap-1">
            <span>ℹ️</span> Teks lengkap Nama Kegiatan (Terverifikasi)
          </p>
        </div>

        {/* Pointer Arrow */}
        <div className={`absolute w-0 h-0 border-4 ${arrowClasses}`} />
      </div>
    </div>
  );
};
