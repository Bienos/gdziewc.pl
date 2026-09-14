# TASK-014 — Price/free state

Status: Complete (2026-09-14)

## Goal

Normalize free, paid and unknown toilet price states consistently, carrying a PLN amount only when the source charge is unambiguous.

## Acceptance criteria

- OSM free/paid/unknown semantics remain qualified and never infer free from a missing fee tag.
- Safe PLN charge forms normalize into amount-in-grosz/currency without rounding ambiguity.
- Ambiguous/non-PLN/multi-price/conditional charge strings retain raw charge and paid state but no invented amount.
- Canonical price amount/currency update during ingestion and are returned by nearby API.
- Preview/detail render free, paid with known amount, paid without amount, and unknown consistently.
- Unit/integration/browser tests cover parsing, unknown semantics, ingestion/API mapping and UI labels.

## Constraints

- Only parse explicit decimal PLN or currency-tagged PLN values.
- Do not parse admission bundles, ranges, conditionals, other currencies or prose.
- Preserve chargeRaw/source raw payload.
- Do not add price filters before TASK-016.

## Definition of done

TASK-014 is complete when price/free data is represented consistently from OSM source through API and UI without fabricating unknown amounts.
