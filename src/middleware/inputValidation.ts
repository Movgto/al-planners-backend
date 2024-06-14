import {validationResult} from 'express-validator'
import type {Request, Response, NextFunction} from 'express'

const inputValidation = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req)

  if (!result.isEmpty) {
    return res.json({error: result.array})
  }

  next()
}

export default inputValidation