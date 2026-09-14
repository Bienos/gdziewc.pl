# TASK-003 — Canonical toilet schema + first source contract

Status: Complete (2026-09-13)

## Goal

Create the minimum PostGIS schema and validated OpenStreetMap source contract required to ingest the first Warsaw toilet dataset without collapsing unknown values.

## Acceptance criteria

- A versioned migration creates canonical toilets, source records and ingestion-run tables.
- PostGIS geography points and a GiST index support later nearby queries.
- Canonical access, price, accessibility, lifecycle and confidence states preserve unknown values.
- Source records retain stable source identity, raw payload, normalized payload, licence and timestamps.
- The OpenStreetMap input schema accepts node and way-centre records and rejects invalid coordinates/identities.
- OSM normalization maps known tags deterministically and preserves missing tags as unknown.
- Explicit private/no-access records are represented as not public, and customer-only access remains restricted.
- Unit tests cover unknown semantics and important tag mappings.
- A real PostGIS integration test verifies the migrated schema and geography index.

## In scope

- database migration for canonical/source/ingestion baseline;
- shared source adapter contract;
- OSM response validation and normalization;
- unit and schema integration tests;
- documentation/state updates.

## Out of scope

- fetching OSM in production;
- ingestion/upsert orchestration;
- ranking, opening-status computation or nearby API;
- user reports and abuse controls;
- second-source matching/deduplication;
- map or other UI work.

## Canonical context

- `PRODUCT.md` sections 8–11
- `ARCHITECTURE.md` sections 5, 10, 13, 19 and 23
- `docs/DATA_SOURCES.md`
- `docs/adr/0001-first-toilet-data-source.md`
- `PROGRESS.md`

## Likely relevant code

- `db/migrations/`
- `lib/toilets/source-contract.ts`
- `lib/toilets/sources/osm.ts`
- `tests/unit/`
- `tests/integration/`

## Constraints

- Use source record identity `osm/{type}/{id}`.
- Retain raw tags and OSM/source timestamps.
- Never interpret a missing tag as false/free/open/public/accessible.
- Do not create product features beyond schema/contract.
- Do not require a database during the ordinary web build.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run db:migrate` against real PostGIS
- `npm run test:integration` against the same database
- inspect the final scoped changes

## Definition of done

TASK-003 is complete when the migration and OSM normalization contract pass unit checks and a real PostGIS schema test, documentation is current, and no TASK-004 ingestion or user-facing feature has been implemented.
