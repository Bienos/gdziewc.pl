const JSON_MEDIA_TYPE = "application/json";

export type JsonRequestFailure = "cross_origin" | "invalid_json" | "media_type" | "too_large";

export type JsonRequestResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: JsonRequestFailure; status: 400 | 403 | 413 | 415 };

function declaredLength(request: Request): number | null {
  const raw = request.headers.get("content-length");
  if (raw === null) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function hasAllowedOrigin(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite !== null && fetchSite !== "same-origin" && fetchSite !== "none") return false;

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const allowedHosts = new Set([
        new URL(request.url).host,
        request.headers.get("host"),
        request.headers.get("x-forwarded-host"),
      ].filter((value): value is string => Boolean(value)));
      if (!allowedHosts.has(new URL(origin).host)) return false;
    } catch {
      return false;
    }
  }
  return true;
}

export async function readBoundedJson(request: Request, maxBytes: number): Promise<JsonRequestResult> {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  const contentEncoding = request.headers.get("content-encoding")?.trim().toLowerCase();
  if (mediaType !== JSON_MEDIA_TYPE || (contentEncoding && contentEncoding !== "identity")) {
    return { ok: false, reason: "media_type", status: 415 };
  }
  if (!hasAllowedOrigin(request)) return { ok: false, reason: "cross_origin", status: 403 };

  const length = declaredLength(request);
  if (length !== null && length > maxBytes) return { ok: false, reason: "too_large", status: 413 };
  if (!request.body) return { ok: false, reason: "invalid_json", status: 400 };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { ok: false, reason: "too_large", status: 413 };
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { ok: true, value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown };
  } catch {
    return { ok: false, reason: "invalid_json", status: 400 };
  } finally {
    reader.releaseLock();
  }
}
