import { context, Span, SpanStatusCode, trace } from '@opentelemetry/api'
import { prefixErrorMessage } from './errorMsg'

export const traceTracer = trace.getTracer('vercel-trace-triggers', '1.0')

export function startChildSpan(name: string, parent: Span): Span {
  const parentCtx = trace.setSpan(context.active(), parent)
  return traceTracer.startSpan(name, {}, parentCtx)
}

export function failSpan(span: Span, baseMessage: string, tag?: string): never {
  const message = prefixErrorMessage(baseMessage, tag)
  const error = new Error(message)
  span.recordException(error)
  span.setStatus({ code: SpanStatusCode.ERROR, message })
  span.end()
  throw error
}

export function recordSpanError(span: Span, baseMessage: string, tag?: string): Error {
  const message = prefixErrorMessage(baseMessage, tag)
  const error = new Error(message)
  span.recordException(error)
  span.setStatus({ code: SpanStatusCode.ERROR, message })
  return error
}
