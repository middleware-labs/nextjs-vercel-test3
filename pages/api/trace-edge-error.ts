import { SpanKind } from '@opentelemetry/api'
import { NextRequest } from 'next/server'
import { parseMsgParam } from '../../lib/errorMsg'
import { markSpanError, runActiveSpan, traceError } from '../../lib/traceUtil'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const tag = parseMsgParam(searchParams.get('msg') ?? undefined)

  return runActiveSpan(
    'api /api/trace-edge-error',
    async (span) => {
      span.setAttributes({
        'http.method': 'GET',
        'http.route': '/api/trace-edge-error',
        'trace.trigger.runtime': 'edge',
        'trace.trigger.type': type ?? 'fatal',
      })

      if (type === 'handled') {
        const error = traceError('[TRACE] Handled edge trace error — intentional test', tag)
        markSpanError(span, error)
        span.setAttribute('http.status_code', 500)
        return new Response(JSON.stringify({ error: error.message, trace: 'handled' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const error = traceError('[TRACE] Fatal edge trace error — intentional test', tag)
      markSpanError(span, error)
      span.setAttribute('http.status_code', 500)
      throw error
    },
    { kind: SpanKind.SERVER }
  )
}
