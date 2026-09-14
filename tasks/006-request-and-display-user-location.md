# TASK-006 — Request and display user location

Status: Complete (2026-09-13)

## Goal

Turn the map-shell action into a privacy-conscious, user-initiated geolocation flow that displays the user's position and provides useful denied/unavailable states.

## Acceptance criteria

- Geolocation is requested only after the user activates the primary button.
- While permission/location is pending, the action exposes a clear busy state and cannot issue duplicate requests.
- A successful result renders a familiar blue user-location dot and accuracy halo on the map shell.
- The interface confirms location was found without printing or transmitting precise coordinates.
- Permission denied, unavailable, timeout, unsupported, and generic errors render clear Polish copy and a retry path.
- A manual Warsaw fallback remains available after failure.
- Location stays in browser component state only; it is not written to storage, logs, URLs, analytics, or a server.
- The user can request a fresh position after success.
- Keyboard, screen-reader, 320px layout, and reduced-motion behavior remain usable.
- Deterministic tests cover success and important error mappings.

## In scope

- client-side location controller/component;
- status-to-copy mapping and retry/fallback presentation;
- position dot/accuracy-halo display on the decorative shell;
- unit and browser tests using mocked browser geolocation;
- documentation/state updates.

## Out of scope

- live map centering/projection or external map SDK;
- sending coordinates to the nearby API;
- toilet data/markers, ranking, result cards, filters, or navigation;
- storing precise or approximate location;
- browser permissions-policy/security-header work beyond the feature.

## Canonical context

- `PRODUCT.md` location and privacy requirements
- `BRAND.md` location permission/error copy
- `DESIGN.md` sections 8–9
- `ARCHITECTURE.md` privacy and client/server boundaries
- `tasks/005-render-warsaw-map-shell.md`
- `PROGRESS.md`

## Likely relevant code

- `app/page.tsx`
- `components/location/`
- `app/globals.css`
- `tests/unit/`
- `tests/e2e/home.spec.ts`

## Constraints

- Never request geolocation during render or page load.
- Never persist, log, display, or place coordinates in a URL.
- Use a single current-position request, not continuous watch mode.
- Treat the accuracy radius as approximate; the decorative shell cannot geographically project it yet.
- Keep literal recovery instructions clearer than brand jokes.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run test:e2e` with mocked success and denied geolocation
- inspect phone screenshots for initial, success, and denied states
- verify no coordinates appear in DOM, URL, storage, logs, or requests
- inspect final scoped changes

## Definition of done

TASK-006 is complete when the button triggers a tested user-initiated request, success displays a blue location indicator, errors provide useful recovery without leaking coordinates, documentation is current, and no TASK-007 nearby-toilet API behavior exists.
