import { trace } from '@opentelemetry/api';
import { NextApiRequest, NextApiResponse } from 'next';

const tracer = trace.getTracer('your-component-1.0');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const span = tracer.startSpan("your-operation-1.0");
    try {
        span.setAttributes({
            'developer.name': 'alex',
            'company.name': 'middleware.io',
            'company.version': '1.0.0'
        });
    } finally {
        span.end();
    }
    res.status(200).json({ greetings: `Hello API Called.` });
}
