import type { Request, Response } from 'express'
import { handleInternalError } from '../helpers'
import AdminPreferences from '../models/AdminPreferences'

class AdminPreferencesController {
  static updateEventColor = async (req: Request, res: Response) => {
    const { colorId } = req.params

    try {
      const updatedAdminPreferences = await AdminPreferences.findOneAndUpdate({admin: req.admin.id}, {eventColorId: colorId})

      
      if (!updatedAdminPreferences) {
        return res.status(404).json({ error: 'Hubo un error al intentar obtener las preferencias del administrador' })
      }
      console.log('Color id to update to:', colorId)
      console.log('------ Preferencias del administrador actualizadas ------')
      console.log(updatedAdminPreferences)
      // adminPreferences.eventColorId = colorId

      // await adminPreferences.save()

      return res.send('Color del evento actualizado!')

    } catch (error) {
      return handleInternalError(error, 'Hubo un error al intentar cambiar el color del evento', res)
    }
  }
}

export default AdminPreferencesController