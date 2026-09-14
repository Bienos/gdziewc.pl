# TASK-045 — Personal location visibility

**Status:** Complete

## Goal

Keep a user's own browser location understandable while browsing the map, and
prefer a current per-device position whenever the user deliberately requests it.

## Acceptance criteria

- [x] Location requests do not reuse a cached position from a prior reading.
- [x] When the real map dot is outside the visible map, a clear blue action
      lets the user return to it.
- [x] The action recentres on the existing in-memory coordinate without a new
      geolocation or nearby request.
- [x] Location access remains opt-in and individual to each browser/device.
- [x] Focused browser coverage, lint, typecheck and production build pass.

## In scope

- Freshness setting for existing user-triggered browser geolocation.
- A geographic off-screen location indicator and existing recenter action.

## Out of scope

- Automatic geolocation permission prompts, location persistence, accounts or
      user-to-user location sharing.

## Referenced canonical documents

- `PRODUCT.md` sections 2 and 5.
- `ARCHITECTURE.md` privacy constraints.

## Likely relevant code

- `components/location/location-experience.tsx`
- `components/map/geographic-warsaw-map.tsx`
- `app/globals.css`
- `tests/e2e/home.spec.ts`

## Constraints

- Every location remains in local component memory only.
- Do not request geolocation before an explicit user action.

## Verification

- Focused Playwright location flow.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Definition of done

- The committed change meets the criteria and records observed checks in
  `PROGRESS.md`.
