import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Navigation,
  Loader2,
  ExternalLink,
  RefreshCw,
  LocateFixed,
} from 'lucide-react';
import { BookingData } from '../types';
import { getKitchenPackage, APPLIANCE_OPTIONS, calculateBathroomTotal, getBathroomUnitPrice } from '../data/services';
import { checkPincodeAvailability } from '../data/pincodes';

interface BookingFormProps {
  verifiedArea: string;
  pincode: string;
  kitchenSelected?: boolean;
  kitchenPackageId?: 'classic' | 'complete' | null;
  selectedAppliances: string[];
  bathroomCount: number;
  onPincodeCheck: (pincode: string) => void;
  onOpenPincodeModal: (code: string) => void;
  onShowToast: (message: string, type?: 'warning' | 'info' | 'error' | 'success') => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  verifiedArea,
  pincode: initialPincode,
  kitchenSelected,
  kitchenPackageId = null,
  selectedAppliances,
  bathroomCount,
  onPincodeCheck,
  onOpenPincodeModal,
  onShowToast,
}) => {
  // Tomorrow's date string format YYYY-MM-DD for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const activeKitchenPkg = getKitchenPackage(kitchenPackageId || (kitchenSelected ? 'complete' : null));

  const [formData, setFormData] = useState<BookingData>({
    pincode: initialPincode || '',
    verifiedArea: verifiedArea || '',
    kitchenSelected: !!activeKitchenPkg,
    selectedAppliances: selectedAppliances,
    bathroomCount: bathroomCount,
    fullName: '',
    mobile: '',
    email: '',
    houseNo: '',
    streetArea: '',
    addressLine1: '',
    addressLine2: '',
    preferredDate: minDateStr,
    preferredTimeSlot: 'Morning (9:00 AM - 12:00 PM)',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      pincode: initialPincode || prev.pincode,
      verifiedArea: verifiedArea || prev.verifiedArea,
      kitchenSelected: !!activeKitchenPkg,
      selectedAppliances,
      bathroomCount,
    }));
  }, [initialPincode, verifiedArea, kitchenPackageId, kitchenSelected, selectedAppliances, bathroomCount]);

  // Live GPS Location Detection via Geolocation API
  const handleDetectGPSLocation = () => {
    if (!navigator.geolocation) {
      const err = 'Geolocation is not supported by your browser/device.';
      setLocationError(err);
      onShowToast(err, 'error');
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        setFormData((prev) => ({
          ...prev,
          gpsCoords: { latitude: lat, longitude: lng },
          gpsLocationUrl: mapsUrl,
        }));

        // Attempt Reverse Geocoding via OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            { headers: { Accept: 'application/json' } }
          );

          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};

            // Extract 6-digit Pincode
            const rawPostcode = (address.postcode || '').replace(/\D/g, '');
            if (rawPostcode && rawPostcode.length === 6) {
              handlePincodeChange(rawPostcode);
            }

            // Extract Street / Locality / Suburb
            const detectedStreet =
              address.road ||
              address.suburb ||
              address.neighbourhood ||
              address.residential ||
              address.village ||
              '';

            const detectedArea = address.suburb || address.city_district || address.city || '';

            setFormData((prev) => ({
              ...prev,
              streetArea: prev.streetArea || detectedStreet,
              addressLine1:
                prev.addressLine1 ||
                (detectedStreet && detectedArea && detectedStreet !== detectedArea
                  ? detectedArea
                  : prev.addressLine1),
            }));
          }
        } catch (e) {
          console.warn('Reverse geocoding fetch error (falling back to coordinates):', e);
        } finally {
          setIsDetectingLocation(false);
          onShowToast('📍 Live GPS coordinates & Google Maps link captured!', 'success');
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        let message = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission was denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Location request timed out. Please try again.';
        }
        setLocationError(message);
        onShowToast(message, 'warning');
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Calculate Total Price
  const calculateTotal = () => {
    let total = 0;
    if (activeKitchenPkg) {
      total += activeKitchenPkg.price;
    }
    selectedAppliances.forEach((appId) => {
      const app = APPLIANCE_OPTIONS.find((a) => a.id === appId);
      if (app) total += app.price;
    });
    if (bathroomCount > 0) {
      total += calculateBathroomTotal(bathroomCount);
    }
    return total;
  };

  const totalPrice = calculateTotal();

  // Validate pincode entered in form
  const handlePincodeChange = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 6);
    
    if (clean.length === 6) {
      const res = checkPincodeAvailability(clean);
      if (res.isAvailable) {
        setFormData((prev) => ({ ...prev, pincode: clean, verifiedArea: res.area }));
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next.pincode;
          return next;
        });
        onPincodeCheck(clean);
      } else {
        setFormData((prev) => ({ ...prev, pincode: clean, verifiedArea: '' }));
        setFormErrors((prev) => ({
          ...prev,
          pincode: '✕ Sorry, service is currently not available in your area. We only service within 25km of Guindy, Chennai.',
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, pincode: clean, verifiedArea: '' }));
      if (formErrors.pincode) {
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next.pincode;
          return next;
        });
      }
    }
  };

  const handlePincodeBlur = () => {
    if (!formData.pincode) return;
    if (formData.pincode.length !== 6) {
      setFormErrors((prev) => ({ ...prev, pincode: 'Please enter a valid 6-digit Pincode' }));
      return;
    }
    const res = checkPincodeAvailability(formData.pincode);
    if (!res.isAvailable) {
      setFormErrors((prev) => ({
        ...prev,
        pincode: '✕ Sorry, service is currently not available in your area. We only service within 25km of Guindy, Chennai.',
      }));
      onOpenPincodeModal(formData.pincode);
    } else {
      setFormData((prev) => ({ ...prev, verifiedArea: res.area }));
      onPincodeCheck(formData.pincode);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.replace(/\D/g, ''))) {
      errors.mobile = 'Valid 10-digit Indian Mobile number is required';
    }

    if (!formData.pincode || formData.pincode.length !== 6) {
      errors.pincode = '6-digit Pincode is required';
    } else {
      const checkRes = checkPincodeAvailability(formData.pincode);
      if (!checkRes.isAvailable) {
        errors.pincode = '✕ Sorry, service is currently not available in your area. We only service within 25km of Guindy, Chennai.';
      }
    }

    if (!formData.houseNo.trim()) {
      errors.houseNo = 'House/Flat No is required';
    }

    if (!formData.streetArea.trim()) {
      errors.streetArea = 'Colony/Street name is required';
    }

    if (!kitchenSelected && selectedAppliances.length === 0 && bathroomCount === 0) {
      errors.service = 'Please select at least one service package above before booking.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // WhatsApp Message Generator & Launcher
  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      onShowToast('Please fill all required fields correctly to complete booking.', 'warning');
      return;
    }

    // Prepare Service Description
    const selectedServicesList: string[] = [];
    if (activeKitchenPkg) {
      selectedServicesList.push(`${activeKitchenPkg.title} (₹${activeKitchenPkg.price.toLocaleString('en-IN')})`);
    }
    if (selectedAppliances.length > 0) {
      const applianceNames = selectedAppliances
        .map((id) => APPLIANCE_OPTIONS.find((a) => a.id === id)?.name)
        .filter(Boolean)
        .join(', ');
      selectedServicesList.push(`Appliance Add-ons: ${applianceNames}`);
    }
    if (bathroomCount > 0) {
      selectedServicesList.push(`${bathroomCount} x Deep Bathroom Cleaning (₹${calculateBathroomTotal(bathroomCount)})`);
    }

    const fullAddress = [
      `${formData.houseNo}, ${formData.streetArea}`,
      formData.addressLine1,
      formData.addressLine2,
      `Pincode: ${formData.pincode} (${formData.verifiedArea || 'Chennai'})`,
    ]
      .filter(Boolean)
      .join('\n');

    const gpsLocationLine = formData.gpsLocationUrl
      ? `\n📍 *Customer GPS Location:* ${formData.gpsLocationUrl}`
      : '';

    const whatsappMsg = `*QUICK SPACE SHINE (QSS) BOOKING REQUEST* 🧹✨
-----------------------------------------
*Customer Name:* ${formData.fullName}
*Mobile Number:* +91 ${formData.mobile}
*Email:* ${formData.email || 'N/A'}

*SERVICE DETAILS:*
${selectedServicesList.map((s) => `• ${s}`).join('\n')}

*TOTAL ESTIMATED PRICE:* ₹${totalPrice.toLocaleString('en-IN')}

*SCHEDULE:*
📅 *Date:* ${formData.preferredDate}
⏰ *Time Slot:* ${formData.preferredTimeSlot}

*LOCATION ADDRESS:*
${fullAddress}${gpsLocationLine}
-----------------------------------------
Please confirm my booking slot. Thank you!`;

    const encodedMsg = encodeURIComponent(whatsappMsg);
    const waUrl = `https://wa.me/919854905077?text=${encodedMsg}`;

    window.open(waUrl, '_blank');
    onShowToast('Redirecting to WhatsApp to send your booking details to QSS!', 'success');
  };

  return (
    <section id="booking" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900 uppercase tracking-widest">
            <MessageSquare className="w-3.5 h-3.5 text-black" />
            <span>Instant Booking Confirmation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Book Your Service On{' '}
            <span className="text-black underline decoration-slate-300">
              WhatsApp
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Fill your contact & location details below. Click &quot;Book Now on WhatsApp&quot; to send pre-filled details to our Chennai dispatch team at +91 9854905077.
          </p>
        </div>

        {/* Main Grid: Left Form, Right Order Summary */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form (8 Cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            
            <form onSubmit={handleWhatsAppBooking} className="space-y-6">
              
              {/* Section 1: Customer Contact Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-black flex items-center gap-2 pb-2 border-b border-slate-200">
                  <User className="w-4 h-4" />
                  1. Contact Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Customer Full Name <span className="text-black">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Anandan Sundaram"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                          formErrors.fullName
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-slate-300 focus:border-black focus:ring-black'
                        }`}
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {formErrors.fullName && (
                      <p className="text-[11px] font-semibold text-red-500 mt-1">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Indian Mobile Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Indian Mobile Number (+91) <span className="text-black">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-bold text-slate-500 pointer-events-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9854905077"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })
                        }
                        className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm font-mono placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                          formErrors.mobile
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-slate-300 focus:border-black focus:ring-black'
                        }`}
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {formErrors.mobile && (
                      <p className="text-[11px] font-semibold text-red-500 mt-1">
                        {formErrors.mobile}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="e.g. mycleanhome@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Address & Pincode */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-black flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    2. Service Address (Chennai)
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Guindy HQ (within 25km radius)
                  </span>
                </div>

                {/* GPS Location Detect Button & Status Area */}
                <div className="space-y-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-md border border-slate-700">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-800 text-slate-200">
                          <Navigation className="w-4 h-4" />
                        </span>
                        <h4 className="text-xs font-black tracking-wide uppercase text-slate-200">
                          Instant Google Maps GPS Pin
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Automatically fetch your exact coordinates & auto-fill address details.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        id="btn-detect-live-gps"
                        onClick={handleDetectGPSLocation}
                        disabled={isDetectingLocation}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[8px] font-extrabold text-xs shadow-sm transition-all duration-200 cursor-pointer ${
                          formData.gpsCoords
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                            : 'bg-[#5337E1] hover:bg-[#462ec4] text-white shadow-[#5337E1]/25 shadow-lg active:scale-95'
                        } ${isDetectingLocation ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        {isDetectingLocation ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Detecting GPS...</span>
                          </>
                        ) : formData.gpsCoords ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Update GPS Pin</span>
                          </>
                        ) : (
                          <>
                            <LocateFixed className="w-3.5 h-3.5" />
                            <span>📍 Use My Live GPS Location (Google Maps)</span>
                          </>
                        )}
                      </button>

                      {formData.gpsLocationUrl && (
                        <a
                          href={formData.gpsLocationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-[8px] bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors"
                          title="Open coordinates in Google Maps in a new tab"
                        >
                          <span>Open Maps</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Captured GPS Details */}
                  {formData.gpsCoords && (
                    <div className="pt-3 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-300">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Coordinates: {formData.gpsCoords.latitude.toFixed(5)}, {formData.gpsCoords.longitude.toFixed(5)}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">
                        ✓ Direct Google Maps link will be attached to WhatsApp request
                      </span>
                    </div>
                  )}

                  {/* Geolocation Error Alert */}
                  {locationError && (
                    <div className="pt-2 border-t border-slate-700/80 flex items-start gap-2 text-amber-300 text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{locationError}</span>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Pincode */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Verified Pincode <span className="text-black">*</span>
                      </label>
                      <span className="text-[10px] font-semibold text-slate-400">
                        25km Radius of Guindy
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 600032"
                        value={formData.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        onBlur={handlePincodeBlur}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm font-mono tracking-wider placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          formData.pincode.length === 6 && checkPincodeAvailability(formData.pincode).isAvailable
                            ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 focus:ring-emerald-500'
                            : formErrors.pincode || (formData.pincode.length === 6 && !checkPincodeAvailability(formData.pincode).isAvailable)
                            ? 'border-rose-500 bg-rose-50/30 text-rose-950 focus:ring-rose-500'
                            : 'border-slate-300 focus:border-black focus:ring-black'
                        }`}
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Green Success Badge */}
                    {formData.pincode.length === 6 && checkPincodeAvailability(formData.pincode).isAvailable && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-emerald-700">✓ Service is available in your area!</p>
                          {formData.verifiedArea && (
                            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                              {formData.verifiedArea}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Red Error Alert */}
                    {(formErrors.pincode || (formData.pincode.length === 6 && !checkPincodeAvailability(formData.pincode).isAvailable)) && (
                      <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-rose-700">✕ Sorry, service is currently not available in your area.</p>
                          <p className="text-[11px] text-rose-600 font-medium mt-0.5">
                            We only service within 25km of Guindy, Chennai.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* House / Flat Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      House / Flat / Door No <span className="text-black">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 3B, New Pearl Apts"
                      value={formData.houseNo}
                      onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                        formErrors.houseNo
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 focus:border-black focus:ring-black'
                      }`}
                    />
                    {formErrors.houseNo && (
                      <p className="text-[11px] font-semibold text-red-500 mt-1">
                        {formErrors.houseNo}
                      </p>
                    )}
                  </div>

                  {/* Colony / Street Name / Area */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Colony Name / Street Name / Area <span className="text-black">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Thangalamber Nagar, Near Guindy Railway Station"
                      value={formData.streetArea}
                      onChange={(e) => setFormData({ ...formData, streetArea: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                        formErrors.streetArea
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 focus:border-black focus:ring-black'
                      }`}
                    />
                    {formErrors.streetArea && (
                      <p className="text-[11px] font-semibold text-red-500 mt-1">
                        {formErrors.streetArea}
                      </p>
                    )}
                  </div>

                  {/* Address Line 1 & Line 2 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Address Line 1 (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Main Road / Landmark"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Floor / Additional Notes"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Date & Time Picker */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-black flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Calendar className="w-4 h-4" />
                  3. Preferred Date & Time Slot
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Service Date <span className="text-black">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={minDateStr}
                        value={formData.preferredDate}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredDate: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      />
                    </div>
                  </div>

                  {/* Time Slot Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Time Slot <span className="text-black">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.preferredTimeSlot}
                        onChange={(e) =>
                          setFormData({ ...formData, preferredTimeSlot: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                      >
                        <option value="Morning (9:00 AM - 12:00 PM)">
                          Morning (9:00 AM - 12:00 PM)
                        </option>
                        <option value="Afternoon (12:00 PM - 3:00 PM)">
                          Afternoon (12:00 PM - 3:00 PM)
                        </option>
                        <option value="Evening (3:00 PM - 6:00 PM)">
                          Evening (3:00 PM - 6:00 PM)
                        </option>
                      </select>
                      <Clock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              {formErrors.service && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-2 text-xs text-amber-800 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{formErrors.service}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-[8px] bg-[#5337E1] hover:bg-[#462ec4] text-white font-extrabold text-base uppercase tracking-wider shadow-lg shadow-[#5337E1]/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 fill-white text-[#5337E1]" />
                <span>Book Now on WhatsApp (+91 9854905077)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-xs text-slate-500 font-medium">
                ⚡ No advance payment required. Pay after service upon 100% satisfaction!
              </p>

            </form>

          </div>

          {/* Right Column: Live Order Summary Card (4 Cols) */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-black text-slate-900">Booking Summary</h3>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-300">
                  Live Calculator
                </span>
              </div>

              {/* Selected Items Breakdown */}
              <div className="space-y-3 text-xs">
                {activeKitchenPkg && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900">{activeKitchenPkg.title}</h4>
                      <p className="text-[11px] text-slate-500">{activeKitchenPkg.subtitle}</p>
                    </div>
                    <span className="font-extrabold text-black text-sm">₹{activeKitchenPkg.price.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {selectedAppliances.map((appId) => {
                  const app = APPLIANCE_OPTIONS.find((a) => a.id === appId);
                  if (!app) return null;
                  return (
                    <div key={appId} className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-700 font-medium">+ {app.name}</span>
                      <span className="font-extrabold text-black">₹{app.price}</span>
                    </div>
                  );
                })}

                {bathroomCount > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900">Deep Bathroom Cleaning</h4>
                      <p className="text-[11px] text-slate-500">
                        {bathroomCount} x Bathroom Unit(s) {bathroomCount >= 2 ? '(@ ₹699/ea)' : '(@ ₹799/ea)'}
                      </p>
                    </div>
                    <span className="font-extrabold text-black text-sm">
                      ₹{calculateBathroomTotal(bathroomCount)}
                    </span>
                  </div>
                )}

                {!kitchenSelected && bathroomCount === 0 && (
                  <div className="py-6 text-center text-slate-400 italic">
                    No services selected yet. Please pick kitchen or bathroom package above.
                  </div>
                )}
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Calculated Total
                  </span>
                  <span className="text-3xl font-black text-black">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Includes chemical costs, machinery usage & technician travel within Chennai.
                </p>
              </div>

              {/* Location Badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-black shrink-0" />
                <span>
                  Dispatching from <strong className="text-slate-900">Guindy HQ (600032)</strong>
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
