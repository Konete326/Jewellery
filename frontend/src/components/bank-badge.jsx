import React from 'react';
import { BankLogo } from './BankLogo';

export { BankLogo };

export function BankBadge({ name = '', type = '', logoUrl = '', className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <BankLogo name={name} type={type} logoUrl={logoUrl} className="size-8" />
    </div>
  );
}
