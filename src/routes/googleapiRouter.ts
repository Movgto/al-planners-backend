import {Router} from 'express'
import GoogleAPIController from '../controllers/GoogleAPIController'
import { body, param, query } from 'express-validator'
import inputValidation from '../middleware/inputValidation'

const router = Router()

router.get('/auth-url',
  GoogleAPIController.getAuthUrl
)

// router.post('/events/:eventId',
//   param('eventId').isMongoId().withMessage('Invalid event ID'),
//   inputValidation,
//   GoogleAPIController.createEvent
// )

router.post('/syncEvents',
  body('code').notEmpty().withMessage('Ocurrió un error al conectarse al calendario'),
  inputValidation,
  GoogleAPIController.syncEvents
)

router.get('/events',
  query('code').notEmpty().withMessage('Ocurrió un error al conectarse al calendario'),
  inputValidation,
  GoogleAPIController.getEvents
)

router.delete('/events/:eventId',
  param('eventId').isMongoId().withMessage('Event ID not valid'),
  body('code').notEmpty().withMessage('Ocurrió un error al conectarse al calendario'),
  inputValidation,
  GoogleAPIController.deleteEvent
)

export default router