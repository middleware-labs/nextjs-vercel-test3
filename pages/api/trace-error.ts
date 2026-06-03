import { NextApiRequest, NextApiResponse } from 'next'
import { parseMsgParam } from '../../lib/errorMsg'
import {
  finishSpanAsError,
  startChildOf,
  startLinkedSpan,
  traceError,
  throwTraceError,
} from '../../lib/traceUtil'

/**
 * Trace drain note: look for serverless spans (service.name = nextjs-vercel-test-1.0),
 * not only vercel.edge-network — edge spans may keep status {} even on 500.
 * Throwing ensures the function trace gets status.code: 2.
 */
export default async function handler(_req: NextApiRequest, _res: NextApiResponse) {
  const type = Array.isArray(_req.query.type) ? _req.query.type[0] : _req.query.type
  const tag = parseMsgParam(_req.query.msg)

  if (!type || type === 'fatal') {
    throwTraceError(
      traceError('[TRACE] Fatal serverless trace error — intentional test', tag)
    )
  }

  if (type === 'async') {
    await new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(traceError('[TRACE] Async operation failed in traced context', tag))
      }, 50)
    })
  }

  if (type === 'rejection') {
    const error = traceError(
      '[TRACE] Unhandled promise rejection inside active span',
      tag
    )
    Promise.reject(error)
    throwTraceError(error)
  }

  if (type === 'handled') {
    const span = startLinkedSpan('trace-trigger.handled')
    throwTraceError(
      traceError('[TRACE] Handled serverless trace error — intentional test', tag),
      span
    )
  }

  if (type === 'nested') {
    const span = startLinkedSpan('trace-trigger.db.query')
    span.setAttribute('db.system', 'postgresql')
    span.setAttribute('db.operation', 'SELECT')
    throwTraceError(
      traceError('[TRACE] Nested child span database query failure', tag),
      span
    )
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
    throwTraceError(error)
  }

  if (type === 'external') {
    const span = startLinkedSpan('trace-trigger.http.client')
    span.setAttribute('http.method', 'GET')
    span.setAttribute('http.url', 'https://api.example.com/checkout')
    try {
      const response = await fetch('https://httpstat.us/500', { cache: 'no-store' })
      throwTraceError(
        traceError(
          `[TRACE] External HTTP client span failed with status ${response.status}`,
          tag
        ),
        span
      )
    } catch (err) {
      const error =
        err instanceof Error && err.message.includes('[TRACE]')
          ? err
          : traceError(
              '[TRACE] External HTTP client span failure: ' + (err as Error).message,
              tag
            )
      throwTraceError(error, span)
    }
  }

  throwTraceError(traceError('[TRACE] Unknown trace trigger type', tag))
}
