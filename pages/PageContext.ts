import type { User } from "lucia";

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      auth: User
    }
  }
}

// Tell TypeScript that this file isn't an ambient module
export {};
