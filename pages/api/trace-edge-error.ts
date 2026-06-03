import { SpanStatusCode, trace } from '@opentelemetry/api'
import { NextRequest } from 'next/server'
import { parseMsgParam, prefixErrorMessage } from '../../lib/errorMsg'

export const config = {
  runtime: 'edge',
}

const tracer = trace.getTracer('vercel-trace-triggers-edge', '1.0')

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const tag = parseMsgParam(searchParams.get('msg') ?? undefined)

  const span = tracer.startSpan('trace-trigger.edge.request')
  span.setAttribute('trace.trigger.runtime', 'edge')

  try {
    if (type === 'handled') {
      const message = prefixErrorMessage('[TRACE] Handled edge trace error — intentional test', tag)
      const error = new Error(message)
      span.recordException(error)
      span.setStatus({ code: SpanStatusCode.ERROR, message })
      span.end()
      return new Response(JSON.stringify({ error: message, trace: 'handled' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const message = prefixErrorMessage('[TRACE] Fatal edge trace error — intentional test', tag)
    span.recordException(new Error(message))
    span.setStatus({ code: SpanStatusCode.ERROR, message })
    span.end()
    throw new Error(message)
  } catch (err) {
    if (span.isRecording()) {
      span.recordException(err as Error)
      span.setStatus({ code: SpanStatusCode.ERROR, message: (err as Error).message })
      span.end()
    }
    throw err
  }
}
