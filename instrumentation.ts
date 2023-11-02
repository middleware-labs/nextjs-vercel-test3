// @ts-ignore
import tracker from '@middleware.io/agent-apm-nextjs';

export function register() {
    /*tracker.track({
        projectName: "nextjs-project-test3.1",
        serviceName: "nextjs-service-test3.1",
        accessToken: "xusuusalpvush63ud7zcg8bi3mauuptds528",
        target: "vercel",
    });*/
    // @ts-ignore
    tracker.track({
        serviceName: "nextjs-vercel-test3.11",
        accessToken: "xusuusalpvush63ud7zcg8bi3mauuptds528",
        target: "https://p2i13hg.middleware.io:443",
    });
    /*tracker.track({
        projectName: "vercel-project-71.2",
        serviceName: "vercel-service-71.2",
        accessToken: "xusuusalpvush63ud7zcg8bi3mauuptds528",
        target: "https://p2i13hg.middleware.io:443",
    });*/
    tracker.warn("Deployment done successfully!");
}