# TASK-013 — Opening-hours normalisation/status

Status: Complete (2026-09-14)

## Goal

Evaluate supported source opening-hours strings in Europe/Warsaw and surface explicit OPEN, CLOSED or UNKNOWN status without treating missing, malformed or insufficient data as reliable.

## Acceptance criteria

- A documented parser/evaluator supports the practical OSM opening-hours subset found in the initial Warsaw dataset.
- Every evaluation runs in Europe/Warsaw at an explicit supplied instant.
- Supported always-open and weekly time-range examples yield deterministic OPEN/CLOSED results.
- Missing, malformed, conditional/appointment-only/complex unsupported values yield UNKNOWN and retain their original raw string.
- API response exposes a qualified openingStatus derived server-side without changing raw source data.
- Map preview and detail sheet render status with text and semantic colour; UNKNOWN is never styled or worded as open.
- Tests cover Warsaw timezone boundaries, overnight ranges, weekday ranges, 24/7, missing/malformed values and DST-safe date handling.
- No future claim is made for recurring schedules that cannot be evaluated safely.

## In scope

- opening-hours parser/evaluator and status contract;
- nearby API field extension;
- preview/detail status rendering;
- unit/integration/browser tests and documentation.

## Out of scope

- broad natural-language hour parsing;
- manual edit UI, source reconciliation or scheduled freshness checks;
- price/filter behavior, list, reports or routing changes.

## Constraints

- Use Europe/Warsaw only.
- Treat no raw hours as UNKNOWN; do not infer 24h from missing data.
- Do not promote likely/open confidence states without a source-supported evaluated schedule.
- Preserve openingHoursRaw exactly.
- Keep parser failure isolated; it must not break nearby results.

## Verification

- npm run lint
- npm run typecheck
- npm test
- npm run test:integration
- npm run build
- npm run test:e2e
- inspect representative imported Warsaw opening-hours values and evaluator outcomes
- inspect final scoped changes

## Definition of done

TASK-013 is complete when source-supported hours drive accurate Warsaw-time OPEN/CLOSED/UNKNOWN display, all unsupported data stays honest, checks pass and no TASK-014 price expansion is implemented.
