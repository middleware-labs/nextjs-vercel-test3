import { trace } from '@opentelemetry/api'
import { NextApiRequest, NextApiResponse } from 'next'
import { parseMsgParam, prefixErrorMessage } from '../../lib/errorMsg'
import { STATUS_CODE_ERROR } from '../../lib/traceUtil'

const tracer = trace.getTracer('custom-tracer')

/**
 * Vercel-recommended pattern: custom span with status.code = 2 + HTTP 500.
 * @see https://vercel.com/docs/observability/trace-drains
 */
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const tag = parseMsgParam(_req.query.msg)
  const message = prefixErrorMessage('Database connection failed', tag)

  const span = tracer.startSpan('database-operation')
  span.setAttribute('db.system', 'postgresql')
  span.setAttribute('db.operation', 'connect')

  try {
    throw new Error(message)
  } catch (error) {
    const err = error as Error
    span.setStatus({
      code: STATUS_CODE_ERROR,
      message: err.message,
    })
    span.recordException(err)
    span.setAttribute('http.status_code', 500)
    span.end()

    return res.status(500).json({
      error: err.message,
      trace: 'database-operation',
      spanStatusCode: STATUS_CODE_ERROR,
    })
  }
}
