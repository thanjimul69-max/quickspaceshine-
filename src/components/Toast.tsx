import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-[70] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${
              toast.type === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : toast.type === 'error'
                ? 'bg-red-50 border-red-300 text-red-900'
                : toast.type === 'success'
                ? 'bg-pink-50 border-pink-300 text-pink-950'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-pink-600" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-pink-600" />}
            </div>
            <div className="flex-1 text-sm font-semibold leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
