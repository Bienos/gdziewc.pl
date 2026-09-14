# TASK-019 — Data confidence display

Status: Complete (2026-09-14)

## Goal

Surface source-data confidence where it changes a person's decision, while keeping high-confidence routine results visually calm.

## Acceptance criteria

- Low confidence is visibly qualified in the recommended preview and list result, in addition to full detail metadata.
- Medium/high confidence retain literal detail-sheet labels without adding noisy badges to every map/list result.
- Confidence wording is explanatory and never implies that low-confidence data is unusable or verified.
- The response contract/ranking remains unchanged and selections continue to use canonical IDs.
- Browser and unit coverage verify low-confidence visibility and no regression to selection/privacy flows.

## Constraints

- Do not change scoring weights, source ingestion, add manual verification, reports, analytics or a confidence filter.
- Reuse the API confidence level; do not fabricate a more granular score.

## Definition of done

TASK-019 is complete when low-confidence results are clearly qualified in the primary decision surfaces and all confidence levels remain literal in details.
