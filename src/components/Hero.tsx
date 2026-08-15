import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  verifiedArea?: string;
  pincode?: string;
  onVerifyPincode?: (pincode: string) => void;
  onScrollToSection: (id: string) => void;
  onNavigate: (view: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking') => void;
  onOpenKitchenModal?: () => void;
}

interface SlideItem {
  id: number;
  imageUrl: string;
  fallbackUrl: string;
  alignment: 'left' | 'center';
  title: string;
  subtitle: string;
}

const HERO_SLIDES: SlideItem[] = [
  {
    id: 1,
    imageUrl: 'https://i.ibb.co/nNGgkMJJ/file-000000002ba881fa82e8ff3c1812db56.png',
    fallbackUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    alignment: 'left',
    title: 'Welcome to Quick Space Shine!',
    subtitle:
      'We are committed to delivering 100% customer satisfaction with our professional steam-powered deep cleaning services.',
  },
  {
    id: 2,
    imageUrl: 'https://i.ibb.co/Zp5jhfpN/file-00000000e93481fabbce7daed3b01c04.png',
    fallbackUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    alignment: 'center',
    title: 'Choose Your Service',
    subtitle:
      'We offer two specialized deep cleaning packages: Kitchen Deep Cleaning & Bathroom Sanitization.',
  },
  {
    id: 3,
    imageUrl: 'https://i.ibb.co/FL2ZdHf2/file-00000000ec5c81fa87a3e46a4d203972.png',
    fallbackUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
    alignment: 'center',
    title: 'Book Your Cleaning Today!',
    subtitle:
      'Scroll down to select your preferred package and customize your booking instantly.',
  },
];

export const Hero: React.FC<HeroProps> = ({ onScrollToSection }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-play ticker
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <section
      id="hero"
      className="relative w-full bg-slate-950 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Compact Hero Slider Container: Height restricted to 200px-240px on mobile, max 360px on desktop */}
      <div className="relative w-full h-[200px] xs:h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] flex items-center justify-center overflow-hidden">
        
        {/* Animated Background Image Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlideData.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={activeSlideData.imageUrl}
              alt={activeSlideData.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = activeSlideData.fallbackUrl;
              }}
              className="w-full h-full object-cover object-center"
            />
            {/* Contrast Overlay for optimal text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-900/35" />
          </motion.div>
        </AnimatePresence>

        {/* 2. Slide Text Content: Only Title and Subtitle with Entry Animations */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlideData.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`max-w-2xl ${
                activeSlideData.alignment === 'center'
                  ? 'mx-auto text-center'
                  : 'text-left'
              } space-y-1 sm:space-y-2`}
            >
              {/* Title */}
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {activeSlideData.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-slate-200 font-medium leading-relaxed max-w-xl drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] line-clamp-3 xs:line-clamp-none">
                {activeSlideData.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* 3. Indicators/Dots positioned right below the slider image stage */}
      <div className="w-full bg-slate-950 py-2 flex items-center justify-center gap-2 border-b border-slate-900">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === idx
                ? 'w-7 bg-white shadow-sm shadow-white/50'
                : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
