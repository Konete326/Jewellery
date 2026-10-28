import { usersApi } from '@/api/users.api';
import { galleryApi } from '@/api/galleryApi';
import { getAuthUser } from './auth';
import { broadcastVaultUpdate } from '@/utils/tabSync';

const STORAGE_KEY = 'khalil_atelier_vault';
const ITEMS_STORAGE_KEY = 'khalil_atelier_vault_items';

export function getLocalVaultIds() {
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
  try {
    const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const ids = getLocalVaultIds();
    return parsed.filter((item) => ids.includes(String(item._id || item.id)));
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

export function isPieceSavedInVault(pieceId) {
  if (!pieceId) return false;
  const ids = getLocalVaultIds();
  return ids.includes(String(pieceId));
}

export async function toggleVaultPiece(piece) {
  if (!piece) return { saved: false, count: 0 };
  const pieceId = String(piece._id || piece.id);
  const currentIds = getLocalVaultIds();
  const exists = currentIds.includes(pieceId);
  const newIds = exists
    ? currentIds.filter((id) => id !== pieceId)
    : [...currentIds, pieceId];

  saveVaultIdsLocally(newIds);

  const currentItems = getLocalVaultItems();
  const normalizedPiece = {
    _id: pieceId,
    id: pieceId,
    title: piece.title || 'Masterpiece',
    category: piece.category || 'Bridal Sets',
    imageUrl: piece.imageUrl || piece.src || '',
    src: piece.imageUrl || piece.src || '',
    averageRating: piece.averageRating || 5,
    reviewCount: piece.reviewCount || 0
  };

  const newItems = exists
    ? currentItems.filter((p) => String(p._id || p.id) !== pieceId)
    : [normalizedPiece, ...currentItems.filter((p) => String(p._id || p.id) !== pieceId)];

  saveVaultItemsLocally(newItems);

  const user = getAuthUser();
  if (user?.email) {
    try {
      await usersApi.toggleWishlist(user.email, pieceId, { silent: true });
    } catch {}
  } else if (!exists) {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open_google_onetap'));
    }, 600);
  }

  return { saved: !exists, count: newIds.length };
}

export async function syncVaultWithDatabase() {
  const user = getAuthUser();
  if (!user?.email) return;

  const localIds = getLocalVaultIds();
  try {
    const res = await usersApi.syncWishlist(user.email, localIds, { silent: true });
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
  const localIds = getLocalVaultIds();
  if (localIds.length === 0) {
    saveVaultItemsLocally([]);
    return [];
  }

  const cachedItems = getLocalVaultItems();
  const user = getAuthUser();

  if (user?.email) {
    try {
      const res = await usersApi.getWishlist(user.email, { silent: true });
      if (res?.data?.items) {
        if (res.data.ids) saveVaultIdsLocally(res.data.ids);
        saveVaultItemsLocally(res.data.items);
        return res.data.items;
      }
    } catch {}
  }

  const missingIds = localIds.filter(
    (id) => !cachedItems.some((item) => String(item._id || item.id) === String(id))
  );

  if (missingIds.length > 0) {
    try {
      const fetched = await Promise.all(
        missingIds.map(async (id) => {
          const res = await galleryApi.getById(id, { silent: true }).catch(() => null);
          return res?.data || null;
        })
      );
      const valid = fetched.filter(Boolean);
      if (valid.length > 0) {
        const merged = [...cachedItems, ...valid];
        saveVaultItemsLocally(merged);
        return merged.filter((item) => localIds.includes(String(item._id || item.id)));
      }
    } catch {}
  }

  return cachedItems.filter((item) => localIds.includes(String(item._id || item.id)));
}
