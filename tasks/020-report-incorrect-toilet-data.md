# TASK-020 — Report incorrect toilet data

Status: Complete (2026-09-14)

## Goal

Allow an anonymous person to flag inaccurate toilet information for moderation without automatically changing canonical facts.

## Acceptance criteria

- The selected toilet detail offers a report action and a compact form with a required issue category and optional short note.
- A strict same-origin POST validates canonical toilet ID, category and note length, then stores a pending report linked to that toilet.
- Reports do not record user coordinates, email, device details, raw source payload or automatic canonical updates.
- Valid success, invalid input, unavailable database and service failure have clear safe UI/API outcomes.

## Constraints

- Reports are anonymous and pending only; no public feed, moderator UI, notification, auto-merge or rate limiting (TASK-021).
- Do not introduce third-party services or analytics.

## Definition of done

TASK-020 is complete when a validated anonymous correction signal is safely stored for moderation and never overwrites toilet data.
