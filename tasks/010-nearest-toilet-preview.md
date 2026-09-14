# TASK-010 — Nearest toilet preview

Status: Complete (2026-09-14)

## Goal

Show a compact, honest bottom preview for the recommended nearby toilet so a user can immediately understand where it is, roughly how long it may take to walk, and which facts are currently known.

## Acceptance criteria

- When nearby results load, a single bottom preview represents the API-designated recommended toilet.
- The preview shows the canonical name, rounded distance, an explicitly approximate walking ETA, a status placeholder that does not fabricate opening state, and price/free/unknown state.
- ETA is computed through a pure, documented function from straight-line distance with a conservative walking multiplier and is always labelled approximate.
- Unknown opening status is visibly and textually unknown until TASK-013; it is never styled as open.
- Price uses the current qualified source state without inventing a monetary amount.
- No result, nearby-fetch error, location error, and loading states do not show stale preview data.
- The preview has clear semantics, adequate touch/keyboard behavior, and fits 320px-wide mobile viewports.
- The marker selection state remains independent of the recommended preview.
- Unit and browser tests cover ETA rounding, known/unknown state labels, recommended selection and stale-state clearing.

## In scope

- pure approximate walking-time and preview-label helpers;
- recommended preview component and responsive styling;
- integration with existing nearby result state;
- unit/browser tests and project documentation.

## Out of scope

- live route/ETA provider, navigation action, or external maps;
- opening-hours parsing or current OPEN/CLOSED calculation;
- price amount parsing or user price filters;
- selected-toilet detail sheet, list view, filters or user reports.

## Canonical context

- PRODUCT.md sections 11–12 and FR-04/FR-05
- DESIGN.md section 9.3
- ARCHITECTURE.md sections 9–11
- tasks/008-display-nearby-toilets-on-map.md
- tasks/009-recommendation-ranking.md
- docs/API.md
- PROGRESS.md

## Likely relevant code

- components/map/nearest-toilet-preview.tsx
- components/location/location-experience.tsx
- lib/toilets/preview.ts
- app/globals.css
- tests/unit/
- tests/e2e/home.spec.ts

## Constraints

- Use the API isRecommended flag; do not recompute ranking in the client.
- ETA must be presented as approximate and based on a named conservative formula.
- Treat current opening state as unknown at this milestone, even if openingHoursRaw exists.
- Keep qualified price state literal: free, paid or unknown.
- Do not include precise user coordinates in UI, storage, URLs, analytics or logs.

## Verification

- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run test:e2e with mocked API result, empty and error states
- inspect 390px and 320px preview screenshots
- inspect final scoped changes

## Definition of done

TASK-010 is complete when the recommended result has a responsive, honest preview with approximate ETA/status/price semantics, stale states cannot leak through, checks pass and no TASK-011 detail or TASK-012 navigation behavior exists.
