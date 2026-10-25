import { usersApi } from '@/api/users.api';
import { getAuthUser } from './auth';

const STORAGE_KEY = 'khalil_atelier_vault';

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

export function isPieceSavedInVault(pieceId) {
  if (!pieceId) return false;
  const ids = getLocalVaultIds();
  return ids.includes(String(pieceId));
}

export function saveVaultIdsLocally(ids = []) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(
      new CustomEvent('khalil_vault_change', {
        detail: { count: ids.length, ids }
      })
    );
  } catch {}
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

  const user = getAuthUser();
  if (user?.email) {
    try {
      await usersApi.toggleWishlist(user.email, pieceId);
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
    const res = await usersApi.syncWishlist(user.email, localIds);
    if (res?.data?.ids) {
      saveVaultIdsLocally(res.data.ids);
      return res.data;
    }
  } catch {}
}

export async function fetchVaultFullItems() {
  const user = getAuthUser();
  if (user?.email) {
    try {
      const res = await usersApi.getWishlist(user.email);
      if (res?.data?.items) {
        if (res.data.ids) saveVaultIdsLocally(res.data.ids);
        return res.data.items;
      }
    } catch {}
  }
  return [];
}
