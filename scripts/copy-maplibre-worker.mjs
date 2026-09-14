import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const sourceDirectory = path.resolve("node_modules/maplibre-gl/dist");
const destinationDirectory = path.resolve("public/maplibre");

await mkdir(destinationDirectory, { recursive: true });
await Promise.all([
  "maplibre-gl-worker.mjs",
  "maplibre-gl-shared.mjs",
].map((filename) => copyFile(
  path.join(sourceDirectory, filename),
  path.join(destinationDirectory, filename),
)));
