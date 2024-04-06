// https://vike.dev/onRenderClient
export { onRenderClient }

import { hydrate, render } from 'preact'
import { PageShell } from './PageShell'
import { getPageTitle } from './getPageTitle'
import type { OnRenderClientAsync } from 'vike/types'

import { CacheProvider } from '@emotion/react'
import { cache } from '../utils/emotion'

const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page } = pageContext

  // This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
  // to support SPA
  if (!Page) throw new Error('My onRenderClient() hook expects pageContext.Page to be defined')

  const container = document.getElementById('vike-root')
  if (!container) throw new Error('DOM element #vike-root not found')

  const page = (
    <CacheProvider value={cache}>
      <PageShell pageContext={pageContext}>
        <Page />
      </PageShell>
    </CacheProvider>
  )
  if (pageContext.isHydration) {
    hydrate(page, container)
  } else {
    render(page, container)
  }
  document.title = getPageTitle(pageContext)
}
