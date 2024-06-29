import {Request, Response} from 'express'
import AvailabilityTime, { IAvailabilityTime } from '../models/AvailabilityTime'
import { getDateInTimezone, getDateInTimezoneFromISO, handleInternalError, isAvailabilityValid } from '../helpers'
import colors from 'colors'

class AvailabilityController {

  static createAvailableTime = async (req: Request, res: Response) => {
    const {startTime, endTime} = req.body

    try {

      const date = new Date(startTime)

      const diffBetweenHrs = new Date(startTime).getHours() - new Date(endTime).getHours()

      const absDiffBetweenHrs = Math.abs(diffBetweenHrs)

      if (diffBetweenHrs > 0) {
        return res.status(400).json({error: 'El inicio de la disponibilidad no puede ser más tarde que el final'})
      }
      
      if (absDiffBetweenHrs < 1) {
        return res.status(400).json({error: 'El tiempo de disponibilidad debe ser de al menos 1 hora'})
      }

      const availableTimes = (await AvailabilityTime.find()).filter(a => {
        const aDate = new Date(a.startTime)

        if (date.getDate() === aDate.getDate()) {
          return true
        }

        return false
      })

      let availabilityConflict = false

      if (availableTimes.length) {
        console.log(colors.green('Buscando conflictos entre tiempos de disponibilidad'))
        console.log(availableTimes)
        for (const a of availableTimes) {
          if (!isAvailabilityValid(req.body as IAvailabilityTime, a)) {
            availabilityConflict = true
            break
          }
        }
      }

      if (availabilityConflict) {
        return res.status(409).json({error: 'El tiempo de disponibilidad que se intento crear está en conflicto con otro existente'})
      }    
      
      await AvailabilityTime.create({startTime, endTime})

      res.send('Tiempo de disponibilidad creado con éxito!')
    } catch (error) {
      handleInternalError(error, 'Algo falló al intentar crear el tiempo de disponibilidad', res)
    }
  }

  static getAvailableTime = async (req: Request, res: Response) => {
    const {date: isoDate} = req.params

    try {
      const date = new Date(new Date(isoDate).toLocaleString('en-US', {timeZone: 'America/Mexico_City'}))

      console.log('====== Fecha para buscar disponibilidad ======')
      console.log(date)

      const availableTimes = await AvailabilityTime.find().sort({
        "startTime": "asc"
      })

      
      const availableTimesArray = availableTimes.filter(a => {
        const aDate = getDateInTimezone(new Date(a.startTime))

        console.log('====== Fecha disponible hora de inicio ======')
        console.log(aDate)

        if (aDate.getDate() === date.getDate()) {          
          return true
        }

        return false
      })

      res.json(availableTimesArray)
    } catch (error) {
      handleInternalError(error, 'Algo falló al intentar obtener los tiempos de disponibilidad', res)
    }
  }

  static deleteAvailableTime = async (req: Request, res: Response) => {
    const {availabilityId} = req.params

    try {
      const availabilityExists = await AvailabilityTime.findById(availabilityId)

      if (!availabilityExists) {
        return res.status(404).json({error: 'No se encontro la disponibilidad que se intentaba eliminar'})
      }

      await availabilityExists.deleteOne()

      res.send('Disponibilidad eliminada exitósamente!')
    } catch (error) {
      handleInternalError(error, 'Algo falló al intentar eliminar la disponibilidad', res)
    }
  }

  static getAvailableTimes = async (req: Request, res: Response) => {
    const {date: isoDate} = req.params
    
    try {
        const date = getDateInTimezoneFromISO(isoDate)
        date.setHours(0,0,0,0)

        const availableTimes = await AvailabilityTime.find().sort({
          "startTime": "asc"
        })
        
        
        const filtered = availableTimes.filter(a => {
          const aDate = getDateInTimezone(new Date(a.startTime))
          if (aDate.getTime() < date.getTime()) return false

          return true
        })

        res.json(filtered)
    } catch (error) {
        handleInternalError(error, 'Algo falló al intentar obtener la disponibilidad', res)
    }
}
}

export default AvailabilityController