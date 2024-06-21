import {Router} from 'express'
import EventTypesController from '../controllers/EventTypesController'
import { body, param } from 'express-validator'
import inputValidation from '../middleware/inputValidation'

const router = Router()

router.get('/',
    EventTypesController.getEventTypes
)

router.post('/',
    body('name').notEmpty().withMessage('Name must not be empty'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('duration').custom(value => {
        if (+value < 0 || +value > 24) {
            throw new Error('La duracion debe ser entre 0 y 24')
        }

        return true
    }),
    inputValidation,
    EventTypesController.createEventType
)

router.delete('/:eventTypeId',
    param('eventTypeId').isMongoId().withMessage('Invlaid event type id'),
    inputValidation,
    EventTypesController.deleteEventType
)

export default router