// @ts-ignore
/*import tracker from '@middleware.io/agent-apm-nextjs';

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
}*/

import { registerOTel } from "@vercel/otel";

export function register() {
    // Register the OpenTelemetry.
    registerOTel("nextjs-vercel-test-1.0");
}
