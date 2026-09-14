# TASK-029 — Security/privacy review

Status: Complete

## Goal

Review the release candidate's actual trust boundaries and fix confirmed release-blocking security or privacy defects only.

## Acceptance criteria

- Precise user location is not logged, persisted, placed in URLs, analytics or error records.
- Anonymous write endpoints have proportionate abuse and oversized-body controls.
- External and user-controlled data is schema-validated before sensitive use or persistence.
- Database operations remain parameterised and credentials remain environment-only.
- Browser responses use a production-safe security-header baseline.
- Dependency and secret checks have recorded evidence.
- A source-backed Codex Security report is finalized and linked from the task evidence.

## Constraints

- No authentication subsystem or unrelated product expansion.
- Do not weaken the location flow, report privacy, OSM validation or attribution.
- Preserve safe, generic client/server error responses without request-body logging.

## Definition of done

TASK-029 is complete when the standard security scan is finalized, confirmed findings are remediated and verified, and remaining deployment assumptions are explicitly documented.

## Verification evidence

- Standard scan `52084c14-8d7b-4608-a7e6-0b7da0cb6c37` finalized with two medium and one low finding against the pre-fix snapshot: public-write abuse, pre-validation body buffering and missing anti-framing headers.
- [Final Codex Security report](/private/var/folders/hv/ytgc67x56fb_qfkfl9f1z2yh0000gn/T/codex-security-scans-f1rYPg/GDZIE-KIBEL/unversioned_20260914T140636Z_ynwjbgkr/report.md) and its [canonical findings](/private/var/folders/hv/ytgc67x56fb_qfkfl9f1z2yh0000gn/T/codex-security-scans-f1rYPg/GDZIE-KIBEL/unversioned_20260914T140636Z_ynwjbgkr/findings.json) were generated and sealed.
- All POST routes now require same-origin JSON, reject compressed/foreign/non-JSON bodies, stream with actual-byte ceilings and return `413` before schema/database work when oversized.
- Reports, analytics, runtime errors and nearby queries now use scoped short-lived limits. Vercel's overwritten client header is used only on Vercel; the non-Vercel fallback ignores spoofable forwarding headers, prunes expired buckets and has a hard memory cap.
- Client-validation failures no longer create runtime-error rows. Precise user coordinates remain absent from logs, storage, URLs, analytics, error telemetry and external navigation origins.
- Shared responses now disable framing and framework disclosure and set CSP, permissions, referrer, HSTS and content-type policies.
- Repository secret-pattern inspection found variable names/test placeholders only and no committed credential value.
- Dependency remediation pinned patched PostCSS and Sharp transitives, upgraded `node-pg-migrate` to 8.0.4 and Vitest to 5.0.0; npm reported zero vulnerabilities across the installed dependency tree.
- `npm run lint`, `npm run typecheck`, 20 unit files/71 tests, 3 PostGIS integration files/9 tests, 10 browser tests, the production performance check, production build and real-PostGIS full-stack journey all passed.
- Staging must still configure durable Vercel WAF limits for all four POST routes and verify managed-database TLS/least-privilege credentials in TASK-031.
