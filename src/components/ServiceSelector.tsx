import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Flame, Sparkles, Plus, Refrigerator, Wind, Microwave, ShieldCheck } from 'lucide-react';
import { APPLIANCE_OPTIONS, BATHROOM_PACKAGE, getKitchenPackage } from '../data/services';
import { ApplianceSelection } from './ApplianceSelection';

interface ServiceSelectorProps {
  kitchenPackageId: 'classic' | 'complete' | null;
  selectedAppliances: string[];
  bathroomCount: number;
  onSelectKitchenPackage: (packageId: 'classic' | 'complete' | null) => void;
  onOpenKitchenModal: () => void;
  onToggleAppliance: (id: string) => void;
  onChangeBathroomCount: (count: number) => void;
  onShowToast: (message: string, type?: 'warning' | 'info' | 'error' | 'success') => void;
  onScrollToBooking: () => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  kitchenPackageId,
  selectedAppliances,
  bathroomCount,
  onSelectKitchenPackage,
  onOpenKitchenModal,
  onToggleAppliance,
  onChangeBathroomCount,
  onShowToast,
  onScrollToBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'kitchen' | 'bathroom'>('kitchen');

  const activeKitchenPkg = getKitchenPackage(kitchenPackageId);

  const handleApplianceClick = (applianceId: string) => {
    if (!kitchenPackageId) {
      onOpenKitchenModal();
      onShowToast('Please select a Kitchen Package first before adding extra appliance care.', 'info');
      return;
    }
    onToggleAppliance(applianceId);
  };

