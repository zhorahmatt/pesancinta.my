 # Pesan Cinta Landing Pages

Landing page project for Pesan Cinta and The Inner Compass Workshop. Built as a Vite React app with static route metadata for social sharing.

## Pages

- `/` — Pesan Cinta home page.
- `/the-inner-compass-workshop/` — The Inner Compass Workshop landing page.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Node test runner
- ESLint

## Getting Started

Install dependencies:

```bash
npm install
```

Run local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Run tests:

```bash
npm test
```

Run lint checks:

```bash
npm run lint
```

## Project Structure

```text
src/
  components/   Shared UI components
  content/      Landing page content and localization
  lib/          Shared utilities and tracking helpers
  pages/        Route-level page components
public/         Static images and media
```

## Supabase CMS Setup

The CMS MVP will use Supabase for admin authentication, workshop data, registrations, payment methods, and private uploads.

Create a Supabase project, then copy `.env.example` to `.env` and fill values from Supabase project settings → API:

```bash
cp .env.example .env
```

Required values:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not commit real `.env` values or service-role keys. Service-role keys must only live in server-side functions if needed later.

## Localization

The workshop page supports Bahasa Malaysia, Bahasa Indonesia, and English. Bahasa Malaysia is the default language. The selected language is saved in `localStorage`.

## Analytics and Tracking

Google Analytics is installed through the HTML entry files. CTA clicks are pushed to `window.dataLayer` with the `cta_click` event.

## Social Sharing Metadata

The project uses separate HTML entry files so social crawlers can read different metadata per route:

- `index.html` for the home page.
- `the-inner-compass-workshop/index.html` for the workshop page.

Workshop social preview image currently uses `https://pesancinta.my/g17.jpeg`.

## Deployment Notes

The Vite build outputs separate HTML files for each route. Vercel rewrites explicitly route `/the-inner-compass-workshop` and `/the-inner-compass-workshop/` to the workshop HTML entry.

After changing social metadata, WhatsApp and other platforms may keep cached previews. Test with a new query string, for example:

```text
https://pesancinta.my/the-inner-compass-workshop/?v=2
```
