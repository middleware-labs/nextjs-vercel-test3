import { trace } from '@opentelemetry/api';

export default async function handler(req, res) {
    // Get the tracer for custom spans
    const tracer = trace.getTracer('nextjs-vercel-test3');

    // Create a span for this request
    return tracer.startActiveSpan('hello-api-handler', async (span) => {
        try {
            // Add custom span attributes
            span.setAttributes({
                'http.method': req.method,
                'http.url': req.url,
                'custom.info': 'Info Sample',
                'custom.warn': 'Warn Sample',
                'custom.tester': 'Alex',
                'custom.debug': 'Debug Sample',
                'custom.error': 'Error Sample'
            });

            // Add events to the span (these appear as log entries in traces)
            span.addEvent('Info Sample', { level: 'info' });
            span.addEvent('Warn Sample', { level: 'warn', tester: 'Alex' });
            span.addEvent('Debug Sample', { level: 'debug' });
            span.addEvent('Error Sample', { level: 'error' });

            // const ms = Math.floor(Math.random() * 1000);
            res.status(200).json({ greetings: `Hello API Called.//.` });
        } catch (error) {
            // Record exception in span
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    });
}

/* BACKUP: Old code using @middleware.io/agent-apm-nextjs
import tracker from '@middleware.io/agent-apm-nextjs';

export default async function handler(req, res) {
    tracker.info("Info Sample");
    tracker.warn("Warn Sample", {
        "tester": "Alex",
    });
    tracker.debug("Debug Sample");
    tracker.error("Error Sample");

    // const ms = Math.floor(Math.random() * 1000);
    res.status(200).json({ greetings: `Hello API Called.//.` });
}
*/
