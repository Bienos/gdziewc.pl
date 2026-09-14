# Project status

## Current baseline

- TASK-001 project foundation is implemented.
- TASK-002 data-source research and source decision is complete.
- TASK-003 canonical toilet schema and OpenStreetMap source contract is complete.
- TASK-004 reproducible first Warsaw dataset ingestion is complete.
- TASK-005 branded Warsaw map shell is complete.
- TASK-006 private user-location flow is complete.
- TASK-007 nearby toilet API is complete.
- TASK-008 nearby toilet map markers and selection are complete.
- TASK-009 deterministic recommendation ranking is complete.
- TASK-010 nearest toilet preview is complete.
- TASK-011 toilet detail sheet is complete.
- TASK-012 external walking navigation is complete.
- TASK-013 opening-hours normalisation/status is complete.
- TASK-014 price/free state is complete.
- TASK-015 list view is complete.
- TASK-016 core filters are complete.
- TASK-017 no-results and radius expansion is complete.
- TASK-018 outside-Warsaw behaviour is complete.
- TASK-019 data confidence display is complete.
- TASK-020 report incorrect toilet data is complete.
- TASK-021 report abuse protection is complete.
- TASK-022 second-source ingestion is deferred pending a verified reusable Warsaw city feed.
- TASK-023 privacy-safe analytics instrumentation is complete.
- TASK-024 error tracking and privacy scrubbing is complete.
- TASK-025 performance pass is complete.
- TASK-026 accessibility pass is complete.
- TASK-027 SEO/share baseline is complete.
- TASK-028 milestone integration verification is complete.
- TASK-029 security/privacy review and confirmed code remediation are complete.
- TASK-030 independent release review is complete with a conditional-pass verdict; the local engineering candidate is healthy but not staging-approved.
- TASK-031 geographic Warsaw map remediation is complete and resolves TASK-030's product/architecture blocker.
- Next.js App Router application with strict TypeScript is present.
- The root route renders a branded local Warsaw illustration and poster-style start card without initial external calls, then lazily activates a real MapLibre/OpenFreeMap Warsaw map after a location or manual-map action.
- CSS tokens cover base colours, semantic status colours, spacing, and display/UI type roles.
- Environment access is centralised in `lib/env/server.ts`; `.env.example` exposes `DATABASE_URL` by name only.
- PostgreSQL/PostGIS check tooling is available through `npm run db:check`.
- SQL migrations use `node-pg-migrate`; the baseline now contains canonical toilets, source records, ingestion runs, PostGIS geography points and a GiST index.
- The OSM adapter validates node/way-centre records, preserves raw source lineage and maps absent source values to explicit unknown/null states.
- The manual OSM importer accepts committed gzip/plain JSON or an explicit live fetch, validates before writes, and transactionally upserts canonical/source rows.
- The repository contains the exact 562-record ODbL-attributed snapshot used for ingestion verification.
- The root shell requests browser location only after its action is activated, retains it only in component memory, and shows a blue position dot or a useful recovery state.
- `POST /api/toilets/nearby` now provides a bounded, no-store, distance-ordered PostGIS query without echoing or persisting the user's coordinates.
- Successful location now loads validated nearby results and renders clamped WC markers with canonical-ID selection synchronization.
- Nearby results now carry transparent score/rank/recommended metadata; the top marker receives a distinct `TOP` badge without being auto-selected.
- The recommended nearby toilet now appears in a compact bottom preview with an explicit approximate ETA, unknown opening state and qualified price state.
- Marker selection now opens a detail sheet with literal access, facility, hours-source and confidence metadata, with unknown fields made visible.
- The selected toilet detail now includes a destination-only Google Maps walking action.
- Nearby, preview and detail responses now surface source-supported opening status in Europe/Warsaw, preserving uncertainty for unsupported data.
- Nearby, preview and detail responses now preserve safe PLN amounts while keeping ambiguous paid/unknown prices qualified.
- Successful nearby searches can switch between marker map and an accessible list built from the same ordered API result set.
- The loaded result set can be truthfully narrowed by open-now, free, wheelchair, baby-changing and explicit 24h source fields.
- An empty nearby search now gives a deliberate 2 km, 5 km, then 10 km expansion path without storing the location.
- Clearly outside locations now receive a Warsaw-only support message before any nearby query.
- Low-confidence source data is visibly qualified on recommendation and list surfaces, while all confidence levels remain literal in details.
- Vercel-compatible build configuration, CI baseline, unit tests, and Playwright smoke test are present.
- OpenStreetMap is accepted as the first machine-ingested toilet source for TASK-003/TASK-004, with ODbL attribution/share-alike handling required.
- Warsaw city data remains the preferred authority but is deferred until its exact current dataset endpoint, dataset-specific reuse terms and update contract are verified.

