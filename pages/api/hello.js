import tracker from '@middleware.io/agent-apm-nextjs';

export default async function handler(req, res) {
    tracker.info("Info Sample");
    tracker.warn("Warn Sample", {
        "tester": "Alex",
    });
    tracker.debug("Debug Sample");
    tracker.error("Error Sample");

    // const ms = Math.floor(Math.random() * 1000);
    res.status(200).json({ greetings: `Hello API Called.//.` });
}
