import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <aside
      aria-live="polite"
      aria-label="Notification messages"
      style={{ zIndex: 9999 }}
      className="fixed top-5 sm:top-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2.5 max-w-lg w-[calc(100%-2rem)] sm:w-auto pointer-events-none select-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.92, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full shadow-[0_16px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl border transition-all ${
              toast.type === 'warning'
                ? 'bg-slate-950/95 border-amber-500/50 text-white ring-1 ring-amber-500/20'
                : toast.type === 'error'
                ? 'bg-slate-950/95 border-rose-500/50 text-white ring-1 ring-rose-500/20'
                : toast.type === 'success'
                ? 'bg-slate-950/95 border-emerald-500/50 text-white ring-1 ring-emerald-500/20'
                : 'bg-slate-950/95 border-slate-700 text-white ring-1 ring-white/10'
            }`}
          >
            {/* Icon Pill Badge */}
            <div className="shrink-0">
              {toast.type === 'warning' && (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
              )}
              {toast.type === 'success' && (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white">
                  <Info className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Message Text */}
            <div className="text-xs sm:text-sm font-bold tracking-tight text-slate-100 text-left leading-snug max-w-sm sm:max-w-md">
              {toast.message}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-colors shrink-0 cursor-pointer ml-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
};
