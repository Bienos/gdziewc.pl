# Warsaw toilet source inventory

Status: TASK-002 decision record, verified 2026-09-13.

Labels used below:

- **Verified** — observed directly in a current primary source or live response.
- **Inferred** — a design/operational conclusion based on verified evidence.
- **Unresolved** — must be confirmed before implementation relies on it.

## Decision summary

**OpenStreetMap is the first machine-ingested source for TASK-003/TASK-004.** It is accessible, reproducible, structured, Warsaw coverage can be measured now, and its ODbL obligations are explicit.

**Warsaw city data remains the preferred authoritative source**, but it is not yet approved for ingestion because the exact current toilet dataset/API resource, authentication model, dataset-specific reuse terms, and update contract could not be verified. It should become a separate adapter once those points are resolved.

Operator pages for Metro Warszawskie and PKP are supplemental verification sources. User reports are a later moderated correction source, not direct truth.

## Source inventory

### 1. OpenStreetMap

**Role:** first machine-ingested coverage source; later enrichment and conflict detection.

**Verified access:** OSM data can be selected with Overpass API for bounded, read-only development queries. Production ingestion must not depend on a public Overpass instance; use a regional extract, paid provider, or self-hosted service when scheduling begins.

**Licence:** Open Database License (ODbL). Public use requires OpenStreetMap attribution and a clear ODbL reference. A derived database distributed publicly may carry share-alike obligations. Attribution must also exist in database metadata/README and, later, visibly on an interactive map.

**Relevant fields/tags:**

- stable identity: element `type` + `id`;
- coordinates: node coordinates or way geometry/centre;
- public-toilet identity: `amenity=toilets`;
- access: `access`;
- price: `fee`, `charge`, `currency` where present;
- hours: `opening_hours`;
- accessibility: `wheelchair`, `toilets:wheelchair`;
- facilities: `changing_table`, `unisex` and other `toilets:*` tags;
- provenance/freshness: element version/timestamp when metadata output is requested, plus tags such as `check_date`;
- descriptive data: `name`, address tags, `operator`.

**Upstream cadence:** community edits are continuous; Overpass responses expose `osm_base` so actual data lag can be recorded per import.

**Proposed ingestion cadence:** manual/on-demand for TASK-004 development. For production, at most daily after an approved extract/provider path exists; never query from end-user sessions.

**Known limitations:** sparse names, partial hours/access metadata, inconsistent tag shapes, community confidence varies, and presence does not guarantee current usability. Missing tags are `unknown`, never `false`.

### 2. Warsaw 19115 / Warsaw city map and open-data platforms

**Role:** preferred authoritative Warsaw source once a machine-readable contract is verified.

**Verified content:** the official city page says its map contains several hundred stationary, portable, public-building, and participating private-building toilets. Detail cards include address, opening hours, fee information, changing-table availability, and wheelchair accessibility. It also states that all Metro Warszawskie stations have public toilets outside the ticketed zone, free of charge, normally 06:00–22:00.

**Verified platform state:** the city states that `dane.um.warszawa.pl` is replacing the legacy `api.um.warszawa.pl`. The legacy portal was reachable during this task and its general reuse page describes the catalogue as open data and warns that third-party processed data may be stale or erroneous.

**Unresolved:**

- exact current toilet dataset/resource identifier;
- stable API/download endpoint and response format;
- whether an API key is required for this dataset;
- dataset owner/contact and update cadence/SLA;
- a named dataset-specific licence, attribution wording, and redistribution/derivative-database terms;
- whether portable/seasonal records have explicit validity dates.

The legacy catalogue search returned no record for either `toaleta` or `toalety`. The new catalogue domain did not resolve from the current browser environment. These observations do not prove the dataset is globally unavailable; they mean the ingestion contract is not verified yet.

**Decision:** do not scrape the consumer map and do not import city data until the owner/endpoint/licence questions above are answered. Keep city records separate by source provenance when added; do not silently merge them into the OSM-derived database without an ODbL compatibility review.

### 3. Metro Warszawskie

**Role:** high-value operator verification layer for predictable transport hubs.

**Verified fields:** station network membership, public access, outside-ticket-zone access, free price state, and normal 06:00–22:00 hours are stated on the official Warsaw 19115 page.

**Cadence:** no structured toilet feed or update cadence was verified. Recheck the official operator/city statement before import and after service-policy changes; store the source page and verification time.

**Limitations:** a network-wide statement is not proof that every station facility is operational at a given moment. It must not be presented as live availability.

### 4. PKP station pages

**Role:** manually curated verification for major railway hubs, not the first bulk source.

**Verified examples:** PKP currently publishes station address/coordinates and WC details. Warszawa Zachodnia lists WC hours of 03:20–24:00 with a technical break and cash/card payment. Warszawa Wschodnia lists a 24-hour long-distance-station WC and a 06:00–20:00 suburban-station WC, priced at 4.50 PLN.

**Cadence:** no structured feed or formal update cadence was verified. Any imported value needs a `verified_at` timestamp and periodic manual recheck.

**Limitations:** page-level unstructured content, multiple facilities per station, and potentially fast-changing hours/prices.

### 5. User reports

**Role:** later correction signal for closure, nonexistence, hours, price, access and accessibility.

**Ownership/licence:** first-party submissions governed by future product terms; not an external open-data licence.

**Cadence:** event-driven.

**Limitations:** untrusted input, abuse risk and conflicting reports. Reports never overwrite canonical facts automatically; they enter moderation/confidence logic.

