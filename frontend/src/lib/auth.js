import { auth, googleProvider, signInWithPopup } from './firebase.js';
import { usersApi } from '@/api/users.api.js';
import { syncVaultWithDatabase } from './wishlist.js';

export function getAuthUser() {
  try {
    const stored = localStorage.getItem('auth_user');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setAuthUser(user) {
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('khalil_auth_change', { detail: user }));
    syncVaultWithDatabase().catch(() => {});
  } else {
    clearAuth();
  }
}

export function isAdmin() {
  const user = getAuthUser();
  return Boolean(user && user.role === 'admin');
}

export function clearAuth() {
  localStorage.removeItem('auth_user');
  window.dispatchEvent(new CustomEvent('khalil_auth_change', { detail: null }));
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;
  const payload = {
    email: fbUser.email,
    name: fbUser.displayName || 'Google Collector',
    avatar: fbUser.photoURL || '',
    googleId: fbUser.uid
  };
  const response = await usersApi.googleAuth(payload);
  const user = response.data;
  setAuthUser(user);
  return user;
}

export async function loginWithEmail(email, password) {
  const response = await usersApi.login({ email, password });
  const user = response.data;
  setAuthUser(user);
  return user;
}

export async function registerWithEmail(name, email, password) {
  const response = await usersApi.register({ name, email, password });
  const user = response.data;
  setAuthUser(user);
  return user;
}

export async function logoutUser() {
  try {
    await auth.signOut();
  } catch {}
  clearAuth();
}
