import React from 'react';
import { Award, Zap, MapPin, Sparkles, ShieldCheck, HeartHandshake, CheckCircle2, MessageSquare } from 'lucide-react';

interface FounderProps {
  onScrollToBooking?: () => void;
}

export const Founder: React.FC<FounderProps> = ({ onScrollToBooking }) => {
  return (
    <section id="founder" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-pink-50/40 relative overflow-hidden border-t border-slate-200">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-100/60 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-100/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Eyebrow */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-black text-pink-700 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Our Story & Vision</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Meet The{' '}
            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              Founder
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            The dedication, passion, and standards powering Chennai's most trusted deep cleaning service.
          </p>
        </div>

        {/* Founder Feature Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Founder Photo & Visual Card */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative group">
                {/* Decorative Soft Glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-pink-500/20 via-rose-400/20 to-emerald-400/20 opacity-60 blur-lg group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Photo Frame Card Container */}
                <div className="relative w-52 h-56 sm:w-60 sm:h-64 md:w-64 md:h-72 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-pink-100 shadow-xl bg-slate-100 flex items-center justify-center">
                  <img
                    src="https://i.ibb.co/DqjbsJG/IMG-20260814-084320.jpg"
                    alt="Quick Space Shine Founder"
                    className="w-full h-full object-cover object-top rounded-2xl shadow-md hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                </div>

                {/* Verified Shield Badge on Image */}
                <div className="absolute -bottom-2 right-2 sm:bottom-1 sm:right-3 bg-emerald-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Title & Organization Under Photo */}
              <div className="mt-5 space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Quick Space Shine
                </h3>
                <p className="text-xs sm:text-sm font-bold text-pink-600">
                  Founder & Operations Head — Quick Space Shine
                </p>
                <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-500" />
                  <span>Guindy / Ekkattuthangal, Chennai</span>
                </div>
              </div>
            </div>

            {/* Right Column: Founder Story & Trust Highlights */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Quote & Story */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  <span>Personal Commitment to Cleanliness</span>
                </div>

                <blockquote className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
                  &ldquo;With over <span className="font-extrabold text-slate-900">3 years of hands-on experience</span> in professional deep cleaning and steam disinfection services in Chennai, I founded <span className="font-extrabold text-pink-600">Quick Space Shine</span> with a single mission — to bring standard, transparent, and 100% hygienic cleaning to homes. We don&apos;t just surface-clean; we treat your home with the care, science, and detail it deserves.&rdquo;
                </blockquote>
              </div>

              {/* Badges & Trust Highlights (3 Pills as requested) */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                
                {/* Badge 1 */}
                <div className="p-3.5 rounded-2xl bg-pink-50/80 border border-pink-200/80 flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="p-2 rounded-xl bg-pink-600 text-white shrink-0 shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">3+ Years</h4>
                    <p className="text-[11px] font-medium text-slate-600 leading-tight">Cleaning Expertise in Chennai</p>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">100% Guaranteed</h4>
                    <p className="text-[11px] font-medium text-slate-600 leading-tight">Pay After Satisfaction</p>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Guindy HQ</h4>
                    <p className="text-[11px] font-medium text-slate-600 leading-tight">25km Chennai Service Radius</p>
                  </div>
                </div>

              </div>

              {/* Values Checklist & Direct Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>European Steam Machines & Certified Shuma Chemicals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>In-house trained, verified, and uniformed cleaning experts</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/919854905077?text=Hello%20Quick%20Space%20Shine%2C%20I%20want%20to%20inquire%20about%20cleaning%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white shrink-0" />
                    <span>Talk to Founder</span>
                  </a>
                  {onScrollToBooking && (
                    <button
                      onClick={onScrollToBooking}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>Book Service</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
