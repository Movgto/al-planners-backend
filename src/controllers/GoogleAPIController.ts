import type {Request, Response} from 'express'
import {auth2client} from '../config/googleapi'
import colors from 'colors'
import { handleInternalError } from '../helpers'
import Event from '../models/Event'
import { google } from 'googleapis'

let refreshToken = ''

const setCredentials = async (code: string) => {
  if (refreshToken !== '') {
    auth2client.setCredentials({
      refresh_token: refreshToken
    })
  } else {
    const {tokens} = await auth2client.getToken(code)
    refreshToken = tokens && tokens.refresh_token ? tokens.refresh_token : ''

    auth2client.setCredentials(tokens)

    console.log('====== Tokens ======')
    console.log(code)
    console.log(tokens)
    console.log('====== Calendar ID ======')
    console.log(process.env.CALENDAR_ID)        
  }
}

class GoogleAPIController {
  static getAuthUrl = (req: Request, res: Response) => {
    try {
      const url = auth2client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/calendar'
      })
  
      res.json({url})
    } catch (error) {
      const errorMessage = 'Something went wrong while trying to generate an auth url'
      handleInternalError(error, errorMessage, res)
    }
  }

  static getEvents = async (req: Request, res: Response) => {
    const {code} = req.query

    try {
      await setCredentials(code as string)

      const calendarAPI = google.calendar({version: 'v3', auth: auth2client})
      
      const events = await calendarAPI.events.list({
        calendarId: process.env.CALENDAR_ID,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      })

      res.json({events: events.data.items})
    } catch (error) {
      console.log(colors.bgMagenta('An error happened while trying to connect to Google Calendar API'))
      console.log(error)
      res.status(500).json({
        error: 'Hubo un problema al conectarse con el calendario de Google'
      })
    }
  }

  static syncEvents = async (req: Request, res: Response) => {
    const code: string = req.body.code

    console.log('====== Code from sync events method ======')
    console.log(code)

    try {
      const eventList = await Event.find({sentToCalendar: false})

      if (!eventList || !eventList.length) {
        return res.status(404).json({error: 'No hay eventos para sincronizar'})
      }      

      await setCredentials(code)

      const calendarAPI = google.calendar({version: 'v3', auth: auth2client})

      console.log('Calendar Id', process.env.CALENDAR_ID)

      for (const e of eventList) {

        const name1 = e.attendees[0].name.split(' ')[0]
        const name2 = e.attendees[1].name.split(' ')[0]
        
        await calendarAPI.events.insert({
          calendarId: process.env.CALENDAR_ID,
          auth: auth2client,                    
          requestBody: {
            summary: name1 + ' & ' + name2 + ' - ' + e.summary,
            description: 'Description test',
            start: {
              dateTime: e.start.dateTime,
              timeZone: 'America/Mexico_City'
            },
            end: {
              dateTime: e.end.dateTime,
              timeZone: 'America/Mexico_City'
            },
            id: e.id,
            attendees: e.attendees.map(at => ({
              displayName: at.name,
              email: at.email
            }))              
          }                       
        })

        e.sentToCalendar = true

        await e.save()
      }

      return res.send('Eventos sincronizados con éxito!')
      
    } catch (error) {      
      return handleInternalError(error, 'An error happened while trying to create an event', res)
    }

  }

  // static createEvent = async (req: Request, res: Response) => {
  //   const code = req.query.code as string
  //   const {eventId} = req.params

  //   try {
  //     const eventExists = await Event.findById(eventId)

  //     if (!eventExists) {
  //       return res.status(404).json({error: 'El evento que se desea sincronizar no fué encontrado'})
  //     }

  //     const { summary, start, end } = eventExists

  //     setCredentials(code)

  //     const calendarAPI = google.calendar({version: 'v3', auth: auth2client})

  //     await calendarAPI.events.insert({
  //       auth: auth2client,
  //       calendarId: process.env.CLIENT_ID,
  //       requestBody: {
  //         summary,
  //         start,
  //         end,          
  //       }
  //     })

  //   } catch (error) {      
  //     return handleInternalError(error, 'An error happened while trying to create an event', res)
  //   }
  // }

  static deleteEvent = async (req: Request, res: Response) => {
    const id = req.params.eventId as string
    const code = req.body.code as string
    
    try {

      const eventExists = await Event.findById(id)

      if (!eventExists) {
        return res.status(404).json({error: 'No se encontró el evento a eliminar'})
      }

      if (!eventExists.sentToCalendar) {
        console.log("Eliminando evento que aún no se envía al calendario de Google!")
        await eventExists.deleteOne()

        return res.send('El evento se eliminó correctamente!')
      }

      if (!code) {
        return res.status(400).json({error: 'Necesitas acceder con Google antes de eliminar un evento que ha sido sincronizado'})        
      }

      await setCredentials(code)

      const calendar = google.calendar({version: 'v3', auth: auth2client})

      await calendar.events.delete({
        auth: auth2client,
        calendarId: process.env.CALENDAR_ID,
        eventId: id
      })

      await eventExists.deleteOne()

      return res.send('El evento ha sido eliminado, también en el calendario de Google!')
    } catch (error) {
      return handleInternalError(error, 'Hubo un problema al intentar eliminar el evento', res)
    }
  }
}

export default GoogleAPIController