# TASK-046 — Location accuracy and live update

**Status:** Complete

## Goal

Make the personal location marker reflect newer browser GPS readings after the
user has explicitly granted location access, and make its uncertainty visible
instead of presenting a fixed decorative radius as exact location.

## Acceptance criteria

- [x] A successful explicit location request starts a private browser position
      watch with high-accuracy and no cached reading.
- [x] New valid readings update the map marker without prompting again,
      persisting coordinates, or sending coordinates to analytics.
- [x] Nearby results refresh only when the real position has materially changed;
      ordinary GPS jitter does not cause repeated requests.
- [x] The marker's blue uncertainty halo represents the latest browser-reported
      accuracy at the current map zoom, with an accessible accuracy label.
- [x] Map panning never changes the stored device coordinate; the marker remains
      geographically attached and an explicit action recentres to it.
- [x] Browser coverage, lint, typecheck and production build pass.

## In scope

- Browser `watchPosition` lifecycle after explicit consent.
- Accuracy-aware marker rendering and factual UI copy.
- Focused location-map regression coverage.

## Out of scope

- Automatic location permission prompts.
- Storing, sharing, analytics, background tracking, or guaranteed GPS hardware
  accuracy.

## Referenced canonical documents

- `PRODUCT.md` sections 2, 5, 13, 14 and 18.
- `ARCHITECTURE.md` privacy constraints.
- `BRAND.md` section 5.2.

## Likely relevant code

- `components/location/location-experience.tsx`
- `components/map/geographic-warsaw-map.tsx`
- `app/globals.css`
- `tests/e2e/home.spec.ts`

## Constraints

- Keep precise coordinates in component memory only.
- Only start location watching after the visitor's explicit action.
- Never claim a browser-provided approximate position is exact.

## Verification

- Focused Playwright location flow.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Definition of done

- The committed change meets the criteria and records observed checks in
  `PROGRESS.md`.
