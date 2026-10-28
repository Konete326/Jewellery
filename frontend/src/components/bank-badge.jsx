import React from 'react';

const BANK_CONFIGS = [
  {
    match: ['meezan'],
    code: 'MEEZAN',
    label: 'Meezan Bank',
    dot: 'bg-[#1b365d]',
    border: 'border-[#1b365d]/25',
    text: 'text-[#1b365d] dark:text-[#6fa8dc]',
    bg: 'bg-[#1b365d]/5'
  },
  {
    match: ['hbl', 'habib'],
    code: 'HBL',
    label: 'Habib Bank Limited',
    dot: 'bg-[#008269]',
    border: 'border-[#008269]/25',
    text: 'text-[#008269] dark:text-[#48c9b0]',
    bg: 'bg-[#008269]/5'
  },
  {
    match: ['alfalah', 'alfa'],
    code: 'ALFALAH',
    label: 'Bank Alfalah',
    dot: 'bg-[#d31145]',
    border: 'border-[#d31145]/25',
    text: 'text-[#d31145] dark:text-[#ff6b8b]',
    bg: 'bg-[#d31145]/5'
  },
  {
    match: ['standard', 'chartered', 'scb'],
    code: 'SCB',
    label: 'Standard Chartered',
    dot: 'bg-[#0072ce]',
    border: 'border-[#0072ce]/25',
    text: 'text-[#0072ce] dark:text-[#5dade2]',
    bg: 'bg-[#0072ce]/5'
  },
  {
    match: ['mcb'],
    code: 'MCB',
    label: 'MCB Bank',
    dot: 'bg-[#ea5b0c]',
    border: 'border-[#ea5b0c]/25',
    text: 'text-[#ea5b0c] dark:text-[#f39c12]',
    bg: 'bg-[#ea5b0c]/5'
  },
  {
    match: ['allied', 'abl'],
    code: 'ABL',
    label: 'Allied Bank',
    dot: 'bg-[#004b87]',
    border: 'border-[#004b87]/25',
    text: 'text-[#004b87] dark:text-[#5dade2]',
    bg: 'bg-[#004b87]/5'
  },
  {
    match: ['ubl', 'united bank'],
    code: 'UBL',
    label: 'United Bank',
    dot: 'bg-[#005ba4]',
    border: 'border-[#005ba4]/25',
    text: 'text-[#005ba4] dark:text-[#5dade2]',
    bg: 'bg-[#005ba4]/5'
  },
  {
    match: ['faysal'],
    code: 'FBL',
    label: 'Faysal Bank',
    dot: 'bg-[#631d38]',
    border: 'border-[#631d38]/25',
    text: 'text-[#631d38] dark:text-[#d98880]',
    bg: 'bg-[#631d38]/5'
  },
  {
    match: ['raast'],
    code: 'RAAST',
    label: 'State Bank Raast',
    dot: 'bg-[#006a4e]',
    border: 'border-[#006a4e]/25',
    text: 'text-[#006a4e] dark:text-[#52be80]',
    bg: 'bg-[#006a4e]/5'
  },
  {
    match: ['jazzcash', 'jazz'],
    code: 'JAZZCASH',
    label: 'JazzCash',
    dot: 'bg-[#e30613]',
    border: 'border-[#e30613]/25',
    text: 'text-[#e30613] dark:text-[#f1948a]',
    bg: 'bg-[#e30613]/5'
  },
  {
    match: ['easypaisa', 'easy paisa'],
    code: 'EASYPAISA',
    label: 'EasyPaisa',
    dot: 'bg-[#00a651]',
    border: 'border-[#00a651]/25',
    text: 'text-[#00a651] dark:text-[#58d68d]',
    bg: 'bg-[#00a651]/5'
  },
  {
    match: ['sada', 'sadapay'],
    code: 'SADAPAY',
    label: 'SadaPay',
    dot: 'bg-[#00a389]',
    border: 'border-[#00a389]/25',
    text: 'text-[#00a389] dark:text-[#76d7c4]',
    bg: 'bg-[#00a389]/5'
  },
  {
    match: ['naya', 'nayapay'],
    code: 'NAYAPAY',
    label: 'NayaPay',
    dot: 'bg-[#f76b1c]',
    border: 'border-[#f76b1c]/25',
    text: 'text-[#f76b1c] dark:text-[#f8c471]',
    bg: 'bg-[#f76b1c]/5'
  }
];

export function BankBadge({ name = '', type = '', className = '' }) {
  const norm = `${name} ${type}`.toLowerCase();
  const matched = BANK_CONFIGS.find((cfg) =>
    cfg.match.some((keyword) => norm.includes(keyword))
  );

  if (matched) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono tracking-wider uppercase font-semibold shrink-0 select-none ${matched.border} ${matched.bg} ${matched.text} ${className}`}
      >
        <span className={`size-1.5 rounded-full ${matched.dot}`} />
        <span>{matched.code}</span>
      </span>
    );
  }

  const fallbackCode = (name || 'BANK')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-border/80 bg-muted/30 text-foreground text-[10px] font-mono tracking-wider uppercase font-semibold shrink-0 select-none ${className}`}
    >
      <span className="size-1.5 rounded-full bg-foreground/60" />
      <span>{fallbackCode || 'BANK'}</span>
    </span>
  );
}
