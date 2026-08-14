import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Sparkles, Menu, X, ShieldCheck } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('home');
    }
    onScrollToSection('hero');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 border-b border-pink-700/50 shadow-md backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/95 rounded-2xl p-1 shadow-md shadow-pink-900/10 border border-white/40 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-white transition-all duration-300">
            <img
              src="https://i.ibb.co/vvDgLjFN/20260814-044815.png"
              alt="Quick Space Shine Logo"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = 'https://i.ibb.co/rfvT5wjB/20260814-044815.png';
              }}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-pink-100 transition-colors leading-tight">
                Quick Space Shine
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-black px-1.5 py-0.5 bg-white/20 text-white rounded-md border border-white/30 backdrop-blur-sm shrink-0">
                QSS
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-pink-100 font-medium hidden sm:block leading-tight mt-0.5">
              Clean Kitchen. Better Life.
            </p>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-pink-50">
          <button
            onClick={() => {
              if (onNavigate) onNavigate('home');
              onScrollToSection('services');
            }}
            className="hover:text-white transition-colors py-2 cursor-pointer"
          >
            Packages & Add-ons
          </button>
          <button
            onClick={() => onScrollToSection('before-after')}
            className="hover:text-white transition-colors py-2 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-pink-200" />
            Steam Magic
          </button>
          <button
            onClick={() => onScrollToSection('tools-supplies')}
            className="hover:text-white transition-colors py-2"
          >
            Chemicals & Tools
          </button>
          <button
            onClick={() => {
              if (onNavigate) onNavigate('home');
              onScrollToSection('founder');
            }}
            className="hover:text-white transition-colors py-2 cursor-pointer"
          >
            Meet Founder
          </button>
          <button
            onClick={() => onScrollToSection('reviews')}
            className="hover:text-white transition-colors py-2 cursor-pointer"
          >
            Chennai Reviews
          </button>
        </nav>

        {/* Right CTA Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pincode Pill (Desktop only) */}
          <button
            onClick={onOpenPincodeChecker}
            className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold border border-white/30 bg-white/15 text-white hover:bg-white/25 transition-all backdrop-blur-md cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-pink-100 shrink-0" />
            <span>
              {verifiedArea ? `${pincode} (${verifiedArea.split(' ')[0]})` : 'Check Pincode'}
            </span>
            {verifiedArea && <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />}
          </button>

          {/* WhatsApp Pill Button (Visible on all screens, positioned right beside Hamburger on mobile) */}
          <a
            href="https://wa.me/919854905077?text=Hello%20Quick%20Space%20Shine%2C%20I%20want%20to%20inquire%20about%20cleaning%20services."
            target="_blank"
            rel="noopener noreferrer"
            id="header-whatsapp-btn"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-xs tracking-wide shadow-md shadow-emerald-950/20 border border-emerald-400/40 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
            aria-label="Contact Quick Space Shine on WhatsApp"
            title="Chat on WhatsApp (+91 9854905077)"
          >
            {/* WhatsApp Logo SVG */}
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-white shrink-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="hidden xl:inline">Contact Now on WhatsApp (+91 9854905077)</span>
            <span className="hidden sm:inline xl:hidden">Contact (+91 9854905077)</span>
            <span className="inline sm:hidden">Contact Us</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-pink-700/40 bg-pink-600 px-4 pt-4 pb-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-pink-500/50">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPincodeChecker();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-xs font-extrabold text-white w-full justify-center"
            >
              <MapPin className="w-4 h-4 text-pink-100" />
              <span>
                {verifiedArea ? `Servicing: ${pincode} (${verifiedArea})` : 'Verify Pincode Coverage'}
              </span>
            </button>
          </div>

          <div className="flex flex-col space-y-3 text-sm font-bold text-white">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSection('services');
              }}
              className="text-left py-2 hover:text-pink-200"
            >
              Services & Appliance Add-ons
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSection('before-after');
              }}
              className="text-left py-2 hover:text-pink-200 flex items-center justify-between"
            >
              <span>Steam Cleaning Magic</span>
              <span className="text-xs font-extrabold text-pink-700 bg-white px-2 py-0.5 rounded border border-white">
                100°C Steam
              </span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSection('tools-supplies');
              }}
              className="text-left py-2 hover:text-pink-200"
            >
              Professional Chemicals & Tools
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSection('founder');
              }}
              className="text-left py-2 hover:text-pink-200 cursor-pointer"
            >
              Meet The Founder
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSection('reviews');
              }}
              className="text-left py-2 hover:text-pink-200 cursor-pointer"
            >
              Chennai Reviews
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="https://wa.me/919854905077?text=Hello%20Quick%20Space%20Shine%2C%20I%20want%20to%20inquire%20about%20cleaning%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm shadow-lg transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-white shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Contact on WhatsApp (+91 9854905077)</span>
            </a>
            <a
              href="tel:+919854905077"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white font-bold text-xs"
            >
              <Phone className="w-4 h-4 text-pink-100" />
              <span>Direct Phone Call</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
