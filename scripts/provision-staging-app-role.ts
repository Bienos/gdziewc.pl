import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { Client } from "pg";

const APP_ROLE = "gdziekibel_app";

function escapeSqlLiteral(value: string): string {
  return value.replaceAll("'", "''");
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  const outputPath = process.env.STAGING_APP_DATABASE_URL_FILE;

  if (!databaseUrl || !outputPath) {
    throw new Error("DATABASE_URL and STAGING_APP_DATABASE_URL_FILE are required.");
  }

  const password = randomBytes(32).toString("base64url");
  const escapedPassword = escapeSqlLiteral(password);
  const client = new Client({ connectionString: databaseUrl });

  await client.connect();
  try {
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${APP_ROLE}') THEN
          ALTER ROLE ${APP_ROLE} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${escapedPassword}';
        ELSE
          CREATE ROLE ${APP_ROLE} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT PASSWORD '${escapedPassword}';
        END IF;
      END $$;

      GRANT USAGE ON SCHEMA public TO ${APP_ROLE};
      GRANT SELECT ON TABLE toilets TO ${APP_ROLE};
      GRANT INSERT ON TABLE toilet_reports, analytics_events, runtime_error_events TO ${APP_ROLE};
    `);
  } finally {
    await client.end();
  }

  const appUrl = new URL(databaseUrl);
  appUrl.username = APP_ROLE;
  appUrl.password = password;
  await writeFile(outputPath, appUrl.toString(), { encoding: "utf8", mode: 0o600 });
  console.log(`Provisioned least-privilege ${APP_ROLE} role.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
