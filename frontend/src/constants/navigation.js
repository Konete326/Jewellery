import { STORE_INFO } from './storeInfo';

export const NAV_LINKS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'products', label: 'Collections', path: '/gallery' },
  { id: 'about', label: 'About Us', path: '/about' },
  { id: 'contact', label: 'Contact', path: '/contact' }
];

export const BRAND_INFO = {
  name: STORE_INFO.name,
  tagline: STORE_INFO.tagline,
  established: STORE_INFO.established,
  phone: STORE_INFO.phone.landline,
  whatsapp: STORE_INFO.whatsapp.number,
  email: STORE_INFO.email,
  address: STORE_INFO.address.full,
  social: STORE_INFO.social
};
