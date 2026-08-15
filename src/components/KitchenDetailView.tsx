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
      className="min-h-screen bg-slate-50/60 pb-32 pt-3 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6"
    >
      {/* 1. Header with Dynamic Back Navigation & Stepper */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          {/* Back Button */}
          {activeStep === 1 ? (
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-[8px] bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-[#5337E1] font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#5337E1] stroke-[2.5]" />
              <span>Back to Home</span>
            </button>
          ) : activeStep === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-[8px] bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-[#5337E1] font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#5337E1] stroke-[2.5]" />
              <span>Back to Service Details</span>
            </button>
          ) : (
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-[8px] bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-[#5337E1] font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#5337E1] stroke-[2.5]" />
              <span>Back to Add Appliances</span>
            </button>
          )}

          {/* Right Action: Change Package */}
          <div className="flex items-center gap-2">
            {activePkg && (
              <button
                onClick={handleOpenModal}
                className="px-3 py-2 rounded-[8px] font-bold text-xs uppercase tracking-wider bg-white border border-slate-200 text-slate-700 hover:text-[#5337E1] hover:border-[#5337E1] transition-all shadow-sm cursor-pointer"
              >
                Change Package
              </button>
            )}
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-900 text-xs font-extrabold uppercase tracking-wider">
              {activePkg ? activePkg.title : 'Kitchen Service'}
            </span>
          </div>
        </div>

        {/* 3-Step Progress Stepper */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Step 1 Tab */}
            <button
              onClick={() => setStep(1)}
              className={`flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                activeStep === 1
                  ? 'bg-slate-100 border border-slate-400 text-black shadow-xs'
                  : activeStep > 1
                  ? 'bg-emerald-50/60 border border-emerald-200 text-emerald-700 hover:bg-slate-100'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  activeStep === 1
                    ? 'bg-black text-white'
                    : activeStep > 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {activeStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-75">
                  Step 1
                </span>
                <span className="text-xs sm:text-sm font-black truncate block">
                  Service Details
                </span>
              </div>
            </button>

            {/* Step 2 Tab */}
            <button
              onClick={() => setStep(2)}
              className={`flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                activeStep === 2
                  ? 'bg-slate-100 border border-slate-400 text-black shadow-xs'
                  : activeStep > 2
                  ? 'bg-emerald-50/60 border border-emerald-200 text-emerald-700 hover:bg-slate-100'
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  activeStep === 2
                    ? 'bg-black text-white'
                    : activeStep > 2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {activeStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-75">
                  Step 2
                </span>
                <span className="text-xs sm:text-sm font-black truncate block">
                  Add Appliances
                </span>
              </div>
            </button>

            {/* Step 3 Tab */}
            <button
              onClick={() => setStep(3)}
              className={`flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                activeStep === 3
                  ? 'bg-slate-100 border border-slate-400 text-black shadow-xs'
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  activeStep === 3 ? 'bg-black text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </div>
              <div className="text-center sm:text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-75">
                  Step 3
                </span>
                <span className="text-xs sm:text-sm font-black truncate block">
                  Summary & Book
                </span>
              </div>
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

                {/* Primary Action Button: "CONTINUE TO ADD APPLIANCES" */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
                    Step 1 of 3: Next you can choose optional appliance deep cleaning add-ons.
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto px-8 py-4 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#5337E1]/25 hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Add Appliances</span>
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
            className="space-y-6"
          >
            <div className="rounded-3xl p-1 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50 shadow-xl">
              <div className="rounded-[22px] bg-white border border-slate-200 p-4 sm:p-7 space-y-6">
                
                {/* Section Header with Skip Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-900 border border-slate-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      <span>Appliance Care Add-ons (Optional)</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Add Appliances for Deep Cleaning
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Professional internal wash, degreasing & anti-bacterial sanitization.
                    </p>
                  </div>

                  {/* Skip or Proceed Button */}
                  <button
                    onClick={() => setStep(3)}
                    className="self-start sm:self-auto px-5 py-2.5 rounded-[8px] text-xs font-extrabold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                  >
                    <span>{selectedAppliances.length > 0 ? 'Skip to Summary' : 'Skip Add-ons'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Compact Vertical List Layout for Mobile & Desktop */}
                <div className="space-y-3 sm:space-y-4">
                  {APPLIANCE_OPTIONS.map((appliance) => {
                    const isSelected = selectedAppliances.includes(appliance.id);
                    const isMicrowave = appliance.id === 'microwave';

                    return (
                      <div
                        key={appliance.id}
                        onClick={() => handleAddClick(appliance.id)}
                        className={`group relative rounded-2xl p-3 sm:p-4 border-2 transition-all cursor-pointer select-none flex items-center justify-between gap-3 sm:gap-4 ${
                          isSelected
                            ? 'bg-slate-100 border-black shadow-md ring-2 ring-black/20'
                            : 'bg-white border-slate-200 hover:border-slate-400 shadow-xs hover:shadow-md'
                        }`}
                      >
                        {/* Left Thumbnail (Compact Aspect) */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
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
                              className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-sm ${
                                isMicrowave
                                  ? 'bg-black text-white'
                                  : 'bg-slate-900/90 text-white'
                              }`}
                            >
                              {appliance.badge}
                            </span>
                          )}
                        </div>

                        {/* Center Description & Info */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-black transition-colors">
                              {appliance.name}
                            </h4>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mt-0.5">
                            {appliance.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm sm:text-base font-black text-black">
                              +₹{appliance.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">
                              Extra add-on
                            </span>
                          </div>
                        </div>

                        {/* Right Prominent Action Button */}
                        <div className="shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddClick(appliance.id);
                            }}
                            className={`px-5 py-2.5 rounded-[8px] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                              isSelected
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/30'
                                : 'bg-[#5337E1] hover:bg-[#462ec4] text-white shadow-[#5337E1]/25 hover:scale-105 active:scale-95'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
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
                <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-700 font-bold">
                    {selectedAppliances.length > 0 ? (
                      <span className="text-black">
                        {selectedAppliances.length} appliance(s) selected (+₹{applianceTotal.toLocaleString('en-IN')})
                      </span>
                    ) : (
                      <span>No extra appliances selected (Optional)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/2 sm:w-auto px-5 py-3 rounded-[8px] bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="w-1/2 sm:w-auto px-8 py-3.5 rounded-[8px] font-black text-xs sm:text-sm uppercase tracking-wider bg-[#5337E1] hover:bg-[#462ec4] text-white shadow-lg shadow-[#5337E1]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Continue to Summary</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
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
                      className="flex-1 py-4 px-6 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#5337E1]/25 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CalendarCheck className="w-5 h-5" />
                      <span>Complete Booking (Enter Address & Time)</span>
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

