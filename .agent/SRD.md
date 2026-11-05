# System Requirements Document (SRD) - Khalil & Sons

## 1. Hosting & Infrastructure Architecture
- **Production Server:** Node.js reverse proxy on Hostinger Cloud/VPS.
- **Continuous Deployment Workflow:**
  - Automated deployment via Git Webhooks: Every push to `origin main` triggers an automatic zero-downtime production build and restart.
  - Manual Hostinger inspection or polling during daily development is strictly omitted.
- **Database:** MongoDB Atlas M10+ replica set with SSL/TLS encryption.
- **Asset CDN:** Cloudinary CDN for dynamic WebP delivery and automatic responsive image sizing.

## 2. Environment Configuration
- **Backend Configuration (`.env`):**
  - `PORT`: Server listening port (default: 5000)
  - `NODE_ENV`: Runtime mode (`development` / `production`)
  - `MONGODB_URI`: Secure connection string with replica set parameters
  - `JWT_SECRET`: High-entropy key for token signing
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- **Frontend Configuration (`.env`):**
  - `VITE_API_URL`: Backend API base URL
  - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`

## 3. Reliability & Monitoring Standards
- **Health Check Endpoint:** `GET /api/v1/health` providing database connectivity status and process uptime.
- **Logging:** Structured JSON log format via custom Winston/Morgan logger; sensitive credentials and tokens are redacted.
- **Backup & Recovery:** Daily automated MongoDB snapshots; critical file assets persisted to cloud bucket storage.
- **Graceful Shutdown:** Process traps for `SIGTERM` and `SIGINT` to safely drain active connections and close database pools.
