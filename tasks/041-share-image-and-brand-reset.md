# TASK-041 — Visible share image and brand reset

**Status:** Complete

## Goal

Ensure the live Vercel site serves its generated share image from a reachable
address, and make the brand mark a reliable way to restart the landing flow.

## Acceptance criteria

- [x] The live page's Open Graph image URL resolves from the actual public
      site host, so sharing services can fetch the branded image.
- [x] The sharing image has a prominent `GDZIEKIBEL.PL` mark and large urgent
      copy ending with an exclamation mark.
- [x] The shared title also ends with an exclamation mark.
- [x] Clicking the GdzieKibel.pl brand mark returns to `/`, resetting the
      in-memory landing flow.
- [x] SEO/brand regression coverage, lint, typecheck and production build
      pass.

## In scope

- Public base URL metadata for the currently deployed site.
- Open Graph title/image copy and logo hierarchy.
- Brand link reset behaviour and targeted browser assertions.

## Out of scope

- Custom-domain purchase, DNS connection or verification.
- Per-location sharing and persistent session state.

## Referenced canonical documents

- `PRODUCT.md` sections 1, 2 and 5.
- `BRAND.md` sections 3, 4 and 6.
- `ARCHITECTURE.md` privacy constraints.

## Likely relevant code

- `app/layout.tsx`
- `app/opengraph-image.tsx`
- `app/page.tsx`
- `tests/e2e/seo.spec.ts`
- `tests/e2e/home.spec.ts`

## Constraints

- Do not place a user location in share metadata or URLs.
- Keep the visible brand name independent from the deployment host.

## Verification

- Focused SEO and home-page Playwright checks.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Definition of done

- The committed implementation meets the acceptance criteria and the observed
  checks are recorded in `PROGRESS.md`.
