import { useState } from 'react'
import useSWR from 'swr'
import PersonComponent from '../components/Person'
import type { Person } from '../interfaces'
import { randomLogTag } from '../lib/errorMsg'
import styles from '../styles/index.module.css'
// @ts-ignore
// import tracker from '@middleware.io/agent-apm-nextjs';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface LogButton {
  label: string
  source: string
  action: () => void
  title: string
}

interface TraceButton {
  label: string
  source: TraceSource
  action: () => void
  title: string
}

const sources = ['build', 'static', 'lambda', 'edge', 'external', 'firewall', 'redirect'] as const

type Source = (typeof sources)[number]

const traceSources = ['lambda', 'nested', 'async', 'external', 'edge'] as const

type TraceSource = (typeof traceSources)[number]

const sourceLabelClass: Record<Source, string> = {
  build: styles.sourceBuild,
  static: styles.sourceStatic,
  lambda: styles.sourceLambda,
  edge: styles.sourceEdge,
  external: styles.sourceExternal,
  firewall: styles.sourceFirewall,
  redirect: styles.sourceRedirect,
}

const sourceBtnClass: Record<Source, string> = {
  build: styles.btnBuild,
  static: styles.btnStatic,
  lambda: styles.btnLambda,
  edge: styles.btnEdge,
  external: styles.btnExternal,
  firewall: styles.btnFirewall,
  redirect: styles.btnRedirect,
}

const traceSourceLabelClass: Record<TraceSource, string> = {
  lambda: styles.sourceTraceLambda,
  nested: styles.sourceTraceNested,
  async: styles.sourceTraceAsync,
  external: styles.sourceTraceExternal,
  edge: styles.sourceTraceEdge,
}

const traceSourceBtnClass: Record<TraceSource, string> = {
  lambda: styles.btnTraceLambda,
  nested: styles.btnTraceNested,
  async: styles.btnTraceAsync,
  external: styles.btnTraceExternal,
  edge: styles.btnTraceEdge,
}

