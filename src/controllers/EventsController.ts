import Event from "../models/Event"
import { Request, Response } from 'express'
import { getDateInTimezone, handleInternalError, isAvailabilityValid } from "../helpers"
import AvailabilityTime, { IAvailabilityTime } from "../models/AvailabilityTime"
import Admin from "../models/Admin"

class EventsController {
    static getEvents = async (req: Request, res: Response) => {
        try {
            const events = await Event.find().populate({
                path: 'admin',
                select: 'id email name'
            }).sort({ 'start.dateTime': 'asc' })

            res.json(events)
        } catch (error) {
            handleInternalError(error, 'Algo fallo al obtener los eventos', res)
        }
    }

    static getEvent = async (req: Request, res: Response) => {
        const { eventId } = req.params

        try {
            const eventExists = await Event.findById(eventId).populate({
                path: 'admin',
                select: 'id name email'
            })

            if (!eventExists) {
                return res.status(404).json({ error: 'Evento no encontrado' })
            }

            return res.json(eventExists)
        } catch (error) {
            return handleInternalError(error, 'Ocurrió un error al intentar obtener la cita', res)
        }
    }

    static createEvent = async (req: Request, res: Response) => {
        const event = req.body

        try {
            const adminExists = await Admin.findById(req.body.admin)

            if (!adminExists) {
                return res.status(400).json({error: "The admin was not found"})
            }

            const events = await Event.find({admin: adminExists.id})

            const newEvent = new Event(event)

            const newEventDate = getDateInTimezone(new Date(newEvent.start.dateTime))

            const newEventMonth = newEventDate.getMonth()

            const newEventYear = newEventDate.getFullYear()

            const newEventStartHour = newEventDate.getHours()

            const newEventEndHour = getDateInTimezone(new Date(newEvent.end.dateTime)).getHours()

            const eventsWithSameStartTimes = events.filter(e => e.start.dateTime === newEvent.start.dateTime)

            const availableTimes = (await AvailabilityTime.find()).filter(a => {
                const aDate = getDateInTimezone(new Date(a.startTime))
                const availableYear = aDate.getFullYear()
                const availableMonth = aDate.getMonth()                

                if (
                    newEventYear === availableYear &&
                    newEventMonth === availableMonth &&
                    aDate.getDate() === newEventDate.getDate()
                ) {
                    return true
                }

                return false
            })

            const availabilityTimeForNewEvent = {
                startTime: newEvent.start.dateTime,
                endTime: newEvent.end.dateTime
            }

            let isInAvailableTime = false

            if (availableTimes.length) {
                for (const a of availableTimes) {
                    if (!isAvailabilityValid(availabilityTimeForNewEvent as IAvailabilityTime, a)) {
                        isInAvailableTime = true
                        break
                    }
                }
            } else {
                return res.status(409).json({ error: 'No hay tiempo de disponibilidad para citas este día' })
            }

            if (!isInAvailableTime) {
                return res.status(409).json({ error: 'La cita que se intentó crear está fuera de los tiempos de disponibilidad' })
            }

            if (eventsWithSameStartTimes.length) {
                return res.status(409).json({ error: 'Ya hay una cita programada con la misma fecha y hora' })
            }

            let isInMiddleOfOtherEvent = false

            for (let e of events) {
                const eDate = getDateInTimezone(new Date(e.start.dateTime))

                if (eDate.getDate() === newEventDate.getDate()) {
                    const startHour = getDateInTimezone(new Date(e.start.dateTime)).getHours()
                    const endHour = getDateInTimezone(new Date(e.end.dateTime)).getHours()

                    if (
                        (newEventStartHour < startHour && newEventEndHour > startHour)
                        || (newEventStartHour < endHour && newEventEndHour > endHour)
                        || (startHour < newEventStartHour && endHour > newEventStartHour)
                        || (startHour < newEventEndHour && endHour > newEventEndHour)
                    ) {
                        isInMiddleOfOtherEvent = true
                        break
                    }
                }
            }

            if (isInMiddleOfOtherEvent) {
                return res.status(409).json({ error: 'La cita que estás intentando crear queda en medio del curso de otra cita programada' })
            }

            await newEvent.save()            

            return res.send('Nuevo evento creado exitosamente!\nRecuerda sincronizar tus eventos.')
        } catch (error) {
            return handleInternalError(error, 'Algo fallo al intentar crear un evento', res)
        }
    }
}

export default EventsController