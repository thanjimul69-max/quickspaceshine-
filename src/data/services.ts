import { ApplianceOption, ServicePackage } from '../types';

export interface KitchenPackageOption {
  id: 'classic' | 'complete';
  title: string;
  subtitle: string;
  price: number;
  badge: string;
  inclusions: string[];
}

export const KITCHEN_PACKAGES: KitchenPackageOption[] = [
  {
    id: 'classic',
    title: 'Classic / Standard Kitchen Cleaning',
    subtitle: 'Exterior deep cleaning & degreasing for cabinets, tiles, slab, sink & exhaust',
    price: 1499,
    badge: 'Standard Clean (Exterior)',
    inclusions: [
      'Cabinet Exterior Only (Cabinets cleaned from outside only)',
      'Kitchen Tiles & Kitchen Slab Deep Cleaning',
      'Window, Sink & Under the Sink Cleaning',
      'Exhaust Fan Cleaning',
      'Kitchen Floor Scrubbing & Mop',
    ],
  },
  {
    id: 'complete',
    title: 'Complete Deep Kitchen Cleaning (Exterior + Interior)',
    subtitle: 'Full interior & exterior cabinet deep scrubbing + 100°C steam degreasing',
    price: 1999,
    badge: 'Most Popular (Exterior + Interior)',
    inclusions: [
      'Cabinet Exterior + Full Interior Cleaning (Inside & Outside)',
      'Kitchen Tiles & Kitchen Slab Deep Cleaning',
      'Window, Sink & Under the Sink Cleaning',
      'Exhaust Fan Cleaning',
      'Kitchen Floor Scrubbing & Mop',
    ],
  },
];

export const getKitchenPackage = (id: 'classic' | 'complete' | string | null | undefined): KitchenPackageOption | null => {
  if (!id) return null;
  return KITCHEN_PACKAGES.find((pkg) => pkg.id === id) || null;
};

export const getKitchenPrice = (id: 'classic' | 'complete' | string | null | undefined): number => {
  const pkg = getKitchenPackage(id);
  return pkg ? pkg.price : 0;
};

export const KITCHEN_PACKAGE: ServicePackage = {
  id: 'kitchen-base',
  title: KITCHEN_PACKAGES[1].title,
  subtitle: KITCHEN_PACKAGES[1].subtitle,
  basePrice: KITCHEN_PACKAGES[1].price,
  badge: KITCHEN_PACKAGES[1].badge,
  inclusions: KITCHEN_PACKAGES[1].inclusions,
};

export const APPLIANCE_OPTIONS: ApplianceOption[] = [
  {
    id: 'fridge-single',
    name: 'Single Door Fridge Cleaning',
    price: 299,
    description: 'Internal & external tray wash, gasket mold removal & odor neutralizer',
    iconName: 'Refrigerator',
    imageUrl: 'https://i.ibb.co/QFtN16F6/file-000000003d5882089987227faa3d727c.png',
    badge: 'Best Fridge Cleaning',
  },
  {
    id: 'fridge-double',
    name: 'Double Door Fridge Cleaning',
    price: 399,
    description: 'Multi-shelf deep wash, freezer defrost stain removal & anti-bacterial wipedown',
    iconName: 'Refrigerator',
    imageUrl: 'https://i.ibb.co/FLHgyDzj/file-00000000c60c82089fbabbcaba8db61d.png',
    badge: 'Popular Choice',
  },
  {
    id: 'fridge-side-by-side',
    name: 'Side by Side Door Fridge Cleaning',
    price: 699,
    description: 'Large capacity multi-tier deep sanitization & deodorization',
    iconName: 'Refrigerator',
    imageUrl: 'https://i.ibb.co/jk0h3tFT/file-000000008194820883a94d63e12f6b68.png',
    badge: 'Multi-tier Clean',
  },
  {
    id: 'chimney',
    name: 'Chimney Deep Degreasing',
    price: 299,
    description: 'Baffle filter chemical soak, oil collector cleaning & motor housing wipedown',
    iconName: 'Wind',
    imageUrl: 'https://i.ibb.co/4gdd5y2c/file-0000000036648211a6847e447180c122.png',
    badge: 'Heavy Oil Removal',
  },
  {
    id: 'microwave',
    name: 'Microwave Oven Cleaning',
    price: 69,
    description: 'Internal food splatter steam clean, glass turntable wash & outer polish',
    iconName: 'Microwave',
    imageUrl: 'https://i.ibb.co/0p4xSK2F/file-000000002b4082088b92a8ae4e31395a.png',
    badge: 'Only ₹69',
  },
];

