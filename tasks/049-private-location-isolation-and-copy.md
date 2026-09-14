# TASK-049 — Private location isolation and recovery copy

**Status:** Complete

## Goal

Prove that separate visitors use independent browser-provided locations and
make the off-screen location recovery action clearer.

## Acceptance criteria

- [x] The off-screen map action reads `WRÓĆ DO MOJEJ LOKALIZACJI`.
- [x] Browser coverage proves two independent browser sessions render their own
      location accuracy state and do not share location through storage.
- [x] The existing recovery action still recentres the same local coordinate
      without requesting another position.
- [x] Lint, typecheck and production build pass.

## In scope

- Off-screen location action copy.
- Multi-session browser privacy regression coverage.

## Out of scope

- Fabricating a device GPS reading or persisting a manual location.
- Accounts, location sharing, analytics or background tracking.

## Referenced canonical documents

- `PRODUCT.md` sections 2, 13 and 14.
- `ARCHITECTURE.md` privacy constraints.
- `BRAND.md` sections 3 and 5.

## Likely relevant code

- `components/map/geographic-warsaw-map.tsx`
- `components/location/location-experience.tsx`
- `tests/e2e/home.spec.ts`

## Verification

- Focused Playwright multi-session browser coverage.
- `npm run lint`
- `npm run typecheck`
- `npm run build`
