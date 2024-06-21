import {Router} from 'express'
import { body, param } from 'express-validator'
import inputValidation from '../middleware/inputValidation'
import AvailabilityController from '../controllers/AvailabilityController'

const router = Router()

router.post('/',
  body('startTime').isISO8601().withMessage('Start time format is not valid'),
  body('endTime').isISO8601().withMessage('End time format is not valid'),
  inputValidation,
  AvailabilityController.createAvailableTime
)

router.get('/:date',
  param('date').isISO8601().withMessage('Date format not valid'),
  inputValidation,
  AvailabilityController.getAvailableTime
)

router.delete('/:availabilityId',
  param('availabilityId').isMongoId().withMessage('Invalid availability ID'),
  inputValidation,
  AvailabilityController.deleteAvailableTime
)

export default router