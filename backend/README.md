# Khalil & Sons Jewellers — Backend Architecture & Security Guide

## 1. Overview
High-end jewelry atelier e-commerce and inventory backend powered by Node.js (Express ESM), MongoDB (Mongoose), Firebase Admin SDK, Cloudinary, and Nodemailer.

---

## 2. Automated Test Environment & Database Isolation

Automated tests are isolated from the live MongoDB Atlas database.

### Test Isolation Architecture
1. **Primary Mechanism:** `mongodb-memory-server` creates an ephemeral in-memory MongoDB instance automatically when running tests.
2. **Dedicated Test Database Fallback:** You can configure a dedicated test URI via `MONGO_URI_TEST` in `.env`:
   ```bash
   MONGO_URI_TEST=mongodb://localhost:27017/khalil_test
   ```
3. **Production Database Safety Guard:**
   Before any test database operation or cleanup runs, `assertSafeTestDatabase()` validates the connection string and database name. If the database does not contain `test` or does not match an in-memory/localhost instance, or if it matches the production `MONGODB_URI`, the test suite aborts immediately.

### Running Automated Tests
```bash
cd backend
npm test
```

---

## 3. Rate Limiting & Proxy Configuration

Rate limiting is implemented using `express-rate-limit` to protect sensitive authentication and order placement endpoints:

| Endpoint | Window | Limit | Exceeded Response |
|---|---|---|---|
| `POST /api/v1/users/login` | 15 mins | 10 attempts / IP | HTTP 429 Too Many Requests |
| `POST /api/v1/users/register` | 15 mins | 10 attempts / IP | HTTP 429 Too Many Requests |
| `POST /api/v1/users/google-auth` | 15 mins | 10 attempts / IP | HTTP 429 Too Many Requests |
| `POST /api/v1/orders/` | 60 mins | 30 orders / IP | HTTP 429 Too Many Requests |

Public storefront browsing (`GET /api/rates`, `GET /api/categories`, `GET /api/products`) is unaffected by auth rate limits.

### Reverse Proxy Configuration
In production environments behind reverse proxies (e.g. Nginx, Hostinger, Cloudflare), `trust proxy` is enabled (`app.set('trust proxy', 1)`) so that client IP addresses are resolved accurately from `X-Forwarded-For` headers without spoofing or collective rate-limit blocking.

---

## 4. Firebase Service Account Configuration

The backend implements a dual-token authentication mechanism:
1. **Primary Atelier JWT:** Signed and verified locally via `JWT_SECRET`.
2. **Google ID Tokens:** Verified server-side via `firebase-admin/auth` when patrons sign in with Google One-Tap.

### Production Setup Instructions
1. In the Firebase Console, go to **Project Settings** > **Service accounts**.
2. Click **Generate new private key** and download the credentials JSON file.
3. Configure the environment variable using either:
   - **File Path (Recommended):**
     ```bash
     FIREBASE_SERVICE_ACCOUNT=/path/to/serviceAccountKey.json
     ```
   - **Inline JSON:**
     ```bash
     FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"khalilandsons-bc707",...}'
     ```
4. If `FIREBASE_SERVICE_ACCOUNT` is omitted, local email/password JWT authentication continues to function, while Google ID tokens are rejected with HTTP 401. Authentication is never bypassed or weakened.

---

## 5. Security Checklist for Production

- [ ] Ensure `NODE_ENV=production`.
- [ ] Set `JWT_SECRET` to a cryptographically secure random string (minimum 32 characters, e.g. generated via `openssl rand -hex 32`).
- [ ] Provide `FIREBASE_SERVICE_ACCOUNT` for Google One-Tap token verification.
- [ ] Configure `CLOUDINARY_*` API keys for gallery and product media storage.
- [ ] Configure `SMTP_*` credentials using Gmail App Passwords for inquiry notifications.
- [ ] Keep `.env` out of version control (verified in `.gitignore`).

