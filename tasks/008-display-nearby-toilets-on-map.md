# TASK-008 — Display nearby toilets on map

Status: Complete (2026-09-13)

## Goal

After successful geolocation, call the nearby endpoint and render its canonical toilet results as accessible markers whose visual and selected states remain synchronized.

## Acceptance criteria

- A successful user-initiated location result triggers one POST request to `/api/toilets/nearby` with coordinates in the body.
- Nearby response data is validated before rendering.
- Returned toilets render as high-contrast, signage-style marker buttons around the user dot without an external map/tile dependency.
- Marker placement is deterministic from user/destination coordinate offsets and safely clamped to the visible map region.
- Selecting a marker visually distinguishes it beyond colour and exposes a compact literal label/distance summary.
- Only one marker is selected at a time; keyboard activation and pointer activation use the same state.
- New location results clear stale markers/selection before loading replacement results.
- Empty and service-error states are honest and offer retry without losing the location state.
- User coordinates remain POST-body/in-memory only and are not printed, persisted, logged, or placed in URLs.
- Browser tests cover loading/success, marker count, selection synchronization, empty/error, and privacy.

## In scope

- client nearby fetch after location success;
- deterministic local marker projection for the decorative shell;
- accessible marker visual/selected state and compact selection label;
- result loading/empty/error states and retry;
- unit/browser tests and documentation updates.

## Out of scope

- live basemap SDK, pan/zoom, clustering, or geographical viewport fitting;
- recommendation scoring beyond API order;
- full nearest preview/detail sheet/list view;
- opening-status derivation, filters, radius expansion, or navigation;
- caching or background location watching.

## Canonical context

- `DESIGN.md` map marker language
- `PRODUCT.md` FR-03/FR-04
- `ARCHITECTURE.md` nearby and privacy contracts
- `tasks/006-request-and-display-user-location.md`
- `tasks/007-nearby-toilet-api.md`
- `docs/API.md`
- `PROGRESS.md`

## Likely relevant code

- `components/location/location-experience.tsx`
- `components/map/`
- `lib/map/`
- `lib/toilets/nearby.ts`
- `app/globals.css`
- `tests/unit/`
- `tests/e2e/home.spec.ts`

## Constraints

- Do not add external tile/map requests before provider selection.
- Do not claim decorative projection is turn-by-turn map accuracy.
- Cap rendered markers to the API maximum and preserve source response order.
- Selection must use canonical toilet IDs.
- Do not expose user coordinates to DOM, URL, storage, analytics, or logs.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run test:e2e` with mocked geolocation and nearby responses
- inspect phone screenshots with markers and selected state
- verify request method/body and absence of coordinate leakage outside that body
- inspect final scoped changes

## Definition of done

TASK-008 is complete when nearby data loads only after location success, renders as accessible synchronized markers with honest loading/empty/error states, privacy and browser checks pass, documentation is current, and no TASK-009 recommendation ranking is implemented.
