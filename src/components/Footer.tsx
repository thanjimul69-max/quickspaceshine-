import React from 'react';
import { MapPin, Phone, MessageSquare, Sparkles } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onOpenPincodeChecker?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs pt-16 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white p-1 shadow-md border border-slate-200">
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
              <div>
                <h3 className="text-base font-black text-slate-900">Quick Space Shine</h3>
                <p className="text-[11px] text-black font-bold">Clean Kitchen. Better Life.</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed max-w-sm font-medium">
              Chennai&apos;s premier steam-powered deep cleaning service for kitchens and bathrooms. High-temperature 100°C sterilization, industrial degreasers & pay-after-satisfaction guarantee.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <MapPin className="w-4 h-4 text-black shrink-0" />
                <span>Head Office Location:</span>
              </div>
              <p className="text-slate-700 pl-6 font-semibold">
                Quick Space Shine, Ambal Nagar, Ekkattuthangal, Guindy, Chennai - 600032, Tamil Nadu
              </p>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-900">
              Services & Info
            </h4>
            <ul className="space-y-2 font-semibold">
              <li>
                <button
                  onClick={() => onScrollToSection('services')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Complete Kitchen Cleaning (₹1,999)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('services')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Appliance Add-ons (Fridge, Chimney, Microwave)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('services')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Premium Deep Bathroom Cleaning (₹799 / ₹699)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('before-after')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Steam Machine Technology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('founder')}
                  className="hover:text-black transition-colors cursor-pointer text-black font-semibold"
                >
                  Meet The Founder & Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('reviews')}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Chennai Customer Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & WhatsApp (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-900">
              Direct Contact / WhatsApp
            </h4>

            <p className="text-slate-600 font-medium">
              Need instant booking assistance or custom commercial cleaning quotes? Speak with our Guindy dispatch lead directly:
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href="https://wa.me/919854905077?text=Hi%20Quick%20Space%20Shine!%20I%20would%20like%20to%20book%20a%20cleaning%20service."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-extrabold uppercase text-xs tracking-wider shadow-lg shadow-[#5337E1]/20 hover:scale-105 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white text-[#5337E1]" />
                <span>WhatsApp: +91 9854905077</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Quick Space Shine (QSS). All rights reserved.</p>
          <p className="flex items-center gap-1 font-semibold">
            <span>Clean Kitchen. Better Life.</span>
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </p>
        </div>

      </div>
    </footer>
  );
};
