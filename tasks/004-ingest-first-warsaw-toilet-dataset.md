# TASK-004 — Ingest first Warsaw toilet dataset

Status: Complete (2026-09-13)

## Goal

Create a reproducible OpenStreetMap ingestion path that populates canonical and source-record tables for Warsaw and reports trustworthy verification counts.

## Acceptance criteria

- A versioned Warsaw Overpass query fetches `amenity=toilets` elements within the administrative boundary.
- Ingestion accepts either a saved Overpass JSON response or an explicitly requested live fetch.
- The complete response is validated before database writes begin.
- A successful run records source dataset time, fetched/created/updated/rejected counts, and completion state.
- Each source record is idempotently upserted by stable OSM identity and linked to one canonical toilet.
- Re-running an unchanged dataset creates no duplicate toilets or source records.
- Existing source-linked toilets are updated without changing their canonical identity.
- Explicit not-public OSM records remain stored for lineage but are not presented as usable public toilets.
- Raw and normalized payloads plus ODbL attribution are retained.
- Unit and real PostGIS integration tests cover success, idempotency, update, and invalid-input rollback behavior.
- A real Warsaw ingestion produces documented counts that agree with database queries.

## In scope

- versioned Overpass query and fetch/file input tooling;
- transactional OSM validation, normalization, upsert orchestration, and run auditing;
- CLI entry point for development/staging ingestion;
- unit and PostGIS integration coverage;
- a saved, attributable Warsaw snapshot or equally reproducible fixture strategy;
- runbook, code map, and progress updates.

## Out of scope

- scheduled production refreshes;
- deleting or retiring records absent from a later source response;
- second-source matching or cross-source deduplication;
- public nearby API, ranking, map markers, or other UI;
- production database provisioning.

## Canonical context

- `PRODUCT.md` sections 8–11
- `ARCHITECTURE.md` sections 5, 10, 13, 19 and 23
- `docs/DATA_SOURCES.md`
- `docs/adr/0001-first-toilet-data-source.md`
- `tasks/003-canonical-toilet-schema-and-osm-contract.md`
- `PROGRESS.md`

## Likely relevant code

- `lib/toilets/sources/osm.ts`
- `lib/toilets/ingestion/`
- `scripts/ingest-osm-warsaw.ts`
- `data/osm/`
- `tests/unit/`
- `tests/integration/`

## Constraints

- Use source identity `osm/{type}/{id}` and preserve the canonical toilet ID across updates.
- Validate the entire source response before opening the write transaction.
- Never infer false/free/open/public/accessible from missing tags.
- Use bounded, manual live fetches; do not automate against the public Overpass instance.
- Store ODbL licence/attribution metadata with every source record and beside any committed extract.
- Keep ingestion independent of the Next.js build and request lifecycle.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run db:migrate` against disposable PostGIS
- `npm run test:integration` against the same database
- ingest the saved Warsaw response twice and compare run/table counts
- query the final source/canonical/access-state totals
- `npm run build`
- inspect the final scoped changes

## Definition of done

TASK-004 is complete when an operator can reproducibly ingest the selected Warsaw OSM dataset into a migrated PostGIS database, an unchanged rerun is idempotent, counts and lineage are verified, documentation is current, and no TASK-005 map feature has been implemented.
