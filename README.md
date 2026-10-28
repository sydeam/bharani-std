# Bharani Studio

A mobile-first Astro landing page using the supplied PRIMARY sage-and-ivory identity and original studio photographs.

## Run locally

Requires Node.js 22.12 or newer.

```powershell
npm ci
npm run dev
```

The dev script uses `astro dev --background`. Manage it with `npx astro dev status`, `npx astro dev logs`, and `npx astro dev stop`.

```powershell
npm run check
npm run build
```

The production site is generated in `dist/`. It can be served by any static host.

## GitHub Pages

Yes. This project is configured for GitHub Pages. The workflow at `.github/workflows/deploy-pages.yml` builds the static `dist/` folder and deploys it whenever you push to `main`.

Create a GitHub repository, copy this folder into it, then push:

```powershell
git init
git add .
git commit -m "Build Bharani Studio landing page"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

In the repository's Settings → Pages, set the source to **GitHub Actions**. The workflow automatically handles the correct path for both a project page (`username.github.io/repository-name`) and a user page (`username.github.io`).

The site is already static, so it does not need a Node server on GitHub Pages. The WhatsApp form remains client-side and opens a prepared message for the visitor to review and send.

## Contents and interactions

- Fixed trust strip and responsive navigation.
- Supplied brand monogram and a sage hero with original wedding photography.
- Wedding, baby, maternity and corporate portfolio filters.
- Keyboard-accessible photo viewer with previous/next navigation.
- Four supplied testimonials, with no invented client names.
- Expandable services, studio story, travel locations and contact section.
- WhatsApp enquiry form, click-to-call links, Instagram and Google Maps.
- Sticky mobile enquiry bar, visible focus states, reduced-motion support, privacy dialog and SEO metadata.
- Self-hosted fonts, responsive WebP photographs and lazy loading.

## Editing

- Page content: `src/pages/index.astro`
- Theme and responsive layout: `src/styles/global.css`
- Interactions and enquiry tracking: `src/scripts/main.ts`
- Image component: `src/components/Photo.astro`
- Photographs and logo: `public/images/`

The content comes from the supplied Google document:
https://docs.google.com/document/d/1HnUsXieE-lI51N6ztScM2ay58SrbmMKJnrYSzENHAhI/edit

The photography, phone number (+91 99089 96227), and Instagram link come from:
https://bharanistudio.lovable.app/

The document's trust statement and establishment date are retained. Testimonial names were not supplied, so quotes are attributed generically. The source gallery has no corporate photographs: that filter offers an enquiry instead of presenting unrelated images as corporate work.

## Enquiries and advertising

The form validates locally and opens WhatsApp with a prepared message. The visitor must review and send it. There is no backend database and no false submission-success state.

The page retains UTM parameters for the current browser session and emits `bharani_enquiry_intent` to `window.dataLayer`, plus a `bharani:enquiry` CustomEvent. Only channel, shoot type and campaign metadata are included; names, phone numbers and message contents are excluded. This is an intent event, not a confirmed lead or booking.

No Meta Pixel or Google Analytics account is configured. Add the appropriate account-specific integration and consent behavior before using campaign conversion reporting. Update `site` in `astro.config.mjs` when using a custom domain. The Sites publication is owner-private until its sharing is explicitly changed; public ad traffic requires public hosting.

## Verification

`node scripts/qa.mjs` runs a local Chrome check against localhost:4321, covering widths 320, 390, 768 and 1440, image loading, overflow, single-page anchor navigation with no hamburger menu, filters, lightbox, testimonials, validation, WhatsApp message preparation and the privacy dialog. It intercepts the WhatsApp window and does not send a message. It uses the installed Windows Chrome path, which can be changed for another machine.

Screenshots and results are generated in ignored `qa/`.

The optional asset preparation scripts use the original logo at `D:/LIGHT.jpg.jpeg`. They are not required to run or build the site; all prepared assets are included.
