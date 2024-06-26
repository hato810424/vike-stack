export { PageShell }

import logoUrl from './logo.svg'
import { PageContextProvider } from './usePageContext'
import { Link } from './Link'
import type { PageContext } from 'vike/types'
import './css/index.css'
import './PageShell.css'

import type { ComponentChildren } from 'preact'

function PageShell({ children, pageContext }: { children: ComponentChildren; pageContext: PageContext }) {
  return (
    <PageContextProvider pageContext={pageContext}>
      <Layout>
        <Sidebar>
          <Logo />
          <Link href="/">Welcome</Link>
          <Link href="/about">About</Link>
          <Link href="/star-wars">Data Fetching</Link>
          <Link href="/login">Login</Link>
          <Link href="/account">Account</Link>
          {pageContext.auth != null && (
            <p>Hello {pageContext.auth?.id ?? ""}!!</p>
          )}
        </Sidebar>
        <Content>{children}</Content>
      </Layout>
    </PageContextProvider>
  )
}

function Layout({ children }: { children: ComponentChildren }) {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 900,
        margin: 'auto'
      }}
    >
      {children}
    </div>
  )
}

function Sidebar({ children }: { children: ComponentChildren }) {
  return (
    <div
      id="sidebar"
      style={{
        padding: 20,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.8em',
        borderRight: '2px solid #eee'
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: { children: ComponentChildren }) {
  return (
    <div id="page-container">
      <div
        id="page-content"
        style={{
          padding: 20,
          paddingBottom: 50,
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Logo() {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10
      }}
    >
      <a href="/">
        <img src={logoUrl} height={64} width={64} alt="logo" />
      </a>
    </div>
  )
}