  const getApplianceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Refrigerator':
        return <Refrigerator className="w-5 h-5 text-pink-600" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-pink-600" />;
      case 'Microwave':
        return <Microwave className="w-5 h-5 text-pink-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-pink-600" />;
    }
  };

  return (
    <section id="services" className="py-16 lg:py-24 bg-white relative overflow-hidden border-t border-slate-200">
      {/* Background radial pink gradient */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-100/50 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-700 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Select Your Cleaning Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Transparent Pricing.{' '}
            <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              No Hidden Charges.
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Choose your base deep cleaning package and add extra appliance care as required.
          </p>
        </div>

        {/* Primary Tabs Toggle */}
        <div className="flex justify-center">
          <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-2 max-w-md w-full shadow-inner">
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'kitchen'
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Flame className="w-4 h-4 shrink-0" />
              <span>Kitchen Cleaning</span>
              {kitchenPackageId && (
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('bathroom')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'bathroom'
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Bathroom Cleaning</span>
              {bathroomCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === 'kitchen' ? (
            <motion.div
              key="kitchen-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Base Kitchen Package Card */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50 shadow-xl">
                <div className="rounded-[22px] bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
                  
                  {activeKitchenPkg ? (
                    /* Active Package Selected State */
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200 text-[11px] font-extrabold uppercase tracking-wider">
                              Active: {activeKitchenPkg.badge}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">100°C Steam Powered</span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                            {activeKitchenPkg.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1 font-medium">
                            {activeKitchenPkg.subtitle}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl sm:text-3xl font-black text-pink-600">
                              ₹{activeKitchenPkg.price.toLocaleString('en-IN')}
                            </div>
                            <span className="text-xs text-slate-500 font-medium">Inclusive of all taxes</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={onOpenKitchenModal}
                              className="px-4 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-slate-900 hover:bg-pink-600 text-white transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                            >
                              <span>Change Package</span>
                            </button>

                            <button
                              onClick={() => onSelectKitchenPackage(null)}
                              className="px-3 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-all cursor-pointer"
                              title="Remove Kitchen Package"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Included Items Checklist for Active Package */}
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">
                          Package Inclusions (What We Clean):
                        </h4>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {activeKitchenPkg.inclusions.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                            >
                              <div className="p-1 rounded bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                              <span className="text-xs text-slate-700 font-semibold leading-relaxed">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* No Package Selected Initial State */
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-extrabold uppercase tracking-wider">
                              2 Options Available
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Classic (₹1,499) & Complete (₹1,999)</span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                            Deep Kitchen Cleaning
                          </h3>
                          <p className="text-sm text-slate-600 mt-1 font-medium">
                            Choose Standard Exterior cleaning or Complete Interior + Exterior deep cleaning.
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xl sm:text-2xl font-black text-pink-600">
                              From ₹1,499
                            </div>
                            <span className="text-xs text-slate-500 font-medium">Inclusive of all taxes</span>
                          </div>

                          <button
                            onClick={onOpenKitchenModal}
                            className="px-6 py-3.5 rounded-[8px] font-extrabold text-xs sm:text-sm uppercase tracking-wider bg-[#5337E1] hover:bg-[#462ec4] text-white shadow-lg shadow-[#5337E1]/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                            <span>Select Kitchen Package</span>
                          </button>
                        </div>
                      </div>

                      {/* Package Option Previews */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div
                          onClick={onOpenKitchenModal}
                          className="p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-200 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Option A</span>
                            <h4 className="text-sm font-extrabold text-slate-900">Classic / Standard Kitchen Cleaning</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Cabinet Exterior Only, Tiles, Slab, Sink & Floor</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-pink-600">₹1,499</span>
                            <div className="text-[11px] font-extrabold text-pink-600 group-hover:underline">Select &rarr;</div>
                          </div>
                        </div>

                        <div
                          onClick={onOpenKitchenModal}
                          className="p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-200 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Option B (Popular)</span>
                            <h4 className="text-sm font-extrabold text-slate-900">Complete Deep Kitchen Cleaning</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Cabinet Exterior + Full Interior (Inside & Outside)</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-pink-600">₹1,999</span>
                            <div className="text-[11px] font-extrabold text-pink-600 group-hover:underline">Select &rarr;</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>

            </motion.div>
          ) : (
            /* Premium Deep Bathroom Cleaning Tab */
            <motion.div
              key="bathroom-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50 shadow-xl">
                <div className="rounded-[22px] bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
                  
                  {/* Top Notice Banner */}
                  <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-pink-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-extrabold text-pink-800 uppercase tracking-wide">
                        {BATHROOM_PACKAGE.subtitle}
                      </h4>
                      <p className="text-xs text-slate-700 mt-0.5 font-medium">
                        We don&apos;t just wipe tiles. We apply acidic scale-dissolvers to strip stubborn hard-water stains and polish chrome fixtures with AZI Steel Shiner.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-[11px] font-extrabold uppercase tracking-wider">
                          {BATHROOM_PACKAGE.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                        {BATHROOM_PACKAGE.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        ₹799 per single bathroom unit (Discounted to ₹699/ea for 2+ bathrooms)
                      </p>
                    </div>

                    {/* Stepper Control for Bathroom Count */}
                    <div>
                      {bathroomCount === 0 ? (
                        <button
                          onClick={() => onChangeBathroomCount(1)}
                          className="px-6 py-3.5 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-[#5337E1]/25 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Bathroom (₹799)</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-pink-50 p-2.5 rounded-2xl border border-pink-200 shadow-sm">
                          <div className="text-xs font-extrabold text-pink-900 uppercase tracking-wider">
                            Units:
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onChangeBathroomCount(Math.max(0, bathroomCount - 1))}
                              className="w-8 h-8 rounded-[8px] bg-white border border-pink-200 hover:bg-pink-100 text-pink-700 font-black flex items-center justify-center transition-colors text-base shadow-sm cursor-pointer"
                            >
                              -
                            </button>

                            <span className="w-8 text-center text-lg font-black text-pink-600">
                              {bathroomCount}
                            </span>

                            <button
                              onClick={() => onChangeBathroomCount(bathroomCount + 1)}
                              className="w-8 h-8 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-black flex items-center justify-center transition-colors text-base shadow-md shadow-[#5337E1]/20 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bathroom Inclusions */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">
                      Deep Bathroom Cleaning Protocol:
                    </h4>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {BATHROOM_PACKAGE.inclusions.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                        >
                          <div className="p-1 rounded bg-pink-100 text-pink-600 shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="text-xs text-slate-700 font-semibold leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Services Quick Total Summary Bar */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-xl shadow-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-xs font-black uppercase tracking-widest text-pink-100 flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Selected Services Total:</span>
            </h4>
            <div className="text-sm font-bold flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {activeKitchenPkg && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs backdrop-blur-sm">
                  {activeKitchenPkg.title} (₹{activeKitchenPkg.price.toLocaleString('en-IN')})
                </span>
              )}
              {selectedAppliances.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs backdrop-blur-sm">
                  {selectedAppliances.length} Appliance Add-on(s)
                </span>
              )}
              {bathroomCount > 0 && (
                <span className="px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-xs backdrop-blur-sm">
                  {bathroomCount} Bathroom(s)
                </span>
              )}
              {!activeKitchenPkg && selectedAppliances.length === 0 && bathroomCount === 0 && (
                <span className="text-pink-100 italic text-xs">No services selected yet</span>
              )}
            </div>
          </div>

          <button
            onClick={onScrollToBooking}
            className="w-full sm:w-auto px-7 py-3.5 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0 cursor-pointer border border-white/20"
          >
            Proceed to Booking Details
          </button>
        </div>

      </div>
    </section>
  );
};
