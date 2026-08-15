import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, ShieldCheck, Plus, Minus, ArrowRight } from 'lucide-react';
import { BATHROOM_PACKAGE, getBathroomUnitPrice, calculateBathroomTotal } from '../data/services';

interface BathroomPackageModalProps {
  isOpen: boolean;
  bathroomCount: number;
  onClose: () => void;
  onChangeBathroomCount: (count: number) => void;
  onProceedToBooking: () => void;
  onShowToast: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;
}

export const BathroomPackageModal: React.FC<BathroomPackageModalProps> = ({
  isOpen,
  bathroomCount,
  onClose,
  onChangeBathroomCount,
  onProceedToBooking,
  onShowToast,
}) => {
  const effectiveCount = bathroomCount > 0 ? bathroomCount : 1;
  const currentTotal = calculateBathroomTotal(effectiveCount);
  const unitPrice = getBathroomUnitPrice(effectiveCount);

  const handleIncrement = () => {
    const next = bathroomCount === 0 ? 1 : bathroomCount + 1;
    onChangeBathroomCount(next);
    onShowToast(`Bathroom count updated to ${next} unit(s).`, 'success');
  };

  const handleDecrement = () => {
    if (bathroomCount > 0) {
      const next = bathroomCount - 1;
      onChangeBathroomCount(next);
      if (next === 0) {
        onShowToast('Bathroom cleaning removed from cart.', 'info');
      }
    }
  };

  const handleAddOrProceed = () => {
    if (bathroomCount === 0) {
      onChangeBathroomCount(1);
      onShowToast('Bathroom Deep Cleaning (1 Unit - ₹799) added to cart!', 'success');
    }
    onClose();
    onProceedToBooking();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-x-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Slide-Up Bottom Sheet / Modal Panel */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full sm:w-[94vw] max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col z-10 mx-auto"
          >
            {/* Mobile Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center sm:hidden">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0 gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="p-2 sm:p-2.5 rounded-2xl bg-black text-white shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 truncate">
                    Premium Deep Bathroom Cleaning
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                    Tile descaling, toilet sanitization & hard water stain removal
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {/* Main Service Card */}
              <div className="rounded-2xl border-2 border-slate-300 bg-slate-50/50 p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-black text-white border border-black text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider">
                        {BATHROOM_PACKAGE.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        ⏱️ 1.5 - 2 Hours / Unit
                      </span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                      {BATHROOM_PACKAGE.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                      {BATHROOM_PACKAGE.subtitle}
                    </p>
                  </div>

                  {/* Quantity Stepper Control */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-black text-black">
                        ₹{bathroomCount > 0 ? currentTotal.toLocaleString('en-IN') : '799'}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {bathroomCount >= 2 ? `₹${unitPrice}/unit discount` : '₹799 per bathroom'}
                      </span>
                    </div>

                    <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                      <button
                        onClick={handleDecrement}
                        className="w-9 h-9 flex items-center justify-center font-black text-slate-700 hover:bg-slate-200 hover:text-black transition-colors text-base cursor-pointer disabled:opacity-40"
                        disabled={bathroomCount === 0}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-9 text-center font-black text-slate-900 text-sm">
                        {bathroomCount}
                      </span>
                      <button
                        onClick={handleIncrement}
                        className="w-9 h-9 flex items-center justify-center font-black text-slate-700 hover:bg-slate-200 hover:text-black transition-colors text-base cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inclusions Checklist */}
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
                    What&apos;s Included In This Package:
                  </h5>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {BATHROOM_PACKAGE.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steam & Chemical Safety Banner */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3 text-xs font-bold text-slate-700">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Includes 100°C Thermal Steam sanitization of toilet bowl & hard-water descaling.</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer Action */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Amount
                </span>
                <div className="text-xl font-black text-slate-900">
                  ₹{(bathroomCount > 0 ? currentTotal : 799).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleAddOrProceed}
                  className="px-6 py-2.5 rounded-xl bg-black hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-black/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{bathroomCount > 0 ? 'Proceed to Booking' : 'Add to Cart & Proceed'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
