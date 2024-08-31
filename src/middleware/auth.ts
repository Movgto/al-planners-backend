import {Request, Response, NextFunction} from 'express'
import { verify } from 'jsonwebtoken'
import { handleInternalError } from '../helpers'
import Admin, { IAdmin } from '../models/Admin'

declare global {
  namespace Express {
    interface Request {      
      admin: IAdmin
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

      const adminExists = await Admin.findById(userData.id).select('id email name')

      if (!adminExists) {
        return res.status(404).json({error: 'Usuario no encontrado'})
      }      

      req.admin = adminExists

    } else {
      return res.status(401).json({error: 'Acción no autorizada'})
    }
  } catch (error) {
    return handleInternalError(error, 'Algo falló al intentar autenticarte', res)
  }

  next()
}