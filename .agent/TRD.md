# Technical Requirements Document (TRD) - Khalil & Sons

## 1. Technology Stack
- **Frontend:**
  - Runtime & Build: React 19, Vite 8
  - Styling: Tailwind CSS 4, shadcn/ui components (Radix UI primitives)
  - Animation: GSAP 3, Framer Motion
  - Language: Pure JavaScript / JSX (`.js`, `.jsx`). TypeScript is strictly prohibited.
  - Toast & Notifications: Sonner
- **Backend:**
  - Runtime: Node.js (ES Modules, `type: module`)
  - Framework: Express 5
  - Database & ODM: MongoDB via Mongoose 9
  - Authentication: Firebase Admin SDK + JWT (jsonwebtoken 9)
  - File Storage: Multer + Cloudinary SDK
  - Validation: Zod 4
  - Scheduling: node-cron
  - Mailing: Nodemailer

## 2. Code Quality & Architectural Boundaries
- **Comment-Free Codebase:** All production code must be completely free of inline and block comments.
- **Server File Size Limit:** Server files must strictly remain under 120 lines. Logic must be decomposed into dedicated controllers, services, repositories, and models.
- **Frontend Modular Decomposition:** Components must remain under 500 lines and be cleanly isolated into single-responsibility units.
- **Native Dialog Prohibition:** Native `window.alert()` and `window.confirm()` are forbidden. Custom, accessible modals must be used for confirmations and critical actions.

## 3. API Contract & Response Format
All backend endpoints must return a standardized response envelope:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {}
}
```
Error envelopes must provide structured debugging context without exposing stack traces in production:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errors": []
}
```

## 4. Security & Hardening Protocols
- Rate limiting on public and sensitive authentication endpoints (`express-rate-limit`).
- Strict CORS whitelist configuring authorized atelier domains.
- JWT verification middleware validating bearer tokens with automatic session expiration handling.
- Input sanitization and payload constraint enforcement via Zod schema parsers.
