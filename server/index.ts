// https://github.com/phonzammi/vike-hono-example/blob/main/server/index.ts
const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT) || 3000

import { Hono } from 'hono'
import { serve } from "@hono/node-server"
import { renderPage } from 'vike/server'
import { serveStatic } from '@hono/node-server/serve-static'
import { compress } from 'hono/compress'
import { poweredBy } from "hono/powered-by"

import rpcRoute from "./rpc.js"
import authRoute from "./auth.js"

import type { Session, User } from 'lucia'

const app = new Hono<{
	Variables: {
		user: User | null;
		session: Session | null;
	};
}>();

app.use(poweredBy())
app.use(compress())

app.route('/', rpcRoute)
app.route('/', authRoute)

if (isProduction) {
  app.use("/*", serveStatic({
    root: `./dist/client/`,
  }))
}

app.get("*", async (c, next) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
    auth: c.get("user"),
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return next()
  } else {
    const { body, statusCode, headers } = httpResponse
    headers.forEach(([name, value]) => c.header(name, value))
    c.status(statusCode)

    return c.body(body)
  }
})

if (isProduction) {
  console.log(`Server is running on port ${port}`);
  serve({
      fetch: app.fetch,
      port: port
  });
}

export default app