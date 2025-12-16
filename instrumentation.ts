// @ts-ignore
import tracker from '@middleware.io/agent-apm-nextjs';

export function register() {

  tracker.track({
      serviceName: "nextjs-vercel-test3",
      accessToken: "5xrocjh0p5ir233mvi34dvl5bepnyqri3rqb",
      // accessToken: "ohpv5ncdrwxjlr28xce4a9tmi3fvdcopn3f5",
      enableExceptionHandling: true,
      target: "vercel",
      customResourceAttributes: {
          "app.version": "2.0.0"
      }
  });

  tracker.warn("Deployment done successfully!");
}