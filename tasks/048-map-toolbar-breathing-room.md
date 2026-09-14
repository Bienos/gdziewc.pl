# TASK-048 — Map toolbar breathing room

**Status:** Complete

## Goal

Make the active-map header and result controls easy to scan on wide, shallow
screens without compromising the compact mobile map flow.

## Acceptance criteria

- [x] Brand/city header and result controls have deliberate visual separation.
- [x] Map controls retain clear tap/click targets and do not collapse into a
      dense single row on wide, shallow screens.
- [x] The area-search action remains reachable without overlapping the toolbar.
- [x] Existing mobile 320px layout remains usable.
- [x] Focused browser coverage, lint, typecheck and production build pass.

## In scope

- Active map header/toolbar layout and responsive CSS.
- Focused viewport coverage.

## Out of scope

- Changing map results, filters, location or map interaction behaviour.

## Referenced canonical documents

- `PRODUCT.md` sections 2 and 5.
- `DESIGN.md` map/mobile interaction guidance.
- `BRAND.md` sections 3 and 5.

## Likely relevant code

- `app/page.tsx`
- `components/location/location-experience.tsx`
- `app/globals.css`
- `tests/e2e/home.spec.ts`

## Verification

- Focused browser viewport coverage.
- `npm run lint`
- `npm run typecheck`
- `npm run build`
