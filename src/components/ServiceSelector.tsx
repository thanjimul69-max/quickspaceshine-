import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Flame, Sparkles, Plus, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { BATHROOM_PACKAGE, getKitchenPackage } from '../data/services';

interface ServiceSelectorProps {
  kitchenSelected?: boolean;
  kitchenPackageId: 'classic' | 'complete' | null;
  selectedAppliances: string[];
  bathroomCount: number;
  onToggleKitchen?: (selected: boolean) => void;
  onSelectKitchenPackage: (packageId: 'classic' | 'complete' | null) => void;
  onOpenKitchenModal: () => void;
  onOpenBathroomModal: () => void;
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
  onOpenBathroomModal,
  onChangeBathroomCount,
  onShowToast,
  onScrollToBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'kitchen' | 'bathroom'>('kitchen');
  const [fullHomeModalOpen, setFullHomeModalOpen] = useState(false);

  const activeKitchenPkg = getKitchenPackage(kitchenPackageId);

  const handleFullHomeClick = () => {
    setFullHomeModalOpen(true);
  };

  const handleKitchenCardClick = () => {
    setActiveTab('kitchen');
    onOpenKitchenModal();
  };

  const handleBathroomCardClick = () => {
    setActiveTab('bathroom');
    onOpenBathroomModal();
  };

