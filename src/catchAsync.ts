import { Request, Response, NextFunction } from 'express'

const catchAsync =
  (fn: (request: Request, response: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
  }

export default catchAsync
