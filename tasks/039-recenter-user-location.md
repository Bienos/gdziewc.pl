# TASK-039 — Recenter user location on the map

**Status:** Complete

## Goal

Make it clear that the blue dot represents the last browser-provided position,
and let a user return the map to that position after browsing elsewhere.

## Acceptance criteria

- [x] The location marker stays bound to the last in-memory browser location
      while the user pans or zooms the map.
- [x] A clear `TU JESTEM` control recenters the map on that marker without
      requesting geolocation again or sending another nearby-search request.
- [x] The existing area-search control remains available after a user moves
      the map.
- [x] Precise location remains in component memory only.
- [x] Focused browser coverage, lint, typecheck and production build pass.

## In scope

- Stable browser-location marker input.
- A map recenter control and its accessible label.
- Regression coverage for the control.

## Out of scope

- Continuous GPS tracking or background location updates.
- Changing the nearby-search API, map provider or map gestures.
- Persisting/sharing location or adding navigation routing.

## Referenced canonical documents

- `PRODUCT.md` sections 2 and 5.
- `DESIGN.md` sections 2 and 3.
- `ARCHITECTURE.md` location/privacy constraints.

## Likely relevant code

- `components/location/location-experience.tsx`
- `components/map/geographic-warsaw-map.tsx`
- `app/globals.css`
- `tests/e2e/home.spec.ts`

## Constraints

- Do not persist, log, render as text, or transmit precise coordinates.
- Recentring must use the current in-memory browser position only.

## Verification

- Focused Playwright location journey.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Definition of done

- The committed change meets every acceptance criterion and `PROGRESS.md`
  records observed verification evidence.
