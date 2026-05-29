import { NextRequest } from 'next/server'
import { parseMsgParam, prefixErrorMessage } from '../../lib/errorMsg'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const tag = parseMsgParam(searchParams.get('msg') ?? undefined)

  if (type === 'response') {
    const message = prefixErrorMessage(
      '[FATAL] Edge function: invalid downstream response detected',
      tag
    )
    console.error(message)
    return new Response(
      JSON.stringify({ error: prefixErrorMessage('[FATAL] Edge function downstream response failure', tag) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  console.error(prefixErrorMessage('[FATAL] Edge runtime fatal error triggered intentionally', tag))
  throw new Error(
    prefixErrorMessage('[FATAL] Critical edge function failure — intentional test error', tag)
  )
}
