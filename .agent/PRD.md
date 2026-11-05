# Product Requirements Document (PRD) - Khalil & Sons

## 1. Executive Summary
Khalil & Sons is a high-end luxury jewellery brand web platform designed for discerning clients seeking bespoke jewellery, live bullion/gold market rates, and private atelier appointments.

## 2. Core User Features
- **Curated Gallery & Masterpiece Catalog:**
  - Dynamic categorization: Necklaces, Rings, Bangles, Bridal Sets, Precious Stones.
  - Detail page with high-resolution imagery, hallmark purity verification (`AU · 916.6`), and karat specifications.
- **Bespoke Inquiries & Private Consultations:**
  - Direct inquiry submission for custom jewelry commissions.
  - Interactive appointment booking for private showroom visits.
- **Live Bullion & Gold Rates Terminal:**
  - Real-time gold rate display (24K, 22K, 21K, 18K per tola and gram).
  - Built-in interactive gold price calculator with making charges and wastage computation.
  - Downloadable official PDF rate certificates.
- **Client Vault & Wishlist:**
  - Persistent curation drawer enabling clients to save desired pieces.
- **Client Testimonials & Verified Reviews:**
  - Client review submission and rating showcase.
- **Authentication & User Profiles:**
  - Seamless authentication via Google One-Tap and Email/Password.
  - Client profile management, order history, and saved address book.

## 3. Administrative Capabilities
- **Atelier Dashboard:**
  - High-level business analytics, active inquiries, total inventory, and daily rate history.
- **Masterpiece & Inventory Management:**
  - Create, update, archive, and publish catalog pieces with multi-image Cloudinary upload.
- **Gold Rates Management:**
  - Real-time rate update terminal, automated scraping, broadcast notification modal, and daily digest scheduler.
- **Inquiry & Appointment Triage:**
  - Status progression (New, Contacted, In-Progress, Converted, Closed) with direct email replies.
- **User & Role Administration:**
  - Role management (Client, Staff, Atelier Admin) with security audit logs.

## 4. Non-Functional Requirements
- **Performance:** 90+ Lighthouse score, sub-second route transitions, optimized WebP imagery.
- **Mobile-First Responsiveness:** Flawless UX across smartphones, tablets, and luxury 4K displays.
- **Reliability & Security:** Zero dummy code, end-to-end Zod request validation, JWT session integrity.
