import {Router} from 'express'
import EventsController from '../controllers/EventsController'
import { body, param } from 'express-validator'
import inputValidation from '../middleware/inputValidation'

const router = Router()

router.get('/',
    EventsController.getEvents
)

router.get('/:eventId',
    param('eventId').isMongoId().withMessage('Event id not valid'),
    inputValidation,
    EventsController.getEvent
)

router.post('/',
    body('summary').notEmpty().withMessage('Summary must not be empty'),
    body('start').custom(val => {
        if (typeof val === 'object' && val.dateTime) {
            return true
        }

        throw new Error('Invalid start object')
    }),
    body('end').custom(val => {
        if (typeof val === 'object' && val.dateTime) {
            return true
        }

        throw new Error('Invalid start object')
    }),
    body('attendees').custom(val => {
        if (Array.isArray(val) && val.length == 2) {
            return true
        }

        throw new Error('Attendees don\'t have the required properties')
    }),
    inputValidation,
    EventsController.createEvent
)

export default router