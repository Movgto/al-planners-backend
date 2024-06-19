import {validationResult} from 'express-validator'
import type {Request, Response, NextFunction} from 'express'

const inputValidation = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const result = validationResult(req)
  console.log(result)

  if (!result.isEmpty()) {
    return res.status(400).json({error: result.array()})
  }

  next()
}

export default inputValidation