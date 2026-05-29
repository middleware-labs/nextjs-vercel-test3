export function parseMsgParam(msg: string | string[] | undefined): string {
  const raw = Array.isArray(msg) ? msg[0] : msg
  return (raw ?? '').trim()
}

export function prefixErrorMessage(base: string, tag?: string): string {
  if (!tag) return base
  return `[${tag}] ${base}`
}

export function randomLogTag(): string {
  return `rnd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
