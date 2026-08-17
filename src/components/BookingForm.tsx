import React, { useState, useEffect, useMemo } from 'react';
import {
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
  Sparkles,
  Copy,
  Check,
  CalendarCheck,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { BookingData } from '../types';
import { getKitchenPackage, APPLIANCE_OPTIONS, calculateBathroomTotal } from '../data/services';
import { checkPincodeAvailability } from '../data/pincodes';
import { supabase } from '../lib/supabase';
import { GpsRequiredModal } from './GpsRequiredModal';

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

interface ConfirmedBookingDetails {
  bookingCode: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  servicesList: string[];
  dateSlot: string;
  totalPrice: number;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBookingDetails | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);

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

  // Mandatory Form Field Validation Calculation for Dynamic "Book Now" Button
  const isNameValid = formData.fullName.trim().length >= 2;
  const isMobileValid = /^[6-9]\d{9}$/.test(formData.mobile.replace(/\D/g, ''));
  const isPincodeValid = formData.pincode.length === 6 && checkPincodeAvailability(formData.pincode).isAvailable;
  const isHouseNoValid = formData.houseNo.trim().length > 0;
  const isStreetAreaValid = formData.streetArea.trim().length > 0;
  const isDateTimeValid = !!formData.preferredDate && !!formData.preferredTimeSlot;
  const isGpsCaptured = !!(formData.gpsLocationUrl && formData.gpsCoords);
  const isServiceSelected = !!activeKitchenPkg || selectedAppliances.length > 0 || bathroomCount > 0;

  // Complete Form Validity (All 7 mandatory fields + at least 1 service)
  const isFormValid = useMemo(() => {
    return (
      isNameValid &&
      isMobileValid &&
      isPincodeValid &&
      isHouseNoValid &&
      isStreetAreaValid &&
      isDateTimeValid &&
      isGpsCaptured &&
      isServiceSelected
    );
  }, [
    isNameValid,
    isMobileValid,
    isPincodeValid,
    isHouseNoValid,
    isStreetAreaValid,
    isDateTimeValid,
    isGpsCaptured,
    isServiceSelected,
  ]);

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

        setShowGpsModal(false);

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

    if (!isGpsCaptured) {
      errors.gps = 'GPS location is required';
    }

    if (!kitchenSelected && selectedAppliances.length === 0 && bathroomCount === 0) {
      errors.service = 'Please select at least one service package above before booking.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Direct Supabase Database Booking Submission
  const handleDirectSupabaseBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check GPS First before anything
    if (!isGpsCaptured) {
      setShowGpsModal(true);
      onShowToast(
        'GPS Location Required: Please click "Detect Live GPS Location" and allow browser location access to proceed with your booking.',
        'warning'
      );
      return;
    }

    if (!validateForm()) {
      onShowToast('Please fill all required fields correctly to complete booking.', 'warning');
      return;
    }

    setIsSubmitting(true);

    // Prepare Service Description
    const selectedServicesList: string[] = [];
    let primaryPackageName = '';

    if (activeKitchenPkg) {
      primaryPackageName = activeKitchenPkg.title;
      selectedServicesList.push(`${activeKitchenPkg.title} (₹${activeKitchenPkg.price.toLocaleString('en-IN')})`);
    }
    if (bathroomCount > 0) {
      const bathDesc = `${bathroomCount} x Deep Bathroom Cleaning`;
      if (!primaryPackageName) {
        primaryPackageName = bathDesc;
      } else {
        primaryPackageName += ` + ${bathDesc}`;
      }
      selectedServicesList.push(`${bathDesc} (₹${calculateBathroomTotal(bathroomCount)})`);
    }
    if (!primaryPackageName) {
      primaryPackageName = 'Deep Cleaning Service';
    }

    const applianceNames = selectedAppliances
      .map((id) => APPLIANCE_OPTIONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    if (applianceNames) {
      selectedServicesList.push(`Appliance Add-ons: ${applianceNames}`);
    }

    const fullAddress = [
      `${formData.houseNo}, ${formData.streetArea}`,
      formData.addressLine1,
      formData.addressLine2,
      `Pincode: ${formData.pincode} (${formData.verifiedArea || 'Chennai'})`,
    ]
      .filter(Boolean)
      .join(', ');

    const dateSlot = `${formData.preferredDate} | ${formData.preferredTimeSlot}`;
    const generatedCode = `QSS-${Math.floor(100000 + Math.random() * 900000)}`;

    const bookingPayload = {
      customer_name: formData.fullName.trim(),
      phone_number: formData.mobile.trim(),
      email_address: formData.email.trim() || null,
      house_no: formData.houseNo.trim(),
      street_area: formData.streetArea.trim(),
      pincode: formData.pincode.trim(),
      area_name: formData.verifiedArea || 'Chennai',
      address: fullAddress,
      gps_location: formData.gpsLocationUrl || null,
      package_name: primaryPackageName,
      add_ons: applianceNames || null,
      date_slot: dateSlot,
      preferred_date: formData.preferredDate,
      preferred_time_slot: formData.preferredTimeSlot,
      total_price: totalPrice,
      booking_code: generatedCode,
      status: 'confirmed',
    };

    try {
      const { data, error } = await supabase.from('bookings').insert([bookingPayload]);

      if (error) {
        console.error('Supabase booking insert error:', error);
        alert('Supabase Error: ' + error.message);
        onShowToast('Supabase Error: ' + error.message, 'error');
        return;
      }

      onShowToast(`Booking confirmed! ID: ${generatedCode}`, 'success');

      setConfirmedBooking({
        bookingCode: generatedCode,
        customerName: formData.fullName.trim(),
        phone: formData.mobile.trim(),
        email: formData.email.trim() || undefined,
        address: fullAddress,
        servicesList: selectedServicesList,
        dateSlot,
        totalPrice,
      });
    } catch (err: any) {
      console.error('Supabase exception:', err);
      const errMsg = err?.message || 'Failed to submit booking to database';
      alert('Supabase Error: ' + errMsg);
      onShowToast('Supabase Error: ' + errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    onShowToast('Booking ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResetBooking = () => {
    setConfirmedBooking(null);
    setFormData((prev) => ({
      ...prev,
      fullName: '',
      mobile: '',
      email: '',
      houseNo: '',
      streetArea: '',
      addressLine1: '',
      addressLine2: '',
      gpsCoords: undefined,
      gpsLocationUrl: undefined,
    }));
  };

  return (
    <section id="booking" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* If Booking is Confirmed: Display Rich Confirmation Screen */}
        {confirmedBooking ? (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
              
              {/* Top Success Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Appointment Confirmed & Saved</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Thank You, {confirmedBooking.customerName}!
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto">
                  Your deep cleaning service request has been recorded in our dispatch database. Our verified technician will arrive at your scheduled slot.
                </p>
              </div>

              {/* Booking Reference ID Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Booking Reference ID
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-black tracking-tight">
                    {confirmedBooking.bookingCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(confirmedBooking.bookingCode)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* Order Summary Details Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 pb-2 border-b border-slate-100">
                  Booking Summary Details
                </h3>

                <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-500 font-semibold block text-[11px]">Services Booked</span>
                    {confirmedBooking.servicesList.map((svc, idx) => (
                      <p key={idx} className="font-extrabold text-slate-900">
                        • {svc}
                      </p>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-500 font-semibold block text-[11px]">Appointment Slot</span>
                    <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      <span>{confirmedBooking.dateSlot}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
                    <span className="text-slate-500 font-semibold block text-[11px]">Service Address</span>
                    <p className="font-bold text-slate-800 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                      <span>{confirmedBooking.address}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-semibold block text-[11px]">Total Amount Payable</span>
                      <span className="text-xs text-slate-500 font-medium">Pay after service completion (Cash / UPI)</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-black">
                      ₹{confirmedBooking.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Optional WhatsApp Inquiry */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResetBooking}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-sm cursor-pointer text-center"
                >
                  Book Another Service
                </button>

                <a
                  href={`https://wa.me/919854905077?text=${encodeURIComponent(
                    `Hello Quick Space Shine, I have a question regarding my confirmed booking (${confirmedBooking.bookingCode}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-[#5337E1] text-[#5337E1]" />
                  <span>Support on WhatsApp</span>
                </a>
              </div>

            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900 uppercase tracking-widest">
                <CalendarCheck className="w-3.5 h-3.5 text-black" />
                <span>Instant Database Booking</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                Schedule Your{' '}
                <span className="text-black underline decoration-slate-300">
                  Deep Cleaning
                </span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-medium">
                Fill your contact and location details below. Click &quot;Book Now&quot; to confirm your appointment. Pay after 100% service completion.
              </p>
            </div>

            {/* Main Grid: Left Form, Right Order Summary */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Form (8 Cols) */}
              <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                
                <form onSubmit={handleDirectSupabaseBooking} className="space-y-6">
                  
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
                            placeholder="98765 43210"
                            value={formData.mobile}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mobile: e.target.value.replace(/\D/g, '').slice(0, 10),
                              })
                            }
                            className={`w-full pl-12 pr-10 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
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
                            placeholder="anandan@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Service Location & GPS Detection */}
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <h3 className="text-sm font-extrabold uppercase tracking-widest text-black flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        2. Service Location & Address
                      </h3>

                      {/* Live GPS Detection Button */}
                      <button
                        type="button"
                        onClick={handleDetectGPSLocation}
                        disabled={isDetectingLocation}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-50 ${
                          isGpsCaptured
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/30 hover:bg-[#6366f1]/20 font-black'
                        }`}
                      >
                        {isDetectingLocation ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6366f1]" />
                            <span>Detecting GPS...</span>
                          </>
                        ) : (
                          <>
                            <LocateFixed className="w-3.5 h-3.5 text-[#6366f1]" />
                            <span>{isGpsCaptured ? 'Re-Detect GPS Location' : 'Detect Live GPS Location (Required)'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* GPS Status Banner */}
                    {isGpsCaptured ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold truncate">
                            GPS Verified: {formData.gpsCoords?.latitude.toFixed(4)}, {formData.gpsCoords?.longitude.toFixed(4)}
                          </span>
                        </div>
                        <a
                          href={formData.gpsLocationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-black underline shrink-0 hover:text-emerald-900"
                        >
                          <span>Open Map</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <LocateFixed className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="font-bold">
                            Live GPS Location required before booking confirmation.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleDetectGPSLocation}
                          disabled={isDetectingLocation}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                        >
                          Detect Now
                        </button>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Pincode & Instant Verification */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Chennai Pincode (Service Area) <span className="text-black">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="e.g. 600032"
                            value={formData.pincode}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            onBlur={handlePincodeBlur}
                            className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 transition-all ${
                              formErrors.pincode
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-slate-300 focus:border-black focus:ring-black'
                            }`}
                          />
                          <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                        </div>

                        {/* Instant Pincode Availability Alert */}
                        {formData.pincode.length === 6 && checkPincodeAvailability(formData.pincode).isAvailable && (
                          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>
                                Available in {checkPincodeAvailability(formData.pincode).area} ({formData.pincode})
                              </span>
                            </div>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                              Serviced Area
                            </span>
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
                          House / Flat / Door No. <span className="text-black">*</span>
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
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Colony Name / Street Name / Area <span className="text-black">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Thangalamber Nagar, Near Station"
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

                      {/* Address Line 1 & Line 2 (Optional) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Address Line 1 (Landmark) (Optional)
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

                  {/* Service Selection Error banner if any */}
                  {formErrors.service && (
                    <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-2 text-xs text-amber-800 font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{formErrors.service}</span>
                    </div>
                  )}

                  <div className="pt-2 text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>No advance payment required. Pay after service upon 100% satisfaction!</span>
                  </div>

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
          </>
        )}

      </div>

      {/* GPS Location Required Popup Modal */}
      <GpsRequiredModal
        isOpen={showGpsModal}
        onClose={() => setShowGpsModal(false)}
        onDetectGps={handleDetectGPSLocation}
        isDetecting={isDetectingLocation}
      />

      {/* Sleek Compact Single Sticky Bottom Action Bar for Checkout / Booking Page */}
      {!confirmedBooking && (
        <div
          id="booking-sticky-action-bar"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] py-3 px-4 sm:px-8 transition-all"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
            {/* Left Side: Selected Total Price or Quick Summary */}
            <div className="min-w-0 flex flex-col">
              <div className="flex items-baseline gap-1.5 leading-tight">
                <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Total:
                </span>
                <span className="text-lg sm:text-2xl font-black text-slate-900">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Pay After Service
                </span>
                {!isGpsCaptured && (
                  <span className="hidden sm:inline text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    📍 GPS needed
                  </span>
                )}
              </div>
            </div>

            {/* Right Side: Compact, Rounded "BOOK NOW ->" Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="booking-sticky-submit-btn"
                onClick={(e) => {
                  if (isSubmitting) return;

                  // If GPS is missing or form is incomplete, handle with alert/modal
                  if (!isGpsCaptured) {
                    setShowGpsModal(true);
                    onShowToast(
                      'GPS Location Required: Please click "Detect Live GPS Location" and allow browser location access to proceed with your booking.',
                      'warning'
                    );
                    return;
                  }

                  if (!isFormValid) {
                    if (!isNameValid) {
                      onShowToast('Please enter your Full Name.', 'warning');
                    } else if (!isMobileValid) {
                      onShowToast('Please enter a valid 10-digit Indian Mobile number.', 'warning');
                    } else if (!isPincodeValid) {
                      onShowToast('Please enter a valid 6-digit serviced Chennai pincode.', 'warning');
                    } else if (!isHouseNoValid) {
                      onShowToast('Please enter your House / Flat / Door Number.', 'warning');
                    } else if (!isStreetAreaValid) {
                      onShowToast('Please enter your Colony / Street / Area.', 'warning');
                    } else if (!isServiceSelected) {
                      onShowToast('Please select at least one service package before booking.', 'warning');
                    }
                    return;
                  }

                  // If valid and GPS captured, trigger booking
                  handleDirectSupabaseBooking(e as any);
                }}
                className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-md cursor-pointer select-none ${
                  isFormValid && !isSubmitting
                    ? 'bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-lg shadow-[#6366f1]/30 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-[#524844]/80 hover:bg-[#524844]/90 text-stone-200 border border-stone-600/50 cursor-pointer shadow-none'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : isFormValid ? (
                  <>
                    <span>BOOK NOW</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                ) : (
                  <>
                    {!isGpsCaptured ? (
                      <span>📍 BOOK NOW</span>
                    ) : (
                      <span>BOOK NOW</span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 opacity-80 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

