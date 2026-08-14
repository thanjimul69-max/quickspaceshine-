import { PincodeInfo } from '../types';

export const CHENNAI_25KM_PINCODES: string[] = [
  // Center & Immediate Area (0-5 km)
  '600032', '600015', '600016', '600088', '600083', '600085', '600033',

  // North & West Directions (Up to 25 km)
  '600024', '600078', '600092', '600106', '600107', '600095', '600037', 
  '600053', '600080', '600054', '600040', '600101',

  // Central & East Directions (Up to 20 km)
  '600018', '600034', '600004', '600006', '600028', '600086', '600002', 
  '600005', '600014', '600010', '600031', '600020', '600025',

  // South & OMR/ECR IT Corridor (Up to 25 km)
  '600042', '600091', '600096', '600097', '600113', '600041', '600100', 
  '600119', '600126', '600117', '600044', '600045', '600059', '600063', 
  '600064', '600073',
];

export const SERVICED_PINCODES: Record<string, string> = {
  // Center & Immediate Area (0-5 km)
  '600032': 'Guindy / Ekkattuthangal / Ambal Nagar (QSS HQ)',
  '600015': 'Saidapet',
  '600016': 'St. Thomas Mount',
  '600088': 'Adambakkam',
  '600083': 'Ashok Nagar',
  '600085': 'KK Nagar',
  '600033': 'West Mambalam',

  // North & West Directions (Up to 25 km)
  '600024': 'Kodambakkam',
  '600078': 'Vadapalani',
  '600092': 'Koyambedu / Virugambakkam',
  '600106': 'Arumbakkam',
  '600107': 'Koyambedu Wholesale / Maduravoyal',
  '600095': 'Maduravoyal / Porur',
  '600037': 'Mogappair / JJ Nagar',
  '600053': 'Ambattur',
  '600080': 'Ambattur OT',
  '600054': 'Avadi',
  '600040': 'Anna Nagar West',
  '600101': 'Mogappair East',

  // Central & East Directions (Up to 20 km)
  '600018': 'Teynampet / Alwarpet',
  '600034': 'Nungambakkam',
  '600004': 'Mylapore',
  '600006': 'Thousand Lights / Greams Road',
  '600028': 'RA Puram / Mandaveli',
  '600086': 'Gopalapuram / Cathedral Road',
  '600002': 'Anna Salai / Mount Road',
  '600005': 'Triplicane / Marina',
  '600014': 'Royapettah',
  '600010': 'Kilpauk',
  '600031': 'Chetpet',
  '600020': 'Adyar',
  '600025': 'Anna University / Kotturpuram',

  // South & OMR/ECR IT Corridor (Up to 25 km)
  '600042': 'Velachery',
  '600091': 'Madipakkam',
  '600096': 'Perungudi',
  '600097': 'Thoraipakkam',
  '600113': 'Taramani',
  '600041': 'Thiruvanmiyur',
  '600100': 'Medavakkam',
  '600119': 'Sholinganallur',
  '600126': 'Navalur / Semmancheri',
  '600117': 'Keelkattalai / Kovilambakkam',
  '600044': 'Chromepet',
  '600045': 'Tambaram West',
  '600059': 'Tambaram East / Selaiyur',
  '600063': 'Perungalathur',
  '600064': 'Pallavaram',
  '600073': 'Vandalur / Camp Road',
};

export const checkPincodeAvailability = (pincode: string): PincodeInfo => {
  const cleanCode = pincode.trim();
  const isAvailable = CHENNAI_25KM_PINCODES.includes(cleanCode);
  const areaName = SERVICED_PINCODES[cleanCode] || (isAvailable ? 'Chennai (within 25km radius)' : '');

  return {
    code: cleanCode,
    area: areaName,
    isAvailable,
  };
};
