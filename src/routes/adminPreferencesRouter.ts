import {Router} from 'express'
import { param } from 'express-validator'
import inputValidation from '../middleware/inputValidation'
import AdminPreferencesController from '../controllers/AdminPreferencesController'
import { auhtenticateAdmin } from '../middleware/auth'

const router = Router()

router.put(
  '/eventColor/:colorId',
  auhtenticateAdmin,
  param('colorId').notEmpty().withMessage('Colod no válido'),
  inputValidation,
  AdminPreferencesController.updateEventColor
)

export default router