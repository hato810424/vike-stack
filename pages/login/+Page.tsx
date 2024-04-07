export default Page

import { useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'
import { navigate } from 'vike/client/router'
import { hc } from 'hono/client';

import type { AuthRPCType } from '../../server/auth';

function Page() {
  const client = hc<AuthRPCType>('/');
  const [error, setError] = useState("");

  return (
    <>
      <h1>Login</h1>
      <p>username: hoge</p>
      
      <form onSubmit={async (e) => {
        e.preventDefault()
        setError("");
        const id = getHtmlInputElement('username').value
        
        const response = await client.api.auth.login.$post({
          json: {
            id: id
          }
        })
        
        if (response.ok) {
          await navigate("/account");
        } else {
          setError(await response.text());
        }
      }} style={{ marginTop: 10 }}>
        <Input id="username" value="hoge" />
        <div style={{ color: 'red', marginTop: 5, marginBottom: -6 }} id="validation">
          {error}
        </div>
        <button type="submit" style={{ marginTop: 20 }}>
          Login
        </button>
      </form>
    </>
  )
}

function Input({ id, ...props }: { id: string } & JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ fontSize: '0.91em' }}>{id}</span>
      <br />
      <input type="text" id={id} size={20} {...props}></input>
    </label>
  )
}

function getHtmlInputElement(id: string): HTMLInputElement {
  return document.querySelector(`input#${id}`)!
}