## Verification observed on 2026-09-13

- `npm ci` completed successfully with the committed `package-lock.json`.
- Next.js is pinned to patched 15.5.25 after the initial 15.5.4 release reported a security warning during installation.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed after TASK-003: 2 test files, 9 tests.
- `npm run build` passed: static root route generated successfully.
- `npm run test:e2e` passed: 1 Chromium smoke test.
- The earlier no-configuration database stop was superseded by the real TASK-003 database verification below.

## TASK-003 verification observed on 2026-09-13

- The baseline migration ran successfully against an isolated PostgreSQL 16/PostGIS 3.5 development container.
- `npm run db:check` confirmed PostGIS 3.5.2.
- `npm run test:integration` passed: 1 file, 2 tests, including geography-point insertion and GiST-index verification.
- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` all passed after the schema and adapter changes.
- OSM normalization unit coverage confirms missing fields remain unknown, explicit `private`/`no` access becomes not public, and `customers`/`destination` access remains restricted.
- No ingestion, nearby API, map, or user-facing toilet feature was added.

## TASK-004 verification observed on 2026-09-13

- The committed snapshot checksum is `e94e55a2f01d7bd8234efc3cc99ef39432a3615875f241dd7c2fedcbf936030b`; its response dataset time is 2026-09-13T20:30:19Z.
- The first real import fetched 562 records and created 562 canonical toilets plus 562 linked OSM source rows with zero rejects.
- Repeated imports fetched 562, created zero, updated 562, rejected zero, preserved canonical IDs, and left table totals at exactly 562/562 with zero unlinked sources.
- Final access counts: 143 public, 18 restricted, 18 not public, 383 unknown.
- Final price counts: 338 free, 69 paid, 155 unknown.
- Final wheelchair counts: 304 accessible, 13 limited, 77 not accessible, 168 unknown.
- Database integration coverage passed: 2 files, 5 tests for schema, spatial index, ingestion, lineage, repeat update, duplicate safety, and invalid-input rejection.
- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` passed after the importer changes.
- No scheduled refresh, public API, map, or other TASK-005 feature was added.

## TASK-005 verification observed on 2026-09-13

- The root shell matches the approved charcoal, paper, yellow and pink street-poster direction and uses only local SVG/CSS artwork.
- The mobile layout was visually inspected at 390×844 and keeps the brand header, map context, hero and primary action visible.
- `npm run test:e2e` passed: 2 Chromium tests covering identity, keyboard focus, zero location calls, zero external map/tile requests, and 320px viewport fit.
- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` passed.
- No geolocation, toilet result, marker, nearby API, navigation, or external map dependency was introduced.

## TASK-006 verification observed on 2026-09-13

- Success and permission-denied states were visually inspected at 390×844 and 320×640; the position dot, primary action, retry, and fallback remain clear.
- `npm test` passed: 3 files, 14 tests, including all browser geolocation error mappings.
- `npm run test:e2e` passed: 3 Chromium tests covering no page-load request, success, denial, retry/fallback presentation, narrow layout, and no precise-coordinate DOM/URL/storage/request leakage.
- `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- Coordinates remain in React component memory only. No database/API call, persistent storage, console logging, URL parameter, analytics, or external request was introduced.
- No nearby toilet query, toilet marker, result ranking, or navigation behavior was added.

## TASK-007 verification observed on 2026-09-13

- The request contract strictly bounds coordinates, radius (50–10,000m), limit (1–100), nested objects, and unknown fields.
- The parameterized query returns active candidates nearest-first and excludes explicit not-public records while retaining restricted/unknown distinctions.
- Real PostGIS integration passed: 3 files, 7 tests, including radius/order, lifecycle/access exclusions, and an `EXPLAIN` plan containing `toilets_geom_gist_idx`.
- A direct request near central Warsaw returned HTTP 200, `Cache-Control: no-store`, and three nearest records at 19m, 156m and 205m. Invalid coordinates/unknown fields returned the safe HTTP 400 contract.
- `npm test` passed: 4 files, 18 tests. `npm run lint`, `npm run typecheck`, and `npm run build` passed.
- No user coordinates were returned, logged, persisted, placed in a URL, or added to a shared cache.
- The browser does not call this endpoint yet; no toilet marker, recommendation scoring, opening-status logic, or navigation was added.

