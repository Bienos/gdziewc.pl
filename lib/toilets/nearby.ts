import { z } from "zod";
import type { Pool, Client } from "pg";
import {
  accessStateSchema,
  babyChangingStateSchema,
  priceStateSchema,
  unisexStateSchema,
  wheelchairStateSchema,
} from "./source-contract";
import { rankToilets } from "./ranking";
import { openingStatus, OPENING_STATUS_VALUES } from "./opening-hours";

export const nearbyRequestSchema = z.object({
  location: z.object({
    lat: z.number().finite().min(-90).max(90),
    lng: z.number().finite().min(-180).max(180),
  }).strict(),
  radiusMeters: z.number().int().min(50).max(10_000).default(2_000),
  limit: z.number().int().min(1).max(100).default(50),
}).strict();

const nearbyCandidateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  address: z.string().nullable(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  distanceMeters: z.number().int().nonnegative(),
  accessState: accessStateSchema.exclude(["not_public"]),
  priceState: priceStateSchema,
  priceAmountMinor: z.number().int().nonnegative().nullable(),
  currency: z.string().length(3).nullable(),
  open24h: z.boolean().nullable(),
  openingHoursRaw: z.string().nullable(),
  openingStatus: z.enum(OPENING_STATUS_VALUES),
  wheelchairState: wheelchairStateSchema,
  babyChangingState: babyChangingStateSchema,
  unisexState: unisexStateSchema,
  confidenceLevel: z.enum(["high", "medium", "low"]),
});

export const nearbyToiletSchema = nearbyCandidateSchema.extend({
  recommendationRank: z.number().int().positive(),
  recommendationScore: z.number().int(),
  isRecommended: z.boolean(),
});

export const nearbyResponseSchema = z.object({
  results: z.array(nearbyToiletSchema).max(100),
});

export type NearbyRequest = z.infer<typeof nearbyRequestSchema>;
export type NearbyToilet = z.infer<typeof nearbyToiletSchema>;

interface NearbyRow {
  id: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  distance_meters: number;
  access_state: z.infer<typeof nearbyCandidateSchema>["accessState"];
  price_state: z.infer<typeof nearbyCandidateSchema>["priceState"];
  price_amount_minor: number | null;
  currency: string | null;
  open_24h: boolean | null;
  opening_hours_raw: string | null;
  wheelchair_state: z.infer<typeof nearbyCandidateSchema>["wheelchairState"];
  baby_changing_state: z.infer<typeof nearbyCandidateSchema>["babyChangingState"];
  unisex_state: z.infer<typeof nearbyCandidateSchema>["unisexState"];
  confidence_level: z.infer<typeof nearbyCandidateSchema>["confidenceLevel"];
}

type QueryClient = Pick<Pool | Client, "query">;

export const NEARBY_TOILETS_SQL = `
  WITH user_location AS (
    SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography AS geom
  )
  SELECT
    t.id,
    t.name,
    t.address,
    ST_Y(t.geom::geometry)::double precision AS lat,
    ST_X(t.geom::geometry)::double precision AS lng,
    ROUND(ST_Distance(t.geom, u.geom))::integer AS distance_meters,
    t.access_state,
    t.price_state,
    t.price_amount_minor,
    t.currency,
    t.open_24h,
    t.opening_hours_raw,
    t.wheelchair_state,
    t.baby_changing_state,
    t.unisex_state,
    t.confidence_level
  FROM toilets t
  CROSS JOIN user_location u
  WHERE t.canonical_status = 'active'
    AND t.access_state <> 'not_public'
    AND ST_DWithin(t.geom, u.geom, $3)
  ORDER BY ST_Distance(t.geom, u.geom), t.id
  LIMIT $4
`;

export async function findNearbyToilets(
  client: QueryClient,
  request: NearbyRequest,
): Promise<NearbyToilet[]> {
  const input = nearbyRequestSchema.parse(request);
  const result = await client.query<NearbyRow>(
    NEARBY_TOILETS_SQL,
    [input.location.lng, input.location.lat, input.radiusMeters, input.limit],
  );

  const candidates = result.rows.map((row) => nearbyCandidateSchema.parse({
    id: row.id,
    name: row.name,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    distanceMeters: row.distance_meters,
    accessState: row.access_state,
    priceState: row.price_state,
    priceAmountMinor: row.price_amount_minor,
    currency: row.currency,
    open24h: row.open_24h,
    openingHoursRaw: row.opening_hours_raw,
    openingStatus: openingStatus(row.opening_hours_raw),
    wheelchairState: row.wheelchair_state,
    babyChangingState: row.baby_changing_state,
    unisexState: row.unisex_state,
    confidenceLevel: row.confidence_level,
  }));
  return rankToilets(candidates).map((toilet) => nearbyToiletSchema.parse(toilet));
}
