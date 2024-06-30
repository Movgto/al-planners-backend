import colors from 'colors'
import { Response } from 'express'
import { IAvailabilityTime } from '../models/AvailabilityTime'

export const handleInternalError = (error: unknown, errorMsg: string, res: Response) => {
    const err = new Error(errorMsg)
    console.log(colors.bgMagenta(err.message))
    console.log(error)
    res.status(500).json({ error: err.message })
}

export const dateFormater = (isoDate: string) => {
    const date = new Date(isoDate)
    const displayDate = new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'        
    }).format(date)
    return displayDate
}

export const formatHour = (hour: number) => {
    const timeOfDay = hour >= 12 ? 'pm' : 'am'

    const newHour = hour > 12 ? hour - 12 : hour

    return newHour + timeOfDay
}

export const getDateInTimezoneFromISO = (isoDate: string) => {
    return new Date(new Date(isoDate).toLocaleString('en-US', {timeZone: 'America/Mexico_City'}))
}

export const getDateInTimezone = (date: Date) => {
    return new Date(date.toLocaleString('en-US', {timeZone: 'America/Mexico_City'}))
}

export const isAvailabilityValid = (availability: IAvailabilityTime, availabilityToCompare: IAvailabilityTime) => {
    const newAvailabilityStartHour = getDateInTimezone(new Date(availability.startTime)).getHours()
    const newAvailabilityEndHour = getDateInTimezone(new Date(availability.endTime)).getHours()
    const availabilityStartHour = getDateInTimezone(new Date(availabilityToCompare.startTime)).getHours()
    const availabilityEndHour = getDateInTimezone(new Date(availabilityToCompare.endTime)).getHours()

    const differenceBetweenHours = Math.abs(newAvailabilityStartHour - newAvailabilityEndHour)

    console.log('====== Difference betweenhours ======')
    console.log(differenceBetweenHours)

    if (differenceBetweenHours < 1) return false

    if (newAvailabilityStartHour === availabilityStartHour) return false

    if (
        (newAvailabilityStartHour < availabilityStartHour && newAvailabilityEndHour > availabilityStartHour)
        || (newAvailabilityStartHour < availabilityEndHour && newAvailabilityEndHour > availabilityEndHour)
        || (availabilityStartHour < newAvailabilityStartHour && availabilityEndHour > newAvailabilityStartHour)
        || (availabilityStartHour < newAvailabilityEndHour && availabilityEndHour > newAvailabilityEndHour)
    ) {
        return false
    }

    return true
}