## TASK-008 verification observed on 2026-09-13

- The browser issues one same-origin POST only after successful user-triggered geolocation; the location remains in the body/component memory and is absent from DOM, URL and browser storage.
- Nearby responses are validated before state update. New location attempts clear stale markers and selection.
- WC marker buttons use deterministic coordinate offsets, visible-region clamping, 42×48px touch targets, canonical IDs and an `aria-pressed` selected state.
- The selected marker gains scale, outline and pink fill and updates the compact name/distance/access label; phone visual inspection confirmed the state remains clear above the poster card.
- Empty and 503 states provide honest map feedback and retry without discarding the current location.
- `npm test` passed: 5 files, 21 tests. `npm run test:e2e` passed: 4 Chromium tests. Lint, typecheck and production build passed.
- No external map/tile dependency, geographic pan/zoom, clustering, recommendation scoring, full preview/detail, filters, or navigation was added.

## TASK-009 verification observed on 2026-09-13

- Ranking score is distance + access penalty (public 0, unknown 80, restricted 250) + confidence adjustment (high -80, medium -40, low 0); lower is better.
- Tie-break order is score, distance, confidence, then canonical ID. Ranking copies rather than mutates candidate input and keeps every bounded nearby alternative.
- Unknown hours, price and facility states are ignored; opening status is not fabricated before TASK-013.
- Controlled tests prove a slightly farther public/high-confidence toilet can win while distance dominates beyond the maximum 330m adjustment gap.
- Real central-Warsaw inspection ranked five candidates deterministically with scores 99, 156, 205, 211 and 398; exactly one was recommended.
- The API exposes rank/score/recommended fields. The first marker has a visual `TOP` badge and accessible `polecany` label but is not auto-selected.
- `npm test` passed: 6 files, 26 tests. PostGIS integration passed: 3 files, 7 tests. Browser suite, lint, typecheck and production build passed.
- No opening-status logic, price preference, user personalization, filters, ML ranking, preview/detail, ETA or navigation was added.

## TASK-010 verification observed on 2026-09-14

- The preview uses only the API `isRecommended` result and stays on that result when a different marker is selected.
- Approximate walking time is `ceil(distance × 1.1 / 90m-per-minute)`, minimum one minute. It is visibly labelled with `~` and `PIESZO`, rather than presented as routing data.
- Opening status is always literal `STATUS NIEZNANY` in the uncertain colour at this milestone; raw source hours do not imply that it is open.
- Price state is rendered only as `ZA DARMO`, `PŁATNY` or `CENA NIEZNANA`; no amount is invented.
- Loading, empty and service-error paths clear the preview, avoiding stale recommendation data.
- 390px and 320px preview visuals were inspected. Both preserve distance, approximate ETA, status, price and the refresh action without overflow.
- `npm test` passed: 7 files, 29 tests. Browser suite passed: 4 Chromium tests. Lint, typecheck and production build passed.
- No detail sheet, external navigation, live routing/ETA, opening-hours parsing, price amount parsing, filters or reports were added.

## TASK-011 verification observed on 2026-09-14

- Selecting a marker opens a non-modal detail sheet tied to the canonical result ID; its close button receives focus and returns the map to the unselected state.
- The sheet shows distance, approximate ETA, unknown opening status, qualified price, access, wheelchair, baby-changing, unisex, raw source-supported hours and confidence.
- Unknown access/facility/hour values are labelled `NIEZNANE` or `DOSTĘP NIEZNANY`, never hidden or fabricated as a yes/no/open/free state.
- The selected sheet never contains raw source payload, source URLs or precise user coordinates. Data comes only from the validated nearby response.
- The recommendation preview remains independent from selection; choosing a different marker does not change the recommended result.
- Unit checks passed: 8 files, 32 tests. Browser suite passed: 5 Chromium tests, including detail close/reopen and 320px no-horizontal-overflow coverage. Lint, typecheck and production build passed.
- No navigation action, opening-hours calculation, price amount parsing, filters, reports or persistent selection was added.

## TASK-012 verification observed on 2026-09-14

