// https://vike.dev/guard
export { guard }

import { redirect } from 'vike/abort'
import type { GuardAsync } from 'vike/types'

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  const session = pageContext.auth;

  if (session == undefined) {
    throw redirect('/login')
  }
}