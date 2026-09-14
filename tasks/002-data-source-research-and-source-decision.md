# TASK-002 — Data-source research and source decision

## Goal

Validate candidate Warsaw toilet sources and choose the first source that can be used safely and reproducibly in the next schema/ingestion tasks.

## Outcome

A source inventory records ownership, access method, licence/reuse obligations, available fields, freshness signals, limitations, and the selected first-source strategy.

## Acceptance criteria

- Current primary sources are checked for Warsaw city data and OpenStreetMap data.
- At least the city source, OpenStreetMap, transport/operator sources, and user reports are assessed.
- The chosen first machine-ingested source has a reproducible access method and documented licence obligations.
- A current Warsaw sample is inspected for record count and important field coverage.
- Unknown values remain unknown; missing tags are not interpreted as false.
- Public API/service limits are documented and are not treated as a production SLA.
- The exact unresolved Warsaw city endpoint/licence questions are recorded.
- A source decision is captured in an ADR.
- `PROGRESS.md` records observed facts and the next approved task.

## In scope

- read-only source and licence research;
- one-off exploratory source queries;
- source inventory and ADR documentation;
- field/cadence/freshness assessment.

## Out of scope

- production ingestion code;
- canonical toilet schema or database tables;
- deduplication implementation;
- map, geolocation, API, ranking, filters, or other product features;
- copying or scraping competitor databases.

## Canonical context

- `AGENTS.md`
- `PROGRESS.md`
- `PLAN.md` TASK-002
- `PRODUCT.md` sections 8–11
- `ARCHITECTURE.md` sections 5, 10, 11, 13, 19 and 23
- relevant source analysis in `RESEARCH.md`

## Verification

- Re-run the documented OSM query and confirm it returns parseable JSON with an `osm_base` timestamp.
- Check that every conclusion in the inventory is labelled as verified, inferred, or unresolved.
- Inspect the final documentation changes and confirm no product code was added.
