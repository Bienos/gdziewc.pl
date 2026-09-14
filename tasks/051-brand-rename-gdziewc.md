# TASK-051 — Rename brand to GDZIEWC.PL

**Status:** Complete

## Goal

Rename the visible product brand and canonical public domain from
GdzieKibel.pl to GDZIEWC.PL / gdziewc.pl.

## Acceptance criteria

- [x] The visible wordmark and accessible brand label read GDZIEWC.PL.
- [x] Page metadata, canonical URL, robots and sitemap use gdziewc.pl.
- [x] Existing application logic, APIs, routes and map behaviour are unchanged.
- [x] Vercel has gdziewc.pl attached to the production project and DNS records
      required for verification are known.
- [x] Lint, typecheck and production build pass.

## In scope

- Brand copy, metadata, public-domain configuration and package/readme name.

## Out of scope

- Backend/data changes, feature work, visual redesign, or a new share image.

## Referenced canonical documents

- `PRODUCT.md` section 1.
- `BRAND.md` sections 1 and 3.

## Likely relevant code

- `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `components/location/home-reset-link.tsx`