  return (
    <section id="services" className="py-8 sm:py-12 lg:py-16 bg-white relative overflow-hidden border-t border-slate-200">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-slate-200/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-300/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        
        {/* 3 Clickable High-Quality SVG Service Cards (Urban Company Style) */}
        <div className="w-full">
          <div
            id="service-category-cards-container"
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              padding: '10px 5px',
            }}
            className="justify-start sm:justify-center no-scrollbar select-none"
          >
            {/* Card 1: Full Home Cleaning */}
            <button
              onClick={handleFullHomeClick}
              id="card-full-home-cleaning"
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
              className="flex-1 min-w-[110px] sm:min-w-[135px] max-w-[160px] p-3 sm:p-4 border border-slate-200/90 hover:border-black hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center cursor-pointer group active:scale-95 shrink-0"
              title="Full Home Cleaning (Coming Soon)"
            >
              {/* Realistic 3D Architectural Villa / Home SVG */}
              <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    {/* Roof Slab 3D Gradient */}
                    <linearGradient id="roofTopGrad" x1="4" y1="18" x2="24" y2="6" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#334155" />
                      <stop offset="0.5" stopColor="#1E293B" />
                      <stop offset="1" stopColor="#0F172A" />
                    </linearGradient>
                    <linearGradient id="roofSideGrad" x1="24" y1="6" x2="44" y2="18" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1E293B" />
                      <stop offset="1" stopColor="#020617" />
                    </linearGradient>
                    {/* Modern Wall Concrete Gradients */}
                    <linearGradient id="wallFrontGrad" x1="10" y1="18" x2="28" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF" />
                      <stop offset="0.6" stopColor="#F1F5F9" />
                      <stop offset="1" stopColor="#E2E8F0" />
                    </linearGradient>
                    <linearGradient id="wallSideGrad" x1="28" y1="18" x2="39" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#CBD5E1" />
                      <stop offset="1" stopColor="#94A3B8" />
                    </linearGradient>
                    {/* Glass Glazing Gradient */}
                    <linearGradient id="glassWindowGrad" x1="13" y1="22" x2="24" y2="33" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38BDF8" />
                      <stop offset="0.5" stopColor="#0284C7" />
                      <stop offset="1" stopColor="#0369A1" />
                    </linearGradient>
                    {/* Foundation Shadow */}
                    <linearGradient id="homeShadowGrad" x1="6" y1="42" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#64748B" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#334155" stopOpacity="0.3" />
                      <stop offset="1" stopColor="#64748B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Base Cast Shadow */}
                  <ellipse cx="24" cy="42" rx="18" ry="2.5" fill="url(#homeShadowGrad)" />
                  {/* 3D Modern Left & Right Wall Modules */}
                  <path d="M10 20L28 17V39H10V20Z" fill="url(#wallFrontGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
                  <path d="M28 17L38 21V39H28V17Z" fill="url(#wallSideGrad)" stroke="#94A3B8" strokeWidth="0.8" />
                  {/* Modern Cantilever Roof Overhang (3D Bevel) */}
                  <path d="M24 7L6 18.5L9 20.5L24 10.5L39 20.5L42 18.5L24 7Z" fill="url(#roofTopGrad)" />
                  <path d="M6 18.5L9 20.5V22L6 20V18.5Z" fill="#0F172A" />
                  <path d="M42 18.5L39 20.5V22L42 20V18.5Z" fill="#020617" />
                  {/* First Floor Architectural Balcony / Deep Glass Window */}
                  <rect x="13" y="21" width="12" height="7" rx="1.5" fill="url(#glassWindowGrad)" stroke="#0284C7" strokeWidth="0.7" />
                  {/* Glass Sheen / Reflection lines */}
                  <path d="M14 27L20 22H23L17 27H14Z" fill="#FFFFFF" fillOpacity="0.45" />
                  <line x1="19" y1="21" x2="19" y2="28" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.8" />
                  {/* Modern Main Entrance Door */}
                  <rect x="18" y="30" width="7" height="9" rx="1" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />
                  <rect x="19.5" y="31.5" width="4" height="6" rx="0.5" fill="#334155" />
                  <circle cx="23" cy="35" r="0.6" fill="#F59E0B" />
                  {/* Side Architecture Window */}
                  <rect x="30" y="24" width="6" height="10" rx="1" fill="url(#glassWindowGrad)" stroke="#0369A1" strokeWidth="0.6" />
                  <line x1="30" y1="29" x2="36" y2="29" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.6" />
                  {/* Precision Sparkle / Clean Shine */}
                  <path d="M38 8L39 11L42 12L39 13L38 16L37 13L34 12L37 11L38 8Z" fill="#000000" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight leading-tight group-hover:text-black transition-colors">
                Full Home Cleaning
              </span>
            </button>

            {/* Card 2: Kitchen Cleaning */}
            <button
              onClick={handleKitchenCardClick}
              id="card-kitchen-cleaning"
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: activeTab === 'kitchen' ? '0 4px 14px rgba(0,0,0,0.22)' : '0 4px 12px rgba(0,0,0,0.06)',
              }}
              className={`flex-1 min-w-[110px] sm:min-w-[135px] max-w-[160px] p-3 sm:p-4 border transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center cursor-pointer group active:scale-95 shrink-0 ${
                activeTab === 'kitchen'
                  ? 'border-black ring-2 ring-black/20 bg-slate-50'
                  : 'border-slate-200/90 hover:border-black hover:shadow-md'
              }`}
              title="Kitchen Cleaning"
            >
              {/* Realistic 3D Sleek Luxury Black Chimney Hood SVG */}
              <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    {/* Sleek Piano Black Brushed Duct Gradient */}
                    <linearGradient id="blackDuctGrad" x1="17" y1="5" x2="31" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0B0F19" />
                      <stop offset="0.25" stopColor="#1E293B" />
                      <stop offset="0.5" stopColor="#475569" />
                      <stop offset="0.75" stopColor="#1E293B" />
                      <stop offset="1" stopColor="#020617" />
                    </linearGradient>
                    {/* Modern 3D Piano Black Canopy Hood Body */}
                    <linearGradient id="blackCanopyGrad" x1="6" y1="19" x2="42" y2="33" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#020617" />
                      <stop offset="0.25" stopColor="#1E293B" />
                      <stop offset="0.5" stopColor="#334155" />
                      <stop offset="0.75" stopColor="#0F172A" />
                      <stop offset="1" stopColor="#020617" />
                    </linearGradient>
                    {/* Matte Black Filter Housing */}
                    <linearGradient id="blackBaffleHousing" x1="9" y1="31" x2="39" y2="37" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#090D16" />
                      <stop offset="0.5" stopColor="#111827" />
                      <stop offset="0.3" stopColor="#030712" />
                    </linearGradient>
                    {/* Floor/Base Soft Contact Shadow */}
                    <linearGradient id="hoodShadow" x1="8" y1="41" x2="40" y2="41" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0F172A" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#020617" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#0F172A" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Subtle Under-shadow */}
                  <ellipse cx="24" cy="41" rx="14" ry="2" fill="url(#hoodShadow)" />
                  {/* Matte Black Exhaust Flue / Duct with Vertical Specular Line */}
                  <rect x="18" y="5" width="12" height="15" rx="1.5" fill="url(#blackDuctGrad)" stroke="#0F172A" strokeWidth="0.9" />
                  <line x1="24" y1="5.5" x2="24" y2="19.5" stroke="#94A3B8" strokeOpacity="0.6" strokeWidth="0.7" />
                  {/* Duct Base Trim */}
                  <rect x="16.5" y="18.5" width="15" height="2" rx="0.5" fill="#020617" stroke="#1E293B" strokeWidth="0.6" />
                  {/* 3D Modern Angular Black Hood Body */}
                  <path d="M17 19H31L42 29.5C42.8 30.3 42.3 31.5 41.2 31.5H6.8C5.7 31.5 5.2 30.3 6 29.5L17 19Z" fill="url(#blackCanopyGrad)" stroke="#020617" strokeWidth="0.9" />
                  {/* Sleek Gloss Highlight Rim along Canopy Bevel */}
                  <path d="M17 19.5L6.5 29.5H41.5L31 19.5" stroke="#64748B" strokeOpacity="0.8" strokeWidth="0.8" />
                  {/* Deep Obsidian Baffle Filter Box */}
                  <rect x="9" y="31.5" width="30" height="5.2" rx="1.2" fill="url(#blackBaffleHousing)" stroke="#020617" strokeWidth="0.9" />
                  {/* Precision Angled Stainless / Dark Chrome Baffles */}
                  <line x1="13" y1="33" x2="13" y2="35.5" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="17" y1="33" x2="17" y2="35.5" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="21" y1="33" x2="21" y2="35.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="25" y1="33" x2="25" y2="35.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="29" y1="33" x2="29" y2="35.5" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="33" y1="33" x2="33" y2="35.5" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
                  {/* Touch Sensor Glass Controls */}
                  <circle cx="21" cy="30" r="0.7" fill="#38BDF8" />
                  <circle cx="24" cy="30" r="0.7" fill="#000000" />
                  <circle cx="27" cy="30" r="0.7" fill="#38BDF8" />
                  {/* Clean Steam Purge Accent */}
                  <path d="M12 12C11 9 12 7 10 5" stroke="#000000" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.5 2" />
                  <path d="M36 12C37 9 36 7 38 5" stroke="#000000" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1.5 2" />
                </svg>
              </div>
              <span className={`text-xs sm:text-sm font-extrabold tracking-tight leading-tight transition-colors ${activeTab === 'kitchen' ? 'text-black' : 'text-slate-800 group-hover:text-black'}`}>
                Kitchen Cleaning
              </span>
            </button>

            {/* Card 3: Bathroom Cleaning */}
            <button
              onClick={handleBathroomCardClick}
              id="card-bathroom-cleaning"
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: activeTab === 'bathroom' ? '0 4px 14px rgba(0,0,0,0.22)' : '0 4px 12px rgba(0,0,0,0.06)',
              }}
              className={`flex-1 min-w-[110px] sm:min-w-[135px] max-w-[160px] p-3 sm:p-4 border transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center cursor-pointer group active:scale-95 shrink-0 ${
                activeTab === 'bathroom'
                  ? 'border-black ring-2 ring-black/20 bg-slate-50'
                  : 'border-slate-200/90 hover:border-black hover:shadow-md'
              }`}
              title="Bathroom Cleaning"
            >
              {/* Realistic Modern 3D White Porcelain Ceramic Commode SVG */}
              <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    {/* Ceramic Tank Soft Gloss Gradient */}
                    <linearGradient id="ceramicTankGrad" x1="14" y1="7" x2="34" y2="21" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF" />
                      <stop offset="0.65" stopColor="#F8FAFC" />
                      <stop offset="1" stopColor="#CBD5E1" />
                    </linearGradient>
                    {/* Ceramic Bowl 3D Curvature Gradient */}
                    <linearGradient id="ceramicBowlGrad" x1="12" y1="19" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFFFFF" />
                      <stop offset="0.5" stopColor="#F1F5F9" />
                      <stop offset="0.85" stopColor="#CBD5E1" />
                      <stop offset="1" stopColor="#94A3B8" />
                    </linearGradient>
                    {/* Chrome Dual Flush Metallic Gradient */}
                    <linearGradient id="chromeFlushGrad" x1="21" y1="5" x2="27" y2="8" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#64748B" />
                      <stop offset="0.3" stopColor="#FFFFFF" />
                      <stop offset="0.7" stopColor="#94A3B8" />
                      <stop offset="1" stopColor="#334155" />
                    </linearGradient>
                    {/* Sanitized Water Pool Gradient */}
                    <linearGradient id="waterPoolGrad" x1="19" y1="24" x2="29" y2="29" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38BDF8" />
                      <stop offset="1" stopColor="#0284C7" />
                    </linearGradient>
                    {/* Ceramic Base Ground Shadow */}
                    <linearGradient id="toiletGroundShadow" x1="14" y1="44" x2="34" y2="44" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#64748B" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#334155" stopOpacity="0.35" />
                      <stop offset="1" stopColor="#64748B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Floor Ambient Occlusion Shadow */}
                  <ellipse cx="24" cy="43.5" rx="11" ry="2" fill="url(#toiletGroundShadow)" />
                  {/* Ceramic Cistern Tank with Rounded Lid */}
                  <rect x="14.5" y="7.5" width="19" height="13.5" rx="3" fill="url(#ceramicTankGrad)" stroke="#94A3B8" strokeWidth="0.8" />
                  {/* Cistern Tank Lid Contour */}
                  <rect x="13.5" y="6.5" width="21" height="3" rx="1.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.7" />
                  {/* Chrome Dual-Flush Top Push Buttons */}
                  <rect x="21.5" y="5.8" width="5" height="1.8" rx="0.9" fill="url(#chromeFlushGrad)" stroke="#64748B" strokeWidth="0.5" />
                  <line x1="24" y1="5.8" x2="24" y2="7.6" stroke="#475569" strokeWidth="0.4" />
                  {/* Solid Ceramic Pedestal Base */}
                  <path d="M17.5 32L19 41.5C19.2 42.5 20 43 21 43H27C28 43 28.8 42.5 29 41.5L30.5 32" fill="url(#ceramicBowlGrad)" stroke="#94A3B8" strokeWidth="0.8" />
                  {/* Ergonomic Porcelain Toilet Bowl Rim (3D Elliptical Geometry) */}
                  <path d="M12 21.5C12 20 13.5 19 15 19H33C34.5 19 36 20 36 21.5C36 28.5 31.5 34 24 34C16.5 34 12 28.5 12 21.5Z" fill="url(#ceramicBowlGrad)" stroke="#94A3B8" strokeWidth="0.9" />
                  {/* Soft-Close Ceramic Seat Cover Contour */}
                  <ellipse cx="24" cy="22" rx="10" ry="3.2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" />
                  {/* Inner Water Sanitized Basin with Caustic Blue Glow */}
                  <ellipse cx="24" cy="25" rx="6.5" ry="3.2" fill="url(#waterPoolGrad)" fillOpacity="0.4" stroke="#0284C7" strokeWidth="0.6" />
                  {/* Ceramic Gloss Highlight Specular Streak */}
                  <path d="M15.5 10H17.5C18.2 10 18.5 13 18 16H16C15.2 14 15 11 15.5 10Z" fill="#FFFFFF" fillOpacity="0.85" />
                  <path d="M14 24C14 22 15 20.5 17 20.5" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
                  {/* Sparkle Clean Indicator */}
                  <path d="M37 15L38 17.5L40.5 18.5L38 19.5L37 22L36 19.5L33.5 18.5L36 17.5L37 15Z" fill="#0EA5E9" />
                  <path d="M9 27L9.7 28.8L11.5 29.5L9.7 30.2L9 32L8.3 30.2L6.5 29.5L8.3 28.8L9 27Z" fill="#000000" />
                </svg>
              </div>
              <span className={`text-xs sm:text-sm font-extrabold tracking-tight leading-tight transition-colors ${activeTab === 'bathroom' ? 'text-black' : 'text-slate-800 group-hover:text-black'}`}>
                Bathroom Cleaning
              </span>
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
              {/* Base Kitchen Package Card (Shown when a package is active) */}
              {activeKitchenPkg && (
                <div className="relative rounded-3xl p-1 bg-gradient-to-br from-slate-300 via-slate-100 to-slate-200 shadow-xl">
                  <div className="rounded-[22px] bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-black text-white border border-black text-[11px] font-extrabold uppercase tracking-wider">
                            Active: {activeKitchenPkg.badge}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            ⏱️ 3 - 4.5 Hours
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          {activeKitchenPkg.title}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                          {activeKitchenPkg.subtitle}
                        </p>
                      </div>
                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-1 shrink-0">
                        <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                          ₹{activeKitchenPkg.price.toLocaleString('en-IN')}
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Included in Cart
                        </span>
                      </div>
                    </div>

                    {/* Package Checklist Features */}
                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      {activeKitchenPkg.inclusions.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Upgrade / Switch Package Trigger Button */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Flame className="w-4 h-4 text-black" />
                        <span>Want to change package tier or empty cabinet options?</span>
                      </div>
                      <button
                        onClick={onOpenKitchenModal}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black font-extrabold text-xs tracking-wide border border-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        Change Package Option
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Bathroom Tab View */
            <motion.div
              key="bathroom-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Bathroom Package Card */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-slate-300 via-slate-100 to-slate-200 shadow-xl">
                <div className="rounded-[22px] bg-white border border-slate-200 p-6 sm:p-8 space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-black text-white border border-black text-[11px] font-extrabold uppercase tracking-wider">
                          {BATHROOM_PACKAGE.badge}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          ⏱️ 1.5 - 2 Hours
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {BATHROOM_PACKAGE.title}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        {BATHROOM_PACKAGE.subtitle}
                      </p>
                    </div>

                    {/* Counter Control / Price */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-3 shrink-0">
                      <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                        ₹{BATHROOM_PACKAGE.basePrice.toLocaleString('en-IN')}
                        <span className="text-xs font-semibold text-slate-400 ml-1">/ bathroom</span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-slate-50">
                        <button
                          onClick={() => onChangeBathroomCount(Math.max(0, bathroomCount - 1))}
                          className="w-10 h-10 flex items-center justify-center font-black text-slate-600 hover:bg-slate-200 hover:text-black transition-colors text-base cursor-pointer"
                          aria-label="Decrease bathrooms"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-black text-slate-900 text-sm">
                          {bathroomCount}
                        </span>
                        <button
                          onClick={() => {
                            onChangeBathroomCount(bathroomCount + 1);
                            onShowToast('Bathroom added to booking', 'success');
                          }}
                          className="w-10 h-10 flex items-center justify-center font-black text-slate-600 hover:bg-slate-200 hover:text-black transition-colors text-base cursor-pointer"
                          aria-label="Increase bathrooms"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bathroom Checklist */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {BATHROOM_PACKAGE.inclusions.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Trust Banner */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs font-bold text-slate-600">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Includes 100°C Thermal Steam sanitization of toilet bowl, floor grouting & hard water tile descaling.</span>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Services Quick Total Summary Bar */}
        <div className="p-5 sm:p-6 rounded-2xl bg-black text-white shadow-xl shadow-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
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
                <span className="text-slate-300 italic text-xs">No services selected yet</span>
              )}
            </div>
          </div>

          <button
            onClick={onScrollToBooking}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0 cursor-pointer border border-white/10"
          >
            Proceed to Booking Details
          </button>
        </div>

      </div>

      {/* Full Home Cleaning Coming Soon Popup Modal */}
      <AnimatePresence>
        {fullHomeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative space-y-5"
            >
              {/* Close Button */}
              <button
                onClick={() => setFullHomeModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon & Headline */}
              <div className="text-center space-y-3 pt-2">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto shadow-inner">
                  <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="modalRoofGrad" x1="4" y1="18" x2="24" y2="6" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#334155" />
                        <stop offset="0.5" stopColor="#1E293B" />
                        <stop offset="1" stopColor="#0F172A" />
                      </linearGradient>
                      <linearGradient id="modalWallGrad" x1="10" y1="18" x2="28" y2="40" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFFFFF" />
                        <stop offset="0.6" stopColor="#F1F5F9" />
                        <stop offset="1" stopColor="#E2E8F0" />
                      </linearGradient>
                      <linearGradient id="modalGlassGrad" x1="13" y1="22" x2="24" y2="33" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#38BDF8" />
                        <stop offset="0.5" stopColor="#0284C7" />
                        <stop offset="1" stopColor="#0369A1" />
                      </linearGradient>
                    </defs>
                    <ellipse cx="24" cy="42" rx="18" ry="2.5" fill="#334155" fillOpacity="0.25" />
                    <path d="M10 20L28 17V39H10V20Z" fill="url(#modalWallGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
                    <path d="M28 17L38 21V39H28V17Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
                    <path d="M24 7L6 18.5L9 20.5L24 10.5L39 20.5L42 18.5L24 7Z" fill="url(#modalRoofGrad)" />
                    <rect x="13" y="21" width="12" height="7" rx="1.5" fill="url(#modalGlassGrad)" stroke="#0284C7" strokeWidth="0.7" />
                    <path d="M14 27L20 22H23L17 27H14Z" fill="#FFFFFF" fillOpacity="0.45" />
                    <rect x="18" y="30" width="7" height="9" rx="1" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />
                    <circle cx="23" cy="35" r="0.6" fill="#F59E0B" />
                    <rect x="30" y="24" width="6" height="10" rx="1" fill="url(#modalGlassGrad)" stroke="#0369A1" strokeWidth="0.6" />
                    <path d="M38 8L39 11L42 12L39 13L38 16L37 13L34 12L37 11L38 8Z" fill="#000000" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                    Launching Soon
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    Full Home Deep Cleaning
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Full Home Deep Cleaning is coming soon! In the meantime, please explore our high-rated Kitchen Deep Cleaning and Bathroom Sanitization packages.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setFullHomeModalOpen(false);
                    setActiveTab('kitchen');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-black hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-black/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Kitchen Cleaning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setFullHomeModalOpen(false);
                    setActiveTab('bathroom');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Bathroom Cleaning</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
