import { auth, googleProvider, signInWithPopup } from './firebase.js';
import { usersApi } from '@/api/users.api.js';
import { syncVaultWithDatabase, clearLocalVault } from './wishlist.js';
import { broadcastAuthUpdate } from '@/utils/tabSync.js';

export function isDifferentAccount(currentUser, incomingUser) {
  if (!currentUser || !incomingUser) return false;

  const currentEmail = currentUser.email ? String(currentUser.email).trim().toLowerCase() : '';
  const incomingEmail = incomingUser.email ? String(incomingUser.email).trim().toLowerCase() : '';
  if (currentEmail && incomingEmail && currentEmail !== incomingEmail) {
    return true;
  }

  const currentId = String(currentUser._id || currentUser.id || '').trim();
  const incomingId = String(incomingUser._id || incomingUser.id || '').trim();
  if (currentId && incomingId && currentId !== incomingId) {
    return true;
  }

  return false;
}

export function getActiveAccountKey() {
  const user = getAuthUser();
  const token = getAuthToken();
  if (!user || !token) return '';
  const email = user.email ? String(user.email).trim().toLowerCase() : '';
  const id = String(user._id || user.id || '').trim();
  return `${id}::${email}::${token}`;
}

export function isAccountActive(accountKey) {
  if (!accountKey) return false;
  return getActiveAccountKey() === accountKey;
}

export function getAuthUser() {
  try {
    const stored = localStorage.getItem('auth_user');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function getAuthToken() {
  try {
    return localStorage.getItem('auth_token') || '';
  } catch {
    return '';
  }
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function setAuthUser(user, token) {
  if (user) {
    const previousUser = getAuthUser();
    const isSwitchingAccount = isDifferentAccount(previousUser, user);

    if (isSwitchingAccount) {
      clearLocalVault();
    }

    localStorage.setItem('auth_user', JSON.stringify(user));
    if (token) {
      setAuthToken(token);
    }
    broadcastAuthUpdate(user);
    syncVaultWithDatabase({ isolated: isSwitchingAccount }).catch(() => {});
  } else {
    clearAuth();
  }
}

export function isAuthenticated() {
  const user = getAuthUser();
  const token = getAuthToken();
  return Boolean(user && token);
}

export function isAdmin() {
  const user = getAuthUser();
  const token = getAuthToken();
  return Boolean(user && token && user.role === 'admin');
}

export function clearAuth() {
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
  clearLocalVault();
  broadcastAuthUpdate(null);
  window.dispatchEvent(new CustomEvent('khalil_vault_change', { detail: { count: 0, ids: [] } }));
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;
  const fbIdToken = await fbUser.getIdToken();
  const payload = {
    email: fbUser.email,
    name: fbUser.displayName || 'Google Collector',
    avatar: fbUser.photoURL || '',
    googleId: fbUser.uid
  };
  const response = await usersApi.googleAuth(payload);
  const data = response?.data || response;
  const user = data.user || data;
  const token = data.token || fbIdToken;
  setAuthUser(user, token);
  return user;
}

export async function loginWithEmail(email, password) {
  const response = await usersApi.login({ email, password });
  const data = response?.data || response;
  const user = data.user || data;
  const token = data.token || '';
  setAuthUser(user, token);
  return user;
}

export async function registerWithEmail(name, email, password) {
  const response = await usersApi.register({ name, email, password });
  const data = response?.data || response;
  const user = data.user || data;
  const token = data.token || '';
  setAuthUser(user, token);
  return user;
}

export async function logoutUser() {
  try {
    await auth.signOut();
  } catch {}
  clearAuth();
}
