# TASK-031 — Geographic Warsaw map remediation

Status: Complete (2026-09-14)

## Goal

Resolve TASK-030's release blocker by replacing result placement on the decorative illustration with a real, interactive MapLibre Warsaw map and a useful no-location manual browsing path, without weakening location privacy or the accessible list journey.

## Acceptance criteria

- MapLibre GL JS renders a real geographic Warsaw basemap from an explicitly documented, production-usable OSM-compatible style provider.
- The provider/style URL remains configurable, never uses the public OpenStreetMap tile servers, and has a documented privacy/availability fallback.
- Map code and external tile traffic are lazy: neither loads before the user shares location or deliberately opens the manual Warsaw map.
- Successful geolocation centers the map on the in-memory position and displays the position plus toilet markers at their real coordinates.
- Marker selection uses canonical toilet IDs and stays synchronized with the existing list and detail sheet.
- Map pan/zoom is usable by pointer and keyboard, includes labelled controls, and retains the accessible list equivalent.
- Permission-denied/outside/unsupported/error states can deliberately open a central Warsaw map and load central results without presenting the fixed browse point as the user's location.
- Provider failure leaves the core list/results and recovery actions usable and never fabricates map availability.
- Precise user location remains absent from URLs, storage, analytics, error records and provider URLs; the provider receives ordinary map tile requests only after activation.
- Existing 320px, reduced-motion, security-header and initial performance budgets continue to pass.

## In scope

- MapLibre dependency and same-origin worker setup;
- lazy geographic map component, controls, real-coordinate user/toilet markers and viewport fitting;
- manual central-Warsaw browse activation and results;
- configurable map style/provider policy, CSP and attribution/privacy documentation;
- focused unit/browser tests and existing release regression checks;
- roadmap, code map and progress updates.

## Out of scope

- route drawing or turn-by-turn navigation;
- search by typed address, reverse geocoding, clustering or live location tracking;
- MapTiler/other paid account creation or staging secrets;
- source ingestion/deduplication changes;
- staging deployment, production promotion or monitoring setup.

## Canonical context

- `PRODUCT.md` sections 5–7, FR-02–FR-06, privacy, accessibility and performance requirements
- `ARCHITECTURE.md` map rendering, location privacy, caching, security and deployment boundaries
- `DESIGN.md` experience hierarchy, map, marker, accessibility and responsive rules
- `tasks/005-render-warsaw-map-shell.md`
- `tasks/008-display-nearby-toilets-on-map.md`
- `tasks/030-independent-release-review.md`
- `docs/API.md`
- `PROGRESS.md`

## Likely relevant code

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/location/location-experience.tsx`
- `components/map/`
- `lib/map/`
- `next.config.ts`
- `.env.example`
- `tests/e2e/`
- `tests/performance/`

## Constraints

- Keep the approved poster/map visual identity above the basemap rather than replacing the product shell with generic map chrome.
- Do not activate map tiles or request browser location automatically.
- Do not use MapLibre's tracking geolocation control; the existing deliberate one-shot location flow remains authoritative.
- Do not expose the MapTiler or another paid-provider key in committed files; client map keys, if later used, must be domain-restricted.
- Keep OSM/OpenMapTiles attribution visible and provider terms documented.
- Do not start TASK-032.

## Verification

- focused unit tests for map configuration and activation semantics
- browser tests for lazy loading, real-coordinate markers, manual browse, selection synchronization, provider failure and location privacy
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run test:e2e`
- `npm run build`
- `npm run test:performance`
- inspect 390px and 320px activated-map screenshots
- inspect scoped changes and documentation

## Definition of done

TASK-031 is complete when activated journeys use a real geographic MapLibre Warsaw map with real-coordinate markers, manual browsing works without claiming a user position, provider/privacy/failure behavior is documented, all required checks pass, TASK-030's map blocker is resolved, and staging work has not begun.

## Verification evidence

- MapLibre GL JS 6.9 renders the OpenFreeMap Liberty style with the matching worker modules served from this application origin.
- The landing page retains the lightweight decorative artwork and makes no provider request before a deliberate location or manual-map action.
- Successful location uses a real geographic user marker and real-coordinate toilet markers; MapLibre viewport fitting, pan/zoom and labelled controls replace the old clamped illustration projection.
- Manual browsing is available even before a location attempt. It loads central-Warsaw results at the documented fixed point/10 km radius, shows no user marker and labels the result state `TRYB RĘCZNY`.
- Provider failure is explicit and preserves the list, details and navigation flow. The existing list remains the keyboard-accessible equivalent to map markers.
- OpenFreeMap terms, lack of SLA, attribution, CDN/network-metadata handling and configurable replacement path are recorded in ADR-0002, README and data-source documentation.
- Live visual inspection at 390×844 and 320×640 showed real Warsaw streets/Wisła, controls and attribution with no horizontal overflow or browser console errors.
- Final checks passed: lint, typecheck, 20 unit files/71 tests, 11 Chromium scenarios, 3 real-PostGIS files/9 tests, one production mobile performance test, one production real-PostGIS journey, production build and online dependency audit with zero vulnerabilities.
- The superseded decorative marker component/projection and its three-test unit suite were removed after the geographic path passed.
