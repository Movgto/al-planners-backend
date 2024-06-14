import type {Request, Response} from 'express'
import auth2client from '../config/googleapi'
import { google } from 'googleapis'

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
      console.log(errorMessage, error)
      res.status(500).json({error: errorMessage})
    }
  }

  static getEvents = async (req: Request, res: Response) => {
    const {code} = req.query

    try {
      const {tokens} = await auth2client.getToken(code as string)
      
      auth2client.setCredentials(tokens)

      const calendarAPI = google.calendar({version: 'v3', auth: auth2client})

      const calendar = await calendarAPI.calendarList.get({calendarId: process.env.CALENDAR_ID})

      res.json({calendar})
    } catch (error) {
      res.status(500).json({
        error: 'Hubo un problema al conectarse con el calendario de Google'
      })
    }
  }
}

export default GoogleAPIController