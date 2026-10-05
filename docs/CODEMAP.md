# Code map

Status: TASK-032 staging release verification complete; live protected Vercel
and Neon evidence is recorded, with a pending browser-bypass limitation only.

## Application

- `app/layout.tsx` — root HTML document, Polish language metadata, global styles, and Vercel Web Analytics.
- `components/analytics/page-analytics.tsx` — Vercel Web Analytics page views from the same-origin script path (ADR-0003).
- `lib/analytics/page-view-url.ts` — `beforeSend` redaction that sends a page view's origin and path only (ADR-0003).
- `app/page.tsx` — branded root map-shell composition, hero message, location-action affordance, and honest pre-location copy.
- `components/location/location-experience.tsx` — private geolocation plus validated nearby POST, marker/result state, truthful 2/5/10km empty recovery, and stale-result clearing.
- `lib/location/status.ts` — deterministic browser geolocation error mapping and Polish status copy.
- `lib/location/warsaw-service-area.ts` — conservative Warsaw support-area check that favors edge eligibility over false rejection.
- `components/map/warsaw-map-artwork.tsx` — local decorative Warsaw street/river SVG used before map activation and behind provider failures.
- `components/map/geographic-warsaw-map.tsx` — lazy MapLibre Warsaw basemap, same-origin worker setup, real-coordinate user/toilet markers, viewport fitting, controls and provider-failure state.
- `components/map/nearby-toilet-list.tsx` — accessible API-ordered nearby-result list with the same canonical selection as the map.
- `components/map/nearby-toilet-filters.tsx` — composable nearby-result filter controls and matching count/reset action.
- `components/map/nearest-toilet-preview.tsx` — recommended-result bottom preview with distance, approximate ETA, explicit unknown status, qualified price and refresh control.
- `components/map/toilet-detail-sheet.tsx` — selected-toilet accessible bottom sheet with focus-on-open, close behavior and known/unknown metadata.
- `lib/map/config.ts` — Warsaw map center/bounds plus validated, configurable HTTPS style-provider policy that rejects public OSM tiles.
- `app/globals.css` — CSS tokens plus responsive paper/street shell, poster card, safe-area, focus, touch-target, and reduced-motion styling.
- `lib/http/request-security.ts` — same-origin JSON admission and streaming actual-byte limits shared by public POST routes.
- `lib/http/rate-limit.ts` — scoped, privacy-safe short-lived request limiting with trusted Vercel client identity and bounded fallback memory.
- `next.config.ts` — CSP/anti-framing, permissions, referrer, HSTS and content-type response-header baseline.

## Configuration and canonical data baseline

- `lib/env/server.ts` — the single typed environment-validation entry point.
- `lib/db/pool.ts` — lazy, server-side PostgreSQL pool built from validated environment configuration.
- `scripts/check-postgis.ts` — connects through `DATABASE_URL` and verifies that PostGIS is installed.
- `db/migrations/000001_create_toilet_source_schema.js` — enables PostGIS and creates ingestion runs, canonical toilets, source records, constraints, lineage links, and spatial/supporting indexes.
- `lib/toilets/source-contract.ts` — validated, source-independent toilet-record contract with explicit unknown states.
- `lib/toilets/sources/osm.ts` — validated OpenStreetMap node/way-centre adapter, tag normalization, stable source identity, and ODbL lineage metadata.
- `lib/toilets/ingestion/osm.ts` — validate-first, transactional OSM canonical/source upsert and ingestion-run accounting.
- `lib/toilets/nearby.ts` — strict nearby contracts and bounded, index-eligible PostGIS distance query.
- `lib/toilets/ranking.ts` — named access/confidence constants, pure score calculation, stable tie-breaks and recommendation metadata.
- `lib/toilets/preview.ts` — documented straight-line ETA calculation plus distance, price and unknown-status presentation helpers.
- `lib/toilets/opening-hours.ts` — Europe/Warsaw evaluator for the supported OSM subset and qualified open/closed/unknown labels.
- `lib/toilets/price.ts` — safe explicit-PLN charge parsing and qualified user-facing price labels.
- `lib/toilets/filters.ts` — pure, conservative filtering predicates for the loaded nearby response.
- `lib/toilets/detail.ts` — literal labels for access, facilities and confidence, including a low-confidence decision-surface caution.
- `lib/navigation/walking.ts` — validated destination-only Google Maps walking URL generator.
- `app/api/toilets/nearby/route.ts` — no-store POST route with separate safe validation/service errors.
- `scripts/ingest-osm-warsaw.ts` — operator CLI for saved plain/gzip responses or an explicit manual live Overpass fetch.
- `scripts/copy-maplibre-worker.mjs` — copies MapLibre's matching worker/shared modules into a same-origin public build directory before development/build.
- `data/osm/warsaw-toilets.overpassql` — bounded, version-controlled Warsaw node/way query with element metadata.
- `data/osm/warsaw-toilets-2026-09-13.json.gz` — exact ODbL-attributed 562-record verification snapshot.
- `data/osm/README.md` — ingestion runbook, live-fetch constraint, snapshot provenance, and checksum.
- `.env.example` — environment variable names only.

