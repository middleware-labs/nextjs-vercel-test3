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
      throw new Error(
        prefixErrorMessage(
          '[FATAL] Null reference crash in lambda: ' + (err as Error).message,
          tag
        )
      )
    }
  }

  const message = prefixErrorMessage('[FATAL] Lambda source fatal error triggered intentionally', tag)
  console.error(message)
  try {
    throw new Error(
      prefixErrorMessage('[FATAL] Critical lambda function failure — intentional test error', tag)
    )
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message })
  }
}
