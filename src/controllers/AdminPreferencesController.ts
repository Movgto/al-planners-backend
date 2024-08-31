import type { Request, Response } from 'express'
import { handleInternalError } from '../helpers'
import AdminPreferences from '../models/AdminPreferences'

class AdminPreferencesController {
  static updateEventColor = async (req: Request, res: Response) => {
    const { colorId } = req.body

    try {
      const adminPreferences = await AdminPreferences.findOne({ admin: req.admin.id })

      if (!adminPreferences) {
        return res.status(404).json({error: 'Hubo un error al intentar obtener las preferencias del administrador'})
      }

      adminPreferences.eventColorId = colorId

      adminPreferences.save()

      return res.send('Color del evento actualizado!')

    } catch (error) {
      return handleInternalError(error, 'Hubo un error al intentar cambiar el color del evento', res)
    }
  }
}

export default AdminPreferencesController