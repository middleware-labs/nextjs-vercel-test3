import { NextApiRequest, NextApiResponse } from 'next'
import { parseMsgParam, prefixErrorMessage } from '../../lib/errorMsg'

const ALLOWED = new Set([400, 401, 403, 404, 405, 408, 429, 500, 502, 503, 504])

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status
  const parsed = parseInt(raw ?? '500', 10)
  const status = ALLOWED.has(parsed) ? parsed : 500
  const tag = parseMsgParam(req.query.msg)
  const throwOnError = req.query.throw === 'true'

  const message = prefixErrorMessage(`HTTP ${status} — intentional test error`, tag)

  if (throwOnError) {
    throw new Error(message)
  }

  return res.status(status).json({
    error: message,
    httpStatus: status,
  })
}
