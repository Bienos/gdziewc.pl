# TASK-043 — Reliable visible location marker

**Status:** Complete

## Goal

Make the user's browser-location marker easy to see and ensure the `TU JESTEM`
action reliably recentres it even when a location result arrives before the map
finishes loading.

## Acceptance criteria

- [x] A requested recenter is applied after MapLibre reports that the map is
      loaded, not lost during map startup.
- [x] The location dot and accuracy halo are more visually prominent than
      surrounding map detail.
- [x] No new geolocation request, nearby request or location persistence is
      added.
- [x] Focused browser coverage, lint, typecheck and production build pass.

## In scope

- Map readiness condition for the existing recenter effect.
- Existing location-marker presentation.

## Out of scope

- Continuous tracking, changing browser location accuracy, map-provider
      changes, or marker clustering.

## Referenced canonical documents

- `PRODUCT.md` sections 2 and 5.
- `DESIGN.md` sections 2 and 3.
- `ARCHITECTURE.md` privacy constraints.

## Likely relevant code

- `components/map/geographic-warsaw-map.tsx`
- `app/globals.css`
- `tests/e2e/home.spec.ts`

## Constraints

- The marker remains pinned to the last in-memory browser coordinate.
- Do not render or transmit raw coordinates.

## Verification

- Focused location Playwright check.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Definition of done

- The change is committed with factual verification evidence in `PROGRESS.md`.
