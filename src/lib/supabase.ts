import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://leeslbkeytedkwaxcwbn.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_DrXnjoICSuQ4HO6iZhBrJg_7kMLuPsE';

function sanitizeUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== 'string') return DEFAULT_SUPABASE_URL;
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.startsWith('MY_') || (!trimmed.startsWith('http://') && !trimmed.startsWith('https://'))) {
    return DEFAULT_SUPABASE_URL;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_SUPABASE_URL;
}

function sanitizeKey(rawKey: unknown): string {
  if (typeof rawKey !== 'string') return DEFAULT_SUPABASE_KEY;
  const trimmed = rawKey.trim();
  if (!trimmed || trimmed.startsWith('MY_') || trimmed.length < 10) {
    return DEFAULT_SUPABASE_KEY;
  }
  return trimmed;
}

const targetUrl = sanitizeUrl(import.meta.env.VITE_SUPABASE_URL);
const targetKey = sanitizeKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

let supabaseClient: SupabaseClient;
try {
  supabaseClient = createClient(targetUrl, targetKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
} catch (e) {
  console.warn('Failed to initialize primary Supabase client, falling back to default:', e);
  supabaseClient = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const supabase = supabaseClient;

export interface BookingRecord {
  id?: string;
  booking_code?: string;
  customer_name: string;
  phone_number: string;
  email_address?: string | null;
  address: string;
  house_no?: string;
  street_area?: string;
  pincode: string;
  area_name?: string;
  gps_location?: string | null;
  package_name: string;
  add_ons?: string | null;
  date_slot: string;
  preferred_date?: string;
  preferred_time_slot?: string;
  total_price: number;
  status?: string;
  created_at?: string;
}

