import React, { useState, useEffect, useRef } from 'react';
import { Phone, MessageSquare, MapPin, Sparkles, Menu, X, ShieldCheck, MoreVertical, Flame, Star, ChevronRight, HelpCircle, UserCheck } from 'lucide-react';

interface NavbarProps {
  verifiedArea: string;
  pincode: string;
  onOpenPincodeChecker: () => void;
  onScrollToSection: (id: string) => void;
  onNavigate?: (view: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  verifiedArea,
  pincode,
  onOpenPincodeChecker,
  onScrollToSection,
  onNavigate,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <header
      id="main-navbar"
      style={{ position: 'sticky', top: 0, zIndex: 1000 }}
      className="w-full bg-white border-b border-slate-200/80 shadow-xs transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        
        {/* 1. Left: Company Logo (Qs) + Company Name ("quick space shine") */}
        <a
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          id="navbar-brand-logo"
        >
          {/* Logo container */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 shadow-xs group-hover:border-black group-hover:shadow-md transition-all duration-300 overflow-hidden">
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
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-black transition-colors leading-tight lowercase">
                quick space shine
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300 uppercase tracking-wider hidden xs:inline-block">
                QSS
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide hidden sm:block">
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
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs tracking-wide shadow-sm hover:shadow-md shadow-emerald-600/20 border border-emerald-500/50 transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap cursor-pointer"
            aria-label="Chat on WhatsApp"
            title="Chat with Quick Space Shine on WhatsApp"
          >
            {/* WhatsApp Logo SVG */}
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="font-extrabold text-xs">WhatsApp</span>
          </a>

          {/* Three-Dot / Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            id="navbar-menu-toggle"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer"
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
            <div className="absolute top-14 sm:top-16 right-4 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              
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

              {/* Call Action */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href="tel:+919854905077"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs tracking-wide transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call +91 9854905077</span>
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};
