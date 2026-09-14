import { NextResponse } from "next/server";
import { scrubErrorRecord } from "../../../lib/observability/errors";
import { storeSafeErrorBestEffort } from "../../../lib/observability/error-store";
import { readBoundedJson } from "../../../lib/http/request-security";
import { consumeRequestRateLimit, privacySafeClientKey } from "../../../lib/http/rate-limit";

export async function POST(request: Request) {
  const headers = { "cache-control": "no-store" };
  const body = await readBoundedJson(request, 256);
  if (!body.ok) return NextResponse.json({ accepted: false }, { status: body.status, headers });
  const record = scrubErrorRecord(body.value);
  if (!record) return NextResponse.json({ accepted: false }, { status: 400, headers });
  const limit = consumeRequestRateLimit("errors", privacySafeClientKey(request), { maxRequests: 30, windowMs: 60_000 });
  if (!limit.allowed) return NextResponse.json({ accepted: false }, { status: 429, headers: { ...headers, "retry-after": String(limit.retryAfterSeconds) } });
  await storeSafeErrorBestEffort(record);
  return NextResponse.json({ accepted: true }, { status: 202, headers });
}
