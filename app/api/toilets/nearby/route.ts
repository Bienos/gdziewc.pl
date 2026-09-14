import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getDatabasePool } from "../../../../lib/db/pool";
import {
  findNearbyToilets,
  nearbyRequestSchema,
  type NearbyRequest,
} from "../../../../lib/toilets/nearby";
import { storeSafeErrorBestEffort } from "../../../../lib/observability/error-store";
import { readBoundedJson } from "../../../../lib/http/request-security";
import { consumeRequestRateLimit, privacySafeClientKey } from "../../../../lib/http/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStoreHeaders = { "cache-control": "no-store" };

export async function POST(request: Request) {
  const body = await readBoundedJson(request, 1_024);
  if (!body.ok) {
    return NextResponse.json(
      { error: { code: body.reason === "too_large" ? "PAYLOAD_TOO_LARGE" : "INVALID_REQUEST", message: "Nieprawidłowe dane wyszukiwania." } },
      { status: body.status, headers: noStoreHeaders },
    );
  }
  let input: NearbyRequest;
  try {
    input = nearbyRequestSchema.parse(body.value);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message: "Nieprawidłowe dane wyszukiwania." } },
        { status: 400, headers: noStoreHeaders },
      );
    }
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "Nieprawidłowe dane wyszukiwania." } },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const limit = consumeRequestRateLimit("nearby", privacySafeClientKey(request), { maxRequests: 120, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Za dużo zapytań. Spróbuj ponownie za chwilę." } },
      { status: 429, headers: { ...noStoreHeaders, "retry-after": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const results = await findNearbyToilets(getDatabasePool(), input);
    return NextResponse.json({ results }, { headers: noStoreHeaders });
  } catch (error) {
    await storeSafeErrorBestEffort({ code: "nearby_failed", surface: "location" });
    const missingDatabase = error instanceof Error
      && error.message.startsWith("DATABASE_URL is required");
    return NextResponse.json(
      {
        error: {
          code: missingDatabase ? "SERVICE_NOT_CONFIGURED" : "INTERNAL_ERROR",
          message: "Nie udało się pobrać pobliskich toalet.",
        },
      },
      { status: 503, headers: noStoreHeaders },
    );
  }
}
