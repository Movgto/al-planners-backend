import type {Request, Response} from 'express'
import auth2client from '../config/googleapi'
import { google, calendar_v3 } from 'googleapis'
import colors from 'colors'
import { handleInternalError } from '../helpers'

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
      const {tokens} = await auth2client.getToken(code as string)
      
      auth2client.setCredentials(tokens)

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

  static createEvent = async (req: Request, res: Response) => {
    const {code} = req.query
    const event = req.body

    try {
      const {tokens} = await auth2client.getToken(code as string)

      auth2client.setCredentials(tokens)

      const calendarAPI = google.calendar({version: 'v3', auth: auth2client})

      await calendarAPI.events.insert({
        auth: auth2client,
        calendarId: process.env.CLIENT_ID,
        requestBody: event
      })

    } catch (error) {      
      handleInternalError(error, 'An error happened while trying to create an event', res)
    }
  }
}

export default GoogleAPIController