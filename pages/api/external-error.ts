import { NextApiRequest, NextApiResponse } from 'next'
import { parseMsgParam, prefixErrorMessage } from '../../lib/errorMsg'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query
  const tag = parseMsgParam(req.query.msg)

  if (type === 'timeout') {
    console.error(prefixErrorMessage('[FATAL] External service timeout — upstream host unreachable', tag))
    try {
      const controller = new AbortController()
      setTimeout(() => controller.abort(), 2000)
      await fetch('http://10.255.255.1/timeout-test', { signal: controller.signal })
    } catch (err) {
      throw new Error(
        prefixErrorMessage('[FATAL] External upstream timeout: ' + (err as Error).message, tag)
      )
    }
  }

  console.error(prefixErrorMessage('[FATAL] External service request failed — intentional test error', tag))
  try {
    const response = await fetch('https://httpstat.us/500', { cache: 'no-store' })
    throw new Error(
      prefixErrorMessage(
        `[FATAL] External upstream returned HTTP ${response.status} — external service failure`,
        tag
      )
    )
  } catch (err) {
    throw new Error(
      prefixErrorMessage('[FATAL] External dependency fatal error: ' + (err as Error).message, tag)
    )
  }
}
