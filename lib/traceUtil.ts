import { context, trace, Span, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { prefixErrorMessage } from './errorMsg'

/** Custom tracer — child spans; request span is auto-instrumented by @vercel/otel */
export const traceTracer = trace.getTracer('vercel-trace-triggers', '1.0')

/** OpenTelemetry ERROR status code (2) */
export const STATUS_CODE_ERROR = SpanStatusCode.ERROR

export function traceError(baseMessage: string, tag?: string): Error {
  return new Error(prefixErrorMessage(baseMessage, tag))
}

export function applyErrorAttributes(span: Span, error: Error): void {
  span.setAttribute('error', true)
  span.setAttribute('http.status_code', 500)
  span.setAttribute('otel.status_code', 'ERROR')
  span.setAttribute('exception.type', error.name)
  span.setAttribute('exception.message', error.message)
}

export function markSpanError(span: Span, error: Error): void {
  if (!span.isRecording()) return
  span.setStatus({ code: STATUS_CODE_ERROR, message: error.message })
  applyErrorAttributes(span, error)
  span.recordException(error)
}

/** Mark @vercel/otel auto-instrumented HTTP span (if present). */
export function markActiveSpanError(error: Error): void {
  const active = trace.getActiveSpan()
  if (active) markSpanError(active, error)
}

export function startLinkedSpan(name: string): Span {
  const parent = trace.getActiveSpan()
  const parentCtx = parent ? trace.setSpan(context.active(), parent) : context.active()
  return traceTracer.startSpan(name, { kind: SpanKind.INTERNAL }, parentCtx)
}

export function startChildOf(name: string, parent: Span): Span {
  const parentCtx = trace.setSpan(context.active(), parent)
  return traceTracer.startSpan(name, { kind: SpanKind.INTERNAL }, parentCtx)
}

export function finishSpanAsError(span: Span, error: Error): void {
  markSpanError(span, error)
  span.end()
}

/**
 * Mark spans ERROR then throw — required for Vercel error traces.
 * Returning res.status(500) without throw leaves edge-network status {} (OK).
 */
export function throwTraceError(error: Error, customSpan?: Span): never {
  if (customSpan?.isRecording()) {
    finishSpanAsError(customSpan, error)
  }
  markActiveSpanError(error)
  throw error
}
