# Trace drain → Middleware (OTLP HTTP)

This project is wired for **Vercel Trace Drain v2** (`trace_drain_v2`) with delivery type **`otlphttp`**.

## Your integration shape (redacted)

| Field | Role |
|-------|------|
| `trace_drain_v2.delivery.type` | `otlphttp` — Vercel exports OTLP traces to your endpoint |
| `trace_drain_v2.delivery.endpoint.traces` | Your collector URL (e.g. `…/v1/traces/vercel`) |
| `trace_drain_v2.delivery.headers` | `mw-account-uid`, `mw-api-key`, `mw-project-uid` — sent on every export |
| `trace_drain_v2.projectIds` | Only listed projects receive traces |
| `trace_drain_v2.status` | Must be `enabled` |

Logs use a separate drain (`log_drain` / `log_drain_v2`). **Trace buttons on the home page do not use the log drain.**

## Required on the Vercel project

1. **`OTEL_TRACES_EXPORTER=otlp`** on Production (and Preview if you test there).
2. Redeploy after env or `instrumentation.ts` changes.
3. Project id must be included in the trace drain’s `projectIds`.
4. Destination (e.g. ngrok) must be reachable from Vercel — tunnel must be up when testing.

`instrumentation.ts` registers:

```ts
registerOTel({ serviceName: 'nextjs-vercel-test-1.0' })
```

## What shows up in the drain

You typically get **two** kinds of trace resources:

### 1. `vercel.edge-network` (edge / CDN)

- Span name like `GET /api/http-error`, `GET /api/trace-error`
- Often `"status": {}` even on failures
- Look for **`http.status_code`** (e.g. `500`) after using **HTTP Error** buttons

### 2. Serverless / app (`service.name` from `@vercel/otel`)

- e.g. `nextjs-vercel-test-1.0`
- **OTEL Trace** buttons (throw + custom spans) target this layer
- Error spans should have `"status": { "code": 2, "message": "…" }`

## Which UI buttons to use

| Goal | Buttons | Drain signal |
|------|---------|----------------|
| Reliable HTTP status in traces | **HTTP errors** → `/api/http-error?status=500` | `http.status_code` on edge span |
| OTEL `status.code = 2` (Vercel docs pattern) | **🗄️ Database Span Error** → `/api/trace-db-error` | Span `database-operation` with `status.code: 2` + HTTP 500 |
| OTEL `status.code = 2` (throw) | **OTEL traces** → `/api/trace-error` (throw) | Serverless span `status.code: 2` |
| Grouping / random messages | Grouping prefix or **Random** | Same `exception.message` / body text |

## Middleware filtering examples

- Edge HTTP failures: `service.name = vercel.edge-network` AND `http.status_code >= 400`
- App errors: `service.name = nextjs-vercel-test-1.0` AND `status.code = 2`
- By route: `name` or `http.route` contains `/api/http-error` or `/api/trace-error`

## Quick test after deploy

```bash
# HTTP status on edge traces
curl -s "https://YOUR_DEPLOYMENT/api/http-error?status=500"

# OTEL error (serverless); may return 500 HTML
curl -s "https://YOUR_DEPLOYMENT/api/trace-error"

# With Vercel CLI
vercel curl --trace "/api/http-error?status=500"
```

## Troubleshooting

| Symptom | Check |
|---------|--------|
| No traces at Middleware | Drain enabled, project in `projectIds`, ngrok up, `OTEL_TRACES_EXPORTER=otlp`, redeploy |
| Only `vercel.edge-network` | Normal for edge; use **HTTP Error** buttons for `http.status_code` |
| Empty `status` on edge | Use HTTP Error paths, not only `res.status(500)` without error semantics |
| OTEL buttons no `code: 2` | Confirm serverless resource exists; confirm throw paths (not caught by custom wrapper) |
