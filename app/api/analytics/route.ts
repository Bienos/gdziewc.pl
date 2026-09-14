import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getDatabasePool } from "../../../lib/db/pool";
import { analyticsEventSchema } from "../../../lib/analytics/events";
import { storeSafeErrorBestEffort } from "../../../lib/observability/error-store";
import { readBoundedJson } from "../../../lib/http/request-security";
import { consumeRequestRateLimit, privacySafeClientKey } from "../../../lib/http/rate-limit";

export const runtime = "nodejs";
const headers = { "cache-control": "no-store" };
export async function POST(request: Request) {
  const body = await readBoundedJson(request, 512);
  if (!body.ok) return NextResponse.json({ error: { code: body.reason === "too_large" ? "PAYLOAD_TOO_LARGE" : "INVALID_EVENT" } }, { status: body.status, headers });
  let input;
  try { input = analyticsEventSchema.parse(body.value); }
  catch (error) { return NextResponse.json({ error: { code: error instanceof ZodError ? "INVALID_EVENT" : "INVALID_EVENT" } }, { status: 400, headers }); }
  const limit = consumeRequestRateLimit("analytics", privacySafeClientKey(request), { maxRequests: 120, windowMs: 60_000 });
  if (!limit.allowed) return NextResponse.json({ error: { code: "RATE_LIMITED" } }, { status: 429, headers: { ...headers, "retry-after": String(limit.retryAfterSeconds) } });
  try {
    await getDatabasePool().query("INSERT INTO analytics_events (name, result, view, filter_key) VALUES ($1, $2, $3, $4)", [input.name, input.result ?? null, input.view ?? null, input.filter ?? null]);
    return NextResponse.json({ accepted: true }, { status: 202, headers });
  } catch {
    await storeSafeErrorBestEffort({ code: "analytics_failed", surface: "analytics" });
    return NextResponse.json({ accepted: false }, { status: 202, headers });
  }
}
