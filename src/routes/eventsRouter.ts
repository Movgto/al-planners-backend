import {Router} from 'express'
import EventsController from '../controllers/EventsController'

const router = Router()

router.get('/',
    EventsController.getEvents
)

export default router