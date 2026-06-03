import { SpanStatusCode } from '@opentelemetry/api'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseMsgParam, prefixErrorMessage } from '../../lib/errorMsg'
import { failSpan, recordSpanError, startChildSpan, traceTracer } from '../../lib/traceUtil'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type
  const tag = parseMsgParam(req.query.msg)

  const rootSpan = traceTracer.startSpan('trace-trigger.request')
  rootSpan.setAttribute('trace.trigger.type', type ?? 'fatal')
  rootSpan.setAttribute('trace.trigger.runtime', 'nodejs')

  try {
    switch (type) {
      case 'handled': {
        const error = recordSpanError(
          rootSpan,
          '[TRACE] Handled serverless trace error — intentional test',
          tag
        )
        rootSpan.end()
        return res.status(500).json({ error: error.message, trace: 'handled' })
      }

      case 'nested': {
        const childSpan = startChildSpan('trace-trigger.db.query', rootSpan)
        childSpan.setAttribute('db.system', 'postgresql')
        childSpan.setAttribute('db.operation', 'SELECT')
        failSpan(childSpan, '[TRACE] Nested child span database query failure', tag)
      }

      case 'deep': {
        const serviceSpan = startChildSpan('trace-trigger.service.call', rootSpan)
        const repoSpan = startChildSpan('trace-trigger.repository.find', serviceSpan)
        const dbSpan = startChildSpan('trace-trigger.db.execute', repoSpan)
        dbSpan.setAttribute('db.statement', 'SELECT * FROM orders WHERE id = ?')
        failSpan(dbSpan, '[TRACE] Deep nested span chain failure at database layer', tag)
      }

      case 'async': {
        rootSpan.setAttribute('trace.trigger.async', true)
        await new Promise((_, reject) => {
          setTimeout(() => {
            reject(
              new Error(
                prefixErrorMessage('[TRACE] Async operation failed in traced context', tag)
              )
            )
          }, 50)
        })
        break
      }

      case 'rejection': {
        rootSpan.setAttribute('trace.trigger.rejection', true)
        const message = prefixErrorMessage(
          '[TRACE] Unhandled promise rejection inside active span',
          tag
        )
        Promise.reject(new Error(message))
        rootSpan.end()
        return res.status(500).json({ error: message, trace: 'rejection' })
      }

      case 'external': {
        const fetchSpan = startChildSpan('trace-trigger.http.client', rootSpan)
        fetchSpan.setAttribute('http.method', 'GET')
        fetchSpan.setAttribute('http.url', 'https://api.example.com/checkout')
        try {
          const response = await fetch('https://httpstat.us/500', { cache: 'no-store' })
          failSpan(
            fetchSpan,
            `[TRACE] External HTTP client span failed with status ${response.status}`,
            tag
          )
        } catch (err) {
          failSpan(
            fetchSpan,
            '[TRACE] External HTTP client span failure: ' + (err as Error).message,
            tag
          )
        }
      }

      default:
        failSpan(rootSpan, '[TRACE] Fatal serverless trace error — intentional test', tag)
    }
  } catch (err) {
    if (rootSpan.isRecording()) {
      rootSpan.recordException(err as Error)
      rootSpan.setStatus({
        code: SpanStatusCode.ERROR,
        message: (err as Error).message,
      })
      rootSpan.end()
    }
    throw err
  }
}
