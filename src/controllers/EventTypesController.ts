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

            console.log(req)
            await EventType.create(req.body)
            
            res.send('Se creo un nuevo tipo de evento exitosamente!')
        } catch (error) {
            handleInternalError(error, 'Algo fallo al intentar crear un nuevo tipo de evento', res)
        }
    }

    static deleteEventType = async (req: Request, res: Response) => {
        const {eventTypeId} = req.params

        try {
            const eventTypeExists = await EventType.findById(eventTypeId)

            if (!eventTypeExists) {
                return res.status(404).json({error: 'Event type was not found in the database'})
            }

            await eventTypeExists.deleteOne()

            res.send('Tipo de evento eliminado exitosamente!')
        } catch (error) {
            handleInternalError(error, 'Algo falló al intentar eliminar el tipo de evento', res)
        }
    }
}

export default EventTypesController