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
      {/* Full-Screen Hero Slider Container: Spans top under transparent header down to service cards */}
      <div className="relative w-full min-h-[300px] xs:min-h-[330px] sm:min-h-[380px] md:min-h-[440px] lg:min-h-[480px] flex items-center justify-center overflow-hidden">
        
        {/* Animated Background Image Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlideData.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
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
            {/* Multi-stop Contrast Gradient: Left-biased for Slide 1 (to keep character on the right bright & clear), and balanced for other slides */}
            {activeSlideData.id === 1 ? (
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/85" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Slide Text Content: Positioned with comfortable top padding under the transparent floating header */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-14">
          <AnimatePresence mode="wait">
            {activeSlideData.id === 1 ? (
              /* Slide 1: Strictly constrained to left 50% to prevent any overlap with character photo on the right */
              <motion.div
                key={activeSlideData.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ maxWidth: '50%', marginLeft: '2%' }}
                className="w-full text-left space-y-1.5 sm:space-y-2.5"
              >
                {/* Heading */}
                <h1 className="text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  {activeSlideData.title}
                </h1>

                {/* Subtext */}
                <p className="text-[11px] xs:text-xs sm:text-sm md:text-base text-slate-100 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  {activeSlideData.subtitle}
                </p>
              </motion.div>
            ) : (
              /* Slides 2 & 3: Centered or balanced layout */
              <motion.div
                key={activeSlideData.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`max-w-2xl ${
                  activeSlideData.alignment === 'center'
                    ? 'mx-auto text-center'
                    : 'text-left'
                } space-y-2 sm:space-y-3`}
              >
                {/* Title */}
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  {activeSlideData.title}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-100 font-medium leading-relaxed max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {activeSlideData.subtitle}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Slide Indicators / Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-2 pointer-events-auto">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-white shadow-md shadow-black/50'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
