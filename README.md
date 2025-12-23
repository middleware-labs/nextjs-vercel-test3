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
