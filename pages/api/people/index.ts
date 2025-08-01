import { NextApiResponse, NextApiRequest } from 'next'
import { people } from '../../../data'
import { Person } from '../../../interfaces'

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Person[]>
) {
  const error = _req.query.error;
  if (error === 'true')
    throw new Error('Error in /api/people');

  return res.status(200).json(people)
}
