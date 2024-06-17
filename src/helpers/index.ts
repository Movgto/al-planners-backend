import colors from 'colors'
import {Response} from 'express'

export const handleInternalError = (error: unknown, errorMsg: string, res: Response) => {
    const err = new Error(errorMsg)
    console.log(colors.bgMagenta(err.message))
    console.log(error)
    res.status(500).json({error: err.message})
}