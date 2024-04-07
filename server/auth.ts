import { Hono } from "hono"
import { db, lucia } from "./auth/lucia.js"
import { getCookie } from "hono/cookie"

import type { User, Session } from "lucia"
import { randomUUID } from "crypto"
import { userTable } from "./auth/schema.js"
import { eq } from "drizzle-orm"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const app = new Hono<{
	Variables: {
		user: User | null;
		session: Session | null;
	};
}>();

app.use("*", async (c, next) => {
	const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
	if (!sessionId) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		// use `header()` instead of `setCookie()` to avoid TS errors
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
			append: true
		});
	}
	if (!session) {
		c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true
		});
	}
	c.set("user", user);
	c.set("session", session);
	return next();
});

export const handler = app
.post(
	"/api/auth/login",
	zValidator(
    'json',
    z.object({
      id: z.string(),
    })
  ),
	async (c) => {
		const { id } = await c.req.json()

		if (c.get("user")?.id === id) {
			return c.json("hello " + c.get("user")?.id)
		}
		
		if (db.select().from(userTable).where(eq(userTable.id, id)).get() === undefined) {
			return c.text("user does not exist", 400);
		}

		const session = await lucia.createSession(id, {}, {
			sessionId: randomUUID(),
		});

		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
			append: true
		});

		return c.json("ok");
	}
)
.get(
	"/api/auth/logout",
	async (c) => {
		if (c.get("user") == null) return;

		await lucia.invalidateSession(c.get("session")?.id ?? "");

		c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true
		});

		return c.json("ok");
	}
)

export default app;
export type AuthRPCType = typeof handler