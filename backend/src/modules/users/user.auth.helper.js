const ADMIN_EMAILS = [
  (process.env.ADMIN_EMAIL || 'khalilandsonsjewellers@gmail.com').toLowerCase().trim(),
  'khalilandsonsjewellers@gmail.com',
  'admin@gmail.com'
];

const ADMIN_PASSWORDS = [
  process.env.ADMIN_PASSWORD || 'admin123',
  'admin123',
  'admin',
  'fogdwvnovnrtbolo',
  'fogd wvno vnrt bolo'
];

export const isAdminEmail = (email) => ADMIN_EMAILS.includes(email.toLowerCase().trim());

export const isAdminPassword = (pwd) => ADMIN_PASSWORDS.includes(pwd.trim());

export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};
