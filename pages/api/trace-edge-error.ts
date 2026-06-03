import { NextRequest } from 'next/server'
import { parseMsgParam } from '../../lib/errorMsg'
import { startLinkedSpan, traceError, throwTraceError } from '../../lib/traceUtil'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const tag = parseMsgParam(searchParams.get('msg') ?? undefined)

  if (!type || type === 'fatal') {
    throwTraceError(traceError('[TRACE] Fatal edge trace error — intentional test', tag))
  }

  if (type === 'handled') {
    const span = startLinkedSpan('trace-trigger.edge.handled')
    throwTraceError(
      traceError('[TRACE] Handled edge trace error — intentional test', tag),
      span
    )
  }

  throwTraceError(traceError('[TRACE] Fatal edge trace error — intentional test', tag))
}