- The selected detail sheet exposes one primary `PROWADŹ MNIE` action.
- Its URL is `https://www.google.com/maps/dir/?api=1&destination=LAT,LNG&travelmode=walking`, generated only from the selected canonical toilet coordinates.
- Destination validation rejects non-finite or out-of-world values; no malformed navigation link is produced.
- Navigation opens with `target=_blank` and `rel=noopener noreferrer`; it contains no origin/current-position parameter and never receives the browser location from this app.
- Unit checks passed: 9 files, 37 tests. Browser suite passed: 5 Chromium tests, including selected-toilet binding, walking mode and destination-only URL inspection. Lint, typecheck and production build passed.
- No route service, destination sharing, Apple/device branching, embedded map, analytics or navigation logging was added.

## TASK-013 verification observed on 2026-09-14

- The evaluator supports the dominant initial Warsaw OSM subset: `24/7`, plain daily ranges, weekday/weekend ranges, split periods and overnight periods.
- Evaluation takes an explicit instant and always uses `Europe/Warsaw`, including DST boundaries.
- Missing, malformed, public-holiday/seasonal and other unsupported strings remain `unknown`; the original raw value is retained in `openingHoursRaw`.
- API result rows expose `openingStatus: open | closed | unknown`. Preview/detail render it as a literal status with semantic colour; unknown is never shown as open.
- Unit checks passed: 10 files, 41 tests. PostGIS integration passed: 3 files, 7 tests including a 24/7 nearby row. Browser suite, lint, typecheck and production build passed.
- No natural-language/seasonal schedule parser, manual edits, price behavior, filters, list or reports were added.

## TASK-014 verification observed on 2026-09-14

- Free/paid/unknown states remain qualified from OSM `fee`; a missing tag never becomes free.
- Exact charge parsing accepts only explicit PLN decimal forms or a numeric `charge` plus `currency=PLN`, storing grosz plus currency.
- Ambiguous, ranged, conditional, prose and non-PLN values retain raw source provenance but create no monetary amount.
- Canonical ingestion and nearby API carry `priceAmountMinor`/currency. Preview/detail display free, exact paid PLN, paid without amount or unknown consistently.
- Unit checks passed: 11 files, 49 tests. PostGIS integration, browser suite, lint, typecheck and production build passed.

## TASK-015 verification observed on 2026-09-14

- MAPA/LISTA controls appear only after a successful nearby response and retain the one validated result set; switching does not trigger another request or ranking pass.
- The list keeps API order, marks the recommended result, and presents every result's name, distance, approximate walking time, source-qualified opening status and price state.
- Map and list use the same canonical selection ID. A list choice opens the established detail sheet and stays selected when switching back to the map.
- Browser coverage verifies list order/content, marker/list synchronization and the 320px responsive path. Lint, typecheck, unit checks and production build passed.

## TASK-016 verification observed on 2026-09-14

- The five composable filters act only on the loaded validated response; no location or nearby API request is added by filtering.
- Open-now requires `open`, free requires `free`, wheelchair requires `accessible`, baby-changing requires `available`, and 24h requires explicit `true`. Unknown and limited values do not pass positive filters.
- Map/list share filtered API order and canonical selection. A selected toilet is closed when a newly active filter removes it.
- The UI displays an active matching count and an explicit no-matches recovery action. Unit checks passed: 12 files, 51 tests; browser suite, lint, typecheck and production build passed.

## TASK-017 verification observed on 2026-09-14

- Searches start at 2 km. Empty results explicitly offer 5 km, then 10 km; no search expands automatically or exceeds the nearby API limit.
- Expansion and retry reuse only the in-memory browser position in the existing POST body. Initial search sends no radius override; expanded/retry requests carry only the selected radius.
- Browser coverage verifies the exact 2 km → 5 km → 10 km bodies, empty copy, error recovery, and absence of stale previews. Unit checks, lint, typecheck and production build passed.

## TASK-018 verification observed on 2026-09-14

- A deliberately generous documented support box accepts central and plausible edge-of-Warsaw locations while rejecting clearly outside places before any toilet request.
- Outside-area users receive explicit Warsaw-only copy, retry and manual map options; coordinates remain in component memory only and do not reach DOM or the nearby endpoint.
- Unit coverage verifies central/edge and clearly outside points. Browser coverage verifies no nearby request and privacy for an outside location; lint, typecheck and production build passed.

## TASK-019 verification observed on 2026-09-14

- Low-confidence results show `DANE DO POTWIERDZENIA` in the recommended preview and list; medium/high confidence remain visually quiet until the existing literal detail metadata.
- Confidence remains sourced from the nearby API; ranking, source ingestion and canonical selection are unchanged.
- Unit checks, six browser tests, lint, typecheck and production build passed.

