# TASK-040 — Share preview and local map zoom

**Status:** Complete

## Goal

Make shared links immediately communicate the product in its own voice and
start a successful location search with a closer, useful view of the user's
neighbourhood.

## Acceptance criteria

- [x] The document, Open Graph and social-card titles identify `GdzieKibel.pl`
      and use the approved urgent-finding message.
- [x] The Open Graph image has matching accessible alt text and on-image copy.
- [x] After browser location is accepted, the initial map centres on that
      location at a close neighbourhood zoom while retaining nearby results.
- [x] Recentring uses the same close local zoom.
- [x] No browser coordinates are persisted, exposed in metadata or sent to any
      additional service.
- [x] SEO regression coverage, lint, typecheck and production build pass.

## In scope

- Root page social metadata and generated Open Graph image copy.
- Initial and explicit-recenter MapLibre zoom behaviour.
- Relevant SEO/browser regression coverage.

## Out of scope

- Buying, connecting or changing the DNS for the `gdziekibel.pl` domain.
- Per-toilet sharing or location-specific previews.
- Changing nearby API search radius or continuous location tracking.

## Referenced canonical documents

- `PRODUCT.md` sections 1, 2 and 5.
- `BRAND.md` sections 3, 4 and 6.
- `ARCHITECTURE.md` privacy constraints.

## Likely relevant code

- `app/layout.tsx`
- `app/opengraph-image.tsx`
- `components/map/geographic-warsaw-map.tsx`
- `tests/e2e/seo.spec.ts`

## Constraints

- Social metadata must not contain a user location.
- Keep the title clear enough to work outside the product UI.

## Verification

- SEO Playwright check.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Definition of done

- The committed change meets the acceptance criteria and `PROGRESS.md` records
  observed verification evidence.
