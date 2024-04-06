// https://vike.dev/onRenderHtml
export { onRenderHtml }

import renderToString from 'preact-render-to-string'
import { PageShell } from './PageShell'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import logoUrl from './logo.svg'
import type { OnRenderHtmlAsync } from 'vike/types'
import { getPageTitle } from './getPageTitle'
import clsx from 'clsx'

import createEmotionServer from '@emotion/server/create-instance'
import { cache } from '../utils/emotion'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext

  // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
  // onRenderHtml() to support SPA
  if (!Page) throw new Error('My onRenderHtml() hook expects pageContext.Page to be defined')

  const key = cache.key;
  const { extractCritical } = createEmotionServer(cache);

  // Alternativly, we can use an HTML stream, see https://vike.dev/streaming
  const pageHtml = renderToString(
    <PageShell pageContext={pageContext}>
      <Page />
    </PageShell>
  )

  // See https://vike.dev/head
  const title = getPageTitle(pageContext)
  const desc = pageContext.data?.description || pageContext.config.description || 'Demo of using Vike'

  let { html, css, ids } = extractCritical(pageHtml);

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
        <style data-emotion="${clsx(key, ids)}">${css}</style>
      </head>
      <body>
        <div id="vike-root">${dangerouslySkipEscape(html)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
    }
  }
}
