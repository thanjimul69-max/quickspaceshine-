import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { KITCHEN_PACKAGES, KitchenPackageOption } from '../data/services';

interface KitchenPackageModalProps {
  isOpen: boolean;
  selectedPackageId: 'classic' | 'complete' | null;
  onClose: () => void;
  onSelectPackage: (packageId: 'classic' | 'complete') => void;
}

export const KitchenPackageModal: React.FC<KitchenPackageModalProps> = ({
  isOpen,
  selectedPackageId,
  onClose,
  onSelectPackage,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 overflow-x-hidden">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Compact Modal Panel (Centered & Sized to Fit Both Packages On-Screen) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 mx-auto"
          >
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0 gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="p-1.5 sm:p-2 rounded-xl bg-black text-white shrink-0">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                    Select Kitchen Package
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                    Choose standard exterior or complete deep cleaning
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Content - Vertically Stacked Compact Package Cards */}
            <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
              {KITCHEN_PACKAGES.map((pkg: KitchenPackageOption) => {
                const isSelected = selectedPackageId === pkg.id;
                const isComplete = pkg.id === 'complete';

                return (
                  <div
                    key={pkg.id}
                    className={`w-full rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border-2 transition-all flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-slate-50/90 border-black shadow-md ring-1 ring-black/15'
                        : isComplete
                        ? 'bg-white border-slate-300 hover:border-black shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-400 shadow-xs'
                    }`}
                  >
                    {/* Header Row: Badge, Title & Price */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                              isComplete
                                ? 'bg-black text-white'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {pkg.badge}
                          </span>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Selected
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                          {pkg.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1">
                          {pkg.subtitle}
                        </p>
                      </div>

                      {/* Price on the right */}
                      <div className="text-right shrink-0">
                        <div className="text-lg sm:text-xl font-black text-black leading-none">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block mt-0.5">
                          all inclusive
                        </span>
                      </div>
                    </div>

                    {/* Features Grid: 2-column compact checklist */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-3 gap-y-1 pt-1.5 border-t border-slate-100 text-[10px] sm:text-[11px]">
                      {pkg.inclusions.slice(0, 4).map((inclusion, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 font-semibold text-slate-700 min-w-0">
                          <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="truncate leading-tight">{inclusion}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>100°C Steam degreasing included</span>
                      </span>

                      <button
                        onClick={() => {
                          onSelectPackage(pkg.id);
                          onClose();
                        }}
                        className={`py-1.5 px-3.5 sm:px-4 rounded-lg font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs active:scale-95 ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-[#5337E1] hover:bg-[#462ec4] text-white hover:scale-[1.02]'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>
                          {isSelected
                            ? 'Active Selection'
                            : `Select Package`}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Guarantee Note */}
              <div className="py-1 px-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-1.5 text-slate-500 text-[10px] font-medium text-center">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>100% Satisfaction Guarantee • Verified Professional Technicians</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
