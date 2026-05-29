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

const sources = ['build', 'static', 'lambda', 'edge', 'external', 'firewall', 'redirect'] as const

type Source = (typeof sources)[number]

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

export default function Index() {
  const [groupPrefix, setGroupPrefix] = useState('')
  const { data, error, isLoading } = useSWR<Person[]>('/api/people', fetcher)

  const q = (params: Record<string, string>) => {
    const search = new URLSearchParams(params)
    const tag = groupPrefix.trim()
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

      <section className={styles.panel}>
        <h2 className={styles.titleList}>List</h2>
        <p className={styles.subtitleList}>Earlier demo — people loaded from the API</p>
        <ul className={styles.peopleList}>
          {data.map((p) => (
            <PersonComponent key={p.id} person={p} />
          ))}
        </ul>
      </section>
    </div>
  )
}
