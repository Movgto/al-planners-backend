import {Request, Response, NextFunction} from 'express'
import User, { IUser } from '../models/User'
import { verify } from 'jsonwebtoken'
import { handleInternalError } from '../helpers'

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}

export const auhtenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization

  try {
    if (!bearer) {
      return res.status(401).json({error: 'Acción no autorizada'})
    }

    const token = bearer.split(' ')[1]

    const userData = verify(token, process.env.JWT_SECRET!)

    if (typeof userData === 'object' && userData.id) {

      const userExists = await User.findById(userData.id).select('id email name admin')

      if (!userExists) {
        return res.status(404).json({error: 'Usuario no encontrado'})
      }

      if (!userExists.admin) {
        return res.status(401).json({error: 'Acción no autorizada'})
      }

      req.user = userExists

    } else {
      return res.status(401).json({error: 'Acción no autorizada'})
    }
  } catch (error) {
    return handleInternalError(error, 'Algo falló al intentar autenticarte', res)
  }

  next()
}