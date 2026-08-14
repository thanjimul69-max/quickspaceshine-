import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { getKitchenPrice, APPLIANCE_OPTIONS, calculateBathroomTotal } from '../data/services';

interface StickyCartBarProps {
  kitchenPackageId: 'classic' | 'complete' | null;
  selectedAppliances: string[];
  bathroomCount: number;
  currentPage?: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking';
  kitchenStep?: 1 | 2 | 3;
  onKitchenStepChange?: (step: 1 | 2 | 3) => void;
  onScrollToBooking: () => void;
}

export const StickyCartBar: React.FC<StickyCartBarProps> = ({
  kitchenPackageId,
  selectedAppliances,
  bathroomCount,
  currentPage = 'home',
  kitchenStep = 1,
  onKitchenStepChange,
  onScrollToBooking,
}) => {
  // If already on the booking page, hide the bottom cart bar to avoid redundancy with the form submit button
  if (currentPage === 'booking') {
    return null;
  }

  // Calculate total price dynamically
  let total = 0;
  if (kitchenPackageId) {
    total += getKitchenPrice(kitchenPackageId);
  }
  selectedAppliances.forEach((id) => {
    const app = APPLIANCE_OPTIONS.find((a) => a.id === id);
    if (app) total += app.price;
  });
  if (bathroomCount > 0) {
    total += calculateBathroomTotal(bathroomCount);
  }

  // Count items
  const totalItemsCount =
    (kitchenPackageId ? 1 : 0) + selectedAppliances.length + (bathroomCount > 0 ? 1 : 0);

  // Completely HIDE / REMOVE when total is 0 or no items are selected
  const isVisible = total > 0 && totalItemsCount > 0;

  // Dynamic button handler
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
    } else {
      onScrollToBooking();
    }
  };

  // Dynamic button label
  const getButtonLabel = () => {
    if (currentPage === 'kitchenDetail') {
      if (kitchenStep === 1) {
        return 'CONTINUE';
      }
      if (kitchenStep === 2) {
        return selectedAppliances.length > 0 ? 'CONTINUE TO SUMMARY' : 'SKIP & CONTINUE';
      }
      return 'COMPLETE BOOKING';
    }
    if (currentPage === 'bathroomDetail') {
      return 'CONTINUE TO BOOKING';
    }
    return 'VIEW CART & BOOK';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="sticky-cart-bar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-white/95 border-t border-slate-200/90 backdrop-blur-xl shadow-2xl"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
            
            {/* Left Total Info */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                    {totalItemsCount} {totalItemsCount === 1 ? 'Service' : 'Items'} Selected
                  </span>
                </div>
                
                <div className="text-xl sm:text-2xl font-black text-pink-600 tracking-tight leading-tight mt-0.5">
                  ₹{total.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <button
              onClick={handleButtonClick}
              className="px-6 sm:px-8 py-3.5 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-[#5337E1]/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>{getButtonLabel()}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

