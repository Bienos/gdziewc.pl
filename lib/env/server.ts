import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(source: Record<string, string | undefined> = process.env): Environment {
  return environmentSchema.parse({ DATABASE_URL: source.DATABASE_URL });
}

export function getDatabaseUrl(source: Record<string, string | undefined> = process.env): string {
  const { DATABASE_URL } = validateEnvironment(source);
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required for database commands. Copy .env.example to .env.local first.");
  }
  return DATABASE_URL;
}
