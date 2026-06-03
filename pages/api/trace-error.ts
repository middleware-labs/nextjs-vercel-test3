import { SpanKind } from '@opentelemetry/api'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseMsgParam } from '../../lib/errorMsg'
import {
  endSpanError,
  markSpanError,
  runActiveSpan,
  startChildSpan,
  traceError,
} from '../../lib/traceUtil'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type
  const tag = parseMsgParam(req.query.msg)

  try {
    await runActiveSpan(
      'api /api/trace-error',
      async (rootSpan) => {
        rootSpan.setAttributes({
          'http.method': req.method ?? 'GET',
          'http.route': '/api/trace-error',
          'trace.trigger.type': type ?? 'fatal',
          'trace.trigger.runtime': 'nodejs',
        })

        switch (type) {
          case 'handled': {
            const error = traceError(
              '[TRACE] Handled serverless trace error — intentional test',
              tag
            )
            markSpanError(rootSpan, error)
            rootSpan.setAttribute('http.status_code', 500)
            return res.status(500).json({ error: error.message, trace: 'handled' })
          }

          case 'nested': {
            const childSpan = startChildSpan('trace-trigger.db.query', rootSpan)
            childSpan.setAttributes({
              'db.system': 'postgresql',
              'db.operation': 'SELECT',
            })
            const error = traceError(
              '[TRACE] Nested child span database query failure',
              tag
            )
            endSpanError(childSpan, error)
            markSpanError(rootSpan, error)
            throw error
          }

          case 'deep': {
            const serviceSpan = startChildSpan('trace-trigger.service.call', rootSpan)
            const repoSpan = startChildSpan('trace-trigger.repository.find', serviceSpan)
            const dbSpan = startChildSpan('trace-trigger.db.execute', repoSpan)
            dbSpan.setAttribute('db.statement', 'SELECT * FROM orders WHERE id = ?')
            const error = traceError(
              '[TRACE] Deep nested span chain failure at database layer',
              tag
            )
            endSpanError(dbSpan, error)
            endSpanError(repoSpan, error)
            endSpanError(serviceSpan, error)
            markSpanError(rootSpan, error)
            throw error
          }

          case 'async': {
            rootSpan.setAttribute('trace.trigger.async', true)
            await new Promise<void>((_, reject) => {
              setTimeout(() => {
                reject(
                  traceError('[TRACE] Async operation failed in traced context', tag)
                )
              }, 50)
            })
            return
          }

          case 'rejection': {
            rootSpan.setAttribute('trace.trigger.rejection', true)
            const error = traceError(
              '[TRACE] Unhandled promise rejection inside active span',
              tag
            )
            markSpanError(rootSpan, error)
            rootSpan.setAttribute('http.status_code', 500)
            Promise.reject(error)
            return res.status(500).json({ error: error.message, trace: 'rejection' })
          }

          case 'external': {
            const fetchSpan = startChildSpan('trace-trigger.http.client', rootSpan)
            fetchSpan.setAttributes({
              'http.method': 'GET',
              'http.url': 'https://api.example.com/checkout',
            })
            try {
              const response = await fetch('https://httpstat.us/500', { cache: 'no-store' })
              const error = traceError(
                `[TRACE] External HTTP client span failed with status ${response.status}`,
                tag
              )
              endSpanError(fetchSpan, error)
              markSpanError(rootSpan, error)
              throw error
            } catch (err) {
              const error =
                err instanceof Error && err.message.startsWith('[TRACE]')
                  ? err
                  : traceError(
                      '[TRACE] External HTTP client span failure: ' + (err as Error).message,
                      tag
                    )
              if (fetchSpan.isRecording()) {
                endSpanError(fetchSpan, error)
              }
              markSpanError(rootSpan, error)
              throw error
            }
          }

          default: {
            const error = traceError(
              '[TRACE] Fatal serverless trace error — intentional test',
              tag
            )
            markSpanError(rootSpan, error)
            rootSpan.setAttribute('http.status_code', 500)
            throw error
          }
        }
      },
      { kind: SpanKind.SERVER }
    )
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({ error: (err as Error).message })
    }
  }
}
