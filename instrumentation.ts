// @ts-ignore
import tracker from '@middleware.io/agent-apm-nextjs';

export function register() {

    tracker.track({
        serviceName: "nextjs-vercel-test3",
        accessToken: "deoorojzrgpsvihfcgkcsvhrwnmzqeahvhou",
        target: "vercel",
    });

    tracker.warn("Deployment done successfully!!");
}