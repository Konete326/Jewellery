import React from 'react';

export const COUNTRY_CODES = [
  { code: '+92', flag: '🇵🇰', name: 'PK', label: 'PK (+92)' },
  { code: '+971', flag: '🇦🇪', name: 'AE', label: 'AE (+971)' },
  { code: '+966', flag: '🇸🇦', name: 'SA', label: 'SA (+966)' },
  { code: '+44', flag: '🇬🇧', name: 'UK', label: 'UK (+44)' },
  { code: '+1', flag: '🇺🇸', name: 'US', label: 'US (+1)' },
  { code: '+974', flag: '🇶🇦', name: 'QA', label: 'QA (+974)' },
  { code: '+968', flag: '🇴🇲', name: 'OM', label: 'OM (+968)' },
  { code: '+965', flag: '🇰🇼', name: 'KW', label: 'KW (+965)' },
  { code: '+973', flag: '🇧🇭', name: 'BH', label: 'BH (+973)' },
  { code: '+61', flag: '🇦🇺', name: 'AU', label: 'AU (+61)' },
  { code: '+60', flag: '🇲🇾', name: 'MY', label: 'MY (+60)' },
  { code: '+65', flag: '🇸🇬', name: 'SG', label: 'SG (+65)' },
  { code: '+49', flag: '🇩🇪', name: 'DE', label: 'DE (+49)' }
];

export function CountryCodeSelect({ value = '+92', onChange, disabled = false }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="bg-muted/40 border border-input rounded-xl px-2.5 py-2 text-xs font-mono text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 cursor-pointer shrink-0 disabled:opacity-60"
    >
      {COUNTRY_CODES.map((c) => (
        <option key={c.code + c.name} value={c.code} className="bg-background text-foreground">
          {c.flag} {c.label}
        </option>
      ))}
    </select>
  );
}
