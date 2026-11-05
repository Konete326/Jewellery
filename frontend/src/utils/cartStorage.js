import { getAuthUser } from '@/lib/auth';

export function getCartStorageKey(user = getAuthUser()) {
  if (!user) return 'khalil_cart_guest';
  const id = String(user._id || user.id || '').trim();
  const email = user.email ? String(user.email).trim().toLowerCase() : '';
  const rawId = id || email;
  if (!rawId) return 'khalil_cart_guest';
  const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `khalil_cart_${cleanId}`;
}

export function getLocalCart(user = getAuthUser()) {
  try {
    const key = getCartStorageKey(user);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    if (key === 'khalil_cart_guest') {
      const legacy = localStorage.getItem('khalil_cart');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem(key, legacy);
          localStorage.removeItem('khalil_cart');
          return parsed;
        }
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function saveLocalCart(items = [], user = getAuthUser()) {
  try {
    const key = getCartStorageKey(user);
    const serialized = JSON.stringify(Array.isArray(items) ? items : []);
    if (localStorage.getItem(key) === serialized) return false;
    localStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
}

export function clearLocalCart(user = getAuthUser()) {
  try {
    const key = getCartStorageKey(user);
    localStorage.removeItem(key);
  } catch {}
}

export function getLocalCartCount(user = getAuthUser()) {
  const items = getLocalCart(user);
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
}

