import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Flame, Zap, ArrowRight, PhoneCall, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface HeroProps {
  verifiedArea?: string;
  pincode?: string;
  onVerifyPincode?: (pincode: string) => void;
  onScrollToSection: (id: string) => void;
  onNavigate: (view: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking') => void;
  onOpenKitchenModal?: () => void;
}

const BEFORE_AFTER_PAIRS = [
  {
    id: 1,
    title: 'Stove & Tile Degreasing',
    beforeUrl: 'https://i.ibb.co/BH2rVFNQ/IMG20260628171145.jpg',
    afterUrl: 'https://i.ibb.co/BHr8J18W/IMG20260628173741.jpg',
  },
  {
    id: 2,
    title: 'Chimney & Countertop Cleaning',
    beforeUrl: 'https://i.ibb.co/KYzJYJs/IMG20260620105112.jpg',
    afterUrl: 'https://i.ibb.co/ymhzsrLf/IMG20260620114840.jpg',
  },
  {
    id: 3,
    title: 'Cabinet & Exhaust Steam Clean',
    beforeUrl: 'https://i.ibb.co/WWGPbV4J/IMG20260620105115.jpg',
    afterUrl: 'https://i.ibb.co/mVN64Tyr/IMG20260620115432.jpg',
  },
  {
    id: 4,
    title: 'Hard Water Descaling & Polish',
    beforeUrl: 'https://i.ibb.co/Cjw4hkf/IMG20260620202730.jpg',
    afterUrl: 'https://i.ibb.co/XwhXMFg/IMG20260620204119.jpg',
  },
];

export const Hero: React.FC<HeroProps> = ({
  onScrollToSection,
  onNavigate,
  onOpenKitchenModal,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSlide = (index: number) => {
    const nextIndex = Math.max(0, Math.min(BEFORE_AFTER_PAIRS.length - 1, index));
    setActiveSlide(nextIndex);
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: nextIndex * containerWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const index = Math.round(scrollLeft / containerWidth);
      if (index !== activeSlide && index >= 0 && index < BEFORE_AFTER_PAIRS.length) {
        setActiveSlide(index);
      }
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-white border-b border-slate-200">
      {/* Soft Pink Glow Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-200/30 via-rose-100/20 to-pink-50/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-pink-100/40 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Service Cards */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Main Headline & Tagline */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
              >
                Clean Kitchen.{' '}
                <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  Better Life.
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl font-medium text-slate-600 max-w-2xl leading-relaxed"
              >
                <span className="text-pink-600 font-bold">You Choose, We Clean!</span> Chennai&apos;s premium steam-powered deep cleaning specialists for Kitchens & Bathrooms. We eliminate stubborn chimney oil, burnt grease & tile hard-water scale.
              </motion.p>
            </div>

            {/* 2 Clickable Service Category Selection Cards (Urban Company Style) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-2.5 sm:p-4 rounded-3xl bg-slate-50/70 border border-slate-200/80 shadow-sm relative overflow-hidden w-full max-w-full"
            >
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
                {/* Card 1: Kitchen Cleaning */}
                <div
                  id="category-card-kitchen"
                  onClick={() => {
                    if (onOpenKitchenModal) {
                      onOpenKitchenModal();
                    } else {
                      onNavigate('kitchenDetail');
                    }
                  }}
                  className="w-full min-w-0 p-3 sm:p-6 rounded-2xl bg-white border border-slate-100 hover:border-pink-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center justify-center group hover:scale-[1.02] active:scale-[0.97] select-none space-y-2 sm:space-y-3"
                >
                  <div className="w-full flex items-center justify-center py-1 max-w-full">
                    <img
                      src="https://i.ibb.co/7JZcGK8N/file-0000000036648211a6847e447180c122.png"
                      alt="Kitchen Cleaning"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = 'https://i.ibb.co/SXMTKBW7/file-0000000036648211a6847e447180c122.png';
                      }}
                      className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm max-w-full"
                    />
                  </div>
                  <h3 className="text-xs sm:text-base font-black text-slate-900 group-hover:text-pink-600 transition-colors tracking-tight leading-snug break-words">
                    Kitchen Cleaning
                  </h3>
                </div>

                {/* Card 2: Bathroom Cleaning */}
                <div
                  id="category-card-bathroom"
                  onClick={() => onNavigate('bathroomDetail')}
                  className="w-full min-w-0 p-3 sm:p-6 rounded-2xl bg-white border border-slate-100 hover:border-pink-400 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center justify-center group hover:scale-[1.02] active:scale-[0.97] select-none space-y-2 sm:space-y-3"
                >
                  <div className="w-full flex items-center justify-center py-1 max-w-full">
                    <img
                      src="https://i.ibb.co/HctRM7f/file-000000000e3082088820f1120dc8693f.png"
                      alt="Bathroom Cleaning"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = 'https://i.ibb.co/6KHGpY7/file-000000000e3082088820f1120dc8693f.png';
                      }}
                      className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm max-w-full"
                    />
                  </div>
                  <h3 className="text-xs sm:text-base font-black text-slate-900 group-hover:text-pink-600 transition-colors tracking-tight leading-snug break-words">
                    Bathroom Cleaning
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Quick Feature Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2"
            >
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-pink-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">100°C Steam Clean</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Sterilizes & melts grease</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-pink-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Industrial Chemicals</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Shuma Grill & AZI Steel</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-5 h-5 text-pink-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Pay After Service</h4>
                  <p className="text-[11px] text-slate-500 font-medium">100% Satisfaction</p>
                </div>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2 w-full">
              <button
                onClick={() => onScrollToSection('services')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-pink-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Select Packages (From ₹1,999)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+919854905077"
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-pink-600" />
                <span>Call +91 9854905077</span>
              </a>
            </div>

          </div>

          {/* Right Column: Real On-Ground Results Horizontal Carousel */}
          <div className="lg:col-span-5 relative w-full min-w-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full space-y-4"
            >
              {/* 1. Clean Header with Title & Rating */}
              <div className="flex items-center justify-between gap-3 pb-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-600 shrink-0" />
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      Real On-Ground Results
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    100°C Steam & Professional Chemical Transformation
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 text-amber-600 text-xs sm:text-sm font-black bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shrink-0">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>4.9 / 5</span>
                </div>
              </div>

              {/* 2. Horizontally Scrollable Before/After Carousel - Maximized Image Size */}
              <div className="relative group w-full max-w-full overflow-hidden">
                {/* Slider Scroll Area */}
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-3 w-full"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {BEFORE_AFTER_PAIRS.map((pair, idx) => (
                    <div
                      key={pair.id}
                      className="w-full min-w-full shrink-0 snap-center space-y-2 select-none"
                    >
                      {/* 2-Column Side-by-Side Large Images */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
                        {/* Before Image */}
                        <div className="relative h-52 sm:h-64 md:h-72 lg:h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-slate-200/80 w-full">
                          <img
                            src={pair.beforeUrl}
                            alt={`${pair.title} - Before Cleaning`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-rose-500/50 text-rose-300 text-xs font-black uppercase tracking-wider shadow-lg">
                            Before
                          </div>
                        </div>

                        {/* After Image */}
                        <div className="relative h-52 sm:h-64 md:h-72 lg:h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-slate-200/80 w-full">
                          <img
                            src={pair.afterUrl}
                            alt={`${pair.title} - After Cleaning`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-lg bg-emerald-600/95 backdrop-blur-md border border-emerald-400 text-white text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                            <span>✓</span>
                            <span>After</span>
                          </div>
                        </div>
                      </div>

                      {/* Pair Title Sub-caption */}
                      <div className="flex items-center justify-between px-1 pt-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {pair.title}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200 shrink-0">
                          {idx + 1} of {BEFORE_AFTER_PAIRS.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left & Right Navigation Arrow Buttons */}
                <button
                  onClick={() => scrollToSlide(activeSlide - 1)}
                  disabled={activeSlide === 0}
                  className="absolute left-2 top-[45%] -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                  aria-label="Previous result"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => scrollToSlide(activeSlide + 1)}
                  disabled={activeSlide === BEFORE_AFTER_PAIRS.length - 1}
                  className="absolute right-2 top-[45%] -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                  aria-label="Next result"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* 3. Stepper Indicators */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {BEFORE_AFTER_PAIRS.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => scrollToSlide(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeSlide === dotIdx
                        ? 'w-7 bg-pink-600'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              {/* 4. Call To Action (CTA) Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-200/80 text-center space-y-3 shadow-sm">
                <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                  Want similar spotless results for your home? Book Quick Space Shine today!
                </p>

                <button
                  onClick={() => {
                    if (onOpenKitchenModal) {
                      onOpenKitchenModal();
                    } else {
                      onScrollToSection('services');
                    }
                  }}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-pink-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Now / Select Packages</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
