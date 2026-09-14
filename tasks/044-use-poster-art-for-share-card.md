# TASK-044 — Use poster art as the share card

**Status:** Complete

## Goal

Use the approved generated street-poster artwork as the actual Open Graph and
social sharing image, replacing the programmatically typeset approximation.

## Acceptance criteria

- [x] The generated poster PNG is stored as a versioned public application
      asset.
- [x] Open Graph and Twitter metadata explicitly reference that asset.
- [x] Shared cards retain the existing title/description while displaying the
      supplied poster artwork.
- [x] The asset is available at a stable same-origin public URL.
- [x] Metadata browser checks, lint, typecheck and production build pass.

## In scope

- Importing the user-approved generated poster asset.
- Root social metadata image configuration and associated test assertions.

## Out of scope

- New image generation, custom-domain work or changes to application UI.
- Location-specific sharing.

## Referenced canonical documents

- `BRAND.md` sections 1 through 6.
- `ARCHITECTURE.md` privacy constraints.

## Likely relevant code

- `public/share/`
- `app/layout.tsx`
- `tests/e2e/seo.spec.ts`

## Constraints

- The public image must be self-hosted; do not depend on a temporary attachment
      path or third-party host.
- Keep all location data out of social metadata.

## Verification

- `npm run test:e2e -- --grep "public landing metadata"`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Fetch the public static asset after deployment.

## Definition of done

- The live metadata serves the approved poster from the stable public path and
  verification evidence is recorded in `PROGRESS.md`.
