import { getCachedStoreProfile, storeProfileApi } from '@/api/storeProfileApi';

export const VERIFIED_STORE_CONFIG = {
  name: 'Khalil & Sons Jewellers',
  address: 'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi, 74400, Pakistan',
  openingHours: 'Mon–Sat: 2:00 PM – 9:00 PM (Fri: 3:30 PM – 9:30 PM) | Sun: Closed',
  phone: '+92 333 3213613',
  landline: '+92 21 35670868',
  whatsapp: '+92 333 3213613',
  hub: 'Saddar, Karachi'
};

export function getVerifiedStoreProfile() {
  const cached = getCachedStoreProfile();
  if (cached && cached.address) {
    return {
      ...VERIFIED_STORE_CONFIG,
      ...cached
    };
  }
  return VERIFIED_STORE_CONFIG;
}

