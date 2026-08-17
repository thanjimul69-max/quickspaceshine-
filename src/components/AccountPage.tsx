import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Edit3,
  Calendar,
  Headphones,
  ShieldCheck,
  MapPin,
  CreditCard,
  Settings as SettingsIcon,
  Info,
  ChevronRight,
  Gift,
  Share2,
  Copy,
  Check,
  X,
  Plus,
  Trash2,
  MessageSquare,
  Clock,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';
import { AppNavPage, UserProfile, SavedAddress } from '../types';
import { supabase } from '../lib/supabase';

interface AccountPageProps {
  onNavigate: (page: AppNavPage) => void;
  onShowToast: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;
}

interface BookingRecord {
  id?: string;
  booking_code: string;
  customer_name: string;
  phone_number: string;
  package_name: string;
  add_ons?: string | null;
  date_slot: string;
  total_price: number;
  status: string;
  address?: string;
  created_at?: string;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, onShowToast }) => {
  // User Profile State (persisted in localStorage)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('qss_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: 'Thanjimul',
      phone: '+91 98549 05077',
      email: 'thanjimul69@gmail.com',
      isProfileComplete: true,
    };
  });

  // Saved Addresses State
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    const saved = localStorage.getItem('qss_saved_addresses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'addr-1',
        tag: 'Home',
        houseNo: 'No. 14/B, 2nd Floor',
        streetArea: 'Thangalamber Nagar, Guindy',
        pincode: '600032',
        areaName: 'Guindy / Thangalamber Nagar',
        isDefault: true,
      },
      {
        id: 'addr-2',
        tag: 'Work',
        houseNo: 'Block 4, Tech Park',
        streetArea: 'OMR IT Corridor, Sholinganallur',
        pincode: '600119',
        areaName: 'Sholinganallur / OMR',
        isDefault: false,
      },
    ];
  });

  // Modals state
  const [activeModal, setActiveModal] = useState<
    'editProfile' | 'myBookings' | 'addresses' | 'help' | 'plans' | 'about' | 'payment' | 'settings' | null
  >(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editEmail, setEditEmail] = useState(profile.email);

  // New Address Form State
  const [newAddrTag, setNewAddrTag] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrHouse, setNewAddrHouse] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('600032');
  const [newAddrArea, setNewAddrArea] = useState('Guindy');

  // Bookings list state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [hasCopiedRef, setHasCopiedRef] = useState(false);

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      onShowToast('Please enter your full name', 'warning');
      return;
    }
    const updated: UserProfile = {
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      isProfileComplete: true,
    };
    setProfile(updated);
    localStorage.setItem('qss_user_profile', JSON.stringify(updated));
    setActiveModal(null);
    onShowToast('Profile details updated successfully!', 'success');
  };

  // Add new address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrHouse.trim() || !newAddrStreet.trim()) {
      onShowToast('Please fill in complete address details', 'warning');
      return;
    }
    const newAddr: SavedAddress = {
      id: 'addr-' + Date.now(),
      tag: newAddrTag,
      houseNo: newAddrHouse.trim(),
      streetArea: newAddrStreet.trim(),
      pincode: newAddrPincode.trim() || '600032',
      areaName: newAddrArea.trim() || 'Chennai',
      isDefault: addresses.length === 0,
    };
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    localStorage.setItem('qss_saved_addresses', JSON.stringify(updated));
    setNewAddrHouse('');
    setNewAddrStreet('');
    onShowToast('Address added to your saved list', 'success');
  };

  // Delete address
  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('qss_saved_addresses', JSON.stringify(updated));
    onShowToast('Address removed', 'info');
  };

  // Set default address
  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    localStorage.setItem('qss_saved_addresses', JSON.stringify(updated));
    onShowToast('Default address updated', 'success');
  };

  // Fetch recent bookings from Supabase
  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Supabase fetch error, using local fallback:', error);
        // Fallback sample bookings if table is fresh
        setBookings([
          {
            booking_code: 'QSS-600032',
            customer_name: profile.name,
            phone_number: profile.phone,
            package_name: 'Complete Kitchen Steam Deep Clean',
            add_ons: 'Single Door Fridge, Microwave Interior',
            date_slot: 'Tomorrow, 10:00 AM - 01:00 PM',
            total_price: 3497,
            status: 'confirmed',
            address: 'No. 14/B, 2nd Floor, Thangalamber Nagar, Guindy (600032)',
          },
        ]);
      } else if (data && data.length > 0) {
        setBookings(data);
      } else {
        // Sample default booking
        setBookings([
          {
            booking_code: 'QSS-882194',
            customer_name: profile.name,
            phone_number: profile.phone,
            package_name: 'Complete Kitchen Steam Deep Clean',
            add_ons: 'Chimney Filter Degreasing',
            date_slot: 'Confirmed Service Slot',
            total_price: 2999,
            status: 'confirmed',
            address: 'Guindy HQ Service Area, Chennai 600032',
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleOpenMyBookings = () => {
    setActiveModal('myBookings');
    fetchBookings();
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('QSS-SHINE300');
    setHasCopiedRef(true);
    onShowToast('Referral code QSS-SHINE300 copied to clipboard!', 'success');
    setTimeout(() => setHasCopiedRef(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Get ₹300 OFF on your first 140°C steam-powered deep cleaning in Chennai with Quick Space Shine. Use code *QSS-SHINE300* at checkout: https://ais-dev-fvwb4o5kiutr5fagcwmqk6-300707778863.asia-southeast1.run.app`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const userInitial = profile.name ? profile.name.trim().charAt(0).toUpperCase() : 'Q';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-20 sm:pt-24 pb-28 sm:pb-32 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-5">
        
        {/* Top Navigation Bar with Back Button */}
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs tracking-wide hover:bg-slate-100 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Account & Profile
          </span>
        </div>

        {/* 1. TOP SECTION: URBAN COMPANY STYLE PROFILE CARD */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
          {/* Subtle Background Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            {/* Left: User Avatar + Details */}
            <div className="flex items-center gap-4">
              {/* Avatar Circle */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-white shrink-0">
                {userInitial}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Check className="w-2.5 h-2.5 stroke-[3]" /> Verified
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 mt-1">
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {profile.phone}
                  </span>
                  {profile.email && (
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {profile.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Edit Profile Button */}
            <button
              type="button"
              onClick={() => {
                setEditName(profile.name);
                setEditPhone(profile.phone);
                setEditEmail(profile.email);
                setActiveModal('editProfile');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs tracking-wide transition-all border border-slate-200 shadow-2xs cursor-pointer shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-700" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* 2. QUICK ACTION CARDS GRID (Urban Company prominent action boxes) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: My Bookings */}
          <button
            type="button"
            onClick={handleOpenMyBookings}
            id="account-quick-bookings-btn"
            className="flex flex-col items-start justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-900 flex items-center justify-center transition-colors mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-slate-900 group-hover:text-black">
                My Bookings
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                Track status & slot history
              </div>
            </div>
          </button>

          {/* Card 2: Help & Support */}
          <button
            type="button"
            onClick={() => setActiveModal('help')}
            id="account-quick-help-btn"
            className="flex flex-col items-start justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-900 flex items-center justify-center transition-colors mb-3">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-slate-900 group-hover:text-black">
                Help & Support
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                24x7 WhatsApp & Call assistance
              </div>
            </div>
          </button>
        </div>

        {/* 3. VERTICAL MENU LIST (Urban Company Style) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
          
          {/* Menu Item: My Service Plans */}
          <button
            type="button"
            onClick={() => setActiveModal('plans')}
            className="w-full flex items-center justify-between p-4 sm:p-4.5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 group-hover:text-black block leading-tight">
                  My Service Plans & AMC
                </span>
                <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                  Biannual & Annual Steam Cleaning Care
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
          </button>

          {/* Menu Item: Manage Addresses */}
          <button
            type="button"
            onClick={() => setActiveModal('addresses')}
            className="w-full flex items-center justify-between p-4 sm:p-4.5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 group-hover:text-black block leading-tight">
                  Manage Addresses
                </span>
                <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                  {addresses.length} saved Chennai address{addresses.length === 1 ? '' : 'es'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
          </button>

          {/* Menu Item: Payment Methods */}
          <button
            type="button"
            onClick={() => setActiveModal('payment')}
            className="w-full flex items-center justify-between p-4 sm:p-4.5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 group-hover:text-black block leading-tight">
                  Payment Methods
                </span>
                <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                  Pay After Service, UPI & Cards
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
          </button>

          {/* Menu Item: Settings */}
          <button
            type="button"
            onClick={() => setActiveModal('settings')}
            className="w-full flex items-center justify-between p-4 sm:p-4.5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <SettingsIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 group-hover:text-black block leading-tight">
                  Settings & Preferences
                </span>
                <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                  Notifications & WhatsApp booking alerts
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
          </button>

          {/* Menu Item: About Quick Space Shine */}
          <button
            type="button"
            onClick={() => setActiveModal('about')}
            className="w-full flex items-center justify-between p-4 sm:p-4.5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 group-hover:text-black block leading-tight">
                  About Quick Space Shine
                </span>
                <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                  Chennai Steam Cleaning, Guindy HQ
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
          </button>

          {/* Menu Item: Contact Us */}
          <a
            href="https://wa.me/919854905077?text=Hello%20Quick%20Space%20Shine%2C%20I%20have%20an%20inquiry%20regarding%20my%20account%20or%20booking."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-4 sm:p-4.5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 group-hover:text-black block leading-tight">
                  Contact Us
                </span>
                <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                  Direct WhatsApp (+91 98549 05077)
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
          </a>

        </div>

        {/* 4. REFER & EARN BANNER (Urban Company Style) */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Gift className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-md border border-amber-400/30 mb-1.5">
                <Sparkles className="w-2.5 h-2.5" /> Refer & Earn ₹300
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                Invite friends & get ₹300 OFF
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Share your referral link. When your friend books their first steam cleaning session, you both get ₹300 credited.
              </p>

              {/* Referral Code & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-4">
                {/* Code Box */}
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md">
                  <span className="font-mono font-extrabold text-sm tracking-wider text-amber-300">
                    QSS-SHINE300
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    className="ml-3 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {hasCopiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedRef ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* WhatsApp Share Button */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#5337E1] hover:bg-[#462ec4] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Assurance Pill */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">100% Quality & Hygiene Re-Clean Guarantee</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Guindy, Chennai</span>
        </div>

      </div>

      {/* ===================== MODALS & DRAWERS ===================== */}

      {/* 1. EDIT PROFILE MODAL */}
      {activeModal === 'editProfile' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  placeholder="+91 98549 05077"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black text-sm font-semibold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MY BOOKINGS DRAWER / MODAL */}
      {activeModal === 'myBookings' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">My Bookings</h3>
                  <p className="text-[11px] text-slate-500">Track current and past steam cleaning requests</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bookings List */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              {isLoadingBookings ? (
                <div className="py-12 text-center text-slate-400 text-sm font-semibold">
                  Loading bookings from database...
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">No bookings found yet</p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      onNavigate('home');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Book a Steam Clean Now
                  </button>
                </div>
              ) : (
                bookings.map((b, idx) => (
                  <div
                    key={b.booking_code || idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {b.booking_code}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {b.status || 'Confirmed'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">
                        {b.package_name}
                      </h4>
                      {b.add_ons && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          <span className="font-semibold text-slate-700">Add-ons:</span> {b.add_ons}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.date_slot}</span>
                      </div>
                      {b.address && (
                        <div className="flex items-start gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="truncate">{b.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-xs font-bold text-slate-500">Pay on completion:</span>
                      <span className="text-base font-black text-slate-900">
                        ₹{Number(b.total_price || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">Need to reschedule?</span>
              <a
                href="https://wa.me/919854905077?text=Hello%20Quick%20Space%20Shine%2C%20I%20want%20to%20reschedule%20my%20booking."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5337E1] hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Support</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. MANAGE ADDRESSES MODAL */}
      {activeModal === 'addresses' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Saved Addresses</h3>
                  <p className="text-[11px] text-slate-500">Manage your Chennai service locations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Existing Addresses */}
              <div className="space-y-2.5">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                          {addr.tag}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[11px] font-bold text-slate-500 hover:text-black cursor-pointer"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-800 mt-2">
                      {addr.houseNo}, {addr.streetArea}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {addr.areaName} - {addr.pincode}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add New Address Accordion / Form */}
              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
                  + Add New Address
                </h4>
                <form onSubmit={handleAddAddress} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {(['Home', 'Work', 'Other'] as const).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setNewAddrTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer ${
                          newAddrTag === tag
                            ? 'bg-slate-950 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="House / Flat / Door No., Building Name"
                    value={newAddrHouse}
                    onChange={(e) => setNewAddrHouse(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  />

                  <input
                    type="text"
                    placeholder="Street, Landmark, Locality"
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Area (e.g. Guindy)"
                      value={newAddrArea}
                      onChange={(e) => setNewAddrArea(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                      type="text"
                      placeholder="Pincode (600032)"
                      value={newAddrPincode}
                      onChange={(e) => setNewAddrPincode(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                  >
                    Save This Address
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. HELP & SUPPORT MODAL */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-slate-900" />
                <h3 className="text-lg font-black text-slate-900">Help & Support Desk</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We provide rapid Chennai customer support. Reach out for slot reschedule, custom appliance queries, or booking guidance.
            </p>

            <div className="space-y-2.5">
              <a
                href="https://wa.me/919854905077?text=Hello%20Quick%20Space%20Shine%2C%20I%20need%20assistance%20with%20my%20service."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-950">WhatsApp Support (Fastest)</div>
                    <div className="text-[11px] text-emerald-800 font-medium">+91 98549 05077</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-700" />
              </a>

              <a
                href="tel:+919854905077"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Direct Phone Call</div>
                    <div className="text-[11px] text-slate-600 font-medium">8:00 AM - 9:00 PM Daily</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </a>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">QSS Guindy HQ Office:</span>
              <span>Thangalamber Nagar, Guindy, Chennai, Tamil Nadu - 600032</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. SERVICE PLANS / AMC MODAL */}
      {activeModal === 'plans' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-slate-900">Annual Steam Care Plans</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Keep your home permanently oil-free, grease-free, and sanitized year-round with our discounted subscription plans.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900">Biannual Kitchen Steam AMC</span>
                  <span className="text-xs font-black text-amber-950">₹4,999 / yr</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  2 Full 140°C Kitchen deep cleans + 2 complimentary chimney degreasings every 6 months.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300">Complete Home Steam Pass</span>
                  <span className="text-xs font-black text-white">₹8,999 / yr</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  4 Kitchen deep cleans + 8 Bathroom steam sanitizations with priority weekend slots.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/919854905077?text=Hello%20Quick%20Space%20Shine%2C%20I%20am%20interested%20in%20Annual%20Steam%20Care%20Plans."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* 6. PAYMENT METHODS MODAL */}
      {activeModal === 'payment' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Payment Methods</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="font-black block">✓ Pay After Service Policy:</span>
              <span>
                Zero advance payment required! Pay only after inspecting our 140°C steam cleaning results with your own eyes.
              </span>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Google Pay / PhonePe / Paytm (UPI)</span>
                <span className="text-emerald-700 font-bold">Supported</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Credit & Debit Cards (Tap & Pay)</span>
                <span className="text-emerald-700 font-bold">Supported</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span>Direct Cash on Hand</span>
                <span className="text-emerald-700 font-bold">Supported</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. SETTINGS MODAL */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-black text-slate-900">Settings & Notifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">WhatsApp Booking Confirmations</span>
                  <span className="text-[11px] text-slate-500">Get automated slot details & supervisor contact</span>
                </div>
                <input type="checkbox" defaultChecked className="accent-black w-4 h-4 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Service Reminders</span>
                  <span className="text-[11px] text-slate-500">Alert 2 hours before our team arrives</span>
                </div>
                <input type="checkbox" defaultChecked className="accent-black w-4 h-4 cursor-pointer" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                onShowToast('Preferences saved', 'success');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 8. ABOUT MODAL */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">About Quick Space Shine</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Quick Space Shine (QSS)</strong> is Chennai’s specialized deep cleaning company, headquartered in Guindy. We replace traditional wiping with pressurized 140°C dry-steam machines, certified industrial degreasers (Taski R-Series / Diversey), and verified cleaning technicians.
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">HQ:</span>
                <span className="text-slate-900 font-semibold">Guindy, Chennai (600032)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Equipment:</span>
                <span className="text-slate-900 font-semibold">High-Bar Italian Dry Steam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Standard:</span>
                <span className="text-slate-900 font-semibold">100% Quality Re-Clean Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