## TASK-002 verification observed on 2026-09-13

- The current official Warsaw 19115 toilet page was verified to describe several hundred toilets and the key address/hours/fee/changing-table/wheelchair fields.
- The legacy Warsaw open-data portal and general reuse terms were reachable, but catalogue searches for `toaleta` and `toalety` returned no dataset record.
- The replacement `dane.um.warszawa.pl` catalogue could not be resolved from the current browser environment, so no current city resource ID/API/licence contract was guessed.
- A live, bounded Overpass query returned valid JSON with `osm_base` 2026-09-13T20:30:19Z and 562 Warsaw `amenity=toilets` elements (448 nodes, 114 ways).
- OSM field coverage and access-value distributions were measured and recorded in `docs/DATA_SOURCES.md`; missing tags remain unknown.
- Current OSM ODbL/attribution requirements and public Overpass operational limits were checked against OSM/OSMF documentation.
- Current official PKP pages for Warszawa Zachodnia and Warszawa Wschodnia were checked as examples of useful but unstructured operator evidence.
- No production application, schema or ingestion code was added in TASK-002.

## Known unresolved decisions

- A local disposable PostGIS test instance is available for development verification; production/staging database credentials remain unresolved.
- Exact Warsaw city toilet dataset endpoint, dataset-specific licence, authentication and update cadence.
- Production-safe OSM extract/provider path and combined-database ODbL review.
- Final production map tile provider.
- Final analytics provider.
- Real-data deduplication thresholds.
- Staging Vercel WAF rules and managed-database TLS/least-privilege verification.

## TASK-029 verification observed on 2026-09-14

- Codex Security scan `52084c14-8d7b-4608-a7e6-0b7da0cb6c37` finalized with complete coverage of six application trust surfaces and found two medium plus one low issue in the pre-fix snapshot.
- Shared request admission now rejects cross-origin, non-JSON, compressed and oversized bodies before schema/database work; actual streamed bytes are capped at 256–2,048 bytes by route.
- Scoped request limits protect all four POST routes. Vercel identity handling uses its overwritten forwarding header, while fallback state ignores spoofable headers and has expiry plus a 10,000-bucket memory cap.
- Runtime-error records are no longer created for malformed client input. Existing coordinate, analytics, error and navigation privacy rules remain intact.
- The production response now carries CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, permissions/referrer/HSTS/content-type policies and no `X-Powered-By` disclosure.
- Dependency audit initially identified vulnerable PostCSS, Sharp, Vitest and migration-tool versions. Patched pins/upgrades were installed, and npm then reported zero vulnerabilities across 408 installed packages.
- Final verification passed: lint, typecheck, 20 unit files/71 tests, 3 PostGIS files/9 tests, 10 browser tests, one mobile performance test, production build at 124 kB first-load JavaScript, and one production-mode real-PostGIS journey.
- TASK-031 must configure durable Vercel WAF rate limits and verify managed database TLS and least-privilege credentials before staging approval.

## TASK-028 verification observed on 2026-09-14

- Migrations `000001` through `000004` applied in order to the clean `gdziekibel_release_verify` PostgreSQL/PostGIS database.
- The first committed-snapshot import created 562 toilets and 562 OSM source records with zero rejects; replay created zero and updated all 562 records with zero rejects.
- A production-mode full-stack browser journey passed against the real database, covering user location, nearby results, preview, list, detail, destination-only walking navigation and report submission.
- The clean database contained 562 toilets, 562 source rows, one submitted journey report, five allowlisted analytics events and zero runtime-error events after the journey.
- Unit checks passed: 18 files, 64 tests. Database integration passed: 3 files, 9 tests. Browser regression passed: 9 tests. The performance check and production build passed; first-load JavaScript remained 124 kB.
- The accidental isolated-test report fixture was removed, and its integration test now rolls back even when an assertion fails.
- No staging deployment was claimed; staging credentials/hosting remain unavailable and belong to TASK-031.

## TASK-032 staging release verification observed on 2026-09-14

