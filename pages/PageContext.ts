import type { AuthUser } from "@hono/auth-js";

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      time: Date,
      auth: AuthUser
    }
  }
}

// Tell TypeScript that this file isn't an ambient module
export {};
