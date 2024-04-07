// https://vike.dev/usePageContext
// eslint-disable-next-line react-refresh/only-export-components
export { usePageContext }
export { PageContextProvider }

import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import type { ComponentChildren } from 'preact'
import type { PageContext } from 'vike/types'

const Context = createContext<PageContext>(undefined as unknown as PageContext)

function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: ComponentChildren }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

/** https://vike.dev/usePageContext */
function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
