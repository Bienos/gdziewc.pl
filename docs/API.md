# API contracts

## Nearby toilets

`POST /api/toilets/nearby`

Request:

```json
{
  "location": { "lat": 52.2297, "lng": 21.0122 },
  "radiusMeters": 2000,
  "limit": 50
}
```

`radiusMeters` defaults to 2,000 and is bounded to 50–10,000. `limit` defaults to 50 and is bounded to 1–100. Unknown fields and invalid coordinates are rejected.

The successful response contains a deterministically recommendation-ranked `results` array. Each result exposes the canonical toilet ID, label/address, destination coordinates, rounded distance, qualified access/price/facility states, raw source-supported hours, confidence, `recommendationRank`, transparent `recommendationScore`, and `isRecommended`. Explicitly not-public and non-active toilets are excluded.

Ranking uses distance plus named, bounded access penalties (public 0m, unknown 80m, restricted 250m) and confidence adjustments (high -80m, medium -40m, low 0m). Lower is better. Ties use distance, confidence, then canonical ID. Unknown hours, price and facilities do not affect the score.

Privacy and safety:

- current user coordinates are accepted only in the POST body and are not echoed;
- JSON requests require `Content-Type: application/json`, a same-origin browser context, and an actual body below the route's small byte budget;
- the endpoint does not persist or log the body/location;
- responses use `Cache-Control: no-store`;
- SQL is parameterized and bounded;
- a privacy-safe, short-lived request limit runs before the database query;
- errors never expose database details, request values, or credentials.

## Toilet reports

`POST /api/toilet-reports` accepts a canonical toilet UUID, an allowlisted issue type, and an optional trimmed note up to 500 characters. Reports are stored as pending observations and never change canonical facts automatically.

The same JSON/origin/body-size admission applies. Reports allow five accepted attempts per privacy-safe client bucket in 15 minutes and return `429` with `Retry-After` when limited.

## Analytics and runtime errors

`POST /api/analytics` accepts only the documented anonymous event enums. `POST /api/errors` accepts only an allowlisted `{ code, surface }` pair. Both reject coordinates, URLs, report notes, arbitrary messages and unknown fields, use short-lived request limits, and never return stored data.
