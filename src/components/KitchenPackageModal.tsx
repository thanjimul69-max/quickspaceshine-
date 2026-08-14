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
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-x-hidden">
          {/* Dark Backdrop */}
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
            className="relative w-full sm:w-[94vw] max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col z-10 mx-auto"
          >
            {/* Handle Drag Bar (Urban Company Mobile style) */}
            <div className="pt-3 pb-1 flex justify-center sm:hidden">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0 gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="p-2 sm:p-2.5 rounded-2xl bg-pink-100 text-pink-600 shrink-0">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 truncate">
                    Select Kitchen Package
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                    Choose standard exterior or complete deep cleaning
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

            {/* Modal Content - Two Package Options (Horizontally Scrollable Side-by-Side Cards) */}
            <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
              
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span className="font-semibold text-slate-700">Compare packages:</span>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-pink-600 bg-pink-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-pink-200">
                  Swipe horizontally &rarr;
                </span>
              </div>

              {/* Side-by-Side Horizontal Scroll Container */}
              <div
                className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory py-2 px-1 no-scrollbar scroll-smooth w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {KITCHEN_PACKAGES.map((pkg: KitchenPackageOption) => {
                  const isSelected = selectedPackageId === pkg.id;
                  const isComplete = pkg.id === 'complete';

                  return (
                    <div
                      key={pkg.id}
                      className={`min-w-[80vw] sm:min-w-[300px] md:min-w-[320px] max-w-[340px] flex-1 flex-shrink-0 snap-center sm:snap-start relative rounded-2xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between gap-4 sm:gap-5 ${
                        isSelected
                          ? 'bg-pink-50/40 border-pink-500 shadow-xl shadow-pink-500/10 ring-2 ring-pink-500/20'
                          : isComplete
                          ? 'bg-white border-rose-200 hover:border-pink-400 shadow-md'
                          : 'bg-white border-slate-200 hover:border-pink-300 shadow-sm'
                      }`}
                    >
                      {/* Top Header & Badge */}
                      <div className="space-y-2.5 sm:space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                              isComplete
                                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {pkg.badge}
                          </span>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" /> Active
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                            {pkg.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                            {pkg.subtitle}
                          </p>
                        </div>

                        <div className="pt-1 flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-black text-pink-600">
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] sm:text-xs text-slate-400 font-medium">inclusive of taxes</span>
                        </div>
                      </div>

                      {/* Inclusions List */}
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Package Includes:
                        </span>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {pkg.inclusions.map((inclusion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[11px] sm:text-xs font-semibold text-slate-700">
                              <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                              </div>
                              <span className="leading-snug">{inclusion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          onSelectPackage(pkg.id);
                          onClose();
                        }}
                        className={`w-full py-3 sm:py-3.5 px-6 rounded-[8px] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/30'
                            : 'bg-[#5337E1] hover:bg-[#462ec4] text-white shadow-[#5337E1]/25 hover:scale-[1.02]'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>
                          {isSelected
                            ? 'Selected Package'
                            : `Select Package (₹${pkg.price.toLocaleString('en-IN')})`}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Security & Guarantee Note */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-slate-600 text-[11px] sm:text-xs font-medium">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                <span>
                  Both packages include 100°C steam tech, eco-friendly chemicals, and a 100% satisfaction guarantee.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
