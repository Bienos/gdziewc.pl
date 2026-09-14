# TASK-009 — Recommendation ranking

Status: Complete (2026-09-13)

## Goal

Replace raw nearest-first presentation with a transparent, deterministic recommendation order where distance dominates and small trust/access adjustments can favor a slightly farther, more usable toilet.

## Acceptance criteria

- A pure ranking function assigns a documented score to every nearby candidate.
- Distance is the dominant continuous factor.
- Public access receives a small advantage, unknown access a modest penalty, and restricted access a larger penalty.
- High/medium confidence receive small bounded advantages over low confidence.
- Missing hours/price/facility values never receive positive or negative truth-like treatment.
- Ties resolve deterministically by score, distance, confidence, then canonical ID.
- The nearby API returns results in recommendation order with rank and one explicit recommended flag.
- The marker UI uses API order and visually identifies the recommended marker without auto-selecting it.
- Tests lock scoring constants, important trade-offs, tie-breaks, response validation, and marker semantics.
- No opening-hours computation, personalized preferences, filters, or ML ranking is introduced.

## In scope

- pure documented recommendation scoring/ranking;
- nearby response rank/recommended fields;
- server application of ranking after bounded spatial retrieval;
- recommended marker visual/accessibility state;
- unit, integration/browser regression tests;
- API/project documentation updates.

## Out of scope

- opening status derivation or known-closed handling before TASK-013;
- price/free preference before filters;
- user personalization or learned ranking;
- nearest preview, ETA, detail sheet, navigation, or filters;
- changes to spatial radius/query candidate exclusions.

## Canonical context

- `PRODUCT.md` ranking and distance sections
- `ARCHITECTURE.md` section 9
- `tasks/007-nearby-toilet-api.md`
- `tasks/008-display-nearby-toilets-on-map.md`
- `docs/API.md`
- `PROGRESS.md`

## Likely relevant code

- `lib/toilets/ranking.ts`
- `lib/toilets/nearby.ts`
- `components/map/nearby-markers.tsx`
- `app/globals.css`
- `tests/unit/`
- `tests/integration/nearby.test.ts`
- `tests/e2e/home.spec.ts`

## Constraints

- Scoring constants must be named, documented, and covered by tests.
- Score = distance plus bounded penalties/bonuses; lower is better.
- Use no unknown-as-false or unknown-as-open assumptions.
- Preserve all returned alternatives; ranking must not silently filter them.
- Use canonical ID as the final stable tie-break.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run test:integration` against disposable PostGIS
- `npm run build`
- `npm run test:e2e`
- inspect recommendation ordering on controlled fixtures and real central-Warsaw results
- inspect final scoped changes

## Definition of done

TASK-009 is complete when ranking is transparent and deterministic across API/UI, tests demonstrate distance/trust/access trade-offs without inventing unknown status, documentation is current, and no TASK-010 nearest preview has been implemented.
