export const STORE_INFO = {
  name: 'Khalil & Sons Jewellers',
  founder: 'Mr. Khalil Ahmed',
  established: '1992',
  tagline: 'Master Goldsmithing & Bridal Jewellery Heirlooms',
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
    full: 'Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi, 74400, Pakistan',
    short: 'Murshid Sunaar Tower, Saddar, Karachi'
  },
  phone: {
    landline: '+92 21 35670868',
    landlineFormatted: '(021) 35670868',
    mobile: '+92 333 3213613',
    mobileFormatted: '0333 3213613'
  },
  whatsapp: {
    number: '+92 333 3213613',
    url: 'https://wa.me/923333213613',
    inquiryUrl: (message) =>
      `https://wa.me/923333213613?text=${encodeURIComponent(
        message || 'Hello Khalil & Sons, I would like to inquire about fine jewellery.'
      )}`
  },
  social: {
    instagram: 'https://www.instagram.com/khalilandsons/',
    facebook: 'https://www.facebook.com/thekhalilandsons/',
    googleMaps:
      'https://maps.google.com/?q=Khalil+%26+Sons+Jewellers+Murshid+Sunaar+Tower+Daud+Pota+Road+Saddar+Karachi',
    googleMapsDirections:
      'https://www.google.com/maps/dir/?api=1&destination=Khalil+%26+Sons+Jewellers+Murshid+Sunaar+Tower+Dr+Daud+Pota+Road+Saddar+Karachi',
    website: 'https://khalilandsonsjewellers.com'
  },
  email: 'info@khalilandsonsjewellers.com',
  hours: {
    monThu: '1:00 PM – 8:30 PM',
    fri: '3:30 PM – 9:30 PM',
    sat: '1:30 PM – 8:30 PM',
    sun: 'Closed',
    summary: 'Mon–Thu: 1:00 PM – 8:30 PM | Fri: 3:30 PM – 9:30 PM | Sat: 1:30 PM – 8:30 PM'
  },
  specialties: [
    'Certified 22K (.916) Pure Gold',
    'Solid 24K Gold',
    'Custom Bridal Jewellery Heirlooms',
    'Natural Uncut Polki Diamonds',
    'Precious & Semi-Precious Gemstones',
    'Fine Sterling Silver Jewellery'
  ]
};
