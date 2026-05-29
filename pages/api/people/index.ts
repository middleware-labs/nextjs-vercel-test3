import { NextApiResponse, NextApiRequest } from 'next'
import { people } from '../../../data'
import { Person } from '../../../interfaces'
import { parseMsgParam, prefixErrorMessage } from '../../../lib/errorMsg'

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Person[]>
) {
  const error = _req.query.error
  const tag = parseMsgParam(_req.query.msg)

  if (error === 'true') {
    throw new Error(prefixErrorMessage('Error in /api/people', tag))
  }

  if (_req.query.firewall === 'true') {
    throw new Error(
      prefixErrorMessage('[FATAL] Firewall-blocked request pattern detected', tag)
    )
  }

  return res.status(200).json(people)
}