### 6. Warszawa 19115 toilet map (research update 2026-09-14)

**Role:** official operational reference and prospective second-source candidate.

The official 19115 toilet page confirms that its map contains several hundred public, portable, municipal, public-building and participating private toilets, and describes address, hours, fee, changing-table and accessibility fields. It also identifies the new municipal map portal as the presentation surface.

**Decision:** not approved for ingestion yet. The public page/app/map does not provide a verified machine-readable toilet endpoint, dataset-specific reuse licence, record identifiers or update contract. Do not scrape the map or unstructured page into canonical records. TASK-022 remains open pending those source requirements.

### Excluded sources

- Competitor toilet-finder databases are product references only and must not be copied or scraped.
- Public Nominatim must not be used to download Warsaw POIs or as an autocomplete service.
- Public OSM tile servers are not a production data-ingestion or bulk-download mechanism.

## Live OSM Warsaw snapshot

Query executed against `https://overpass-api.de/api/interpreter` on 2026-09-13:

```overpass
[out:json][timeout:60];
area["boundary"="administrative"]["name"="Warszawa"]["admin_level"="6"]->.searchArea;
nwr["amenity"="toilets"](area.searchArea);
out center tags;
```

The response declared `osm_base` **2026-09-13T20:30:19Z** and contained **562** elements: 448 nodes and 114 ways.

| Field/tag | Present | Coverage |
| --- | ---: | ---: |
| `fee` | 407 | 72.4% |
| `wheelchair` | 394 | 70.1% |
| `changing_table` | 258 | 45.9% |
| `access` | 180 | 32.0% |
| `opening_hours` | 160 | 28.5% |
| `operator` | 140 | 24.9% |
| `unisex` | 62 | 11.0% |
| `name` | 5 | 0.9% |

Observed value examples:

- `fee`: 338 `no`, 69 `yes`, 155 missing;
- `wheelchair`: 297 `yes`, 77 `no`, 13 `limited`, 7 `designated`, 168 missing;
- `changing_table`: 151 `yes`, 107 `no`, 304 missing;
- `access`: 120 `yes`, 23 `permissive`, 18 `customers`, 15 `private`, 3 `no`, 1 `unknown`, 382 missing;
- `opening_hours`: 35 `24/7`, while 402 were missing.

The extraction deliberately retains explicit `private`, `no`, and `customers` records for validation. TASK-003 must distinguish source existence from public usability; TASK-004 must prevent explicitly private/no-access records from becoming normal public recommendations.

### TASK-004 ingestion verification

The exact response above is committed as `data/osm/warsaw-toilets-2026-09-13.json.gz` with its SHA-256 and ODbL notice in `data/osm/README.md`. A first import into disposable PostGIS created 562 canonical toilets and 562 linked source records. Repeated imports preserved those same totals and canonical identities.

Final canonical distributions were:

- access: 143 public, 18 restricted, 18 not public, 383 unknown;
- price: 338 free, 69 paid, 155 unknown;
- wheelchair: 304 accessible, 13 limited, 77 not accessible, 168 unknown.

All 562 source rows retained raw/normalized JSON, dataset time, fetch time, source URL, licence and attribution. Later public nearby queries must exclude `access_state = 'not_public'`; restricted and unknown records require honest user-facing labels rather than being treated as public.

## Required TASK-003 contract decisions

- Source key format: `osm/{element_type}/{element_id}`.
- Preserve raw OSM tags and source timestamp/element metadata where available.
- Define tri-state/qualified mappings instead of booleans for access, price and facilities.
- Preserve `opening_hours` raw text even when parsing fails.
- Support node and way geometry without treating a calculated centre as a surveyed entrance.
- Carry ODbL attribution and source metadata through exports and user-facing map work.

## Map display provider

The interactive basemap is presentation infrastructure, not a canonical toilet-data source. TASK-031 selects MapLibre GL JS with OpenFreeMap Liberty as the configurable default. OpenFreeMap permits commercial use and supplies required OpenMapTiles/OpenStreetMap attribution through its MapLibre style, but its public service has no SLA. It is activated only after a deliberate location/manual-map action; the accessible result list remains the failure fallback. See `docs/adr/0002-map-renderer-and-default-tile-provider.md` for terms, privacy and replacement boundaries.
- Keep source records separate so future Warsaw/PKP/operator evidence can coexist and conflict visibly.

## Primary references

- Warsaw 19115 toilets: https://warszawa19115.pl/web/guest/-/automatyczne-toalety-miejskie
- Warsaw open-data transition: https://warszawa19115.pl/web/guest/-/dane-po-warszawsku
- Legacy Warsaw reuse terms: https://api.um.warszawa.pl/warunki.php
- Warsaw IoT overview: https://warszawa19115.pl/en/-/warszawska-platforma-iot
- OSM toilet tagging: https://wiki.openstreetmap.org/wiki/Tag:amenity=toilets
- OSM copyright/licence: https://www.openstreetmap.org/copyright
- OSM attribution guidance: https://osmfoundation.org/wiki/Licence/Attribution_Guidelines
- Overpass API and service guidance: https://wiki.openstreetmap.org/wiki/Overpass_API
- PKP Warszawa Zachodnia: https://www.pkp.pl/pl/?catid=21&id=155:warszawa-zachodnia-informacje-dla-pasazera&lang=pl-PL&option=com_content&view=article
- PKP Warszawa Wschodnia: https://www.pkp.pl/pl/?catid=21&id=154:warszawa-wschodnia-informacje-dla-pasazerow&lang=pl-PL&option=com_content&view=article
