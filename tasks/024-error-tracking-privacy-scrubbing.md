# TASK-024 — Error tracking / privacy scrubbing

Status: Complete (2026-09-14)

## Goal

Make runtime failures observable without allowing location, request bodies or user-entered text into error records.

## Acceptance criteria

- Client and server failures can emit a small allowlisted error record.
- Scrubbing removes coordinates, request bodies, notes, URLs with query strings and database/error details.
- Error reporting never blocks the product flow and avoids third-party services.
- Tests prove sensitive text cannot pass the scrubber.

## Constraints

- No session replay, IP/device capture, analytics expansion or external error provider.

## Definition of done

TASK-024 is complete when safe error observability exists with tested privacy scrubbing.
