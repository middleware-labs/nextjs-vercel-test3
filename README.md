# Basic API routes example

Next.js ships with [API routes](https://nextjs.org/docs/api-routes/introduction) which provides an easy solution to build your own `API`. This example shows how to create multiple `API` endpoints with serverless functions, which can execute independently.

## Vercel Trace Drains Setup

This project is configured to use Vercel Trace Drains with OpenTelemetry. To enable tracing:

### 1. Configure Trace Drain in Vercel Dashboard

1. Go to **Vercel Dashboard** > **Team Settings** > **Drains**
2. Click **Create Drain**
3. Select **Traces** as the data type
4. Choose your project(s)
5. Configure the destination endpoint (your OpenTelemetry collector or observability platform)
6. Set the sampling rate if needed

### 2. Set Environment Variables

In your Vercel project settings, add the following environment variable:

- **`OTEL_TRACES_EXPORTER=otlp`** (Required - tells OpenTelemetry to use the OTLP exporter)

The `OTEL_EXPORTER_OTLP_ENDPOINT` is automatically set by Vercel when a Trace Drain is configured, so you don't need to set it manually.

### 3. Verify Instrumentation

The `instrumentation.ts` file is already configured with `@vercel/otel`. After setting the environment variable and deploying, traces should automatically be sent to your configured Trace Drain.

### 4. Troubleshooting - If Traces Still Don't Appear

If you've set `OTEL_TRACES_EXPORTER=otlp` but still don't see traces, check the following:

1. **Verify Trace Drain is Active**:
   - Go to Vercel Dashboard > Team Settings > Drains
   - Ensure your Trace Drain shows as "Active"
   - Verify it's assigned to the correct project

2. **Check Environment Variables**:
   - In Vercel Dashboard > Project Settings > Environment Variables
   - Verify `OTEL_TRACES_EXPORTER=otlp` is set for all environments (Production, Preview, Development)
   - **Important**: After adding/changing environment variables, you MUST redeploy

3. **Redeploy After Changes**:
   - Any changes to environment variables or `instrumentation.ts` require a new deployment
   - Local development won't send traces to Trace Drains (only deployed environments)

4. **Check Function Logs**:
   - In Vercel Dashboard, go to your project > Functions tab
   - Look for any OpenTelemetry-related errors
   - Check for connection errors to your Trace Drain endpoint

5. **Verify Next.js Configuration**:
   - Ensure `experimental.instrumentationHook: true` is in `next.config.js` (already configured)
   - The `instrumentation.ts` file must be in the project root

6. **Test with API Routes**:
   - Make requests to your API routes (e.g., `/api/people`, `/api/divide`)
   - Traces are generated automatically for API routes when using `@vercel/otel`
   - Check your Trace Drain destination to see if traces arrive

7. **Sampling Rate**:
   - Check your Trace Drain settings for sampling rules
   - During testing, set sampling to 100% to ensure all traces are captured

8. **Destination Endpoint**:
   - Verify your Trace Drain destination endpoint is accessible
   - Test the endpoint connectivity from Vercel's infrastructure

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/api-routes)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/api-routes&project-name=api-routes&repository-name=api-routes)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example api-routes api-routes-app
```

```bash
yarn create next-app --example api-routes api-routes-app
```

```bash
pnpm create next-app --example api-routes api-routes-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).


--------------------------

Run: 
```npm run build```

   ```OTEL_TRACES_EXPORTER=otlp,console OTEL_LOG_LEVEL=debug OTEL_METRICS_EXPORTER=none OTEL_EXPORTER_OTLP_HEADERS=`Authorization=5xrocjh0p5ir233mvi34dvl5bepnyqri3rqb1` OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf OTEL_RESOURCE_ATTRIBUTES='mw.account_key=5xrocjh0p5ir233mvi34dvl5bepnyqri3rqb1' MW_API_KEY=5xrocjh0p5ir233mvi34dvl5bepnyqri3rqb1 OTEL_LOGS_EXPORTER=otlp npm run dev```