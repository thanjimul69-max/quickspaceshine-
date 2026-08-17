import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { getKitchenPrice, APPLIANCE_OPTIONS, calculateBathroomTotal } from '../data/services';

interface StickyCartBarProps {
  kitchenPackageId: 'classic' | 'complete' | null;
  selectedAppliances: string[];
  bathroomCount: number;
  currentPage?: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking';
  kitchenStep?: 1 | 2 | 3;
  onKitchenStepChange?: (step: 1 | 2 | 3) => void;
  onScrollToBooking: () => void;
  onNavigate?: (page: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking') => void;
  onClearCart?: () => void;
}

export const StickyCartBar: React.FC<StickyCartBarProps> = ({
  kitchenPackageId,
  selectedAppliances,
  bathroomCount,
  currentPage = 'home',
  kitchenStep = 1,
  onKitchenStepChange,
  onScrollToBooking,
  onNavigate,
  onClearCart,
}) => {
  // If already on the booking page, hide the bottom cart bar to avoid redundancy with the form submit button
  if (currentPage === 'booking') {
    return null;
  }

  // Calculate items count
  const hasKitchen = kitchenPackageId !== null;
  const kitchenItemsCount = (hasKitchen ? 1 : 0) + selectedAppliances.length;
  const bathroomItemsCount = bathroomCount > 0 ? 1 : 0;
  const totalItemsCount = kitchenItemsCount + bathroomItemsCount;

  // Categories count
  const categoriesCount = (kitchenItemsCount > 0 ? 1 : 0) + (bathroomItemsCount > 0 ? 1 : 0);

  // Completely HIDE / REMOVE when no items are selected
  const isVisible = totalItemsCount > 0;

  // Dynamic button handler for detail views
  const handleButtonClick = () => {
    if (currentPage === 'kitchenDetail') {
      if (kitchenStep === 1) {
        if (onKitchenStepChange) onKitchenStepChange(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (kitchenStep === 2) {
        if (onKitchenStepChange) onKitchenStepChange(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onScrollToBooking();
      }
    } else if (currentPage === 'home') {
      if (onNavigate) {
        if (kitchenItemsCount > 0) {
          onNavigate('kitchenDetail');
        } else if (bathroomItemsCount > 0) {
          onNavigate('bathroomDetail');
        } else {
          onScrollToBooking();
        }
      } else {
        onScrollToBooking();
      }
    } else {
      onScrollToBooking();
    }
  };

  // Dynamic button label strictly per step flow
  const getButtonLabel = () => {
    if (currentPage === 'kitchenDetail') {
      if (kitchenStep === 1) {
        return 'View Cart';
      }
      if (kitchenStep === 2) {
        return 'View Summary';
      }
      return 'Add Address & Slot';
    }
    if (currentPage === 'bathroomDetail') {
      return 'Add Address & Slot';
    }
    return 'View';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* 1. URBAN COMPANY STYLE HOME SCREEN FLOATING CART BAR */}
          {currentPage === 'home' ? (
            <motion.div
              key="floating-home-cart-bar"
              initial={{ y: 80, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-[380px] z-50 bg-slate-900 text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-700/80 backdrop-blur-xl flex items-center justify-between gap-3"
            >
              {/* Left Info: Cart Icon + Item & Category Count */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-white/10 text-white shrink-0 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-white leading-tight truncate">
                    {totalItemsCount} {totalItemsCount === 1 ? 'item in cart' : 'items in cart'}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 leading-tight truncate mt-0.5">
                    From {categoriesCount} {categoriesCount === 1 ? 'category' : 'categories'}
                  </div>
                </div>
              </div>

              {/* Right Action: Prominent "View" Button + Dismiss (✕) Icon */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleButtonClick}
                  className="px-4 py-2 rounded-xl bg-[#5337E1] hover:bg-[#462ec4] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                {/* Dismiss (✕) Icon Button: Clears Cart */}
                {onClearCart && (
                  <button
                    onClick={onClearCart}
                    className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
                    title="Clear cart"
                    aria-label="Clear cart"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            /* 2. PRICE-FREE STICKY BOTTOM BAR FOR DETAIL / STEP PAGES */
            <motion.div
              key="sticky-step-cart-bar"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-40 px-4 py-2.5 sm:py-3 bg-white/95 border-t border-slate-200 backdrop-blur-md shadow-lg"
            >
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                {/* Left Info: Clean Item Count Only (NO PRICE) */}
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                    {totalItemsCount} {totalItemsCount === 1 ? 'item added' : 'items added'}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block leading-tight mt-0.5">
                    Pay after service completion
                  </span>
                </div>

                {/* Right Clean Action Button */}
                <button
                  onClick={handleButtonClick}
                  className="px-5 sm:px-6 py-2.5 sm:py-2.5 rounded-lg bg-[#5337E1] hover:bg-[#462ec4] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02] active:scale-98 flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>{getButtonLabel()}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};



