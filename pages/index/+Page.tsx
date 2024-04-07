export { Page }

import { css } from '../../utils/emotion'
import { Counter } from './Counter'
import { useEffect, useState } from 'preact/hooks'

import type { AppType } from '../../server/rpc'
import { hc } from 'hono/client'

function Page() {
  const [data, setData] = useState<{}>();
  const client = hc<AppType>('/');

  useEffect(() => {
    async function get() {
      const res = await client.hello.$get();
      setData(await res.json());
    }

    get();
  }, [])

  const style = css({
    padding: "1rem",
    backgroundColor: 'hotpink',
    '&:hover': {
      color: 'red',
    }
  });

  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
        <li className={style}>
          @emotion/css SSR!!
        </li>
      </ul>
      <p>Hono RPC /hello : {JSON.stringify(data)}</p>
      <button onClick={async () => {
        const res = await client.posts.$post({
          form: {
            title: 'Hello',
            body: 'Hono is a cool project',
          },
        })

        alert(JSON.stringify(await res.json()))
      }}>Post</button>
    </>
  )
}
