export default Page

import { navigate, reload } from "vike/client/router";
import { usePageContext } from "../../renderer/usePageContext";
import { hc } from "hono/client";

import type { AuthRPCType } from "../../server/auth";

function Page() {
  const client = hc<AuthRPCType>('/');
  const session = usePageContext().auth ?? {};

  return (
    <>
      <h1>Account</h1>
      <button onClick={async (e) => {
        e.preventDefault();
        await client.api.auth.logout.$get();
        await reload();
      }}>Logout</button>
      <pre>
        {JSON.stringify(session, null, 2)}
      </pre>
    </>
  )
}