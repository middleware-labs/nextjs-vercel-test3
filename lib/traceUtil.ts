import { context, Span, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api'
import { prefixErrorMessage } from './errorMsg'

export const traceTracer = trace.getTracer('vercel-trace-triggers', '1.0')

export function traceError(baseMessage: string, tag?: string): Error {
  return new Error(prefixErrorMessage(baseMessage, tag))
}

/** Mark span as ERROR for Vercel trace drain (status + semantic attributes). */
export function markSpanError(span: Span, error: Error): void {
  span.recordException(error)
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  span.setAttribute('error', true)
  span.setAttribute('otel.status_code', 'ERROR')
  span.setAttribute('exception.type', error.name)
  span.setAttribute('exception.message', error.message)
}

export function runActiveSpan<T>(
  name: string,
  fn: (span: Span) => Promise<T> | T,
  options?: { kind?: SpanKind; attributes?: Record<string, string | number | boolean> }
): Promise<T> {
  return traceTracer.startActiveSpan(
    name,
    {
      kind: options?.kind ?? SpanKind.INTERNAL,
      attributes: options?.attributes,
    },
    async (span) => {
      try {
        return await fn(span)
      } catch (err) {
        if (span.isRecording()) {
          markSpanError(span, err as Error)
        }
        throw err
      }
    }
  )
}

export function startChildSpan(name: string, parent: Span): Span {
  const parentCtx = trace.setSpan(context.active(), parent)
  return traceTracer.startSpan(
    name,
    { kind: SpanKind.INTERNAL },
    parentCtx
  )
}

export function endSpanError(span: Span, error: Error): void {
  if (span.isRecording()) {
    markSpanError(span, error)
    span.end()
  }
}
