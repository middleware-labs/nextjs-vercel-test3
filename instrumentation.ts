// @ts-ignore
import tracker from '@middleware.io/agent-apm-nextjs';

export function register() {

    tracker.track({
        serviceName: "nextjs-vercel-test3",
        // accessToken: "murwpaubimiwrfrtoxbwpoiuoztzdjgmsyph",
        accessToken: "parilbyqdkfdbcthnrgmguivkhipvtmvyftd",
        target: "vercel",
    });

    tracker.warn("Deployment done successfully!!");
}