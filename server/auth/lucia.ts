import { fileURLToPath } from "url";

import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

const __dirname = fileURLToPath(new URL('.', import.meta.url))

import sqlite from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { sessionTable, userTable } from "./schema.js";
import * as schema from "./schema.js";

const sqliteDB = sqlite(__dirname + './db.sqlite');
export const db = drizzle(sqliteDB, { schema });

await migrate(db, { migrationsFolder: __dirname + '../../drizzle' });

await db.insert(userTable).values({
	id: "hoge",
}).onConflictDoNothing();

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: false
		}
	}
});