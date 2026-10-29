import React, { useState } from 'react';

export function EasyPaisaLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#00A651" />
      <path
        d="M32 16C23.16 16 16 23.16 16 32C16 40.84 23.16 48 32 48C37.5 48 42.34 45.22 45.22 41H37.8C36.14 42.24 34.16 43 32 43C25.92 43 21 38.08 21 32H48C48 31 48 30 48 29C47.8 21.8 41 16 32 16ZM21.2 28C22.1 23.5 26.6 20 32 20C37.4 20 41.9 23.5 42.8 28H21.2Z"
        fill="white"
      />
      <circle cx="48" cy="18" r="4" fill="#8DC63F" />
    </svg>
  );
}

export function JazzCashLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#1A1A1A" />
      <path
        d="M26 14C23 18 20 23 20 29C20 38 27 44 35 44C38.5 44 41.5 42.8 44 40.8C42 41 40 40.2 38.8 39C36 36.2 36.5 32 37.5 29C38.2 26.8 39.5 24.5 40 22C40.5 19.5 40 17 39 15C36 18.5 34.5 23 35 27.5C33 24.5 32.5 20.5 33 17C30.5 20.5 29 25 29.5 29.5C28 27.5 27.2 24.5 27.5 22C26.5 25 26 28 26.2 31C24.5 29.5 24 27 24.2 25C23.2 28.5 23 32 23.5 35C24.5 40 28.5 44 33.5 44C27.5 42 24 36 26 14Z"
        fill="#ED1C24"
      />
      <path
        d="M36 25C37 28 37.5 31 36.5 34C36 32 35 30.5 34 29C34 32 32.5 34.5 30.5 36.5C32.5 39 35.5 39.5 38 38C41 36 41.5 31.5 40 28.5C39.2 27 37.8 25.8 36 25Z"
        fill="#FFC20E"
      />
      <text x="32" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="0.5">JAZZCASH</text>
    </svg>
  );
}

export function SadaPayLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#00A389" />
      <rect x="20" y="20" width="16" height="16" rx="4" fill="#FFFFFF" />
      <rect x="28" y="28" width="16" height="16" rx="4" fill="#FF8066" />
    </svg>
  );
}

export function NayaPayLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#F76B1C" />
      <path
        d="M20 44V20H26L38 36V20H44V44H38L26 28V44H20Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function RaastLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#006A4E" />
      <circle cx="32" cy="32" r="18" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="3 3" />
      <path
        d="M24 32L30 26V30H38V34H30V38L24 32Z"
        fill="#FFFFFF"
      />
      <path
        d="M40 32L34 38V34H26V30H34V26L40 32Z"
        fill="#8DC63F"
      />
    </svg>
  );
}

export function MeezanBankLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#1B365D" />
      <path
        d="M32 14L37 23H47L41 31L45 41L35 37L32 47L29 37L19 41L23 31L17 23H27L32 14Z"
        fill="#C59B27"
      />
      <circle cx="32" cy="29" r="5" fill="#1B365D" />
    </svg>
  );
}

export function HblLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#008269" />
      <path
        d="M32 16L46 24V40L32 48L18 40V24L32 16Z"
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />
      <text x="32" y="36" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="1">HBL</text>
    </svg>
  );
}

export function BankAlfalahLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#D31145" />
      <path
        d="M32 15C22.6 15 15 22.6 15 32C15 41.4 22.6 49 32 49C41.4 49 49 41.4 49 32C49 22.6 41.4 15 32 15ZM32 23C37 23 41 27 41 32C41 37 37 41 32 41C27 41 23 37 23 32C23 27 27 23 32 23Z"
        fill="#FFFFFF"
      />
      <circle cx="32" cy="32" r="5" fill="#D31145" />
      <path d="M32 19V27M45 32H37M32 45V37M19 32H27" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StandardCharteredLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#0A2540" />
      <path
        d="M20 38C20 31.4 25.4 26 32 26C38.6 26 44 31.4 44 38"
        stroke="#0072CE"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M44 26C44 32.6 38.6 38 32 38C25.4 38 20 32.6 20 26"
        stroke="#009A44"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function McbLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#004B87" />
      <rect x="22" y="22" width="14" height="14" rx="2" transform="rotate(45 22 22)" fill="#EA5B0C" />
      <rect x="36" y="22" width="14" height="14" rx="2" transform="rotate(45 36 22)" fill="#FFFFFF" />
    </svg>
  );
}

export function AlliedBankLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#004B87" />
      <circle cx="32" cy="32" r="16" stroke="#F37021" strokeWidth="4" />
      <path d="M24 39L32 23L40 39H35L32 32L29 39H24Z" fill="#FFFFFF" />
    </svg>
  );
}

export function UblLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#005BA4" />
      <circle cx="32" cy="32" r="15" stroke="#FFFFFF" strokeWidth="2.5" />
      <text x="32" y="37" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="1">UBL</text>
    </svg>
  );
}

export function FaysalBankLogo({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="14" fill="#631D38" />
      <circle cx="32" cy="32" r="15" stroke="#C59B27" strokeWidth="2" />
      <path d="M32 22V42M22 32H42" stroke="#C59B27" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function GenericBankLogo({ name = 'Bank', className = 'size-8' }) {
  const initials = (name || 'BK')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`rounded-xl border border-border bg-muted/60 text-foreground flex items-center justify-center font-mono font-bold text-xs shrink-0 select-none ${className}`}>
      {initials || 'BK'}
    </div>
  );
}

export function BankLogo({ name = '', type = '', logoUrl = '', className = 'size-8' }) {
  const [imgError, setImgError] = useState(false);

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={name || 'Payment Provider'}
        onError={() => setImgError(true)}
        className={`object-contain rounded-xl border border-border/80 bg-white p-1 shrink-0 ${className}`}
      />
    );
  }

  const query = `${name} ${type}`.toLowerCase();

  if (query.includes('easypaisa') || query.includes('easy paisa')) {
    return <EasyPaisaLogo className={className} />;
  }
  if (query.includes('jazzcash') || query.includes('jazz')) {
    return <JazzCashLogo className={className} />;
  }
  if (query.includes('sadapay') || query.includes('sada')) {
    return <SadaPayLogo className={className} />;
  }
  if (query.includes('nayapay') || query.includes('naya')) {
    return <NayaPayLogo className={className} />;
  }
  if (query.includes('raast')) {
    return <RaastLogo className={className} />;
  }
  if (query.includes('meezan')) {
    return <MeezanBankLogo className={className} />;
  }
  if (query.includes('hbl') || query.includes('habib')) {
    return <HblLogo className={className} />;
  }
  if (query.includes('alfalah') || query.includes('alfa')) {
    return <BankAlfalahLogo className={className} />;
  }
  if (query.includes('standard') || query.includes('chartered') || query.includes('scb')) {
    return <StandardCharteredLogo className={className} />;
  }
  if (query.includes('mcb')) {
    return <McbLogo className={className} />;
  }
  if (query.includes('allied') || query.includes('abl')) {
    return <AlliedBankLogo className={className} />;
  }
  if (query.includes('ubl') || query.includes('united')) {
    return <UblLogo className={className} />;
  }
  if (query.includes('faysal')) {
    return <FaysalBankLogo className={className} />;
  }

  return <GenericBankLogo name={name} className={className} />;
}

