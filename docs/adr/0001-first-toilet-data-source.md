# ADR-0001 — Use OpenStreetMap as the first toilet source

Date: 2026-09-13  
Status: Accepted for TASK-003/TASK-004

## Context

The product needs a reproducible Warsaw toilet dataset with coordinates, provenance and explicit unknown states. Warsaw city data is the preferred authority, but TASK-002 could not verify its current toilet resource identifier, machine-readable endpoint, dataset-specific licence or update contract. Building against an inferred/consumer-map endpoint would make the foundation brittle and legally unclear.

OpenStreetMap has a documented toilet model, explicit ODbL terms and measurable Warsaw coverage. A live bounded query returned 562 features, although important usability fields were incomplete.

## Decision

1. Implement the first source contract and ingestion slice against OpenStreetMap `amenity=toilets` data inside Warsaw.
2. Use `osm/{type}/{id}` as the stable external key and retain raw tags plus fetch/source timestamps.
3. Treat every missing source tag as unknown. Do not infer `false`, free, open, public or accessible from absence.
4. Keep explicitly `access=private` and `access=no` records in staging/source data for audit, but do not expose them as normal public candidates. Mark `access=customers` as restricted, not public/free.
5. Use public Overpass only for bounded development/manual snapshots. Production scheduling must use an approved extract, paid provider or self-hosted service and must record source lag.
6. Include visible OpenStreetMap attribution and ODbL disclosure wherever the data is publicly used; include attribution/licence metadata with a published database or export.
7. Add Warsaw city data later through a separate adapter after the exact endpoint, licence and cadence are verified. Preserve source separation and review ODbL implications before distributing a combined database.

## Consequences

- TASK-003 can define a real source contract without waiting for city-portal access.
- TASK-004 can build a deterministic, testable first dataset.
- Initial completeness will be uneven, especially for name, hours and access; confidence must reflect this.
- Production ingestion cannot rely on community public API availability.
- The project accepts ODbL attribution and possible share-alike obligations for the OSM-derived database.
- City/operator data remains necessary for higher-confidence opening/access information.

## Revisit when

- Warsaw supplies the exact toilet dataset/API and reuse terms;
- a production OSM extract/provider is selected;
- legal review changes how the canonical multi-source database should be published;
- measured field coverage materially changes.
