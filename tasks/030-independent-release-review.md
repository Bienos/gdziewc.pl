# TASK-030 — Independent release review

Status: Complete (2026-09-14)

## Goal

Perform a fresh, read-only review of the release candidate against the approved product requirements, architecture boundaries, completed task criteria, and observed verification evidence.

## Acceptance criteria

- The primary and secondary MVP journeys are checked against `PRODUCT.md`, including unknown-data semantics, privacy, accessibility, performance, and reporting.
- The implementation is checked against `ARCHITECTURE.md`, including application/data boundaries, security, observability, CI/CD, migrations, and deployment assumptions.
- Every completed roadmap task has an accounted-for status and evidence trail; deferred work is explicit and not presented as complete.
- Automated release checks are rerun from the current workspace and their observed results are recorded.
- Product gaps, release blockers, staging prerequisites, and post-MVP items are separated clearly.
- The review produces a `PASS`, `CONDITIONAL PASS`, or `FAIL` verdict with precise reasons.
- No application, database, test, dependency, or configuration code is modified by this review.

## Constraints

- Treat the current workspace as the review artifact; do not rely only on `PROGRESS.md` claims.
- Do not remediate findings in this task.
- Do not claim staging or production evidence that was not observed.
- Preserve TASK-022 as deferred until a verified reusable city source exists.

## Definition of done

- Review findings and verification evidence are recorded here.
- `PROGRESS.md` records the verdict, blockers, and next approved task.
- The review stops without beginning TASK-031.

## Review verdict

**CONDITIONAL PASS — the local engineering release candidate is healthy, but it is not approved for staging or production.**

The tested core journey, data model, privacy controls, reporting, accessibility, performance, SEO, security baseline and reproducible OSM ingestion are consistent with the completed task evidence. One unresolved product/architecture mismatch must receive an approved resolution before staging approval: the current map is a decorative, non-geographic SVG with locally projected markers, while `PRODUCT.md` requires a Warsaw map and usable manual-map fallback and `ARCHITECTURE.md` selects MapLibre with a production-safe tile provider.

## Acceptance review

### Passing release-candidate areas

- The click-to-locate journey, nearby PostGIS query, deterministic ranking, recommended result, list, detail, filters, radius expansion, external destination-only walking navigation and anonymous report flow work end-to-end.
- Denied, unavailable, timeout, outside-Warsaw, empty-result and service-failure states have explicit recovery paths.
- Missing source values remain qualified/unknown across ingestion, API, ranking, filters and UI; they are not collapsed into false, free, open or accessible.
- Precise live location remains in browser memory/nearby POST bodies and is absent from URLs, database records, analytics events, error records and external-navigation origins.
- Request validation, bounded bodies, scoped rate limits, parameterised database operations, security headers, environment-only credentials and a zero-vulnerability dependency audit form a proportionate public-MVP baseline.
- Keyboard/touch/semantic/reduced-motion coverage, 320px layout checks and the production mobile performance budget pass.
- The committed OSM snapshot, versioned migrations and idempotent importer provide reproducible current development/staging data with ODbL provenance.
- TASK-001 through TASK-021 and TASK-023 through TASK-029 are accounted for in `PROGRESS.md`; TASK-022 is correctly deferred rather than presented as complete.

### Product/architecture release blocker

1. **The map and manual fallback do not meet the approved product/architecture contract.** `components/map/warsaw-map-artwork.tsx` is an `aria-hidden` decorative illustration, and `lib/map/project-nearby.ts` places markers by a clamped local projection rather than on a geographic basemap. The location-denied fallback links to `#mapa-warszawy`, which is the same non-interactive illustration, so a user cannot manually browse Warsaw. This conflicts with `PRODUCT.md` MVP scope/FR-04/location-denied fallback and the MapLibre/tile-provider decision in `ARCHITECTURE.md`. Resolve through an explicitly approved implementation task (including an accessible list path and production-safe tile provider), or formally revise the authoritative product/architecture requirements before staging approval.

### Staging prerequisites, not local-code failures

- No Git repository/revision is present in this workspace, so the reviewed artifact has no immutable commit identity, PR history or deployable VCS source for the documented CI/Vercel flow.
- No hosted staging URL, Vercel project, managed PostGIS credentials, TLS/least-privilege evidence, durable WAF rules, observability check or rollback exercise was available. These belong to TASK-031.
- A production-safe OSM refresh/extract provider and scheduled GitHub Actions import are not configured; the current committed snapshot/manual importer must not be represented as an ongoing production refresh service.
- CI runs lint, typecheck, unit tests, build and dependency audit, but does not yet provide the architecture's relevant real-PostGIS integration test or milestone browser-test gates.

### Deferred and non-blocking observations

- TASK-022 remains deferred pending a verified reusable Warsaw city endpoint, dataset-specific licence and update contract. OSM remains the only approved machine-ingested source.
- Installable PWA polish is explicitly future backlog and is not a blocker for the mobile web MVP.
- Vitest 5 currently passes all tests but warns that the TypeScript configuration files use ESM syntax while being loaded as CommonJS; this is a future compatibility cleanup, not a current failure.
- TASK-001 and TASK-002 are recorded as complete in `PROGRESS.md` with evidence, but their task files do not contain explicit `Status:` lines.

## Fresh verification evidence

Observed on 2026-09-14 from the current workspace:

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — 20 files, 71 tests passed.
- `npm run test:integration` against the disposable PostgreSQL/PostGIS database — 3 files, 9 tests passed.
- `npm run test:e2e` — 10 Chromium tests passed.
- `npm run test:performance` — 1 production mobile performance test passed.
- `npm run test:fullstack` against real PostGIS data — 1 production-mode core journey passed.
- `npm run build` — production build passed.
- `npm run audit:dependencies` — online audit reported 0 vulnerabilities.

No application, database, test, dependency or runtime configuration source was changed during this review.

## Resolution

TASK-031 subsequently resolved the geographic-map/manual-browse blocker with lazy MapLibre rendering, real-coordinate markers, an explicit OpenFreeMap provider decision and an accessible provider-failure/list fallback. Staging verification remains a separate task.
