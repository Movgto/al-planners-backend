import type {Request, Response} from 'express'
import EventType from '../models/EventType'
import { handleInternalError } from '../helpers'

class EventTypesController {
    static getEventTypes = async (req: Request, res: Response) => {
        try {
            const eventTypes = await EventType.find()
            console.log('====== Event Types ======')
            console.log(eventTypes)
            res.json(eventTypes)
        } catch (error) {
            handleInternalError(error, 'Algo fallo al intentar obtener los tipos de eventos', res)
        }
    }

    static createEventType = async (req: Request, res: Response) => {
        try {
            await EventType.create(req.body)
            
            res.send('Se creo un nuevo tipo de evento exitosamente!')
        } catch (error) {
            handleInternalError(error, 'Algo fallo al intentar crear un nuevo tipo de evento', res)
        }
    }
}

export default EventTypesController