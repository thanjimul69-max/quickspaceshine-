import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageSquare, MapPin, Sparkles, Menu, X, ShieldCheck, MoreVertical, Flame, Star, ChevronRight, HelpCircle, UserCheck } from 'lucide-react';

interface NavbarProps {
  verifiedArea: string;
  pincode: string;
  onOpenPincodeChecker: () => void;
  onScrollToSection: (id: string) => void;
  onNavigate?: (view: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking') => void;
  currentPage?: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking';
}

export const Navbar: React.FC<NavbarProps> = ({
  verifiedArea,
  pincode,
  onOpenPincodeChecker,
  onScrollToSection,
  onNavigate,
  currentPage = 'home',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Track window scroll for background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('home');
    }
    onScrollToSection('hero');
    setMenuOpen(false);
  };

  const handleNavClick = (sectionId: string, page?: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking') => {
    setMenuOpen(false);
    if (page && onNavigate) {
      onNavigate(page);
    } else if (onNavigate) {
      onNavigate('home');
    }
    setTimeout(() => {
      onScrollToSection(sectionId);
    }, 50);
  };

  const isOverlay = currentPage === 'home';
  const showGlassBg = isScrolled || !isOverlay;

  return (
    <header
      id="main-navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
      }}
      className={`w-full transition-all duration-300 ${
        showGlassBg
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm'
          : 'bg-gradient-to-b from-black/60 via-black/25 to-transparent border-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        
        {/* 1. Left: Company Logo (Qs) + Company Name ("quick space shine") */}
        <a
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          id="navbar-brand-logo"
        >
          {/* Logo container */}
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl p-0.5 flex items-center justify-center shrink-0 transition-all duration-300 overflow-hidden ${
            showGlassBg
              ? 'bg-white border border-slate-200 group-hover:border-black shadow-xs'
              : 'bg-white/95 backdrop-blur-md border border-white/40 shadow-md'
          }`}>
            <img
              src="https://i.ibb.co/vvDgLjFN/20260814-044815.png"
              alt="Quick Space Shine Logo"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = 'https://i.ibb.co/rfvT5wjB/20260814-044815.png';
              }}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Company Name */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className={`text-base sm:text-lg font-black tracking-tight leading-tight lowercase transition-colors ${
                showGlassBg
                  ? 'text-slate-900 group-hover:text-black'
                  : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]'
              }`}>
                quick space shine
              </span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider hidden xs:inline-block ${
                showGlassBg
                  ? 'bg-slate-100 text-slate-900 border border-slate-300'
                  : 'bg-white/20 backdrop-blur-md text-white border border-white/30 drop-shadow-sm'
              }`}>
                QSS
              </span>
            </div>
            <span className={`text-[10px] font-semibold tracking-wide hidden sm:block ${
              showGlassBg
                ? 'text-slate-500'
                : 'text-slate-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
            }`}>
              Steam-Powered Deep Cleaning
            </span>
          </div>
        </a>

        {/* 2. Right: WhatsApp Button + Three-Dot / Hamburger Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5" ref={menuRef}>
          
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/919854905077?text=Hello%20Quick%20Space%20Shine%2C%20I%20want%20to%20inquire%20about%20your%20deep%20cleaning%20services."
            target="_blank"
            rel="noopener noreferrer"
            id="navbar-whatsapp-button"
            className="inline-flex items-center justify-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white hover:bg-slate-100 text-black font-extrabold text-xs sm:text-sm tracking-wide shadow-md shadow-black/20 border border-slate-200/80 transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap cursor-pointer"
            aria-label="Chat on WhatsApp"
            title="Chat with Quick Space Shine on WhatsApp"
          >
            WhatsApp
          </a>

          {/* Three-Dot / Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            id="navbar-menu-toggle"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              showGlassBg
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-xs'
                : 'bg-black/45 hover:bg-black/70 text-white border border-white/30 backdrop-blur-md shadow-lg shadow-black/30'
            }`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Clean Dropdown / Slide-out Menu */}
          {menuOpen && (
            <div className="absolute top-16 sm:top-20 right-4 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              
              {/* Location / Pincode Badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <MapPin className="w-4 h-4 text-black shrink-0" />
                  <span className="truncate">
                    {verifiedArea ? `${pincode} (${verifiedArea.split('/')[0].trim()})` : 'Chennai HQ (600032)'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenPincodeChecker();
                  }}
                  className="text-[11px] font-black text-black hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1 text-sm font-bold text-slate-700 pt-1">
                <button
                  onClick={() => handleNavClick('hero', 'home')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors text-left cursor-pointer"
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleNavClick('services', 'home')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors text-left cursor-pointer"
                >
                  <span>Packages & Add-ons</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black text-white">
                    From ₹1,999
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('kitchen', 'kitchenDetail')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors text-left cursor-pointer"
                >
                  <span>Kitchen Deep Cleaning</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleNavClick('bathroom', 'bathroomDetail')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors text-left cursor-pointer"
                >
                  <span>Bathroom Sanitization</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleNavClick('before-after', 'home')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Steam Cleaning Results</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleNavClick('tools-supplies', 'home')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors text-left cursor-pointer"
                >
                  <span>Chemicals & Equipment</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleNavClick('founder', 'home')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors text-left cursor-pointer"
                >
                  <span>Meet The Founder</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleNavClick('reviews', 'home')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span>Customer Reviews</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => handleNavClick('faq', 'home')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors text-left cursor-pointer"
                >
                  <span>FAQ & Guarantee</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </nav>

              {/* WhatsApp Action */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href="https://wa.me/919854905077?text=Hello%20Quick%20Space%20Shine%2C%20I%20want%20to%20inquire%20about%20your%20deep%20cleaning%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5337E1] hover:bg-[#462ec4] text-white font-extrabold text-xs tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white text-[#5337E1]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};
