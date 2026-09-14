import { z } from "zod";

export const accessStateSchema = z.enum(["public", "restricted", "not_public", "unknown"]);
export const priceStateSchema = z.enum(["free", "paid", "unknown"]);
export const wheelchairStateSchema = z.enum(["accessible", "limited", "not_accessible", "unknown"]);
export const babyChangingStateSchema = z.enum(["available", "limited", "unavailable", "unknown"]);
export const unisexStateSchema = z.enum(["yes", "no", "unknown"]);

export const normalizedToiletSourceRecordSchema = z.object({
  sourceName: z.literal("openstreetmap"),
  sourceRecordId: z.string().regex(/^osm\/(node|way)\/\d+$/),
  sourceElementType: z.enum(["node", "way"]),
  sourceUrl: z.string().url(),
  licence: z.object({
    id: z.literal("ODbL-1.0"),
    url: z.literal("https://www.openstreetmap.org/copyright"),
    attribution: z.literal("© OpenStreetMap contributors"),
  }),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    precision: z.enum(["surveyed_node", "geometry_centre"]),
  }),
  name: z.string().min(1).nullable(),
  address: z.string().min(1).nullable(),
  accessState: accessStateSchema,
  priceState: priceStateSchema,
  chargeRaw: z.string().min(1).nullable(),
  priceAmountMinor: z.number().int().nonnegative().nullable(),
  currency: z.literal("PLN").nullable(),
  openingHoursRaw: z.string().min(1).nullable(),
  open24h: z.boolean().nullable(),
  wheelchairState: wheelchairStateSchema,
  babyChangingState: babyChangingStateSchema,
  unisexState: unisexStateSchema,
  operator: z.string().min(1).nullable(),
  sourceUpdatedAt: z.string().datetime({ offset: true }).nullable(),
  sourceDatasetUpdatedAt: z.string().datetime({ offset: true }),
  fetchedAt: z.string().datetime({ offset: true }),
  rawPayload: z.record(z.string(), z.unknown()),
});

export type NormalizedToiletSourceRecord = z.infer<typeof normalizedToiletSourceRecordSchema>;

export interface ToiletSourceAdapter<Input> {
  readonly sourceName: NormalizedToiletSourceRecord["sourceName"];
  normalize(input: Input, context: { datasetUpdatedAt: string; fetchedAt: string }): NormalizedToiletSourceRecord;
}
