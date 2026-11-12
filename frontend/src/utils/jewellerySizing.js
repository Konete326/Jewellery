export const RING_SIZES = [
  { id: 'US 4', label: 'US 4', diameterMm: 14.9, circumferenceMm: 46.8, ukLetter: 'H' },
  { id: 'US 5', label: 'US 5', diameterMm: 15.7, circumferenceMm: 49.3, ukLetter: 'J 1/2' },
  { id: 'US 6', label: 'US 6', diameterMm: 16.5, circumferenceMm: 51.9, ukLetter: 'L 1/2' },
  { id: 'US 7', label: 'US 7', diameterMm: 17.3, circumferenceMm: 54.4, ukLetter: 'N 1/2', isDefaultPopular: true },
  { id: 'US 8', label: 'US 8', diameterMm: 18.1, circumferenceMm: 57.0, ukLetter: 'P 1/2' },
  { id: 'US 9', label: 'US 9', diameterMm: 18.9, circumferenceMm: 59.5, ukLetter: 'R 1/2' },
  { id: 'US 10', label: 'US 10', diameterMm: 19.8, circumferenceMm: 62.1, ukLetter: 'T 1/2' },
  { id: 'US 11', label: 'US 11', diameterMm: 20.6, circumferenceMm: 64.6, ukLetter: 'V 1/2' },
  { id: 'US 12', label: 'US 12', diameterMm: 21.4, circumferenceMm: 67.2, ukLetter: 'X 1/2' }
];

export const BANGLE_SIZES = [
  { id: '2.2', label: '2.2 (2-2/16")', inches: 2.125, diameterMm: 54.0, circumferenceMm: 169.6, fitTag: 'Extra Small' },
  { id: '2.4', label: '2.4 (2-4/16")', inches: 2.250, diameterMm: 57.2, circumferenceMm: 179.6, fitTag: 'Small' },
  { id: '2.6', label: '2.6 (2-6/16")', inches: 2.375, diameterMm: 60.3, circumferenceMm: 189.5, fitTag: 'Medium', isDefaultPopular: true },
  { id: '2.8', label: '2.8 (2-8/16")', inches: 2.500, diameterMm: 63.5, circumferenceMm: 199.5, fitTag: 'Large' },
  { id: '2.10', label: '2.10 (2-10/16")', inches: 2.625, diameterMm: 66.7, circumferenceMm: 209.5, fitTag: 'Extra Large' }
];

export const BRACELET_SIZES = [
  { id: '6.0"', label: '6.0" (15.2 cm)', inches: 6.0, cm: 15.2, wristFit: '5.25" - 5.5"', fitTag: 'Petite / Snug' },
  { id: '6.5"', label: '6.5" (16.5 cm)', inches: 6.5, cm: 16.5, wristFit: '5.75" - 6.0"', fitTag: 'Small' },
  { id: '7.0"', label: '7.0" (17.8 cm)', inches: 7.0, cm: 17.8, wristFit: '6.25" - 6.5"', fitTag: 'Medium', isDefaultPopular: true },
  { id: '7.5"', label: '7.5" (19.1 cm)', inches: 7.5, cm: 19.1, wristFit: '6.75" - 7.0"', fitTag: 'Comfort Fit' },
  { id: '8.0"', label: '8.0" (20.3 cm)', inches: 8.0, cm: 20.3, wristFit: '7.25" - 7.5"', fitTag: 'Relaxed' }
];

export const NECKLACE_SIZES = [
  { id: '16"', label: '16" (40 cm)', inches: 16, cm: 40.6, fitTag: 'Choker / Collarbone' },
  { id: '18"', label: '18" (45 cm)', inches: 18, cm: 45.7, fitTag: 'Princess (Standard)', isDefaultPopular: true },
  { id: '20"', label: '20" (50 cm)', inches: 20, cm: 50.8, fitTag: 'Matinee' },
  { id: '22"', label: '22" (55 cm)', inches: 22, cm: 55.9, fitTag: 'Long Matinee' },
  { id: '24"', label: '24" (60 cm)', inches: 24, cm: 61.0, fitTag: 'Opera / Royal Mala' }
];

