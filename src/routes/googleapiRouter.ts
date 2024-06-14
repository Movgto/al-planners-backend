import {Router} from 'express'
import GoogleAPIController from '../controllers/GoogleAPIController'
import { query } from 'express-validator'
import inputValidation from '../middleware/inputValidation'

const router = Router()

router.get('/auth-url',
  GoogleAPIController.getAuthUrl
)

router.get('/events',
  query('code').notEmpty().withMessage('Ocurrió un error al conectarse al calendario'),
  inputValidation,
  GoogleAPIController.getEvents
)

export default router