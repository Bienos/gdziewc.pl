# TASK-011 — Toilet detail sheet

Status: Complete (2026-09-14)

## Goal

Turn marker selection into a usable, accessible detail sheet that presents the selected toilet’s known canonical metadata and makes uncertainty explicit.

## Acceptance criteria

- Selecting a marker opens a bottom detail sheet for that canonical toilet.
- The sheet shows name, distance, approximate ETA, qualified access, price, opening-status uncertainty, accessibility/facility states and confidence.
- Each unknown value is labelled as unknown rather than omitted or rendered as false/open/free.
- Sheet data is sourced only from the validated nearby response; raw source payload and user coordinates are never exposed.
- The sheet has a clear close action, keyboard focus behavior, readable semantics and does not trap interaction with the map incorrectly.
- Closing restores map context and marker selection state predictably.
- The recommended preview remains independent and visible behind/alongside selection only where mobile space allows.
- Mobile content remains scrollable without viewport overflow at 320px.
- Unit/browser tests cover selection, known/unknown rendering, close/reopen and location privacy.

## In scope

- selected-toilet detail-sheet component and styles;
- display helpers for qualified/unknown metadata;
- integration with marker selection/close state;
- unit/browser coverage and documentation.

## Out of scope

- external walking navigation (TASK-012);
- opening-hours parsing/current status (TASK-013);
- price amount parsing (TASK-014);
- reports, list, filters or persistence of selection.

## Constraints

- Do not invent facility/access/price/opening values from missing fields.
- Keep detail-sheet data in current client state; do not create a public detail route.
- Use selected canonical ID from markers.
- Do not expose precise user coordinates, raw payload or source URLs.

## Verification

- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run test:e2e with selected known/unknown fixtures and close/reopen
- inspect 390px and 320px sheet screenshots
- inspect final scoped changes

## Definition of done

TASK-011 is complete when marker selection opens a responsive, honest, accessible detail sheet with known/unknown metadata and reliable close/reopen behavior, all checks pass, and no TASK-012 navigation flow exists.
