import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Flame, Zap, Droplets, Sparkles, CheckCircle } from 'lucide-react';
import { PROFESSIONAL_SUPPLIES } from '../data/services';

export const ProfessionalSupplies: React.FC = () => {
  return (
    <section id="tools-supplies" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-black" />
            <span>Industrial Grade Technology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Professional Tools & <span className="text-black">Certified Chemicals</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            We bring our own specialized chemicals and heavy-duty steam machinery to deliver a showroom shine.
          </p>
        </div>

        {/* 1. Specialized Chemicals Showcase */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Droplets className="w-5 h-5 text-black" />
            <h3 className="text-xl font-bold text-slate-900">1. Specialized Cleaning Chemicals</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PROFESSIONAL_SUPPLIES.chemicals.map((chem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative rounded-2xl p-6 bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-black text-white shadow-sm">
                    {chem.badge}
                  </span>
                  <ShieldCheck className="w-5 h-5 text-black" />
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-slate-900 group-hover:text-black transition-colors">
                    {chem.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-700 mt-0.5">{chem.type}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {chem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. Heavy Duty Equipment */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Flame className="w-5 h-5 text-black" />
            <h3 className="text-xl font-bold text-slate-900">2. Heavy-Duty Equipment & Tools</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PROFESSIONAL_SUPPLIES.equipment.map((eq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl p-6 bg-white border border-slate-200 shadow-md space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-black">
                  {eq.icon === 'Flame' && <Flame className="w-5 h-5 text-black" />}
                  {eq.icon === 'Zap' && <Zap className="w-5 h-5 text-black" />}
                  {eq.icon === 'Sparkles' && <Sparkles className="w-5 h-5 text-black" />}
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900">{eq.name}</h4>
                  <span className="text-xs font-mono text-slate-500">{eq.type}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {eq.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer Responsibility Notice */}
        <div className="p-6 rounded-2xl bg-slate-100 border border-slate-300 text-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-black" />
            <span>Customer Requirement Note</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
            <strong>Customer to Provide:</strong> High-pressure water outlet and a standard 15A electrical socket near the service area. QSS technicians bring all ladders, microfibers, gloves, vacuum machines & chemical kits.
          </p>
        </div>

      </div>
    </section>
  );
};