export function getJewellerySizingType(piece) {
  if (!piece) return null;
  const rawCat = (piece.category || '').toLowerCase().trim();
  const rawTitle = (piece.title || piece.name || '').toLowerCase().trim();

  if (rawCat.includes('ring')) return 'ring';
  if (rawCat.includes('bangle') || rawCat.includes('kara') || rawCat.includes('kada') || rawCat.includes('choori')) return 'bangle';
  if (rawCat.includes('bracelet') || rawCat.includes('cuff')) return 'bracelet';
  if (rawCat.includes('necklace') || rawCat.includes('choker') || rawCat.includes('chain') || rawCat.includes('mala') || rawCat.includes('guluband')) return 'necklace';

  if (rawTitle.includes('ring') || rawTitle.includes('angothi') || rawTitle.includes('chhalla') || rawTitle.includes('solitaire')) return 'ring';
  if (rawTitle.includes('bangle') || rawTitle.includes('kara') || rawTitle.includes('kada') || rawTitle.includes('choori')) return 'bangle';
  if (rawTitle.includes('bracelet') || rawTitle.includes('cuff')) return 'bracelet';
  if (rawTitle.includes('necklace') || rawTitle.includes('choker') || rawTitle.includes('chain') || rawTitle.includes('mala') || rawTitle.includes('guluband')) return 'necklace';

  return null;
}

export function getSizingOptions(sizingType) {
  switch (sizingType) {
    case 'ring':
      return RING_SIZES;
    case 'bangle':
      return BANGLE_SIZES;
    case 'bracelet':
      return BRACELET_SIZES;
    case 'necklace':
      return NECKLACE_SIZES;
    default:
      return [];
  }
}

export function formatDetailedSizeBadge(size, piece) {
  if (!size) return '';
  const clean = String(size).trim();
  const ring = RING_SIZES.find((r) => r.id.toLowerCase() === clean.toLowerCase() || r.label.toLowerCase() === clean.toLowerCase());
  if (ring) {
    return `${ring.id} · ${ring.diameterMm}mm`;
  }
  const bangle = BANGLE_SIZES.find((b) => b.id.toLowerCase() === clean.toLowerCase() || b.label.toLowerCase().includes(clean.toLowerCase()));
  if (bangle) {
    return `${bangle.id} · ${bangle.diameterMm}mm`;
  }
  const bracelet = BRACELET_SIZES.find((b) => b.id.toLowerCase() === clean.toLowerCase() || b.label.toLowerCase().includes(clean.toLowerCase()));
  if (bracelet) {
    return `${bracelet.inches}" · ${bracelet.cm}cm`;
  }
  const necklace = NECKLACE_SIZES.find((n) => n.id.toLowerCase() === clean.toLowerCase() || n.label.toLowerCase().includes(clean.toLowerCase()));
  if (necklace) {
    return `${necklace.inches}" · ${necklace.cm}cm`;
  }
  return clean;
}

export function getSizingMeta(sizingType) {
  switch (sizingType) {
    case 'ring':
      return {
        title: 'Ring Sizing',
        label: 'Ring Finger Size',
        unitLabel: 'Inner Diameter (mm)',
        guideTab: 'ring'
      };
    case 'bangle':
      return {
        title: 'Bangle Sizing',
        label: 'Bangle Size',
        unitLabel: 'Hand / Diameter (mm)',
        guideTab: 'bangle'
      };
    case 'bracelet':
      return {
        title: 'Bracelet Sizing',
        label: 'Wrist Length',
        unitLabel: 'Length (inches & cm)',
        guideTab: 'bracelet'
      };
    case 'necklace':
      return {
        title: 'Necklace Length',
        label: 'Necklace / Chain Length',
        unitLabel: 'Length (inches & cm)',
        guideTab: 'necklace'
      };
    default:
      return null;
  }
}
