// @ts-ignore
import tracker from '@middleware.io/agent-apm-nextjs';

export function register() {
    // @ts-ignore
    // tracker.track({
    //     serviceName: "nextjs-vercel-test3.1.0",
    //     accessToken: "deoorojzrgpsvihfcgkcsvhrwnmzqeahvhou",
    //     target: "vercel",
    // });

    tracker.track({
        serviceName: "front.sanjay.service",
        accessToken: "kiydyoakfif2eknw2u040jntvtu5aurhmz9w",
        target: "vercel",
    });

    /*tracker.track({
        projectName: "vercel-project-71.2",
        serviceName: "vercel-service-71.2",
        accessToken: "xusuusalpvush63ud7zcg8bi3mauuptds528",
        target: "https://p2i13hg.middleware.io:443",
    });*/
    tracker.warn("Deployment done successfully!");
}