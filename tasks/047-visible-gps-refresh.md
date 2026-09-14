# TASK-047 — Visible GPS refresh

**Status:** Complete

## Goal

Give a person browsing the map a clear, always-reachable way to deliberately
request a new browser GPS reading when their current location looks wrong.

## Acceptance criteria

- [x] The map toolbar exposes a literal `ODŚWIEŻ GPS` action after a successful
      location result.
- [x] The action makes one new, explicit high-accuracy browser geolocation
      request and refreshes nearby results from that new reading.
- [x] The existing off-screen action continues to only recenter the saved point
      and does not make a redundant GPS request.
- [x] The control remains usable on a 320px-wide mobile viewport.
- [x] Focused browser coverage, lint, typecheck and production build pass.

## In scope

- Map-toolbar location action copy and behaviour.
- Focused browser coverage for a fresh explicit request.

## Out of scope

- Faking a more precise device position.
- Background location, persistence, sharing or automatic permission prompts.

## Referenced canonical documents

- `PRODUCT.md` sections 2, 5, 13 and 14.
- `BRAND.md` sections 3 and 5.

## Likely relevant code

- `components/location/location-experience.tsx`
- `tests/e2e/home.spec.ts`

## Constraints

- Precise coordinates remain only in component memory and same-origin nearby
  request bodies.
- A geolocation request must stay attached to an explicit visitor action.

## Verification

- Focused Playwright location flow.
- `npm run lint`
- `npm run typecheck`
- `npm run build`
