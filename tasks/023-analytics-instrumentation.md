# TASK-023 — Analytics instrumentation

Status: Complete (2026-09-14)

## Goal

Capture the core product funnel without collecting precise location or user identity.

## Acceptance criteria

- Explicit, allowlisted anonymous events cover location action, nearby result state, view switch, filter use, detail open, navigation action and report outcome.
- Event payloads contain no coordinates, addresses, free-text notes, IDs that identify people, request bodies or device fingerprinting.
- The client emits only same-origin events and failures never interrupt the core journey.
- Event storage/retention is documented and testable.

## Constraints

- Do not add third-party analytics, cookies, cross-site calls, session replay or identity tracking.
- Keep location private and do not send toilet names/addresses in events.

## Definition of done

TASK-023 is complete when a minimal anonymous funnel is captured safely without altering app behavior.
