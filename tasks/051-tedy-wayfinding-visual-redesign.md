# TASK-051 — TĘDY wayfinding visual redesign

**Status:** In progress

## Goal

Recompose the existing GdzieKibel.pl interface as a mobile urban wayfinding
system, making the selected toilet, distance, walking time and direction
immediately scannable without changing product behaviour.

## Acceptance criteria

- [ ] Distance and walking time dominate the selected toilet and detail views.
- [ ] Directional language and signal-yellow actions clearly distinguish the
      recommended destination from secondary toilets.
- [ ] Map markers, controls, filters, list, detail, loading and empty/error
      states use a coherent, high-contrast signage visual language.
- [ ] Existing application behaviours and all data sources remain unchanged.
- [ ] Mobile and wide layouts render without overflow or covered primary CTAs.
- [ ] Lint, typecheck, build and focused browser interaction checks pass.

## In scope

- CSS tokens, typography, layout, visual markup and presentational labels.
- Existing map marker DOM structure only where needed for visual treatment.

## Out of scope

- Backend, database, APIs, URLs, location, search, filters, ranking,
  navigation, analytics and all business logic.

## Referenced canonical documents

- `PRODUCT.md` sections 1, 2, 4, 5 and 7.
- `DESIGN.md` sections 2, 4, 5, 8 and 9.
- `BRAND.md` sections 3 and 5.
- `ARCHITECTURE.md` privacy constraints.

## Likely relevant code

- `app/globals.css`
- `components/map/geographic-warsaw-map.tsx`
- `components/map/nearest-toilet-preview.tsx`
- `components/map/nearby-toilet-list.tsx`
- `components/map/toilet-detail-sheet.tsx`
- `components/map/nearby-toilet-filters.tsx`

## Constraints

- Visual-only changes: preserve all existing handlers, props and data use.
- Do not add mock locations or new navigation behaviour.
- Keep touch targets and accessible names intact.

## Verification

- Focused browser location/map/list/detail/filter checks at 375×812, 390×844,
  430×932, 768px and desktop.
- `npm run lint`, `npm run typecheck`, `npm run build`.
