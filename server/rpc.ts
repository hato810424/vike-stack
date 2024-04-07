import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

export const handler = app
.get(
  '/hello',
  (c) => {
    return c.json({
      hello: 'world!',
    })
  }
)
.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      title: z.string(),
      body: z.string(),
    })
  ),
  (c) => {
    return c.json({
        ok: true,
        message: 'Created!',
    }, 201)
  }
)

export default app;
export type AppType = typeof handler