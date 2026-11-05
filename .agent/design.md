# Design Specifications - Khalil & Sons Luxury Atelier

## 1. Aesthetic & Visual Design Philosophy
- **Brand Archetype:** Heritage luxury atelier & fine bespoke jewellery.
- **Visual Identity:** Clean, timeless elegance, fine gold foil accents, high contrast typography, and authentic assay hallmark stamps.
- **Typography:**
  - Display / Headlines: Newsreader (Editorial Serif)
  - Interface / Body: Work Sans (Neutral Geometric Sans)
- **Palette & Tokens:**
  - Primary Gold Accent: `#c1a162` (Subtle Metallic Gold)
  - Deep Bronze Gold: `#755a23` (Antique Gold)
  - Canvas / Background: `#f9f9f9` (Pristine Soft Cream)
  - Surface Cards: `#ffffff` (Crisp White)
  - Deep Slate / Text: `#2d3435` (Deep Charcoal Black)
  - Muted Slate: `#5a6061` (Secondary Subtext)
  - Border Accents: `#e4e4e7` (Hairline Neutral Border)

## 2. Iconography & Card Design Rules
- **No Generic AI Icon Containers:** Never use generic rounded SaaS icon boxes (e.g. `size-10 rounded-xl bg-muted/60`).
- **Luxury Hallmark Stamps:** Replace generic badges with real assay stamps:
  - 24K Gold: `AU · 999.0`
  - 22K Gold: `AU · 916.6`
  - 18K Gold: `AU · 750.0`
  - 925 Silver: `AG · 925.0`
- **Fine Borders:** 1px hairline borders with subtle hover transitions.

## 3. Frontend Architecture
- **Component Hierarchy:**
  - `src/user/`: Customer-facing storefront
    - Pages: `UserPanel`, `GalleryPage`, `GalleryDetailPage`, `ReviewsPage`, `RatesPage`, `AboutUsPage`, `ContactPage`, `AuthPage`
    - Components: Header/Navbar, Hero, HeritageStory, FeaturedMasterpieces, HistoricAtelier, Footer, Modals (Search, CartDrawer, AppointmentModal)
  - `src/admin/`: Master administrative atelier
    - Dashboard metrics, Gallery management, Reviews moderation, Rates controller, Users table, Inquiries manager
  - `src/components/ui/`: Shadcn UI primitives built on Radix UI.
  - `src/context/`: Central state management.

## 4. Backend Architecture
- **Layered Structure:**
  - `src/routes/`: Route declarations and endpoint bindings.
  - `src/modules/`: Feature-isolated domain modules (Controller -> Service -> Repository -> Model).
  - `src/middlewares/`: Auth (Firebase + JWT), Error handler, Rate limiting, Uploads, Zod validator.
  - `src/utils/`: Standard API response envelopes, formatters, and mailers.
