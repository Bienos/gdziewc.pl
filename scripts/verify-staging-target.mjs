import process from "node:process";
import { URL } from "node:url";

const target = process.env.STAGING_BASE_URL;

if (!target) {
  throw new Error("STAGING_BASE_URL is required. Supply the HTTPS URL of the deployed staging environment.");
}

let url;
try {
  url = new URL(target);
} catch {
  throw new Error("STAGING_BASE_URL must be a complete HTTPS URL.");
}

if (url.protocol !== "https:") {
  throw new Error("STAGING_BASE_URL must use HTTPS.");
}

if (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1") {
  throw new Error("STAGING_BASE_URL must point to a deployed staging environment, not localhost.");
}
