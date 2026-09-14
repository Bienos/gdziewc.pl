# TASK-034 — Mobile map clarity and landing page

**Status:** Complete (local quality and focused browser verification passed)
**Milestone:** Post-launch refinement

## Goal

Make GdzieKibel.pl easier to understand and use at a glance on a phone: add a
clear branded landing page and reduce visual crowding in the active map journey.

## Acceptance criteria

- [x] First open presents a focused landing page that states what the service
      does, explains the three-step journey and has one clear location CTA.
- [x] The landing retains the approved poster/street-sign visual language:
      paper, black, yellow and restrained pink accents, direct Polish copy and
      bold typography.
- [x] The active map uses one compact top toolbar rather than permanently
      expanded count, filters and view controls.
- [x] Filters are available on demand in an accessible panel; active filters
      and clearing them remain clear.
- [x] Initial map marker density is reduced without hiding access to every
      result through the list or map interaction.
- [x] The recommendation card is compact enough to preserve useful map context
      and keeps the primary next action prominent.
- [x] Existing location, manual Warsaw, list, detail, navigation, privacy and
      mobile-accessibility journeys continue to work.
- [x] Automated coverage demonstrates the new landing/toolbar flow; all
      relevant quality checks pass.

## In scope

- Landing page composition and branded explanatory content.
- Mobile map overlays, result controls, filters and marker presentation.
- Targeted responsive styles and regression tests.

## Out of scope

- New sources, maps, location storage or data-model changes.
- Changing the active public map provider.
- Rewriting toilet ranking or navigation behaviour.
- New photo/illustration generation or use of the supplied reference collage as
  a production image asset.

## References

- `PRODUCT.md` sections 1–7
- `DESIGN.md` sections 2, 4–10 and 14
- `BRAND.md` sections 1–6
- `docs/adr/0002-map-renderer-and-default-tile-provider.md`

## Likely relevant implementation

- `app/page.tsx`, `app/globals.css`
- `components/location/location-experience.tsx`
- `components/map/geographic-warsaw-map.tsx`
- `components/map/nearby-toilet-filters.tsx`
- `components/map/nearest-toilet-preview.tsx`
- `tests/e2e/home.spec.ts`, `tests/e2e/accessibility.spec.ts`

## Constraints

- Keep the first location request user-initiated and do not persist precise
  location.
- Keep list view as an accessible full equivalent to the map.
- Keep all interactive targets at least 44 px on mobile.
- Treat the supplied phone montage as visual direction only; do not embed a
  screenshot of a reference design as the product interface.

## Verification

- Add/update focused browser tests for the landing, toolbar and filters.
- Run lint, typecheck, unit/browser tests and production build.
- Inspect the 360–430 px mobile layout for overlap and usable map context.

## Definition of done

TASK-034 is complete when the new landing and uncluttered mobile map controls
are implemented, verified and recorded in `PROGRESS.md`.
