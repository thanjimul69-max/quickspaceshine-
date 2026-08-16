import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Flame,
  MessageSquare,
  BadgePercent,
  CheckCircle2,
  CalendarCheck,
  Layers,
} from 'lucide-react';
import { APPLIANCE_OPTIONS, getKitchenPackage } from '../data/services';

interface KitchenDetailViewProps {
  kitchenSelected?: boolean;
  kitchenPackageId?: 'classic' | 'complete' | null;
  selectedAppliances: string[];
  currentStep?: 1 | 2 | 3;
  onStepChange?: (step: 1 | 2 | 3) => void;
  onToggleKitchen?: (selected: boolean) => void;
  onOpenKitchenModal?: () => void;
  onSelectKitchenPackage?: (pkgId: 'classic' | 'complete' | null) => void;
  onToggleAppliance: (id: string) => void;
  onNavigate: (view: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking') => void;
  onShowToast: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;
}

export const KitchenDetailView: React.FC<KitchenDetailViewProps> = ({
  kitchenSelected,
  kitchenPackageId = null,
  selectedAppliances,
  currentStep: externalStep,
  onStepChange: externalSetStep,
  onToggleKitchen,
  onOpenKitchenModal,
  onSelectKitchenPackage,
  onToggleAppliance,
  onNavigate,
  onShowToast,
}) => {
  // Support both internal or external step control
  const [internalStep, setInternalStep] = useState<1 | 2 | 3>(1);
  const activeStep = externalStep !== undefined ? externalStep : internalStep;

  const setStep = (step: 1 | 2 | 3) => {
    if (externalSetStep) {
      externalSetStep(step);
    } else {
      setInternalStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activePkg = getKitchenPackage(kitchenPackageId || (kitchenSelected ? 'complete' : 'complete'));

  const handleOpenModal = () => {
    if (onOpenKitchenModal) {
      onOpenKitchenModal();
    } else if (onToggleKitchen) {
      onToggleKitchen(true);
    }
  };

  const handleAddClick = (applianceId: string) => {
    onToggleAppliance(applianceId);
  };

  // Calculate pricing for summary
  const packagePrice = activePkg ? activePkg.price : 1999;
  const applianceTotal = selectedAppliances.reduce((acc, id) => {
    const item = APPLIANCE_OPTIONS.find((a) => a.id === id);
    return acc + (item ? item.price : 0);
  }, 0);
  const grandTotal = packagePrice + applianceTotal;

  // WhatsApp formatted booking message
  const generateWhatsAppMessage = () => {
    const pkgName = activePkg ? activePkg.title : 'Complete Kitchen Cleaning';
    const appList = selectedAppliances
      .map((id) => {
        const item = APPLIANCE_OPTIONS.find((a) => a.id === id);
        return item ? `• ${item.name} (₹${item.price})` : '';
      })
      .filter(Boolean)
      .join('%0A');

    let msg = `Hello QuickShine, I would like to book a Kitchen Cleaning service:%0A%0A`;
    msg += `*Selected Package:* ${encodeURIComponent(pkgName)} (₹${packagePrice.toLocaleString('en-IN')})%0A`;
    if (selectedAppliances.length > 0) {
      msg += `*Selected Add-on Appliances:*%0A${appList}%0A`;
    } else {
      msg += `*Add-ons:* None%0A`;
    }
    msg += `%0A*Estimated Total:* ₹${grandTotal.toLocaleString('en-IN')}%0A`;
    msg += `Please confirm slot availability for my address.`;
    return `https://wa.me/919854935077?text=${msg}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="min-h-screen bg-slate-50/60 pb-32 pt-20 sm:pt-24 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6"
    >
      {/* 1. Header with Dynamic Back Navigation & Stepper */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          {/* Compact Back Button */}
          {activeStep === 1 ? (
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-black hover:border-slate-300 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" />
              <span>Back to Home</span>
            </button>
          ) : activeStep === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-black hover:border-slate-300 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" />
              <span>Back to Details</span>
            </button>
          ) : (
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-black hover:border-slate-300 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" />
              <span>Back to Appliances</span>
            </button>
          )}

          {/* Right Action: Change Package */}
          <div className="flex items-center gap-2">
            {activePkg && (
              <button
                onClick={handleOpenModal}
                className="px-2.5 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider bg-white border border-slate-200 text-slate-700 hover:text-black hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
              >
                Change Package
              </button>
            )}
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-extrabold uppercase tracking-wider">
              {activePkg ? activePkg.title : 'Kitchen Service'}
            </span>
          </div>
        </div>

        {/* Minimal 3-Step Horizontal Progress Bar */}
        <div className="w-full max-w-lg mx-auto py-2 px-3 select-none">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <button
              onClick={() => setStep(1)}
              className="flex flex-col items-center text-center cursor-pointer group shrink-0 w-24 sm:w-28"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  activeStep > 1
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : activeStep === 1
                    ? 'bg-black text-white ring-4 ring-black/10'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {activeStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-1.5 font-bold transition-colors line-clamp-1 ${
                  activeStep > 1
                    ? 'text-emerald-700 font-extrabold'
                    : activeStep === 1
                    ? 'text-slate-900 font-black'
                    : 'text-slate-400'
                }`}
              >
                Job Details
              </span>
            </button>

            {/* Connecting Line 1 -> 2 */}
            <div
              className={`flex-1 h-[2px] mx-1 sm:mx-2 -mt-5 transition-colors duration-300 ${
                activeStep > 1 ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />

            {/* Step 2 */}
            <button
              onClick={() => setStep(2)}
              className="flex flex-col items-center text-center cursor-pointer group shrink-0 w-24 sm:w-28"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  activeStep > 2
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : activeStep === 2
                    ? 'bg-black text-white ring-4 ring-black/10'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {activeStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-1.5 font-bold transition-colors line-clamp-1 ${
                  activeStep > 2
                    ? 'text-emerald-700 font-extrabold'
                    : activeStep === 2
                    ? 'text-slate-900 font-black'
                    : 'text-slate-400'
                }`}
              >
                Add Appliances
              </span>
            </button>

            {/* Connecting Line 2 -> 3 */}
            <div
              className={`flex-1 h-[2px] mx-1 sm:mx-2 -mt-5 transition-colors duration-300 ${
                activeStep > 2 ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            />

            {/* Step 3 */}
            <button
              onClick={() => setStep(3)}
              className="flex flex-col items-center text-center cursor-pointer group shrink-0 w-24 sm:w-28"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  activeStep === 3
                    ? 'bg-black text-white ring-4 ring-black/10'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                3
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-1.5 font-bold transition-colors line-clamp-1 ${
                  activeStep === 3 ? 'text-slate-900 font-black' : 'text-slate-400'
                }`}
              >
                Order Summary
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* STEP 1: SERVICE DETAILS & EQUIPMENT PAGE */}
        {/* ========================================================================= */}
        {activeStep === 1 && (
          <motion.div
            key="step1-details"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Main Service Card */}
            <div className="rounded-3xl p-1 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50 shadow-xl">
              <div className="rounded-[22px] bg-white border border-slate-200 p-4 sm:p-6 space-y-6">
                
                {/* Active Package Banner Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border border-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-md">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-slate-900">
                          {activePkg ? activePkg.title : 'Complete Deep Kitchen Cleaning'}
                        </h2>
                        {activePkg?.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black text-white">
                            {activePkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {activePkg?.subtitle || '100°C Steam Powered Deep Kitchen Degreasing & Sanitization'}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                      Package Price
                    </span>
                    <span className="text-2xl font-black text-black">
                      ₹{packagePrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 1. Full-Width High-Definition Poster Image Container */}
                <div className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-950/5">
                  <img
                    src="https://i.ibb.co/rDHhQvG/file-00000000de0081f78ca3ab77d329acf2.png"
                    alt="Complete Kitchen Cleaning - Package Inclusions & Process Breakdown"
                    referrerPolicy="no-referrer"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    className="w-full h-auto rounded-2xl mx-auto block shadow-inner"
                  />
                </div>

                {/* 2. Dedicated Chemicals, Equipment & Customer Requirements Guide Poster */}
                <div className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-950/5">
                  <img
                    src="https://i.ibb.co/DPQfPSWv/file-0000000056e481faaa4502b5a818a2be.png"
                    alt="Chemicals & Professional Equipment Used - What Customer Needs to Provide"
                    referrerPolicy="no-referrer"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    className="w-full h-auto rounded-2xl mx-auto block shadow-inner"
                  />
                </div>

                {/* Primary Action Button: "View Cart" */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
                    Step 1 of 3: Next you can choose optional appliance deep cleaning add-ons.
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#5337E1] hover:bg-[#462ec4] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#5337E1]/20 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Cart</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cross-sell Bathroom banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl shadow-black/20 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Combo Cleaning Available
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Need Bathroom Deep Cleaning Too?
                </h3>
                <p className="text-xs text-slate-300">
                  Add high-pressure descaling & disinfectant polish for just ₹799 (₹699/ea for 2+).
                </p>
              </div>

              <button
                onClick={() => onNavigate('bathroomDetail')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer border border-white/20"
              >
                <span>View Bathroom Cleaning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: DEDICATED ADD APPLIANCES PAGE */}
        {/* ========================================================================= */}
        {activeStep === 2 && (
          <motion.div
            key="step2-appliances"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
              
              {/* Minimal Header with Compact Skip Button Aligned to Right */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>Add Appliances for Deep Cleaning</span>
                    <span className="text-[11px] text-slate-400 font-semibold hidden xs:inline">(Optional)</span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                    Internal wash, degreasing & anti-bacterial sanitization
                  </p>
                </div>

                {/* Compact Text/Link Skip Button */}
                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-black hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  <span>{selectedAppliances.length > 0 ? 'Skip to Summary' : 'Skip Add-ons'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Spacious Full-Width Vertical Stacked Appliance Cards */}
              <div className="space-y-3 sm:space-y-4">
                {APPLIANCE_OPTIONS.map((appliance) => {
                  const isSelected = selectedAppliances.includes(appliance.id);
                  const isMicrowave = appliance.id === 'microwave';

                  return (
                    <div
                      key={appliance.id}
                      onClick={() => handleAddClick(appliance.id)}
                      className={`group relative rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-slate-50 border-black shadow-md ring-1 ring-black/15'
                          : 'bg-white border-slate-200 hover:border-slate-400 shadow-xs hover:shadow-md'
                      }`}
                    >
                      {/* Left: Prominent Product Image + Full Details */}
                      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                        {/* Large Image Container */}
                        <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                          <img
                            src={appliance.imageUrl}
                            alt={appliance.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (appliance.id.includes('fridge')) {
                                target.src = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80';
                              } else if (appliance.id === 'chimney') {
                                target.src = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80';
                              } else if (appliance.id === 'microwave') {
                                target.src = 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=400&q=80';
                              }
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {appliance.badge && (
                            <span
                              className={`absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-xs ${
                                isMicrowave
                                  ? 'bg-black text-white'
                                  : 'bg-slate-900/90 text-white'
                              }`}
                            >
                              {appliance.badge}
                            </span>
                          )}
                        </div>

                        {/* Title, Description & Pricing */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-sm sm:text-base md:text-lg font-black text-slate-900 group-hover:text-black transition-colors leading-snug">
                            {appliance.name}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {appliance.description}
                          </p>
                          <div className="pt-0.5 flex items-center gap-2">
                            <span className="text-sm sm:text-base font-black text-black">
                              +₹{appliance.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">
                              Extra Add-on
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Prominent Easy-to-Tap CTA Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="sm:hidden text-sm font-black text-black">
                          +₹{appliance.price.toLocaleString('en-IN')}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddClick(appliance.id);
                          }}
                          className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                            isSelected
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/30'
                              : 'bg-[#5337E1] hover:bg-[#462ec4] text-white shadow-[#5337E1]/20 hover:scale-105 active:scale-95'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 stroke-[3]" />
                              <span>+ ADD</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Proceed to Summary Footer Row */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-slate-700 font-bold">
                  {selectedAppliances.length > 0 ? (
                    <span className="text-black font-black">
                      {selectedAppliances.length} appliance(s) selected (+₹{applianceTotal.toLocaleString('en-IN')})
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">No extra appliances selected (Optional)</span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 sm:w-auto px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 sm:flex-none px-6 py-2.5 sm:py-3 rounded-lg font-extrabold text-xs sm:text-sm uppercase tracking-wider bg-[#5337E1] hover:bg-[#462ec4] text-white shadow-md shadow-[#5337E1]/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>View Summary</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: ORDER SUMMARY & BOOKING CONFIRMATION */}
        {/* ========================================================================= */}
        {activeStep === 3 && (
          <motion.div
            key="step3-summary"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-3xl p-1 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50 shadow-xl">
              <div className="rounded-[22px] bg-white border border-slate-200 p-4 sm:p-7 space-y-6">
                
                {/* Header */}
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold uppercase tracking-wider mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Step 3 of 3: Order Review</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Kitchen Cleaning Order Summary
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Review your customized cleaning package and proceed with booking.
                    </p>
                  </div>
                </div>

                {/* 1. Main Kitchen Package Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900">
                            {activePkg ? activePkg.title : 'Complete Deep Kitchen Cleaning'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-900 border border-slate-300">
                            Primary Service
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {activePkg?.subtitle || '100°C Steam sanitization, degreasing & interior cleaning'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg sm:text-xl font-black text-black">
                        ₹{packagePrice.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={handleOpenModal}
                        className="block text-[11px] font-bold text-black hover:underline mt-1"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Inclusion Checklist */}
                  <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Taski R2/R6 professional chemical degreasing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Tiles, countertops & stainless steel sink descaling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>100°C steam disinfection of crevices & gas stove</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{activePkg?.id === 'complete' ? 'Cabinets interior + exterior deep scrub' : 'Cabinets exterior wipedown & polish'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Add-on Appliances Section */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-black" />
                      <span>Appliance Care Add-ons ({selectedAppliances.length})</span>
                    </h4>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{selectedAppliances.length > 0 ? 'Edit Add-ons' : '+ Add Appliances'}</span>
                    </button>
                  </div>

                  {selectedAppliances.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {selectedAppliances.map((appId) => {
                        const app = APPLIANCE_OPTIONS.find((a) => a.id === appId);
                        if (!app) return null;
                        return (
                          <div
                            key={app.id}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={app.imageUrl}
                                alt={app.name}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                              />
                              <div className="truncate">
                                <span className="font-bold text-slate-900 block truncate">
                                  {app.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {app.badge || 'Sanitized clean'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-black text-slate-900">
                                +₹{app.price.toLocaleString('en-IN')}
                              </span>
                              <button
                                onClick={() => handleAddClick(app.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-white/70 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                      <span>No additional appliance add-ons selected.</span>
                    </div>
                  )}
                </div>

                {/* 3. Cost Breakdown Table */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-200/90 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Price Calculation
                  </h4>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-slate-700">
                      <span>{activePkg?.title || 'Kitchen Cleaning Package'}</span>
                      <span className="font-bold">₹{packagePrice.toLocaleString('en-IN')}</span>
                    </div>

                    {selectedAppliances.length > 0 && (
                      <div className="flex items-center justify-between text-slate-700">
                        <span>Appliance Add-ons ({selectedAppliances.length} item{selectedAppliances.length > 1 ? 's' : ''})</span>
                        <span className="font-bold text-black">+₹{applianceTotal.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-500">
                      <span>Taski Chemicals, Heavy Machine & Safety Gear</span>
                      <span className="font-bold text-emerald-600 uppercase text-[11px]">Free / Included</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>GST & Taxes</span>
                      <span className="font-bold text-emerald-600 uppercase text-[11px]">Inclusive</span>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base sm:text-xl font-black text-slate-900">
                      <span>Final Estimated Total</span>
                      <span className="text-black font-black">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Trust Assurance Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">Pay After Service Complete</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 text-slate-800">
                    <CalendarCheck className="w-4 h-4 text-black shrink-0" />
                    <span className="font-bold">Instant Slot Confirmation</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-2 text-amber-800">
                    <BadgePercent className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-bold">100% Quality Re-clean Assurance</span>
                  </div>
                </div>

                {/* 5. Final Booking Action Buttons STRICTLY ON STEP 3 */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Primary Button: Complete Booking Form */}
                    <button
                      onClick={() => onNavigate('booking')}
                      className="flex-1 py-3.5 sm:py-4 px-6 rounded-lg bg-[#5337E1] hover:bg-[#462ec4] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#5337E1]/25 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Add Address & Slot</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>

                    {/* Secondary WhatsApp Instant Booking Button */}
                    <a
                      href={generateWhatsAppMessage()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-4 px-6 rounded-[8px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-center"
                    >
                      <MessageSquare className="w-5 h-5 fill-white text-emerald-600" />
                      <span>Book on WhatsApp</span>
                    </a>
                  </div>

                  <p className="text-[11px] text-center text-slate-400 font-medium">
                    No advance payment required. Pay conveniently via UPI or Cash after service inspection.
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

