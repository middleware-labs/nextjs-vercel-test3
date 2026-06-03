import { NextApiRequest, NextApiResponse } from 'next'
import { parseMsgParam } from '../../lib/errorMsg'
import {
  finishSpanAsError,
  finishSpansAndThrow,
  startChildOf,
  startLinkedSpan,
  traceError,
  throwRequestTraceError,
} from '../../lib/traceUtil'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type
  const tag = parseMsgParam(req.query.msg)

  // Fatal — unhandled throw marks request span as ERROR (Vercel trace drain)
  if (!type || type === 'fatal') {
    throwRequestTraceError(
      traceError('[TRACE] Fatal serverless trace error — intentional test', tag)
    )
  }

  if (type === 'async') {
    try {
      await new Promise<void>((_, reject) => {
        setTimeout(() => {
          reject(traceError('[TRACE] Async operation failed in traced context', tag))
        }, 50)
      })
    } catch (error) {
      throwRequestTraceError(error as Error)
    }
  }

  if (type === 'rejection') {
    const error = traceError(
      '[TRACE] Unhandled promise rejection inside active span',
      tag
    )
    Promise.reject(error)
    throwRequestTraceError(error)
  }

  // Handled — custom ERROR span + throw so request trace is also ERROR
  if (type === 'handled') {
    const span = startLinkedSpan('trace-trigger.handled')
    const error = traceError('[TRACE] Handled serverless trace error — intentional test', tag)
    finishSpansAndThrow(span, error)
  }

  if (type === 'nested') {
    const span = startLinkedSpan('trace-trigger.db.query')
    span.setAttribute('db.system', 'postgresql')
    span.setAttribute('db.operation', 'SELECT')
    const error = traceError('[TRACE] Nested child span database query failure', tag)
    finishSpansAndThrow(span, error)
  }

  if (type === 'deep') {
    const serviceSpan = startLinkedSpan('trace-trigger.service.call')
    const repoSpan = startChildOf('trace-trigger.repository.find', serviceSpan)
    const dbSpan = startChildOf('trace-trigger.db.execute', repoSpan)
    dbSpan.setAttribute('db.statement', 'SELECT * FROM orders WHERE id = ?')
    const error = traceError('[TRACE] Deep nested span chain failure at database layer', tag)
    finishSpanAsError(dbSpan, error)
    finishSpanAsError(repoSpan, error)
    finishSpanAsError(serviceSpan, error)
    throwRequestTraceError(error)
  }

  if (type === 'external') {
    const span = startLinkedSpan('trace-trigger.http.client')
    span.setAttribute('http.method', 'GET')
    span.setAttribute('http.url', 'https://api.example.com/checkout')
    try {
      const response = await fetch('https://httpstat.us/500', { cache: 'no-store' })
      const error = traceError(
        `[TRACE] External HTTP client span failed with status ${response.status}`,
        tag
      )
      finishSpansAndThrow(span, error)
    } catch (err) {
      const error =
        err instanceof Error && err.message.includes('[TRACE]')
          ? err
          : traceError(
              '[TRACE] External HTTP client span failure: ' + (err as Error).message,
              tag
            )
      finishSpansAndThrow(span, error)
    }
  }

  throwRequestTraceError(traceError('[TRACE] Unknown trace trigger type', tag))
}
