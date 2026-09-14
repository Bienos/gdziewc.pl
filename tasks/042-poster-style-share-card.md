# TASK-042 — Poster-style share card

**Status:** In progress

## Goal

Restyle the generated sharing image as a raw Warsaw street-poster composition,
using the approved pink/yellow/black visual language and the supplied
campaign-style copy.

## Acceptance criteria

- [ ] The card uses the supplied poster as stylistic direction, not as a
      copied image asset.
- [ ] `LEPIEJ ZNALEŹĆ KIBEL NIŻ SIĘ ZESRAĆ!` is the large dominant message.
- [ ] `GDZIEKIBEL.PL` appears prominently on a yellow tape-like label.
- [ ] The 1200×630 generated Open Graph PNG remains readable and valid.
- [ ] Lint, typecheck, production build and visual public-image verification
      pass.

## In scope

- Generated Open Graph image layout, colour, hierarchy and copy.

## Out of scope

- Copying, embedding or redistributing the reference photograph.
- Main site UI, title metadata, custom domain and location behaviour.

## Referenced canonical documents

- `BRAND.md` sections 1 through 6.
- `DESIGN.md` sections 1, 2 and 4.

## Likely relevant code

- `app/opengraph-image.tsx`

## Constraints

- Keep the asset self-contained and server-generated.
- Do not include user location or third-party assets.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Fetch and visually inspect the deployed Open Graph PNG.

## Definition of done

- The committed image is visually verified from the public route and evidence
  is added to `PROGRESS.md`.
