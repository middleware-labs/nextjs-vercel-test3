import { NextApiResponse, NextApiRequest } from 'next'
import { people } from '../../../data'
import { Person } from '../../../interfaces'

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Person[]>
) {
  // if there exists a query parameter called 'error' and it is equal to 'true', throw an error
  const error = _req.query.error;
  if (error === 'true') {
    throw new Error('This is a new error for c');
  }
  return res.status(200).json(people)
}
