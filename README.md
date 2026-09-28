# Oynur Bouw B.V. — website + admin panel

Next.js 16 website (Dutch + English) with a built-in admin panel for the portfolio,
company details and social media links. Customers contact you via WhatsApp (no contact form).

## Start (first time)

Requires **Node.js 20.9 or newer** (https://nodejs.org → LTS).

```bash
npm install
npm run setup      # creates .env.local with your admin login (only if it doesn't exist)
npm run dev        # http://localhost:3000
```

- Website: http://localhost:3000 (redirects to `/nl`, English is on `/en`)
- Admin panel: http://localhost:3000/admin — login is in `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## Admin panel

- **Portfolio** → add/edit projects, upload photos (auto-optimized), mark Before/After photos, publish, feature, reorder.
- **Landing pages** → Stucwerk (`/nl/stucwerk`) and Schilderwerk (`/nl/schilderwerk`): texts, main photo, team photos,
  services, prices (+ price calculator), FAQs and SEO. Projects with category Plastering / Painting appear there automatically.
- **Photos, GIFs and videos**: everywhere you can upload a photo you can also upload an animated GIF (stays animated)
  or an MP4/MOV video (plays silently in a loop, like a GIF). Tip for iPhone videos: Settings → Camera → Formats →
  "Most Compatible", so videos are H.264 and play in every browser.
- **Settings** → phone, WhatsApp, email, address, KvK/BTW/IBAN, social media links, homepage/about photos.
  Empty fields fall back to the official company details in `lib/store.ts`.

## Going live

1. In `.env.local` set:
   - `NEXT_PUBLIC_SITE_URL=https://www.your-domain.nl` (important for SEO)
   - a strong `ADMIN_PASSWORD`
   - optional: `GOOGLE_SITE_VERIFICATION` for Google Search Console
2. `npm run build` then `npm start` (port 3000; use `PORT=8080 npm start` to change).
3. Host on any server that runs Node.js with a persistent disk (VPS, e.g. Hetzner/TransIP/DigitalOcean,
   with pm2 or Docker behind nginx/Caddy for HTTPS). Serverless hosts like Vercel are **not** suitable
   as-is, because content is saved to disk.
4. In Google Search Console, submit `https://www.your-domain.nl/sitemap.xml`.
5. Create/claim your **Google Bedrijfsprofiel** (Google Business Profile) with the same name, address and
   phone number as on the website, and add its link in Admin → Settings. This is the #1 factor for local results
   ("badkamer renovatie Haarlem"). Ask happy customers for Google reviews.

## Where is the content stored?

Everything you enter in the admin panel lives in the `storage/` folder:
`storage/db.json` (projects, requests, settings) and `storage/uploads/` (photos, automatically
converted to optimized WebP). **Back up this folder regularly.** Copying it to another server moves all content.

## SEO features

- Dutch primary URLs (`/nl/diensten/badkamer-renovatie`) and English (`/en/services/bathroom-renovation`)
  with `hreflang` + canonical links
- Unique titles/descriptions per page, per project (editable in admin with Google preview)
- Automatic Open Graph / social share images (`/api/og`) and project cover images
- `sitemap.xml` (incl. images, updates automatically), `robots.txt`, web manifest, favicons
- Structured data: GeneralContractor (LocalBusiness) with social profiles (`sameAs`), Service, FAQPage,
  BreadcrumbList, ItemList, CreativeWork
- Static pre-rendering (very fast); pages are rebuilt instantly when you save in admin
- Optimized images (AVIF/WebP, responsive sizes), accessible markup, security headers

## Editing texts

- Service pages (descriptions, FAQs): `lib/services.ts`
- All other website texts (NL + EN): `lib/i18n.ts`
- Colors and fonts: `app/globals.css`
# oynurbouw.nl
# oynurbouw.nl
