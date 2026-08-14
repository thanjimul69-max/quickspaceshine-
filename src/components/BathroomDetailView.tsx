import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Info,
  Plus,
} from 'lucide-react';
import { BATHROOM_PACKAGE, getBathroomUnitPrice, calculateBathroomTotal } from '../data/services';

interface BathroomDetailViewProps {
  bathroomCount: number;
  onChangeBathroomCount: (count: number) => void;
  onNavigate: (view: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking') => void;
  onShowToast: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;
}

export const BathroomDetailView: React.FC<BathroomDetailViewProps> = ({
  bathroomCount,
  onChangeBathroomCount,
  onNavigate,
  onShowToast,
}) => {
  const currentTotal = calculateBathroomTotal(bathroomCount);
  const unitPrice = getBathroomUnitPrice(bathroomCount);

  const handleIncrement = () => {
    const next = bathroomCount === 0 ? 1 : bathroomCount + 1;
    onChangeBathroomCount(next);
    onShowToast(`Bathroom count updated to ${next} unit(s).`, 'success');
  };

  const handleDecrement = () => {
    if (bathroomCount > 0) {
      onChangeBathroomCount(bathroomCount - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="min-h-screen bg-slate-50/50 pb-28 pt-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8"
    >
      {/* 1. Top "Back to Home" Navigation Button */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-pink-300 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600 stroke-[2.5]" />
          <span>Back to Home</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-extrabold uppercase tracking-wider">
          Bathroom Service
        </span>
      </div>

      {/* 2. Header: Title & Pricing Card */}
      <div className="rounded-3xl p-1 bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50 shadow-xl">
        <div className="rounded-[22px] bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span>Deep Scaled Stain Removal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Bathroom Cleaning
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                {BATHROOM_PACKAGE.subtitle}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3">
              <div className="text-left sm:text-right">
                <div className="text-3xl sm:text-4xl font-black text-pink-600">
                  ₹{bathroomCount > 0 ? currentTotal.toLocaleString('en-IN') : '799'}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {bathroomCount >= 2
                    ? `₹${unitPrice}/unit (Multi-bathroom discount applied!)`
                    : '₹799 per single bathroom unit'}
                </span>
              </div>

              {/* Stepper Control */}
              {bathroomCount === 0 ? (
                <button
                  onClick={handleIncrement}
                  className="px-5 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-pink-500/25 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Bathroom (₹799)</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-pink-50 p-2.5 rounded-2xl border border-pink-200 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-xs font-extrabold text-pink-900 uppercase tracking-wider pl-1">
                    Units:
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDecrement}
                      className="w-9 h-9 rounded-xl bg-white border border-pink-200 hover:bg-pink-100 text-pink-700 font-black flex items-center justify-center transition-colors text-lg shadow-sm cursor-pointer"
                    >
                      -
                    </button>

                    <span className="w-8 text-center text-xl font-black text-pink-600">
                      {bathroomCount}
                    </span>

                    <button
                      onClick={handleIncrement}
                      className="w-9 h-9 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-black flex items-center justify-center transition-colors text-lg shadow-md shadow-pink-500/20 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service Process Explanation */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-pink-600" />
              <span>How Our Deep Bathroom Cleaning Works</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              We don&apos;t just wipe surfaces. We apply specialized acidic descaling chemicals to strip stubborn hard water salt deposits, soap scum, and yellow mineral stains from tile walls and floors. All chrome taps, showers, and steel fittings are hand-polished with <strong>AZI Steel Shiner</strong> for a high-gloss mirror shine.
            </p>
          </div>

          {/* Inclusions List */}
          <div className="pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">
              What Is Included in this Package:
            </h3>

            <ul className="grid sm:grid-cols-2 gap-3">
              {BATHROOM_PACKAGE.inclusions.map((item, idx) => (
                <li
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                >
                  <div className="p-1 rounded bg-pink-100 text-pink-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Discount Banner */}
          <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-pink-600 shrink-0" />
            <p className="text-xs text-pink-900 font-bold">
              Multi-Bathroom Savings: Book 2 or more bathrooms and enjoy automatic discounted pricing at ₹699 per bathroom (save ₹100/unit!).
            </p>
          </div>
        </div>
      </div>

      {/* 3. Cross-sell Footer */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-xl shadow-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-widest text-pink-100">
            Complete Your Home Care
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Need Kitchen Cleaning too?
          </h3>
          <p className="text-xs text-pink-100 font-medium">
            Get 100°C thermal steam degreasing & heavy oil removal for your kitchen.
          </p>
        </div>

        <button
          onClick={() => onNavigate('kitchenDetail')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-pink-600 font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>View Kitchen Service</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
