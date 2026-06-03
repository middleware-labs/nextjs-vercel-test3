import { context, trace, Span, SpanStatusCode } from '@opentelemetry/api'
import { prefixErrorMessage } from './errorMsg'

/** Custom tracer — works with @vercel/otel instrumentation. */
export const traceTracer = trace.getTracer('vercel-trace-triggers', '1.0')

/** OpenTelemetry ERROR status code (2) — used by Vercel trace drains. */
export const STATUS_CODE_ERROR = SpanStatusCode.ERROR

export function traceError(baseMessage: string, tag?: string): Error {
  return new Error(prefixErrorMessage(baseMessage, tag))
}

/** Semantic error attributes — helps trace drains and grouping by message. */
export function applyErrorAttributes(span: Span, error: Error): void {
  span.setAttribute('error', true)
  span.setAttribute('http.status_code', 500)
  span.setAttribute('otel.status_code', 'ERROR')
  span.setAttribute('exception.type', error.name)
  span.setAttribute('exception.message', error.message)
}

/** Start a child span linked to the current request span (if present). */
export function startLinkedSpan(name: string): Span {
  const parent = trace.getActiveSpan()
  const parentCtx = parent ? trace.setSpan(context.active(), parent) : context.active()
  return traceTracer.startSpan(name, {}, parentCtx)
}

/** Start a child span under an explicit parent span. */
export function startChildOf(name: string, parent: Span): Span {
  const parentCtx = trace.setSpan(context.active(), parent)
  return traceTracer.startSpan(name, {}, parentCtx)
}

/**
 * Vercel-recommended pattern: set span status to ERROR, record exception, end span.
 */
export function finishSpanAsError(span: Span, error: Error): void {
  span.setStatus({
    code: STATUS_CODE_ERROR,
    message: error.message,
  })
  applyErrorAttributes(span, error)
  span.recordException(error)
  span.end()
}

/** Mark the active request span as ERROR (the span Vercel exports to trace drains). */
export function markActiveSpanError(error: Error): void {
  const active = trace.getActiveSpan()
  if (!active?.isRecording()) return
  active.setStatus({ code: STATUS_CODE_ERROR, message: error.message })
  applyErrorAttributes(active, error)
  active.recordException(error)
}

/**
 * Custom span ERROR + request span ERROR + throw.
 * Throwing ensures the HTTP trace is error-typed in Vercel trace drains.
 */
export function finishSpansAndThrow(customSpan: Span, error: Error): never {
  finishSpanAsError(customSpan, error)
  markActiveSpanError(error)
  throw error
}

/** Request-only error trace (fatal / async / rejection). */
export function throwRequestTraceError(error: Error): never {
  markActiveSpanError(error)
  throw error
}
