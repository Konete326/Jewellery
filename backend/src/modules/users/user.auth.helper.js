export const isAdminEmail = (email) => {
  if (!email) return false;
  const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  return Boolean(configuredAdminEmail && email.toLowerCase().trim() === configuredAdminEmail);
};

export const isAdminPassword = (pwd) => {
  if (!pwd) return false;
  const configuredAdminPassword = (process.env.ADMIN_PASSWORD || '').trim();
  return Boolean(configuredAdminPassword && pwd.trim() === configuredAdminPassword);
};

export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};
