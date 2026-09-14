# TASK-021 — Report abuse protection

Status: Complete (2026-09-14)

## Goal

Limit repeated anonymous report submissions without retaining unnecessary personal data.

## Acceptance criteria

- Report submissions have a documented per-client request limit and receive an explicit retry-later response when exceeded.
- Only a one-way, short-lived in-memory identifier is used for limiting; no IP, user agent, coordinates, contact data or fingerprint is stored in the database.
- Invalid submissions still receive 400; limited submissions receive no-store 429; valid reports remain pending-only.
- Limit state expires automatically and can be tested deterministically.
- Browser/API/unit coverage verifies the reported data path remains functional.

## Constraints

- This is an MVP application-instance limiter, not a durable distributed rate-limit service.
- Do not add accounts, CAPTCHA, third parties, analytics or moderation automation.

## Definition of done

TASK-021 is complete when report abuse has an honest short-lived limiting control without expanding stored personal data.
