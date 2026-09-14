# TASK-005 — Render Warsaw map shell

Status: Complete (2026-09-13)

## Goal

Replace the foundation placeholder with a responsive, branded Warsaw map shell that matches the approved visual direction and gives users a clear starting action without requesting location yet.

## Acceptance criteria

- The root route renders a full-viewport Warsaw map-style canvas on mobile and desktop.
- The shell visibly follows the approved off-white/charcoal/yellow/pink visual system, bold typography, rounded controls, and paper/grid texture.
- A compact brand header and primary `Gdzie jestem` action are present and usable by keyboard.
- Map controls have accessible names, visible focus, and minimum touch targets.
- The layout respects safe areas and remains usable at 320px width and common mobile viewport heights.
- The page contains no automatic/manual geolocation request, toilet markers, nearby API call, recommendation card, detail sheet, or navigation launch.
- External map/tile requests are not introduced before the production provider decision.
- Reduced-motion preferences are respected.
- Unit/browser checks confirm identity, responsive layout, and the absence of premature location behavior.

## In scope

- root page composition and presentational components;
- branded, non-interactive Warsaw map illustration/shell;
- responsive CSS, visual texture, accessible control semantics;
- updated browser smoke tests and visual verification;
- code map/progress documentation.

## Out of scope

- live map SDK or external tiles;
- geolocation permissions or current-position display;
- database access, nearby API, toilet markers, filters, list, details, or routing;
- analytics and production map-provider selection.

## Canonical context

- `BRAND.md`
- `DESIGN.md`
- approved reference `docs/design/reference/gdziekibel-approved-direction.png`
- `PRODUCT.md` sections 4–7
- `ARCHITECTURE.md` presentation and privacy constraints
- `PLAN.md`
- `PROGRESS.md`

## Likely relevant code

- `app/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `components/map/`
- `tests/e2e/home.spec.ts`

## Constraints

- Keep the shell honest: map artwork is decorative until a real map provider is selected.
- Do not imply location has been found or toilet results are loaded.
- Do not access geolocation or precise coordinates.
- Do not add a heavyweight map dependency for a non-interactive shell.
- Keep user-facing copy in Polish.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run test:e2e`
- inspect phone and desktop screenshots against the approved direction
- verify no browser geolocation call or external tile request occurs
- inspect final scoped changes

## Definition of done

TASK-005 is complete when the root route presents a polished, accessible and responsive branded Warsaw map shell with a clear next action, visual/browser checks pass, documentation is current, and no TASK-006 geolocation behavior has been implemented.
