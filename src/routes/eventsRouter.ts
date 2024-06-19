import {Router} from 'express'
import EventsController from '../controllers/EventsController'
import { body } from 'express-validator'
import inputValidation from '../middleware/inputValidation'

const router = Router()

router.get('/',
    EventsController.getEvents
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
    inputValidation,
    EventsController.createEvent
)

export default router