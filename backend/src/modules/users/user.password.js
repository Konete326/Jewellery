import crypto from 'crypto';

const SECURE_ITERATIONS = 220000;
const LEGACY_ITERATIONS = 1000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

export const hashPassword = (password, iterations = SECURE_ITERATIONS, digest = DIGEST) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, iterations, KEY_LEN, digest).toString('hex');
  return `pbkdf2:${digest}:${iterations}:${salt}:${hash}`;
};

export const needsRehash = (combined) => {
  if (!combined || typeof combined !== 'string' || !combined.includes(':')) return true;
  const parts = combined.split(':');
  if (parts.length === 5 && parts[0] === 'pbkdf2') {
    const iter = Number(parts[2]);
    return parts[1] !== DIGEST || Number.isNaN(iter) || iter < SECURE_ITERATIONS;
  }
  return true;
};

export const verifyPassword = (password, combined) => {
  if (!combined || typeof combined !== 'string' || !combined.includes(':')) return false;
  const parts = combined.split(':');
  let digest = DIGEST;
  let iterations = LEGACY_ITERATIONS;
  let salt = '';
  let originalHash = '';

  if (parts.length === 5 && parts[0] === 'pbkdf2') {
    digest = parts[1];
    iterations = Number(parts[2]);
    salt = parts[3];
    originalHash = parts[4];
  } else if (parts.length === 4) {
    digest = parts[0];
    iterations = Number(parts[1]);
    salt = parts[2];
    originalHash = parts[3];
  } else if (parts.length === 3) {
    iterations = Number(parts[0]);
    salt = parts[1];
    originalHash = parts[2];
  } else if (parts.length === 2) {
    iterations = LEGACY_ITERATIONS;
    salt = parts[0];
    originalHash = parts[1];
  } else {
    return false;
  }

  if (!salt || !originalHash || Number.isNaN(iterations) || iterations <= 0) {
    return false;
  }

  const supportedDigests = ['sha512', 'sha256'];
  const effectiveDigest = supportedDigests.includes(digest) ? digest : DIGEST;

  const hash = crypto.pbkdf2Sync(password, salt, iterations, KEY_LEN, effectiveDigest).toString('hex');
  const hashBuf = Buffer.from(hash, 'hex');
  const origBuf = Buffer.from(originalHash, 'hex');
  if (hashBuf.length !== origBuf.length) return false;
  return crypto.timingSafeEqual(hashBuf, origBuf);
};
