import { NextApiRequest, NextApiResponse } from 'next'
import { parseMsgParam, prefixErrorMessage } from '../../lib/errorMsg'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query
  const tag = parseMsgParam(req.query.msg)

  if (type === 'unhandled') {
    const message = prefixErrorMessage(
      '[FATAL] Unhandled promise rejection in lambda function',
      tag
    )
    Promise.reject(new Error(message))
    return res.status(500).json({ error: message })
  }

  if (type === 'crash') {
    const obj: any = null
    console.error(prefixErrorMessage('[FATAL] Lambda function encountered a critical failure', tag))
    try {
      return obj.nonExistentMethod()
    } catch (err) {
      const message = prefixErrorMessage(
        '[FATAL] Null reference crash in lambda: ' + (err as Error).message,
        tag
      )
      console.error(message)
      return res.status(500).json({ error: message })
    }
  }

  console.error(prefixErrorMessage('[FATAL] Lambda source fatal error triggered intentionally', tag))
  throw new Error(
    prefixErrorMessage('[FATAL] Critical lambda function failure — intentional test error', tag)
  )
}
