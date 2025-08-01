import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { x, y, c } = req.query;

  if (c) {
    throw new Error("This is a new error for c");
  }

  if (!x || !y) {
    throw new Error("Missing query parameters 'x' and 'y'");
  }

  if (isNaN(Number(x)) || isNaN(Number(y))) {
    throw new Error("Query parameters must be numbers");
  }

  if (x == y) {
    throw new Error("Query parameters 'x' and 'y' must not be equal");
  }

  const result = divide(Number(x), Number(y));
  return res.status(200).json({ result });
}

function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  // error if a is less than b
  if (a < b)
    throw new Error("a must be greater than or equal to b");

  return a / b;
}
