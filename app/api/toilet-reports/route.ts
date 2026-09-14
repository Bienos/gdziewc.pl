import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getDatabasePool } from "../../../lib/db/pool";
import { toiletReportRequestSchema } from "../../../lib/toilets/reports";
import { consumeReportRateLimit, reportRateLimitKey } from "../../../lib/toilets/report-rate-limit";
import { storeSafeErrorBestEffort } from "../../../lib/observability/error-store";
import { readBoundedJson } from "../../../lib/http/request-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStoreHeaders = { "cache-control": "no-store" };

export async function POST(request: Request) {
  const body = await readBoundedJson(request, 2_048);
  if (!body.ok) {
    return NextResponse.json(
      { error: { code: body.reason === "too_large" ? "PAYLOAD_TOO_LARGE" : "INVALID_REPORT", message: "Sprawdź zgłoszenie i spróbuj ponownie." } },
      { status: body.status, headers: noStoreHeaders },
    );
  }
  let input;
  try {
    input = toiletReportRequestSchema.parse(body.value);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof ZodError) {
      return NextResponse.json({ error: { code: "INVALID_REPORT", message: "Sprawdź zgłoszenie i spróbuj ponownie." } }, { status: 400, headers: noStoreHeaders });
    }
    return NextResponse.json({ error: { code: "INVALID_REPORT", message: "Sprawdź zgłoszenie i spróbuj ponownie." } }, { status: 400, headers: noStoreHeaders });
  }
  const limit = consumeReportRateLimit(reportRateLimitKey(request));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: { code: "REPORT_RATE_LIMITED", message: "Za dużo zgłoszeń. Spróbuj ponownie później." } },
      { status: 429, headers: { ...noStoreHeaders, "retry-after": String(limit.retryAfterSeconds) } },
    );
  }
  try {
    await getDatabasePool().query(
      "INSERT INTO toilet_reports (toilet_id, issue_type, note) VALUES ($1, $2, $3)",
      [input.toiletId, input.issueType, input.note ?? null],
    );
    return NextResponse.json({ status: "pending" }, { status: 201, headers: noStoreHeaders });
  } catch (error) {
    await storeSafeErrorBestEffort({ code: "report_failed", surface: "report" });
    const missingDatabase = error instanceof Error && error.message.startsWith("DATABASE_URL is required");
    return NextResponse.json({ error: { code: missingDatabase ? "SERVICE_NOT_CONFIGURED" : "REPORT_UNAVAILABLE", message: "Nie udało się wysłać zgłoszenia." } }, { status: 503, headers: noStoreHeaders });
  }
}
