# TASK-022 — Second data source + deduplication

Status: Deferred — verified city source endpoint/licence required (2026-09-14)

## Goal

Add a verified second authoritative toilet source and merge only high-confidence duplicate records with existing canonical toilets.

## Acceptance criteria

- The second source has a verified current endpoint, reuse terms, provenance and update contract recorded before ingestion.
- Its adapter preserves source lineage and explicit unknown values.
- Conservative deterministic deduplication identifies candidates by proximity and compatible identity/address evidence; uncertain cases remain separate.
- A repeat ingestion is idempotent and never silently overwrites more reliable canonical facts.
- Integration tests use real PostGIS data to prove match/non-match/update/lineage behavior.

## Current research state

- Warsaw's official open-data/API platform is active, but no current toilet dataset resource with a verifiable endpoint and dataset-specific reuse terms has been located.
- The 19115/operator pages remain useful reference evidence but do not currently provide a machine-ingestible, licensed record feed.

## Constraints

- Do not guess a city endpoint, scrape unstructured pages as canonical truth, or claim an unverified source is authoritative.
- Keep OSM provenance and ODbL obligations intact.

## Definition of done

TASK-022 is complete only after a verified second-source adapter and conservative deduplication path are implemented and proven against real PostGIS.