- Created the separate, protected Vercel project `gdziekibel-staging` and deployed the candidate to its stable alias: `https://gdziekibel-staging.vercel.app`. The Vercel deployment ID is `dpl_3dbxDHiDsQgh7DR2nTPy6J6Goisg`.
- Created and linked the isolated Neon Frankfurt database `gdziekibel-staging-db` on the free plan. PostGIS 3.6.4 was confirmed; migrations `000001` through `000004` ran successfully.
- The first committed-snapshot import created 562 toilets and 562 source records with zero rejects. The verified replay updated all 562 records with zero rejects.
- Replaced the staging runtime secret with a separate `gdziekibel_app` PostgreSQL role. It receives only the read/insert privileges currently required by the public runtime; it has no create-role, schema, update or delete grant.
- Published the active Vercel firewall rule `Staging public API rate limit`: a fixed-window limit of 120 requests per 60 seconds per IP over `/api/toilets/nearby`, `/api/toilet-reports`, `/api/analytics`, and `/api/errors`.
- Protected live checks passed through Vercel's automation bypass: homepage returned HTTPS and the expected CSP, geolocation policy, `nosniff`, frame and HSTS headers; a fixed Warsaw nearby POST returned HTTP 200 and 50 ranked results from Neon. Runtime-error and analytics event tables were empty before the protected checks.
- Local verification passed: staging-test discovery (2 tests), lint, typecheck, unit tests (20 files/71 tests), and production build.
- The candidate is now captured by local Git commit `f46fbef0a563b84e9df72894be7c8e623a7265af` and deployed as `dpl_7Zx5oBpPT1BEJAZf4SRsvy4pM9Hf`. Vercel protection intentionally prevents the ordinary Playwright browser suite from using the staging alias until a dedicated bypass secret is configured; the browser-control package needed to configure it was unavailable in this workspace. Production remains **not approved**; scheduled OSM refresh and external telemetry remain unconfigured.

## Next approved task

`TASK-033 — Production release` remains blocked until the protected browser smoke suite and a source-control revision are recorded. TASK-022 remains deferred pending a verified reusable city source.

## TASK-030 independent release review observed on 2026-09-14

- Verdict: **CONDITIONAL PASS** for the local engineering release candidate; not approved for staging or production.
- Fresh checks passed: lint, typecheck, 20 unit files/71 tests, 3 real-PostGIS files/9 tests, 10 Chromium tests, one production mobile performance test, one production-mode real-PostGIS journey, production build and online dependency audit with zero vulnerabilities.
- Release blocker: the current `aria-hidden` decorative SVG and clamped local marker projection do not satisfy the approved Warsaw-map/manual-browse requirements or the MapLibre/production-safe tile-provider architecture. The denied-location fallback links only to that same illustration.
- Staging evidence remains unavailable: there is no Git revision, hosted preview, managed database/TLS/least-privilege proof, durable WAF configuration, observability check or rollback exercise.
- Production-safe scheduled OSM refresh remains unconfigured; the committed snapshot/manual importer is reproducible but is not a production refresh service.
- CI does not yet run the architecture's real-PostGIS integration or milestone browser gates.
- TASK-022 remains explicitly deferred. Installable PWA polish remains future backlog and is not an MVP blocker.
- The review changed planning/status documentation only and did not modify application, database, test, dependency or runtime configuration code.

## TASK-031 geographic Warsaw map remediation observed on 2026-09-14

- MapLibre GL JS 6.9 with OpenFreeMap Liberty now provides the activated geographic Warsaw map; `NEXT_PUBLIC_MAP_STYLE_URL` supports an approved HTTPS replacement and explicitly rejects public OSM tile hosts.
- Map code/provider requests remain lazy until location sharing or explicit manual browsing. The matching MapLibre worker modules are copied to a same-origin public directory before development/build.
- Browser location and toilets render at real coordinates. Selection remains synchronized with the accessible list/detail journey, and provider failure leaves that list path usable.
- Manual browsing starts from a documented fixed Warsaw center at 10 km, never displays that browse point as the user's position, and is explicitly labelled `TRYB RĘCZNY`.
- OpenFreeMap attribution, commercial-use permission, no-SLA risk and privacy/CDN behavior are documented in ADR-0002 and README.
- Visual inspection at 390×844 and 320×640 confirmed Warsaw streets, Wisła, labelled controls, attribution and no horizontal overflow; browser error/warning logs were empty.
- Verification passed: lint, typecheck, 20 unit files/71 tests, 11 Chromium tests, 3 real-PostGIS files/9 tests, production build, mobile performance, production full-stack journey and dependency audit with zero vulnerabilities.
- TASK-030's sole product/architecture blocker is resolved. No staging deployment was started.
