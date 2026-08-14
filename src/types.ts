export interface PincodeInfo {
  code: string;
  area: string;
  isAvailable: boolean;
}

export interface ApplianceOption {
  id: string;
  name: string;
  price: number;
  description: string;
  iconName: string;
  imageUrl?: string;
  badge?: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  subtitle: string;
  basePrice: number;
  badge?: string;
  inclusions: string[];
}

export interface BookingData {
  pincode: string;
  verifiedArea: string;
  kitchenSelected: boolean;
  selectedAppliances: string[]; // appliance ids
  bathroomCount: number; // 0 if none
  fullName: string;
  mobile: string;
  email: string;
  houseNo: string;
  streetArea: string;
  addressLine1: string;
  addressLine2: string;
  preferredDate: string;
  preferredTimeSlot: string;
  gpsLocationUrl?: string;
  gpsCoords?: { latitude: number; longitude: number };
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}
