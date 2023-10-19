// @ts-ignore
import tracker from '@middleware.io/agent-apm-nextjs';

export function register() {
    tracker.track({
        projectName: "nextjs-project-test3.1",
        serviceName: "nextjs-service-test3.1",
        accessToken: "xusuusalpvush63ud7zcg8bi3mauuptds528",
        target: "vercel",
    });
    tracker.warn("Deployment done successfully!");
}