## Quality and delivery

- `tests/unit/env.test.ts` — foundation unit coverage for environment validation.
- `tests/unit/osm-source.test.ts` — OSM validation and deterministic normalization coverage, including unknown/access semantics.
- `tests/unit/location-status.test.ts` — geolocation error-code and recovery-copy coverage.
- `tests/unit/warsaw-service-area.test.ts` — central/edge eligibility and clearly outside-location coverage.
- `tests/unit/nearby.test.ts` — bounded schema, not-public response exclusion, safe 400 and missing-database coverage.
- `tests/unit/map-config.test.ts` — default/override map-style policy, Warsaw center and forbidden public-OSM tile coverage.
- `tests/unit/ranking.test.ts` — constants, bounded trade-offs, distance dominance, mutation safety and deterministic tie-break coverage.
- `tests/unit/preview.test.ts` — ETA formula/rounding, metric distance, qualified price labels and explicit unknown-status coverage.
- `tests/unit/detail.test.ts` — access, facility and confidence label coverage, including unknown semantics.
- `tests/unit/walking-navigation.test.ts` — Google Maps URL, walking-mode, destination-only and invalid-coordinate coverage.
- `tests/unit/opening-hours.test.ts` — daily/weekday/overnight/24-7, DST/Warsaw-time and unsupported-format coverage.
- `tests/unit/price.test.ts` — safe PLN parsing, ambiguous-charge rejection and display-label coverage.
- `tests/unit/filters.test.ts` — explicit-positive filter semantics, API-order preservation and non-mutation coverage.
- `tests/integration/schema.test.ts` — real PostGIS schema, geography-point, and GiST-index checks; skips when no database URL is provided.
- `tests/integration/osm-ingestion.test.ts` — real PostGIS creation, lineage, update-in-place, duplicate-safety, and invalid-input checks.
- `tests/integration/nearby.test.ts` — real radius/order/lifecycle/access behavior and GiST plan evidence.
- `tests/e2e/home.spec.ts` — mocked location/API success, marker/list selection sync, empty/error recovery, denial, privacy, keyboard, and 320px checks.
- `tests/e2e/security.spec.ts` — production browser security-header and framework-disclosure regression coverage.
- `tests/fullstack/core-journey.spec.ts` and `playwright.fullstack.config.ts` — production-mode journey against real PostGIS data, including nearby discovery, detail/navigation and report persistence.
- `tests/performance/mobile.spec.ts` and `playwright.performance.config.ts` — production-mode mobile performance, transfer, layout-shift, external-resource and viewport budgets.
- `playwright.config.ts`, `vitest.config.ts`, and `vitest.integration.config.ts` — browser, unit, and database integration test configuration.
- `playwright.staging.config.ts` and `tests/staging/staging-smoke.spec.ts` — an external-URL, non-report-writing staging smoke suite for the security baseline and manual-map/nearby-data journey.
- `scripts/verify-staging-target.mjs` — refuses missing, non-HTTPS and local staging targets before an external smoke run.
- `scripts/provision-staging-app-role.ts` — explicit staging-only creation/rotation of the restricted runtime database role; its connection URL is written only to a caller-supplied temporary path for secret-store insertion.
- `.github/workflows/ci.yml` — lockfile install, lint, typecheck, unit test, and production-build checks.
- `README.md` and `docs/STAGING_RELEASE.md` — local commands plus the staging environment, migration, import, smoke, observability and rollback procedure.

## Planning/control files

The product, brand, design, architecture, roadmap, progress, and task specifications remain at the repository root. The approved visual reference remains at `docs/design/reference/gdziekibel-approved-direction.png`.

- `docs/DATA_SOURCES.md` — verified source inventory, field coverage and unresolved source questions.
- `docs/API.md` — current public HTTP contract and privacy/safety notes.
- `docs/adr/0001-first-toilet-data-source.md` — accepted first-source decision and constraints.
- `docs/adr/0002-map-renderer-and-default-tile-provider.md` — accepted MapLibre/OpenFreeMap choice, lazy activation, attribution, privacy, no-SLA risk and provider replacement boundary.
