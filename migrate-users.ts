
import { db, client } from "./lib/db";
import { users } from "./db/schema";
import { sql } from "drizzle-orm";

async function migrateData() {
    try {
        console.log("Checking if old 'user' table exists...");

        // Check if old table exists
        const tableCheck = await db.execute(sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'user'
            );
        `);

        if (!tableCheck[0].exists) {
            console.log("Old 'user' table does not exist. Nothing to migrate.");
            process.exit(0);
        }

        console.log("Found old 'user' table. Starting data migration...");

        // Copy data from "user" to users
        // Use raw SQL because Drizzle schema no longer has "user" table
        await db.execute(sql`
            INSERT INTO users (id, name, email, "emailVerified", image, "createdAt", "updatedAt")
            SELECT id, name, email, "emailVerified", image, "createdAt", "updatedAt"
            FROM "user"
            ON CONFLICT (id) DO NOTHING;
        `);

        console.log("Data migration to 'users' table completed successfully.");

        // Optional: you might want to keep the old table for a bit, 
        // but if you are sure, you can run: DROP TABLE "user";
        console.log("Note: The old 'user' table still exists. You can drop it manually if needed.");

    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await client.end();
        process.exit(0);
    }
}

migrateData();
