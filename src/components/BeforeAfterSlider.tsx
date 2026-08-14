import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal, Flame, Zap } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 5) percentage = 5;
      if (percentage > 95) percentage = 95;
      setSliderPos(percentage);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section id="before-after" className="py-16 lg:py-24 bg-white relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-700 uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-pink-500" />
            <span>Interactive 100°C Steam Power Demonstration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            See The <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">QSS Steam Magic</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Drag the slider to see how our pressurized thermal steam machine melts 3-year-old burnt kitchen grease in seconds.
          </p>
        </div>

        {/* Before / After Slider Box */}
        <div className="max-w-4xl mx-auto w-full px-0 sm:px-2">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[340px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl cursor-ew-resize select-none bg-slate-900 w-full max-w-full"
          >
            {/* AFTER IMAGE STATE (Clean Tiles) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-pink-950 flex flex-col justify-center items-center text-center p-4 sm:p-8">
              {/* Simulated Clean Kitchen Tile Visual */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-80" />
              
              <div className="relative z-10 space-y-2.5 sm:space-y-4 max-w-md">
                <div className="p-2.5 sm:p-4 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 inline-flex shadow-xl shadow-pink-500/20">
                  <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 animate-spin-slow" />
                </div>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight">
                  Sparkling & Sanitized Tiles
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-pink-200 font-medium leading-relaxed max-w-sm mx-auto">
                  100°C Thermal Steam + Shuma Grill completely dissolves oil film, grease lines, and bacteria without damaging grout or cabinet edges.
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-pink-500/20 text-pink-200 text-[10px] sm:text-xs font-bold border border-pink-500/30">
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>100% Oil Free Guarantee</span>
                </div>
              </div>

              {/* Label Badge */}
              <span className="absolute top-3 right-3 sm:top-5 sm:right-5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-pink-500 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-lg">
                AFTER (QSS Clean)
              </span>
            </div>

            {/* BEFORE IMAGE STATE (Greasy Dirty Tiles) - Clipped by Slider Position */}
            <div
              style={{ width: `${sliderPos}%` }}
              className="absolute top-0 left-0 bottom-0 overflow-hidden bg-gradient-to-br from-amber-950 via-slate-950 to-stone-900 border-r border-amber-500/30 flex flex-col justify-center items-center text-center p-4 sm:p-8 z-10"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#78350f_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-60" />
              
              <div className="relative z-10 space-y-2.5 sm:space-y-4 max-w-md w-full">
                <div className="p-2.5 sm:p-4 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 inline-flex">
                  <Flame className="w-6 h-6 sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-amber-200 leading-tight">
                  Sticky Oil & Heavy Grease
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-amber-300/80 font-medium leading-relaxed max-w-sm mx-auto">
                  Everyday cooking leaves oily residue on tiles, exhaust fans, chimney baffle filters & gas stoves that standard soap cannot clean.
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-950/80 text-amber-300 text-[10px] sm:text-xs font-bold border border-amber-800">
                  <span>Normal Wiping Fails</span>
                </div>
              </div>

              {/* Label Badge */}
              <span className="absolute top-3 left-3 sm:top-5 sm:left-5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-900/90 text-amber-200 font-black text-[10px] sm:text-xs uppercase tracking-wider border border-amber-700 shadow-lg">
                BEFORE (Oily Tiles)
              </span>
            </div>

            {/* SLIDER HANDLE DIVISION LINE */}
            <div
              style={{ left: `${sliderPos}%` }}
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 via-white to-rose-400 z-20 shadow-[0_0_15px_rgba(236,72,153,0.8)] pointer-events-none"
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-pink-500 flex items-center justify-center text-pink-600 shadow-2xl">
                <MoveHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

          </div>

          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] sm:text-xs text-slate-500 font-medium px-1 text-center">
            <span>👈 Slide left for BEFORE</span>
            <span className="text-pink-600 font-bold">100°C High-Pressure Thermal Steam Power</span>
            <span>Slide right for AFTER 👉</span>
          </div>
        </div>

      </div>
    </section>
  );
};