export default function Index() {
  const [groupPrefix, setGroupPrefix] = useState('')
  const [traceGroupPrefix, setTraceGroupPrefix] = useState('')
  const { data, error, isLoading } = useSWR<Person[]>('/api/people', fetcher)

  const q = (params: Record<string, string>) => {
    const search = new URLSearchParams(params)
    const tag = groupPrefix.trim()
    if (tag) search.set('msg', tag)
    const s = search.toString()
    return s ? `?${s}` : ''
  }

  const traceQ = (params: Record<string, string>) => {
    const search = new URLSearchParams(params)
    const tag = traceGroupPrefix.trim()
    if (tag) search.set('msg', tag)
    const s = search.toString()
    return s ? `?${s}` : ''
  }

  const triggerRandom = (source: Source) => {
    const tag = randomLogTag()
    const encoded = encodeURIComponent(tag)

    switch (source) {
      case 'build':
        fetch(`/api/lambda-error?type=crash&msg=${encoded}`).catch(() => {})
        break
      case 'static':
        fetch(`/_next/static/chunks/${encoded}-fatal-chunk.js`).catch(() => {})
        break
      case 'lambda':
        fetch(`/api/lambda-error?msg=${encoded}`).catch(() => {})
        break
      case 'edge':
        fetch(`/api/edge-error?msg=${encoded}`).catch(() => {})
        break
      case 'external':
        fetch(`/api/external-error?msg=${encoded}`).catch(() => {})
        break
      case 'firewall':
        fetch(`/api/people?firewall=true&msg=${encoded}`).catch(() => {})
        break
      case 'redirect':
        window.open(`/sample-redirect?msg=${encoded}`, '_blank')
        break
    }
  }

  const triggerTraceRandom = (source: TraceSource) => {
    const tag = randomLogTag()
    const encoded = encodeURIComponent(tag)

    switch (source) {
      case 'lambda':
        fetch(`/api/trace-error?msg=${encoded}`).catch(() => {})
        break
      case 'nested':
        fetch(`/api/trace-error?type=nested&msg=${encoded}`).catch(() => {})
        break
      case 'async':
        fetch(`/api/trace-error?type=async&msg=${encoded}`).catch(() => {})
        break
      case 'external':
        fetch(`/api/trace-error?type=external&msg=${encoded}`).catch(() => {})
        break
      case 'edge':
        fetch(`/api/trace-edge-error?msg=${encoded}`).catch(() => {})
        break
    }
  }

  console.log('myyyyy:', process.cwd())
  if (error) return <div className={styles.error}>Failed to load</div>
  if (isLoading) return <div className={styles.loading}>Loading...</div>
  if (!data) return null

  const logButtons: LogButton[] = [
    {
      label: '💥 Build Error',
      source: 'build',
      title: 'Simulates a fatal build-phase error message via lambda log',
      action: () => fetch(`/api/lambda-error${q({ type: 'crash' })}`).catch(() => {}),
    },
    {
      label: '📄 Static 404',
      source: 'static',
      title: 'Requests a non-existent static asset — generates a static-source error log',
      action: () => {
        const slug = groupPrefix.trim() || 'non-existent-fatal'
        fetch(`/_next/static/chunks/${encodeURIComponent(slug)}-chunk.js`).catch(() => {})
      },
    },
    {
      label: '⚡ Lambda Fatal',
      source: 'lambda',
      title: 'Throws an unhandled error inside a Node.js serverless function',
      action: () => fetch(`/api/lambda-error${q({})}`).catch(() => {}),
    },
    {
      label: '⚡ Lambda Unhandled Rejection',
      source: 'lambda',
      title: 'Triggers an unhandled promise rejection in a serverless function',
      action: () => fetch(`/api/lambda-error${q({ type: 'unhandled' })}`).catch(() => {}),
    },
    {
      label: '⚡ Lambda Divide Error',
      source: 'lambda',
      title: 'Triggers division-related fatal in the /api/divide lambda',
      action: () => fetch(`/api/divide${q({ c: '1' })}`).catch(() => {}),
    },
    {
      label: '🌐 Edge Fatal Throw',
      source: 'edge',
      title: 'Throws inside an edge-runtime function — logs as edge fatal',
      action: () => fetch(`/api/edge-error${q({})}`).catch(() => {}),
    },
    {
      label: '🌐 Edge 500 Response',
      source: 'edge',
      title: 'Edge function returns HTTP 500 with fatal log message',
      action: () => fetch(`/api/edge-error${q({ type: 'response' })}`).catch(() => {}),
    },
    {
      label: '🔗 External Rewrite 404',
      source: 'external',
      title: 'Hits the rewrite rule /persons/:id → https://google.com/ (external source)',
      action: () => {
        const id = groupPrefix.trim() || 'fatal-test-path'
        fetch(`/persons/${encodeURIComponent(id)}`).catch(() => {})
      },
    },
    {
      label: '🔗 External Upstream Error',
      source: 'external',
      title: 'Lambda fetches an external URL that returns HTTP 500',
      action: () => fetch(`/api/external-error${q({})}`).catch(() => {}),
    },
    {
      label: '🔗 External Timeout',
      source: 'external',
      title: 'Lambda times out connecting to a non-routable external host',
      action: () => fetch(`/api/external-error${q({ type: 'timeout' })}`).catch(() => {}),
    },
    {
      label: '🛡️ Firewall SQLi',
      source: 'firewall',
      title: "Sends a SQL-injection-pattern request — blocked by Vercel's firewall (needs WAF rule)",
      action: () =>
        fetch(`/api/people${q({ firewall: 'true', id: "1' OR '1'='1" })}`).catch(() => {}),
    },
    {
      label: '🛡️ Firewall XSS',
      source: 'firewall',
      title: "Sends an XSS-pattern request — blocked by Vercel's firewall (needs WAF rule)",
      action: () =>
        fetch(`/api/people${q({ firewall: 'true', q: '<script>alert(1)</script>' })}`).catch(() => {}),
    },
    {
      label: '🛡️ Firewall Path Traversal',
      source: 'firewall',
      title: "Sends a path-traversal request — blocked by Vercel's firewall (needs WAF rule)",
      action: () =>
        fetch(`/api/people${q({ firewall: 'true', file: '../../etc/passwd' })}`).catch(() => {}),
    },
    {
      label: '↪️ Redirect (temp)',
      source: 'redirect',
      title: 'Triggers the /sample-redirect → / temporary redirect from vercel.json',
      action: () => {
        const suffix = groupPrefix.trim() ? `?msg=${encodeURIComponent(groupPrefix.trim())}` : ''
        window.open(`/sample-redirect${suffix}`, '_blank')
      },
    },
    {
      label: '↪️ Redirect to /person/1',
      source: 'redirect',
      title: 'Triggers the /test-redirect → /person/1 temporary redirect from vercel.json',
      action: () => {
        const suffix = groupPrefix.trim() ? `?msg=${encodeURIComponent(groupPrefix.trim())}` : ''
        window.open(`/test-redirect${suffix}`, '_blank')
      },
    },
    {
      label: '↪️ Redirect (permanent)',
      source: 'redirect',
      title: 'Triggers the /old-page → / permanent (301) redirect from vercel.json',
      action: () => {
        const suffix = groupPrefix.trim() ? `?msg=${encodeURIComponent(groupPrefix.trim())}` : ''
        window.open(`/old-page${suffix}`, '_blank')
      },
    },
  ]

  const traceButtons: TraceButton[] = [
    {
      label: '🔴 Fatal Trace',
      source: 'lambda',
      title: 'Throws on /api/trace-error — request span status ERROR in trace drain',
      action: () => fetch(`/api/trace-error${traceQ({})}`).catch(() => {}),
    },
    {
      label: '🔴 Handled Trace',
      source: 'lambda',
      title: 'Custom ERROR span + throw — request and child span error in trace drain',
      action: () => fetch(`/api/trace-error${traceQ({ type: 'handled' })}`).catch(() => {}),
    },
    {
      label: '🔴 Trace Rejection',
      source: 'lambda',
      title: 'Unhandled rejection + throw — request span ERROR in trace drain',
      action: () => fetch(`/api/trace-error${traceQ({ type: 'rejection' })}`).catch(() => {}),
    },
    {
      label: '🧩 Child Span Error',
      source: 'nested',
      title: 'Linked child span ERROR + throw — visible in trace drain',
      action: () => fetch(`/api/trace-error${traceQ({ type: 'nested' })}`).catch(() => {}),
    },
    {
      label: '🧩 Deep Nested Error',
      source: 'nested',
      title: 'Fails at the deepest span in a 3-level nested chain',
      action: () => fetch(`/api/trace-error${traceQ({ type: 'deep' })}`).catch(() => {}),
    },
    {
      label: '⏳ Async Trace Error',
      source: 'async',
      title: 'Async operation failure recorded on the active span',
      action: () => fetch(`/api/trace-error${traceQ({ type: 'async' })}`).catch(() => {}),
    },
    {
      label: '🌍 External HTTP Span',
      source: 'external',
      title: 'HTTP client child span fails on upstream 500',
      action: () => fetch(`/api/trace-error${traceQ({ type: 'external' })}`).catch(() => {}),
    },
    {
      label: '⚡ Edge Fatal Trace',
      source: 'edge',
      title: 'Fatal error inside an edge-runtime OTEL span',
      action: () => fetch(`/api/trace-edge-error${traceQ({})}`).catch(() => {}),
    },
    {
      label: '⚡ Edge Handled Trace',
      source: 'edge',
      title: 'Handled edge span error returning HTTP 500',
      action: () => fetch(`/api/trace-edge-error${traceQ({ type: 'handled' })}`).catch(() => {}),
    },
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.panel}>
        <h2 className={styles.title}>Vercel Log Source Triggers</h2>
        <p className={styles.subtitle}>
          Click a button to generate an error/fatal log for that Vercel log source.
        </p>

        <div className={styles.prefixBox}>
          <label htmlFor="group-prefix" className={styles.label}>
            Grouping prefix (optional)
          </label>
          <input
            id="group-prefix"
            type="text"
            value={groupPrefix}
            onChange={(e) => setGroupPrefix(e.target.value)}
            placeholder="e.g. checkout-flow — same text groups errors in your observability tool"
            className={styles.input}
          />
          <p className={styles.hint}>
            When set, every fixed button prepends <code className={styles.code}>[your-text]</code> to
            the error message. Reuse the same prefix to test grouping; leave empty for identical
            messages across clicks. Use <strong>🎲 Random</strong> to force a new unique prefix each
            time (ignores this field).
          </p>
        </div>

        <div className={styles.scrollArea}>
          {sources.map((source) => (
            <div key={source} className={styles.sourceGroup}>
              <div className={sourceLabelClass[source]}>{source}</div>
              <div>
                {logButtons
                  .filter((b) => b.source === source)
                  .map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      title={b.title}
                      className={sourceBtnClass[source]}
                      onClick={b.action}
                    >
                      {b.label}
                    </button>
                  ))}
                <button
                  type="button"
                  title="Generates a new unique error message on every click (does not use grouping prefix)"
                  className={`${sourceBtnClass[source]} ${styles.btnRandom}`}
                  onClick={() => triggerRandom(source)}
                >
                  🎲 Random
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.rightColumn}>
        <section className={styles.panelTraceTop}>
          <h2 className={styles.title}>Vercel Trace Triggers</h2>
          <p className={styles.subtitle}>
            Generate error traces via OpenTelemetry spans — visible in your Vercel Trace drain.
          </p>

          <div className={styles.prefixBox}>
            <label htmlFor="trace-group-prefix" className={styles.label}>
              Trace grouping prefix (optional)
            </label>
            <input
              id="trace-group-prefix"
              type="text"
              value={traceGroupPrefix}
              onChange={(e) => setTraceGroupPrefix(e.target.value)}
              placeholder="e.g. checkout-trace — same prefix groups traces in your observability tool"
              className={styles.input}
            />
            <p className={styles.hint}>
              Prepends <code className={styles.code}>[your-text]</code> to trace error messages.
              Reuse the same prefix to test grouping. Use <strong>🎲 Random</strong> per category for
              a unique trace error each click.
            </p>
          </div>

          <div className={styles.scrollArea}>
            {traceSources.map((source) => (
              <div key={`trace-${source}`} className={styles.sourceGroup}>
                <div className={traceSourceLabelClass[source]}>{source}</div>
                <div>
                  {traceButtons
                    .filter((b) => b.source === source)
                    .map((b) => (
                      <button
                        key={b.label}
                        type="button"
                        title={b.title}
                        className={traceSourceBtnClass[source]}
                        onClick={b.action}
                      >
                        {b.label}
                      </button>
                    ))}
                  <button
                    type="button"
                    title="Generates a new unique trace error on every click (ignores trace grouping prefix)"
                    className={`${traceSourceBtnClass[source]} ${styles.btnRandom}`}
                    onClick={() => triggerTraceRandom(source)}
                  >
                    🎲 Random
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panelListBottom}>
          <h2 className={styles.titleList}>People List</h2>
          <p className={styles.subtitleList}>Earlier demo - People loaded from the API</p>
          <ul className={styles.peopleList}>
            {data.map((p) => (
              <PersonComponent key={p.id} person={p} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
