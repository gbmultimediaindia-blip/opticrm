import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL!;

// Singleton pattern for database connection to prevent "too many clients" error in dev
const globalForDb = globalLike(globalThis) as unknown as { client: postgres.Sql | undefined };

export const client = globalForDb.client ?? postgres(connectionString);
export const db = drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

function globalLike(g: any) {
    return g;
}