export const BATHROOM_PACKAGE: ServicePackage = {
  id: 'bathroom-deep',
  title: 'Premium Deep Bathroom Cleaning',
  subtitle: 'Not a Normal Cleaning — High-Pressure Scaled Stain Removal & Disinfection',
  basePrice: 799,
  badge: 'Multi-Bathroom Offer (₹699/ea for 2+)',
  inclusions: [
    'Hard water stain & limescale descaling on wall/floor tiles',
    'Sanitaryware disinfection & toilet bowl deep scrubbing',
    'Shower, taps & chrome fixture polishing with AZI Steel Shiner',
    'Glass shower partition & mirror streak-free wipe',
    'Exhaust fan, ceiling cobweb & door panel cleaning',
    'Grout line deep scrub & anti-fungal odor treatment',
  ],
};

/**
 * Multi-Bathroom Discount Rule:
 * 1 bathroom = ₹799/bathroom
 * 2 or more bathrooms = ₹699/bathroom
 */
export const getBathroomUnitPrice = (count: number): number => {
  return count >= 2 ? 699 : 799;
};

export const calculateBathroomTotal = (count: number): number => {
  if (count <= 0) return 0;
  return count * getBathroomUnitPrice(count);
};

export const PROFESSIONAL_SUPPLIES = {
  chemicals: [
    {
      name: 'Shuma Grill',
      type: 'Industrial Degreaser',
      description: 'Liquefies stubborn chimney oil, burnt stove grease & tile grime instantly.',
      badge: 'Heavy Oil Formula',
      accentColor: 'from-amber-500 to-red-600',
    },
    {
      name: 'Shuma Multi',
      type: 'Multi-Surface Cleaner',
      description: 'pH-balanced surface cleaner safe for modular kitchen laminate, granite & glass.',
      badge: 'Laminate Safe',
      accentColor: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'AZI Steel Shiner',
      type: 'Chrome & Metal Polish',
      description: 'Restores high-gloss mirror shine on stainless steel sinks, taps & handles.',
      badge: 'Mirror Finish',
      accentColor: 'from-emerald-400 to-teal-600',
    },
  ],
  equipment: [
    {
      name: 'Steaming Machine',
      type: '100°C Sterilizer',
      description: 'Pressurized thermal steam kills 99.9% bacteria & melts grease in deep tile crevices without harsh scraping.',
      icon: 'Flame',
    },
    {
      name: 'High-Pressure Spray Gun',
      type: 'Deep Crevice Jet',
      description: 'Blasts out hidden dirt and soap scum from unreachable corners, slider tracks & cabinet hinges.',
      icon: 'Zap',
    },
    {
      name: 'Microfiber Cloths',
      type: 'Scratch-Free Micro-filaments',
      description: 'Zero-scratch lint-free microfiber wipes ensure streak-free glass and mirror polishing.',
      icon: 'Sparkles',
    },
  ],
  customerRequirements: [
    { name: '1 Power Switchboard', detail: 'For high-voltage steam machine operation', icon: 'Zap' },
    { name: '1 Stool / Ladder', detail: 'To reach high cabinet tops & exhaust fans safely', icon: 'Maximize2' },
    { name: '1 Water Bucket', detail: 'For fresh water supply & chemical mixing', icon: 'Droplets' },
  ],
};
