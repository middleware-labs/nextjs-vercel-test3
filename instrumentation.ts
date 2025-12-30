// import { registerOTel } from '@vercel/otel';

/**
 * Vercel Trace Drains Instrumentation
 * 
 * This file configures OpenTelemetry tracing for Vercel Trace Drains using @vercel/otel.
 * 
 * Required Environment Variables (set in Vercel Dashboard):
 * - OTEL_TRACES_EXPORTER=otlp (required - tells OpenTelemetry to use OTLP exporter)
 * 
 * Optional Environment Variables:
 * - OTEL_SERVICE_NAME (if not provided, uses serviceName from registerOTel)
 * - OTEL_EXPORTER_OTLP_ENDPOINT (automatically set by Vercel when Trace Drain is configured)
 * 
 * To set up Trace Drains:
 * 1. Go to Vercel Dashboard > Team Settings > Drains
 * 2. Create a new Trace Drain
 * 3. Select your project(s)
 * 4. Configure the destination endpoint
 * 5. Set OTEL_TRACES_EXPORTER=otlp in your project's environment variables
 * 
 * IMPORTANT: After setting environment variables, you MUST redeploy your application.
 * 
 * Troubleshooting:
 * - Verify the Trace Drain is active and assigned to your project
 * - Check Vercel function logs for OpenTelemetry errors
 * - Ensure instrumentationHook is enabled in next.config.js (it is)
 * - Make sure you're testing on a deployed environment, not just localhost
 */

/*export function register() {
  registerOTel({ 
    serviceName: 'nextjs-vercel-test3.7.1'
  });
}*/

 // BACKUP: Old code using @middleware.io/agent-apm-nextjs
// @ts-ignore
import tracker from '@middleware.io/agent-apm-nextjs';

export function register() {
  tracker.track({
      serviceName: "nextjs-vercel-test3.7.2",
      accessToken: "5xrocjh0p5ir233mvi34dvl5bepnyqri3rqb",
      // enableExceptionHandling: true,
      target: "vercel",
      // target: "https://sandbox.middleware.io:443",
      customResourceAttributes: {
          "app.version": "2.0.0",
          "mw.account_key": "5xrocjh0p5ir233mvi34dvl5bepnyqri3rqb"
      }
  });

  tracker.warn("Deployment done successfully!");
}
