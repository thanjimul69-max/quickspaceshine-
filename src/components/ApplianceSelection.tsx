import React from 'react';
import { Sparkles, Check, Plus, Refrigerator, Wind, Microwave, ArrowRight } from 'lucide-react';
import { APPLIANCE_OPTIONS } from '../data/services';

interface ApplianceSelectionProps {
  selectedAppliances: string[];
  onToggleAppliance: (id: string) => void;
  onSkip?: () => void;
  onShowToast?: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;
  isKitchenSelected?: boolean;
}

export const ApplianceSelection: React.FC<ApplianceSelectionProps> = ({
  selectedAppliances,
  onToggleAppliance,
  onSkip,
  onShowToast,
  isKitchenSelected = true,
}) => {
  const getApplianceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Refrigerator':
        return <Refrigerator className="w-6 h-6 text-pink-600" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-pink-600" />;
      case 'Microwave':
        return <Microwave className="w-6 h-6 text-pink-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-pink-600" />;
    }
  };

  const selectedCount = selectedAppliances.length;
  const selectedTotal = selectedAppliances.reduce((acc, id) => {
    const item = APPLIANCE_OPTIONS.find((a) => a.id === id);
    return acc + (item ? item.price : 0);
  }, 0);

  const handleCardClick = (id: string) => {
    const isSelected = selectedAppliances.includes(id);
    onToggleAppliance(id);
    if (onShowToast) {
      const item = APPLIANCE_OPTIONS.find((a) => a.id === id);
      if (item) {
        if (!isSelected) {
          onShowToast(`Added ${item.name} (+₹${item.price})`, 'success');
        } else {
          onShowToast(`Removed ${item.name}`, 'info');
        }
      }
    }
  };

  return (
    <div className="my-8 rounded-3xl p-1 bg-gradient-to-br from-pink-200 via-rose-100 to-pink-50 shadow-xl">
      <div className="rounded-[22px] bg-white border border-slate-200 p-4 sm:p-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Appliance Care Add-ons</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Add Appliances (Optional)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Urban Company style deep sanitization for fridge, chimney & microwave
            </p>
          </div>

          {/* Quick Skip or Proceed Button */}
          {onSkip && (
            <button
              onClick={onSkip}
              className="self-start sm:self-auto px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <span>{selectedCount > 0 ? 'Proceed to Booking' : 'Skip Add-ons'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clean Responsive Multi-Column Grid Layout (No side-scroller) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {APPLIANCE_OPTIONS.map((appliance) => {
            const isSelected = selectedAppliances.includes(appliance.id);
            const isMicrowave = appliance.id === 'microwave';

            return (
              <div
                key={appliance.id}
                onClick={() => handleCardClick(appliance.id)}
                className={`group relative rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer select-none flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-pink-50/40 border-pink-500 shadow-xl shadow-pink-500/10 ring-2 ring-pink-500/20'
                    : 'bg-white border-slate-200 hover:border-pink-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Image Container with Badge Overlay */}
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  {appliance.imageUrl ? (
                    <img
                      src={appliance.imageUrl}
                      alt={appliance.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (appliance.id.includes('fridge')) {
                          target.src = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80';
                        } else if (appliance.id === 'chimney') {
                          target.src = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80';
                        } else if (appliance.id === 'microwave') {
                          target.src = 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=600&q=80';
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-pink-500 bg-pink-50">
                      {getApplianceIcon(appliance.iconName)}
                    </div>
                  )}

                  {/* Badge Overlay */}
                  {appliance.badge && (
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${
                          isMicrowave
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white animate-pulse'
                            : 'bg-slate-900/90 backdrop-blur-md text-pink-300 border border-slate-700'
                        }`}
                      >
                        {appliance.badge}
                      </span>
                    </div>
                  )}

                  {/* Selected Pill on Top Right */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-slate-900 leading-snug group-hover:text-pink-600 transition-colors">
                    {appliance.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {appliance.description}
                  </p>
                </div>

                {/* Bottom Action Row with Pink/Red #E11D48 Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add-on Price</span>
                    <span className="text-xl font-black text-pink-600">
                      +₹{appliance.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Pink/Red Accent #E11D48 '+ ADD' Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(appliance.id);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md ${
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 ring-2 ring-emerald-400/30'
                        : 'bg-[#E11D48] hover:bg-rose-700 text-white shadow-rose-600/25 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>+ ADD</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Footer / Proceed Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <span>
              {selectedCount > 0
                ? `${selectedCount} Appliance${selectedCount > 1 ? 's' : ''} Selected (+₹${selectedTotal.toLocaleString('en-IN')})`
                : 'No extra appliances selected (Optional)'}
            </span>
          </div>

          {onSkip && (
            <button
              onClick={onSkip}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{selectedCount > 0 ? 'Proceed with Selected Add-ons' : 'Skip & Continue to Booking'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
