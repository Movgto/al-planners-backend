import { Request, Response } from 'express'
import AvailabilityTime, { IAvailabilityTime } from '../models/AvailabilityTime'
import { getDateInTimezone, getDateInTimezoneFromISO, handleInternalError, isAvailabilityValid } from '../helpers'
import colors from 'colors'

class AvailabilityController {

  static createAvailableTime = async (req: Request, res: Response) => {
    const { startTime, endTime } = req.body

    try {
      const date = getDateInTimezone(new Date(startTime))
      const month = date.getMonth()
      const year = date.getFullYear()

      const diffBetweenHrs = date.getHours() - getDateInTimezone(new Date(endTime)).getHours()

      const absDiffBetweenHrs = Math.abs(diffBetweenHrs)

      if (diffBetweenHrs > 0) {
        return res.status(400).json({ error: 'El inicio de la disponibilidad no puede ser más tarde que el final' })
      }

      if (absDiffBetweenHrs < 1) {
        return res.status(400).json({ error: 'El tiempo de disponibilidad debe ser de al menos 1 hora' })
      }

      const availableTimes = (await AvailabilityTime.find()).filter(a => {
        const aDate = getDateInTimezone(new Date(a.startTime))
        const monthOfAvailability = aDate.getMonth()
        const yearOfAvailability = aDate.getFullYear()

        if (date.getDate() === aDate.getDate() && monthOfAvailability === month && yearOfAvailability === year) {
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
        return res.status(409).json({ error: 'El tiempo de disponibilidad que se intento crear está en conflicto con otro existente' })
      }

      await AvailabilityTime.create({ startTime, endTime })

      return res.send('Tiempo de disponibilidad creado con éxito!')
    } catch (error) {
      return handleInternalError(error, 'Algo falló al intentar crear el tiempo de disponibilidad', res)
    }
  }

  static getAvailableTime = async (req: Request, res: Response) => {
    const { date: isoDate } = req.params

    try {
      const date = getDateInTimezone(new Date(isoDate))
      const monthToSearch = date.getMonth()
      const yearToSearch = date.getFullYear()

      console.log('====== Fecha para buscar disponibilidad ======')
      console.log(date)

      const availableTimes = await AvailabilityTime.find().sort({
        "startTime": "asc"
      })


      const availableTimesArray = availableTimes.filter(a => {
        const aDate = getDateInTimezone(new Date(a.startTime))
        const month = aDate.getMonth()
        const year = aDate.getFullYear()

        console.log('====== Fecha disponible hora de inicio ======')
        console.log(aDate)

        if (aDate.getDate() === date.getDate() && month === monthToSearch && yearToSearch === year) {
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
    const { availabilityId } = req.params

    try {
      const availabilityExists = await AvailabilityTime.findById(availabilityId)

      if (!availabilityExists) {
        return res.status(404).json({ error: 'No se encontro la disponibilidad que se intentaba eliminar' })
      }

      await availabilityExists.deleteOne()

      return res.send('Disponibilidad eliminada exitósamente!')
    } catch (error) {
      return handleInternalError(error, 'Algo falló al intentar eliminar la disponibilidad', res)
    }
  }

  static getAvailableTimes = async (req: Request, res: Response) => {
    const { date: isoDate } = req.params

    try {
      const date = getDateInTimezoneFromISO(isoDate)
      date.setHours(0, 0, 0, 0)

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