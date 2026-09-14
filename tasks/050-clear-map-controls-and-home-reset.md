# TASK-050 — Clear map controls and home reset

**Status:** Complete

## Goal

Make the active map easier to scan by reducing competing controls, while making
the wordmark an obvious way to return to the clean start screen.

## Acceptance criteria

- [x] The active map keeps the count, GPS refresh, filters and list/map switch
      available without presenting them as a crowded full-width control strip.
- [x] Wide and short viewports keep meaningful clear space between the header,
      controls and map content.
- [x] The wordmark visibly acts as a link and returns to `/`, restoring the
      initial landing journey.
- [x] The landing screen uses a simpler urgent hierarchy: one message, one
      primary action, and an optional manual-map action.
- [x] Existing location, search-area, filter, map/list and accessible fallback
      behaviour is preserved.
- [x] Relevant browser coverage, lint, typecheck and production build pass.

## In scope

- Map header, map toolbar, landing layout and focused browser coverage.

## Out of scope

- New location sources, marker clustering, toilet data changes, navigation,
  accounts or photo collection.

## Referenced canonical documents

- `PRODUCT.md` sections 2 and 13.
- `DESIGN.md` sections 2, 3 and 9.
- `BRAND.md` sections 3 and 5.
- `ARCHITECTURE.md` privacy constraints.

## Likely relevant code

- `app/page.tsx`
- `components/location/location-experience.tsx`
- `app/globals.css`
- `tests/e2e/home.spec.ts`

## Constraints

- Keep exact user location private and in memory only.
- Do not hide the accessible list route behind map-only controls.
- Preserve the existing wordmark destination at `/`.

## Verification

- Focused Playwright map/landing interaction check at mobile and wide shallow
  viewports.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Definition of done

- Acceptance criteria are met, verification evidence is recorded in
  `PROGRESS.md`, the complete diff is reviewed, and the task is committed.
