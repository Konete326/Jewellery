import { usersApi } from '@/api/users.api';
import { galleryApi } from '@/api/galleryApi';
import { fetchProductById } from '@/api/productApi';
import { getAuthUser, getAuthToken, getActiveAccountKey, isAccountActive } from './auth';
import { broadcastVaultUpdate } from '@/utils/tabSync';

const STORAGE_KEY = 'khalil_atelier_vault';
const ITEMS_STORAGE_KEY = 'khalil_atelier_vault_items';

export function getLocalVaultIds() {
  const user = getAuthUser();
  const token = getAuthToken();
  if (!user || !token) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getLocalVaultItems() {
  const user = getAuthUser();
  const token = getAuthToken();
  if (!user || !token) return [];
  try {
    const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const ids = getLocalVaultIds();
    return parsed
      .filter((item) => ids.includes(String(item._id || item.id)))
      .map((item) => {
        const itemImgs = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);
        const validImg = item.imageUrl || item.src || itemImgs[0] || '/assets/products/choker-ruby-01.jpg';
        return {
          ...item,
          imageUrl: validImg,
          src: validImg,
          images: itemImgs.length ? itemImgs : [validImg]
        };
      });
  } catch {
    return [];
  }
}

export function saveVaultIdsLocally(ids = []) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    broadcastVaultUpdate(ids.length, ids);
  } catch {}
}

export function saveVaultItemsLocally(items = []) {
  try {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function clearLocalVault() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ITEMS_STORAGE_KEY);
    broadcastVaultUpdate(0, []);
  } catch {}
}

export function isPieceSavedInVault(pieceId) {
  if (!pieceId) return false;
  const user = getAuthUser();
  const token = getAuthToken();
  if (!user || !token) return false;
  const ids = getLocalVaultIds();
  return ids.includes(String(pieceId));
}

export async function toggleVaultPiece(piece) {
  if (!piece) return { saved: false, count: 0 };
  const user = getAuthUser();
  const token = getAuthToken();
  if (!user || !token) {
    return { saved: false, count: 0, requiresAuth: true };
  }

  const pieceId = String(piece._id || piece.id);
  const currentIds = getLocalVaultIds();
  const exists = currentIds.includes(pieceId);
  const newIds = exists
    ? currentIds.filter((id) => id !== pieceId)
    : [...currentIds, pieceId];

  saveVaultIdsLocally(newIds);

  const currentItems = getLocalVaultItems();
  const images = Array.isArray(piece.images) ? piece.images : (piece.image ? [piece.image] : []);
  const resolvedImage = piece.imageUrl || piece.src || images[0] || '/assets/products/choker-ruby-01.jpg';

  const normalizedPiece = {
    _id: pieceId,
    id: pieceId,
    title: piece.title || 'Masterpiece',
    category: piece.category || 'Bridal Sets',
    imageUrl: resolvedImage,
    src: resolvedImage,
    images: images.length ? images : [resolvedImage],
    averageRating: piece.averageRating || 5,
    reviewCount: piece.reviewCount || 0
  };

  const newItems = exists
    ? currentItems.filter((p) => String(p._id || p.id) !== pieceId)
    : [normalizedPiece, ...currentItems.filter((p) => String(p._id || p.id) !== pieceId)];

  saveVaultItemsLocally(newItems);

  if (user?.email) {
    try {
      await usersApi.toggleWishlist(user.email, pieceId, { silent: true });
    } catch (err) {
      if (err?.status === 401) {
        return { saved: false, count: 0, requiresAuth: true };
      }
    }
  }

  return { saved: !exists, count: newIds.length };
}

export async function syncVaultWithDatabase(options = {}) {
  const user = getAuthUser();
  const token = getAuthToken();
  if (!user?.email || !token) return;

  const accountKey = getActiveAccountKey();
  const isIsolated = Boolean(options?.isolated);
  const localIds = isIsolated ? [] : getLocalVaultIds();
  try {
    const res = await usersApi.syncWishlist(user.email, localIds, { silent: true });
    if (!isAccountActive(accountKey)) {
      return;
    }
    if (res?.data?.ids) {
      saveVaultIdsLocally(res.data.ids);
      if (res?.data?.items) {
        saveVaultItemsLocally(res.data.items);
      }
      return res.data;
    }
  } catch {}
}

export async function fetchVaultFullItems() {
  const user = getAuthUser();
  const token = getAuthToken();
  if (!user || !token) {
    saveVaultItemsLocally([]);
    return [];
  }

  const accountKey = getActiveAccountKey();

  let activeIds = getLocalVaultIds();
  const cachedItems = getLocalVaultItems();
  const itemMap = new Map();

  cachedItems.forEach((item) => {
    if (item) {
      const id = String(item._id || item.id);
      itemMap.set(id, item);
    }
  });

  if (user?.email) {
    try {
      const res = await usersApi.getWishlist(user.email, { silent: true });
      if (!isAccountActive(accountKey)) {
        return [];
      }
      if (res?.data) {
        if (Array.isArray(res.data.ids)) {
          activeIds = res.data.ids.map(String);
          saveVaultIdsLocally(activeIds);
        }
        if (Array.isArray(res.data.items)) {
          res.data.items.forEach((item) => {
            if (item) {
              const id = String(item._id || item.id);
              itemMap.set(id, item);
            }
          });
        }
      }
    } catch {}
  }

  if (!isAccountActive(accountKey)) {
    return [];
  }

  if (activeIds.length === 0) {
    saveVaultItemsLocally([]);
    return [];
  }

  const missingIds = activeIds.filter((id) => {
    const item = itemMap.get(id);
    if (!item) return true;
    const hasImage = Boolean(
      item.imageUrl || item.src || (Array.isArray(item.images) && item.images.length)
    );
    return !hasImage;
  });

  if (missingIds.length > 0) {
    try {
      const fetched = await Promise.all(
        missingIds.map(async (id) => {
          const galleryRes = await galleryApi.getById(id, { silent: true }).catch(() => null);
          if (galleryRes?.data) return galleryRes.data;
          const productRes = await fetchProductById(id).catch(() => null);
          return productRes?.data || null;
        })
      );
      if (!isAccountActive(accountKey)) {
        return [];
      }
      fetched.filter(Boolean).forEach((item) => {
        const id = String(item._id || item.id);
        itemMap.set(id, item);
      });
    } catch {}
  }

  if (!isAccountActive(accountKey)) {
    return [];
  }

  const merged = activeIds
    .map((id) => {
      const item = itemMap.get(id);
      if (!item) return null;
      const itemImgs = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);
      const validImg = item.imageUrl || item.src || itemImgs[0] || '/assets/products/choker-ruby-01.jpg';
      return {
        ...item,
        _id: id,
        id,
        imageUrl: validImg,
        src: validImg,
        images: itemImgs.length ? itemImgs : [validImg]
      };
    })
    .filter(Boolean);

  saveVaultItemsLocally(merged);
  return merged;
}
