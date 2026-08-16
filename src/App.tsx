import React, { useState, useEffect, useCallback } from 'react';
import { ToastMessage } from './types';
import { checkPincodeAvailability } from './data/pincodes';
import { getKitchenPackage, APPLIANCE_OPTIONS } from './data/services';
import { ToastContainer } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceSelector } from './components/ServiceSelector';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { ProfessionalSupplies } from './components/ProfessionalSupplies';
import { BookingForm } from './components/BookingForm';
import { Reviews } from './components/Reviews';
import { Founder } from './components/Founder';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { StickyCartBar } from './components/StickyCartBar';
import { PincodeModal } from './components/PincodeModal';
import { KitchenPackageModal } from './components/KitchenPackageModal';
import { BathroomPackageModal } from './components/BathroomPackageModal';
import { KitchenDetailView } from './components/KitchenDetailView';
import { BathroomDetailView } from './components/BathroomDetailView';

interface AppHistoryState {
  page: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking';
  kitchenStep: 1 | 2 | 3;
  modal: 'kitchen' | 'bathroom' | 'pincode' | null;
}

export default function App() {
  // Navigation View State ('home' | 'kitchenDetail' | 'bathroomDetail' | 'booking')
  const [currentPage, setCurrentPage] = useState<'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking'>('home');
  const [kitchenStep, setKitchenStep] = useState<1 | 2 | 3>(1);

  // Pincode Verification State (Defaults to Guindy HQ 600032)
  const [pincode, setPincode] = useState('600032');
  const [verifiedArea, setVerifiedArea] = useState('Guindy / Thangalamber Nagar (QSS HQ)');

  // Selected Services State (Defaults to NONE selected = ₹0 total on initial load)
  const [kitchenPackageId, setKitchenPackageId] = useState<'classic' | 'complete' | null>(null);
  const [isKitchenModalOpen, setIsKitchenModalOpen] = useState(false);
  const [isBathroomModalOpen, setIsBathroomModalOpen] = useState(false);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [bathroomCount, setBathroomCount] = useState<number>(0);

  // Modal & Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [modalCheckCode, setModalCheckCode] = useState('');

  // 1. Initialize History State on Mount & Register popstate Listener
  useEffect(() => {
    // Ensure the initial history entry has our structured state
    const initialState: AppHistoryState = {
      page: 'home',
      kitchenStep: 1,
      modal: null,
    };

    if (!window.history.state || !window.history.state.page) {
      window.history.replaceState(initialState, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      const state: AppHistoryState | null = event.state;
      if (state) {
        setCurrentPage(state.page || 'home');
        setKitchenStep(state.kitchenStep || 1);
        setIsKitchenModalOpen(state.modal === 'kitchen');
        setIsBathroomModalOpen(state.modal === 'bathroom');
        setPincodeModalOpen(state.modal === 'pincode');
      } else {
        // Fallback if state is empty: gracefully revert to safe Home state without exiting site
        setCurrentPage('home');
        setKitchenStep(1);
        setIsKitchenModalOpen(false);
        setIsBathroomModalOpen(false);
        setPincodeModalOpen(false);
        window.history.replaceState(initialState, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = (message: string, type: 'warning' | 'info' | 'error' | 'success' = 'info') => {
    const newToast: ToastMessage = {
      id: Date.now().toString() + Math.random().toString(),
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // View Navigation Handler with History Push
  const handleNavigate = useCallback((view: 'home' | 'kitchenDetail' | 'bathroomDetail' | 'booking') => {
    const nextStep: 1 | 2 | 3 = view === 'kitchenDetail' && currentPage !== 'kitchenDetail' ? 1 : kitchenStep;
    
    // Close any open modals
    setIsKitchenModalOpen(false);
    setIsBathroomModalOpen(false);
    setPincodeModalOpen(false);

    if (view === 'kitchenDetail' && currentPage !== 'kitchenDetail') {
      setKitchenStep(1);
    }
    setCurrentPage(view);

    // Push new history state
    const nextState: AppHistoryState = {
      page: view,
      kitchenStep: nextStep,
      modal: null,
    };
    window.history.pushState(nextState, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, kitchenStep]);

  // Kitchen Step Change with History Push
  const handleKitchenStepChange = useCallback((step: 1 | 2 | 3) => {
    setKitchenStep(step);
    const nextState: AppHistoryState = {
      page: 'kitchenDetail',
      kitchenStep: step,
      modal: null,
    };
    window.history.pushState(nextState, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Modal Open Handlers with History Push
  const handleOpenKitchenModal = useCallback(() => {
    setIsKitchenModalOpen(true);
    const nextState: AppHistoryState = {
      page: currentPage,
      kitchenStep,
      modal: 'kitchen',
    };
    window.history.pushState(nextState, '');
  }, [currentPage, kitchenStep]);

  const handleCloseKitchenModal = useCallback(() => {
    if (window.history.state?.modal === 'kitchen') {
      window.history.back();
    } else {
      setIsKitchenModalOpen(false);
    }
  }, []);

  const handleOpenBathroomModal = useCallback(() => {
    setIsBathroomModalOpen(true);
    const nextState: AppHistoryState = {
      page: currentPage,
      kitchenStep,
      modal: 'bathroom',
    };
    window.history.pushState(nextState, '');
  }, [currentPage, kitchenStep]);

  const handleCloseBathroomModal = useCallback(() => {
    if (window.history.state?.modal === 'bathroom') {
      window.history.back();
    } else {
      setIsBathroomModalOpen(false);
    }
  }, []);

  const handleOpenPincodeModal = useCallback((code?: string) => {
    if (code) setModalCheckCode(code);
    setPincodeModalOpen(true);
    const nextState: AppHistoryState = {
      page: currentPage,
      kitchenStep,
      modal: 'pincode',
    };
    window.history.pushState(nextState, '');
  }, [currentPage, kitchenStep]);

  const handleClosePincodeModal = useCallback(() => {
    if (window.history.state?.modal === 'pincode') {
      window.history.back();
    } else {
      setPincodeModalOpen(false);
    }
  }, []);

  // Verify Pincode handler
  const handleVerifyPincode = (code: string) => {
    const res = checkPincodeAvailability(code);
    if (res.isAvailable) {
      setPincode(res.code);
      setVerifiedArea(res.area);
      showToast(`Service is available in ${res.area} (${res.code})!`, 'success');
    } else {
      handleOpenPincodeModal(code);
    }
  };

  // Select / Change / Remove Kitchen Package
  const handleSelectKitchenPackage = (packageId: 'classic' | 'complete' | null) => {
    setKitchenPackageId(packageId);
    if (packageId === null) {
      if (selectedAppliances.length > 0) {
        setSelectedAppliances([]);
        showToast('Appliance add-ons removed because Kitchen Package was unselected.', 'info');
      } else {
        showToast('Kitchen package removed from cart.', 'info');
      }
    } else {
      const pkg = getKitchenPackage(packageId);
      if (pkg) {
        showToast(`${pkg.title} (₹${pkg.price.toLocaleString('en-IN')}) added to booking!`, 'success');
      }
      setIsKitchenModalOpen(false);
      setKitchenStep(1);
      setCurrentPage('kitchenDetail');

      const nextState: AppHistoryState = {
        page: 'kitchenDetail',
        kitchenStep: 1,
        modal: null,
      };
      window.history.pushState(nextState, '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle Kitchen Package (opens bottom sheet modal if adding or changing)
  const handleToggleKitchen = (selected: boolean) => {
    if (!selected) {
      handleSelectKitchenPackage(null);
    } else {
      handleOpenKitchenModal();
    }
  };

  // Toggle Appliance Add-on with Rule Enforcement
  const handleToggleAppliance = (applianceId: string) => {
    if (!kitchenPackageId) {
      handleOpenKitchenModal();
      showToast('Please select a Kitchen Package first before adding extra appliance care.', 'info');
      return;
    }

    const appliance = APPLIANCE_OPTIONS.find((a) => a.id === applianceId);
    const applianceName = appliance ? appliance.name : 'Appliance add-on';

    if (selectedAppliances.includes(applianceId)) {
      setSelectedAppliances((prev) => prev.filter((id) => id !== applianceId));
      showToast(`${applianceName} removed from booking`, 'info');
    } else {
      setSelectedAppliances((prev) => [...prev, applianceId]);
      showToast(`${applianceName} added to booking!`, 'success');
    }
  };

  // Clear Cart Helper
  const handleClearCart = () => {
    setKitchenPackageId(null);
    setSelectedAppliances([]);
    setBathroomCount(0);
    showToast('Cart cleared', 'info');
  };

  // Scroll Helper
  const scrollToSection = (id: string) => {
    if (id === 'booking') {
      handleNavigate('booking');
      return;
    }
    if (currentPage !== 'home') {
      handleNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-slate-900 font-sans selection:bg-black selection:text-white relative">
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Navigation Bar */}
      <Navbar
        verifiedArea={verifiedArea}
        pincode={pincode}
        onOpenPincodeChecker={() => handleVerifyPincode(pincode || '600032')}
        onScrollToSection={scrollToSection}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      {/* Main Content Area */}
      <main id="main-content" className="w-full max-w-full">
        {/* Main View Router */}
        {currentPage === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              verifiedArea={verifiedArea}
              pincode={pincode}
              onVerifyPincode={handleVerifyPincode}
              onScrollToSection={scrollToSection}
              onNavigate={handleNavigate}
              onOpenKitchenModal={handleOpenKitchenModal}
            />

            {/* Primary Service Cards ("Complete Kitchen Cleaning" and "Bathroom Cleaning") */}
            <ServiceSelector
              kitchenSelected={!!kitchenPackageId}
              kitchenPackageId={kitchenPackageId}
              selectedAppliances={selectedAppliances}
              bathroomCount={bathroomCount}
              onToggleKitchen={handleToggleKitchen}
              onSelectKitchenPackage={handleSelectKitchenPackage}
              onOpenKitchenModal={handleOpenKitchenModal}
              onOpenBathroomModal={handleOpenBathroomModal}
              onToggleAppliance={handleToggleAppliance}
              onChangeBathroomCount={setBathroomCount}
              onShowToast={showToast}
              onScrollToBooking={() => handleNavigate('booking')}
            />

            {/* Meet The Founder Section */}
            <Founder onScrollToBooking={() => handleNavigate('booking')} />

            {/* Chennai Verified Reviews */}
            <Reviews />

            {/* FAQ Accordion */}
            <FAQ />
          </>
        )}

        {currentPage === 'booking' && (
          <div className="min-h-[80vh] pt-20 sm:pt-24 pb-12 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 mb-6">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all shadow-sm cursor-pointer"
              >
                <span>&larr; Back to Cleaning Services</span>
              </button>
            </div>

            <BookingForm
              verifiedArea={verifiedArea}
              pincode={pincode}
              kitchenSelected={!!kitchenPackageId}
              kitchenPackageId={kitchenPackageId}
              selectedAppliances={selectedAppliances}
              bathroomCount={bathroomCount}
              onPincodeCheck={handleVerifyPincode}
              onOpenPincodeModal={(code) => handleOpenPincodeModal(code)}
              onShowToast={showToast}
            />
          </div>
        )}

        {currentPage === 'kitchenDetail' && (
          <KitchenDetailView
            kitchenSelected={!!kitchenPackageId}
            kitchenPackageId={kitchenPackageId}
            selectedAppliances={selectedAppliances}
            currentStep={kitchenStep}
            onStepChange={handleKitchenStepChange}
            onToggleKitchen={handleToggleKitchen}
            onOpenKitchenModal={handleOpenKitchenModal}
            onSelectKitchenPackage={handleSelectKitchenPackage}
            onToggleAppliance={handleToggleAppliance}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'bathroomDetail' && (
          <BathroomDetailView
            bathroomCount={bathroomCount}
            onChangeBathroomCount={setBathroomCount}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {/* Footer */}
        <Footer
          onScrollToSection={scrollToSection}
          onOpenPincodeChecker={() => handleVerifyPincode(pincode || '600032')}
        />
      </main>

      {/* Sticky Bottom Cart Bar */}
      <StickyCartBar
        kitchenPackageId={kitchenPackageId}
        selectedAppliances={selectedAppliances}
        bathroomCount={bathroomCount}
        currentPage={currentPage}
        kitchenStep={kitchenStep}
        onKitchenStepChange={handleKitchenStepChange}
        onScrollToBooking={() => handleNavigate('booking')}
        onNavigate={handleNavigate}
        onClearCart={handleClearCart}
      />

      {/* Unserviced Pincode Modal */}
      <PincodeModal
        isOpen={pincodeModalOpen}
        pincode={modalCheckCode}
        onClose={handleClosePincodeModal}
        onShowToast={showToast}
      />

      {/* Kitchen Package Bottom Sheet Modal */}
      <KitchenPackageModal
        isOpen={isKitchenModalOpen}
        selectedPackageId={kitchenPackageId}
        onClose={handleCloseKitchenModal}
        onSelectPackage={handleSelectKitchenPackage}
      />

      {/* Bathroom Package Bottom Sheet Modal */}
      <BathroomPackageModal
        isOpen={isBathroomModalOpen}
        bathroomCount={bathroomCount}
        onClose={handleCloseBathroomModal}
        onChangeBathroomCount={setBathroomCount}
        onProceedToBooking={() => handleNavigate('booking')}
        onShowToast={showToast}
      />

    </div>
  );
}


