import {CorsOptions} from 'cors'

const corsConfig : CorsOptions = {
  origin: (origin, cb) => {
    const whitelist = [process.env.FRONTEND_URL]
    if (whitelist.includes(origin)) {
      cb(null, true)
    } else {
      cb(new Error('CORS error'), false)
    }
  }
}

export default corsConfig