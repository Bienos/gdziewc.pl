import { z } from "zod";
import {
  normalizedToiletSourceRecordSchema,
  type NormalizedToiletSourceRecord,
  type ToiletSourceAdapter,
} from "../source-contract";
import { parseExplicitPlnCharge } from "../price";

const tagsSchema = z.record(z.string(), z.string());
const baseElementSchema = z.object({
  id: z.number().int().positive(),
  tags: tagsSchema.refine((tags) => tags.amenity === "toilets", "OSM element must be amenity=toilets"),
  timestamp: z.string().datetime({ offset: true }).optional(),
  version: z.number().int().positive().optional(),
});

const osmNodeSchema = baseElementSchema.extend({
  type: z.literal("node"),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

const osmWaySchema = baseElementSchema.extend({
  type: z.literal("way"),
  center: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }),
});

export const osmElementSchema = z.discriminatedUnion("type", [osmNodeSchema, osmWaySchema]);
export type OsmElement = z.infer<typeof osmElementSchema>;

export const osmResponseSchema = z.object({
  osm3s: z.object({
    timestamp_osm_base: z.string().datetime({ offset: true }),
  }),
  elements: z.array(osmElementSchema),
});

function nullableTag(tags: Record<string, string>, key: string): string | null {
  const value = tags[key]?.trim();
  return value ? value : null;
}

function normalizeAccess(value: string | undefined): NormalizedToiletSourceRecord["accessState"] {
  if (value === "yes" || value === "permissive") return "public";
  if (value === "customers" || value === "destination") return "restricted";
  if (value === "private" || value === "no") return "not_public";
  return "unknown";
}

function normalizePrice(value: string | undefined): NormalizedToiletSourceRecord["priceState"] {
  if (value === "no") return "free";
  if (value === "yes") return "paid";
  return "unknown";
}

function normalizeWheelchair(value: string | undefined): NormalizedToiletSourceRecord["wheelchairState"] {
  if (value === "yes" || value === "designated") return "accessible";
  if (value === "limited") return "limited";
  if (value === "no") return "not_accessible";
  return "unknown";
}

function normalizeBabyChanging(value: string | undefined): NormalizedToiletSourceRecord["babyChangingState"] {
  if (value === "yes") return "available";
  if (value === "limited") return "limited";
  if (value === "no") return "unavailable";
  return "unknown";
}

function normalizeUnisex(value: string | undefined): NormalizedToiletSourceRecord["unisexState"] {
  if (value === "yes") return "yes";
  if (value === "no") return "no";
  return "unknown";
}

function buildAddress(tags: Record<string, string>): string | null {
  const full = nullableTag(tags, "addr:full");
  if (full) return full;
  const street = nullableTag(tags, "addr:street");
  const number = nullableTag(tags, "addr:housenumber");
  return street ? [street, number].filter(Boolean).join(" ") : null;
}

export const osmToiletSourceAdapter: ToiletSourceAdapter<unknown> = {
  sourceName: "openstreetmap",
  normalize(input, context) {
    const element = osmElementSchema.parse(input);
    const location = element.type === "node"
      ? { lat: element.lat, lng: element.lon, precision: "surveyed_node" as const }
      : { lat: element.center.lat, lng: element.center.lon, precision: "geometry_centre" as const };
    const openingHoursRaw = nullableTag(element.tags, "opening_hours");
    const chargeRaw = nullableTag(element.tags, "charge");
    const parsedCharge = parseExplicitPlnCharge(chargeRaw, nullableTag(element.tags, "currency"));

    return normalizedToiletSourceRecordSchema.parse({
      sourceName: "openstreetmap",
      sourceRecordId: `osm/${element.type}/${element.id}`,
      sourceElementType: element.type,
      sourceUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
      licence: {
        id: "ODbL-1.0",
        url: "https://www.openstreetmap.org/copyright",
        attribution: "© OpenStreetMap contributors",
      },
      location,
      name: nullableTag(element.tags, "name"),
      address: buildAddress(element.tags),
      accessState: normalizeAccess(element.tags.access),
      priceState: normalizePrice(element.tags.fee),
      chargeRaw,
      priceAmountMinor: parsedCharge?.amountMinor ?? null,
      currency: parsedCharge?.currency ?? null,
      openingHoursRaw,
      open24h: openingHoursRaw === "24/7" ? true : null,
      wheelchairState: normalizeWheelchair(element.tags.wheelchair ?? element.tags["toilets:wheelchair"]),
      babyChangingState: normalizeBabyChanging(element.tags.changing_table),
      unisexState: normalizeUnisex(element.tags.unisex),
      operator: nullableTag(element.tags, "operator"),
      sourceUpdatedAt: element.timestamp ?? null,
      sourceDatasetUpdatedAt: context.datasetUpdatedAt,
      fetchedAt: context.fetchedAt,
      rawPayload: element,
    });
  },
};
