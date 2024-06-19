import Event from "../models/Event"
import {Request, Response} from 'express'
import { handleInternalError } from "../helpers"
class EventsController {
    static getEvents = async (req: Request, res: Response) => {
        try {
            const events = await Event.find()

            res.json(events)
        } catch (error) {
            handleInternalError(error, 'Algo fallo al obtener los eventos', res)
        }
    }

    static createEvent = async (req: Request, res: Response) => {
        const event = req.body

        try {
            await Event.create(event)
            res.send('Nuevo evento creado exitosamente!\nRecuerda sincronizar tus eventos.')
        } catch (error) {
            handleInternalError(error, 'Algo fallo al intentar crear un evento', res)
        }
    }
}

export default EventsController