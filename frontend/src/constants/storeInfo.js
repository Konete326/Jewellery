import { useState, useEffect } from 'react';

function getActiveProfile() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('khalil_store_profile') : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const STORE_INFO = {
  get name() {
    return getActiveProfile()?.name || 'Khalil & Sons Jewellers';
  },
  founder: 'Mr. Khalil Ahmed',
  established: '1992',
  get tagline() {
    return getActiveProfile()?.tagline || 'Master Goldsmithing & Bridal Jewellery Heirlooms';
  },
  rating: 5.0,
  reviewCount: 2,
  address: {
    shop: 'Shop Number 2',
    building: 'Murshid Sunaar Tower',
    street: 'Dr. Daud Pota Road',
    landmark: 'Near United Bakery, Saddar Town',
    city: 'Karachi',
    postalCode: '74400',
    country: 'Pakistan',
    get full() {
      return (
        getActiveProfile()?.address ||
        'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi, 74400, Pakistan'
      );
    },
    short: 'Murshid Sunaar Tower, Saddar, Karachi',
    geo: {
      latitude: 24.8595126,
      longitude: 67.0252029
    }
  },
  phone: {
    get landline() {
      return getActiveProfile()?.landline || '+92 21 35670868';
    },
    get landlineFormatted() {
      const l = getActiveProfile()?.landline || '+92 21 35670868';
      return l.replace('+92 21', '(021)');
    },
    get mobile() {
      return getActiveProfile()?.phone || '+92 333 3213613';
    },
    get mobileFormatted() {
      const m = getActiveProfile()?.phone || '+92 333 3213613';
      return m.replace('+92 ', '0');
    }
  },
  whatsapp: {
    get number() {
      return getActiveProfile()?.whatsapp || getActiveProfile()?.phone || '+92 333 3213613';
    },
    get url() {
      const num = (getActiveProfile()?.whatsapp || getActiveProfile()?.phone || '923333213613').replace(/\D/g, '');
      return `https://api.whatsapp.com/send?phone=${num}`;
    },
    inquiryUrl: (message) => {
      const num = (getActiveProfile()?.whatsapp || getActiveProfile()?.phone || '923333213613').replace(/\D/g, '');
      const encoded = encodeURIComponent(
        message || 'Hello Khalil & Sons, I would like to inquire about fine jewellery.'
      );
      if (typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return `https://api.whatsapp.com/send?phone=${num}&text=${encoded}`;
      }
      return `https://web.whatsapp.com/send?phone=${num}&text=${encoded}`;
    }
  },
  social: {
    instagram: 'https://www.instagram.com/khalilandsons/',
    facebook: 'https://www.facebook.com/thekhalilandsons/',
    googleMaps: 'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7',
    googleMapsDirections: 'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7',
    googleReviewUrl: 'https://maps.app.goo.gl/49w2MCbeJfqTc8hT7',
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.1271135585234!2d67.0300738!3d24.8595078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e71bff6bf45%3A0x2f5bedb61490e955!2sKhalil%20%26%20Sons%20Jewellers!5e0!3m2!1sen!2s!4v1793008108712!5m2!1sen!2s',
    website: 'https://khalilandsonsjewellers.com'
  },
  get email() {
    return (
      getActiveProfile()?.email ||
      import.meta.env.VITE_CONTACT_EMAIL ||
      'khalilandsonsjewellers@gmail.com'
    );
  },
  hours: {
    monThu: '2:00 PM – 9:00 PM',
    fri: '3:30 PM – 9:30 PM',
    sat: '2:00 PM – 9:00 PM',
    sun: 'Closed',
    get summary() {
      return (
        getActiveProfile()?.openingHours ||
        'Mon–Sat: 2:00 PM – 9:00 PM (Fri: 3:30 PM – 9:30 PM) | Sun: Closed'
      );
    }
  },
  specialties: [
    'Certified 22K (.916) Hallmark Gold',
    'Certified 21K (.875) Heritage Gold',
    'Artisanal 18K (.750) Diamond Mounts',
    'Custom Bridal Jewellery Heirlooms',
    'Natural Uncut Polki Diamonds',
    'Precious & Semi-Precious Gemstones',
    'Fine Sterling Silver Jewellery'
  ]
};

export function useStoreProfile() {
  const [profile, setProfile] = useState(() => getActiveProfile());

  useEffect(() => {
    const handleUpdate = (e) => {
      setProfile(e.detail || getActiveProfile());
    };
    window.addEventListener('khalil_store_profile_change', handleUpdate);
    return () => window.removeEventListener('khalil_store_profile_change', handleUpdate);
  }, []);

  return profile;
}
