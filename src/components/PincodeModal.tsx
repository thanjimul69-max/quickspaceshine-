import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PincodeModalProps {
  isOpen: boolean;
  pincode: string;
  onClose: () => void;
  onShowToast: (message: string, type?: 'warning' | 'info' | 'error' | 'success') => void;
}

export const PincodeModal: React.FC<PincodeModalProps> = ({
  isOpen,
  pincode,
  onClose,
  onShowToast,
}) => {
  const [notifyPhone, setNotifyPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyPhone || notifyPhone.length !== 10) {
      onShowToast('Please enter a valid 10-digit mobile number', 'warning');
      return;
    }
    setSubmitted(true);
    onShowToast(`Thank you! We will notify +91 ${notifyPhone} when QSS launches in pincode ${pincode}.`, 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Icon */}
          <div className="w-14 h-14 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold font-mono">
              <MapPin className="w-3.5 h-3.5 text-pink-600" />
              <span>PINCODE: {pincode}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Service Unavailable in Your Area
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed pt-1 font-medium">
              Sorry, we currently do not serve in this area. We are expanding soon!
            </p>
          </div>

          {/* Notification signup form */}
          {!submitted ? (
            <form onSubmit={handleNotifySubmit} className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 text-left">
                Get Notified When We Launch In Pincode {pincode}:
              </label>

              <div className="flex gap-2">
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit Mobile Number"
                  value={notifyPhone}
                  onChange={(e) => setNotifyPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-4 py-2.5 rounded-[8px] bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono placeholder-slate-400 focus:outline-none focus:border-[#5337E1] focus:ring-1 focus:ring-[#5337E1]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md shadow-[#5337E1]/20 cursor-pointer"
                >
                  Notify Me
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-pink-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Request Received!</h4>
              <p className="text-xs text-slate-600 font-medium">
                We will send an SMS alert to +91 {notifyPhone} as soon as QSS dispatch arrives in pincode {pincode}.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
