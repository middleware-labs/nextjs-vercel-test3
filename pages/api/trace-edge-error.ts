import { NextRequest } from 'next/server'
import { parseMsgParam } from '../../lib/errorMsg'
import {
  finishSpansAndThrow,
  startLinkedSpan,
  traceError,
  throwRequestTraceError,
} from '../../lib/traceUtil'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const tag = parseMsgParam(searchParams.get('msg') ?? undefined)

  if (!type || type === 'fatal') {
    throwRequestTraceError(traceError('[TRACE] Fatal edge trace error — intentional test', tag))
  }

  if (type === 'handled') {
    const span = startLinkedSpan('trace-trigger.edge.handled')
    const error = traceError('[TRACE] Handled edge trace error — intentional test', tag)
    finishSpansAndThrow(span, error)
  }

  throwRequestTraceError(traceError('[TRACE] Fatal edge trace error — intentional test', tag))
}
