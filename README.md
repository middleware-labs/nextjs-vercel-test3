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

{
"private": true,
"scripts": {
"dev": "next",
"build": "next build",
"start": "next start"
},
"dependencies": {
"@ai-sdk/openai": "^1.1.9",
"@anthropic-ai/sdk": "^0.56.0",
"@calcom/embed-react": "^1.5.1",
"@dagrejs/dagre": "^1.1.4",
"@dnd-kit/core": "^6.3.1",
"@dnd-kit/modifiers": "^9.0.0",
"@dnd-kit/sortable": "^10.0.0",
"@faker-js/faker": "^9.7.0",
"@formkit/auto-animate": "^0.8.1",
"@geist-ui/core": "^2.3.8",
"@headlessui/react": "^1.7.16",
"@heroicons/react": "^2.0.18",
"@hookform/resolvers": "^3.9.0",
"@hubspot/api-client": "^11.1.0",
"@intercom/messenger-js-sdk": "^0.0.14",
"@json2csv/node": "^7.0.1",
"@lottiefiles/dotlottie-react": "^0.13.5",
"@mendable/firecrawl-js": "^1.29.1",
"@middleware.io/agent-apm-nextjs": "^1.4.2",
"@middleware.io/sourcemap-uploader": "^0.1.5",
"@monaco-editor/react": "^4.7.0",
"@next/mdx": "^14.2.13",
"@next/third-parties": "^14.0.1",
"@paralleldrive/cuid2": "^2.2.1",
"@prisma/instrumentation": "^5.22.0",
"@prisma/nextjs-monorepo-workaround-plugin": "^5.9.1",
"@radix-ui/react-accordion": "^1.2.1",
"@radix-ui/react-avatar": "^1.0.4",
"@radix-ui/react-collapsible": "^1.0.3",
"@radix-ui/react-dialog": "^1.1.2",
"@radix-ui/react-dropdown-menu": "^2.0.5",
"@radix-ui/react-hover-card": "^1.0.7",
"@radix-ui/react-icons": "^1.3.0",
"@radix-ui/react-label": "^2.1.0",
"@radix-ui/react-scroll-area": "^1.1.0",
"@radix-ui/react-separator": "^1.1.0",
"@radix-ui/react-slot": "^1.1.0",
"@radix-ui/react-switch": "^1.0.3",
"@radix-ui/react-tabs": "^1.0.4",
"@radix-ui/react-toast": "^1.2.2",
"@radix-ui/themes": "^3.1.4",
"@react-three/drei": "^9.112.1",
"@react-three/fiber": "^8.17.7",
"@remirror/pm": "^2.0.8",
"@remirror/react": "^2.0.35",
"@remirror/react-editors": "^1.0.40",
"@sanity/cli": "^3.57.4",
"@scalar/api-client-react": "^1.0.40",
"@scalar/api-reference": "^1.25.27",
"@scalar/api-reference-react": "^0.3.103",
"@scalar/nextjs-api-reference": "^0.4.91",
"@sentry/nextjs": "^7.61.0",
"@stripe/react-stripe-js": "^3.1.1",
"@stripe/stripe-js": "^5.4.0",
"@supabase/supabase-js": "^2.45.3",
"@t3-oss/env-core": "^0.9.1",
"@tabler/icons-react": "^3.17.0",
"@tailwindcss/typography": "^0.5.15",
"@tanstack/react-table": "^8.17.3",
"@tanstack/react-virtual": "^3.8.3",
"@traceloop/instrumentation-openai": "^0.12.0",
"@tremor/react": "^3.10.0",
"@trigger.dev/react-hooks": "3.3.17",
"@trigger.dev/sdk": "3.3.17",
"@types/google-libphonenumber": "^7.4.30",
"@types/mdx": "^2.0.13",
"@types/object-hash": "^3.0.4",
"@types/react-syntax-highlighter": "^15.5.13",
"@types/swagger-ui-react": "^4.18.3",
"@types/three": "^0.166.0",
"@types/uuid": "^9.0.7",
"@uiw/react-json-view": "2.0.0-alpha.26",
"@uploadthing/react": "^7.1.5",
"@upstash/core-analytics": "^0.0.10",
"@upstash/qstash": "^2.3.1",
"@upstash/ratelimit": "^2.0.3",
"@upstash/redis": "^1.34.9",
"@vercel/analytics": "^1.3.1",
"@vercel/functions": "^1.4.1",
"@vercel/kv": "^2.0.0",
"@vercel/og": "^0.6.8",
"@vercel/otel": "^1.14.0",
"@vercel/speed-insights": "^1.0.12",
"ai": "^3.4.18",
"bcryptjs": "^2.4.3",
"cheerio": "^1.1.0",
"class-variance-authority": "^0.7.0",
"clsx": "^2.1.1",
"dotenv": "^16.0.0",
"eslint-config-next": "^14.2.13",
"framer-motion": "^11.5.6",
"geist": "^1.3.1",
"google-libphonenumber": "^3.2.38",
"googleapis": "^135.0.0",
"gray-matter": "^4.0.3",
"htmlparser2": "^10.0.0",
"i": "^0.3.7",
"install": "^0.13.0",
"jsdom": "^26.1.0",
"jsonwebtoken": "^9.0.1",
"libphonenumber-js": "^1.12.9",
"lodash": "^4.17.21",
"lucide-react": "^0.263.1",
"moment": "^2.30.1",
"next": "14.2.13",
"next-auth": "^4.22.3",
"next-mdx-remote": "^5.0.0",
"next-swagger-doc": "^0.4.0",
"next-themes": "^0.3.0",
"npm": "^10.9.0",
"object-hash": "^3.0.0",
"openai": "^4.103.0",
"papaparse": "^5.5.2",
"path": "^0.12.7",
"posthog-js": "^1.252.0",
"posthog-node": "^4.0.0",
"prismjs": "^1.29.0",
"radix-ui": "^1.0.1",
"randomstring": "^1.3.0",
"react": "18.3.1",
"react-beautiful-dnd": "^13.1.1",
"react-color-palette": "^7.3.0",
"react-dom": "18.3.1",
"react-fast-compare": "^3.2.2",
"react-frame-component": "^5.2.7",
"react-google-recaptcha": "^2.1.0",
"react-gtm-module": "^2.0.11",
"react-hook-form": "^7.53.0",
"react-icons": "^4.10.1",
"react-markdown": "^9.0.3",
"react-perfect-scrollbar": "^1.5.8",
"react-syntax-highlighter": "^15.6.1",
"react-to-pdf": "^2.0.1",
"react-use": "^17.4.0",
"react-visibility-sensor": "^5.1.1",
"reactflow": "^11.10.4",
"rehype-autolink-headings": "^7.1.0",
"rehype-code-titles": "^1.2.0",
"rehype-pretty-code": "^0.13.2",
"rehype-prism-plus": "^2.0.0",
"rehype-slug": "^6.0.0",
"remark": "^15.0.1",
"remark-frontmatter": "^5.0.0",
"remark-gfm": "^4.0.0",
"remark-html": "^16.0.1",
"remirror": "^2.0.38",
"resend": "^4.0.0",
"sanity": "^3.57.4",
"server-only": "^0.0.1",
"sharp": "^0.33.5",
"sonner": "^2.0.6",
"stripe": "^18.1.1",
"styled-components": "^6.1.13",
"swagger-ui-react": "^5.17.14",
"swiper": "^11.0.5",
"swr": "^2.2.0",
"tailwind-merge": "^2.5.2",
"tailwindcss-animate": "^1.0.7",
"three": "^0.166.1",
"three-globe": "^2.31.1",
"twilio": "^4.19.0",
"ua-parser-js": "^1.0.35",
"unist-util-visit": "^5.0.0",
"uploadthing": "^7.4.4",
"uuid": "^9.0.1",
"vaul": "^1.0.0",
"zod": "3.23.8",
"zustand": "^5.0.3"
},
"devDependencies": {
"@babel/plugin-transform-runtime": "^7.25.9",
"@babel/preset-env": "^7.26.7",
"@babel/preset-react": "^7.26.3",
"@next/bundle-analyzer": "^15.3.3",
"@svgr/webpack": "^8.1.0",
"@trigger.dev/build": "3.3.17",
"@types/bcryptjs": "^2.4.2",
"@types/cheerio": "^1.0.0",
"@types/hapi__catbox": "^10.2.6",
"@types/hapi__shot": "^4.1.6",
"@types/jest": "^30.0.0",
"@types/lodash": "^4.14.196",
"@types/markdown-it": "^12.2.3",
"@types/node": "^25.0.2",
"@types/papaparse": "^5.3.14",
"@types/randomstring": "^1.1.9",
"@types/react": "18.3.1",
"@types/react-beautiful-dnd": "^13.1.5",
"@types/react-google-recaptcha": "^2.1.5",
"@types/react-gtm-module": "^2.0.3",
"@types/twilio": "^3.19.3",
"@vitest/coverage-v8": "^3.2.4",
"autoprefixer": "^10.4.20",
"babel-loader": "^9.2.1",
"cross-env": "^7.0.3",
"eslint": "^8.57.1",
"eslint-config-next": "14.2.0",
"eslint-plugin-mdx": "^3.1.5",
"jest": "^30.0.3",
"jest-progress-bar-reporter": "^1.0.25",
"openapi-typescript": "^7.4.1",
"postcss": "^8.4.47",
"tailwindcss": "^3.4.12",
"ts-jest": "^29.4.0",
"tsx": "^4.0.0",
"typescript": "^5.6.2",
"use-resize-observer": "^9.1.0",
"vitest": "^3.2.4"
}
}
