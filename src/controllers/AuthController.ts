import {Request, Response} from 'express'
import User from '../models/User'
import { generateJWT, hashPassword } from '../helpers/auth'
import { handleInternalError } from '../helpers'
import { compare } from 'bcrypt'

class AuthController {
  static adminLogin = async (req: Request, res: Response) => {
    const {email, password} = req.body

    try {
      const userExists = await User.findOne({email})

      if (!userExists) {
        return res.status(404).json({error: 'No se ha encontrado un usuario con el correo proporcionado'})
      }

      const passwordsMatch = compare(password, userExists.password)

      if (!passwordsMatch) {
        return res.status(400).json({error: 'La contraseña es incorrecta'})
      }

      if (!userExists.admin) {
        return res.status(409).json({error: 'No eres administrador'})
      }

      const jwtToken = generateJWT({
        id: userExists.id
      })

      res.json(jwtToken)
    } catch (error) {
      handleInternalError(error, 'Algo falló al intentar autenticarte', res)
    }
  }

  static adminSignUp = async (req: Request, res: Response) => {
    try {
      const newUser = new User(req.body)

      newUser.password = await hashPassword(newUser.password)

      newUser.confirmed = true

      newUser.admin = true

      await newUser.save()

      res.send('Usuario creado exitosamente!')
    } catch (error) {
      handleInternalError(error, 'Hubo un problema al intentar crear un nuevo usuario', res)
    }
  }

  static getAdmin = (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({error: 'No te has autenticado'})
      }

      if (!req.user.admin) {
        return res.status(401).json({error: 'No te has autenticado'})
      }

      res.json(req.user)
    } catch (error) {
      handleInternalError(error, 'No te has autenticado!', res)
    }
  }
}

export default AuthController