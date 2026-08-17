import React from 'react';
import { LocateFixed, AlertTriangle, X, ShieldAlert, ArrowRight } from 'lucide-react';

interface GpsRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetectGps: () => void;
  isDetecting: boolean;
}

export const GpsRequiredModal: React.FC<GpsRequiredModalProps> = ({
  isOpen,
  onClose,
  onDetectGps,
  isDetecting,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gps-modal-title"
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200 relative">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shadow-xs">
          <LocateFixed className="w-7 h-7 stroke-[2.2]" />
        </div>

        {/* Modal Copy */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/70 border border-amber-300 text-amber-900 text-[11px] font-black uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>GPS Location Required</span>
          </div>

          <h3 id="gps-modal-title" className="text-xl font-black text-slate-950 tracking-tight leading-snug">
            Live GPS Location Access Needed
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Please click <strong className="text-slate-900">&quot;Detect Live GPS Location&quot;</strong> and allow browser location access to proceed with your booking.
          </p>
        </div>

        {/* Reason Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
            <span>Why is live GPS required?</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Quick Space Shine dispatch vans carry heavy 140°C steam machinery from our Guindy HQ. Verified GPS navigation coordinates ensure direct, on-time technician arrival without phone navigation confusion.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onDetectGps();
            }}
            disabled={isDetecting}
            className="px-5 py-3 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDetecting ? (
              <span>Fetching GPS...</span>
            ) : (
              <>
                <LocateFixed className="w-4 h-4" />
                <span>Detect GPS Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
