import { Request, Response } from 'express'
import { generateJWT, hashPassword } from '../helpers/auth'
import { handleInternalError } from '../helpers'
import { compare } from 'bcrypt'
import Admin from '../models/Admin'
import AdminPreferences from '../models/AdminPreferences'

class AuthController {
  static adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const adminExists = await Admin.findOne({ email })

      if (!adminExists) {
        return res.status(404).json({ error: 'No se ha encontrado un usuario con el correo proporcionado' })
      }

      const passwordsMatch = compare(password, adminExists.password)

      if (!passwordsMatch) {
        return res.status(400).json({ error: 'La contraseña es incorrecta' })
      }

      const jwtToken = generateJWT({
        id: adminExists.id
      })

      return res.json(jwtToken)
    } catch (error) {
      return handleInternalError(error, 'Algo falló al intentar autenticarte', res)
    }
  }

  static adminSignUp = async (req: Request, res: Response) => {
    try {
      const newAdmin = new Admin(req.body)

      newAdmin.password = await hashPassword(newAdmin.password)

      await newAdmin.save()

      const adminPreferences = new AdminPreferences({admin: newAdmin.id})

      await adminPreferences.save()

      res.send('Administrador creado exitosamente!')
    } catch (error) {
      handleInternalError(error, 'Hubo un problema al intentar crear un nuevo usuario', res)
    }
  }

  static getAdmin = (req: Request, res: Response) => {
    try {
      if (!req.admin) {
        return res.status(401).json({ error: 'No te has autenticado' })
      }

      res.json(req.admin)
    } catch (error) {
      return handleInternalError(error, 'No te has autenticado!', res)
    }
  }

  static getAdmins = async (req: Request, res: Response) => {
    const admins = await Admin.find().select('id name email')

    res.json(admins)
  }

  static getAdminPreferences = async (req: Request, res: Response) => {
    const adminPreferencesExists = await AdminPreferences.findOne({admin: req.admin.id})

    if (!adminPreferencesExists) {
      const adminPreferences = new AdminPreferences({admin: req.admin.id})

      try {
        await adminPreferences.save()

        return res.json(adminPreferences)
      } catch (error) {
        return res.status(400).json({error: 'Algo falló al obtener las preferencias del administrador'})
      }      
    }

    return res.json(adminPreferencesExists)
  }
}

export default AuthController