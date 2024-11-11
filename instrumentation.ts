// @ts-ignore
import tracker from '@middleware.io/agent-apm-nextjs';

export function register() {

    tracker.track({
        serviceName: "nextjs-vercel-test3",
        // accessToken: "murwpaubimiwrfrtoxbwpoiuoztzdjgmsyph",
        accessToken: "ohpv5ncdrwxjlr28xce4a9tmi3fvdcopn3f5",
        target: "vercel",
    });

    tracker.warn("Deployment done successfully!!");
}