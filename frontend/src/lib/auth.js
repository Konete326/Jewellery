export function getAuthUser() {
  try {
    const stored = localStorage.getItem("auth_user");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAdmin() {
  const user = getAuthUser();
  return Boolean(user && user.role === "admin");
}

export function clearAuth() {
  localStorage.removeItem("auth_user");
}
