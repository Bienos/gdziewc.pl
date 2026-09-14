# TASK-007 — Nearby toilet API

Status: Complete (2026-09-13)

## Goal

Provide a privacy-conscious POST endpoint that validates a browser location and returns a bounded, distance-ordered set of usable canonical toilets from PostGIS.

## Acceptance criteria

- `POST /api/toilets/nearby` accepts a JSON body containing latitude/longitude plus optional radius and limit.
- Coordinates, radius, and limit are strictly validated and bounded; malformed/unknown fields receive a safe 400 response.
- The endpoint uses a parameterized PostGIS geography query and the spatial index.
- Only active canonical records are returned; explicit `not_public` toilets are excluded.
- Public, restricted, and unknown access states remain distinguishable in the response.
- Results are ordered nearest-first and include canonical ID, label, destination coordinates, rounded distance, and supported source-derived metadata.
- The result contains no echoed user coordinates and the response is `no-store`.
- Missing database configuration and unexpected failures return safe responses without leaking SQL, credentials, payloads, or coordinates.
- Unit tests cover input and response contracts; real PostGIS integration tests cover radius, order, lifecycle/access exclusion, and spatial-plan/index use.
- No UI fetch or toilet marker is implemented yet.

## In scope

- nearby request/response schemas;
- database connection helper suitable for Next.js server runtime;
- parameterized nearby query and route handler;
- unit and disposable-PostGIS integration tests;
- API documentation and project-state updates.

## Out of scope

- calling the endpoint from the location component;
- displaying toilet markers or results;
- recommendation scoring beyond nearest-first distance;
- opening-hours status computation, filters, pagination, or routing;
- rate limiting and production database provisioning.

## Canonical context

- `PRODUCT.md` FR-03 and location privacy requirements
- `ARCHITECTURE.md` sections 7–10 and nearby-query contract
- `tasks/003-canonical-toilet-schema-and-osm-contract.md`
- `tasks/004-ingest-first-warsaw-toilet-dataset.md`
- `tasks/006-request-and-display-user-location.md`
- `PROGRESS.md`

## Likely relevant code

- `app/api/toilets/nearby/route.ts`
- `lib/toilets/nearby.ts`
- `lib/db/`
- `lib/env/server.ts`
- `tests/unit/`
- `tests/integration/`

## Constraints

- Use POST JSON; never place current user coordinates in the URL.
- Never log the request body or precise user position.
- Use parameterized SQL and `ST_DWithin` on geography.
- Default radius 2,000m; maximum radius 10,000m; default limit 50; maximum limit 100.
- Exclude only explicit not-public records at this stage; preserve honest restricted/unknown states.
- Keep database access server-only and route responses uncached.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run db:migrate` and `npm run test:integration` against disposable PostGIS
- inspect `EXPLAIN` evidence for spatial-index eligibility
- `npm run build`
- direct route checks for valid/invalid/missing-database behavior
- inspect final scoped changes

## Definition of done

TASK-007 is complete when the server exposes a validated, private and index-backed nearby query with real PostGIS verification and safe failures, documentation is current, and no TASK-008 marker/UI integration has been implemented.
